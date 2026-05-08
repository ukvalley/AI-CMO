/**
 * Redis Connection
 */

import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redis: Redis | null = null;

/**
 * Connect to Redis
 */
export const connectRedis = async (): Promise<Redis> => {
  if (redis) return redis;

  redis = new Redis(REDIS_URL, {
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  redis.on('error', (err) => {
    console.error('Redis error:', err);
  });

  redis.on('connect', () => {
    console.log('Redis client connected');
  });

  return redis;
};

/**
 * Get Redis instance
 */
export const getRedis = (): Redis => {
  if (!redis) {
    throw new Error('Redis not connected. Call connectRedis() first.');
  }
  return redis;
};

/**
 * Cache data with expiration
 */
export const cacheSet = async (key: string, value: any, ttlSeconds: number = 3600): Promise<void> => {
  const client = getRedis();
  await client.setex(key, ttlSeconds, JSON.stringify(value));
};

/**
 * Get cached data
 */
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  const client = getRedis();
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

/**
 * Delete cached data
 */
export const cacheDelete = async (key: string): Promise<void> => {
  const client = getRedis();
  await client.del(key);
};

/**
 * Clear cache by pattern
 */
export const cacheClearPattern = async (pattern: string): Promise<void> => {
  const client = getRedis();
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(...keys);
  }
};
