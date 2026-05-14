/**
 * Sales Script Routes
 * Comprehensive CRUD operations with advanced filtering, approval workflow, and bulk operations
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// ============================================
// GET ALL SALES SCRIPTS FOR A COMPANY
// ============================================

router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { SalesScript } = getModels();

    // Authorization check
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Build filter query
    const filter: Record<string, any> = { companyId };

    // Optional filters
    if (req.query.scriptType) {
      filter.scriptType = req.query.scriptType;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.funnelStage) {
      filter.funnelStage = req.query.funnelStage;
    }
    if (req.query.audienceType) {
      filter.audienceType = req.query.audienceType;
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.productId) {
      filter.productIds = { $in: [req.query.productId] };
    }
    if (req.query.serviceId) {
      filter.serviceIds = { $in: [req.query.serviceId] };
    }
    if (req.query.playbookId) {
      filter.playbookId = req.query.playbookId;
    }
    if (req.query.isPublic !== undefined) {
      filter.isPublic = req.query.isPublic === 'true';
    }
    if (req.query.aiGenerated !== undefined) {
      filter.aiGenerated = req.query.aiGenerated === 'true';
    }
    if (req.query.channel) {
      filter.channels = { $in: [req.query.channel] };
    }
    if (req.query.tag) {
      filter.tags = { $in: [req.query.tag] };
    }

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { openingLine: searchRegex },
        { hook: searchRegex },
        { valueProposition: searchRegex },
      ];
    }

    const scripts = await SalesScript.find(filter).sort({ createdAt: -1 });
    res.json(scripts);
  } catch (error) {
    console.error('Error fetching sales scripts:', error);
    res.status(500).json({ error: 'Failed to get sales scripts' });
  }
});

// ============================================
// GET SINGLE SALES SCRIPT
// ============================================

router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { SalesScript } = getModels();

    const script = await SalesScript.findById(id);
    if (!script) {
      res.status(404).json({ error: 'Sales script not found' });
      return;
    }

    // Authorization check
    if (!req.user!.companyIds.includes(script.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(script);
  } catch (error) {
    console.error('Error fetching sales script:', error);
    res.status(500).json({ error: 'Failed to get sales script' });
  }
});

// ============================================
// CREATE SALES SCRIPT
// ============================================

router.post(
  '/',
  requireRole('admin', 'editor'),
  [
    body('title').trim().notEmpty().withMessage('Script title is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('scriptType').optional().isIn([
      'cold-call', 'warm-call', 'qualification', 'discovery', 'demo',
      'sales-pitch', 'follow-up', 'negotiation', 'closing', 'whatsapp',
      'email', 'linkedin', 'voice-note', 'appointment', 'reactivation',
      'referral', 'upselling', 'cross-selling', 'retention', 'renewal',
      'customer-success', 'objection-handling'
    ]),
    body('status').optional().isIn(['draft', 'review', 'approved', 'published', 'archived']),
    body('funnelStage').optional().isIn(['awareness', 'interest', 'consideration', 'decision', 'purchase', 'retention', 'advocacy']),
    body('audienceType').optional().isIn(['prospect', 'lead', 'opportunity', 'customer', 'partner', 'investor']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
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

      const { SalesScript } = getModels();

      // Set defaults
      const scriptData = {
        ...req.body,
        createdBy: req.user!.id,
        status: req.body.status || 'draft',
        scriptType: req.body.scriptType || 'cold-call',
        funnelStage: req.body.funnelStage || 'awareness',
        audienceType: req.body.audienceType || 'prospect',
        priority: req.body.priority || 'medium',
        version: 1,
        aiGenerated: req.body.aiGenerated || false,
        isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true,
        language: req.body.language || 'en',
      };

      const script = new SalesScript(scriptData);
      await script.save();

      res.status(201).json(script);
    } catch (error) {
      console.error('Error creating sales script:', error);
      res.status(500).json({ error: 'Failed to create sales script' });
    }
  }
);

// ============================================
// UPDATE SALES SCRIPT
// ============================================

router.put('/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { SalesScript } = getModels();

    const script = await SalesScript.findById(id);
    if (!script) {
      res.status(404).json({ error: 'Sales script not found' });
      return;
    }

    // Authorization check
    if (!req.user!.companyIds.includes(script.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Handle approval workflow
    if (req.body.status === 'approved' && script.status !== 'approved') {
      req.body.approvedBy = req.user!.id;
      req.body.approvedAt = new Date();
    }
    if (req.body.status === 'review' && script.status !== 'review') {
      req.body.reviewedBy = req.user!.id;
      req.body.reviewedAt = new Date();
    }

    // Handle version control - increment version on significant changes
    if (req.body.sections || req.body.objectionResponses || req.body.qualificationQuestions) {
      req.body.version = (script.version || 1) + 1;
      // Add revision note
      if (!req.body.revisionNotes) {
        req.body.revisionNotes = script.revisionNotes || [];
      }
      req.body.revisionNotes.push(`Updated on ${new Date().toISOString()} by ${req.user!.id}`);
    }

    Object.assign(script, req.body, { updatedAt: new Date().toISOString() });
    await script.save();

    res.json(script);
  } catch (error) {
    console.error('Error updating sales script:', error);
    res.status(500).json({ error: 'Failed to update sales script' });
  }
});

// ============================================
// DELETE SALES SCRIPT
// ============================================

router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { SalesScript } = getModels();

    const script = await SalesScript.findById(id);
    if (!script) {
      res.status(404).json({ error: 'Sales script not found' });
      return;
    }

    // Authorization check
    if (!req.user!.companyIds.includes(script.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await SalesScript.findByIdAndDelete(id);
    res.json({ message: 'Sales script deleted successfully' });
  } catch (error) {
    console.error('Error deleting sales script:', error);
    res.status(500).json({ error: 'Failed to delete sales script' });
  }
});

// ============================================
// BULK IMPORT
// ============================================

router.post('/bulk-import', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { companyId, scripts } = req.body;

    if (!companyId || !Array.isArray(scripts)) {
      res.status(400).json({ error: 'companyId and scripts array are required' });
      return;
    }

    // Authorization check
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const { SalesScript } = getModels();

    // Add companyId and defaults to each script
    const scriptsWithDefaults = scripts.map(s => ({
      ...s,
      companyId,
      status: s.status || 'draft',
      scriptType: s.scriptType || 'cold-call',
      version: 1,
      createdBy: req.user!.id,
      aiGenerated: s.aiGenerated || false,
      isPublic: s.isPublic !== undefined ? s.isPublic : true,
      language: s.language || 'en',
    }));

    const created = await SalesScript.insertMany(scriptsWithDefaults);
    res.status(201).json({ count: created.length, scripts: created });
  } catch (error) {
    console.error('Error bulk importing sales scripts:', error);
    res.status(500).json({ error: 'Failed to import sales scripts' });
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

    const { SalesScript } = getModels();

    // Get all scripts and verify authorization
    const scripts = await SalesScript.find({ _id: { $in: ids } });
    const authorizedIds = scripts
      .filter(s => req.user!.companyIds.includes(s.companyId) || req.user!.role === 'admin')
      .map(s => s._id);

    if (authorizedIds.length === 0) {
      res.status(403).json({ error: 'No authorized scripts found' });
      return;
    }

    // Handle approval workflow for bulk approval
    if (updates.status === 'approved') {
      updates.approvedBy = req.user!.id;
      updates.approvedAt = new Date();
    }
    if (updates.status === 'review') {
      updates.reviewedBy = req.user!.id;
      updates.reviewedAt = new Date();
    }

    const result = await SalesScript.updateMany(
      { _id: { $in: authorizedIds } },
      { $set: { ...updates, updatedAt: new Date().toISOString() } }
    );

    res.json({ modified: result.modifiedCount });
  } catch (error) {
    console.error('Error bulk updating sales scripts:', error);
    res.status(500).json({ error: 'Failed to update sales scripts' });
  }
});

// ============================================
// CLONE SALES SCRIPT
// ============================================

router.post('/clone/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { SalesScript } = getModels();

    const originalScript = await SalesScript.findById(id);
    if (!originalScript) {
      res.status(404).json({ error: 'Sales script not found' });
      return;
    }

    // Authorization check
    if (!req.user!.companyIds.includes(originalScript.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Create a copy
    const clonedScript = new SalesScript({
      ...originalScript.toObject(),
      _id: undefined,
      id: undefined,
      title: `${originalScript.title} (Copy)`,
      status: 'draft',
      version: 1,
      parentScriptId: originalScript._id,
      createdBy: req.user!.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      revisionNotes: [],
      reviewedBy: undefined,
      reviewedAt: undefined,
      approvedBy: undefined,
      approvedAt: undefined,
      performanceMetrics: {
        usageCount: 0,
        successRate: 0,
        avgConversionTime: 0,
      },
    });

    await clonedScript.save();
    res.status(201).json(clonedScript);
  } catch (error) {
    console.error('Error cloning sales script:', error);
    res.status(500).json({ error: 'Failed to clone sales script' });
  }
});

// ============================================
// ADVANCED SEARCH
// ============================================

router.get('/search/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { SalesScript } = getModels();

    // Authorization check
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const {
      query,
      scriptType,
      status,
      funnelStage,
      audienceType,
      priority,
      productId,
      serviceId,
      playbookId,
      channel,
      tag,
      minSuccessRate,
      isPublic,
      aiGenerated,
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
        { title: searchRegex },
        { description: searchRegex },
        { openingLine: searchRegex },
        { hook: searchRegex },
        { valueProposition: searchRegex },
        { 'sections.title': searchRegex },
        { 'sections.content': searchRegex },
      ];
    }

    // Type filter
    if (scriptType) {
      filter.scriptType = scriptType;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Funnel stage filter
    if (funnelStage) {
      filter.funnelStage = funnelStage;
    }

    // Audience type filter
    if (audienceType) {
      filter.audienceType = audienceType;
    }

    // Priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Entity filters
    if (productId) {
      filter.productIds = { $in: [productId] };
    }
    if (serviceId) {
      filter.serviceIds = { $in: [serviceId] };
    }
    if (playbookId) {
      filter.playbookId = playbookId;
    }

    // Channel filter
    if (channel) {
      filter.channels = { $in: [channel] };
    }

    // Tag filter
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    // Performance filter
    if (minSuccessRate) {
      filter['performanceMetrics.successRate'] = { $gte: parseFloat(minSuccessRate as string) };
    }

    // Public filter
    if (isPublic !== undefined) {
      filter.isPublic = isPublic === 'true';
    }

    // AI generated filter
    if (aiGenerated !== undefined) {
      filter.aiGenerated = aiGenerated === 'true';
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [scripts, total] = await Promise.all([
      SalesScript.find(filter).sort(sort).skip(skip).limit(parseInt(limit as string)),
      SalesScript.countDocuments(filter),
    ]);

    res.json({
      scripts,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Error searching sales scripts:', error);
    res.status(500).json({ error: 'Failed to search sales scripts' });
  }
});

// ============================================
// DASHBOARD STATISTICS
// ============================================

router.get('/stats/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { SalesScript } = getModels();

    // Authorization check
    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const [
      total,
      byStatus,
      byType,
      byFunnelStage,
      byPriority,
      byChannel,
      avgPerformance,
      topPerforming,
      aiGenerated,
      published,
    ] = await Promise.all([
      // Total count
      SalesScript.countDocuments({ companyId }),

      // Count by status
      SalesScript.aggregate([
        { $match: { companyId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Count by type
      SalesScript.aggregate([
        { $match: { companyId } },
        { $group: { _id: '$scriptType', count: { $sum: 1 } } },
      ]),

      // Count by funnel stage
      SalesScript.aggregate([
        { $match: { companyId } },
        { $group: { _id: '$funnelStage', count: { $sum: 1 } } },
      ]),

      // Count by priority
      SalesScript.aggregate([
        { $match: { companyId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),

      // Count by channel
      SalesScript.aggregate([
        { $match: { companyId } },
        { $unwind: '$channels' },
        { $group: { _id: '$channels', count: { $sum: 1 } } },
      ]),

      // Average performance metrics
      SalesScript.aggregate([
        { $match: { companyId, 'performanceMetrics.usageCount': { $gt: 0 } } },
        {
          $group: {
            _id: null,
            avgUsageCount: { $avg: '$performanceMetrics.usageCount' },
            avgSuccessRate: { $avg: '$performanceMetrics.successRate' },
            avgConversionTime: { $avg: '$performanceMetrics.avgConversionTime' },
            avgFeedbackScore: { $avg: '$performanceMetrics.feedbackScore' },
          },
        },
      ]),

      // Top performing scripts
      SalesScript.find({ companyId, 'performanceMetrics.successRate': { $gt: 0 } })
        .sort({ 'performanceMetrics.successRate': -1 })
        .limit(5)
        .select('title scriptType performanceMetrics.successRate'),

      // AI generated count
      SalesScript.countDocuments({ companyId, aiGenerated: true }),

      // Published count
      SalesScript.countDocuments({ companyId, status: 'published' }),
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
      byFunnelStage: byFunnelStage.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      byChannel: byChannel.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      avgPerformance: avgPerformance[0] || {
        avgUsageCount: 0,
        avgSuccessRate: 0,
        avgConversionTime: 0,
        avgFeedbackScore: 0,
      },
      topPerforming,
      aiGenerated,
      published,
    });
  } catch (error) {
    console.error('Error fetching sales script stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// ============================================
// UPDATE PERFORMANCE METRICS
// ============================================

router.patch('/:id/performance', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { usageCount, successRate, avgConversionTime, feedbackScore } = req.body;
    const { SalesScript } = getModels();

    const script = await SalesScript.findById(id);
    if (!script) {
      res.status(404).json({ error: 'Sales script not found' });
      return;
    }

    // Authorization check
    if (!req.user!.companyIds.includes(script.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Update performance metrics
    if (!script.performanceMetrics) {
      script.performanceMetrics = {
        usageCount: 0,
        successRate: 0,
        avgConversionTime: 0,
      };
    }

    if (usageCount !== undefined) {
      script.performanceMetrics.usageCount = usageCount;
    }
    if (successRate !== undefined) {
      script.performanceMetrics.successRate = successRate;
    }
    if (avgConversionTime !== undefined) {
      script.performanceMetrics.avgConversionTime = avgConversionTime;
    }
    if (feedbackScore !== undefined) {
      script.performanceMetrics.feedbackScore = feedbackScore;
    }
    script.performanceMetrics.lastUsedAt = new Date();

    await script.save();
    res.json(script);
  } catch (error) {
    console.error('Error updating performance metrics:', error);
    res.status(500).json({ error: 'Failed to update performance metrics' });
  }
});

export default router;