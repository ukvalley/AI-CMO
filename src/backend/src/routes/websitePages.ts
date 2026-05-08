/**
 * Website Page Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all pages for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { WebsitePage } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const pages = await WebsitePage.find({ companyId }).sort({ order: 1, createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get website pages' });
  }
});

// Get single page
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { WebsitePage } = getModels();

    const page = await WebsitePage.findById(id);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    if (!req.user!.companyIds.includes(page.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get page' });
  }
});

// Create page
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('title').trim().notEmpty().withMessage('Page title is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
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

      const { WebsitePage } = getModels();

      // Check for duplicate slug
      const existing = await WebsitePage.findOne({
        companyId: req.body.companyId,
        slug: req.body.slug,
      });
      if (existing) {
        res.status(400).json({ error: 'A page with this slug already exists' });
        return;
      }

      const page = new WebsitePage(req.body);
      await page.save();

      res.status(201).json(page);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create page' });
    }
  }
);

// Update page
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { WebsitePage } = getModels();

    const page = await WebsitePage.findById(id);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    if (!req.user!.companyIds.includes(page.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Check for duplicate slug if changing slug
    if (req.body.slug && req.body.slug !== page.slug) {
      const existing = await WebsitePage.findOne({
        companyId: page.companyId,
        slug: req.body.slug,
        _id: { $ne: id },
      });
      if (existing) {
        res.status(400).json({ error: 'A page with this slug already exists' });
        return;
      }
    }

    Object.assign(page, req.body, { updatedAt: new Date().toISOString() });
    await page.save();

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// Delete page
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { WebsitePage } = getModels();

    const page = await WebsitePage.findById(id);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    if (!req.user!.companyIds.includes(page.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await WebsitePage.findByIdAndDelete(id);
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

export default router;
