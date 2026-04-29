/**
 * Product Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ============ PRODUCT CATEGORIES ============

// Get all categories for a company
router.get('/categories/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { ProductCategory } = getModels();

    // Verify access
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const categories = await ProductCategory.find({ companyId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Create category
router.post(
  '/categories',
  requireRole('admin', 'editor'),
  [body('name').trim().notEmpty().withMessage('Category name is required'), body('companyId').notEmpty().withMessage('Company ID is required')],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      // Verify access
      if (!req.user!.companyIds.includes(req.body.companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const { ProductCategory } = getModels();
      const category = ProductCategory.create(req.body);
      await category.save();

      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
);

// Update category
router.put('/categories/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ProductCategory } = getModels();

    const category = await ProductCategory.findById(id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    // Verify access
    if (!req.user!.companyIds.includes(category.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(category, req.body, { updatedAt: new Date().toISOString() });
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category
router.delete('/categories/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Product, ProductCategory } = getModels();

    const category = await ProductCategory.findById(id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    // Check if products use this category
    const products = await Product.find({ categoryId: id });
    if (products.length > 0) {
      res.status(400).json({
        error: 'Cannot delete category',
        message: `${products.length} products are using this category`,
      });
      return;
    }

    await ProductCategory.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ============ PRODUCTS ============

// Get all products for a company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Product } = getModels();

    // Verify access
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const products = await Product.find({ companyId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Get single product
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Product } = getModels();

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Verify access
    if (!req.user!.companyIds.includes(product.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// Create product
router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('categoryId').notEmpty().withMessage('Category ID is required'),
    body('status').isIn(['active', 'draft', 'discontinued']).withMessage('Invalid status'),
    body('audienceType').isIn(['b2b', 'b2c', 'both']).withMessage('Invalid audience type'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      // Verify access
      if (!req.user!.companyIds.includes(req.body.companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const { Product } = getModels();
      const product = Product.create(req.body);
      await product.save();

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// Update product
router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Product } = getModels();

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Verify access
    if (!req.user!.companyIds.includes(product.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(product, req.body, { updatedAt: new Date().toISOString() });
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Product } = getModels();

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Verify access
    if (!req.user!.companyIds.includes(product.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
