'use client';

/**
 * SOP Templates Browser
 *
 * Browse the 8 founder-ready starter templates. Click any template to open
 * the editor pre-filled with that template's content.
 */

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
  X,
  Plus,
  Pencil,
  Trash2,
  User as UserIcon,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useDataStore } from '@/stores';
import type { UserSopTemplate, SOPCategory, Department } from '@/types/entities';
import { SOP_TEMPLATES, type SopTemplate } from '@/lib/sopTemplates';
import { SOP_CATEGORIES } from '@/lib/sopConstants';
import { SopSubNav } from '@/components/sop/SopSubNav';

const CATEGORY_COLOURS: Record<string, string> = {
  Operations: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Sales: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  HR: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  IT: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  Finance: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Marketing: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  'Customer Service': 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  Quality: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  Safety: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  Compliance: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  Legal: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

export default function SopTemplatesRoute() {
  const router = useRouter();
  const { getItems, addItem, deleteItem } = useDataStore();
  const userTemplates = (getItems('userSopTemplates') as UserSopTemplate[]) || [];

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [previewTpl, setPreviewTpl] = useState<SopTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<UserSopTemplate | null>(null);

  const matchesQuery = (
    title: string,
    description: string,
    category: string | undefined,
    q: string
  ): boolean => {
    if (!q) return true;
    return (
      title.toLowerCase().includes(q) ||
      description.toLowerCase().includes(q) ||
      (category || '').toLowerCase().includes(q)
    );
  };

  const filteredBuiltIn = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SOP_TEMPLATES.filter((tpl) => {
      if (categoryFilter !== 'all' && tpl.category !== categoryFilter) return false;
      return matchesQuery(tpl.title, tpl.description, tpl.category, q);
    });
  }, [search, categoryFilter]);

  const filteredUser = useMemo(() => {
    const q = search.trim().toLowerCase();
    return userTemplates.filter((tpl) => {
      if (categoryFilter !== 'all' && tpl.category !== categoryFilter) return false;
      return matchesQuery(tpl.title || '', tpl.description || '', tpl.category, q);
    });
  }, [userTemplates, search, categoryFilter]);

  const handleUseBuiltIn = (id: string) => {
    router.push(`/sops/new?templateId=${id}`);
  };

  const handleUseUserTemplate = (id: string) => {
    router.push(`/sops/new?userTemplateId=${id}`);
  };

  const handleCreate = (data: {
    title: string;
    description: string;
    category: SOPCategory | '';
    department: string;
  }) => {
    const id = addItem('userSopTemplates', {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category || undefined,
      department: (data.department as Department) || undefined,
      icon: 'FileText',
      sections: {},
    } as Parameters<typeof addItem>[1]);
    setShowCreateModal(false);
    router.push(`/sops/templates/${id}/edit`);
  };

  const handleDelete = (tpl: UserSopTemplate) => {
    deleteItem('userSopTemplates', tpl.id);
    setConfirmDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-white">Templates</h1>
            <p className="mt-0.5 text-sm text-slate-400">
              {SOP_TEMPLATES.length} founder-ready templates — click any to open it pre-filled in the editor.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/sops/ai">
              <Button variant="ghost" leftIcon={<Sparkles />}>
                Generate with AI
              </Button>
            </Link>
            <Button leftIcon={<Plus />} onClick={() => setShowCreateModal(true)}>
              New Template
            </Button>
          </div>
        </div>

        {/* SECTION NAV */}
        <SopSubNav active="templates" />

        {/* CONTROLS */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-800/40 p-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              leftIcon={<Search className="h-4 w-4 text-slate-500" />}
              placeholder="Search templates by name, description, or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border-slate-700 text-slate-200"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {SOP_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* MY TEMPLATES */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-slate-400">
              <UserIcon className="h-3.5 w-3.5" />
              My Templates
              <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">
                {filteredUser.length}
              </span>
            </h2>
          </div>

          {filteredUser.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-700 bg-slate-800/20 px-6 py-10 text-center">
              <UserIcon className="mb-2 h-6 w-6 text-slate-500" />
              <p className="text-sm text-slate-400">
                {userTemplates.length === 0
                  ? 'You haven’t saved any templates yet.'
                  : 'No saved templates match the filter.'}
              </p>
              {userTemplates.length === 0 && (
                <Button
                  className="mt-3"
                  variant="secondary"
                  leftIcon={<Plus />}
                  onClick={() => setShowCreateModal(true)}
                >
                  Create your first template
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredUser.map((tpl) => {
                const colour =
                  (tpl.category && CATEGORY_COLOURS[tpl.category]) ||
                  'bg-slate-500/15 text-slate-300 border-slate-500/30';
                const sectionsFilled = Object.keys(tpl.sections || {}).length;
                return (
                  <div
                    key={tpl.id}
                    className="group flex flex-col rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-colors hover:border-primary-500/60"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${colour}`}
                      >
                        {tpl.category || 'Custom'}
                      </span>
                      <span className="rounded bg-primary-500/15 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-primary-300">
                        Yours
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-slate-100">
                      {tpl.title || 'Untitled template'}
                    </h3>
                    <p className="mt-1 line-clamp-3 flex-1 text-xs text-slate-400">
                      {tpl.description || 'No description'}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{sectionsFilled} sections pre-filled</span>
                      {tpl.department && (
                        <>
                          <span>·</span>
                          <span className="capitalize">{tpl.department.replace('-', ' ')}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Pencil />}
                        onClick={() => router.push(`/sops/templates/${tpl.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => setConfirmDelete(tpl)}
                        className="rounded-md p-1.5 text-rose-400 hover:bg-rose-500/15"
                        title="Delete template"
                        aria-label="Delete template"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <Button
                        size="sm"
                        rightIcon={<ArrowRight />}
                        onClick={() => handleUseUserTemplate(tpl.id)}
                        className="ml-auto"
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* BUILT-IN TEMPLATES */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-slate-400">
              <Layers className="h-3.5 w-3.5" />
              Built-in Templates
              <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">
                {filteredBuiltIn.length}
              </span>
            </h2>
          </div>

          {filteredBuiltIn.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-700 bg-slate-800/20 px-6 py-10 text-center">
              <Layers className="mb-2 h-6 w-6 text-slate-500" />
              <p className="text-sm text-slate-400">No built-in templates match your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBuiltIn.map((tpl) => {
                const colour =
                  CATEGORY_COLOURS[tpl.category] || 'bg-slate-500/15 text-slate-300 border-slate-500/30';
                const sectionsFilled = Object.keys(tpl.sections).length;
                return (
                  <div
                    key={tpl.id}
                    className="group flex flex-col rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-colors hover:border-primary-500/60"
                  >
                    <span
                      className={`self-start rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${colour}`}
                    >
                      {tpl.category}
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-slate-100">{tpl.title}</h3>
                    <p className="mt-1 line-clamp-3 flex-1 text-xs text-slate-400">{tpl.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{sectionsFilled} sections pre-filled</span>
                      {tpl.department && (
                        <>
                          <span>·</span>
                          <span className="capitalize">{tpl.department.replace('-', ' ')}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye />}
                        onClick={() => setPreviewTpl(tpl)}
                      >
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        rightIcon={<ArrowRight />}
                        onClick={() => handleUseBuiltIn(tpl.id)}
                        className="ml-auto"
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* CREATE TEMPLATE MODAL */}
      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />

      {/* DELETE CONFIRM */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete template?"
        description={`"${confirmDelete?.title || 'Template'}" will be permanently removed.`}
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => confirmDelete && handleDelete(confirmDelete)}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-400">This action cannot be undone.</p>
      </Modal>

      {/* PREVIEW MODAL */}
      <Modal
        isOpen={!!previewTpl}
        onClose={() => setPreviewTpl(null)}
        title={previewTpl?.title || 'Template'}
        description={previewTpl?.description}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setPreviewTpl(null)}>
              <X className="mr-1.5 h-4 w-4" />
              Close
            </Button>
            <Button
              leftIcon={<ArrowRight />}
              onClick={() => previewTpl && handleUseBuiltIn(previewTpl.id)}
            >
              Use this template
            </Button>
          </div>
        }
      >
        {previewTpl && (
          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                  CATEGORY_COLOURS[previewTpl.category] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                }`}
              >
                {previewTpl.category}
              </span>
              {previewTpl.department && (
                <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] uppercase capitalize text-slate-400">
                  {previewTpl.department.replace('-', ' ')}
                </span>
              )}
            </div>

            {Object.entries(previewTpl.sections).map(([key, content]) => (
              <div key={key} className="rounded-lg border border-slate-700 bg-slate-800/40 p-3">
                <h4 className="mb-2 text-sm font-semibold capitalize text-slate-200">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                {typeof content === 'string' ? (
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-400">
                    {content}
                  </p>
                ) : Array.isArray(content) ? (
                  <ul className="space-y-1 text-xs text-slate-400">
                    {content.map((row, i) => (
                      <li key={i} className="rounded bg-slate-900/40 px-2 py-1">
                        {Object.values(row as Record<string, string>).filter(Boolean).join(' · ')}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}

            <p className="text-[10px] text-slate-500">
              The remaining {Math.max(0, 20 - Object.keys(previewTpl.sections).length)} sections will be empty
              and ready for you to fill in.
            </p>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// CREATE TEMPLATE MODAL
// ============================================

function CreateTemplateModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; description: string; category: SOPCategory | ''; department: string }) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SOPCategory | ''>('');
  const [department, setDepartment] = useState('');

  const reset = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setDepartment('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({ title, description, category, department });
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create a new template"
      description="Give your template a name and category. You can fill in section content next."
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button leftIcon={<ArrowRight />} disabled={!title.trim()} onClick={handleSubmit}>
            Create &amp; edit
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-400">Template name *</span>
          <input
            type="text"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekly Stand-up Template"
            className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-400">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="What is this template for?"
            className="resize-y rounded-md border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
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
        </div>
      </div>
    </Modal>
  );
}
