/**
 * ICP (Ideal Customer Profile) Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all ICPs for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { ICP } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const icps = await ICP.find({ companyId });
    res.json(icps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get ICPs' });
  }
});

// Get single ICP
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ICP } = getModels();

    const icp = await ICP.findById(id);
    if (!icp) {
      res.status(404).json({ error: 'ICP not found' });
      return;
    }

    if (!req.user!.companyIds.includes(icp.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(icp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get ICP' });
  }
});

// Create ICP
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().withMessage('ICP name is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('isActive').optional().isBoolean(),
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

      const { ICP } = getModels();
      const icp = ICP.create({
        ...req.body,
        isActive: req.body.isActive ?? true,
      });
      await icp.save();

      res.status(201).json(icp);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create ICP' });
    }
  }
);

// Update ICP
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ICP } = getModels();

    const icp = await ICP.findById(id);
    if (!icp) {
      res.status(404).json({ error: 'ICP not found' });
      return;
    }

    if (!req.user!.companyIds.includes(icp.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(icp, req.body, { updatedAt: new Date().toISOString() });
    await icp.save();

    res.json(icp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ICP' });
  }
});

// Delete ICP
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ICP } = getModels();

    const icp = await ICP.findById(id);
    if (!icp) {
      res.status(404).json({ error: 'ICP not found' });
      return;
    }

    if (!req.user!.companyIds.includes(icp.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await ICP.findByIdAndDelete(id);
    res.json({ message: 'ICP deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ICP' });
  }
});

export default router;
