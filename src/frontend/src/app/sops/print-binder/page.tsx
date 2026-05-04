'use client';

/**
 * SOP Binder Print
 *
 * Prints multiple SOPs in one document, separated by page breaks. Hit at
 * /sops/print-binder?ids=a,b,c — auto-triggers the browser's print dialog
 * after a brief delay. Use this for bulk PDF export.
 */

import React, { Suspense, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDataStore } from '@/stores';
import type { SOP } from '@/types/entities';
import {
  buildDefaultHeader,
  buildDefaultSections,
} from '@/lib/sopConstants';
import { SopRenderer } from '@/components/sop/SopRenderer';

export default function PrintBinderRoute() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useSearchParams();
  const idsParam = params?.get('ids') || '';
  const ids = idsParam.split(',').filter(Boolean);
  const { getItems } = useDataStore();
  const allSops = (getItems('sops') as SOP[]) || [];

  const sops = useMemo(() => {
    return ids
      .map((id) => allSops.find((s) => s.id === id))
      .filter((s): s is SOP => Boolean(s));
  }, [ids, allSops]);

  useEffect(() => {
    if (sops.length === 0) return;
    const t = setTimeout(() => window.print(), 800);
    return () => clearTimeout(t);
  }, [sops.length]);

  if (sops.length === 0) {
    return (
      <div className="min-h-screen bg-white p-10 text-black">
        <p>No SOPs selected.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-4xl px-10 py-8 print:px-0 print:py-0">
        <header className="mb-6 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold">SOP Binder</h1>
          <p className="mt-1 text-sm text-gray-700">
            {sops.length} document{sops.length === 1 ? '' : 's'} · printed{' '}
            {new Date().toLocaleString()}
          </p>
          <ol className="mt-3 list-decimal pl-5 text-sm text-gray-800">
            {sops.map((sop) => (
              <li key={sop.id}>{sop.title || sop.name || 'Untitled SOP'}</li>
            ))}
          </ol>
        </header>

        {sops.map((sop, i) => {
          const title = sop.title || sop.name || 'Untitled SOP';
          const content =
            sop.content || {
              header: buildDefaultHeader(sop.department),
              sections: buildDefaultSections() as never,
            };
          return (
            <article
              key={sop.id}
              className={
                'mb-12 break-inside-avoid ' + (i > 0 ? 'break-before-page' : '')
              }
            >
              <div className="mb-4 border-b border-black pb-2">
                <h2 className="text-2xl font-bold">{title}</h2>
                <div className="text-xs text-gray-700">
                  {sop.category && <span>{sop.category}</span>}
                  {sop.department && <span> · {sop.department}</span>}
                  {sop.versionLabel && <span> · {sop.versionLabel}</span>}
                </div>
              </div>
              <SopRenderer content={content} print />
            </article>
          );
        })}

        <footer className="mt-10 border-t border-black pt-2 text-[10px] text-gray-600">
          End of binder · {new Date().toLocaleString()}
        </footer>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 18mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          aside,
          nav,
          header.app-header,
          .no-print {
            display: none !important;
          }
          .break-before-page {
            break-before: page;
          }
        }
      `}</style>
    </div>
  );
}
