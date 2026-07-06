import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

export async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db('svasth');
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('appointments').createIndex({ qrCode: 1 }, { unique: true, sparse: true });
  await db.collection('notifications').createIndex({ createdAt: -1 });
  return db;
}

export async function closeDB() {
  await client.close();
  db = null;
}
