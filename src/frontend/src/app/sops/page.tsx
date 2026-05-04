'use client';

/**
 * SOP Library
 *
 * Browse, search and filter all SOPs. Entry point for create / AI / templates.
 * Adds favourites, recents, density toggle, content-search and seed data
 * on the empty state.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Grid3x3,
  List as ListIcon,
  Sparkles,
  FileText,
  Layers,
  Eye,
  Pencil,
  Trash2,
  ClipboardList,
  Star,
  Clock,
  Copy as CopyIcon,
  Rows3,
  LayoutGrid,
  Wand2,
  CheckSquare,
  Printer,
  X,
  Check,
  Bookmark,
  ChevronDown,
  Network,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useDataStore } from '@/stores';
import type { SOP, SOPStatus, SOPPriority, SOPContent } from '@/types/entities';
import {
  SOP_CATEGORIES,
  SOP_STATUS_LABELS,
  SOP_STATUS_BADGE,
  SOP_PRIORITY_LABELS,
  SOP_PRIORITY_BADGE,
  buildDefaultHeader,
  buildDefaultSections,
  slugify,
} from '@/lib/sopConstants';
import { SOP_TEMPLATES } from '@/lib/sopTemplates';
import { useSopPrefs, type SopDensity } from '@/hooks/useSopPrefs';
import {
  SopContextMenu,
  useSopContextMenu,
  type SopContextMenuItem,
} from '@/components/sop/SopContextMenu';
import { SopSubNav } from '@/components/sop/SopSubNav';

type ViewMode = 'grid' | 'list';

export default function SopsRoute() {
  const router = useRouter();
  const { getItems, addItem, deleteItem } = useDataStore();
  const sops = (getItems('sops') as SOP[]) || [];
  const prefs = useSopPrefs();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SOPStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<SOPPriority | 'all'>('all');
  const [favsOnly, setFavsOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<SOP | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exitSelect = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  const ctx = useSopContextMenu();
  const buildContextItems = (sop: SOP): SopContextMenuItem[] => [
    { label: 'View', icon: Eye, onClick: () => router.push(`/sops/${sop.id}`) },
    { label: 'Edit', icon: Pencil, onClick: () => router.push(`/sops/${sop.id}/edit`) },
    { label: 'Duplicate', icon: CopyIcon, onClick: () => handleDuplicate(sop) },
    {
      label: prefs.isFavourite(sop.id) ? 'Unstar' : 'Star',
      icon: Star,
      onClick: () => prefs.toggleFavourite(sop.id),
    },
    { label: 'Print / PDF', icon: Printer, onClick: () => window.open(`/sops/${sop.id}/print`, '_blank') },
    { divider: true, label: '', onClick: () => {} },
    { label: 'Delete', icon: Trash2, onClick: () => setConfirmDelete(sop), danger: true },
  ];

  // Apply filters + content-search + favourites pinning
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const matched = sops.filter((sop) => {
      if (favsOnly && !prefs.favourites.includes(sop.id)) return false;
      if (statusFilter !== 'all' && sop.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && sop.category !== categoryFilter) return false;
      if (priorityFilter !== 'all' && sop.priority !== priorityFilter) return false;
      if (!q) return true;
      return sopMatchesQuery(sop, q);
    });

    // Pin favourites at the top (alphabetised within each group by title)
    return matched.sort((a, b) => {
      const aFav = prefs.favourites.includes(a.id) ? 0 : 1;
      const bFav = prefs.favourites.includes(b.id) ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      const at = (a.title || a.name || '').toLowerCase();
      const bt = (b.title || b.name || '').toLowerCase();
      return at.localeCompare(bt);
    });
  }, [sops, search, statusFilter, categoryFilter, priorityFilter, favsOnly, prefs.favourites]);

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: sops.length };
    (Object.keys(SOP_STATUS_LABELS) as SOPStatus[]).forEach((s) => {
      out[s] = sops.filter((sop) => sop.status === s).length;
    });
    out.favourites = sops.filter((s) => prefs.favourites.includes(s.id)).length;
    return out;
  }, [sops, prefs.favourites]);

  // Recently viewed (skip ones that no longer exist)
  const recents = useMemo(() => {
    return prefs.recents
      .map((id) => sops.find((s) => s.id === id))
      .filter((s): s is SOP => Boolean(s))
      .slice(0, 6);
  }, [prefs.recents, sops]);

  const isFiltering =
    search.trim() !== '' ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    priorityFilter !== 'all' ||
    favsOnly;

  // ─── Actions ───────────────────────────────────
  const handleDelete = (sop: SOP) => {
    deleteItem('sops', sop.id);
    setConfirmDelete(null);
  };

  const handleDuplicate = (sop: SOP) => {
    const copy: Partial<SOP> = {
      title: `Copy of ${sop.title || sop.name || 'Untitled SOP'}`,
      slug: slugify(`copy-of-${sop.title || sop.name || 'sop'}`),
      category: sop.category,
      department: sop.department,
      status: 'draft',
      priority: sop.priority || 'low',
      accessLevel: sop.accessLevel || 'internal',
      versionLabel: 'R00',
      owner: sop.owner,
      tags: sop.tags ? [...sop.tags] : undefined,
      isCritical: sop.isCritical,
      content: sop.content
        ? {
            header: { ...sop.content.header, versionLabel: 'R00' },
            sections: { ...sop.content.sections },
          }
        : undefined,
    };
    const newId = addItem('sops', copy as Parameters<typeof addItem>[1]);
    router.push(`/sops/${newId}/edit`);
  };

  const handleSeedDemo = () => {
    SOP_TEMPLATES.forEach((tpl) => {
      const content: SOPContent = {
        header: buildDefaultHeader(tpl.department),
        sections: {
          ...(buildDefaultSections() as Record<string, never>),
          ...tpl.sections,
        } as SOPContent['sections'],
      };
      addItem('sops', {
        title: tpl.title,
        slug: slugify(tpl.title),
        category: tpl.category,
        department: (tpl.department as never) || undefined,
        status: 'draft',
        priority: 'medium',
        accessLevel: 'internal',
        versionLabel: 'R00',
        content,
      } as Parameters<typeof addItem>[1]);
    });
  };

  // ─── Keyboard shortcuts ──────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'n' && !isTyping && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowCreateModal(true);
      } else if (e.key === 'g' && !isTyping && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setViewMode((m) => (m === 'grid' ? 'list' : 'grid'));
      } else if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        setSearch('');
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-white">SOPs</h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Standard Operating Procedures — generate with AI, start from a template, or write from scratch.
            </p>
          </div>
          <div className="shrink-0">
            <Button leftIcon={<Plus />} onClick={() => setShowCreateModal(true)}>
              New SOP
            </Button>
          </div>
        </div>

        {/* SECTION NAV */}
        <SopSubNav active="library" />

        {/* SAVED VIEWS */}
        <SavedViewsBar
          views={prefs.savedViews}
          isFiltering={isFiltering}
          onApply={(v) => {
            setSearch(v.search || '');
            setStatusFilter((v.status as SOPStatus | 'all') || 'all');
            setCategoryFilter(v.category || 'all');
            setPriorityFilter((v.priority as SOPPriority | 'all') || 'all');
            setFavsOnly(!!v.favsOnly);
          }}
          onSaveCurrent={() => {
            const name = window.prompt('Name this view:');
            if (!name?.trim()) return;
            prefs.saveView({
              name: name.trim(),
              search,
              status: statusFilter,
              category: categoryFilter,
              priority: priorityFilter,
              favsOnly,
            });
          }}
          onDelete={(id) => prefs.deleteView(id)}
        />

        {/* RECENTLY VIEWED */}
        {!isFiltering && recents.length > 0 && (
          <RecentlyViewed sops={recents} onClear={prefs.clearRecents} />
        )}

        {/* STATUS COUNT STRIP */}
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'draft', 'in_review', 'approved', 'published', 'archived'] as const).map((s) => {
            const isActive = statusFilter === s;
            const label = s === 'all' ? 'All' : SOP_STATUS_LABELS[s];
            const count = counts[s] ?? 0;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={
                  'rounded-full border px-3 py-1 text-xs transition-colors ' +
                  (isActive
                    ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                    : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:bg-slate-700/40')
                }
              >
                {label} <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
          <button
            onClick={() => setFavsOnly((v) => !v)}
            className={
              'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ' +
              (favsOnly
                ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:bg-slate-700/40')
            }
            title="Show only favourites"
          >
            <Star className={`h-3.5 w-3.5 ${favsOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            Favourites
            <span className="opacity-70">({counts.favourites ?? 0})</span>
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-800/40 p-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              ref={searchRef}
              leftIcon={<Search className="h-4 w-4 text-slate-500" />}
              placeholder="Search SOPs by title or content…  (press / to focus)"
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
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as SOPPriority | 'all')}
            className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            {(Object.keys(SOP_PRIORITY_LABELS) as SOPPriority[]).map((p) => (
              <option key={p} value={p}>
                {SOP_PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
          {sops.length > 0 && (
            <button
              onClick={() => (selectMode ? exitSelect() : setSelectMode(true))}
              className={
                'h-10 rounded-md border px-3 text-xs font-medium transition-colors ' +
                (selectMode
                  ? 'border-primary-500 bg-primary-500/15 text-primary-300'
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200')
              }
              title={selectMode ? 'Exit multi-select' : 'Multi-select for bulk actions'}
            >
              <CheckSquare className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />
              {selectMode ? 'Done' : 'Select'}
            </button>
          )}
          <ViewControl
            viewMode={viewMode}
            onViewMode={setViewMode}
            density={prefs.density}
            onDensity={prefs.setDensity}
          />
        </div>

        {/* CONTENT */}
        {filtered.length === 0 ? (
          <EmptyState
            hasAny={sops.length > 0}
            onNew={() => setShowCreateModal(true)}
            onSeed={handleSeedDemo}
          />
        ) : viewMode === 'grid' ? (
          <SopGrid
            sops={filtered}
            density={prefs.density}
            isFavourite={prefs.isFavourite}
            onToggleFavourite={prefs.toggleFavourite}
            selectMode={selectMode}
            isSelected={(id) => selected.has(id)}
            onToggleSelect={toggleSelected}
            onView={(s) => (selectMode ? toggleSelected(s.id) : router.push(`/sops/${s.id}`))}
            onEdit={(s) => router.push(`/sops/${s.id}/edit`)}
            onDuplicate={handleDuplicate}
            onDelete={(s) => setConfirmDelete(s)}
            onContextMenu={(e, s) => ctx.open(e, buildContextItems(s))}
          />
        ) : (
          <SopList
            sops={filtered}
            isFavourite={prefs.isFavourite}
            onToggleFavourite={prefs.toggleFavourite}
            selectMode={selectMode}
            isSelected={(id) => selected.has(id)}
            onToggleSelect={toggleSelected}
            onView={(s) => (selectMode ? toggleSelected(s.id) : router.push(`/sops/${s.id}`))}
            onEdit={(s) => router.push(`/sops/${s.id}/edit`)}
            onDuplicate={handleDuplicate}
            onDelete={(s) => setConfirmDelete(s)}
            onContextMenu={(e, s) => ctx.open(e, buildContextItems(s))}
          />
        )}

        <SopContextMenu state={ctx.state} onClose={ctx.close} />

        {/* SELECTION ACTION BAR */}
        {selectMode && (
          <div className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-xl border border-primary-500/40 bg-slate-900 px-4 py-3 shadow-lg shadow-black/40 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <CheckSquare className="h-4 w-4 text-primary-300" />
              <span>{selected.size} selected</span>
              {selected.size > 0 && (
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelected(new Set(filtered.map((s) => s.id)))}
              >
                Select all
              </Button>
              <Button
                size="sm"
                leftIcon={<Printer />}
                disabled={selected.size === 0}
                onClick={() =>
                  window.open(
                    `/sops/print-binder?ids=${Array.from(selected).join(',')}`,
                    '_blank'
                  )
                }
              >
                Print as binder
              </Button>
              <button
                onClick={exitSelect}
                className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                title="Exit selection"
                aria-label="Exit selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* SHORTCUTS HINT */}
        <p className="text-center text-[10px] text-slate-600">
          Shortcuts: <Kbd>/</Kbd> search · <Kbd>n</Kbd> new · <Kbd>g</Kbd> toggle view
        </p>
      </div>

      {/* CREATE MODAL */}
      <CreateSopModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      {/* DELETE CONFIRM */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete SOP?"
        description={`"${confirmDelete?.title || confirmDelete?.name}" will be permanently removed.`}
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
    </DashboardLayout>
  );
}

// ============================================
// HELPERS
// ============================================

function sopMatchesQuery(sop: SOP, q: string): boolean {
  const title = (sop.title || sop.name || '').toLowerCase();
  if (title.includes(q)) return true;
  if ((sop.category || '').toLowerCase().includes(q)) return true;
  if ((sop.department || '').toLowerCase().includes(q)) return true;
  if ((sop.tags || []).some((t) => t.toLowerCase().includes(q))) return true;
  // Scan section content
  const sections = sop.content?.sections;
  if (sections) {
    for (const v of Object.values(sections)) {
      if (typeof v === 'string') {
        if (v.toLowerCase().includes(q)) return true;
      } else if (Array.isArray(v)) {
        for (const row of v) {
          if (row && typeof row === 'object') {
            for (const cell of Object.values(row as Record<string, string>)) {
              if (typeof cell === 'string' && cell.toLowerCase().includes(q)) return true;
            }
          }
        }
      }
    }
  }
  return false;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
      {children}
    </kbd>
  );
}

// ============================================
// SAVED VIEWS BAR
// ============================================

import type { SopSavedView } from '@/hooks/useSopPrefs';

function SavedViewsBar({
  views,
  isFiltering,
  onApply,
  onSaveCurrent,
  onDelete,
}: {
  views: SopSavedView[];
  isFiltering: boolean;
  onApply: (v: SopSavedView) => void;
  onSaveCurrent: () => void;
  onDelete: (id: string) => void;
}) {
  if (views.length === 0 && !isFiltering) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-slate-500">
        <Bookmark className="h-3.5 w-3.5" />
        Saved views
      </span>
      {views.map((v) => (
        <span
          key={v.id}
          className="group inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/40 px-2 py-1 text-xs text-slate-300 transition-colors hover:border-primary-500/60"
        >
          <button onClick={() => onApply(v)} className="hover:text-primary-300">
            {v.name}
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete view "${v.name}"?`)) onDelete(v.id);
            }}
            className="rounded p-0.5 text-slate-600 opacity-0 hover:text-rose-400 group-hover:opacity-100"
            aria-label="Delete view"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {isFiltering && (
        <button
          onClick={onSaveCurrent}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-700 px-2 py-1 text-xs text-slate-400 hover:border-primary-500/60 hover:text-primary-300"
        >
          <Plus className="h-3 w-3" />
          Save current
        </button>
      )}
    </div>
  );
}

