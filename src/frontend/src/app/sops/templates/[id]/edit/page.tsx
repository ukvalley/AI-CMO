'use client';

/**
 * Template Editor
 *
 * Edit a user-created template. Reuses the StructuredEditor for the
 * 20-section content. Saves back into dataStore.userSopTemplates.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  ArrowRight,
  Trash2,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useDataStore } from '@/stores';
import type {
  UserSopTemplate,
  SOPCategory,
  SOPContent,
  SOPSectionDef,
  SOPSectionContent,
} from '@/types/entities';
import {
  DEFAULT_SOP_SECTIONS,
  SOP_CATEGORIES,
  buildDefaultHeader,
  buildDefaultSections,
} from '@/lib/sopConstants';
import { StructuredEditor } from '@/components/sop/StructuredEditor';

export default function TemplateEditRoute() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || '';
  const { getItems, updateItem, deleteItem } = useDataStore();
  const templates = (getItems('userSopTemplates') as UserSopTemplate[]) || [];
  const template = useMemo(() => templates.find((t) => t.id === id) || null, [templates, id]);

  // Local meta + content state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SOPCategory | ''>('');
  const [department, setDepartment] = useState('');
  const [sectionDefs, setSectionDefs] = useState<SOPSectionDef[]>(DEFAULT_SOP_SECTIONS);
  const [sectionsContent, setSectionsContent] = useState<Record<string, SOPSectionContent>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const isHydrating = React.useRef(true);

  // Hydrate from existing template
  useEffect(() => {
    if (!template) return;
    setTitle(template.title || '');
    setDescription(template.description || '');
    setCategory((template.category as SOPCategory) || '');
    setDepartment(template.department || '');
    setSectionsContent(template.sections || {});
    if (template.customSections && template.customSections.length > 0) {
      setSectionDefs(template.customSections);
    }
  }, [template]);

  useEffect(() => {
    if (isHydrating.current) {
      isHydrating.current = false;
      return;
    }
    setIsDirty(true);
  }, [title, description, category, department, sectionDefs, sectionsContent]);

  if (!template) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-10 text-center">
          <p className="text-slate-400">Template not found.</p>
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => router.push('/sops/templates')}
          >
            Back to templates
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Build a fake SOPContent so StructuredEditor can render. We don't use the
  // header on a template (templates inherit the header from SOPs that use them).
  const editorContent: SOPContent = {
    header: buildDefaultHeader(department),
    sections: { ...(buildDefaultSections() as Record<string, SOPSectionContent>), ...sectionsContent },
  };

  const handleEditorChange = (next: SOPContent) => {
    setSectionsContent(next.sections);
  };

  const handleSave = (silent = false) => {
    if (!title.trim()) {
      if (!silent) window.alert('Please enter a template name.');
      return;
    }
    const isDefaultLayout =
      sectionDefs.length === DEFAULT_SOP_SECTIONS.length &&
      sectionDefs.every((s, i) => DEFAULT_SOP_SECTIONS[i]?.key === s.key);

    setIsSaving(true);
    try {
      updateItem('userSopTemplates', template.id, {
        title: title.trim(),
        description: description.trim(),
        category: category || undefined,
        department: (department as never) || undefined,
        sections: sectionsContent,
        customSections: isDefaultLayout ? undefined : sectionDefs,
      });
      setSavedAt(new Date().toLocaleTimeString());
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save (debounce 1.5s)
  useEffect(() => {
    if (!isDirty) return;
    if (!title.trim()) return;
    const timer = setTimeout(() => handleSave(true), 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, title, description, category, department, sectionsContent, sectionDefs]);

  // Ctrl/Cmd+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, category, department, sectionsContent, sectionDefs]);

  const handleDelete = () => {
    deleteItem('userSopTemplates', template.id);
    router.push('/sops/templates');
  };

  const handleUseToCreateSop = () => {
    // Save first (silent), then navigate to /sops/new with this template applied
    handleSave(true);
    router.push(`/sops/new?userTemplateId=${template.id}`);
  };

  const handleReorderSections = (newOrder: string[]) => {
    const map = new Map(sectionDefs.map((s) => [s.key, s]));
    const next = newOrder.map((k) => map.get(k)).filter((s): s is SOPSectionDef => Boolean(s));
    setSectionDefs(next);
  };

  const handleRemoveSection = (key: string) => {
    setSectionDefs((prev) => prev.filter((s) => s.key !== key));
    setSectionsContent((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* TOP BAR */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => router.push('/sops/templates')}
              className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              aria-label="Back to templates"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold text-white">
                {title || 'Edit template'}
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
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              leftIcon={<Trash2 />}
              onClick={() => setShowDelete(true)}
              className="text-rose-400 hover:bg-rose-500/15 hover:text-rose-300"
            >
              Delete
            </Button>
            <Button variant="secondary" leftIcon={<Save />} onClick={() => handleSave()}>
              Save
            </Button>
            <Button rightIcon={<ArrowRight />} onClick={handleUseToCreateSop}>
              Use to create SOP
            </Button>
          </div>
        </div>

        {/* META FORM */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Template name *</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekly Stand-up Template"
                className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Department</span>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Operations"
                className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 lg:col-span-2">
              <span className="text-xs text-slate-400">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="What is this template for?"
                className="resize-y rounded-md border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SOPCategory | '')}
                className="h-10 rounded-md border border-slate-700 bg-slate-900 px-2 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
              >
                <option value="">Uncategorised</option>
                {SOP_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* STRUCTURED EDITOR */}
        <StructuredEditor
          value={editorContent}
          onChange={handleEditorChange}
          sectionDefs={sectionDefs}
          onReorder={handleReorderSections}
          onRemoveSection={handleRemoveSection}
        />
      </div>

      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete template?"
        description={`"${title || 'Template'}" will be permanently removed.`}
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-400">This action cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  );
}
