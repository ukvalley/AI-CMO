/**
 * Rate Limiter Middleware
 */

import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';

// Use memory-based rate limiter when Redis is not available
const createRateLimiter = (points: number, duration: number) => {
  try {
    // Try Redis first (if available)
    const { getRedis } = require('../utils/redis');
    const redis = getRedis();

    return new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: 'middleware',
      points,
      duration,
    });
  } catch (error) {
    // Fallback to memory-based limiter
    return new RateLimiterMemory({
      keyPrefix: 'middleware',
      points,
      duration,
    });
  }
};

const generalLimiter = createRateLimiter(100, 60); // 100 requests per minute

export const rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const key = req.ip || 'unknown';
    await generalLimiter.consume(key);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Please try again later'
    });
  }
};

// Strict rate limiter for auth endpoints
const authLimiter = createRateLimiter(5, 60); // 5 requests per minute

export const authRateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const key = req.ip || 'unknown';
    await authLimiter.consume(key);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Please try again in a minute'
    });
  }
};
