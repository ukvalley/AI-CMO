'use client';

/**
 * Structured SOP Editor
 *
 * Renders the 20-section SOP template. Each section uses its own renderer
 * based on type: richText, table, image, fileList, versionHistory, signatures.
 *
 * v1: rich text is a textarea (no TipTap) so the editor ships without a
 * heavy dependency. Swap-in for TipTap is a future task.
 */

import React, { useCallback, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  Paperclip,
  Wand2,
  PenLine,
  Minimize2,
  Maximize2,
  GripVertical,
} from 'lucide-react';

import type {
  SOPContent,
  SOPHeader,
  SOPSectionDef,
  SOPImageContent,
  SOPFileEntry,
} from '@/types/entities';
import { DEFAULT_SOP_SECTIONS } from '@/lib/sopConstants';

export type SopAiAction = 'generate' | 'rewrite' | 'shorten' | 'expand';

interface StructuredEditorProps {
  value: SOPContent;
  onChange: (content: SOPContent) => void;
  onAiGenerate?: (
    sectionKey: string,
    sectionLabel: string,
    currentText: string,
    action: SopAiAction
  ) => Promise<string> | void;
  sectionDefs?: SOPSectionDef[];
  onReorder?: (newOrder: string[]) => void;
  onRemoveSection?: (key: string) => void;
}

