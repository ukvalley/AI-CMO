/**
 * FAQ Bank Routes
 *
 * Category CRUD, FAQ CRUD with search/filter, bulk operations,
 * AI generation, and export.
 */

import express, { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { getModels } from '../models';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

// ============================================
// CATEGORY ROUTES
// ============================================

// List categories for a company
router.get('/categories/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { FAQCategory } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const categories = await FAQCategory.find({ companyId }).sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Get single category
router.get('/categories/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { FAQCategory } = getModels();

    const category = await FAQCategory.findById(id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (!req.user!.companyIds.includes(category.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get category' });
  }
});

// Create category
router.post(
  '/categories',
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
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

      const { FAQCategory } = getModels();
      const category = new FAQCategory(req.body);
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
    const { FAQCategory } = getModels();

    const category = await FAQCategory.findById(id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

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
    const { FAQCategory, FAQ } = getModels();

    const category = await FAQCategory.findById(id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (!req.user!.companyIds.includes(category.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Remove category reference from FAQs in this category
    await FAQ.updateMany(
      { companyId: category.companyId, categoryId: id },
      { $unset: { categoryId: '' } }
    );
    await FAQ.updateMany(
      { companyId: category.companyId, subcategoryId: id },
      { $unset: { subcategoryId: '' } }
    );

    await FAQCategory.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ============================================
// FAQ ROUTES
// ============================================

// List FAQs with search and filters
router.get('/faqs/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { FAQ } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const {
      search,
      categoryId,
      faqType,
      status,
      priority,
      productId,
      tags,
      audienceType,
      funnelStage,
      sort = 'order',
      order = 'asc',
      page = '1',
      limit = '50',
    } = req.query;

    // Build filter object
    const filter: any = { companyId };

    if (categoryId) filter.categoryId = categoryId;
    if (faqType) filter.faqType = faqType;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (productId) filter.productId = productId;
    if (audienceType) filter.audienceType = audienceType;
    if (funnelStage) filter.funnelStage = funnelStage;
    if (tags) {
      const tagList = typeof tags === 'string' ? tags.split(',') : tags;
      filter.tags = { $in: tagList };
    }

    // Sorting
    const sortObj: any = {};
    const sortField = typeof sort === 'string' ? sort : 'order';
    const sortOrder = order === 'desc' ? -1 : 1;
    sortObj[sortField] = sortOrder;

    // Pagination
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    let faqs;
    let total;

    if (search) {
      // Use text search if available, otherwise fall back to regex
      try {
        const count = await FAQ.countDocuments(filter);
        total = count;
        faqs = await FAQ.find(filter)
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum);

        // Client-side text filtering as fallback
        const searchLower = String(search).toLowerCase();
        faqs = faqs.filter((faq: any) =>
          (faq.title || '').toLowerCase().includes(searchLower) ||
          faq.question.toLowerCase().includes(searchLower) ||
          faq.answer.toLowerCase().includes(searchLower) ||
          (faq.shortAnswer || '').toLowerCase().includes(searchLower)
        );
      } catch {
        // Fallback without text search
        total = await FAQ.countDocuments(filter);
        faqs = await FAQ.find(filter).sort(sortObj).skip(skip).limit(limitNum);
      }
    } else {
      total = await FAQ.countDocuments(filter);
      faqs = await FAQ.find(filter).sort(sortObj).skip(skip).limit(limitNum);
    }

    res.json({
      data: faqs,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get FAQs' });
  }
});

// Get single FAQ
router.get('/faqs/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { FAQ } = getModels();

    const faq = await FAQ.findById(id);
    if (!faq) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }

    if (!req.user!.companyIds.includes(faq.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Increment view count
    faq.viewCount = (faq.viewCount || 0) + 1;
    await faq.save();

    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get FAQ' });
  }
});

// Create FAQ
router.post(
  '/faqs',
  requireRole('admin', 'editor'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('answer').trim().notEmpty().withMessage('Answer is required'),
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

      const { FAQ } = getModels();
      const faq = new FAQ(req.body);
      await faq.save();

      // Update category faqCount if categoryId provided
      if (req.body.categoryId) {
        const { FAQCategory } = getModels();
        const cat = await FAQCategory.findById(req.body.categoryId);
        if (cat) {
          cat.faqCount = (cat.faqCount || 0) + 1;
          await cat.save();
        }
      }

      res.status(201).json(faq);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create FAQ' });
    }
  }
);

// Update FAQ
router.put('/faqs/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { FAQ } = getModels();

    const faq = await FAQ.findById(id);
    if (!faq) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }

    if (!req.user!.companyIds.includes(faq.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const oldCategoryId = faq.categoryId;
    Object.assign(faq, req.body, { updatedAt: new Date().toISOString() });
    await faq.save();

    // Update category counts if category changed
    const newCategoryId = req.body.categoryId;
    if (oldCategoryId !== newCategoryId) {
      const { FAQCategory } = getModels();
      if (oldCategoryId) {
        const oldCat = await FAQCategory.findById(oldCategoryId);
        if (oldCat && oldCat.faqCount > 0) {
          oldCat.faqCount -= 1;
          await oldCat.save();
        }
      }
      if (newCategoryId) {
        const newCat = await FAQCategory.findById(newCategoryId);
        if (newCat) {
          newCat.faqCount = (newCat.faqCount || 0) + 1;
          await newCat.save();
        }
      }
    }

    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// Delete FAQ
router.delete('/faqs/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { FAQ, FAQCategory } = getModels();

    const faq = await FAQ.findById(id);
    if (!faq) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }

    if (!req.user!.companyIds.includes(faq.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Update category count
    if (faq.categoryId) {
      const cat = await FAQCategory.findById(faq.categoryId);
      if (cat && cat.faqCount > 0) {
        cat.faqCount -= 1;
        await cat.save();
      }
    }

    await FAQ.findByIdAndDelete(id);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// ============================================
// BULK OPERATIONS
// ============================================

// Bulk import FAQs
router.post(
  '/faqs/bulk-import',
  requireRole('admin', 'editor'),
  async (req: Request, res: Response) => {
    try {
      const { companyId, faqs } = req.body;

      if (!companyId) {
        res.status(400).json({ error: 'Company ID is required' });
        return;
      }

      if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      if (!Array.isArray(faqs) || faqs.length === 0) {
        res.status(400).json({ error: 'FAQs array is required and must not be empty' });
        return;
      }

      if (faqs.length > 200) {
        res.status(400).json({ error: 'Maximum 200 FAQs per import' });
        return;
      }

      const { FAQ } = getModels();
      const createdFaqs = [];

      for (const faqData of faqs) {
        const faq = new FAQ({
          ...faqData,
          companyId,
          status: faqData.status || 'draft',
          faqType: faqData.faqType || 'customer',
          priority: faqData.priority || 'medium',
          audienceType: faqData.audienceType || 'public',
          funnelStage: faqData.funnelStage || 'general',
        });
        await faq.save();
        createdFaqs.push(faq);
      }

      res.status(201).json({
        message: `Successfully imported ${createdFaqs.length} FAQs`,
        count: createdFaqs.length,
        data: createdFaqs,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to import FAQs' });
    }
  }
);

// Bulk update FAQs
router.put(
  '/faqs/bulk-update',
  requireRole('admin', 'editor'),
  async (req: Request, res: Response) => {
    try {
      const { ids, updates } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ error: 'FAQ IDs array is required' });
        return;
      }

      if (!updates || typeof updates !== 'object') {
        res.status(400).json({ error: 'Updates object is required' });
        return;
      }

      const { FAQ } = getModels();
      const allowedFields = ['status', 'categoryId', 'faqType', 'priority', 'audienceType', 'tags'];
      const safeUpdates: any = {};
      for (const key of allowedFields) {
        if (updates[key] !== undefined) {
          safeUpdates[key] = updates[key];
        }
      }
      safeUpdates.updatedAt = new Date().toISOString();

      let updatedCount = 0;
      for (const id of ids) {
        const faq = await FAQ.findById(id);
        if (faq && (req.user!.companyIds.includes(faq.companyId) || req.user!.role === 'admin')) {
          Object.assign(faq, safeUpdates);
          await faq.save();
          updatedCount++;
        }
      }

      res.json({
        message: `Updated ${updatedCount} FAQs`,
        updatedCount,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to bulk update FAQs' });
    }
  }
);

// Bulk delete FAQs
router.post(
  '/faqs/bulk-delete',
  requireRole('admin'),
  async (req: Request, res: Response) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ error: 'FAQ IDs array is required' });
        return;
      }

      const { FAQ } = getModels();
      let deletedCount = 0;

      for (const id of ids) {
        const faq = await FAQ.findById(id);
        if (faq && (req.user!.companyIds.includes(faq.companyId) || req.user!.role === 'admin')) {
          await FAQ.findByIdAndDelete(id);
          deletedCount++;
        }
      }

      res.json({
        message: `Deleted ${deletedCount} FAQs`,
        deletedCount,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to bulk delete FAQs' });
    }
  }
);

// ============================================
// EXPORT
// ============================================

// Export FAQs
router.get('/faqs/export/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { format = 'json' } = req.query;
    const { FAQ } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const faqs = await FAQ.find({ companyId }).sort({ order: 1, createdAt: -1 });

    if (format === 'csv') {
      const headers = [
        'title', 'question', 'answer', 'shortAnswer', 'category', 'faqType',
        'status', 'priority', 'audienceType', 'funnelStage', 'tags',
      ];
      const csvRows = [headers.join(',')];
      for (const faq of faqs) {
        const row = [
          `"${(faq.title || '').replace(/"/g, '""')}"`,
          `"${faq.question.replace(/"/g, '""')}"`,
          `"${faq.answer.replace(/"/g, '""')}"`,
          `"${(faq.shortAnswer || '').replace(/"/g, '""')}"`,
          `"${(faq.categoryId || '')}"`,
          faq.faqType,
          faq.status,
          faq.priority,
          faq.audienceType,
          faq.funnelStage,
          `"${(faq.tags || []).join(';')}"`,
        ];
        csvRows.push(row.join(','));
      }
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=faqs.csv');
      res.send(csvRows.join('\n'));
      return;
    }

    if (format === 'markdown') {
      let md = '# FAQ Bank Export\n\n';
      for (const faq of faqs) {
        md += `## ${faq.question}\n\n`;
        md += `**Title:** ${faq.title}\n\n`;
        md += `${faq.answer}\n\n`;
        if (faq.shortAnswer) {
          md += `**TL;DR:** ${faq.shortAnswer}\n\n`;
        }
        md += `**Type:** ${faq.faqType} | **Status:** ${faq.status} | **Priority:** ${faq.priority}\n\n`;
        md += `---\n\n`;
      }
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', 'attachment; filename=faqs.md');
      res.send(md);
      return;
    }

    // Default: JSON
    res.json({ data: faqs, count: faqs.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export FAQs' });
  }
});

// ============================================
// AI GENERATION
// ============================================

// Generate FAQs using AI
router.post(
  '/faqs/generate',
  requireRole('admin', 'editor'),
  async (req: Request, res: Response) => {
    try {
      const { companyId, category, faqType, count = 5, context } = req.body;

      if (!companyId) {
        res.status(400).json({ error: 'Company ID is required' });
        return;
      }

      if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      if (!process.env.CLAUDE_API_KEY) {
        // Return placeholder suggestions when no API key
        const placeholders = [];
        const types = ['What is', 'How does', 'Why should', 'Can I', 'What are the benefits of'];
        for (let i = 0; i < Math.min(count, 10); i++) {
          placeholders.push({
            title: `FAQ Question ${i + 1}`,
            question: `${types[i % types.length]} ${context?.topic || 'your business'}`,
            answer: `AI-generated answer for ${context?.topic || 'your business'}. Configure your Claude API key to generate real content.`,
            faqType: faqType || 'customer',
            status: 'draft',
            priority: 'medium',
            audienceType: 'public',
            funnelStage: 'general',
          });
        }
        res.json({ data: placeholders, generated: placeholders.length, source: 'placeholder' });
        return;
      }

      // Build prompt from business context
      const { BusinessProfile, Product } = getModels();
      let contextStr = '';

      const businessProfile = await BusinessProfile.findOne({ companyId });
      if (businessProfile) {
        contextStr += `Business: ${businessProfile.companyName || 'Unknown'}. `;
        contextStr += `Industry: ${businessProfile.industry || 'Unknown'}. `;
        contextStr += `Description: ${businessProfile.description || 'N/A'}. `;
      }

      if (context?.topic) {
        contextStr += `Topic: ${context.topic}. `;
      }
      if (context?.audience) {
        contextStr += `Target audience: ${context.audience}. `;
      }

      const prompt = `Generate ${count} frequently asked questions (FAQs) for a business.
${contextStr}
Category: ${category || 'general'}
FAQ Type: ${faqType || 'customer'}

For each FAQ, provide:
1. title: A short title (max 300 chars)
2. question: The FAQ question (max 500 chars)
3. answer: A comprehensive answer
4. shortAnswer: A concise TL;DR version (max 300 chars)
5. tags: Array of relevant tags

Return as a JSON array of objects with keys: title, question, answer, shortAnswer, tags`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const content = data.content?.[0]?.text || '';

      // Try to parse the response as JSON
      let generatedFaqs = [];
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          generatedFaqs = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // If parsing fails, return the raw content
        res.json({ data: [], rawContent: content, source: 'ai' });
        return;
      }

      res.json({
        data: generatedFaqs.map((faq: any) => ({
          ...faq,
          companyId,
          faqType: faqType || 'customer',
          status: 'draft',
          priority: 'medium',
          audienceType: 'public',
          funnelStage: 'general',
        })),
        generated: generatedFaqs.length,
        source: 'ai',
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate FAQs' });
    }
  }
);

// Suggest missing FAQs
router.post(
  '/faqs/suggest-missing',
  requireRole('admin', 'editor'),
  async (req: Request, res: Response) => {
    try {
      const { companyId, existingTopics, context } = req.body;

      if (!companyId) {
        res.status(400).json({ error: 'Company ID is required' });
        return;
      }

      if (!process.env.CLAUDE_API_KEY) {
        res.json({
          suggestions: [
            { question: 'What pricing plans are available?', reason: 'Pricing information is commonly expected by customers' },
            { question: 'How do I get started?', reason: 'Onboarding questions are essential for new users' },
            { question: 'What support channels are available?', reason: 'Support questions reduce ticket volume' },
          ],
          source: 'placeholder',
        });
        return;
      }

      const prompt = `Based on the following existing FAQ topics: ${JSON.stringify(existingTopics || [])}

Business context: ${context || 'General business'}

Suggest 5 FAQ topics that are missing and would be valuable to add.
For each suggestion, provide a "question" and a "reason" why it's needed.

Return as a JSON array of objects with keys: question, reason`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const content = data.content?.[0]?.text || '';

      let suggestions = [];
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // Return raw content if parsing fails
      }

      res.json({ suggestions, source: 'ai' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to suggest missing FAQs' });
    }
  }
);

// Detect duplicate FAQs
router.post(
  '/faqs/detect-duplicates',
  requireRole('admin', 'editor'),
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req.body;

      if (!companyId) {
        res.status(400).json({ error: 'Company ID is required' });
        return;
      }

      const { FAQ } = getModels();
      const faqs = await FAQ.find({ companyId }).select('question title');

      // Simple duplicate detection based on question similarity
      const duplicates: any[] = [];
      const seen = new Map<string, any>();

      for (const faq of faqs) {
        const normalized = faq.question.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (seen.has(normalized)) {
          duplicates.push({
            faq1: seen.get(normalized),
            faq2: { id: faq._id || faq.id, question: faq.question, title: faq.title },
            similarity: 'exact',
          });
        } else {
          seen.set(normalized, { id: faq._id || faq.id, question: faq.question, title: faq.title });
        }
      }

      res.json({ duplicates, checked: faqs.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to detect duplicates' });
    }
  }
);

export default router;