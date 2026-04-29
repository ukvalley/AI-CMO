/**
 * Competitor Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all competitors for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Competitor } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const competitors = await Competitor.find({ companyId });
    res.json(competitors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get competitors' });
  }
});

// Get single competitor
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Competitor } = getModels();

    const competitor = await Competitor.findById(id);
    if (!competitor) {
      res.status(404).json({ error: 'Competitor not found' });
      return;
    }

    if (!req.user!.companyIds.includes(competitor.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(competitor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get competitor' });
  }
});

// Create competitor
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().withMessage('Competitor name is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('threatLevel')
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Invalid threat level'),
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

      const { Competitor } = getModels();
      const competitor = Competitor.create(req.body);
      await competitor.save();

      res.status(201).json(competitor);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create competitor' });
    }
  }
);

// Update competitor
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Competitor } = getModels();

    const competitor = await Competitor.findById(id);
    if (!competitor) {
      res.status(404).json({ error: 'Competitor not found' });
      return;
    }

    if (!req.user!.companyIds.includes(competitor.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(competitor, req.body, { updatedAt: new Date().toISOString() });
    await competitor.save();

    res.json(competitor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update competitor' });
  }
});

// Delete competitor
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Competitor } = getModels();

    const competitor = await Competitor.findById(id);
    if (!competitor) {
      res.status(404).json({ error: 'Competitor not found' });
      return;
    }

    if (!req.user!.companyIds.includes(competitor.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Competitor.findByIdAndDelete(id);
    res.json({ message: 'Competitor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete competitor' });
  }
});

export default router;
