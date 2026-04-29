/**
 * Generic Module Data Routes
 * For dynamic modules that don't have specific routes
 */

import express, { Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

// Generic Module Data Schema
interface IModuleData extends Document {
  moduleId: string;
  companyId: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleDataSchema = new Schema<IModuleData>({
  moduleId: { type: String, required: true, index: true },
  companyId: { type: String, required: true, index: true },
  data: { type: Schema.Types.Mixed, required: true },
}, {
  timestamps: true,
});

ModuleDataSchema.index({ moduleId: 1, companyId: 1 }, { unique: true });

const ModuleData = mongoose.model<IModuleData>('ModuleData', ModuleDataSchema);

router.use(authenticate);

// Get module data for a company
router.get('/:moduleId/:companyId', async (req: Request, res: Response) => {
  try {
    const { moduleId, companyId } = req.params;

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const data = await ModuleData.findOne({ moduleId, companyId });
    res.json(data?.data || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to get module data' });
  }
});

// Save module data
router.post(
  '/:moduleId',
  requireRole('admin', 'editor'),
  async (req: Request, res: Response) => {
    try {
      const { moduleId } = req.params;
      const { companyId, data } = req.body;

      if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const moduleData = await ModuleData.findOneAndUpdate(
        { moduleId, companyId },
        { moduleId, companyId, data },
        { upsert: true, new: true }
      );

      res.json(moduleData.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save module data' });
    }
  }
);

// Delete module data
router.delete('/:moduleId/:companyId', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { moduleId, companyId } = req.params;

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await ModuleData.findOneAndDelete({ moduleId, companyId });
    res.json({ message: 'Module data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete module data' });
  }
});

export default router;
