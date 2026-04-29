/**
 * AI Routes
 * Integration with Claude API and other AI services
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth';
import { cacheGet, cacheSet } from '../utils/redis';

const router = express.Router();

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

router.use(authenticate);

// Generate content using Claude
router.post(
  '/generate',
  requireRole('admin', 'editor'),
  [
    body('prompt').trim().notEmpty().withMessage('Prompt is required'),
    body('context').optional().isObject(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!CLAUDE_API_KEY) {
        res.status(503).json({ error: 'AI service not configured' });
        return;
      }

      const { prompt, context = {}, maxTokens = 2000 } = req.body;

      // Check cache
      const cacheKey = `ai:${Buffer.from(prompt).toString('base64').slice(0, 50)}`;
      const cached = await cacheGet(cacheKey);
      if (cached) {
        res.json({ content: cached, cached: true });
        return;
      }

      // Call Claude API
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: maxTokens,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          system: context.systemPrompt || 'You are an expert marketing assistant helping create content for a business.',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error: ${error}`);
      }

      const data = await response.json();
      const content = data.content[0]?.text || '';

      // Cache result (5 minutes)
      await cacheSet(cacheKey, content, 300);

      res.json({
        content,
        tokensUsed: data.usage?.output_tokens || 0,
        model: data.model,
      });
    } catch (error: any) {
      console.error('AI generation error:', error);
      res.status(500).json({ error: error.message || 'AI generation failed' });
    }
  }
);

// Generate bulk content
router.post(
  '/generate-bulk',
  requireRole('admin', 'editor'),
  [
    body('items').isArray().withMessage('Items array is required'),
    body('template').trim().notEmpty().withMessage('Template is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!CLAUDE_API_KEY) {
        res.status(503).json({ error: 'AI service not configured' });
        return;
      }

      const { items, template, context = {} } = req.body;

      // Create a background task and return immediately
      // The actual processing would be handled by a background worker
      res.json({
        message: 'Bulk generation task created',
        itemCount: items.length,
        taskId: `bulk-${Date.now()}`,
        status: 'queued',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Bulk generation failed' });
    }
  }
);

// Get AI suggestions based on context
router.post('/suggest', requireRole('admin', 'editor', 'viewer'), async (req: Request, res: Response) => {
  try {
    const { moduleId, fieldName, currentValue, context } = req.body;

    // This would typically call the ML service
    // For now, return placeholder suggestions
    res.json({
      suggestions: [
        'Suggestion 1 based on context',
        'Suggestion 2 based on context',
        'Suggestion 3 based on context',
      ],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get suggestions' });
  }
});

// Analyze data
router.post('/analyze', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { data, analysisType } = req.body;

    if (!CLAUDE_API_KEY) {
      res.status(503).json({ error: 'AI service not configured' });
      return;
    }

    const prompt = `Analyze the following data and provide insights:\n\n${JSON.stringify(data, null, 2)}`;

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error('Claude API error');
    }

    const result = await response.json();

    res.json({
      analysis: result.content[0]?.text || '',
      type: analysisType,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

export default router;
