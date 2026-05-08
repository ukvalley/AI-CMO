'use client';

/**
 * Brand Identity Direction — main module page (SOP 1.7)
 *
 * Renders all 13 modules:
 *  · Module 13 Health Dashboard (sticky overview at top)
 *  · Modules 1–9   The 9 SOP sections (forms with approval locks)
 *  · Module 10     Master Document Generator
 *  · Module 11     Rules Enforcement Engine
 *  · Module 12     Approval Workflow log
 *
 * Uses the singleton `brand` entity in the data store, hydrated lazily.
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  ScrollText,
  Drama,
  Megaphone,
  Heart,
  Eye,
  ShieldCheck,
  Lock,
  Users,
  TestTube2,
  FileCheck2,
  ShieldAlert,
  ListChecks,
  Activity,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBrand } from './useBrand';
import {
  AlignmentSection,
  ApprovalLogSection,
  DifferentiationSection,
  EmotionalSection,
  GuardrailsSection,
  MasterDocumentSection,
  PersonalitySection,
  PurposeSection,
  RulesEngineSection,
  ValidationSection,
  VisualSection,
  VoiceToneSection,
} from './sections';

// ---------- Section nav config ----------

interface NavEntry {
  id: string;
  step: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Returns true if this section has been approved/locked */
  isLocked: (b: any) => boolean;
  /** Returns 0..1 completion percentage */
  progress: (b: any) => number;
}

const NAV: NavEntry[] = [
  {
    id: 'purpose',
    step: '7.1',
    label: 'Purpose & Meaning',
    icon: Sparkles,
    isLocked: (b) => !!b?.purposeApprovedByCEO,
    progress: (b) => filledRatio([b?.purposeWhyExists, b?.purposeEmotionalProblem, b?.purposeForWhom, b?.purposeNotForWhom]),
  },
  {
    id: 'personality',
    step: '7.2',
    label: 'Personality',
    icon: Drama,
    isLocked: (b) => !!b?.personalityApprovedByCEO,
    progress: (b) =>
      filledRatio([
        (b?.personalityPrimary ?? []).length >= 3 ? 'x' : '',
        (b?.personalitySecondary ?? []).length >= 2 ? 'x' : '',
        b?.personalitySpeakStyle,
        b?.personalityUnderPressure,
      ]),
  },
  {
    id: 'voice',
    step: '7.3',
    label: 'Voice & Tone',
    icon: Megaphone,
    isLocked: (b) => !!b?.voiceApprovedByCEO && !!b?.voiceApprovedByMarketing,
    progress: (b) =>
      filledRatio([
        b?.voiceWritingStyle,
        b?.voiceVocabulary,
        b?.voiceWebsiteTone,
        b?.voiceSupportTone,
        b?.voiceSalesTone,
        b?.voiceCrisisTone,
      ]),
  },
  {
    id: 'emotional',
    step: '7.4',
    label: 'Emotional & Promise',
    icon: Heart,
    isLocked: (b) => !!b?.emotionalApprovedByCEO,
    progress: (b) =>
      filledRatio([
        b?.emotionalBenefit,
        b?.brandPromise,
        b?.promiseBelievable ? 'x' : '',
        b?.promiseDefensible ? 'x' : '',
        b?.promiseDeliverable ? 'x' : '',
      ]),
  },
  {
    id: 'visual',
    step: '7.5',
    label: 'Visual Direction',
    icon: Eye,
    isLocked: (b) => !!b?.visualApprovedByCEO,
    progress: (b) =>
      filledRatio([
        b?.visualTheme,
        b?.visualEra,
        b?.visualColourPsychology,
        b?.visualTypography,
        b?.visualImageryStyle,
      ]),
  },
  {
    id: 'differentiation',
    step: '7.6',
    label: 'Differentiation',
    icon: ShieldCheck,
    isLocked: (b) => !!b?.diffApprovedByCEO,
    progress: (b) =>
      filledRatio([
        b?.diffCompetitorVisualGap,
        b?.diffCompetitorMessagingGap,
        (b?.diffBrandSymbols ?? []).length > 0 ? 'x' : '',
        (b?.diffSignatureExpressions ?? []).length > 0 ? 'x' : '',
      ]),
  },
  {
    id: 'guardrails',
    step: '7.7',
    label: 'Guardrails',
    icon: Lock,
    isLocked: (b) => !!b?.guardApprovedByCEO,
    progress: (b) =>
      filledRatio([
        b?.guardCannotChange,
        b?.guardCanEvolve,
        b?.guardMisuseExamples,
        b?.guardApprovalWorkflow,
      ]),
  },
  {
    id: 'alignment',
    step: '7.8',
    label: 'Internal Alignment',
    icon: Users,
    isLocked: (b) => !!b?.alignApprovedByCEO && !!b?.alignApprovedByHR,
    progress: (b) =>
      filledRatio([
        b?.alignTrainingModules,
        b?.alignPerformanceMetrics,
        (b?.alignOnboardingChecklist ?? []).length > 0 ? 'x' : '',
        (b?.alignLeadershipChecklist ?? []).length > 0 ? 'x' : '',
      ]),
  },
  {
    id: 'validation',
    step: '7.9',
    label: 'Validation & Lock',
    icon: TestTube2,
    isLocked: (b) => !!b?.validFinalLockByCEO,
    progress: (b) =>
      filledRatio([
        b?.validCustomerFeedback,
        b?.validInternalFeedback,
        b?.validNeutralFeedback,
      ]),
  },
  {
    id: 'master',
    step: 'M10',
    label: 'Master Document',
    icon: FileCheck2,
    isLocked: (b) => (b?.masterDocVersion ?? 0) > 0,
    progress: (b) => ((b?.masterDocVersion ?? 0) > 0 ? 1 : 0),
  },
  {
    id: 'rules',
    step: 'M11',
    label: 'Rules Engine',
    icon: ShieldAlert,
    isLocked: () => false,
    progress: (b) =>
      filledRatio([
        (b?.rulesVoiceForbiddenWords ?? []).length > 0 ? 'x' : '',
        (b?.rulesDesignForbiddenPatterns ?? []).length > 0 ? 'x' : '',
      ]),
  },
  {
    id: 'approvals',
    step: 'M12',
    label: 'Approval Log',
    icon: ListChecks,
    isLocked: () => false,
    progress: (b) => ((b?.approvalLog ?? []).length > 0 ? 1 : 0),
  },
];

