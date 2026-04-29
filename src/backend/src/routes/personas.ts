/**
 * Persona Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all personas for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Persona } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const personas = await Persona.find({ companyId });
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get personas' });
  }
});

// Get personas by ICP
router.get('/icp/:icpId', async (req: Request, res: Response) => {
  try {
    const { icpId } = req.params;
    const { Persona } = getModels();

    const personas = await Persona.find({ icpId });

    // Check access for first persona's company
    if (personas.length > 0) {
      if (!req.user!.companyIds.includes(personas[0].companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
    }

    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get personas' });
  }
});

// Get single persona
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Persona } = getModels();

    const persona = await Persona.findById(id);
    if (!persona) {
      res.status(404).json({ error: 'Persona not found' });
      return;
    }

    if (!req.user!.companyIds.includes(persona.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get persona' });
  }
});

// Create persona
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().withMessage('Persona name is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('icpId').notEmpty().withMessage('ICP ID is required'),
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

      const { Persona } = getModels();
      const persona = Persona.create(req.body);
      await persona.save();

      res.status(201).json(persona);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create persona' });
    }
  }
);

// Update persona
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Persona } = getModels();

    const persona = await Persona.findById(id);
    if (!persona) {
      res.status(404).json({ error: 'Persona not found' });
      return;
    }

    if (!req.user!.companyIds.includes(persona.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(persona, req.body, { updatedAt: new Date().toISOString() });
    await persona.save();

    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update persona' });
  }
});

// Delete persona
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Persona } = getModels();

    const persona = await Persona.findById(id);
    if (!persona) {
      res.status(404).json({ error: 'Persona not found' });
      return;
    }

    if (!req.user!.companyIds.includes(persona.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Persona.findByIdAndDelete(id);
    res.json({ message: 'Persona deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete persona' });
  }
});

export default router;
