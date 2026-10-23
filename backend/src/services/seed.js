import { connectDB } from '../config/database.js';
import { cacheSet } from '../config/redis.js';

const initialDoctors = [
  { id: 1, name: 'Dr. Asha Rao', specialty: 'Cardiology', experience: '12 years', availability: 'Today • 4:00 PM', location: 'North Wing', consultationType: 'In-person + Video' },
  { id: 2, name: 'Dr. Rahul Mehta', specialty: 'Neurology', experience: '9 years', availability: 'Tomorrow • 10:30 AM', location: 'East Wing', consultationType: 'In-person' },
  { id: 3, name: 'Dr. Priya Singh', specialty: 'Pediatrics', experience: '7 years', availability: 'Today • 6:15 PM', location: 'West Wing', consultationType: 'In-person' }
];

export const seedDoctors = async (db) => {
  const count = await db.collection('doctors').countDocuments();
  if (count === 0) {
    await db.collection('doctors').insertMany(initialDoctors);
    try { await cacheSet('doctors', initialDoctors, 60 * 60); } catch (e) { }
  }
};

export const seedDefaultUser = async (db) => {
  const count = await db.collection('users').countDocuments();
  if (count === 0) {
    await db.collection('users').insertOne({ name: 'Aditi Sharma', email: 'aditi@example.com', password: 'password123', phone: '9876543210', role: 'patient' });
  }
};
