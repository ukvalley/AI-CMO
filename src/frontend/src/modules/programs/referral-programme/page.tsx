/**
 * Referral Programme Module
 *
 * Manage referral and affiliate programmes. Standard ModulePage pattern:
 * list table + universal form + custom detail view.
 */

'use client';

import React from 'react';
import { Calendar, Gift, Sparkles, Users } from 'lucide-react';

import { ModulePage } from '@/components/shared';
import type { FormField } from '@/components/shared/UniversalForm';
import type { TableColumn } from '@/components/shared/UniversalTable';
import { useDataStore } from '@/stores';
import type {
  ReferralProgramme,
  ReferralStatus,
  ReferralRewardType,
} from '@/types/entities';
import {
  REFERRAL_STATUS_LABELS,
  REFERRAL_STATUS_BADGE,
  REFERRAL_REWARD_LABELS,
  REFERRAL_REWARD_BADGE,
} from '@/lib/referralConstants';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<ReferralProgramme>[] = [
  {
    key: 'name',
    header: 'Programme',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    filterable: true,
    filterOptions: (Object.keys(REFERRAL_STATUS_LABELS) as ReferralStatus[]).map((s) => ({
      value: s,
      label: REFERRAL_STATUS_LABELS[s],
    })),
    render: (value) => {
      const status = (value as ReferralStatus) || 'draft';
      return (
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${REFERRAL_STATUS_BADGE[status]}`}
        >
          {REFERRAL_STATUS_LABELS[status]}
        </span>
      );
    },
  },
  {
    key: 'rewardType',
    header: 'Reward Type',
    sortable: true,
    filterable: true,
    filterOptions: (Object.keys(REFERRAL_REWARD_LABELS) as ReferralRewardType[]).map((r) => ({
      value: r,
      label: REFERRAL_REWARD_LABELS[r],
    })),
    render: (value) => {
      const reward = (value as ReferralRewardType) || 'custom';
      return (
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${REFERRAL_REWARD_BADGE[reward]}`}
        >
          {REFERRAL_REWARD_LABELS[reward]}
        </span>
      );
    },
  },
  {
    key: 'referrerReward',
    header: 'Referrer Gets',
    render: (v) => <span className="text-slate-300">{(v as string) || '—'}</span>,
  },
  {
    key: 'refereeReward',
    header: 'New Customer Gets',
    render: (v) => <span className="text-slate-300">{(v as string) || '—'}</span>,
  },
  {
    key: 'validUntil',
    header: 'Valid Until',
    sortable: true,
    render: (v) => {
      if (!v) return <span className="text-slate-500">—</span>;
      return <span className="text-slate-400">{new Date(v as string).toLocaleDateString()}</span>;
    },
  },
];

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  {
    key: 'name',
    label: 'Programme Name',
    type: 'text',
    required: true,
    placeholder: 'e.g. Friends of Acme',
    colSpan: 2,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: (Object.keys(REFERRAL_STATUS_LABELS) as ReferralStatus[]).map((s) => ({
      value: s,
      label: REFERRAL_STATUS_LABELS[s],
    })),
  },
  {
    key: 'rewardType',
    label: 'Reward Type',
    type: 'select',
    required: true,
    options: (Object.keys(REFERRAL_REWARD_LABELS) as ReferralRewardType[]).map((r) => ({
      value: r,
      label: REFERRAL_REWARD_LABELS[r],
    })),
  },
  {
    key: 'referrerReward',
    label: 'Referrer Reward',
    type: 'text',
    placeholder: 'e.g. £20 cash bonus per signup',
    helperText: 'What the person making the referral receives.',
  },
  {
    key: 'refereeReward',
    label: 'New Customer Reward',
    type: 'text',
    placeholder: 'e.g. 15% off first order',
    helperText: 'What the new customer receives for using the referral.',
  },
  {
    key: 'validFrom',
    label: 'Valid From',
    type: 'date',
  },
  {
    key: 'validUntil',
    label: 'Valid Until',
    type: 'date',
  },
  {
    key: 'referralCodeFormat',
    label: 'Referral Code Format',
    type: 'text',
    placeholder: 'e.g. FRIEND-XXXX',
    helperText: 'Pattern for generating codes. Use X for random characters.',
    colSpan: 2,
  },
  {
    key: 'mechanics',
    label: 'How It Works (mechanics)',
    type: 'textarea',
    rows: 4,
    aiGenerate: true,
    placeholder:
      'Describe the steps: how a referrer shares, how a referee redeems, when the reward is paid out…',
    colSpan: 2,
  },
  {
    key: 'eligibility',
    label: 'Eligibility',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    placeholder: 'Who can refer? Existing customers only? Employees? Country restrictions?',
    colSpan: 2,
  },
  {
    key: 'terms',
    label: 'Terms & Conditions',
    type: 'textarea',
    rows: 4,
    aiGenerate: true,
    placeholder: 'Fraud rules, payout cap, expiry, region restrictions, dispute process…',
    colSpan: 2,
  },
  {
    key: 'fullDocument',
    label: 'Full Programme Document',
    type: 'textarea',
    rows: 6,
    aiGenerate: true,
    placeholder: 'Optional — generate a full programme document combining all of the above.',
    helperText: 'Use AI to combine the fields above into one polished document.',
    colSpan: 2,
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'tags',
    placeholder: 'Add tags…',
    colSpan: 2,
  },
];

