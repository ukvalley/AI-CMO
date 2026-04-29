/**
 * User Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Get all users (admin only)
router.get('/', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get current user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update current user profile
router.put(
  '/profile',
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const allowedUpdates = ['name', 'email', 'avatar'];
      const updates: any = {};

      allowedUpdates.forEach((key) => {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      });

      Object.assign(req.user!, updates);
      await req.user!.save();

      res.json({
        id: req.user!._id,
        email: req.user!.email,
        name: req.user!.name,
        role: req.user!.role,
        avatar: req.user!.avatar,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

// Change password
router.put(
  '/change-password',
  requireRole('admin', 'editor'),
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      const isMatch = await req.user!.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(401).json({ error: 'Current password is incorrect' });
        return;
      }

      req.user!.passwordHash = newPassword;
      await req.user!.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
);

// Get single user by ID (admin only)
router.get('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user (admin only)
router.put('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const allowedUpdates = ['name', 'email', 'role', 'activeCompanyId', 'companyIds'];
    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) {
        (user as any)[key] = req.body[key];
      }
    });

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (admin only)
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.user!._id!.toString()) {
      res.status(400).json({ error: 'Cannot delete yourself' });
      return;
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
