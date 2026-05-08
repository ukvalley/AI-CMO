/**
 * SectionForm
 *
 * Config-driven form. Reads a SectionDef and the section's current data, then
 * renders the right input for each field. Supports core + collapsible advanced fields.
 */

'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Input, Textarea } from '@/components/ui';
import {
  ApprovalBar,
  CheckRow,
  Field,
  SectionCard,
  TagInput,
} from '@/modules/brand/brand-identity/primitives';
import type { FieldDef, SectionDef } from './sections.config';
import type {
  WebsiteSectionData,
  WebsiteSectionState,
  WebsiteSectionStatus,
} from '@/types/entities';

const STATUS_LABELS: Record<WebsiteSectionStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  review: 'In review',
  completed: 'Completed',
  blocked: 'Blocked',
};

const STATUS_TONE: Record<WebsiteSectionStatus, string> = {
  'not-started': 'bg-[#1a1d21] text-[#afb6c4]',
  'in-progress': 'bg-sky-500/20 text-sky-300',
  review: 'bg-amber-500/20 text-amber-300',
  completed: 'bg-emerald-500/20 text-emerald-300',
  blocked: 'bg-red-500/20 text-red-300',
};

interface Props {
  section: SectionDef;
  state: WebsiteSectionState | undefined;
  onUpdateField: (key: string, value: WebsiteSectionData[string]) => void;
  onSetStatus: (status: WebsiteSectionStatus) => void;
  onToggleApproval: () => void;
}

export function SectionForm({
  section,
  state,
  onUpdateField,
  onSetStatus,
  onToggleApproval,
}: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const data = state?.data ?? {};
  const status: WebsiteSectionStatus = state?.status ?? 'not-started';
  const approved = !!state?.approved;
  const Icon = section.icon;

  return (
    <SectionCard
      step={`Module ${section.step}`}
      title={section.title}
      description={section.description}
      approved={approved}
      approvalLabel="Locked"
      rightSlot={
        <div className="flex items-center gap-2">
          <span className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg bg-[#C8FF2E]/10 text-[#C8FF2E]">
            <Icon className="w-4 h-4" />
          </span>
          <select
            value={status}
            onChange={(e) => onSetStatus(e.target.value as WebsiteSectionStatus)}
            className={`text-xs font-medium rounded-md border-0 px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 ${STATUS_TONE[status]}`}
          >
            {(Object.keys(STATUS_LABELS) as WebsiteSectionStatus[]).map((s) => (
              <option key={s} value={s} className="bg-[#1a1d21] text-white">
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      }
    >
      <FieldGrid fields={section.fields} data={data} onUpdate={onUpdateField} />

      {section.advancedFields && section.advancedFields.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#878e9a] hover:text-white"
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showAdvanced ? 'Hide advanced' : `Show ${section.advancedFields.length} advanced fields`}
          </button>
          {showAdvanced && (
            <div className="mt-3 pt-4 border-t border-white/10">
              <FieldGrid fields={section.advancedFields} data={data} onUpdate={onUpdateField} />
            </div>
          )}
        </div>
      )}

      <ApprovalBar
        approved={approved}
        onToggle={onToggleApproval}
        label={`${approved ? 'Approved' : 'Approve & lock'} — ${section.title}`}
      />
    </SectionCard>
  );
}

// ---------- Field grid ----------

function FieldGrid({
  fields,
  data,
  onUpdate,
}: {
  fields: FieldDef[];
  data: WebsiteSectionData;
  onUpdate: (key: string, value: WebsiteSectionData[string]) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((f) => (
        <div key={f.key} className={f.colSpan === 2 ? 'md:col-span-2' : ''}>
          <FieldRenderer field={f} value={data[f.key]} onChange={(v) => onUpdate(f.key, v)} />
        </div>
      ))}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: WebsiteSectionData[string];
  onChange: (v: WebsiteSectionData[string]) => void;
}) {
  const v = value;

  switch (field.kind) {
    case 'text':
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <Input
            value={typeof v === 'string' ? v : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.hint}
          />
        </Field>
      );

    case 'url':
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <Input
            type="url"
            value={typeof v === 'string' ? v : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://"
          />
        </Field>
      );

    case 'date':
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <Input
            type="date"
            value={typeof v === 'string' ? v : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      );

    case 'number':
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <Input
            type="number"
            value={typeof v === 'number' ? String(v) : typeof v === 'string' ? v : ''}
            onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          />
        </Field>
      );

    case 'textarea':
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <Textarea
            rows={field.rows ?? 3}
            value={typeof v === 'string' ? v : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      );

    case 'tags':
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <TagInput
            value={Array.isArray(v) ? v : []}
            onChange={(next) => onChange(next)}
            placeholder={field.hint ?? 'Type and press Enter'}
          />
        </Field>
      );

    case 'checks':
      // Single boolean toggle for now — in the future could be a multi-check group
      return (
        <Field label="" hint={field.hint}>
          <CheckRow
            label={field.label}
            checked={v === true}
            onChange={(next) => onChange(next)}
          />
        </Field>
      );

    case 'select':
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <select
            value={typeof v === 'string' ? v : ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg bg-[#1a1d21] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#C8FF2E]/50 focus:ring-2 focus:ring-[#C8FF2E]/20"
          >
            <option value="" disabled>
              Choose…
            </option>
            {(field.options ?? []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      );

    default:
      return null;
  }
}

// Re-export for convenience
export { Lock };
