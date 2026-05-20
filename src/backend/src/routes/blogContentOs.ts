/**
 * Blog Content OS Routes
 *
 * Unified route for all blog content operating system entities.
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BlogContentOS } from '../models/BlogContentOS';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

// Helper to get or create company data
const getCompanyData = async (companyId: string) => {
  let data = await BlogContentOS.findOne({ companyId });
  if (!data) {
    data = new BlogContentOS({ companyId });
    await data.save();
  }
  return data;
};

// ============== STRATEGIES ==============

router.get('/strategies/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    res.json(data.strategies || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get strategies' });
  }
});

router.get('/strategies/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'strategies.id': id });
    if (!data) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }
    const strategy = data.strategies.find((s: any) => s.id === id);
    res.json(strategy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get strategy' });
  }
});

router.post('/strategies', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    const strategy = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.strategies.push(strategy);
    await data.save();
    res.status(201).json(strategy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create strategy' });
  }
});

router.put('/strategies/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'strategies.id': id });
    if (!data) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }
    const index = data.strategies.findIndex((s: any) => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }
    data.strategies[index] = { ...data.strategies[index], ...req.body, updatedAt: new Date().toISOString() };
    await data.save();
    res.json(data.strategies[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update strategy' });
  }
});

router.delete('/strategies/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'strategies.id': id });
    if (!data) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }
    data.strategies = data.strategies.filter((s: any) => s.id !== id);
    await data.save();
    res.json({ message: 'Strategy deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete strategy' });
  }
});

// ============== CALENDARS ==============

router.get('/calendars/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    res.json(data.calendars || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get calendars' });
  }
});

router.get('/calendars/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'calendars.id': id });
    if (!data) {
      res.status(404).json({ error: 'Calendar not found' });
      return;
    }
    const calendar = data.calendars.find((c: any) => c.id === id);
    res.json(calendar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get calendar' });
  }
});

router.post('/calendars', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    const calendar = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.calendars.push(calendar);
    await data.save();
    res.status(201).json(calendar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create calendar' });
  }
});

router.put('/calendars/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'calendars.id': id });
    if (!data) {
      res.status(404).json({ error: 'Calendar not found' });
      return;
    }
    const index = data.calendars.findIndex((c: any) => c.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Calendar not found' });
      return;
    }
    data.calendars[index] = { ...data.calendars[index], ...req.body, updatedAt: new Date().toISOString() };
    await data.save();
    res.json(data.calendars[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update calendar' });
  }
});

router.delete('/calendars/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'calendars.id': id });
    if (!data) {
      res.status(404).json({ error: 'Calendar not found' });
      return;
    }
    data.calendars = data.calendars.filter((c: any) => c.id !== id);
    await data.save();
    res.json({ message: 'Calendar deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete calendar' });
  }
});

// ============== SEO CONFIGS ==============

router.get('/seo-configs/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    res.json(data.seoConfigs || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get SEO configs' });
  }
});

router.get('/seo-configs/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'seoConfigs.id': id });
    if (!data) {
      res.status(404).json({ error: 'SEO config not found' });
      return;
    }
    const seoConfig = data.seoConfigs.find((s: any) => s.id === id);
    res.json(seoConfig);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get SEO config' });
  }
});

router.post('/seo-configs', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    const seoConfig = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.seoConfigs.push(seoConfig);
    await data.save();
    res.status(201).json(seoConfig);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create SEO config' });
  }
});

router.put('/seo-configs/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'seoConfigs.id': id });
    if (!data) {
      res.status(404).json({ error: 'SEO config not found' });
      return;
    }
    const index = data.seoConfigs.findIndex((s: any) => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'SEO config not found' });
      return;
    }
    data.seoConfigs[index] = {
      ...data.seoConfigs[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await data.save();
    res.json(data.seoConfigs[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update SEO config' });
  }
});

router.delete('/seo-configs/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'seoConfigs.id': id });
    if (!data) {
      res.status(404).json({ error: 'SEO config not found' });
      return;
    }
    data.seoConfigs = data.seoConfigs.filter((s: any) => s.id !== id);
    await data.save();
    res.json({ message: 'SEO config deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete SEO config' });
  }
});

// ============== TITLES ==============

router.get('/titles/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    res.json(data.titles || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get titles' });
  }
});

router.get('/titles/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'titles.id': id });
    if (!data) {
      res.status(404).json({ error: 'Title not found' });
      return;
    }
    const title = data.titles.find((t: any) => t.id === id);
    res.json(title);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get title' });
  }
});

router.post('/titles', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    const title = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.titles.push(title);
    await data.save();
    res.status(201).json(title);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create title' });
  }
});

router.put('/titles/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'titles.id': id });
    if (!data) {
      res.status(404).json({ error: 'Title not found' });
      return;
    }
    const index = data.titles.findIndex((t: any) => t.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Title not found' });
      return;
    }
    data.titles[index] = { ...data.titles[index], ...req.body, updatedAt: new Date().toISOString() };
    await data.save();
    res.json(data.titles[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update title' });
  }
});

router.delete('/titles/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'titles.id': id });
    if (!data) {
      res.status(404).json({ error: 'Title not found' });
      return;
    }
    data.titles = data.titles.filter((t: any) => t.id !== id);
    await data.save();
    res.json({ message: 'Title deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete title' });
  }
});

// ============== POSTS ==============

router.get('/posts/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    res.json(data.posts || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

router.get('/posts/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'posts.id': id });
    if (!data) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    const post = data.posts.find((p: any) => p.id === id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get post' });
  }
});

router.post('/posts', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    const post = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.posts.push(post);
    await data.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.put('/posts/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'posts.id': id });
    if (!data) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    const index = data.posts.findIndex((p: any) => p.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    data.posts[index] = { ...data.posts[index], ...req.body, updatedAt: new Date().toISOString() };
    await data.save();
    res.json(data.posts[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

router.delete('/posts/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'posts.id': id });
    if (!data) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    data.posts = data.posts.filter((p: any) => p.id !== id);
    await data.save();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// ============== CHUNKS ==============

router.get('/chunks/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    res.json(data.chunks || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chunks' });
  }
});

router.get('/chunks/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'chunks.id': id });
    if (!data) {
      res.status(404).json({ error: 'Chunk not found' });
      return;
    }
    const chunk = data.chunks.find((c: any) => c.id === id);
    res.json(chunk);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chunk' });
  }
});

router.post('/chunks', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    const chunk = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.chunks.push(chunk);
    await data.save();
    res.status(201).json(chunk);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chunk' });
  }
});

router.put('/chunks/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'chunks.id': id });
    if (!data) {
      res.status(404).json({ error: 'Chunk not found' });
      return;
    }
    const index = data.chunks.findIndex((c: any) => c.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Chunk not found' });
      return;
    }
    data.chunks[index] = { ...data.chunks[index], ...req.body, updatedAt: new Date().toISOString() };
    await data.save();
    res.json(data.chunks[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update chunk' });
  }
});

router.delete('/chunks/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'chunks.id': id });
    if (!data) {
      res.status(404).json({ error: 'Chunk not found' });
      return;
    }
    data.chunks = data.chunks.filter((c: any) => c.id !== id);
    await data.save();
    res.json({ message: 'Chunk deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chunk' });
  }
});

// ============== EXPORTS ==============

router.get('/exports/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    res.json(data.exports || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get exports' });
  }
});

router.get('/exports/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'exports.id': id });
    if (!data) {
      res.status(404).json({ error: 'Export not found' });
      return;
    }
    const exportItem = data.exports.find((e: any) => e.id === id);
    res.json(exportItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get export' });
  }
});

router.post('/exports', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    const exportItem = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.exports.push(exportItem);
    await data.save();
    res.status(201).json(exportItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create export' });
  }
});

router.put('/exports/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'exports.id': id });
    if (!data) {
      res.status(404).json({ error: 'Export not found' });
      return;
    }
    const index = data.exports.findIndex((e: any) => e.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Export not found' });
      return;
    }
    data.exports[index] = { ...data.exports[index], ...req.body, updatedAt: new Date().toISOString() };
    await data.save();
    res.json(data.exports[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update export' });
  }
});

router.delete('/exports/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'exports.id': id });
    if (!data) {
      res.status(404).json({ error: 'Export not found' });
      return;
    }
    data.exports = data.exports.filter((e: any) => e.id !== id);
    await data.save();
    res.json({ message: 'Export deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete export' });
  }
});

// ============== STRUCTURES ==============

router.get('/structures/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    res.json(data.structures || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get structures' });
  }
});

router.get('/structures/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'structures.id': id });
    if (!data) {
      res.status(404).json({ error: 'Structure not found' });
      return;
    }
    const structure = data.structures.find((s: any) => s.id === id);
    res.json(structure);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get structure' });
  }
});

router.post('/structures', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    const structure = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.structures.push(structure);
    await data.save();
    res.status(201).json(structure);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create structure' });
  }
});

router.put('/structures/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'structures.id': id });
    if (!data) {
      res.status(404).json({ error: 'Structure not found' });
      return;
    }
    const index = data.structures.findIndex((s: any) => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Structure not found' });
      return;
    }
    data.structures[index] = { ...data.structures[index], ...req.body, updatedAt: new Date().toISOString() };
    await data.save();
    res.json(data.structures[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update structure' });
  }
});

router.delete('/structures/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'structures.id': id });
    if (!data) {
      res.status(404).json({ error: 'Structure not found' });
      return;
    }
    data.structures = data.structures.filter((s: any) => s.id !== id);
    await data.save();
    res.json({ message: 'Structure deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete structure' });
  }
});

// ============== CONTENT SECTIONS ==============

router.get('/content-sections/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    res.json(data.contentSections || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get content sections' });
  }
});

router.get('/content-sections/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'contentSections.id': id });
    if (!data) {
      res.status(404).json({ error: 'Content section not found' });
      return;
    }
    const section = data.contentSections.find((s: any) => s.id === id);
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get content section' });
  }
});

router.post('/content-sections', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    const section = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.contentSections.push(section);
    await data.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create content section' });
  }
});

router.put('/content-sections/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'contentSections.id': id });
    if (!data) {
      res.status(404).json({ error: 'Content section not found' });
      return;
    }
    const index = data.contentSections.findIndex((s: any) => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Content section not found' });
      return;
    }
    data.contentSections[index] = { ...data.contentSections[index], ...req.body, updatedAt: new Date().toISOString() };
    await data.save();
    res.json(data.contentSections[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content section' });
  }
});

router.delete('/content-sections/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BlogContentOS.findOne({ 'contentSections.id': id });
    if (!data) {
      res.status(404).json({ error: 'Content section not found' });
      return;
    }
    data.contentSections = data.contentSections.filter((s: any) => s.id !== id);
    await data.save();
    res.json({ message: 'Content section deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content section' });
  }
});

export default router;
