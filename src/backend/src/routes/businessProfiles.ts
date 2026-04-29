/**
 * Business Profile Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireCompanyAccess, requireRole } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get business profile for a company
router.get('/:companyId', requireCompanyAccess, async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { BusinessProfile } = getModels();

    const profile = await BusinessProfile.findOne({ companyId });

    if (!profile) {
      res.status(404).json({ error: 'Business profile not found' });
      return;
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get business profile' });
  }
});

// Create business profile
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('name').trim().notEmpty().withMessage('Business name is required'),
    body('stage')
      .isIn(['idea', 'mvp', 'early', 'growth', 'scale', 'established'])
      .withMessage('Invalid business stage'),
    body('industries').isArray().withMessage('Industries must be an array'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      // Verify user has access to this company
      if (!req.user!.companyIds.includes(req.body.companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied for this company' });
        return;
      }

      const { BusinessProfile } = getModels();

      // Check if profile already exists
      const existing = await BusinessProfile.findOne({ companyId: req.body.companyId });
      if (existing) {
        res.status(400).json({ error: 'Business profile already exists for this company' });
        return;
      }

      const profile = BusinessProfile.create(req.body);
      await profile.save();

      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create business profile' });
    }
  }
);

// Update business profile
router.put(
  '/:id',
  requireRole('admin', 'editor'),
  [body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { BusinessProfile } = getModels();

      const profile = await BusinessProfile.findById(id);
      if (!profile) {
        res.status(404).json({ error: 'Business profile not found' });
        return;
      }

      // Verify user has access
      if (!req.user!.companyIds.includes(profile.companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      Object.assign(profile, req.body, { updatedAt: new Date().toISOString() });
      await profile.save();

      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update business profile' });
    }
  }
);

// Delete business profile
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { BusinessProfile } = getModels();

    const profile = await BusinessProfile.findById(id);
    if (!profile) {
      res.status(404).json({ error: 'Business profile not found' });
      return;
    }

    // Verify user has access
    if (!req.user!.companyIds.includes(profile.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await BusinessProfile.findByIdAndDelete(id);

    res.json({ message: 'Business profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete business profile' });
  }
});

export default router;
