'use client';

/**
 * SOP Editor Page
 *
 * Shared by /sops/new and /sops/[id]/edit. Handles loading existing SOP
 * (or seeding from template), the metadata sidebar, the structured
 * editor, save/publish actions and back-navigation.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Eye,
  CheckCircle2,
  Layers,
  Clock,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useDataStore } from '@/stores';
import type {
  SOP,
  SOPContent,
  SOPCategory,
  SOPStatus,
  SOPPriority,
  SOPAccessLevel,
  SOPVersionSnapshot,
  SOPSectionDef,
  UserSopTemplate,
} from '@/types/entities';
import {
  DEFAULT_SOP_SECTIONS,
  SOP_CATEGORIES,
  SOP_STATUS_LABELS,
  SOP_PRIORITY_LABELS,
  SOP_ACCESS_LABELS,
  buildDefaultHeader,
  buildDefaultSections,
  slugify,
} from '@/lib/sopConstants';
import { SOP_TEMPLATES, getTemplateById } from '@/lib/sopTemplates';
import { StructuredEditor } from './StructuredEditor';

interface MetaState {
  title: string;
  category: SOPCategory | '';
  department: string;
  status: SOPStatus;
  priority: SOPPriority;
  accessLevel: SOPAccessLevel;
  versionLabel: string;
  owner: string;
  expiresAt: string;
  nextReviewAt: string;
  isCritical: boolean;
  tags: string;
}

const DEFAULT_META: MetaState = {
  title: '',
  category: '',
  department: '',
  status: 'draft',
  priority: 'low',
  accessLevel: 'internal',
  versionLabel: 'R00',
  owner: '',
  expiresAt: '',
  nextReviewAt: '',
  isCritical: false,
  tags: '',
};

function emptyContent(): SOPContent {
  return {
    header: buildDefaultHeader(''),
    sections: buildDefaultSections() as SOPContent['sections'],
  };
}

interface SopEditorPageProps {
  sopId?: string;
}

export function SopEditorPage({ sopId }: SopEditorPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getItems, addItem, updateItem } = useDataStore();
  const sops = (getItems('sops') as SOP[]) || [];

  const existing = useMemo(() => sops.find((s) => s.id === sopId) || null, [sops, sopId]);

  const [meta, setMeta] = useState<MetaState>(DEFAULT_META);
  const [content, setContent] = useState<SOPContent>(emptyContent);
  const [sectionDefs, setSectionDefs] = useState<SOPSectionDef[]>(DEFAULT_SOP_SECTIONS);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isHydrating = useRef(true);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from existing SOP, or template (?source=template, ?templateId=...)
  useEffect(() => {
    if (existing) {
      setMeta({
        title: existing.title || existing.name || '',
        category: (existing.category as SOPCategory) || '',
        department: existing.department || '',
        status: existing.status || 'draft',
        priority: existing.priority || 'low',
        accessLevel: existing.accessLevel || 'internal',
        versionLabel: existing.versionLabel || 'R00',
        owner: existing.owner || '',
        expiresAt: existing.expiresAt || '',
        nextReviewAt: existing.nextReviewAt || '',
        isCritical: !!existing.isCritical,
        tags: (existing.tags || []).join(', '),
      });
      if (existing.content) {
        setContent(existing.content);
      }
      if (existing.customSections && existing.customSections.length > 0) {
        setSectionDefs(existing.customSections);
      }
      return;
    }

    // New SOP — check template params
    const source = searchParams?.get('source') || null;
    const templateId = searchParams?.get('templateId') || null;
    const userTemplateId = searchParams?.get('userTemplateId') || null;

    if (templateId) {
      const tpl = getTemplateById(templateId);
      if (tpl) {
        applyTemplate(tpl.id);
        return;
      }
    }
    if (userTemplateId) {
      const userTemplates = (getItems('userSopTemplates') as UserSopTemplate[]) || [];
      const tpl = userTemplates.find((t) => t.id === userTemplateId);
      if (tpl) {
        applyUserTemplate(tpl);
        return;
      }
    }
    if (source === 'template') {
      setShowTemplateModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing]);

  const applyTemplate = (templateId: string) => {
    const tpl = getTemplateById(templateId);
    if (!tpl) return;
    setMeta((prev) => ({
      ...prev,
      title: prev.title || tpl.title,
      category: tpl.category,
      department: tpl.department || prev.department,
    }));
    setContent((prev) => ({
      header: { ...prev.header, department: tpl.department || prev.header.department },
      sections: {
        ...buildDefaultSections(),
        ...tpl.sections,
      } as SOPContent['sections'],
    }));
    setShowTemplateModal(false);
  };

  const applyUserTemplate = (tpl: UserSopTemplate) => {
    setMeta((prev) => ({
      ...prev,
      title: prev.title || tpl.title,
      category: (tpl.category as SOPCategory) || prev.category,
      department: tpl.department || prev.department,
    }));
    setContent((prev) => ({
      header: { ...prev.header, department: tpl.department || prev.header.department },
      sections: {
        ...buildDefaultSections(),
        ...(tpl.sections || {}),
      } as SOPContent['sections'],
    }));
    if (tpl.customSections && tpl.customSections.length > 0) {
      setSectionDefs(tpl.customSections);
    }
    setShowTemplateModal(false);
  };

  const handleSave = useCallback(
    (publish = false, silent = false) => {
      if (!meta.title.trim()) {
        if (!silent) window.alert('Please enter a title before saving.');
        return false;
      }

      const isDefaultLayout =
        sectionDefs.length === DEFAULT_SOP_SECTIONS.length &&
        sectionDefs.every((s, i) => DEFAULT_SOP_SECTIONS[i]?.key === s.key);

      const payload: Partial<SOP> = {
        title: meta.title.trim(),
        slug: slugify(meta.title),
        category: meta.category || undefined,
        department: (meta.department as never) || undefined,
        status: publish ? 'published' : meta.status,
        priority: meta.priority,
        accessLevel: meta.accessLevel,
        versionLabel: meta.versionLabel,
        owner: meta.owner || undefined,
        expiresAt: meta.expiresAt || undefined,
        nextReviewAt: meta.nextReviewAt || undefined,
        isCritical: meta.isCritical,
        tags: meta.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        content,
        customSections: isDefaultLayout ? undefined : sectionDefs,
      };

      // On explicit publish, append a version snapshot
      if (publish && existing) {
        const previousVersions = existing.versions || [];
        const snapshot: SOPVersionSnapshot = {
          versionLabel: meta.versionLabel,
          publishedAt: new Date().toISOString(),
          content: JSON.parse(JSON.stringify(content)),
          status: 'published',
        };
        payload.versions = [...previousVersions, snapshot];
      }

      setIsSaving(true);
      try {
        if (existing) {
          updateItem('sops', existing.id, payload);
          setSavedAt(new Date().toLocaleTimeString());
          setIsDirty(false);
          if (publish) router.push(`/sops/${existing.id}`);
        } else {
          const id = addItem('sops', payload as Parameters<typeof addItem>[1]);
          setSavedAt(new Date().toLocaleTimeString());
          setIsDirty(false);
          router.push(`/sops/${id}${publish ? '' : '/edit'}`);
        }
        return true;
      } finally {
        setIsSaving(false);
      }
    },
    [meta, content, existing, addItem, updateItem, router]
  );

  // Mark dirty when content or meta changes (skipping the initial hydration tick)
  useEffect(() => {
    if (isHydrating.current) {
      isHydrating.current = false;
      return;
    }
    setIsDirty(true);
  }, [meta, content]);

  // Auto-save: debounce 1.5s after last edit. Only for existing SOPs to avoid
  // creating a half-baked record on every keystroke before the user names it.
  useEffect(() => {
    if (!isDirty || !existing) return;
    if (!meta.title.trim()) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      handleSave(false, true);
    }, 1500);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [isDirty, existing, meta.title, handleSave]);

  // Keyboard shortcuts: Ctrl/Cmd+S = save draft, Ctrl/Cmd+Shift+S = save & publish
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isSave = (e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S');
      if (!isSave) return;
      e.preventDefault();
      handleSave(e.shiftKey);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSave]);

  const handleReorderSections = (newOrder: string[]) => {
    const map = new Map(sectionDefs.map((s) => [s.key, s]));
    const next = newOrder.map((k) => map.get(k)).filter((s): s is SOPSectionDef => Boolean(s));
    setSectionDefs(next);
  };

  const handleAddSection = (sec: SOPSectionDef) => {
    setSectionDefs((prev) => {
      // insert before signatures (last system section) if present, else end
      const sigIndex = prev.findIndex((s) => s.key === 'signatures');
      const at = sigIndex === -1 ? prev.length : sigIndex;
      const next = [...prev];
      next.splice(at, 0, sec);
      return next;
    });
    setContent((prev) => ({
      ...prev,
      sections: { ...prev.sections, [sec.key]: '' as never },
    }));
    setShowAddSectionModal(false);
  };

  const handleRemoveSection = (key: string) => {
    setSectionDefs((prev) => prev.filter((s) => s.key !== key));
    setContent((prev) => {
      const next = { ...prev.sections };
      delete next[key];
      return { ...prev, sections: next };
    });
  };

  // AI generate stub — replace with real /ai endpoint calls when wired
  const handleAiSection = async (
    _sectionKey: string,
    sectionLabel: string,
    currentText: string,
    action: 'generate' | 'rewrite' | 'shorten' | 'expand'
  ) => {
    await new Promise((r) => setTimeout(r, 700));
    const sopName = meta.title || 'Untitled';
    switch (action) {
      case 'generate':
        return (
          `[AI draft for ${sectionLabel}]\n\n` +
          `This section will describe ${sectionLabel.toLowerCase()} for the SOP "${sopName}".\n\n` +
          `(Wire this to /api/ai/generate-section.)`
        );
      case 'rewrite':
        return `[Rewritten — ${sectionLabel}]\n\n${currentText.replace(/\s+/g, ' ').trim()}\n\n(Demo — wire to /api/ai/rewrite.)`;
      case 'shorten':
        return `[Shortened — ${sectionLabel}]\n\n${currentText.split('. ').slice(0, 2).join('. ')}.\n\n(Demo — wire to /api/ai/shorten.)`;
      case 'expand':
        return `${currentText}\n\nFurther detail: this expanded version adds context, examples and edge cases relevant to ${sectionLabel.toLowerCase()} in "${sopName}".\n\n(Demo — wire to /api/ai/expand.)`;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* TOP BAR */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/sops')}
              className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
              aria-label="Back to library"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                {existing ? 'Edit SOP' : 'New SOP'}
              </h1>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                {isSaving ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving…
                  </>
                ) : isDirty ? (
                  <span className="text-amber-400/80">Unsaved changes</span>
                ) : savedAt ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-400/80" />
                    Saved at {savedAt}
                  </>
                ) : (
                  'No changes yet'
                )}
                <span className="ml-2 hidden text-slate-600 sm:inline">
                  · <Kbd>Ctrl</Kbd>+<Kbd>S</Kbd> save · <Kbd>Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>S</Kbd> publish
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!existing && (
              <Button variant="ghost" leftIcon={<Layers />} onClick={() => setShowTemplateModal(true)}>
                Use template
              </Button>
            )}
            {existing && (
              <Button variant="ghost" leftIcon={<Eye />} onClick={() => router.push(`/sops/${existing.id}`)}>
                Preview
              </Button>
            )}
            <Button variant="secondary" leftIcon={<Save />} onClick={() => handleSave(false)}>
              Save draft
            </Button>
            <Button leftIcon={<CheckCircle2 />} onClick={() => handleSave(true)}>
              Save &amp; publish
            </Button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4 min-w-0">
            <TitleBar meta={meta} setMeta={setMeta} />
            <StructuredEditor
              value={content}
              onChange={setContent}
              onAiGenerate={handleAiSection}
              sectionDefs={sectionDefs}
              onReorder={handleReorderSections}
              onRemoveSection={handleRemoveSection}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddSectionModal(true)}
                className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-primary-500/60 hover:text-primary-300"
              >
                <Plus className="h-3.5 w-3.5" />
                Add section
              </button>
            </div>
          </div>
          <MetaSidebar meta={meta} setMeta={setMeta} />
        </div>
      </div>

      {/* TEMPLATE PICKER */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Choose a template"
        description="Start your SOP from a pre-filled founder-ready outline."
        size="lg"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SOP_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => applyTemplate(tpl.id)}
              className="flex flex-col items-start gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-4 text-left transition-colors hover:border-primary-500/60 hover:bg-slate-800"
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-medium text-slate-200">{tpl.title}</span>
                <span className="rounded bg-slate-700/60 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">
                  {tpl.category}
                </span>
              </div>
              <p className="text-xs text-slate-400">{tpl.description}</p>
            </button>
          ))}
        </div>
      </Modal>

      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        existingKeys={sectionDefs.map((s) => s.key)}
        onAdd={handleAddSection}
      />
    </DashboardLayout>
  );
}

