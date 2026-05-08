/**
 * AI Chat Panel Component
 *
 * Persistent AI assistant chat panel always visible on the right side.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Sparkles, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useChatStore } from '@/stores';

export function AIChatPanel() {
  const {
    isOpen,
    isLoading,
    toggle,
    sendMessage,
    getMessages,
  } = useChatStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = getMessages();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggle}
        className="fixed right-4 bottom-4 z-40 w-14 h-14 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] rounded-full shadow-[0_0_20px_rgba(200,255,46,0.4)] flex items-center justify-center transition-all"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-16 bottom-0 w-[320px] bg-[#0d1117] border-l border-white/10 z-40 flex flex-col">
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center border border-[#C8FF2E]/20">
            <Sparkles className="w-4 h-4 text-[#C8FF2E]" />
          </div>
          <div>
            <span className="font-medium text-white">AI Assistant</span>
            <span className="ml-2 text-xs text-[#C8FF2E]">Online</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 text-[#878e9a] p-0" onClick={toggle}>
          <Minimize2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-[#686f7e] mt-8">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#C8FF2E]/50" />
            <p>How can I help you today? Ask me about any marketing task.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-2',
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                  msg.role === 'user'
                    ? 'bg-[#C8FF2E] text-[#0d1117] font-medium'
                    : 'bg-[#1a1d21] text-[#afb6c4]'
                )}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-2">
            <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-[#1a1d21] text-[#afb6c4]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#C8FF2E] rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-[#C8FF2E] rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-[#C8FF2E] rounded-full animate-bounce delay-200" />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Mengo..."
            rows={1}
            className="flex-1 bg-[#1a1d21] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#686f7e] resize-none focus:outline-none focus:border-[#C8FF2E]/50"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
