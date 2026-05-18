import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { authenticate, requireRole } from '../middleware/auth';
import { cacheGet, cacheSet } from '../utils/redis';

const router = express.Router();

// AI Provider Configuration
const AI_PROVIDER = (process.env.AI_PROVIDER || 'auto').toLowerCase();
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';
const ZHIPU_API_KEY = process.env.CLAUDE_API_KEY; // Same env var — Zhipu keys don't start with sk-ant-
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const ZHIPU_MODEL = process.env.ZHIPU_MODEL || 'glm-4';

// Timeout for individual AI calls (ms)
const AI_TIMEOUT = parseInt(process.env.AI_TIMEOUT || '60000', 10);

router.use(authenticate);

/**
 * Generate JWT token for Zhipu BigModel API v4.
 * The API key format is {apiKey}.{apiSecret} — we split it and sign a JWT.
 */
function generateZhipuToken(apiKey: string): string {
  const [id, secret] = apiKey.split('.');
  if (!id || !secret) {
    throw new Error('Invalid Zhipu API key format. Expected {id}.{secret}');
  }
  const now = Date.now();
  const payload = {
    api_key: id,
    exp: now + 3600 * 1000, // 1 hour expiry in ms
    timestamp: now,
  };
  // Zhipu uses HMAC-SHA256 with the secret portion as the signing key
  return jwt.sign(payload, secret, { header: { alg: 'HS256', sign_type: 'SIGN' } });
}

function detectProvider(): 'ollama' | 'zhipu' | 'claude' {
  if (AI_PROVIDER === 'ollama') return 'ollama';
  if (AI_PROVIDER === 'zhipu') return 'zhipu';
  if (AI_PROVIDER === 'claude') return 'claude';

  // Auto-detect from key format
  if (CLAUDE_API_KEY?.startsWith('sk-ant-')) return 'claude';
  if (CLAUDE_API_KEY && !CLAUDE_API_KEY.startsWith('sk-ant-')) return 'zhipu';
  return 'ollama';
}

async function callOllama(prompt: string, systemPrompt: string, maxTokens: number): Promise<{ content: string; model: string; provider: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT);

  try {
    console.log(`[AI/Ollama] Calling model: ${OLLAMA_MODEL} at ${OLLAMA_BASE_URL}`);
    // Prepend JSON format instruction for reasoning models (GLM 5.1 etc.)
    const enhancedSystemPrompt = `${systemPrompt} When asked for JSON, respond with ONLY valid JSON — no markdown fences, no explanation before or after.`;
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: enhancedSystemPrompt },
          { role: 'user', content: prompt },
        ],
        stream: false,
        options: { num_predict: maxTokens },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    // GLM 5.1 reasoning models put final output in 'content' and reasoning in 'thinking'
    // If content is empty but thinking has content, use thinking as the response
    let content = data.message?.content || '';
    if (!content && data.message?.thinking) {
      content = data.message.thinking;
    }
    if (!content) {
      throw new Error('Ollama returned empty content');
    }
    return {
      content,
      model: data.model || OLLAMA_MODEL,
      provider: 'ollama',
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Ollama request timed out after ${AI_TIMEOUT / 1000}s`);
    }
    throw err;
  }
}

async function callZhipu(prompt: string, systemPrompt: string, maxTokens: number): Promise<{ content: string; model: string; provider: string }> {
  if (!ZHIPU_API_KEY) throw new Error('Zhipu API key not configured');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT);

  try {
    // Generate JWT token from the API key for authentication
    const token = generateZhipuToken(ZHIPU_API_KEY);
    console.log(`[AI/Zhipu] Calling model: ${ZHIPU_MODEL}`);

    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: ZHIPU_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zhipu API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    if (!content) {
      throw new Error('Zhipu returned empty content');
    }
    return {
      content,
      model: data.model || ZHIPU_MODEL,
      provider: 'zhipu',
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Zhipu request timed out after ${AI_TIMEOUT / 1000}s`);
    }
    throw err;
  }
}