// ============================================
// DETAIL VIEW
// ============================================

function DetailView({ item, onBack }: { item: ReferralProgramme; onBack: () => void }) {
  const status = (item.status || 'draft') as ReferralStatus;
  const reward = (item.rewardType || 'custom') as ReferralRewardType;

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-white">{item.name}</h2>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${REFERRAL_STATUS_BADGE[status]}`}
            >
              {REFERRAL_STATUS_LABELS[status]}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${REFERRAL_REWARD_BADGE[reward]}`}
            >
              {REFERRAL_REWARD_LABELS[reward]}
            </span>
            {item.referralCodeFormat && (
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                Code: {item.referralCodeFormat}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onBack}
          className="self-start rounded-md border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-primary-500/60 hover:text-primary-300"
        >
          ← Back to list
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
        {/* LEFT: SECTIONS */}
        <div className="space-y-4 min-w-0">
          <RewardCard
            referrer={item.referrerReward}
            referee={item.refereeReward}
          />
          <Section title="How it works" body={item.mechanics} />
          <Section title="Eligibility" body={item.eligibility} />
          <Section title="Terms &amp; Conditions" body={item.terms} />
          {item.fullDocument && <Section title="Full Document" body={item.fullDocument} />}
        </div>

        {/* RIGHT: METADATA */}
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
            <h3 className="mb-3 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              Validity
            </h3>
            <dl className="space-y-2 text-xs">
              <DLRow label="From" value={fmtDate(item.validFrom)} />
              <DLRow label="Until" value={fmtDate(item.validUntil)} />
              <DLRow label="Created" value={fmtDate(item.createdAt)} />
              <DLRow label="Updated" value={fmtDate(item.updatedAt)} />
            </dl>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-400">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
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

          <div className="rounded-xl border border-primary-500/30 bg-primary-500/10 p-4">
            <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-primary-200">
              <Sparkles className="h-3.5 w-3.5" />
              AI assist
            </h3>
            <p className="text-xs text-primary-100/80">
              Click <em>Edit</em> and use the sparkle icon on any rich-text field to draft content with AI.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RewardCard({
  referrer,
  referee,
}: {
  referrer?: string;
  referee?: string;
}) {
  if (!referrer && !referee) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
        <h3 className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-400">
          <Users className="h-3.5 w-3.5" />
          Referrer gets
        </h3>
        <p className="text-sm text-slate-200">{referrer || '—'}</p>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
        <h3 className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-400">
          <Gift className="h-3.5 w-3.5" />
          New customer gets
        </h3>
        <p className="text-sm text-slate-200">{referee || '—'}</p>
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body?: string }) {
  if (!body || !body.trim()) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h3>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{body}</p>
    </div>
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

function fmtDate(d?: string): string {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString();
}

// ============================================
// PAGE
// ============================================

export default function ReferralProgrammePage() {
  const { getItems, addItem, updateItem, deleteItem } = useDataStore();
  const items = (getItems('referralProgrammes') as ReferralProgramme[]) || [];

  return (
    <ModulePage
      moduleId="referral-programme"
      columns={columns}
      fields={formFields}
      data={items}
      onCreate={(data) => {
        addItem('referralProgrammes', data as Parameters<typeof addItem>[1]);
      }}
      onUpdate={(id, data) => {
        updateItem('referralProgrammes', id, data);
      }}
      onDelete={(id) => {
        deleteItem('referralProgrammes', id);
      }}
      detailView={(item, onBack) => <DetailView item={item} onBack={onBack} />}
    />
  );
}
