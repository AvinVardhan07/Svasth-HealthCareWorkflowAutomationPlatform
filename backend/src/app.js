import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import { connectDB } from './config/database.js';
import { cacheGet, cacheSet, pushEvent } from './config/redis.js';
import { createNotification, createMultipleNotifications, getNotifications } from './services/notifications.js';
import { seedDoctors, seedDefaultUser } from './services/seed.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const generateQrCode = () => `SVASTH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const serializeAppointment = (item) => ({
  ...item,
  id: item._id ? item._id.toString() : item.id
});

app.get('/api/health', async (req, res) => {
  try {
    const db = await connectDB();
    await db.command({ ping: 1 });
    res.json({ status: 'ok', message: 'SVASTH backend is running and MongoDB is connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  try {
    const db = await connectDB();
    const existing = await db.collection('users').findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const user = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone ? phone.trim() : '',
      role: 'patient',
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('users').insertOne(user);
    user._id = result.insertedId;

    // Asynchronously dispatch notifications and pub/sub events
    createNotification(db, `Welcome ${name}! Your SVASTH account is ready.`, user.email).catch(() => {});
    pushEvent('user.registered', user).catch(() => {});

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const db = await connectDB();
    const user = await db.collection('users').findOne({
      email: email.toLowerCase().trim(),
      password
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    pushEvent('user.login', { email: user.email, userId: user._id ? user._id.toString() : null }).catch(() => {});
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  try {
    const db = await connectDB();
    const user = await db.collection('users').findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'No account found for that email' });
    }
    const tempCode = generateQrCode();
    createNotification(db, `A temporary recovery code ${tempCode} was generated for ${email}.`, email).catch(() => {});
    res.json({ message: `Temporary reset code generated: ${tempCode}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/doctors', async (req, res) => {
  try {
    const cached = await cacheGet('doctors');
    if (cached) return res.json(cached);

    const db = await connectDB();
    const doctors = await db.collection('doctors').find({}).toArray();
    await cacheSet('doctors', doctors, 60 * 60);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  const { email } = req.query;
  try {
    const db = await connectDB();
    const query = email ? { patientEmail: email.toLowerCase().trim() } : {};
    const appointments = await db.collection('appointments').find(query).sort({ createdAt: -1 }).toArray();
    res.json(appointments.map(serializeAppointment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { doctorId, patientName, patientEmail, patientPhone, date, slot, reason } = req.body;
  try {
    const db = await connectDB();
    const doctor = await db.collection('doctors').findOne({ id: Number(doctorId) });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const cleanEmail = (patientEmail || '').toLowerCase().trim();
    const appointment = {
      doctorId,
      doctorName: doctor.name,
      patientName: (patientName || 'Patient').trim(),
      patientEmail: cleanEmail,
      patientPhone: patientPhone || '',
      date,
      slot,
      reason,
      status: 'confirmed',
      qrCode: generateQrCode(),
      reminderStatus: 'scheduled',
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('appointments').insertOne(appointment);
    appointment._id = result.insertedId;
    const createdAppointment = serializeAppointment(appointment);

    // Batch database insert of notifications & async publish without delaying HTTP response
    createMultipleNotifications(db, [
      `Appointment confirmed with ${doctor.name} on ${date} at ${slot}.`,
      `WhatsApp confirmation sent to ${patientPhone || 'registered phone'}.`,
      `Email confirmation sent to ${cleanEmail}.`
    ], cleanEmail).catch(() => {});

    pushEvent('appointment.created', createdAppointment).catch(() => {});

    res.json({
      success: true,
      message: 'Appointment booked successfully and confirmation sent.',
      appointment: createdAppointment,
      qrCode: appointment.qrCode,
      confirmation: { email: cleanEmail, whatsapp: patientPhone || 'registered phone' }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/appointments/:id/checkin', async (req, res) => {
  try {
    const db = await connectDB();
    const appointment = await db.collection('appointments').findOne({ _id: new ObjectId(req.params.id) });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await db.collection('appointments').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: 'checked-in', checkedInAt: new Date().toISOString() } }
    );

    const updated = serializeAppointment({ ...appointment, status: 'checked-in' });

    // Non-blocking notifications & event stream push
    createNotification(db, `Patient ${appointment.patientName} checked in successfully.`, appointment.patientEmail).catch(() => {});
    pushEvent('appointment.checkedin', updated).catch(() => {});

    res.json({ success: true, appointment: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/appointments/:id/complete', async (req, res) => {
  try {
    const db = await connectDB();
    const appointment = await db.collection('appointments').findOne({ _id: new ObjectId(req.params.id) });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await db.collection('appointments').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: 'completed', completedAt: new Date().toISOString() } }
    );

    const updated = serializeAppointment({ ...appointment, status: 'completed' });

    // Non-blocking notifications & event stream push
    createNotification(db, `Consultation completed for ${appointment.patientName}.`, appointment.patientEmail).catch(() => {});
    pushEvent('appointment.completed', updated).catch(() => {});

    res.json({ success: true, appointment: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/notifications', async (req, res) => {
  const { email } = req.query;
  try {
    const cleanEmail = email ? email.toLowerCase().trim() : null;
    const notifications = await getNotifications(cleanEmail);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/queue', async (req, res) => {
  try {
    const db = await connectDB();
    const appointments = await db.collection('appointments')
      .find({ status: { $ne: 'completed' } })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(appointments.map(serializeAppointment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/assistant', (req, res) => {
  const { message = '' } = req.body;
  const lower = message.toLowerCase();
  let reply = 'I can help you with your booking, reminders, QR check-in flow, and doctor schedules.';

  if (lower.includes('book') || lower.includes('schedule') || lower.includes('appointment')) {
    reply = 'To book an appointment, select your preferred doctor, pick an available date & time slot on your dashboard, and tap "Confirm booking".';
  } else if (lower.includes('qr') || lower.includes('code')) {
    reply = 'A unique digital QR code (e.g. SVASTH-XXXXXX) is instantly generated once your appointment is confirmed. Simply present this at the reception desk for touchless check-in.';
  } else if (lower.includes('check in') || lower.includes('checkin') || lower.includes('arrive')) {
    reply = 'You can check in instantly by tapping the "Check in" button on your appointment card, or by having the reception desk scan your digital QR code.';
  } else if (lower.includes('reminder') || lower.includes('notification')) {
    reply = 'Automated reminders are dispatched across Email and WhatsApp. You will receive confirmations and schedule alerts automatically.';
  } else if (lower.includes('doctor') || lower.includes('specialist') || lower.includes('cardiologist')) {
    reply = 'We have specialists across Cardiology, Neurology, Pediatrics, Orthopedics, and General Medicine. Search and view their profiles directly from the "Find a doctor" section.';
  } else if (lower.includes('time') || lower.includes('hour') || lower.includes('slot')) {
    reply = 'Standard OPD consultation slots run from 09:00 AM to 05:00 PM Monday through Saturday. Emergency services are open 24/7.';
  }

  res.json({ reply });
});

app.get('/api/stats', async (req, res) => {
  try {
    const db = await connectDB();
    const [totalAppointments, confirmed, completed] = await Promise.all([
      db.collection('appointments').countDocuments({}),
      db.collection('appointments').countDocuments({ status: 'confirmed' }),
      db.collection('appointments').countDocuments({ status: 'completed' })
    ]);
    res.json({ totalAppointments, confirmed, completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, async () => {
  try {
    const db = await connectDB();
    await seedDoctors(db);
    await seedDefaultUser(db);
    console.log(`SVASTH high-speed backend listening on port ${port}`);
  } catch (error) {
    console.error('MongoDB startup error:', error.message);
  }
});
