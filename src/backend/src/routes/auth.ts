/**
 * Authentication Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { generateToken, authenticate } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { getModels } from '../models';

const router = express.Router();

// Register
router.post(
  '/register',
  authRateLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { User, Company } = getModels();
      const { email, password, name, companyName } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'User already exists' });
        return;
      }

      // Create user
      const user = User.create({
        email,
        passwordHash: password,
        name,
        role: 'admin',
        companyIds: [],
      });

      await user.save();

      // Create default company
      const company = Company.create({
        name: companyName?.trim() || `${name}'s Company`,
        userIds: [user.id],
        isActive: true,
      });

      await company.save();

      // Update user with company
      user.companyIds = [company.id];
      user.activeCompanyId = company.id;
      await user.save();

      const token = generateToken(user.id);

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyIds: user.companyIds,
          activeCompanyId: user.activeCompanyId,
        },
        company: {
          id: company.id,
          name: company.name,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login
router.post(
  '/login',
  authRateLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { User, Company } = getModels();
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = generateToken(user.id);

      // Get user's companies
      const companies = await Company.find({
        _id: { $in: user.companyIds },
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyIds: user.companyIds,
          activeCompanyId: user.activeCompanyId,
        },
        companies: companies.map((c: any) => ({
          id: c.id,
          name: c.name,
          isActive: c.isActive,
        })),
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const { Company } = getModels();
    const companies = await Company.find({
      _id: { $in: req.user!.companyIds },
    });

    res.json({
      user: {
        id: req.user!.id,
        email: req.user!.email,
        name: req.user!.name,
        role: req.user!.role,
        companyIds: req.user!.companyIds,
        activeCompanyId: req.user!.activeCompanyId,
        avatar: req.user!.avatar,
      },
      companies: companies.map((c: any) => ({
        id: c.id,
        name: c.name,
        isActive: c.isActive,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Switch active company
router.post(
  '/switch-company',
  authenticate,
  [body('companyId').notEmpty().withMessage('Company ID is required')],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { companyId } = req.body;

      // Verify user has access to this company
      if (!req.user!.companyIds.includes(companyId)) {
        res.status(403).json({ error: 'Access denied for this company' });
        return;
      }

      req.user!.activeCompanyId = companyId;
      await req.user!.save();

      res.json({
        message: 'Company switched successfully',
        activeCompanyId: companyId,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to switch company' });
    }
  }
);

export default router;
