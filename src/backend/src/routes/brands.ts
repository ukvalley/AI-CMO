/**
 * Brand Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get brand for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Brand } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const brand = await Brand.findOne({ companyId });

    if (!brand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get brand' });
  }
});

// Create brand
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('companyId').notEmpty().withMessage('Company ID is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.user!.companyIds.includes(req.body.companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied for this company' });
        return;
      }

      const { Brand } = getModels();

      // Check if brand already exists
      const existing = await Brand.findOne({ companyId: req.body.companyId });
      if (existing) {
        res.status(400).json({ error: 'Brand already exists for this company' });
        return;
      }

      const brand = new Brand(req.body);
      await brand.save();

      res.status(201).json(brand);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create brand' });
    }
  }
);

// Update brand
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Brand } = getModels();

    const brand = await Brand.findById(id);
    if (!brand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }

    if (!req.user!.companyIds.includes(brand.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(brand, req.body, { updatedAt: new Date().toISOString() });
    await brand.save();

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update brand' });
  }
});

// Delete brand
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Brand } = getModels();

    const brand = await Brand.findById(id);
    if (!brand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }

    if (!req.user!.companyIds.includes(brand.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Brand.findByIdAndDelete(id);

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete brand' });
  }
});

export default router;