// ============================================
// CREATE MODAL — three paths
// ============================================

function CreateSopModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();

  const go = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new SOP" size="md">
      <div className="space-y-3">
        <button
          onClick={() => go('/sops/ai')}
          className="flex w-full items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/60 p-4 text-left transition-colors hover:border-primary-500/60 hover:bg-slate-800"
        >
          <div className="rounded-md bg-primary-500/20 p-2 text-primary-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-slate-200">Generate with AI</div>
            <div className="mt-0.5 text-xs text-slate-400">
              Describe a process and let AI draft a full structured SOP for you.
            </div>
          </div>
        </button>

        <button
          onClick={() => go('/sops/new?source=template')}
          className="flex w-full items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/60 p-4 text-left transition-colors hover:border-primary-500/60 hover:bg-slate-800"
        >
          <div className="rounded-md bg-blue-500/20 p-2 text-blue-300">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-slate-200">
              Use a template <span className="ml-1 text-xs text-slate-500">({SOP_TEMPLATES.length} available)</span>
            </div>
            <div className="mt-0.5 text-xs text-slate-400">
              Start from a pre-filled founder-ready SOP — onboarding, hiring, support and more.
            </div>
          </div>
        </button>

        <button
          onClick={() => go('/sops/new')}
          className="flex w-full items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/60 p-4 text-left transition-colors hover:border-primary-500/60 hover:bg-slate-800"
        >
          <div className="rounded-md bg-emerald-500/20 p-2 text-emerald-300">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-slate-200">Start from blank</div>
            <div className="mt-0.5 text-xs text-slate-400">
              Open the structured 20-section editor and write the SOP yourself.
            </div>
          </div>
        </button>
      </div>
    </Modal>
  );
}