export function StructuredEditor({
  value,
  onChange,
  onAiGenerate,
  sectionDefs = DEFAULT_SOP_SECTIONS,
  onReorder,
  onRemoveSection,
}: StructuredEditorProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const toggleCollapse = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateHeader = useCallback(
    (patch: Partial<SOPHeader>) => {
      onChange({ ...value, header: { ...value.header, ...patch } });
    },
    [value, onChange]
  );

  const updateSection = useCallback(
    (key: string, content: unknown) => {
      onChange({
        ...value,
        sections: { ...value.sections, [key]: content as never },
      });
    },
    [value, onChange]
  );

  return (
    <div className="space-y-4">
      <HeaderEditor header={value.header} onChange={updateHeader} />

      {sectionDefs.map((def) => {
        const isCollapsed = collapsed[def.key];
        const sectionContent = value.sections[def.key];
        const draggable = !!onReorder && !def.systemGenerated;
        const isDragOver = dragOverKey === def.key;
        return (
          <div
            key={def.key}
            draggable={draggable}
            onDragStart={
              draggable
                ? (e) => {
                    setDragKey(def.key);
                    e.dataTransfer.effectAllowed = 'move';
                  }
                : undefined
            }
            onDragOver={
              onReorder
                ? (e) => {
                    e.preventDefault();
                    if (dragKey && dragKey !== def.key) setDragOverKey(def.key);
                  }
                : undefined
            }
            onDragLeave={onReorder ? () => setDragOverKey(null) : undefined}
            onDrop={
              onReorder
                ? (e) => {
                    e.preventDefault();
                    if (!dragKey || dragKey === def.key) {
                      setDragKey(null);
                      setDragOverKey(null);
                      return;
                    }
                    const order = sectionDefs.map((s) => s.key);
                    const from = order.indexOf(dragKey);
                    const to = order.indexOf(def.key);
                    order.splice(from, 1);
                    order.splice(to, 0, dragKey);
                    onReorder(order);
                    setDragKey(null);
                    setDragOverKey(null);
                  }
                : undefined
            }
            onDragEnd={() => {
              setDragKey(null);
              setDragOverKey(null);
            }}
            className={
              'overflow-hidden rounded-xl border bg-slate-800/40 transition-colors ' +
              (isDragOver
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-slate-700')
            }
          >
            <div className="flex w-full items-center gap-2 px-4 py-3">
              {draggable && (
                <span
                  className="cursor-grab text-slate-600 hover:text-slate-400 active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-4 w-4" />
                </span>
              )}
              <button
                type="button"
                onClick={() => toggleCollapse(def.key)}
                className="flex flex-1 items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  )}
                  <span className="font-medium text-slate-200">{def.label}</span>
                  {def.required && (
                    <span className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-medium uppercase text-rose-300">
                      Required
                    </span>
                  )}
                  {def.systemGenerated && (
                    <span className="rounded bg-slate-700/60 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">
                      System
                    </span>
                  )}
                </div>
                <span className="text-xs uppercase tracking-wide text-slate-500">{def.type}</span>
              </button>
              {onRemoveSection && !def.systemGenerated && !def.required && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSection(def.key);
                  }}
                  className="rounded p-1 text-slate-500 hover:bg-rose-500/15 hover:text-rose-400"
                  title="Remove section"
                  aria-label="Remove section"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {!isCollapsed && (
              <div className="border-t border-slate-700 px-4 py-4">
                <SectionRenderer
                  def={def}
                  content={sectionContent}
                  onChange={(c) => updateSection(def.key, c)}
                  onAiGenerate={onAiGenerate}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// HEADER
// ============================================

function HeaderEditor({
  header,
  onChange,
}: {
  header: SOPHeader;
  onChange: (patch: Partial<SOPHeader>) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-400">
        SOP Header
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="SOP Number" value={header.sopNumber} onChange={(v) => onChange({ sopNumber: v })} placeholder="GEN_SOP_001" />
        <Field label="Version" value={header.versionLabel} onChange={(v) => onChange({ versionLabel: v })} placeholder="R00" />
        <Field label="Date" value={header.date} onChange={(v) => onChange({ date: v })} placeholder="DD/MM/YYYY" />
        <Field label="Department" value={header.department} onChange={(v) => onChange({ department: v })} placeholder="e.g. Operations" />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
      />
    </label>
  );
}

// ============================================
// SECTION RENDERER
// ============================================

function SectionRenderer({
  def,
  content,
  onChange,
  onAiGenerate,
}: {
  def: SOPSectionDef;
  content: unknown;
  onChange: (content: unknown) => void;
  onAiGenerate?: (
    key: string,
    label: string,
    currentText: string,
    action: SopAiAction
  ) => Promise<string> | void;
}) {
  switch (def.type) {
    case 'richText':
      return (
        <RichTextSection
          def={def}
          value={(content as string) || ''}
          onChange={(v) => onChange(v)}
          onAiGenerate={onAiGenerate}
        />
      );
    case 'table':
    case 'versionHistory':
    case 'signatures':
      return (
        <TableSection
          def={def}
          rows={(content as Record<string, string>[]) || []}
          onChange={(rows) => onChange(rows)}
        />
      );
    case 'image':
      return (
        <ImageSection
          value={(content as SOPImageContent) || { url: '', caption: '' }}
          onChange={(v) => onChange(v)}
          placeholder={def.placeholder}
        />
      );
    case 'fileList':
      return (
        <FileListSection
          files={(content as SOPFileEntry[]) || []}
          onChange={(files) => onChange(files)}
        />
      );
    default:
      return (
        <p className="text-sm text-slate-500">
          Section type "{def.type}" is not supported in this editor yet.
        </p>
      );
  }
}

// ============================================
// RICH TEXT (textarea v1; TipTap to follow)
// ============================================

function RichTextSection({
  def,
  value,
  onChange,
  onAiGenerate,
}: {
  def: SOPSectionDef;
  value: string;
  onChange: (v: string) => void;
  onAiGenerate?: (
    key: string,
    label: string,
    currentText: string,
    action: SopAiAction
  ) => Promise<string> | void;
}) {
  const [generating, setGenerating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu on outside click
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const runAi = async (action: SopAiAction) => {
    if (!onAiGenerate) return;
    setMenuOpen(false);
    setGenerating(true);
    try {
      const result = await onAiGenerate(def.key, def.label, value, action);
      if (typeof result === 'string' && result.trim()) {
        onChange(result);
      }
    } finally {
      setGenerating(false);
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={def.placeholder}
        rows={6}
        className="w-full resize-y rounded-md border border-slate-700 bg-slate-900 p-3 pr-10 text-sm text-slate-200 placeholder:text-slate-600 focus:border-primary-500 focus:outline-none"
      />
      {onAiGenerate && (
        <div ref={menuRef} className="absolute right-2 top-2">
          <button
            type="button"
            onClick={() => (hasText ? setMenuOpen((m) => !m) : runAi('generate'))}
            disabled={generating}
            className="rounded-md p-1.5 text-primary-400 transition-colors hover:bg-primary-500/15 disabled:opacity-50"
            title="AI assist"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </button>
          {menuOpen && hasText && (
            <div className="absolute right-0 top-full z-10 mt-1 w-44 overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-lg shadow-black/40">
              <AiMenuItem icon={Wand2} label="Generate (replace)" onClick={() => runAi('generate')} />
              <AiMenuItem icon={PenLine} label="Rewrite" onClick={() => runAi('rewrite')} />
              <AiMenuItem icon={Minimize2} label="Shorten" onClick={() => runAi('shorten')} />
              <AiMenuItem icon={Maximize2} label="Expand" onClick={() => runAi('expand')} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AiMenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-primary-300"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

// ============================================
// TABLE SECTION
// ============================================

function TableSection({
  def,
  rows,
  onChange,
}: {
  def: SOPSectionDef;
  rows: Record<string, string>[];
  onChange: (rows: Record<string, string>[]) => void;
}) {
  const columns = def.tableColumns || [];

  const emptyRow = () => {
    const r: Record<string, string> = {};
    columns.forEach((c) => (r[c.key] = ''));
    return r;
  };

  const updateCell = (rowIndex: number, colKey: string, val: string) => {
    const next = rows.map((r, i) => (i === rowIndex ? { ...r, [colKey]: val } : r));
    onChange(next);
  };

  const addRow = () => onChange([...rows, emptyRow()]);
  const removeRow = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="overflow-x-auto rounded-md border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/60">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  {c.label}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-4 text-center text-xs text-slate-500">
                  No rows yet — click "Add row".
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className="bg-slate-900/40">
                  {columns.map((c) => (
                    <td key={c.key} className="p-1">
                      <input
                        type="text"
                        value={row[c.key] || ''}
                        onChange={(e) => updateCell(i, c.key, e.target.value)}
                        className="w-full rounded border border-transparent bg-transparent px-2 py-1.5 text-sm text-slate-200 hover:border-slate-700 focus:border-primary-500 focus:bg-slate-900 focus:outline-none"
                        placeholder={c.label}
                      />
                    </td>
                  ))}
                  <td className="p-1 text-right">
                    {!def.systemGenerated && (
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        className="rounded p-1 text-slate-500 hover:bg-rose-500/15 hover:text-rose-400"
                        title="Remove row"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 inline-flex items-center gap-1 rounded-md border border-dashed border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-primary-500/60 hover:text-primary-300"
      >
        <Plus className="h-3.5 w-3.5" />
        Add row
      </button>
    </div>
  );
}

// ============================================
// IMAGE SECTION
// ============================================

function ImageSection({
  value,
  onChange,
  placeholder,
}: {
  value: SOPImageContent;
  onChange: (v: SOPImageContent) => void;
  placeholder?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      window.alert('Please drop an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert('Image is larger than 5 MB. Try compressing it first.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange({ ...value, url: String(reader.result || '') });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {value.url ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.url}
            alt={value.caption || 'Flowchart'}
            className="max-h-80 rounded-md border border-slate-700"
          />
          <button
            type="button"
            onClick={() => onChange({ url: '', caption: '' })}
            className="absolute -right-2 -top-2 rounded-full bg-rose-500/90 p-1 text-white shadow-lg hover:bg-rose-500"
            title="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) onFile(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={
            'flex cursor-pointer flex-col items-center rounded-md border border-dashed bg-slate-900/50 px-4 py-8 text-center transition-colors ' +
            (dragging ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700 hover:border-primary-500/60')
          }
        >
          <ImageIcon className="mb-2 h-6 w-6 text-slate-500" />
          <p className="text-xs text-slate-400">
            <span className="text-primary-300">Click</span> or drag-drop an image here
          </p>
          <p className="mt-1 text-[10px] text-slate-600">{placeholder || 'PNG / JPG, up to 5 MB'}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
              e.target.value = '';
            }}
          />
        </div>
      )}
      <input
        type="text"
        value={value.url || ''}
        onChange={(e) => onChange({ ...value, url: e.target.value })}
        placeholder="…or paste an image URL"
        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
      />
      <input
        type="text"
        value={value.caption || ''}
        onChange={(e) => onChange({ ...value, caption: e.target.value })}
        placeholder="Caption (optional)"
        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
      />
    </div>
  );
}

// ============================================
// FILE LIST SECTION
// ============================================

function FileListSection({
  files,
  onChange,
}: {
  files: SOPFileEntry[];
  onChange: (files: SOPFileEntry[]) => void;
}) {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const addFromList = (fileList: FileList | null) => {
    if (!fileList) return;
    const next: SOPFileEntry[] = [...files];
    let pending = 0;
    Array.from(fileList).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        window.alert(`"${file.name}" is over 5 MB — skipped.`);
        return;
      }
      pending += 1;
      const reader = new FileReader();
      reader.onload = () => {
        next.push({
          url: String(reader.result || ''),
          filename: file.name,
          size: file.size,
        });
        pending -= 1;
        if (pending === 0) onChange(next);
      };
      reader.readAsDataURL(file);
    });
  };

  const addFromUrl = () => {
    if (!url || !filename) return;
    onChange([...files, { url, filename }]);
    setUrl('');
    setFilename('');
  };

  return (
    <div className="space-y-3">
      {files.length > 0 && (
        <ul className="divide-y divide-slate-700 rounded-md border border-slate-700 bg-slate-900/40">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between px-3 py-2">
              <a
                href={f.url}
                target="_blank"
                rel="noreferrer"
                download={f.filename}
                className="flex items-center gap-2 text-sm text-slate-200 hover:text-primary-300"
              >
                <Paperclip className="h-4 w-4 text-slate-500" />
                {f.filename}
                {f.size && (
                  <span className="text-[10px] text-slate-500">
                    ({Math.round(f.size / 1024)} KB)
                  </span>
                )}
              </a>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                className="rounded p-1 text-slate-500 hover:bg-rose-500/15 hover:text-rose-400"
                title="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFromList(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={
          'flex cursor-pointer flex-col items-center rounded-md border border-dashed bg-slate-900/50 px-4 py-6 text-center transition-colors ' +
          (dragging ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700 hover:border-primary-500/60')
        }
      >
        <Upload className="mb-1.5 h-5 w-5 text-slate-500" />
        <p className="text-xs text-slate-400">
          <span className="text-primary-300">Click</span> or drag-drop files here
        </p>
        <p className="mt-1 text-[10px] text-slate-600">Up to 5 MB each — multiple files supported</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            addFromList(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <details className="group">
        <summary className="cursor-pointer text-[11px] text-slate-500 hover:text-slate-300">
          Or add by URL
        </summary>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Filename"
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-primary-500 focus:outline-none sm:col-span-2"
          />
          <button
            type="button"
            onClick={addFromUrl}
            disabled={!url || !filename}
            className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-primary-500/60 hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-3"
          >
            <Plus className="h-3.5 w-3.5" />
            Add URL
          </button>
        </div>
      </details>
    </div>
  );
}
