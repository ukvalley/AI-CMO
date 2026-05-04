'use client';

/**
 * /seo route — hosts BOTH trackers under one URL with a sub-menu tab toggle:
 *   · "SEO Strategy"   → 15-module SeoSystemPage
 *   · "GEO / AI Search" → 13-module GeoSystemPage  (sub-menu of SEO)
 *
 * Each tab keeps its own state (separate slot in dataStore), so progress
 * and approvals don't bleed between SEO and GEO.
 */

import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/cn';
import SeoSystemPage from '@/modules/marketing/seo-system/page';
import GeoSystemPage from '@/modules/marketing/geo-system/page';

type TabId = 'seo' | 'geo';

const TABS: Array<{
  id: TabId;
  label: string;
  hint: string;
  icon: typeof Search;
  modules: number;
}> = [
  {
    id: 'seo',
    label: 'SEO Strategy',
    hint: 'Traditional search visibility',
    icon: Search,
    modules: 15,
  },
  {
    id: 'geo',
    label: 'GEO / AI Search',
    hint: 'Visibility in ChatGPT, Gemini, Perplexity',
    icon: Sparkles,
    modules: 13,
  },
];

export default function SeoRoute() {
  const [tab, setTab] = useState<TabId>('seo');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Sub-menu tabs */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-slate-700 bg-slate-800/40 p-1.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex-1 min-w-[200px] rounded-lg px-4 py-3 text-left transition-all',
                  active
                    ? 'bg-primary-500/15 ring-1 ring-primary-500/40'
                    : 'hover:bg-slate-700/50'
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0',
                      active ? 'text-primary-400' : 'text-slate-500'
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      active ? 'text-primary-300' : 'text-slate-200'
                    )}
                  >
                    {t.label}
                  </span>
                  <span
                    className={cn(
                      'ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-mono',
                      active
                        ? 'bg-primary-500/20 text-primary-300'
                        : 'bg-slate-700 text-slate-400'
                    )}
                  >
                    {t.modules} modules
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{t.hint}</p>
              </button>
            );
          })}
        </div>

        {/* Active tab content */}
        {tab === 'seo' ? <SeoSystemPage /> : <GeoSystemPage />}
      </div>
    </DashboardLayout>
  );
}
