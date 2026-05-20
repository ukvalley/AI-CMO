/**
 * Event Management Routes
 *
 * Category CRUD, Event CRUD with search/filter,
 * Session CRUD, Resource CRUD,
 * AI-powered event content generation.
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
    const { EventCategory } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const categories = await EventCategory.find({ companyId }).sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Get single category
router.get('/categories/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { EventCategory } = getModels();

    const category = await EventCategory.findById(id);
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
router.post('/categories', requireRole('admin', 'editor'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('companyId').notEmpty().withMessage('Company ID is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { EventCategory } = getModels();
    const category = new EventCategory(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category
router.put('/categories/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { EventCategory } = getModels();

    const category = await EventCategory.findById(id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (!req.user!.companyIds.includes(category.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(category, req.body, { updatedAt: new Date() });
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (clear categoryId on related events)
router.delete('/categories/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { EventCategory, Event } = getModels();

    const category = await EventCategory.findById(id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (!req.user!.companyIds.includes(category.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Event.updateMany({ categoryId: id }, { $unset: { categoryId: '' } });
    await EventCategory.findByIdAndDelete(id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ============================================
// EVENT ROUTES
// ============================================

// List events for a company with search/filter
router.get('/events/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Event } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const filter: any = { companyId };
    const { search, categoryId, status, eventType, eventMode, priority, visibility, audienceType, isFeatured } = req.query;

    if (search) {
      filter.$text = { $search: search as string };
    }
    if (categoryId) filter.categoryId = categoryId;
    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType;
    if (eventMode) filter.eventMode = eventMode;
    if (priority) filter.priority = priority;
    if (visibility) filter.visibility = visibility;
    if (audienceType) filter.audienceType = audienceType;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    res.json({ data: events, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get events' });
  }
});

// Get single event
router.get('/events/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Event } = getModels();

    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    if (!req.user!.companyIds.includes(event.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get event' });
  }
});

// Create event
router.post('/events', requireRole('admin', 'editor'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('companyId').notEmpty().withMessage('Company ID is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { Event } = getModels();
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/events/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Event } = getModels();

    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    if (!req.user!.companyIds.includes(event.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(event, req.body, { updatedAt: new Date() });
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (cascade: delete sessions and resources)
router.delete('/events/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Event, EventSession, EventResource } = getModels();

    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    if (!req.user!.companyIds.includes(event.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await EventSession.deleteMany({ eventId: id });
    await EventResource.deleteMany({ eventId: id });
    await Event.findByIdAndDelete(id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// ============================================
// SESSION ROUTES
// ============================================

// List sessions for an event
router.get('/sessions/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { EventSession, Event } = getModels();

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    if (!req.user!.companyIds.includes(event.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const sessions = await EventSession.find({ eventId }).sort({ order: 1, createdAt: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

// Get single session
router.get('/sessions/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { EventSession } = getModels();

    const session = await EventSession.findById(id);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (!req.user!.companyIds.includes(session.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// Create session
router.post('/sessions', requireRole('admin', 'editor'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('companyId').notEmpty().withMessage('Company ID is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { EventSession } = getModels();
    const session = new EventSession(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Update session
router.put('/sessions/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { EventSession } = getModels();

    const session = await EventSession.findById(id);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (!req.user!.companyIds.includes(session.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(session, req.body, { updatedAt: new Date() });
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Delete session (cascade: delete resources)
router.delete('/sessions/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { EventSession, EventResource } = getModels();

    const session = await EventSession.findById(id);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (!req.user!.companyIds.includes(session.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await EventResource.deleteMany({ sessionId: id });
    await EventSession.findByIdAndDelete(id);
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Reorder sessions
router.put('/sessions/reorder/:eventId', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { orders } = req.body as { orders: { id: string; order: number }[] };
    const { EventSession, Event } = getModels();

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    if (!req.user!.companyIds.includes(event.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    for (const { id, order } of orders) {
      await EventSession.findByIdAndUpdate(id, { order });
    }

    const sessions = await EventSession.find({ eventId }).sort({ order: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder sessions' });
  }
});

// Update checklist items for a session
router.put('/sessions/:id/checklist', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { checklistItems } = req.body as { checklistItems: any[] };
    const { EventSession } = getModels();

    const session = await EventSession.findById(id);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (!req.user!.companyIds.includes(session.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    session.checklistItems = checklistItems;
    session.updatedAt = new Date();
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update checklist' });
  }
});

// ============================================
// RESOURCE ROUTES
// ============================================

// List resources for an event
router.get('/resources/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { EventResource, Event } = getModels();

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    if (!req.user!.companyIds.includes(event.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const resources = await EventResource.find({ eventId }).sort({ order: 1, createdAt: 1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// Get single resource
router.get('/resources/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { EventResource } = getModels();

    const resource = await EventResource.findById(id);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    if (!req.user!.companyIds.includes(resource.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get resource' });
  }
});

// Create resource
router.post('/resources', requireRole('admin', 'editor'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('companyId').notEmpty().withMessage('Company ID is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { EventResource } = getModels();
    const resource = new EventResource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// Update resource
router.put('/resources/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { EventResource } = getModels();

    const resource = await EventResource.findById(id);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    if (!req.user!.companyIds.includes(resource.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(resource, req.body, { updatedAt: new Date() });
    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete resource
router.delete('/resources/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { EventResource } = getModels();

    const resource = await EventResource.findById(id);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    if (!req.user!.companyIds.includes(resource.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await EventResource.findByIdAndDelete(id);
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

// Reorder resources
router.put('/resources/reorder/:sessionId', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { orders } = req.body as { orders: { id: string; order: number }[] };
    const { EventResource, EventSession } = getModels();

    const session = await EventSession.findById(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (!req.user!.companyIds.includes(session.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    for (const { id, order } of orders) {
      await EventResource.findByIdAndUpdate(id, { order });
    }

    const resources = await EventResource.find({ sessionId }).sort({ order: 1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder resources' });
  }
});

// ============================================
// AI GENERATION ROUTES
// ============================================

async function generateEventAI(prompt: string, systemPrompt: string): Promise<string> {
  const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
  const ZHIPU_URL = process.env.ZHIPU_URL || '';
  const ZHIPU_KEY = process.env.ZHIPU_KEY || '';
  const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY || process.env.CLAUDE_API_KEY || '';

  // Try Ollama first
  try {
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OLLAMA_MODEL || 'llama3.2', prompt, stream: false }),
      signal: AbortSignal.timeout(60000),
    });
    if (ollamaRes.ok) {
      const data: any = await ollamaRes.json();
      if (data?.response) return data.response.replace(/```json\n?|```\n?/g, '').trim();
    }
  } catch {}

  // Try Zhipu
  if (ZHIPU_URL && ZHIPU_KEY) {
    try {
      const zhipuRes = await fetch(`${ZHIPU_URL}/api/paas/v4/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ZHIPU_KEY}` },
        body: JSON.stringify({ model: 'glm-4', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }] }),
        signal: AbortSignal.timeout(60000),
      });
      if (zhipuRes.ok) {
        const data: any = await zhipuRes.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) return content.replace(/```json\n?|```\n?/g, '').trim();
      }
    } catch {}
  }

  // Try Claude
  if (ANTHROPIC_KEY) {
    try {
      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4096, system: systemPrompt, messages: [{ role: 'user', content: prompt }] }),
        signal: AbortSignal.timeout(120000),
      });
      if (claudeRes.ok) {
        const data: any = await claudeRes.json();
        const content = data?.content?.[0]?.text;
        if (content) return content.replace(/```json\n?|```\n?/g, '').trim();
      }
    } catch {}
  }

  throw new Error('All AI providers failed. Please try again later.');
}

const AI_SYSTEM_PROMPT = 'You are an expert event planner and business coordinator. Generate professional event content for enterprise use. Always respond with valid JSON when structured data is requested. Use British English spelling. Be concise and professional.';

// Generate event description
router.post('/ai/generate-description', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { title, brief, eventType, eventMode, difficulty, companyId } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const prompt = `Generate a professional event description for a business event with the following details:
Title: ${title}
${brief ? `Brief: ${brief}` : ''}
${eventType ? `Event Type: ${eventType}` : ''}
${eventMode ? `Event Mode: ${eventMode}` : ''}

Generate a JSON object with these fields:
- shortDescription (max 200 characters)
- detailedDescription (2-3 paragraphs)
- summary (1-2 sentences)
- objectives (array of 3-5 learning/business objectives)
- expectedOutcomes (array of 3-5 expected outcomes)`;

    const result = await generateEventAI(prompt, AI_SYSTEM_PROMPT);
    res.json({ content: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
});

// Generate event agenda/sessions
router.post('/ai/generate-agenda', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { title, description, objectives, format, companyId } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const prompt = `Generate a structured event agenda/sessions for:
Title: ${title}
${description ? `Description: ${description}` : ''}
${objectives ? `Objectives: ${objectives}` : ''}
${format ? `Format: ${format}` : ''}

Generate a JSON array of session objects, each with:
- title (string)
- description (string, 1-2 sentences)
- duration (string, e.g., "30 min")
- speakerInfo (string, suggested speaker role)
- objectives (array of 2-3 strings)
- checklistItems (array of {text, order} objects for planning tasks)`;

    const result = await generateEventAI(prompt, AI_SYSTEM_PROMPT);
    res.json({ content: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
});

// Generate event checklist
router.post('/ai/generate-checklist', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { title, eventType, eventMode, companyId } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const prompt = `Generate a pre-event planning checklist for:
Title: ${title}
${eventType ? `Event Type: ${eventType}` : ''}
${eventMode ? `Event Mode: ${eventMode}` : ''}

Generate a JSON array of checklist item objects, each with:
- text (string, the task description)
- order (number, starting from 1)
Organize items chronologically from planning to execution.`;

    const result = await generateEventAI(prompt, AI_SYSTEM_PROMPT);
    res.json({ content: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
});

// Generate minutes of meeting
router.post('/ai/generate-mom', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { title, eventDate, notes, attendees, companyId } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const prompt = `Generate professional Minutes of Meeting (MoM) for:
Event: ${title}
${eventDate ? `Date: ${eventDate}` : ''}
${attendees ? `Attendees: ${attendees}` : ''}
${notes ? `Raw Notes: ${notes}` : ''}

Generate a JSON object with:
- summary (string, 2-3 sentence overview)
- keyDecisions (array of strings)
- actionItems (array of {task, assignee, deadline} objects)
- followUps (array of strings)
- nextSteps (array of strings)`;

    const result = await generateEventAI(prompt, AI_SYSTEM_PROMPT);
    res.json({ content: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
});

// Enhance event content
router.post('/ai/enhance-content', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { content, enhancementType, title, companyId } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const typeInstructions: Record<string, string> = {
      grammar: 'Improve grammar, spelling, and punctuation while keeping the original meaning.',
      tone: 'Rewrite with a professional business tone appropriate for enterprise communication.',
      expand: 'Expand the content with more detail, examples, and supporting information.',
      simplify: 'Simplify the content while preserving key information, make it concise and clear.',
      format: 'Reformat the content with proper structure, headings, bullet points, and formatting.',
      keypoints: 'Extract the key points and create a structured summary.',
      mom: 'Transform the content into a formal Minutes of Meeting format.',
    };

    const instruction = typeInstructions[enhancementType] || typeInstructions.grammar;
    const prompt = `${instruction}\n\n${title ? `Title: ${title}\n\n` : ''}Content:\n${content}`;

    const result = await generateEventAI(prompt, AI_SYSTEM_PROMPT);
    res.json({ content: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
});

export default router;