// ============================================
// ADD SECTION MODAL
// ============================================

function AddSectionModal({
  isOpen,
  onClose,
  existingKeys,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  existingKeys: string[];
  onAdd: (sec: SOPSectionDef) => void;
}) {
  const [label, setLabel] = useState('');
  const [type, setType] = useState<SOPSectionDef['type']>('richText');

  const handleSubmit = () => {
    if (!label.trim()) return;
    const baseKey = slugify(label).replace(/-/g, '_').slice(0, 30) || 'custom_section';
    let key = baseKey;
    let i = 1;
    while (existingKeys.includes(key)) {
      key = `${baseKey}_${i++}`;
    }
    onAdd({
      key,
      label: label.trim(),
      type,
      tableColumns:
        type === 'table'
          ? [
              { key: 'col1', label: 'Column 1' },
              { key: 'col2', label: 'Column 2' },
            ]
          : undefined,
    });
    setLabel('');
    setType('richText');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a custom section" size="sm">
      <div className="space-y-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-400">Section name</span>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. KPIs and Metrics"
            className="h-9 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-400">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as SOPSectionDef['type'])}
            className="h-9 rounded-md border border-slate-700 bg-slate-900 px-2 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
          >
            <option value="richText">Rich text</option>
            <option value="table">Table</option>
            <option value="image">Image</option>
            <option value="fileList">File list</option>
          </select>
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!label.trim()}>
            Add
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================
// TITLE BAR
// ============================================

