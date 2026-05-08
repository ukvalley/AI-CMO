/**
 * File Upload Routes
 * Handles image and document uploads
 */

import express, { Request, Response } from 'express';
import { uploadSingle } from '../middleware/upload';
import { authenticate } from '../middleware/auth';
import path from 'path';

const router = express.Router();

router.use(authenticate);

// Upload single file
router.post('/', uploadSingle.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      url: fileUrl,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload multiple images
router.post('/images', uploadSingle.array('images', 10), (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No images uploaded' });
      return;
    }

    const uploadedFiles = files.map((file) => ({
      url: `/uploads/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
    }));

    res.json({ files: uploadedFiles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

export default router;
