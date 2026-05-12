/**
 * Redis Connection
 */

import Redis from 'ioredis';

function getRedisUrl(): string {
  return process.env.REDIS_URL || 'redis://localhost:6379';
}

let redis: Redis | null = null;
let redisConnected = false;

/**
 * Connect to Redis
 */
export const connectRedis = async (): Promise<Redis | null> => {
  if (redis && redisConnected) return redis;

  return new Promise((resolve) => {
    const client = new Redis(getRedisUrl(), {
      retryStrategy: (times) => {
        if (times > 3) {
          // Stop retrying after 3 attempts
          console.log('⚠️  Redis unavailable — running without cache');
          return null; // Stop retrying
        }
        return Math.min(times * 200, 1000);
      },
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });

    client.on('error', () => {
      // Suppress individual error logs, retryStrategy handles it
    });

    client.on('connect', () => {
      redisConnected = true;
      redis = client;
      console.log('✅ Redis connected');
    });

    client.on('close', () => {
      redisConnected = false;
    });

    client.connect().then(() => {
      resolve(client);
    }).catch(() => {
      // Redis unavailable — continue without it
      resolve(null);
    });
  });
};

/**
 * Get Redis instance (null if unavailable)
 */
export const getRedis = (): Redis | null => {
  return redisConnected ? redis : null;
};

/**
 * Cache data with expiration
 */
export const cacheSet = async (key: string, value: any, ttlSeconds: number = 3600): Promise<void> => {
  const client = getRedis();
  if (!client) return;
  await client.setex(key, ttlSeconds, JSON.stringify(value));
};

/**
 * Get cached data
 */
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  const client = getRedis();
  if (!client) return null;
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

/**
 * Delete cached data
 */
export const cacheDelete = async (key: string): Promise<void> => {
  const client = getRedis();
  if (!client) return;
  await client.del(key);
};

/**
 * Clear cache by pattern
 */
export const cacheClearPattern = async (pattern: string): Promise<void> => {
  const client = getRedis();
  if (!client) return;
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(...keys);
  }
};