function TitleBar({
  meta,
  setMeta,
}: {
  meta: MetaState;
  setMeta: React.Dispatch<React.SetStateAction<MetaState>>;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
      <input
        type="text"
        value={meta.title}
        onChange={(e) => setMeta((p) => ({ ...p, title: e.target.value }))}
        placeholder="SOP title — e.g. Customer Refund Process"
        className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-2xl font-semibold text-white placeholder:text-slate-600 hover:border-slate-700 focus:border-primary-500 focus:bg-slate-900 focus:outline-none"
      />
    </div>
  );
}

// ============================================
// META SIDEBAR
// ============================================

function MetaSidebar({
  meta,
  setMeta,
}: {
  meta: MetaState;
  setMeta: React.Dispatch<React.SetStateAction<MetaState>>;
}) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-400">Properties</h3>
        <div className="space-y-3">
          <SidebarSelect
            label="Status"
            value={meta.status}
            onChange={(v) => setMeta((p) => ({ ...p, status: v as SOPStatus }))}
            options={Object.entries(SOP_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          />
          <SidebarSelect
            label="Priority"
            value={meta.priority}
            onChange={(v) => setMeta((p) => ({ ...p, priority: v as SOPPriority }))}
            options={Object.entries(SOP_PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          />
          <SidebarSelect
            label="Category"
            value={meta.category}
            onChange={(v) => setMeta((p) => ({ ...p, category: v as SOPCategory }))}
            options={[
              { value: '', label: 'Uncategorised' },
              ...SOP_CATEGORIES.map((c) => ({ value: c, label: c })),
            ]}
          />
          <SidebarSelect
            label="Access Level"
            value={meta.accessLevel}
            onChange={(v) => setMeta((p) => ({ ...p, accessLevel: v as SOPAccessLevel }))}
            options={Object.entries(SOP_ACCESS_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          />
          <SidebarText
            label="Department"
            value={meta.department}
            onChange={(v) => setMeta((p) => ({ ...p, department: v }))}
            placeholder="e.g. Operations"
          />
          <SidebarText
            label="Owner"
            value={meta.owner}
            onChange={(v) => setMeta((p) => ({ ...p, owner: v }))}
            placeholder="Owner name or role"
          />
          <SidebarText
            label="Version label"
            value={meta.versionLabel}
            onChange={(v) => setMeta((p) => ({ ...p, versionLabel: v }))}
            placeholder="R00"
          />
          <SidebarText
            label="Tags"
            value={meta.tags}
            onChange={(v) => setMeta((p) => ({ ...p, tags: v }))}
            placeholder="comma, separated"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
        <h3 className="mb-3 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          Lifecycle
        </h3>
        <div className="space-y-3">
          <SidebarText
            label="Expires at"
            type="date"
            value={meta.expiresAt}
            onChange={(v) => setMeta((p) => ({ ...p, expiresAt: v }))}
          />
          <SidebarText
            label="Next review"
            type="date"
            value={meta.nextReviewAt}
            onChange={(v) => setMeta((p) => ({ ...p, nextReviewAt: v }))}
          />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={meta.isCritical}
              onChange={(e) => setMeta((p) => ({ ...p, isCritical: e.target.checked }))}
              className="h-4 w-4 accent-primary-500"
            />
            Mark as Critical SOP
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-primary-500/30 bg-primary-500/10 p-4">
        <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-primary-200">
          <Sparkles className="h-3.5 w-3.5" />
          AI assist
        </h3>
        <p className="text-xs text-primary-100/80">
          Click the sparkle icon on any rich-text section to draft content with AI.
        </p>
      </div>
    </aside>
  );
}

function SidebarSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-slate-700 bg-slate-900 px-2 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SidebarText({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 rounded-md border border-slate-700 bg-slate-900 px-2 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
      />
    </label>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 rounded border border-slate-700 bg-slate-800 px-1 font-mono text-[10px] text-slate-400">
      {children}
    </kbd>
  );
}