// ============================================
// RECENTLY VIEWED STRIP
// ============================================

function RecentlyViewed({ sops, onClear }: { sops: SOP[]; onClear: () => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          Recently viewed
        </h2>
        <button onClick={onClear} className="text-[10px] text-slate-500 hover:text-slate-300">
          Clear
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {sops.map((sop) => {
          const status = sop.status || 'draft';
          return (
            <Link
              key={sop.id}
              href={`/sops/${sop.id}`}
              className="group relative flex min-w-[220px] max-w-[260px] flex-col gap-1 rounded-lg border border-slate-700 bg-slate-800/40 p-3 transition-colors hover:border-primary-500/60"
            >
              <span
                className={`absolute right-2 top-2 rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-wide ${SOP_STATUS_BADGE[status]}`}
              >
                {SOP_STATUS_LABELS[status]}
              </span>
              <span className="line-clamp-2 pr-14 text-sm font-medium text-slate-200 group-hover:text-primary-300">
                {sop.title || sop.name}
              </span>
              <span className="text-[10px] text-slate-500">
                {sop.category || '—'} · {sop.versionLabel || 'R00'}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// VIEW CONTROL — combined view-mode + density
// ============================================

function ViewControl({
  viewMode,
  onViewMode,
  density,
  onDensity,
}: {
  viewMode: ViewMode;
  onViewMode: (v: ViewMode) => void;
  density: SopDensity;
  onDensity: (d: SopDensity) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 p-1">
      <SegBtn
        active={viewMode === 'grid'}
        onClick={() => onViewMode('grid')}
        title="Grid view (g)"
        ariaLabel="Grid view"
      >
        <Grid3x3 className="h-4 w-4" />
      </SegBtn>
      <SegBtn
        active={viewMode === 'list'}
        onClick={() => onViewMode('list')}
        title="List view (g)"
        ariaLabel="List view"
      >
        <ListIcon className="h-4 w-4" />
      </SegBtn>
      {viewMode === 'grid' && (
        <>
          <span className="mx-1 h-5 w-px bg-slate-700" />
          <SegBtn
            active={density === 'compact'}
            onClick={() => onDensity(density === 'compact' ? 'comfy' : 'compact')}
            title={density === 'compact' ? 'Switch to comfy spacing' : 'Switch to compact spacing'}
            ariaLabel="Toggle density"
          >
            {density === 'compact' ? <Rows3 className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </SegBtn>
        </>
      )}
    </div>
  );
}

function SegBtn({
  active,
  onClick,
  title,
  ariaLabel,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className={
        'rounded p-1.5 transition-colors ' +
        (active ? 'bg-primary-500/20 text-primary-300' : 'text-slate-500 hover:text-slate-300')
      }
    >
      {children}
    </button>
  );
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState({
  hasAny,
  onNew,
  onSeed,
}: {
  hasAny: boolean;
  onNew: () => void;
  onSeed: () => void;
}) {
  // Filter-empty state — small message
  if (hasAny) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-700 bg-slate-800/30 px-6 py-12 text-center">
        <div className="mb-3 rounded-full bg-slate-800 p-3">
          <ClipboardList className="h-6 w-6 text-slate-500" />
        </div>
        <h3 className="text-base font-medium text-slate-200">No SOPs match your filters</h3>
        <p className="mt-1 max-w-md text-sm text-slate-400">
          Try clearing the search or adjusting filters above.
        </p>
      </div>
    );
  }

  // First-run state — three big visual paths + load demo link
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mb-3 inline-flex rounded-full bg-slate-800 p-3">
          <ClipboardList className="h-6 w-6 text-primary-300" />
        </div>
        <h2 className="text-xl font-semibold text-slate-100">Get started with SOPs</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
          Pick how you want to start. You can switch any time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <PathCard
          icon={Sparkles}
          title="Generate with AI"
          desc="Describe a process and let AI draft a full structured SOP for you."
          accent="primary"
          href="/sops/ai"
        />
        <PathCard
          icon={Layers}
          title="Use a template"
          desc="Start from one of 8 founder-ready templates — onboarding, hiring, support and more."
          accent="blue"
          href="/sops/templates"
        />
        <PathCard
          icon={Plus}
          title="Start from blank"
          desc="Open the structured 20-section editor and write the SOP yourself."
          accent="emerald"
          onClick={onNew}
        />
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={onSeed}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary-300"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Or load 8 demo SOPs to explore
        </button>
      </div>
    </div>
  );
}

function PathCard({
  icon: Icon,
  title,
  desc,
  accent,
  href,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  accent: 'primary' | 'blue' | 'emerald';
  href?: string;
  onClick?: () => void;
}) {
  const accents: Record<string, string> = {
    primary: 'bg-primary-500/15 text-primary-300 ring-primary-500/30',
    blue: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  };

  const inner = (
    <div className="group flex h-full flex-col items-start rounded-xl border border-slate-700 bg-slate-800/40 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary-500/60 hover:bg-slate-800/70">
      <div className={`mb-3 rounded-lg p-2.5 ring-1 ${accents[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{desc}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500 group-hover:text-primary-300">
        Get started →
      </span>
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return (
    <button onClick={onClick} className="text-left">
      {inner}
    </button>
  );
}

// ============================================
// GRID VIEW
// ============================================

interface RowProps {
  sops: SOP[];
  isFavourite: (id: string) => boolean;
  onToggleFavourite: (id: string) => void;
  selectMode: boolean;
  isSelected: (id: string) => boolean;
  onToggleSelect: (id: string) => void;
  onView: (sop: SOP) => void;
  onEdit: (sop: SOP) => void;
  onDuplicate: (sop: SOP) => void;
  onDelete: (sop: SOP) => void;
  onContextMenu: (e: React.MouseEvent, sop: SOP) => void;
}

function SopGrid({
  sops,
  density,
  isFavourite,
  onToggleFavourite,
  selectMode,
  isSelected,
  onToggleSelect,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onContextMenu,
}: RowProps & { density: SopDensity }) {
  const cols =
    density === 'compact'
      ? 'grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'
      : 'grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  return (
    <div className={`grid ${cols}`}>
      {sops.map((sop) => (
        <SopCard
          key={sop.id}
          sop={sop}
          density={density}
          isFavourite={isFavourite(sop.id)}
          onToggleFavourite={() => onToggleFavourite(sop.id)}
          selectMode={selectMode}
          isSelected={isSelected(sop.id)}
          onToggleSelect={() => onToggleSelect(sop.id)}
          onView={onView}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onContextMenu={(e) => onContextMenu(e, sop)}
        />
      ))}
    </div>
  );
}

interface CardProps {
  sop: SOP;
  density: SopDensity;
  isFavourite: boolean;
  onToggleFavourite: () => void;
  selectMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
  onView: (sop: SOP) => void;
  onEdit: (sop: SOP) => void;
  onDuplicate: (sop: SOP) => void;
  onDelete: (sop: SOP) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function SopCard({
  sop,
  density,
  isFavourite,
  onToggleFavourite,
  selectMode,
  isSelected,
  onToggleSelect,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onContextMenu,
}: CardProps) {
  const status = sop.status || 'draft';
  const priority = sop.priority || 'low';
  const title = sop.title || sop.name || 'Untitled SOP';
  const compact = density === 'compact';

  return (
    <div
      onContextMenu={onContextMenu}
      className={
        'group relative flex flex-col overflow-hidden rounded-xl border bg-slate-800/50 transition-colors ' +
        (isSelected ? 'border-primary-500 ring-1 ring-primary-500/40' : 'border-slate-700 hover:border-primary-500/60')
      }
    >
      {selectMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded border border-slate-600 bg-slate-900 text-primary-300"
          aria-label="Select SOP"
        >
          {isSelected && <Check className="h-3.5 w-3.5" />}
        </button>
      )}
      <div className={`h-1.5 w-full ${statusBarColor(status)}`} />
      <div className={`flex flex-1 flex-col ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`line-clamp-2 cursor-pointer font-semibold text-slate-200 hover:text-primary-300 ${
              compact ? 'text-xs' : 'text-sm'
            }`}
            onClick={() => onView(sop)}
          >
            {title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavourite();
            }}
            className={
              'shrink-0 rounded p-1 transition-colors ' +
              (isFavourite ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400')
            }
            title={isFavourite ? 'Unstar' : 'Star'}
            aria-label="Toggle favourite"
          >
            <Star className={`h-3.5 w-3.5 ${isFavourite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
        <div className={`flex flex-wrap gap-1.5 ${compact ? 'mt-1.5' : 'mt-2'}`}>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${SOP_STATUS_BADGE[status]}`}>
            {SOP_STATUS_LABELS[status]}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${SOP_PRIORITY_BADGE[priority]}`}>
            {SOP_PRIORITY_LABELS[priority]}
          </span>
        </div>
        {!compact && (
          <div className="mt-3 space-y-1 text-xs text-slate-400">
            {sop.category && (
              <div>
                <span className="text-slate-500">Category:</span> {sop.category}
              </div>
            )}
            {sop.versionLabel && (
              <div>
                <span className="text-slate-500">Version:</span> {sop.versionLabel}
              </div>
            )}
            {sop.owner && (
              <div className="truncate">
                <span className="text-slate-500">Owner:</span> {sop.owner}
              </div>
            )}
          </div>
        )}
        <div className={`flex items-center justify-between border-t border-slate-700 ${compact ? 'mt-2 pt-2' : 'mt-4 pt-3'}`}>
          <span className="text-[10px] text-slate-500">
            {sop.updatedAt ? new Date(sop.updatedAt).toLocaleDateString() : '—'}
          </span>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <IconBtn label="View" onClick={() => onView(sop)}>
              <Eye className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn label="Edit" onClick={() => onEdit(sop)}>
              <Pencil className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn label="Duplicate" onClick={() => onDuplicate(sop)}>
              <CopyIcon className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn label="Delete" onClick={() => onDelete(sop)} danger>
              <Trash2 className="h-3.5 w-3.5" />
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={
        'rounded p-1.5 transition-colors ' +
        (danger
          ? 'text-rose-400 hover:bg-rose-500/15'
          : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200')
      }
    >
      {children}
    </button>
  );
}

function statusBarColor(status: SOPStatus): string {
  const map: Record<SOPStatus, string> = {
    draft: 'bg-slate-600',
    in_review: 'bg-amber-500',
    approved: 'bg-blue-500',
    published: 'bg-emerald-500',
    archived: 'bg-rose-500',
  };
  return map[status] || 'bg-slate-600';
}

// ============================================
// LIST VIEW
// ============================================

function SopList({
  sops,
  isFavourite,
  onToggleFavourite,
  selectMode,
  isSelected,
  onToggleSelect,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onContextMenu,
}: RowProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/40">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-700 bg-slate-800/60">
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            {selectMode && <th className="w-8 px-2 py-3 font-medium" />}
            <th className="w-8 px-2 py-3 font-medium" />
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Version</th>
            <th className="px-4 py-3 font-medium">Owner</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {sops.map((sop) => {
            const status = sop.status || 'draft';
            const priority = sop.priority || 'low';
            const fav = isFavourite(sop.id);
            const sel = isSelected(sop.id);
            return (
              <tr
                key={sop.id}
                className={
                  'cursor-pointer transition-colors ' +
                  (sel ? 'bg-primary-500/10' : 'hover:bg-slate-800/60')
                }
                onClick={() => onView(sop)}
                onContextMenu={(e) => onContextMenu(e, sop)}
              >
                {selectMode && (
                  <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleSelect(sop.id)}
                      className="flex h-5 w-5 items-center justify-center rounded border border-slate-600 bg-slate-900 text-primary-300"
                      aria-label="Select SOP"
                    >
                      {sel && <Check className="h-3.5 w-3.5" />}
                    </button>
                  </td>
                )}
                <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleFavourite(sop.id)}
                    className={
                      'rounded p-1 transition-colors ' +
                      (fav ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400')
                    }
                    title={fav ? 'Unstar' : 'Star'}
                  >
                    <Star className={`h-3.5 w-3.5 ${fav ? 'fill-amber-400' : ''}`} />
                  </button>
                </td>
                <td className="px-4 py-3 font-medium text-slate-200">{sop.title || sop.name}</td>
                <td className="px-4 py-3 text-slate-400">{sop.category || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${SOP_STATUS_BADGE[status]}`}>
                    {SOP_STATUS_LABELS[status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${SOP_PRIORITY_BADGE[priority]}`}>
                    {SOP_PRIORITY_LABELS[priority]}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{sop.versionLabel || '—'}</td>
                <td className="px-4 py-3 text-slate-400">{sop.owner || '—'}</td>
                <td className="px-4 py-3 text-slate-500">
                  {sop.updatedAt ? new Date(sop.updatedAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <IconBtn label="View" onClick={() => onView(sop)}>
                      <Eye className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn label="Edit" onClick={() => onEdit(sop)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn label="Duplicate" onClick={() => onDuplicate(sop)}>
                      <CopyIcon className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn label="Delete" onClick={() => onDelete(sop)} danger>
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconBtn>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
