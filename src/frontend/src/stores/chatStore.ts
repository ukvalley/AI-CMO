/**
 * Chat Store
 *
 * Manages AI chat sessions and messages.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, ChatSession } from '@/types/entities';

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isOpen: boolean;
  isLoading: boolean;
}

interface ChatStore extends ChatState {
  // Actions
  toggle: () => void;
  open: () => void;
  close: () => void;
  createSession: (companyId: string) => string;
  setActiveSession: (id: string) => void;
  sendMessage: (content: string, moduleId?: string, context?: Record<string, unknown>) => void;
  clearSession: (id: string) => void;
  deleteSession: (id: string) => void;
  getActiveSession: () => ChatSession | undefined;
  getMessages: () => ChatMessage[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [],
      activeSessionId: null,
      isOpen: true, // Always visible by default
      isLoading: false,

      // Actions
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      createSession: (companyId) => {
        const id = `chat-${Date.now()}`;
        const newSession: ChatSession = {
          id,
          companyId,
          messages: [
            {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content: 'Hello! I\'m your AI CMO assistant. How can I help you with your marketing today?',
              timestamp: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
          activeSessionId: id,
        }));

        return id;
      },

      setActiveSession: (id) => {
        set({ activeSessionId: id });
      },

      sendMessage: (content, moduleId, context) => {
        const { activeSessionId, sessions } = get();
        if (!activeSessionId) return;

        const userMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
          moduleId,
          context,
        };

        // Add user message
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  messages: [...s.messages, userMessage],
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
          isLoading: true,
        }));

        // Simulate AI response
        setTimeout(() => {
          const assistantMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: generateAIResponse(content, moduleId, context),
            timestamp: new Date().toISOString(),
            moduleId,
            context,
          };

          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === activeSessionId
                ? {
                    ...s,
                    messages: [...s.messages, assistantMessage],
                    updatedAt: new Date().toISOString(),
                  }
                : s
            ),
            isLoading: false,
          }));
        }, 1000);
      },

      clearSession: (id) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  messages: [
                    {
                      id: `msg-${Date.now()}`,
                      role: 'assistant',
                      content: 'Session cleared. How can I help you?',
                      timestamp: new Date().toISOString(),
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        }));
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          activeSessionId:
            state.activeSessionId === id
              ? state.sessions.find((s) => s.id !== id)?.id || null
              : state.activeSessionId,
        }));
      },

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find((s) => s.id === activeSessionId);
      },

      getMessages: () => {
        const session = get().getActiveSession();
        return session?.messages || [];
      },
    }),
    {
      name: 'ai-cmo-chat',
      partialize: (state) => ({
        sessions: state.sessions.slice(-10), // Keep last 10 sessions
        activeSessionId: state.activeSessionId,
        isOpen: state.isOpen,
      }),
    }
  )
);

// Simple AI response generator (placeholder)
function generateAIResponse(
  content: string,
  moduleId?: string,
  context?: Record<string, unknown>
): string {
  const responses = [
    "I can help you with that! Let me analyze your request and provide recommendations based on your business profile.",
    "That's a great marketing challenge. Based on your industry and target audience, I'd suggest focusing on content marketing and SEO optimization.",
    "I understand. Let me generate some ideas for your campaign. Would you like me to create specific content for any particular platform?",
    "Interesting question! Your brand voice suggests a professional yet approachable tone. Here's my recommendation...",
    "I can assist with that. Based on your current business stage and goals, here are some actionable steps...",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
