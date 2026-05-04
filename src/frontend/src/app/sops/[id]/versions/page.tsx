'use client';

/**
 * SOP Version History
 *
 * Browse the snapshots captured each time an SOP was published, side-by-side
 * with the current version. Supports restoring a previous version into the
 * working SOP.
 */

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, History, RotateCcw, Eye, Diff } from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useDataStore } from '@/stores';
import type { SOP, SOPVersionSnapshot } from '@/types/entities';
import { SopRenderer } from '@/components/sop/SopRenderer';

export default function SopVersionsRoute() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || '';
  const { getItems, updateItem } = useDataStore();
  const sops = (getItems('sops') as SOP[]) || [];
  const sop = useMemo(() => sops.find((s) => s.id === id) || null, [sops, id]);

  const versions = useMemo(() => {
    const list = (sop?.versions || []).slice();
    list.reverse(); // newest first
    return list;
  }, [sop]);

  const [selected, setSelected] = useState<SOPVersionSnapshot | null>(null);

  if (!sop) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-10 text-center">
          <p className="text-slate-400">SOP not found.</p>
          <Button className="mt-4" variant="secondary" onClick={() => router.push('/sops')}>
            Back to library
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleRestore = (snap: SOPVersionSnapshot) => {
    if (!window.confirm(`Restore version ${snap.versionLabel}? Current content will be replaced.`)) return;
    updateItem('sops', sop.id, {
      content: JSON.parse(JSON.stringify(snap.content)),
      versionLabel: snap.versionLabel,
    });
    router.push(`/sops/${sop.id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/sops/${sop.id}`)}
            className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold text-white">
              <History className="h-5 w-5 text-slate-400" />
              Version history
            </h1>
            <p className="text-sm text-slate-400">{sop.title}</p>
          </div>
        </div>

        {versions.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-700 bg-slate-800/30 p-10 text-center">
            <History className="mb-3 h-7 w-7 text-slate-500" />
            <h3 className="text-base font-medium text-slate-200">No snapshots yet</h3>
            <p className="mt-1 max-w-md text-sm text-slate-400">
              Snapshots are captured each time you publish (Save &amp; publish). The current draft
              isn&apos;t a snapshot — it&apos;s the live working copy.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-2 lg:sticky lg:top-4 lg:self-start">
              {versions.map((v, i) => {
                const isSelected = selected === v;
                return (
                  <button
                    key={v.publishedAt + v.versionLabel}
                    onClick={() => setSelected(isSelected ? null : v)}
                    className={
                      'w-full rounded-lg border p-3 text-left transition-colors ' +
                      (isSelected
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-slate-700 bg-slate-800/40 hover:border-primary-500/60')
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-200">{v.versionLabel}</span>
                      {i === 0 && (
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] uppercase text-emerald-300">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {new Date(v.publishedAt).toLocaleString()}
                    </div>
                    {v.note && (
                      <div className="mt-1 line-clamp-2 text-xs text-slate-400">{v.note}</div>
                    )}
                  </button>
                );
              })}
            </aside>

            <main className="min-w-0">
              {selected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3">
                    <div>
                      <span className="text-sm font-medium text-slate-200">
                        Viewing {selected.versionLabel}
                      </span>
                      <span className="ml-2 text-xs text-slate-500">
                        {new Date(selected.publishedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" onClick={() => setSelected(null)}>
                        <Eye className="mr-1.5 h-4 w-4" />
                        Show current
                      </Button>
                      <Button variant="secondary" onClick={() => handleRestore(selected)}>
                        <RotateCcw className="mr-1.5 h-4 w-4" />
                        Restore
                      </Button>
                    </div>
                  </div>
                  <SopRenderer content={selected.content} />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/30 p-10 text-center">
                  <Diff className="mx-auto mb-2 h-6 w-6 text-slate-500" />
                  <p className="text-sm text-slate-400">
                    Select a version on the left to preview it. Click <strong>Restore</strong> to
                    replace the current content with that snapshot.
                  </p>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
