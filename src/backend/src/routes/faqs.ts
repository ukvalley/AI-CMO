/**
 * FAQ Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all FAQs for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { FAQ } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const faqs = await FAQ.find({ companyId }).sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get FAQs' });
  }
});

// Get single FAQ
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { FAQ } = getModels();

    const faq = await FAQ.findById(id);
    if (!faq) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }

    if (!req.user!.companyIds.includes(faq.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get FAQ' });
  }
});

// Create FAQ
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('answer').trim().notEmpty().withMessage('Answer is required'),
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

      const { FAQ } = getModels();
      const faq = new FAQ(req.body);
      await faq.save();

      res.status(201).json(faq);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create FAQ' });
    }
  }
);

// Update FAQ
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { FAQ } = getModels();

    const faq = await FAQ.findById(id);
    if (!faq) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }

    if (!req.user!.companyIds.includes(faq.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(faq, req.body, { updatedAt: new Date().toISOString() });
    await faq.save();

    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// Delete FAQ
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { FAQ } = getModels();

    const faq = await FAQ.findById(id);
    if (!faq) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }

    if (!req.user!.companyIds.includes(faq.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await FAQ.findByIdAndDelete(id);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

export default router;
