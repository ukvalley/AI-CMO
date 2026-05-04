'use client';

/**
 * SOP Insights Dashboard
 *
 * Daily-glance view: KPI counts, what needs attention, category coverage,
 * recent activity, and (optionally) the visual node map.
 */

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ClipboardList,
  PenLine,
  Eye,
  CheckCircle2,
  Archive,
  Star,
  AlertTriangle,
  Clock,
  ShieldAlert,
  TrendingUp,
  Network,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useDataStore } from '@/stores';
import type { SOP, SOPStatus, SOPCategory } from '@/types/entities';
import {
  SOP_CATEGORIES,
  SOP_STATUS_BADGE,
  SOP_STATUS_LABELS,
  SOP_PRIORITY_BADGE,
  SOP_PRIORITY_LABELS,
} from '@/lib/sopConstants';
import { SopSubNav } from '@/components/sop/SopSubNav';
import { useSopPrefs } from '@/hooks/useSopPrefs';

// Days threshold for "expiring soon" / "review due"
const SOON_DAYS = 30;

export default function SopInsightsRoute() {
  const router = useRouter();
  const { getItems } = useDataStore();
  const sops = (getItems('sops') as SOP[]) || [];
  const prefs = useSopPrefs();

  // ── KPI counts ──
  const counts = useMemo(() => {
    const out = {
      total: sops.length,
      draft: 0,
      in_review: 0,
      approved: 0,
      published: 0,
      archived: 0,
      critical: 0,
      favourites: prefs.favourites.length,
    };
    sops.forEach((s) => {
      if (s.status) out[s.status]++;
      if (s.isCritical) out.critical++;
    });
    return out;
  }, [sops, prefs.favourites]);

  // ── Attention bucket ──
  const now = Date.now();
  const soonMs = SOON_DAYS * 24 * 60 * 60 * 1000;

  const reviewDue = useMemo(
    () =>
      sops.filter(
        (s) => s.nextReviewAt && new Date(s.nextReviewAt).getTime() <= now
      ),
    [sops, now]
  );

  const expiringSoon = useMemo(
    () =>
      sops.filter((s) => {
        if (!s.expiresAt) return false;
        const t = new Date(s.expiresAt).getTime();
        return t > now && t - now <= soonMs;
      }),
    [sops, now, soonMs]
  );

  const expired = useMemo(
    () =>
      sops.filter((s) => {
        if (!s.expiresAt) return false;
        return new Date(s.expiresAt).getTime() <= now;
      }),
    [sops, now]
  );

  const stillDraft = useMemo(
    () => sops.filter((s) => s.status === 'draft' && s.isCritical),
    [sops]
  );

  const attentionTotal =
    reviewDue.length + expiringSoon.length + expired.length + stillDraft.length;

  // ── Category coverage ──
  const coverage = useMemo(() => {
    const map = new Map<SOPCategory, number>();
    SOP_CATEGORIES.forEach((c) => map.set(c, 0));
    sops.forEach((s) => {
      if (s.category && map.has(s.category as SOPCategory)) {
        map.set(s.category as SOPCategory, (map.get(s.category as SOPCategory) || 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([category, count]) => ({ category, count }));
  }, [sops]);

  const coverageGaps = coverage.filter((c) => c.count === 0).length;

  // ── Recent activity ──
  const recent = useMemo(() => {
    return [...sops]
      .filter((s) => s.updatedAt)
      .sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);
  }, [sops]);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-white">Insights</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Daily glance — counts, what needs attention, coverage gaps and recent activity.
          </p>
        </div>

        <SopSubNav active="map" />

        {/* KPI ROW */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Stat
            label="Total"
            value={counts.total}
            icon={ClipboardList}
            tone="primary"
            onClick={() => router.push('/sops')}
          />
          <Stat
            label="Drafts"
            value={counts.draft}
            icon={PenLine}
            tone="slate"
            onClick={() => router.push('/sops')}
          />
          <Stat
            label="In Review"
            value={counts.in_review}
            icon={Eye}
            tone="amber"
            onClick={() => router.push('/sops')}
          />
          <Stat
            label="Published"
            value={counts.published}
            icon={CheckCircle2}
            tone="emerald"
            onClick={() => router.push('/sops')}
          />
          <Stat label="Archived" value={counts.archived} icon={Archive} tone="rose" />
          <Stat label="Favourites" value={counts.favourites} icon={Star} tone="amber" />
        </div>

        {/* ATTENTION + RECENT */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* ATTENTION */}
          <Section
            title="Needs your attention"
            count={attentionTotal}
            icon={AlertTriangle}
            empty={
              attentionTotal === 0
                ? sops.length === 0
                  ? 'No SOPs yet — create one to get started.'
                  : 'All clear. Nothing needs review or is expiring soon.'
                : undefined
            }
          >
            <AttentionGroup
              icon={Clock}
              tone="amber"
              label="Review due"
              sops={reviewDue}
              router={router}
              suffix={(s) => formatDate(s.nextReviewAt)}
            />
            <AttentionGroup
              icon={Clock}
              tone="rose"
              label={`Expiring in ${SOON_DAYS} days`}
              sops={expiringSoon}
              router={router}
              suffix={(s) => formatDate(s.expiresAt)}
            />
            <AttentionGroup
              icon={ShieldAlert}
              tone="rose"
              label="Already expired"
              sops={expired}
              router={router}
              suffix={(s) => formatDate(s.expiresAt)}
            />
            <AttentionGroup
              icon={ShieldAlert}
              tone="amber"
              label="Critical SOPs still in draft"
              sops={stillDraft}
              router={router}
            />
          </Section>

          {/* RECENT ACTIVITY */}
          <Section title="Recent activity" count={recent.length} icon={TrendingUp}>
            {recent.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-slate-500">
                No activity yet. Edit any SOP to see it here.
              </p>
            ) : (
              <ul className="divide-y divide-slate-700/60">
                {recent.map((sop) => {
                  const status = (sop.status || 'draft') as SOPStatus;
                  const priority = sop.priority || 'low';
                  return (
                    <li key={sop.id}>
                      <Link
                        href={`/sops/${sop.id}`}
                        className="group flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/60"
                      >
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${SOP_STATUS_BADGE[status]}`}
                        >
                          {SOP_STATUS_LABELS[status]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-slate-200 group-hover:text-primary-300">
                            {sop.title || sop.name || 'Untitled SOP'}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {sop.category && <span>{sop.category} · </span>}
                            {formatRelative(sop.updatedAt)}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] uppercase ${SOP_PRIORITY_BADGE[priority]}`}
                        >
                          {SOP_PRIORITY_LABELS[priority]}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600 group-hover:text-slate-400" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        </div>

        {/* CATEGORY COVERAGE */}
        <Section
          title="Category coverage"
          count={SOP_CATEGORIES.length - coverageGaps}
          subtitle={`${coverageGaps} categories without any SOP yet`}
          icon={Network}
        >
          <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {coverage.map(({ category, count }) => (
              <Link
                key={category}
                href={`/sops`}
                className={
                  'group flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors ' +
                  (count === 0
                    ? 'border-slate-700/60 bg-slate-800/30 text-slate-500'
                    : 'border-slate-700 bg-slate-800/60 text-slate-200 hover:border-primary-500/60')
                }
              >
                <span className="truncate">{category}</span>
                <span
                  className={
                    'rounded-full px-1.5 py-0.5 text-[10px] ' +
                    (count === 0
                      ? 'bg-slate-700/40 text-slate-500'
                      : 'bg-primary-500/15 text-primary-300 group-hover:bg-primary-500/30')
                  }
                >
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </Section>

        {/* VISUAL MAP (collapsed by default) */}
        {sops.length > 0 && <NodeMap sops={sops} />}
      </div>
    </DashboardLayout>
  );
}

// ============================================
// STAT CARD
// ============================================

const TONE: Record<string, { bg: string; ring: string; text: string }> = {
  primary: {
    bg: 'bg-primary-500/15',
    ring: 'ring-primary-500/30',
    text: 'text-primary-300',
  },
  slate: { bg: 'bg-slate-700/40', ring: 'ring-slate-600/40', text: 'text-slate-300' },
  amber: { bg: 'bg-amber-500/15', ring: 'ring-amber-500/30', text: 'text-amber-300' },
  emerald: {
    bg: 'bg-emerald-500/15',
    ring: 'ring-emerald-500/30',
    text: 'text-emerald-300',
  },
  rose: { bg: 'bg-rose-500/15', ring: 'ring-rose-500/30', text: 'text-rose-300' },
};

function Stat({
  label,
  value,
  icon: Icon,
  tone,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: keyof typeof TONE;
  onClick?: () => void;
}) {
  const t = TONE[tone];
  const inner = (
    <div className="flex h-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/40 p-4 transition-colors hover:border-slate-600">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{value}</p>
      </div>
      <div className={`shrink-0 rounded-lg p-2 ring-1 ${t.bg} ${t.ring} ${t.text}`}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );
  if (onClick) {
    return (
      <button onClick={onClick} className="group text-left">
        {inner}
      </button>
    );
  }
  return inner;
}

// ============================================
// SECTION SHELL
// ============================================

function Section({
  title,
  subtitle,
  count,
  icon: Icon,
  children,
  empty,
}: {
  title: string;
  subtitle?: string;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  empty?: string;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/40">
      <header className="flex items-center justify-between border-b border-slate-700/60 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 text-slate-400" />
          <h2 className="truncate text-sm font-semibold text-slate-200">{title}</h2>
          {typeof count === 'number' && (
            <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
              {count}
            </span>
          )}
        </div>
        {subtitle && <span className="hidden text-[11px] text-slate-500 sm:inline">{subtitle}</span>}
      </header>
      <div>
        {empty ? (
          <p className="px-3 py-6 text-center text-sm text-slate-500">{empty}</p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

// ============================================
// ATTENTION GROUP
// ============================================

function AttentionGroup({
  icon: Icon,
  tone,
  label,
  sops,
  router,
  suffix,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: 'amber' | 'rose';
  label: string;
  sops: SOP[];
  router: ReturnType<typeof useRouter>;
  suffix?: (s: SOP) => string;
}) {
  if (sops.length === 0) return null;
  const t = TONE[tone];
  return (
    <div className="border-b border-slate-700/40 last:border-b-0">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className={`rounded p-1 ${t.bg} ${t.text}`}>
          <Icon className="h-3 w-3" />
        </span>
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">
          {sops.length}
        </span>
      </div>
      <ul className="pb-2">
        {sops.slice(0, 4).map((sop) => (
          <li key={sop.id}>
            <button
              onClick={() => router.push(`/sops/${sop.id}`)}
              className="group flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-slate-800/60"
            >
              <span className="min-w-0 flex-1 truncate text-slate-200 group-hover:text-primary-300">
                {sop.title || sop.name}
              </span>
              {suffix && (
                <span className="shrink-0 text-[11px] text-slate-500">{suffix(sop)}</span>
              )}
              <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-600 group-hover:text-slate-400" />
            </button>
          </li>
        ))}
        {sops.length > 4 && (
          <li className="px-3 py-1 text-[11px] text-slate-500">
            …and {sops.length - 4} more
          </li>
        )}
      </ul>
    </div>
  );
}

// ============================================
// VISUAL NODE MAP (collapsible)
// ============================================

function NodeMap({ sops }: { sops: SOP[] }) {
  const [open, setOpen] = useState(false);
  const grouped = useMemo(() => {
    const out: Record<string, SOP[]> = { Uncategorised: [] };
    SOP_CATEGORIES.forEach((c) => (out[c] = []));
    sops.forEach((sop) => {
      const key = sop.category || 'Uncategorised';
      if (!out[key]) out[key] = [];
      out[key].push(sop);
    });
    return Object.entries(out).filter(([, list]) => list.length > 0);
  }, [sops]);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border-b border-slate-700/60 px-4 py-3 text-left transition-colors hover:bg-slate-800/60"
      >
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-200">Visual map</h2>
          <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
            {sops.length}
          </span>
        </div>
        <span className="text-xs text-slate-500">{open ? 'Hide' : 'Show'}</span>
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
          {grouped.map(([category, list]) => (
            <div key={category} className="rounded-lg border border-slate-700/60 bg-slate-900/40 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">{category}</h3>
                <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                  {list.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {list.map((sop) => {
                  const status = (sop.status || 'draft') as SOPStatus;
                  return (
                    <Link
                      key={sop.id}
                      href={`/sops/${sop.id}`}
                      className="group flex max-w-[120px] flex-col items-center"
                      title={sop.title || sop.name}
                    >
                      <div
                        className={
                          'flex h-10 w-10 items-center justify-center rounded-full border-2 text-[10px] font-semibold transition-transform group-hover:scale-110 ' +
                          nodeColor(status)
                        }
                      >
                        {(sop.title || sop.name || '?').slice(0, 2).toUpperCase()}
                      </div>
                      <span className="mt-1 line-clamp-1 text-center text-[10px] text-slate-400 group-hover:text-primary-300">
                        {sop.title || sop.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function nodeColor(status: SOPStatus): string {
  switch (status) {
    case 'published':
      return 'border-emerald-500 bg-emerald-500/15 text-emerald-300';
    case 'approved':
      return 'border-blue-500 bg-blue-500/15 text-blue-300';
    case 'in_review':
      return 'border-amber-500 bg-amber-500/15 text-amber-300';
    case 'archived':
      return 'border-rose-500 bg-rose-500/15 text-rose-300';
    default:
      return 'border-slate-600 bg-slate-700/40 text-slate-300';
  }
}

// ============================================
// HELPERS
// ============================================

function formatDate(d?: string): string {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
}

function formatRelative(d?: string): string {
  if (!d) return '—';
  const diff = Date.now() - new Date(d).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 86400 * 7) return `${Math.floor(sec / 86400)}d ago`;
  return new Date(d).toLocaleDateString();
}
