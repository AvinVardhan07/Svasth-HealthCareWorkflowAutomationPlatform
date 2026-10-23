import { connectDB } from '../config/database.js';
import { pushEvent } from '../config/redis.js';

export const createNotification = async (db, message, email) => {
  const notification = { message, email, createdAt: new Date().toISOString() };
  await db.collection('notifications').insertOne(notification);
  pushEvent('notification.created', notification).catch(() => {});
  return notification;
};

export const createMultipleNotifications = async (db, messages, email) => {
  if (!messages || messages.length === 0) return [];
  const now = new Date().toISOString();
  const docs = messages.map((msg) => ({
    message: msg,
    email,
    createdAt: now
  }));
  await db.collection('notifications').insertMany(docs);
  docs.forEach((doc) => {
    pushEvent('notification.created', doc).catch(() => {});
  });
  return docs;
};

export const getNotifications = async (email) => {
  const db = await connectDB();
  const query = email ? { email } : {};
  return db.collection('notifications').find(query).sort({ createdAt: -1 }).limit(100).toArray();
};
