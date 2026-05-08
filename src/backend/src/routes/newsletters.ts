/**
 * Newsletter Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all newsletters for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Newsletter } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const newsletters = await Newsletter.find({ companyId }).sort({ createdAt: -1 });
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get newsletters' });
  }
});

// Get single newsletter
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Newsletter } = getModels();

    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
      res.status(404).json({ error: 'Newsletter not found' });
      return;
    }

    if (!req.user!.companyIds.includes(newsletter.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(newsletter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get newsletter' });
  }
});

// Create newsletter
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().withMessage('Newsletter name is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
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

      const { Newsletter } = getModels();
      const newsletter = new Newsletter(req.body);
      await newsletter.save();

      res.status(201).json(newsletter);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create newsletter' });
    }
  }
);

// Update newsletter
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Newsletter } = getModels();

    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
      res.status(404).json({ error: 'Newsletter not found' });
      return;
    }

    if (!req.user!.companyIds.includes(newsletter.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(newsletter, req.body, { updatedAt: new Date().toISOString() });
    await newsletter.save();

    res.json(newsletter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update newsletter' });
  }
});

// Delete newsletter
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Newsletter } = getModels();

    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
      res.status(404).json({ error: 'Newsletter not found' });
      return;
    }

    if (!req.user!.companyIds.includes(newsletter.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Newsletter.findByIdAndDelete(id);
    res.json({ message: 'Newsletter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete newsletter' });
  }
});

export default router;
