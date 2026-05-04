/**
 * Brand Asset Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all assets for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { BrandAsset } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const assets = await BrandAsset.find({ companyId }).sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get brand assets' });
  }
});

// Get single asset
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { BrandAsset } = getModels();

    const asset = await BrandAsset.findById(id);
    if (!asset) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }

    if (!req.user!.companyIds.includes(asset.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get asset' });
  }
});

// Create asset
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().withMessage('Asset name is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('type').notEmpty().withMessage('Asset type is required'),
    body('format').notEmpty().withMessage('Format is required'),
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

      const { BrandAsset } = getModels();

      // If setting as primary, unset other primary assets of same type
      if (req.body.isPrimary) {
        await BrandAsset.updateMany(
          { companyId: req.body.companyId, type: req.body.type },
          { isPrimary: false }
        );
      }

      const asset = new BrandAsset(req.body);
      await asset.save();

      res.status(201).json(asset);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create brand asset' });
    }
  }
);

// Update asset
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { BrandAsset } = getModels();

    const asset = await BrandAsset.findById(id);
    if (!asset) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }

    if (!req.user!.companyIds.includes(asset.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // If setting as primary, unset other primary assets of same type
    if (req.body.isPrimary && !asset.isPrimary) {
      await BrandAsset.updateMany(
        { companyId: asset.companyId, type: asset.type, _id: { $ne: id } },
        { isPrimary: false }
      );
    }

    Object.assign(asset, req.body, { updatedAt: new Date().toISOString() });
    await asset.save();

    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

// Delete asset
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { BrandAsset } = getModels();

    const asset = await BrandAsset.findById(id);
    if (!asset) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }

    if (!req.user!.companyIds.includes(asset.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await BrandAsset.findByIdAndDelete(id);
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

export default router;
