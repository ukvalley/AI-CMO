'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Printer,
  Download,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Copy as CopyIcon,
  Star,
  Share2,
  Link2,
  X,
  Bookmark,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useDataStore } from '@/stores';
import type { SOP, SOPStatus } from '@/types/entities';
import {
  SOP_STATUS_LABELS,
  SOP_STATUS_BADGE,
  SOP_PRIORITY_LABELS,
  SOP_PRIORITY_BADGE,
  SOP_ACCESS_LABELS,
  buildDefaultHeader,
  buildDefaultSections,
  slugify,
} from '@/lib/sopConstants';
import { SopRenderer } from '@/components/sop/SopRenderer';
import { useSopPrefs } from '@/hooks/useSopPrefs';

function generateToken(): string {
  const a = Math.random().toString(36).slice(2, 10);
  const b = Date.now().toString(36);
  return `${a}${b}`;
}

export default function SopDetailRoute() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || '';
  const { getItems, addItem, deleteItem, updateItem } = useDataStore();
  const sops = (getItems('sops') as SOP[]) || [];
  const sop = useMemo(() => sops.find((s) => s.id === id) || null, [sops, id]);
  const prefs = useSopPrefs();
  const fav = sop ? prefs.isFavourite(sop.id) : false;

  // Track view in recents
  useEffect(() => {
    if (sop) prefs.addRecent(sop.id);
  }, [sop?.id, prefs]);

  // Ctrl/Cmd+P → open print page; Ctrl/Cmd+E → edit
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sop) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        window.open(`/sops/${sop.id}/print`, '_blank');
      } else if (mod && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        router.push(`/sops/${sop.id}/edit`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sop, router]);

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

  const status = (sop.status || 'draft') as SOPStatus;
  const priority = sop.priority || 'low';
  const title = sop.title || sop.name || 'Untitled SOP';

  const content =
    sop.content ||
    {
      header: buildDefaultHeader(sop.department),
      sections: buildDefaultSections() as never,
    };

  const handleDelete = () => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteItem('sops', sop.id);
    router.push('/sops');
  };

  const handlePublish = () => {
    updateItem('sops', sop.id, { status: 'published' });
  };

  const handleArchive = () => {
    updateItem('sops', sop.id, { status: 'archived' });
  };

  const [showShareModal, setShowShareModal] = React.useState(false);

  const handleShare = () => {
    if (!sop.share?.token) {
      const token = generateToken();
      updateItem('sops', sop.id, {
        share: { token, createdAt: new Date().toISOString() },
      });
    }
    setShowShareModal(true);
  };

  const handleRevokeShare = () => {
    updateItem('sops', sop.id, { share: null });
    setShowShareModal(false);
  };

  const shareUrl = sop.share?.token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/sops/share/${sop.share.token}`
    : '';

  const handleSaveAsTemplate = () => {
    const name = window.prompt(
      'Save this SOP as a reusable template. Template name:',
      `${title} template`
    );
    if (!name?.trim()) return;
    const description = window.prompt('Short description (optional):', '') || '';
    const id = addItem('userSopTemplates', {
      title: name.trim(),
      description: description.trim(),
      category: sop.category,
      department: sop.department,
      icon: 'FileText',
      sections: sop.content?.sections ? { ...sop.content.sections } : {},
    } as Parameters<typeof addItem>[1]);
    if (
      window.confirm(
        'Template saved. Open it in the template editor now? (Cancel to stay here.)'
      )
    ) {
      router.push(`/sops/templates/${id}/edit`);
    }
  };

  const handleDuplicate = () => {
    const copy: Partial<SOP> = {
      title: `Copy of ${title}`,
      slug: slugify(`copy-of-${title}`),
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* TOP BAR */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/sops')}
              className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold text-white">{title}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${SOP_STATUS_BADGE[status]}`}
                >
                  {SOP_STATUS_LABELS[status]}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${SOP_PRIORITY_BADGE[priority]}`}
                >
                  {SOP_PRIORITY_LABELS[priority]} priority
                </span>
                {sop.isCritical && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 text-[10px] uppercase text-rose-300">
                    <ShieldAlert className="h-3 w-3" />
                    Critical
                  </span>
                )}
                {sop.versionLabel && (
                  <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] uppercase text-slate-400">
                    {sop.versionLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => prefs.toggleFavourite(sop.id)}
              className={
                'rounded-md p-2 transition-colors ' +
                (fav
                  ? 'text-amber-400 hover:bg-amber-500/15'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-amber-400')
              }
              title={fav ? 'Unstar (in favourites)' : 'Star'}
              aria-label="Toggle favourite"
            >
              <Star className={`h-4 w-4 ${fav ? 'fill-amber-400' : ''}`} />
            </button>
            <Button variant="ghost" leftIcon={<Printer />} onClick={() => window.open(`/sops/${sop.id}/print`, '_blank')}>
              Print
            </Button>
            <Button
              variant="ghost"
              leftIcon={<Download />}
              onClick={() => window.alert('DOCX export needs the backend endpoint /sops/:id/export/docx — coordinate with the backend dev.')}
            >
              DOCX
            </Button>
            <Button variant="ghost" leftIcon={<CopyIcon />} onClick={handleDuplicate}>
              Duplicate
            </Button>
            <Button variant="ghost" leftIcon={<Bookmark />} onClick={handleSaveAsTemplate}>
              Save as template
            </Button>
            <Button variant="ghost" leftIcon={<Share2 />} onClick={handleShare}>
              Share
            </Button>
            {status !== 'published' && (
              <Button variant="secondary" leftIcon={<CheckCircle2 />} onClick={handlePublish}>
                Publish
              </Button>
            )}
            {status !== 'archived' && (
              <Button variant="ghost" onClick={handleArchive}>
                Archive
              </Button>
            )}
            <Button leftIcon={<Pencil />} onClick={() => router.push(`/sops/${sop.id}/edit`)}>
              Edit
            </Button>
            <button
              onClick={handleDelete}
              className="rounded-md p-2 text-rose-400 transition-colors hover:bg-rose-500/15"
              title="Delete"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <SopRenderer content={content} />
          </div>
          <DetailSidebar sop={sop} />
        </div>
      </div>

      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share this SOP"
        description="Anyone with this link can read the SOP. They will not be able to edit it."
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900 p-2">
            <Link2 className="h-4 w-4 shrink-0 text-slate-500" />
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-slate-200 focus:outline-none"
              onFocus={(e) => e.currentTarget.select()}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
              }}
            >
              <CopyIcon className="mr-1 h-3.5 w-3.5" />
              Copy
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <span>
              Note: in this preview the SOP is stored locally. The link works only on this browser
              until the backend is wired.
            </span>
          </div>

          <div className="flex justify-between border-t border-slate-700 pt-3">
            <Button variant="ghost" onClick={handleRevokeShare}>
              <X className="mr-1.5 h-4 w-4" />
              Revoke link
            </Button>
            <Button onClick={() => window.open(shareUrl, '_blank')}>
              Open share view
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

function DetailSidebar({ sop }: { sop: SOP }) {
  const accessLabel = sop.accessLevel ? SOP_ACCESS_LABELS[sop.accessLevel] : '—';
  return (
    <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-400">Properties</h3>
        <dl className="space-y-2 text-xs">
          <DLRow label="Category" value={sop.category} />
          <DLRow label="Department" value={sop.department} />
          <DLRow label="Owner" value={sop.owner} />
          <DLRow label="Access" value={accessLabel} />
          <DLRow label="Version" value={sop.versionLabel} />
        </dl>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
        <h3 className="mb-3 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          Lifecycle
        </h3>
        <dl className="space-y-2 text-xs">
          <DLRow label="Created" value={sop.createdAt ? new Date(sop.createdAt).toLocaleDateString() : '—'} />
          <DLRow label="Updated" value={sop.updatedAt ? new Date(sop.updatedAt).toLocaleDateString() : '—'} />
          <DLRow label="Next review" value={sop.nextReviewAt} />
          <DLRow label="Expires" value={sop.expiresAt} />
        </dl>
      </div>

      {sop.tags && sop.tags.length > 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-400">Tags</h3>
          <div className="flex flex-wrap gap-1.5">
            {sop.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-400">More</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href={`/sops/${sop.id}/versions`}
              className="flex items-center justify-between text-slate-300 hover:text-primary-300"
            >
              <span>Version history</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                {(sop.versions || []).length}
              </span>
            </a>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-primary-500/30 bg-primary-500/10 p-4">
        <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-primary-200">
          <Sparkles className="h-3.5 w-3.5" />
          Improve with AI
        </h3>
        <p className="mb-2 text-xs text-primary-100/80">
          Rewrite, summarise or check this SOP for improvements.
        </p>
        <a
          href={`/sops/ai?sopId=${sop.id}`}
          className="inline-flex items-center gap-1 rounded-md bg-primary-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600"
        >
          Open AI Studio
        </a>
      </div>
    </aside>
  );
}

function DLRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-slate-300">{value || '—'}</dd>
    </div>
  );
}
