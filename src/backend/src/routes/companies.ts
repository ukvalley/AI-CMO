/**
 * Company Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth';
import { getModels } from '../models';

const router = express.Router();

router.use(authenticate);

// Get all companies for current user
router.get('/', async (req: Request, res: Response) => {
  try {
    const { Company } = getModels();
    const companies = await Company.find({
      _id: { $in: req.user!.companyIds },
    });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get companies' });
  }
});

// Get single company
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { Company } = getModels();
    const { id } = req.params;

    if (!req.user!.companyIds.includes(id) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const company = await Company.findById(id);
    if (!company) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get company' });
  }
});

// Create company
router.post(
  '/',
  requireRole('admin', 'editor'),
  [body('name').trim().notEmpty().withMessage('Company name is required')],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { User, Company } = getModels();

      const company = new Company({
        ...req.body,
        userIds: [req.user!.id],
      });

      await company.save();

      // Add company to user's company list
      req.user!.companyIds.push(company.id);
      await req.user!.save();

      res.status(201).json(company);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create company' });
    }
  }
);

// Update company
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { Company } = getModels();
    const { id } = req.params;

    if (!req.user!.companyIds.includes(id) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const company = await Company.findById(id);
    if (!company) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    Object.assign(company, req.body, { updatedAt: new Date().toISOString() });
    await company.save();

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete company
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { User, Company } = getModels();
    const { id } = req.params;

    if (!req.user!.companyIds.includes(id) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Company.findByIdAndDelete(id);

    // Remove from user's company list
    req.user!.companyIds = req.user!.companyIds.filter((cid) => cid !== id);
    await req.user!.save();

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

export default router;
