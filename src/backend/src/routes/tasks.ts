/**
 * Background Task Routes
 */

import express, { Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

export type TaskStatus = 'running' | 'completed' | 'failed' | 'cancelled';

export interface ITaskResult {
  batchIndex: number;
  items: string[];
  status: TaskStatus;
  error?: string;
  completedAt?: Date;
}

export interface IBackgroundTask extends Document {
  name: string;
  companyId: string;
  moduleId: string;
  totalItems: number;
  completedItems: number;
  status: TaskStatus;
  results: ITaskResult[];
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BackgroundTaskSchema = new Schema<IBackgroundTask>({
  name: { type: String, required: true },
  companyId: { type: String, required: true, index: true },
  moduleId: { type: String, required: true, index: true },
  totalItems: { type: Number, default: 0 },
  completedItems: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['running', 'completed', 'failed', 'cancelled'],
    default: 'running',
  },
  results: [{
    batchIndex: Number,
    items: [String],
    status: {
      type: String,
      enum: ['running', 'completed', 'failed', 'cancelled'],
    },
    error: String,
    completedAt: Date,
  }],
  error: String,
}, {
  timestamps: true,
});

BackgroundTaskSchema.index({ companyId: 1, status: 1 });

const BackgroundTask = mongoose.model<IBackgroundTask>('BackgroundTask', BackgroundTaskSchema);

router.use(authenticate);

// Get all tasks for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const tasks = await BackgroundTask.find({ companyId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Get task by ID
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await BackgroundTask.findById(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (!req.user!.companyIds.includes(task.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get task' });
  }
});

// Create new task
router.post(
  '/',
  requireRole('admin', 'editor'),
  async (req: Request, res: Response) => {
    try {
      const { name, companyId, moduleId, totalItems } = req.body;

      if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const task = new BackgroundTask({
        name,
        companyId,
        moduleId,
        totalItems,
        completedItems: 0,
        status: 'running',
        results: [],
      });

      await task.save();

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
);

// Update task progress
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await BackgroundTask.findById(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (!req.user!.companyIds.includes(task.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const { completedItems, status, results, error } = req.body;

    if (completedItems !== undefined) task.completedItems = completedItems;
    if (status) task.status = status;
    if (results) task.results = results;
    if (error) task.error = error;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Cancel task
router.post('/:id/cancel', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await BackgroundTask.findById(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (!req.user!.companyIds.includes(task.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    task.status = 'cancelled';
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel task' });
  }
});

// Delete task
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await BackgroundTask.findById(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (!req.user!.companyIds.includes(task.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await BackgroundTask.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
