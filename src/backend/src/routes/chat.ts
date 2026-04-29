/**
 * Chat Routes
 * AI Chat Session Management
 */

import express, { Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Chat Message Interface
export interface IChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  moduleId?: string;
  context?: Record<string, unknown>;
}

// Chat Session Interface
export interface IChatSession extends Document {
  companyId: string;
  userId: string;
  messages: IChatMessage[];
  context: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>({
  companyId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  messages: [{
    id: String,
    role: { type: String, enum: ['user', 'assistant', 'system'] },
    content: String,
    timestamp: Date,
    moduleId: String,
    context: Schema.Types.Mixed,
  }],
  context: { type: Schema.Types.Mixed, default: {} },
}, {
  timestamps: true,
});

ChatSessionSchema.index({ companyId: 1, userId: 1 });

const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);

router.use(authenticate);

// Get chat session for company
router.get('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const userId = req.user!._id!.toString();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    let session = await ChatSession.findOne({ companyId, userId });

    if (!session) {
      session = new ChatSession({
        companyId,
        userId,
        messages: [],
        context: {},
      });
      await session.save();
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chat session' });
  }
});

// Add message to chat
router.post('/:companyId/messages', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const userId = req.user!._id!.toString();
    const { message, context } = req.body;

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    let session = await ChatSession.findOne({ companyId, userId });

    if (!session) {
      session = new ChatSession({
        companyId,
        userId,
        messages: [],
        context: context || {},
      });
    }

    session.messages.push({
      ...message,
      timestamp: new Date(),
    });

    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Clear chat history
router.delete('/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const userId = req.user!._id!.toString();

    if (!req.user!.companyIds.includes(companyId) && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await ChatSession.findOneAndDelete({ companyId, userId });

    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear chat' });
  }
});

export default router;
