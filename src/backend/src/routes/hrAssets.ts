/**
 * HR Asset Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all HR assets for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { HRAsset } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const items = await HRAsset.find({ companyId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get HR assets' });
  }
});

// Get single HR asset
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { HRAsset } = getModels();

    const item = await HRAsset.findById(id);
    if (!item) {
      res.status(404).json({ error: 'HR asset not found' });
      return;
    }

    if (!req.user!.companyIds.includes(item.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get HR asset' });
  }
});

// Create HR asset
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().withMessage('Asset name is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('type').notEmpty().withMessage('Asset type is required'),
    body('category').notEmpty().withMessage('Category is required'),
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

      const { HRAsset } = getModels();
      const item = new HRAsset(req.body);
      await item.save();

      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create HR asset' });
    }
  }
);

// Update HR asset
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { HRAsset } = getModels();

    const item = await HRAsset.findById(id);
    if (!item) {
      res.status(404).json({ error: 'HR asset not found' });
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
    res.status(500).json({ error: 'Failed to update HR asset' });
  }
});

// Delete HR asset
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { HRAsset } = getModels();

    const item = await HRAsset.findById(id);
    if (!item) {
      res.status(404).json({ error: 'HR asset not found' });
      return;
    }

    if (!req.user!.companyIds.includes(item.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await HRAsset.findByIdAndDelete(id);
    res.json({ message: 'HR asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete HR asset' });
  }
});

// Bulk upload HR assets
router.post('/bulk', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { items, companyId } = req.body;
    const { HRAsset } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const assets = items.map((item: any) => ({
      ...item,
      companyId,
    }));

    const result = await HRAsset.insertMany(assets);
    res.status(201).json({ message: 'Bulk upload successful', count: result.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to bulk upload HR assets' });
  }
});

export default router;
