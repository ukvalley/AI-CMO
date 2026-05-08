/**
 * Blog Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all blogs for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Blog } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const blogs = await Blog.find({ companyId }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blogs' });
  }
});

// Get single blog
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Blog } = getModels();

    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    if (!req.user!.companyIds.includes(blog.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blog' });
  }
});

// Create blog
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('title').trim().notEmpty().withMessage('Blog title is required'),
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

      const { Blog } = getModels();

      // Check for duplicate slug
      const existing = await Blog.findOne({
        companyId: req.body.companyId,
        slug: req.body.slug,
      });
      if (existing) {
        res.status(400).json({ error: 'A blog with this slug already exists' });
        return;
      }

      const blog = new Blog(req.body);
      await blog.save();

      res.status(201).json(blog);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create blog' });
    }
  }
);

// Update blog
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Blog } = getModels();

    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    if (!req.user!.companyIds.includes(blog.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Check for duplicate slug if changing slug
    if (req.body.slug && req.body.slug !== blog.slug) {
      const existing = await Blog.findOne({
        companyId: blog.companyId,
        slug: req.body.slug,
        _id: { $ne: id },
      });
      if (existing) {
        res.status(400).json({ error: 'A blog with this slug already exists' });
        return;
      }
    }

    Object.assign(blog, req.body, { updatedAt: new Date().toISOString() });
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// Delete blog
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Blog } = getModels();

    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    if (!req.user!.companyIds.includes(blog.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Blog.findByIdAndDelete(id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

export default router;
