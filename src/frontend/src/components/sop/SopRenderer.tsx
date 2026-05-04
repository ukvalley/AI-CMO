'use client';

/**
 * SOP Renderer
 *
 * Read-only formatted renderer for a structured SOP. Used in the detail
 * view and the print page. Skips empty sections so the rendered document
 * stays clean.
 */

import React from 'react';
import type {
  SOPContent,
  SOPSectionDef,
  SOPImageContent,
  SOPFileEntry,
} from '@/types/entities';
import { DEFAULT_SOP_SECTIONS } from '@/lib/sopConstants';

interface SopRendererProps {
  content: SOPContent;
  sectionDefs?: SOPSectionDef[];
  print?: boolean;
}

export function SopRenderer({ content, sectionDefs = DEFAULT_SOP_SECTIONS, print }: SopRendererProps) {
  return (
    <article className={print ? 'sop-print' : 'space-y-6'}>
      <HeaderBlock header={content.header} print={print} />

      {sectionDefs.map((def) => {
        const sectionContent = content.sections?.[def.key];
        if (isEmptySection(def, sectionContent)) {
          if (def.systemGenerated) return null;
          if (!def.required) return null;
        }

        return (
          <section
            key={def.key}
            className={
              print
                ? 'mb-6 break-inside-avoid'
                : 'rounded-xl border border-slate-700 bg-slate-800/30 p-5'
            }
          >
            <h2
              className={
                print
                  ? 'mb-2 text-base font-semibold text-black underline'
                  : 'mb-3 text-lg font-semibold text-white'
              }
            >
              {def.label}
            </h2>
            <SectionBody def={def} content={sectionContent} print={print} />
          </section>
        );
      })}
    </article>
  );
}

function isEmptySection(def: SOPSectionDef, content: unknown): boolean {
  if (content == null) return true;
  switch (def.type) {
    case 'richText':
      return !((content as string) || '').trim();
    case 'table':
    case 'versionHistory':
    case 'signatures': {
      const rows = (content as Record<string, string>[]) || [];
      return rows.length === 0 || rows.every((r) => Object.values(r).every((v) => !v || !v.trim()));
    }
    case 'image':
      return !(content as SOPImageContent)?.url;
    case 'fileList':
      return ((content as SOPFileEntry[]) || []).length === 0;
    default:
      return false;
  }
}

// ============================================
// HEADER BLOCK
// ============================================

function HeaderBlock({ header, print }: { header: SOPContent['header']; print?: boolean }) {
  if (print) {
    return (
      <table className="mb-6 w-full border border-black text-sm">
        <tbody>
          <tr>
            <td className="border border-black p-2 font-semibold">SOP Number</td>
            <td className="border border-black p-2">{header.sopNumber || '—'}</td>
            <td className="border border-black p-2 font-semibold">Version</td>
            <td className="border border-black p-2">{header.versionLabel || '—'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-semibold">Date</td>
            <td className="border border-black p-2">{header.date || '—'}</td>
            <td className="border border-black p-2 font-semibold">Department</td>
            <td className="border border-black p-2">{header.department || '—'}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-700 bg-slate-800/30 p-5 sm:grid-cols-4">
      <HeaderCell label="SOP Number" value={header.sopNumber} />
      <HeaderCell label="Version" value={header.versionLabel} />
      <HeaderCell label="Date" value={header.date} />
      <HeaderCell label="Department" value={header.department} />
    </div>
  );
}

function HeaderCell({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm text-slate-200">{value || '—'}</div>
    </div>
  );
}

// ============================================
// SECTION BODY
// ============================================

function SectionBody({
  def,
  content,
  print,
}: {
  def: SOPSectionDef;
  content: unknown;
  print?: boolean;
}) {
  switch (def.type) {
    case 'richText':
      return (
        <p className={print ? 'whitespace-pre-wrap text-sm text-black' : 'whitespace-pre-wrap text-sm leading-relaxed text-slate-300'}>
          {(content as string) || ''}
        </p>
      );

    case 'table':
    case 'versionHistory':
    case 'signatures': {
      const rows = (content as Record<string, string>[]) || [];
      const cols = def.tableColumns || [];
      if (rows.length === 0) {
        return <p className={print ? 'text-sm text-black' : 'text-sm text-slate-500'}>—</p>;
      }
      return (
        <div className="overflow-x-auto">
          <table className={print ? 'w-full border border-black text-sm text-black' : 'w-full border border-slate-700 text-sm text-slate-300'}>
            <thead className={print ? 'bg-gray-100' : 'bg-slate-800/60'}>
              <tr>
                {cols.map((c) => (
                  <th
                    key={c.key}
                    className={
                      print
                        ? 'border border-black p-2 text-left font-semibold'
                        : 'border-b border-slate-700 p-2 text-left text-xs font-medium uppercase tracking-wide text-slate-400'
                    }
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {cols.map((c) => (
                    <td
                      key={c.key}
                      className={print ? 'border border-black p-2 align-top' : 'border-t border-slate-700 p-2 align-top'}
                    >
                      {row[c.key] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'image': {
      const img = content as SOPImageContent;
      if (!img?.url) return <p className="text-sm text-slate-500">—</p>;
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.caption || 'Flowchart'}
            className={print ? 'max-w-full' : 'max-h-96 rounded-md border border-slate-700'}
          />
          {img.caption && (
            <figcaption className={print ? 'mt-1 text-xs italic text-black' : 'mt-2 text-xs italic text-slate-400'}>
              {img.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'fileList': {
      const files = (content as SOPFileEntry[]) || [];
      if (files.length === 0) return <p className="text-sm text-slate-500">—</p>;
      return (
        <ul className={print ? 'list-disc pl-5 text-sm text-black' : 'list-disc pl-5 text-sm text-slate-300'}>
          {files.map((f, i) => (
            <li key={i}>
              <a
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className={print ? 'text-black underline' : 'text-primary-300 hover:underline'}
              >
                {f.filename}
              </a>
            </li>
          ))}
        </ul>
      );
    }

    default:
      return null;
  }
}