async function callClaude(prompt: string, systemPrompt: string, maxTokens: number): Promise<{ content: string; model: string; provider: string }> {
  if (!CLAUDE_API_KEY) throw new Error('Claude API key not configured');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT);

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
        system: systemPrompt,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';
    if (!content) {
      throw new Error('Claude returned empty content');
    }
    return {
      content,
      model: data.model || 'claude-sonnet-4-20250514',
      provider: 'claude',
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Claude request timed out after ${AI_TIMEOUT / 1000}s`);
    }
    throw err;
  }
}

// Provider call order for fallback
const PROVIDER_CHAIN: Array<'ollama' | 'zhipu' | 'claude'> = ['ollama', 'zhipu', 'claude'];

async function generateWithAI(prompt: string, systemPrompt: string, maxTokens: number) {
  const primaryProvider = detectProvider();
  console.log(`[AI] Primary provider: ${primaryProvider} (AI_PROVIDER=${AI_PROVIDER})`);

  // Build call order: try primary first, then others as fallback
  const callOrder = [primaryProvider, ...PROVIDER_CHAIN.filter(p => p !== primaryProvider)];
  const errors: string[] = [];

  for (const provider of callOrder) {
    try {
      let result;
      switch (provider) {
        case 'ollama':
          result = await callOllama(prompt, systemPrompt, maxTokens);
          break;
        case 'zhipu':
          result = await callZhipu(prompt, systemPrompt, maxTokens);
          break;
        case 'claude':
          result = await callClaude(prompt, systemPrompt, maxTokens);
          break;
        default:
          continue;
      }
      console.log(`[AI] SUCCESS — provider: ${result.provider}, model: ${result.model}`);
      return result;
    } catch (err: any) {
      const errMsg = `${provider}: ${err.message}`;
      errors.push(errMsg);
      console.log(`[AI] ${provider} failed: ${err.message}`);
      // Continue to next provider
    }
  }

  throw new Error(`All AI providers failed: ${errors.join(' | ')}`);
}

// Generate content using AI
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

      const { prompt, context = {}, maxTokens = 4000 } = req.body;

      // Check cache (skip if Redis unavailable)
      let cached: string | null = null;
      try {
        const cacheKey = `ai:${Buffer.from(prompt).toString('base64').slice(0, 50)}`;
        cached = await cacheGet(cacheKey);
        if (cached) {
          res.json({ content: cached, cached: true, provider: 'cache' });
          return;
        }
      } catch {
        // Cache unavailable, continue without it
      }

      const systemPrompt = context.systemPrompt || 'You are an expert marketing assistant helping create content for a business. Always respond with valid JSON when asked to.';
      const result = await generateWithAI(prompt, systemPrompt, maxTokens);

      // Cache result (5 minutes)
      try {
        const cacheKey = `ai:${Buffer.from(prompt).toString('base64').slice(0, 50)}`;
        await cacheSet(cacheKey, result.content, 300);
      } catch {
        // Cache unavailable, continue without it
      }

      res.json({
        content: result.content,
        tokensUsed: 0,
        model: result.model,
        provider: result.provider,
      });
    } catch (error: any) {
      console.error('[AI] Generation error:', error.message);
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

      const { items, template, context = {} } = req.body;

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

    const prompt = `Given the following context for module "${moduleId}" and field "${fieldName}", suggest 3 improvements or alternatives for: "${currentValue || '(empty)'}"\n\nContext: ${JSON.stringify(context).slice(0, 500)}`;
    const systemPrompt = 'You are a marketing content assistant. Provide concise, actionable suggestions.';

    const result = await generateWithAI(prompt, systemPrompt, 500);
    res.json({
      suggestions: result.content.split('\n').filter((s: string) => s.trim()),
      provider: result.provider,
    });
  } catch (error: any) {
    res.json({
      suggestions: [
        'Suggestion 1 based on context',
        'Suggestion 2 based on context',
        'Suggestion 3 based on context',
      ],
    });
  }
});

// Analyze data
router.post('/analyze', requireRole('admin', 'editor'), async (req: Request, res: Response) => {
  try {
    const { data, analysisType } = req.body;

    const prompt = `Analyze the following data and provide insights:\n\n${JSON.stringify(data, null, 2)}`;
    const systemPrompt = 'You are a data analyst. Provide clear, actionable insights.';

    const result = await generateWithAI(prompt, systemPrompt, 1000);
    res.json({
      analysis: result.content,
      type: analysisType,
      provider: result.provider,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

export default router;