/**
 * Stationery Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all stationery for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Stationery } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const items = await Stationery.find({ companyId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stationery' });
  }
});

// Get single stationery
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Stationery } = getModels();

    const item = await Stationery.findById(id);
    if (!item) {
      res.status(404).json({ error: 'Stationery not found' });
      return;
    }

    if (!req.user!.companyIds.includes(item.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stationery' });
  }
});

// Create stationery
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().withMessage('Stationery name is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('type').notEmpty().withMessage('Stationery type is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.user!.companyIds.includes(req.body.companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const { Stationery } = getModels();
      const item = new Stationery(req.body);
      await item.save();

      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create stationery' });
    }
  }
);

// Update stationery
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Stationery } = getModels();

    const item = await Stationery.findById(id);
    if (!item) {
      res.status(404).json({ error: 'Stationery not found' });
      return;
    }

    if (!req.user!.companyIds.includes(item.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(item, req.body, { updatedAt: new Date().toISOString() });
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stationery' });
  }
});

// Delete stationery
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Stationery } = getModels();

    const item = await Stationery.findById(id);
    if (!item) {
      res.status(404).json({ error: 'Stationery not found' });
      return;
    }

    if (!req.user!.companyIds.includes(item.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Stationery.findByIdAndDelete(id);
    res.json({ message: 'Stationery deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stationery' });
  }
});

export default router;
