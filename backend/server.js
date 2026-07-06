import express from 'express';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import { connectDB } from './mongo.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const initialDoctors = [
  { id: 1, name: 'Dr. Asha Rao', specialty: 'Cardiology', experience: '12 years', availability: 'Today • 4:00 PM', location: 'North Wing', consultationType: 'In-person + Video' },
  { id: 2, name: 'Dr. Rahul Mehta', specialty: 'Neurology', experience: '9 years', availability: 'Tomorrow • 10:30 AM', location: 'East Wing', consultationType: 'In-person' },
  { id: 3, name: 'Dr. Priya Singh', specialty: 'Pediatrics', experience: '7 years', availability: 'Today • 6:15 PM', location: 'West Wing', consultationType: 'In-person' }
];

const generateQrCode = () => `SVASTH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const createNotification = async (db, message, email) => {
  const notification = { message, email, createdAt: new Date().toISOString() };
  await db.collection('notifications').insertOne(notification);
  return notification;
};

const serializeAppointment = (item) => ({
  ...item,
  id: item._id ? item._id.toString() : item.id
});

const seedDoctors = async (db) => {
  const count = await db.collection('doctors').countDocuments();
  if (count === 0) {
    await db.collection('doctors').insertMany(initialDoctors);
  }
};

const seedDefaultUser = async (db) => {
  const count = await db.collection('users').countDocuments();
  if (count === 0) {
    await db.collection('users').insertOne({ name: 'Aditi Sharma', email: 'aditi@example.com', password: 'password123', phone: '9876543210', role: 'patient' });
  }
};

app.get('/api/health', async (req, res) => {
  try {
    const db = await connectDB();
    await db.collection('users').findOne({});
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
    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const user = { name, email, password, phone, role: 'patient', createdAt: new Date().toISOString() };
    const result = await db.collection('users').insertOne(user);
    user._id = result.insertedId;
    await createNotification(db, `Welcome ${name}! Your SVASTH account is ready.`, email);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectDB();
    const user = await db.collection('users').findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const db = await connectDB();
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found for that email' });
    }
    const tempCode = `SVASTH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    await createNotification(db, `A temporary code ${tempCode} was sent to ${email}.`, email);
    res.json({ message: `Temporary reset code generated: ${tempCode}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/doctors', async (req, res) => {
  try {
    const db = await connectDB();
    const doctors = await db.collection('doctors').find({}).toArray();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  const { email } = req.query;
  try {
    const db = await connectDB();
    const query = email ? { patientEmail: email } : {};
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

    const appointment = {
      doctorId,
      doctorName: doctor.name,
      patientName,
      patientEmail,
      patientPhone,
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
    await createNotification(db, `Appointment confirmed with ${doctor.name} on ${date} at ${slot}.`, patientEmail);
    await createNotification(db, `WhatsApp confirmation sent to ${patientPhone || 'registered number'}.`, patientEmail);
    await createNotification(db, `Email confirmation sent to ${patientEmail}.`, patientEmail);

    res.json({
      success: true,
      message: 'Appointment booked successfully and confirmation sent.',
      appointment: createdAppointment,
      qrCode: appointment.qrCode,
      confirmation: { email: patientEmail, whatsapp: patientPhone || 'registered number' }
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
    await db.collection('appointments').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: 'checked-in' } });
    await createNotification(db, `Patient ${appointment.patientName} checked in successfully.`, appointment.patientEmail);
    res.json({ success: true, appointment: serializeAppointment({ ...appointment, status: 'checked-in' }) });
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
    await db.collection('appointments').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: 'completed' } });
    await createNotification(db, `Consultation completed for ${appointment.patientName}.`, appointment.patientEmail);
    res.json({ success: true, appointment: serializeAppointment({ ...appointment, status: 'completed' }) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/notifications', async (req, res) => {
  const { email } = req.query;
  try {
    const db = await connectDB();
    const query = email ? { email } : {};
    const notifications = await db.collection('notifications').find(query).sort({ createdAt: -1 }).toArray();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/queue', async (req, res) => {
  try {
    const db = await connectDB();
    const appointments = await db.collection('appointments').find({ status: { $ne: 'completed' } }).toArray();
    res.json(appointments.map(serializeAppointment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/assistant', (req, res) => {
  const { message } = req.body;
  const lower = message.toLowerCase();
  let reply = 'I can help you with your booking, reminders, and check-in flow.';
  if (lower.includes('book')) reply = 'You can book from the dashboard by selecting a doctor, date, and time slot.';
  else if (lower.includes('reminder')) reply = 'Reminders are automatically scheduled after appointment confirmation.';
  else if (lower.includes('qr')) reply = 'Your QR code is generated after booking and can be used at the reception desk.';
  else if (lower.includes('check')) reply = 'Use the reception page or your dashboard to confirm your arrival.';
  res.json({ reply });
});

app.get('/api/stats', async (req, res) => {
  try {
    const db = await connectDB();
    const appointments = await db.collection('appointments').find({}).toArray();
    res.json({
      totalAppointments: appointments.length,
      confirmed: appointments.filter((appointment) => appointment.status === 'confirmed').length,
      completed: appointments.filter((appointment) => appointment.status === 'completed').length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, async () => {
  try {
    const db = await connectDB();
    await seedDoctors(db);
    await seedDefaultUser(db);
    console.log(`SVASTH backend listening on port ${port}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
});
