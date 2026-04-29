/**
 * Authentication Middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getModels, IUser } from '../models';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      token?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Authenticate JWT token from header
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const { User } = getModels();
      const user = await User.findById(decoded.userId);

      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      req.user = user;
      req.token = token;
      next();
    } catch (jwtError) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

/**
 * Check if user has required role
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

/**
 * Check if user belongs to company
 */
export const requireCompanyAccess = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const companyId = req.params.companyId || req.body.companyId || req.query.companyId;

  if (!companyId) {
    res.status(400).json({ error: 'Company ID required' });
    return;
  }

  if (!req.user.companyIds.includes(companyId) && req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied for this company' });
    return;
  }

  next();
};
