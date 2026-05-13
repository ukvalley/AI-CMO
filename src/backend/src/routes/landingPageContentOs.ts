/**
 * Landing Page Content OS Routes
 *
 * Unified route for all landing page operating system entities.
 */

import express, { Request, Response } from 'express';
import { LandingPageContentOS } from '../models/LandingPageContentOS';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

// Helper to get or create company data
const getCompanyData = async (companyId: string) => {
  let data = await LandingPageContentOS.findOne({ companyId });
  if (!data) {
    data = new LandingPageContentOS({ companyId });
    await data.save();
  }
  return data;
};

// ============== PAGES ==============

router.get('/pages/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    res.json(data.pages || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pages' });
  }
});

router.get('/pages/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await LandingPageContentOS.findOne({ 'pages.id': id });
    if (!data) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    const page = data.pages.find((s: any) => s.id === id);
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get page' });
  }
});

router.post('/pages', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    const page = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.pages.push(page);
    await data.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create page' });
  }
});

router.put('/pages/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await LandingPageContentOS.findOne({ 'pages.id': id });
    if (!data) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    const index = data.pages.findIndex((s: any) => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    data.pages[index] = { ...data.pages[index], ...req.body, updatedAt: new Date().toISOString() };
    await data.save();
    res.json(data.pages[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update page' });
  }
});

router.delete('/pages/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await LandingPageContentOS.findOne({ 'pages.id': id });
    if (!data) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    data.pages = data.pages.filter((s: any) => s.id !== id);
    await data.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// ============== TEMPLATES ==============

router.get('/templates/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    res.json(data.templates || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get templates' });
  }
});

router.get('/templates/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await LandingPageContentOS.findOne({ 'templates.id': id });
    if (!data) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    const template = data.templates.find((s: any) => s.id === id);
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get template' });
  }
});

router.post('/templates', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = await getCompanyData(companyId);
    const template = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.templates.push(template);
    await data.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template' });
  }
});

router.put('/templates/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await LandingPageContentOS.findOne({ 'templates.id': id });
    if (!data) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    const index = data.templates.findIndex((s: any) => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    data.templates[index] = { ...data.templates[index], ...req.body, updatedAt: new Date().toISOString() };
    await data.save();
    res.json(data.templates[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template' });
  }
});

router.delete('/templates/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await LandingPageContentOS.findOne({ 'templates.id': id });
    if (!data) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    data.templates = data.templates.filter((s: any) => s.id !== id);
    await data.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template' });
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
    const data = await LandingPageContentOS.findOne({ 'exports.id': id });
    if (!data) {
      res.status(404).json({ error: 'Export not found' });
      return;
    }
    const exp = data.exports.find((s: any) => s.id === id);
    res.json(exp);
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
    const exp = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.exports.push(exp);
    await data.save();
    res.status(201).json(exp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create export' });
  }
});

router.put('/exports/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await LandingPageContentOS.findOne({ 'exports.id': id });
    if (!data) {
      res.status(404).json({ error: 'Export not found' });
      return;
    }
    const index = data.exports.findIndex((s: any) => s.id === id);
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

router.delete('/exports/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await LandingPageContentOS.findOne({ 'exports.id': id });
    if (!data) {
      res.status(404).json({ error: 'Export not found' });
      return;
    }
    data.exports = data.exports.filter((s: any) => s.id !== id);
    await data.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete export' });
  }
});

export default router;
