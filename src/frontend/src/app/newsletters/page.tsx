'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function NewslettersRoute() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Newsletters</h1>
        <p className="text-slate-400">Email newsletters with bulk generation.</p>
        <div className="mt-8 p-8 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
          <p className="text-slate-500">Module under development. Check CLAUDE.md for implementation guide.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
