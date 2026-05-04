'use client';

/**
 * Public SOP Share View
 *
 * Read-only render of a published SOP, accessible at /sops/share/[token]
 * without authentication. The token is generated and stored on the SOP
 * itself (sop.share.token); v1 looks it up from localStorage. When the
 * backend wires up, swap the lookup for /api/share/[token].
 */

import React, { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, ExternalLink, Lock, Printer } from 'lucide-react';

import { useDataStore } from '@/stores';
import type { SOP } from '@/types/entities';
import { SopRenderer } from '@/components/sop/SopRenderer';
import {
  SOP_STATUS_LABELS,
  buildDefaultHeader,
  buildDefaultSections,
} from '@/lib/sopConstants';

export default function SopShareRoute() {
  const params = useParams();
  const token = (params?.token as string) || '';
  const { getItems } = useDataStore();
  const sops = (getItems('sops') as SOP[]) || [];

  const sop = useMemo(() => sops.find((s) => s.share?.token === token) || null, [sops, token]);

  // Lock to white print-friendly theme on share view
  useEffect(() => {
    document.body.classList.add('sop-share-view');
    return () => document.body.classList.remove('sop-share-view');
  }, []);

  if (!sop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center">
        <div className="max-w-md">
          <Lock className="mx-auto mb-3 h-8 w-8 text-slate-500" />
          <h1 className="text-xl font-semibold text-white">Link invalid or expired</h1>
          <p className="mt-2 text-sm text-slate-400">
            The SOP behind this share link could not be found. Ask the owner to send you a fresh
            link.
          </p>
        </div>
      </div>
    );
  }

  const expired =
    sop.share?.expiresAt && new Date(sop.share.expiresAt).getTime() < Date.now();

  if (expired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center">
        <div className="max-w-md">
          <Lock className="mx-auto mb-3 h-8 w-8 text-rose-400" />
          <h1 className="text-xl font-semibold text-white">This share link has expired</h1>
          <p className="mt-2 text-sm text-slate-400">Ask the owner to send you a fresh link.</p>
        </div>
      </div>
    );
  }

  const title = sop.title || sop.name || 'Untitled SOP';
  const content =
    sop.content || {
      header: buildDefaultHeader(sop.department),
      sections: buildDefaultSections() as never,
    };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        {/* PUBLIC HEADER */}
        <header className="mb-6 flex items-center justify-between">
          <Link href="/sops" className="flex items-center gap-2 text-slate-400 hover:text-slate-200">
            <ClipboardList className="h-5 w-5" />
            <span className="text-sm">AI CMO · SOPs</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:border-primary-500/60"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / PDF
          </button>
        </header>

        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-300">
            <ExternalLink className="mr-1 inline h-3 w-3" />
            Shared read-only
          </span>
          {sop.versionLabel && (
            <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] uppercase text-slate-400">
              {sop.versionLabel}
            </span>
          )}
          {sop.status && (
            <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] uppercase text-slate-400">
              {SOP_STATUS_LABELS[sop.status]}
            </span>
          )}
        </div>

        <h1 className="mb-1 text-3xl font-semibold text-white">{title}</h1>
        <div className="mb-6 text-xs text-slate-500">
          {sop.category && <span>{sop.category}</span>}
          {sop.department && <span> · {sop.department}</span>}
          {sop.owner && <span> · Owner: {sop.owner}</span>}
        </div>

        <SopRenderer content={content} />

        <footer className="mt-10 border-t border-slate-800 pt-4 text-center text-[10px] text-slate-600">
          Shared via AI CMO · {new Date().toLocaleDateString()}
        </footer>
      </div>
    </div>
  );
}
