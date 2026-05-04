'use client';

/**
 * AIO (AI-Optimized) System — main page (24 modules).
 * Mounted as a sub-tab inside /seo. Reuses SectionForm.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Download,
  FileText,
  Lock,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui';
import { SectionForm } from '@/modules/website/website-project/SectionForm';
import { useAioSystem } from './useAioSystem';
import {
  AIO_GROUP_ORDER,
  AIO_SECTIONS,
  aioSectionFilledRatio,
  type SectionDef,
} from './sections.config';

function HealthDashboard({
  total,
  completed,
  inProgress,
  blocked,
  overallPct,
}: {
  total: number;
  completed: number;
  inProgress: number;
  blocked: number;
  overallPct: number;
}) {
  const cards = [
    { label: 'Total modules', value: total, tone: 'slate' as const },
    { label: 'Completed', value: completed, tone: 'emerald' as const },
    { label: 'In progress', value: inProgress, tone: 'sky' as const },
    { label: 'Blocked', value: blocked, tone: 'red' as const },
  ];
  const tones = {
    slate: 'bg-slate-800/60 border-slate-700 text-slate-200',
    emerald: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
    sky: 'bg-sky-500/10 border-sky-500/40 text-sky-300',
    red: 'bg-red-500/10 border-red-500/40 text-red-300',
  };

  return (
    <section className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/70 to-slate-900/70 p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary-400" />
          <h2 className="font-semibold text-white">AIO System Health</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Overall completion</span>
          <span className="font-mono font-semibold text-primary-400">{overallPct}%</span>
        </div>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 transition-all"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {cards.map((c) => (
          <div
            key={c.label}
            className={cn('rounded-lg border px-3 py-3 flex flex-col gap-0.5', tones[c.tone])}
          >
            <span className="text-2xl font-semibold tabular-nums">{c.value}</span>
            <span className="text-xs uppercase tracking-wider opacity-80">{c.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MasterDocSection({
  brand,
  project,
  onBumpVersion,
}: {
  brand: string;
  project: any;
  onBumpVersion: () => void;
}) {
  const generateMarkdown = (): string => {
    const lines: string[] = [];
    lines.push(`# AIO Master Document`);
    if (project?.name) lines.push(`**Programme:** ${project.name}`);
    if (project?.client) lines.push(`**Client / brand:** ${project.client}`);
    lines.push(
      `*Version ${(project?.masterDocVersion ?? 0) + 1} · generated ${new Date().toISOString()}*`
    );
    lines.push('');
    for (const groupName of AIO_GROUP_ORDER) {
      const inGroup = AIO_SECTIONS.filter((s) => s.group === groupName);
      if (inGroup.length === 0) continue;
      lines.push(`## ${groupName}`);
      for (const sec of inGroup) {
        const state = project?.sections?.[sec.id];
        const data = state?.data ?? {};
        const lock = state?.approved ? '🔒' : '⬜';
        const status = state?.status ?? 'not-started';
        lines.push(`### ${lock} ${sec.step}. ${sec.title}  *(${status})*`);
        const fields = [...sec.fields, ...(sec.advancedFields ?? [])];
        for (const f of fields) {
          const v = data[f.key];
          const display =
            v === undefined || v === null || v === ''
              ? '—'
              : Array.isArray(v)
                ? v.join(', ') || '—'
                : typeof v === 'boolean'
                  ? v
                    ? 'Yes'
                    : 'No'
                  : String(v);
          lines.push(`- **${f.label}:** ${display}`);
        }
        lines.push('');
      }
    }
    lines.push(`---`);
    lines.push(`Approval log: ${(project?.approvalLog ?? []).length} entries.`);
    return lines.join('\n');
  };

  const downloadFile = (filename: string, content: string, mime = 'text/plain') => {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const onExportMd = () => {
    onBumpVersion();
    downloadFile(
      `${brand || 'aio-system'}-v${(project?.masterDocVersion ?? 0) + 1}.md`,
      generateMarkdown(),
      'text/markdown'
    );
  };

  const onExportJson = () => {
    downloadFile(
      `${brand || 'aio-system'}-v${(project?.masterDocVersion ?? 0) + 1}.json`,
      JSON.stringify(project, null, 2),
      'application/json'
    );
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-400" />
          <h3 className="font-semibold text-white">Master AIO Playbook</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExportMd}
            className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Download className="w-3.5 h-3.5" /> Export .md
          </button>
          <button
            onClick={onExportJson}
            className="inline-flex items-center gap-2 rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-600"
          >
            <FileText className="w-3.5 h-3.5" /> JSON
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-400">
        Captures every AIO section into one shareable playbook.{' '}
        <span className="font-mono text-slate-300">v{project?.masterDocVersion ?? 0}</span>
        {project?.masterDocLockedAt && (
          <>
            {' · '}last exported{' '}
            <span className="font-mono text-slate-300">
              {new Date(project.masterDocLockedAt).toLocaleString()}
            </span>
          </>
        )}
      </p>
    </div>
  );
}

export default function AioSystemPage() {
  const {
    project,
    activeCompanyId,
    ensureProject,
    updateRoot,
    updateField,
    setStatus,
    toggleApproval,
  } = useAioSystem();
  const [activeId, setActiveId] = useState<string>(AIO_SECTIONS[0].id);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && activeCompanyId) {
      try {
        ensureProject();
      } catch {
        /* no active company yet */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, activeCompanyId]);

  useEffect(() => {
    if (!mounted) return;
    const el = document.getElementById(`aio-section-${activeId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeId, mounted]);

  const stats = useMemo(() => {
    const sections = project?.sections ?? {};
    let completed = 0;
    let inProgress = 0;
    let blocked = 0;
    let approvedCount = 0;
    let totalRatio = 0;
    for (const sec of AIO_SECTIONS) {
      const st = sections[sec.id];
      const status = st?.status ?? 'not-started';
      if (status === 'completed') completed++;
      else if (status === 'in-progress' || status === 'review') inProgress++;
      else if (status === 'blocked') blocked++;
      if (st?.approved) approvedCount++;
      totalRatio += aioSectionFilledRatio(sec, st?.data);
    }
    const overallPct = Math.round((totalRatio / AIO_SECTIONS.length) * 100);
    return { completed, inProgress, blocked, approvedCount, overallPct };
  }, [project]);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6 animate-pulse h-32" />
    );
  }

  if (!activeCompanyId || !project) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center text-slate-400">
        Pick a company in the sidebar to start an AIO programme.
      </div>
    );
  }

  const groupedNav = AIO_GROUP_ORDER.map((group) => ({
    group,
    sections: AIO_SECTIONS.filter((s) => s.group === group),
  })).filter((g) => g.sections.length > 0);

  const filterSection = (s: SectionDef) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.id.includes(q) ||
      s.step.includes(q)
    );
  };

  return (
    <div>
      <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">AIO — AI-Optimized System</h2>
          <p className="mt-1 text-slate-400">
            24 modules from foundation audit through entity authority, citations, hallucination
            management, and AI agent readiness.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-end">
          <div className="md:w-56">
            <Input
              value={project.name ?? ''}
              onChange={(e) => updateRoot({ name: e.target.value })}
              placeholder="e.g. AIO 2026 programme"
              label="Programme name"
            />
          </div>
          <div className="md:w-56">
            <Input
              value={project.client ?? ''}
              onChange={(e) => updateRoot({ client: e.target.value })}
              placeholder="Client / brand"
              label="Client"
            />
          </div>
        </div>
      </div>

      <HealthDashboard
        total={AIO_SECTIONS.length}
        completed={stats.completed}
        inProgress={stats.inProgress}
        blocked={stats.blocked}
        overallPct={stats.overallPct}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="lg:sticky lg:top-4 self-start rounded-xl border border-slate-700 bg-slate-800/40 p-2 max-h-[calc(100vh-3rem)] overflow-y-auto">
          <div className="px-2 pt-1.5 pb-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter modules…"
              className="w-full rounded-md bg-slate-900 border border-slate-700 text-sm text-slate-200 placeholder:text-slate-500 px-2 py-1.5 focus:outline-none focus:border-primary-500"
            />
          </div>
          {groupedNav.map((g) => {
            const visible = g.sections.filter(filterSection);
            if (visible.length === 0) return null;
            return (
              <div key={g.group} className="mb-1">
                <div className="px-2.5 pt-2 pb-1 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  {g.group}
                </div>
                <div className="flex flex-col gap-0.5">
                  {visible.map((s) => {
                    const state = project.sections?.[s.id];
                    const ratio = aioSectionFilledRatio(s, state?.data);
                    const Icon = s.icon;
                    const active = activeId === s.id;
                    const locked = !!state?.approved;
                    const status = state?.status ?? 'not-started';
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActiveId(s.id)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                          active
                            ? 'bg-primary-500/15 text-primary-300'
                            : 'text-slate-300 hover:bg-slate-700/50'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-4 h-4 shrink-0',
                            active ? 'text-primary-400' : 'text-slate-500'
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] text-slate-500">
                              {s.step}
                            </span>
                            <span className="truncate">{s.title}</span>
                          </div>
                          <div className="mt-1 h-1 rounded-full bg-slate-700 overflow-hidden">
                            <div
                              className={cn(
                                'h-full transition-all',
                                locked
                                  ? 'bg-emerald-400'
                                  : status === 'completed'
                                    ? 'bg-emerald-400'
                                    : status === 'blocked'
                                      ? 'bg-red-400'
                                      : 'bg-primary-500'
                              )}
                              style={{ width: `${Math.round(ratio * 100)}%` }}
                            />
                          </div>
                        </div>
                        {locked && <Lock className="w-3 h-3 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </aside>

        <div className="space-y-6">
          {AIO_SECTIONS.map((s) => (
            <div key={s.id} id={`aio-section-${s.id}`}>
              <SectionForm
                section={s}
                state={project.sections?.[s.id]}
                onUpdateField={(key, value) => updateField(s.id, key, value)}
                onSetStatus={(status) => setStatus(s.id, status)}
                onToggleApproval={() => toggleApproval(s.id, 'CEO', s.title)}
              />
            </div>
          ))}

          <MasterDocSection
            brand={project.name ?? ''}
            project={project}
            onBumpVersion={() => {
              const v = (project.masterDocVersion ?? 0) + 1;
              updateRoot({
                masterDocVersion: v,
                masterDocLockedAt: new Date().toISOString(),
              });
            }}
          />

          <div className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary-400" />
              <h3 className="font-semibold text-white">Approval Log</h3>
              <span className="ml-auto text-xs text-slate-500">
                {(project.approvalLog ?? []).length} entries
              </span>
            </div>
            {(project.approvalLog ?? []).length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No approvals yet — lock any section to start the audit trail.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">When</th>
                    <th className="text-left px-3 py-2 font-medium">Role</th>
                    <th className="text-left px-3 py-2 font-medium">Section</th>
                  </tr>
                </thead>
                <tbody>
                  {(project.approvalLog ?? []).map((entry) => (
                    <tr key={entry.id} className="border-t border-slate-700/60 text-slate-300">
                      <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">{entry.role}</td>
                      <td className="px-3 py-2">{entry.section}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="text-xs text-slate-500 text-center pt-2 pb-8">
            AIO System · {AIO_SECTIONS.length} modules · {stats.completed} completed
            · {stats.approvedCount} locked
          </div>
        </div>
      </div>
    </div>
  );
}
