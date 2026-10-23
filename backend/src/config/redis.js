import Redis from 'ioredis';

// High-speed In-Memory Cache with TTL fallback (instant 0.05ms access)
const memoryCache = new Map();

// Local event ring buffer (preserves last 150 events in memory)
const eventLogBuffer = [];

let isRedisReady = false;
let redis = null;

try {
  redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    enableOfflineQueue: false, // CRITICAL: Never block or queue commands when Redis is offline
    connectTimeout: 500,       // Fast 500ms connection check, no 10-second hang
    maxRetriesPerRequest: 0,   // Fail immediately instead of stalling requests
    lazyConnect: true,         // Don't block module initialization
    retryStrategy(times) {
      // Exponential backoff up to 30s when offline, avoid spinning event loop
      return Math.min(times * 1000, 30000);
    }
  });

  redis.on('connect', () => {
    isRedisReady = true;
    console.log('[Redis] Connected successfully');
  });

  redis.on('ready', () => {
    isRedisReady = true;
  });

  redis.on('error', (err) => {
    isRedisReady = false;
    // Graceful warning without polluting logs or stalling app
    if (err.code !== 'ECONNREFUSED' && err.code !== 'NR_CLOSED') {
      console.warn('[Redis Info]', err.message);
    }
  });

  redis.on('close', () => {
    isRedisReady = false;
  });

  redis.on('end', () => {
    isRedisReady = false;
  });

  // Attempt non-blocking connection
  redis.connect().catch(() => {
    isRedisReady = false;
  });
} catch (e) {
  isRedisReady = false;
  console.warn('[Redis] Operating in high-speed In-Memory mode:', e.message);
}

// Timeout helper to ensure no operation ever blocks the Node.js event loop
const withTimeout = (promise, ms = 200) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timeout')), ms))
  ]);
};

export async function cacheGet(key) {
  // 1. If Redis is ready, try fast get
  if (isRedisReady && redis) {
    try {
      const raw = await withTimeout(redis.get(key), 150);
      if (raw) return JSON.parse(raw);
    } catch {
      // Redis missed or timed out, fall through to memory cache
    }
  }

  // 2. High-speed In-Memory Cache fallback
  const cached = memoryCache.get(key);
  if (cached) {
    if (Date.now() < cached.expiresAt) {
      return cached.value;
    }
    memoryCache.delete(key);
  }
  return null;
}

export async function cacheSet(key, value, ttl = 300) {
  // 1. Immediately store in Memory Cache
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttl * 1000
  });

  // 2. Asynchronously sync to Redis if ready (fire-and-forget, zero blocking)
  if (isRedisReady && redis) {
    withTimeout(redis.set(key, JSON.stringify(value), 'EX', ttl), 200).catch(() => {});
  }
}

export async function pushEvent(type, payload) {
  const event = { type, payload, timestamp: new Date().toISOString() };

  // Always buffer in memory for instant audit and queue inspection
  eventLogBuffer.unshift(event);
  if (eventLogBuffer.length > 150) {
    eventLogBuffer.pop();
  }

  // Fire-and-forget background Redis dispatch (never block HTTP request response)
  if (isRedisReady && redis) {
    Promise.allSettled([
      withTimeout(redis.lpush('events', JSON.stringify(event)), 200),
      withTimeout(redis.publish('events', JSON.stringify(event)), 200)
    ]).catch(() => {});
  }

  // Fire-and-forget webhook dispatch with 1000ms timeout
  const webhook = process.env.N8N_WEBHOOK_URL;
  if (webhook) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      signal: controller.signal
    }).catch(() => {}).finally(() => clearTimeout(timeout));
  }

  return { queued: true };
}

export { redis, isRedisReady, memoryCache, eventLogBuffer };
