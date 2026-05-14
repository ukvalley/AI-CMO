/**
 * Testimonial Routes
 * Comprehensive CRUD operations with advanced filtering and bulk operations
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// ============================================
// GET ALL TESTIMONIALS FOR A COMPANY
// ============================================

router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Testimonial } = getModels();

    // Authorization check
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Build filter query
    const filter: Record<string, any> = { companyId };

    // Optional filters
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.productId) {
      filter.productIds = { $in: [req.query.productId] };
    }
    if (req.query.founderId) {
      filter.founderIds = { $in: [req.query.founderId] };
    }
    if (req.query.employeeId) {
      filter.employeeIds = { $in: [req.query.employeeId] };
    }
    if (req.query.industry) {
      filter.industryTags = { $in: [req.query.industry] };
    }
    if (req.query.isPublic !== undefined) {
      filter.isPublic = req.query.isPublic === 'true';
    }
    if (req.query.consentVerified !== undefined) {
      filter.consentVerified = req.query.consentVerified === 'true';
    }

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$or = [
        { customerName: searchRegex },
        { customerCompany: searchRegex },
        { headline: searchRegex },
        { shortQuote: searchRegex },
        { fullTestimonial: searchRegex },
      ];
    }

    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to get testimonials' });
  }
});

// ============================================
// GET SINGLE TESTIMONIAL
// ============================================

router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Testimonial } = getModels();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    // Authorization check
    if (!req.user!.companyIds.includes(testimonial.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Failed to get testimonial' });
  }
});

// ============================================
// CREATE TESTIMONIAL
// ============================================

router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('type').optional().isIn(['text', 'video', 'audio', 'image', 'screenshot',
      'social-media', 'email', 'whatsapp', 'linkedin-recommendation', 'google-review', 'case-study']),
    body('status').optional().isIn(['pending', 'approved', 'rejected', 'featured', 'archived']),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      // Authorization check
      if (!req.user!.companyIds.includes(req.body.companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const { Testimonial } = getModels();
      const testimonial = new Testimonial(req.body);
      await testimonial.save();

      res.status(201).json(testimonial);
    } catch (error) {
      console.error('Error creating testimonial:', error);
      res.status(500).json({ error: 'Failed to create testimonial' });
    }
  }
);

// ============================================
// UPDATE TESTIMONIAL
// ============================================

router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Testimonial } = getModels();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    // Authorization check
    if (!req.user!.companyIds.includes(testimonial.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Handle approval workflow
    if (req.body.status === 'approved' && testimonial.status !== 'approved') {
      req.body.approvedBy = req.user!.id;
      req.body.approvedAt = new Date();
    }

    Object.assign(testimonial, req.body, { updatedAt: new Date().toISOString() });
    await testimonial.save();

    res.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

// ============================================
// DELETE TESTIMONIAL
// ============================================

router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Testimonial } = getModels();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    // Authorization check
    if (!req.user!.companyIds.includes(testimonial.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Testimonial.findByIdAndDelete(id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// ============================================
// BULK IMPORT
// ============================================

router.post('/bulk-import', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId, testimonials } = req.body;

    if (!companyId || !Array.isArray(testimonials)) {
      res.status(400).json({ error: 'companyId and testimonials array are required' });
      return;
    }

    // Authorization check
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const { Testimonial } = getModels();

    // Add companyId to each testimonial
    const testimonialsWithCompanyId = testimonials.map(t => ({
      ...t,
      companyId,
      status: t.status || 'pending',
    }));

    const created = await Testimonial.insertMany(testimonialsWithCompanyId);
    res.status(201).json({ count: created.length, testimonials: created });
  } catch (error) {
    console.error('Error bulk importing testimonials:', error);
    res.status(500).json({ error: 'Failed to import testimonials' });
  }
});

// ============================================
// BULK UPDATE STATUS
// ============================================

router.put('/bulk-update', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { ids, updates } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: 'ids array is required' });
      return;
    }

    const { Testimonial } = getModels();

    // Get all testimonials and verify authorization
    const testimonials = await Testimonial.find({ _id: { $in: ids } });
    const authorizedIds = testimonials
      .filter(t => req.user!.companyIds.includes(t.companyId) || req.user!.role === 'admin')
      .map(t => t._id);

    if (authorizedIds.length === 0) {
      res.status(403).json({ error: 'No authorized testimonials found' });
      return;
    }

    // Handle approval workflow for bulk approval
    if (updates.status === 'approved') {
      updates.approvedBy = req.user!.id;
      updates.approvedAt = new Date();
    }

    const result = await Testimonial.updateMany(
      { _id: { $in: authorizedIds } },
      { $set: { ...updates, updatedAt: new Date().toISOString() } }
    );

    res.json({ modified: result.modifiedCount });
  } catch (error) {
    console.error('Error bulk updating testimonials:', error);
    res.status(500).json({ error: 'Failed to update testimonials' });
  }
});

// ============================================
// ADVANCED SEARCH
// ============================================

router.get('/search/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Testimonial } = getModels();

    // Authorization check
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const {
      query,
      type,
      status,
      authorityLevel,
      minScore,
      maxScore,
      productId,
      founderId,
      employeeId,
      industryTag,
      campaignTag,
      hasConsent,
      isPublic,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    const filter: Record<string, any> = { companyId };

    // Text search
    if (query) {
      const searchRegex = new RegExp(query as string, 'i');
      filter.$or = [
        { customerName: searchRegex },
        { customerCompany: searchRegex },
        { headline: searchRegex },
        { shortQuote: searchRegex },
        { fullTestimonial: searchRegex },
        { keyResults: { $in: [searchRegex] } },
      ];
    }

    // Type filter
    if (type) {
      filter.type = type;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Authority level filter
    if (authorityLevel) {
      filter.authorityLevel = authorityLevel;
    }

    // Score range filter
    if (minScore || maxScore) {
      filter.trustScore = {};
      if (minScore) filter.trustScore.$gte = parseInt(minScore as string);
      if (maxScore) filter.trustScore.$lte = parseInt(maxScore as string);
    }

    // Entity filters
    if (productId) {
      filter.productIds = { $in: [productId] };
    }
    if (founderId) {
      filter.founderIds = { $in: [founderId] };
    }
    if (employeeId) {
      filter.employeeIds = { $in: [employeeId] };
    }

    // Tag filters
    if (industryTag) {
      filter.industryTags = { $in: [industryTag] };
    }
    if (campaignTag) {
      filter.campaignTags = { $in: [campaignTag] };
    }

    // Consent filter
    if (hasConsent !== undefined) {
      filter.consentVerified = hasConsent === 'true';
    }

    // Public filter
    if (isPublic !== undefined) {
      filter.isPublic = isPublic === 'true';
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [testimonials, total] = await Promise.all([
      Testimonial.find(filter).sort(sort).skip(skip).limit(parseInt(limit as string)),
      Testimonial.countDocuments(filter),
    ]);

    res.json({
      testimonials,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Error searching testimonials:', error);
    res.status(500).json({ error: 'Failed to search testimonials' });
  }
});

// ============================================
// DASHBOARD STATISTICS
// ============================================

router.get('/stats/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Testimonial } = getModels();

    // Authorization check
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const [
      total,
      byStatus,
      byType,
      withConsent,
      featured,
      avgScores,
      byAuthority,
    ] = await Promise.all([
      // Total count
      Testimonial.countDocuments({ companyId }),

      // Count by status
      Testimonial.aggregate([
        { $match: { companyId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Count by type
      Testimonial.aggregate([
        { $match: { companyId } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),

      // With consent
      Testimonial.countDocuments({ companyId, consentVerified: true }),

      // Featured
      Testimonial.countDocuments({ companyId, status: 'featured' }),

      // Average scores
      Testimonial.aggregate([
        { $match: { companyId } },
        {
          $group: {
            _id: null,
            avgAuthenticity: { $avg: '$authenticityScore' },
            avgEmotionalImpact: { $avg: '$emotionalImpactScore' },
            avgConversionPotential: { $avg: '$conversionPotential' },
            avgTrustScore: { $avg: '$trustScore' },
          },
        },
      ]),

      // Count by authority level
      Testimonial.aggregate([
        { $match: { companyId } },
        { $group: { _id: '$authorityLevel', count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      byType: byType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      withConsent,
      featured,
      avgScores: avgScores[0] || {
        avgAuthenticity: 0,
        avgEmotionalImpact: 0,
        avgConversionPotential: 0,
        avgTrustScore: 0,
      },
      byAuthority: byAuthority.reduce((acc, item) => {
        if (item._id) {
          acc[item._id] = item.count;
        }
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error('Error fetching testimonial stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

export default router;