import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, {
  maxPoolSize: 20,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 3000
});

let db = null;
let connectingPromise = null;

export async function connectDB() {
  if (db) return db;
  if (connectingPromise) return connectingPromise;

  connectingPromise = (async () => {
    try {
      await client.connect();
      const database = client.db('svasth');
      
      // Initialize indices once without blocking critical queries
      Promise.allSettled([
        database.collection('users').createIndex({ email: 1 }, { unique: true }),
        database.collection('appointments').createIndex({ qrCode: 1 }, { unique: true, sparse: true }),
        database.collection('appointments').createIndex({ patientEmail: 1, createdAt: -1 }),
        database.collection('appointments').createIndex({ status: 1 }),
        database.collection('notifications').createIndex({ createdAt: -1 }),
        database.collection('notifications').createIndex({ email: 1, createdAt: -1 })
      ]).catch(() => {});

      db = database;
      return db;
    } catch (err) {
      connectingPromise = null;
      throw err;
    }
  })();

  return connectingPromise;
}

export async function closeDB() {
  if (client) {
    await client.close();
  }
  db = null;
  connectingPromise = null;
}
