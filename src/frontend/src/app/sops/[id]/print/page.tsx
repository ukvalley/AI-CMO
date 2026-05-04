'use client';

/**
 * SOP Print View
 *
 * Light-theme, print-optimised render of the SOP. Auto-triggers the
 * browser's print dialog after a brief delay so users can save as PDF.
 */

import React, { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useDataStore } from '@/stores';
import type { SOP } from '@/types/entities';
import { buildDefaultHeader, buildDefaultSections } from '@/lib/sopConstants';
import { SopRenderer } from '@/components/sop/SopRenderer';

export default function SopPrintRoute() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const { getItems } = useDataStore();
  const sops = (getItems('sops') as SOP[]) || [];
  const sop = useMemo(() => sops.find((s) => s.id === id) || null, [sops, id]);

  useEffect(() => {
    if (!sop) return;
    const t = setTimeout(() => window.print(), 600);
    return () => clearTimeout(t);
  }, [sop]);

  if (!sop) {
    return (
      <div className="min-h-screen bg-white p-10 text-black">
        <p>SOP not found.</p>
      </div>
    );
  }

  const title = sop.title || sop.name || 'Untitled SOP';
  const content =
    sop.content ||
    {
      header: buildDefaultHeader(sop.department),
      sections: buildDefaultSections() as never,
    };

  const shareUrl = sop.share?.token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/sops/share/${sop.share.token}`
    : null;

  return (
    <div className="min-h-screen bg-white p-10 text-black print:p-0">
      <header className="mb-6 flex items-start justify-between gap-4 border-b border-black pb-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="mt-1 text-xs text-gray-700">
            {sop.category && <span>{sop.category} · </span>}
            {sop.department && <span>{sop.department} · </span>}
            {sop.versionLabel && <span>{sop.versionLabel}</span>}
          </div>
        </div>
        {shareUrl && (
          <div className="text-center">
            <QrPlaceholder text={shareUrl} size={72} />
            <div className="mt-1 text-[8px] text-gray-600">Scan for digital copy</div>
          </div>
        )}
      </header>

      <SopRenderer content={content} print />

      <footer className="mt-10 border-t border-black pt-2 text-[10px] text-gray-600">
        Printed from AI CMO · {new Date().toLocaleString()}
      </footer>

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
        }
      `}</style>
    </div>
  );
}

/**
 * QrPlaceholder — a deterministic blocky pattern derived from the input
 * string. NOT a real scannable QR code (that needs a proper library like
 * `qrcode`), but visually communicates "scan me" on printed copies.
 * Replace with a proper QR component once `qrcode` is installed.
 */
function QrPlaceholder({ text, size = 72 }: { text: string; size?: number }) {
  const grid = 16;
  const cell = size / grid;
  // Deterministic hash → bit pattern
  const cells: boolean[] = [];
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = (hash * 33) ^ text.charCodeAt(i);
  for (let i = 0; i < grid * grid; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    cells.push((hash & 1) === 1);
  }
  // Force corner finder patterns
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const idx = y * grid + x;
      const inCorner = (x < 4 && y < 4) || (x > grid - 5 && y < 4) || (x < 4 && y > grid - 5);
      if (inCorner) {
        const isEdge =
          x === 0 || x === 3 || y === 0 || y === 3 || x === grid - 1 || x === grid - 4 || y === grid - 1 || y === grid - 4;
        const isCenter = (x === 1 || x === 2) && (y === 1 || y === 2);
        cells[idx] = isEdge || isCenter;
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="border border-black">
      <rect width={size} height={size} fill="white" />
      {cells.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={(i % grid) * cell}
            y={Math.floor(i / grid) * cell}
            width={cell}
            height={cell}
            fill="black"
          />
        ) : null
      )}
    </svg>
  );
}
