/**
 * Course Management Routes
 *
 * Category CRUD, Course CRUD with search/filter,
 * Chapter CRUD, Lesson CRUD with quiz questions,
 * AI-powered content generation.
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
    const { CourseCategory } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const categories = await CourseCategory.find({ companyId }).sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Get single category
router.get('/categories/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { CourseCategory } = getModels();

    const category = await CourseCategory.findById(id);
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

      const { CourseCategory } = getModels();
      const category = new CourseCategory(req.body);
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
    const { CourseCategory } = getModels();

    const category = await CourseCategory.findById(id);
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
    const { CourseCategory, Course } = getModels();

    const category = await CourseCategory.findById(id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (!req.user!.companyIds.includes(category.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Clear category reference from courses in this category
    await Course.updateMany(
      { companyId: category.companyId, categoryId: id },
      { $unset: { categoryId: '' } }
    );

    await CourseCategory.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ============================================
// COURSE ROUTES
// ============================================

// List courses with search and filters
router.get('/courses/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { Course } = getModels();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const {
      search,
      categoryId,
      status,
      difficulty,
      format,
      visibility,
      audienceType,
      department,
      isFeatured,
      sort = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '50',
    } = req.query;

    // Build filter object
    const filter: any = { companyId };

    if (categoryId) filter.categoryId = categoryId;
    if (status) filter.status = status;
    if (difficulty) filter.difficulty = difficulty;
    if (format) filter.format = format;
    if (visibility) filter.visibility = visibility;
    if (audienceType) filter.audienceType = audienceType;
    if (department) filter.department = department;
    if (isFeatured === 'true') filter.isFeatured = true;
    if (isFeatured === 'false') filter.isFeatured = false;

    if (search) {
      filter.$text = { $search: search as string };
    }

    // Sorting
    const sortObj: any = {};
    const sortField = typeof sort === 'string' ? sort : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    sortObj[sortField] = sortOrder;

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [courses, total] = await Promise.all([
      Course.find(filter).sort(sortObj).skip(skip).limit(limitNum),
      Course.countDocuments(filter),
    ]);

    res.json({
      data: courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

// Get single course
router.get('/courses/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Course } = getModels();

    const course = await Course.findById(id);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    if (!req.user!.companyIds.includes(course.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get course' });
  }
});

// Create course
router.post(
  '/courses',
  requireRole('admin', 'editor'),
  [
    body('title').trim().notEmpty().withMessage('Course title is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('format').isIn(['video', 'text', 'live', 'hybrid', 'workshop']).withMessage('Invalid format'),
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

      const { Course } = getModels();
      const course = new Course(req.body);
      await course.save();
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create course' });
    }
  }
);

// Update course
router.put('/courses/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Course } = getModels();

    const course = await Course.findById(id);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    if (!req.user!.companyIds.includes(course.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(course, req.body, { updatedAt: new Date().toISOString() });
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete course
router.delete('/courses/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Course, CourseChapter, CourseLesson } = getModels();

    const course = await Course.findById(id);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    if (!req.user!.companyIds.includes(course.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Delete all chapters and lessons belonging to this course
    const chapters = await CourseChapter.find({ courseId: id });
    const chapterIds = chapters.map((c: any) => c._id?.toString() || c.id);

    await CourseLesson.deleteMany({ courseId: id });
    await CourseChapter.deleteMany({ courseId: id });
    await Course.findByIdAndDelete(id);

    res.json({ message: 'Course and all associated content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// ============================================
// CHAPTER ROUTES
// ============================================

// List chapters for a course
router.get('/chapters/:courseId', async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { Course, CourseChapter } = getModels();

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    if (!req.user!.companyIds.includes(course.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const chapters = await CourseChapter.find({ courseId }).sort({ order: 1, createdAt: 1 });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chapters' });
  }
});

// Get single chapter
router.get('/chapters/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { CourseChapter } = getModels();

    const chapter = await CourseChapter.findById(id);
    if (!chapter) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    if (!req.user!.companyIds.includes(chapter.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chapter' });
  }
});

// Create chapter
router.post(
  '/chapters',
  requireRole('admin', 'editor'),
  [
    body('title').trim().notEmpty().withMessage('Chapter title is required'),
    body('courseId').notEmpty().withMessage('Course ID is required'),
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

      const { CourseChapter } = getModels();
      const chapter = new CourseChapter(req.body);
      await chapter.save();
      res.status(201).json(chapter);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create chapter' });
    }
  }
);

// Update chapter
router.put('/chapters/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { CourseChapter } = getModels();

    const chapter = await CourseChapter.findById(id);
    if (!chapter) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    if (!req.user!.companyIds.includes(chapter.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(chapter, req.body, { updatedAt: new Date().toISOString() });
    await chapter.save();
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update chapter' });
  }
});

// Delete chapter
router.delete('/chapters/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { CourseChapter, CourseLesson } = getModels();

    const chapter = await CourseChapter.findById(id);
    if (!chapter) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    if (!req.user!.companyIds.includes(chapter.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Delete all lessons in this chapter
    await CourseLesson.deleteMany({ chapterId: id });
    await CourseChapter.findByIdAndDelete(id);

    res.json({ message: 'Chapter and all associated lessons deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chapter' });
  }
});

// Reorder chapters
router.put('/chapters/reorder/:courseId', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { Course, CourseChapter } = getModels();

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    if (!req.user!.companyIds.includes(course.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const { orders }: { orders: { id: string; order: number }[] } = req.body;

    for (const item of orders) {
      await CourseChapter.findByIdAndUpdate(item.id, { order: item.order });
    }

    res.json({ message: 'Chapters reordered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder chapters' });
  }
});

// ============================================
// LESSON ROUTES
// ============================================

// List lessons for a chapter
router.get('/lessons/:chapterId', async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;
    const { CourseChapter, CourseLesson } = getModels();

    const chapter = await CourseChapter.findById(chapterId);
    if (!chapter) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    if (!req.user!.companyIds.includes(chapter.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const lessons = await CourseLesson.find({ chapterId }).sort({ order: 1, createdAt: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get lessons' });
  }
});

// Get single lesson
router.get('/lessons/detail/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { CourseLesson } = getModels();

    const lesson = await CourseLesson.findById(id);
    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    if (!req.user!.companyIds.includes(lesson.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get lesson' });
  }
});

// Create lesson
router.post(
  '/lessons',
  requireRole('admin', 'editor'),
  [
    body('title').trim().notEmpty().withMessage('Lesson title is required'),
    body('chapterId').notEmpty().withMessage('Chapter ID is required'),
    body('courseId').notEmpty().withMessage('Course ID is required'),
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

      const { CourseLesson } = getModels();
      const lesson = new CourseLesson(req.body);
      await lesson.save();
      res.status(201).json(lesson);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create lesson' });
    }
  }
);

// Update lesson
router.put('/lessons/:id', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { CourseLesson } = getModels();

    const lesson = await CourseLesson.findById(id);
    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    if (!req.user!.companyIds.includes(lesson.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(lesson, req.body, { updatedAt: new Date().toISOString() });
    await lesson.save();
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Delete lesson
router.delete('/lessons/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { CourseLesson } = getModels();

    const lesson = await CourseLesson.findById(id);
    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    if (!req.user!.companyIds.includes(lesson.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await CourseLesson.findByIdAndDelete(id);
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// Reorder lessons
router.put('/lessons/reorder/:chapterId', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;
    const { CourseChapter, CourseLesson } = getModels();

    const chapter = await CourseChapter.findById(chapterId);
    if (!chapter) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    if (!req.user!.companyIds.includes(chapter.companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const { orders }: { orders: { id: string; order: number }[] } = req.body;

    for (const item of orders) {
      await CourseLesson.findByIdAndUpdate(item.id, { order: item.order });
    }

    res.json({ message: 'Lessons reordered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder lessons' });
  }
});

// ============================================
// AI GENERATION ENDPOINTS
// ============================================

// Helper: call AI providers with fallback chain
async function generateCourseAI(prompt: string, systemPrompt: string, maxTokens: number = 4000): Promise<string> {
  const config = {
    AI_PROVIDER: (process.env.AI_PROVIDER || 'auto').toLowerCase(),
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',
    CLAUDE_API_URL: 'https://api.anthropic.com/v1/messages',
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'llama3',
    ZHIPU_API_KEY: process.env.CLAUDE_API_KEY || process.env.ZHIPU_API_KEY || '',
    ZHIPU_API_URL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    ZHIPU_MODEL: process.env.ZHIPU_MODEL || 'glm-4',
  };

  // Determine provider
  let provider = config.AI_PROVIDER;
  if (provider === 'auto') {
    if (config.CLAUDE_API_KEY.startsWith('sk-ant-')) provider = 'claude';
    else if (config.ZHIPU_API_KEY) provider = 'zhipu';
    else provider = 'ollama';
  }

  const providers = ['ollama', 'zhipu', 'claude'];
  const callOrder = [provider, ...providers.filter(p => p !== provider)];
  const timeout = parseInt(process.env.AI_TIMEOUT || '90000', 10);

  for (const prov of callOrder) {
    try {
      let response: string | null = null;

      if (prov === 'ollama') {
        const res = await fetch(`${config.OLLAMA_BASE_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: config.OLLAMA_MODEL, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }], stream: false }),
          signal: AbortSignal.timeout(timeout),
        });
        const data: any = await res.json();
        response = data?.message?.content || data?.message?.thinking || null;
      } else if (prov === 'zhipu') {
        const res = await fetch(config.ZHIPU_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.ZHIPU_API_KEY}` },
          body: JSON.stringify({ model: config.ZHIPU_MODEL, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }], max_tokens: maxTokens }),
          signal: AbortSignal.timeout(timeout),
        });
        const data: any = await res.json();
        response = data?.choices?.[0]?.message?.content || null;
      } else if (prov === 'claude') {
        const res = await fetch(config.CLAUDE_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': config.CLAUDE_API_KEY, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: 'claude-sonnet-4-6-20250514', max_tokens: maxTokens, system: systemPrompt, messages: [{ role: 'user', content: prompt }] }),
          signal: AbortSignal.timeout(timeout),
        });
        const data: any = await res.json();
        response = data?.content?.[0]?.text || null;
      }

      if (response) {
        // Strip markdown code fences if present
        let cleaned = response.trim();
        if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
        else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
        if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
        return cleaned.trim();
      }
    } catch (err: any) {
      console.warn(`[AI] Provider ${prov} failed: ${err.message}`);
      continue;
    }
  }

  throw new Error('All AI providers failed');
}

// Generate course description
router.post(
  '/ai/generate-description',
  requireRole('admin', 'editor'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const { title, shortDescription, context, format, difficulty } = req.body;
      const systemPrompt = 'You are an expert course content creator for businesses. Generate professional, SEO-optimised course content. Always respond with valid JSON matching the requested structure. Use British English spelling.';
      const prompt = `Generate course marketing content for:

Title: ${title}
${shortDescription ? `Brief: ${shortDescription}` : ''}
${format ? `Format: ${format}` : ''}
${difficulty ? `Difficulty: ${difficulty}` : ''}

Generate a JSON object with these fields:
- "shortDescription": A compelling 1-2 sentence description (max 200 chars)
- "detailedDescription": A comprehensive course description (3-5 paragraphs, max 1000 chars)
- "summary": A concise 1-paragraph summary (max 300 chars)
- "learningObjectives": Array of 4-6 learning objective strings
- "outcomes": Array of 3-5 learning outcome strings

Respond ONLY with the JSON object, no markdown or explanation.`;

      const content = await generateCourseAI(prompt, systemPrompt, 2000);
      res.json({ content });
    } catch (error: any) {
      console.error('[AI] Course description generation error:', error.message);
      res.status(500).json({ error: error.message || 'AI generation failed' });
    }
  }
);

// Generate chapter structure from course description
router.post(
  '/ai/generate-structure',
  requireRole('admin', 'editor'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const { title, description, learningObjectives, format, difficulty } = req.body;
      const systemPrompt = 'You are an expert instructional designer. Create well-structured course outlines for business training. Always respond with valid JSON. Use British English spelling.';
      const prompt = `Create a chapter and lesson structure for this course:

Title: ${title}
${description ? `Description: ${description}` : ''}
${learningObjectives?.length ? `Learning Objectives: ${learningObjectives.join(', ')}` : ''}
${format ? `Format: ${format}` : ''}
${difficulty ? `Difficulty: ${difficulty}` : ''}

Generate a JSON object with:
- "chapters": Array of chapter objects, each with:
  - "title": Chapter title
  - "description": Brief chapter description (1-2 sentences)
  - "learningObjectives": Array of 2-3 learning objective strings
  - "lessons": Array of lesson objects, each with:
    - "title": Lesson title
    - "description": Brief lesson description (1-2 sentences)
    - "format": One of "video", "text", "audio", "pdf", "presentation", "interactive", "quiz"
    - "duration": Estimated duration (e.g., "15 min")

Create 4-8 chapters with 2-4 lessons each. Respond ONLY with the JSON object.`;

      const content = await generateCourseAI(prompt, systemPrompt, 4000);
      res.json({ content });
    } catch (error: any) {
      console.error('[AI] Chapter structure generation error:', error.message);
      res.status(500).json({ error: error.message || 'AI generation failed' });
    }
  }
);

// Generate quiz/MCQ questions for a lesson
router.post(
  '/ai/generate-quiz',
  requireRole('admin', 'editor'),
  [
    body('lessonTitle').trim().notEmpty().withMessage('Lesson title is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const { lessonTitle, lessonContent, chapterTitle, courseTitle, difficulty, count } = req.body;
      const numQuestions = count || 5;
      const systemPrompt = 'You are an expert assessment creator. Generate high-quality multiple-choice questions for business training. Always respond with valid JSON. Use British English spelling.';
      const prompt = `Generate ${numQuestions} multiple-choice quiz questions for:

Course: ${courseTitle || 'Business Course'}
${chapterTitle ? `Chapter: ${chapterTitle}` : ''}
Lesson: ${lessonTitle}
${lessonContent ? `Content: ${lessonContent.slice(0, 2000)}` : ''}
${difficulty ? `Difficulty: ${difficulty}` : ''}

Generate a JSON object with:
- "questions": Array of ${numQuestions} question objects, each with:
  - "question": The question text
  - "options": Array of exactly 4 answer option strings
  - "correctAnswer": Index of the correct answer (0-3)
  - "explanation": Brief explanation of why the correct answer is right

Make questions that test understanding, not just recall. Mix difficulty levels.
Respond ONLY with the JSON object.`;

      const content = await generateCourseAI(prompt, systemPrompt, 3000);
      res.json({ content });
    } catch (error: any) {
      console.error('[AI] Quiz generation error:', error.message);
      res.status(500).json({ error: error.message || 'AI generation failed' });
    }
  }
);

// Enhance lesson content
router.post(
  '/ai/enhance-content',
  requireRole('admin', 'editor'),
  [
    body('content').notEmpty().withMessage('Content is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const { content, enhancementType, title } = req.body;
      const enhancementPrompts: Record<string, string> = {
        grammar: 'Improve the grammar, punctuation, and sentence structure while preserving the meaning and tone.',
        tone: 'Make the tone more professional, engaging, and suitable for business training content.',
        expand: 'Expand the content with more detail, examples, and explanations. Add depth while maintaining clarity.',
        simplify: 'Simplify the content for easier understanding. Use shorter sentences, simpler vocabulary, and clearer explanations.',
        format: 'Format the content professionally with clear headings, bullet points, and structured sections.',
        keypoints: 'Extract the key points and takeaways from the content as a bulleted list.',
      };

      const enhancementInstruction = enhancementPrompts[enhancementType] || enhancementPrompts.format;
      const systemPrompt = 'You are an expert content editor specialising in business training materials. Enhance content while maintaining accuracy. Use British English spelling.';
      const prompt = `${enhancementInstruction}

${title ? `Title: ${title}` : ''}

Content to enhance:
${content}

Return the enhanced content directly, without any meta-commentary.`;

      const result = await generateCourseAI(prompt, systemPrompt, 3000);
      res.json({ content: result });
    } catch (error: any) {
      console.error('[AI] Content enhancement error:', error.message);
      res.status(500).json({ error: error.message || 'AI generation failed' });
    }
  }
);

export default router;