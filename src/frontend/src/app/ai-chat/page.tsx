'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function AiChatRoute() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">AI Chat</h1>
        <p className="text-slate-400">Persistent AI assistant chat panel.</p>
        <div className="mt-8 p-8 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
          <p className="text-slate-500">The AI Chat panel is always available on the right side of every page.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
