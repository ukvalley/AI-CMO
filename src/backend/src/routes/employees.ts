/**
 * Employee Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all employees for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Employee } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const employees = await Employee.find({ companyId });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get employees' });
  }
});

// Get single employee
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Employee } = getModels();

    const employee = await Employee.findById(id);
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    if (!req.user!.companyIds.includes(employee.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get employee' });
  }
});

// Create employee
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().withMessage('Employee name is required'),
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

      const { Employee } = getModels();
      const employee = new Employee(req.body);
      await employee.save();

      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create employee' });
    }
  }
);

// Update employee
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Employee } = getModels();

    const employee = await Employee.findById(id);
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    if (!req.user!.companyIds.includes(employee.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(employee, req.body, { updatedAt: new Date().toISOString() });
    await employee.save();

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Employee } = getModels();

    const employee = await Employee.findById(id);
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    if (!req.user!.companyIds.includes(employee.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Employee.findByIdAndDelete(id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;
