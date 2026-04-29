/**
 * Founder Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all founders for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Founder } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const founders = await Founder.find({ companyId });
    res.json(founders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get founders' });
  }
});

// Get single founder
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Founder } = getModels();

    const founder = await Founder.findById(id);
    if (!founder) {
      res.status(404).json({ error: 'Founder not found' });
      return;
    }

    if (!req.user!.companyIds.includes(founder.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(founder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get founder' });
  }
});

// Create founder
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().withMessage('Founder name is required'),
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
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const { Founder } = getModels();
      const founder = Founder.create(req.body);
      await founder.save();

      res.status(201).json(founder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create founder' });
    }
  }
);

// Update founder
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Founder } = getModels();

    const founder = await Founder.findById(id);
    if (!founder) {
      res.status(404).json({ error: 'Founder not found' });
      return;
    }

    if (!req.user!.companyIds.includes(founder.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(founder, req.body, { updatedAt: new Date().toISOString() });
    await founder.save();

    res.json(founder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update founder' });
  }
});

// Delete founder
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Founder } = getModels();

    const founder = await Founder.findById(id);
    if (!founder) {
      res.status(404).json({ error: 'Founder not found' });
      return;
    }

    if (!req.user!.companyIds.includes(founder.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Founder.findByIdAndDelete(id);
    res.json({ message: 'Founder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete founder' });
  }
});

export default router;