function filledRatio(values: Array<unknown>) {
  if (values.length === 0) return 0;
  const filled = values.filter((v) => {
    if (typeof v === 'string') return v.trim().length > 0;
    if (typeof v === 'boolean') return v === true;
    if (typeof v === 'number') return Number.isFinite(v);
    if (Array.isArray(v)) return v.length > 0;
    return !!v;
  }).length;
  return filled / values.length;
}

// ---------- Health Dashboard (Module 13) ----------

function HealthDashboard({ brand, total, locked }: { brand: any; total: number; locked: number }) {
  const cards = [
    {
      label: 'Personality defined?',
      ok: (brand?.personalityPrimary ?? []).length >= 3,
    },
    {
      label: 'Voice consistency?',
      ok: !!brand?.voiceWritingStyle && !!brand?.voiceWebsiteTone,
    },
    {
      label: 'Emotional promise clear?',
      ok: !!brand?.brandPromise && !!brand?.emotionalBenefit,
    },
    {
      label: 'Internal alignment done?',
      ok: !!brand?.alignApprovedByHR && !!brand?.alignApprovedByCEO,
    },
    {
      label: 'No misuse alerts?',
      ok: (brand?.rulesVoiceForbiddenWords ?? []).length > 0,
    },
  ];
  const overallPct = total === 0 ? 0 : Math.round((locked / total) * 100);
  return (
    <section className="rounded-xl border border-white/10 bg-gradient-to-br from-[#151920]/70 to-[#0d1117]/70 p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#C8FF2E]" />
          <h2 className="font-semibold text-white">Brand Health Dashboard</h2>
          <span className="text-xs uppercase tracking-wider text-[#686f7e]">Module 13</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#878e9a]">Overall lock progress</span>
          <span className="font-mono font-semibold text-[#C8FF2E]">{overallPct}%</span>
        </div>
      </div>

      <div className="h-2 w-full rounded-full bg-[#1a1d21] overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 transition-all"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
        {cards.map((c) => (
          <div
            key={c.label}
            className={cn(
              'rounded-lg border px-3 py-2.5 text-xs',
              c.ok
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/10 border-red-500/40 text-red-300'
            )}
          >
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  c.ok ? 'bg-emerald-400' : 'bg-red-400'
                )}
              />
              {c.ok ? 'Green' : 'Red'}
            </div>
            <div className="mt-1 text-[#afb6c4]/80">{c.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Page ----------

export default function BrandIdentityPage() {
  const { brand, update, ensureBrand, logApproval, activeCompanyId } = useBrand();
  const [activeId, setActiveId] = useState<string>('purpose');
  const [mounted, setMounted] = useState(false);

  // Avoid SSR hydration mismatch — persisted Zustand state is only available client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Persist a default brand record as soon as we have a company so changes survive refresh
  useEffect(() => {
    if (mounted && activeCompanyId) {
      try {
        ensureBrand();
      } catch {
        /* no active company yet */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, activeCompanyId]);

  const lockedCount = useMemo(
    () => NAV.filter((n) => n.isLocked(brand)).length,
    [brand]
  );

  // Auto-scroll the active section into view
  useEffect(() => {
    if (!mounted) return;
    const el = document.getElementById(`brand-section-${activeId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeId, mounted]);

  // SSR / pre-hydration: render a static skeleton with the same outer shell
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-white">Brand Identity Direction</h1>
          <p className="mt-1 text-[#878e9a]">
            SOP 1.7 — define, validate, and lock the brand once. Enforce it everywhere.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#1a1d21]/60 p-6">
          <div className="h-4 w-48 bg-[#21262d]/50 rounded animate-pulse" />
          <div className="mt-3 h-2 w-full bg-[#21262d]/40 rounded" />
        </div>
      </div>
    );
  }

  if (!activeCompanyId || !brand) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Brand Identity Direction</h1>
        <p className="text-[#878e9a]">
          Create or pick a company from the sidebar to start defining brand identity.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-white">Brand Identity Direction</h1>
        <p className="mt-1 text-[#878e9a]">
          SOP 1.7 — define, validate, and lock the brand once. Enforce it everywhere.
        </p>
      </div>

      {/* Health Dashboard */}
      <HealthDashboard brand={brand} total={NAV.length - 3 /* skip M11/M12/M10 from lock count */} locked={lockedCount} />

      {/* Two-column layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Section nav */}
        <aside className="lg:sticky lg:top-4 self-start rounded-xl border border-white/10 bg-[#1a1d21]/60 p-2">
          <nav className="flex flex-col gap-0.5">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = activeId === n.id;
              const locked = n.isLocked(brand);
              const pct = Math.round(n.progress(brand) * 100);
              return (
                <button
                  key={n.id}
                  onClick={() => setActiveId(n.id)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                    active
                      ? 'bg-[#C8FF2E]/15 text-primary-300'
                      : 'text-[#afb6c4] hover:bg-[#21262d]/50'
                  )}
                >
                  <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-[#C8FF2E]' : 'text-[#686f7e]')} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-[#686f7e]">{n.step}</span>
                      <span className="truncate">{n.label}</span>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-[#21262d] overflow-hidden">
                      <div
                        className={cn(
                          'h-full transition-all',
                          locked ? 'bg-emerald-400' : 'bg-primary-500'
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  {locked && <Lock className="w-3 h-3 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Sections */}
        <div className="space-y-6">
          <div id="brand-section-purpose">
            <PurposeSection brand={brand} update={update} logApproval={logApproval} />
          </div>
          <div id="brand-section-personality">
            <PersonalitySection brand={brand} update={update} logApproval={logApproval} />
          </div>
          <div id="brand-section-voice">
            <VoiceToneSection brand={brand} update={update} logApproval={logApproval} />
          </div>
          <div id="brand-section-emotional">
            <EmotionalSection brand={brand} update={update} logApproval={logApproval} />
          </div>
          <div id="brand-section-visual">
            <VisualSection brand={brand} update={update} logApproval={logApproval} />
          </div>
          <div id="brand-section-differentiation">
            <DifferentiationSection brand={brand} update={update} logApproval={logApproval} />
          </div>
          <div id="brand-section-guardrails">
            <GuardrailsSection brand={brand} update={update} logApproval={logApproval} />
          </div>
          <div id="brand-section-alignment">
            <AlignmentSection brand={brand} update={update} logApproval={logApproval} />
          </div>
          <div id="brand-section-validation">
            <ValidationSection brand={brand} update={update} logApproval={logApproval} />
          </div>
          <div id="brand-section-master">
            <MasterDocumentSection brand={brand} update={update} />
          </div>
          <div id="brand-section-rules">
            <RulesEngineSection brand={brand} update={update} />
          </div>
          <div id="brand-section-approvals">
            <ApprovalLogSection brand={brand} />
          </div>
          <ScrollText className="hidden" />
          <div className="muted text-xs text-[#686f7e] text-center pt-2 pb-8">
            Brand Governance · {NAV.length} modules · {lockedCount} locked
          </div>
        </div>
      </div>
    </div>
  );
}
