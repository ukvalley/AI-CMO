/**
 * Reusable primitives for Brand Identity section forms.
 * All follow the dark theme: slate-950 / slate-800/50 / slate-200 / slate-400.
 */

'use client';

import React from 'react';
import { Check, Lock, Plus, X } from 'lucide-react';
import { cn } from '@/utils/cn';

// ---------- Section card ----------

interface SectionCardProps {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
  approved?: boolean;
  approvalLabel?: string;
  rightSlot?: React.ReactNode;
}

export function SectionCard({
  step,
  title,
  description,
  children,
  approved,
  approvalLabel,
  rightSlot,
}: SectionCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
      <header className="flex items-start justify-between gap-4 p-6 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary-400 uppercase">
            <span>{step}</span>
            {approved && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5 normal-case font-medium">
                <Lock className="w-3 h-3" /> {approvalLabel ?? 'Locked'}
              </span>
            )}
          </div>
          <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
        {rightSlot}
      </header>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// ---------- Field wrappers ----------

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// ---------- Toggle / checkbox row ----------

export function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'w-full flex items-center justify-between text-left rounded-lg border px-3 py-2.5 transition-all',
        checked
          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
      )}
    >
      <span className="text-sm">{label}</span>
      <span
        className={cn(
          'flex items-center justify-center w-5 h-5 rounded border',
          checked
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'bg-slate-900 border-slate-600 text-transparent'
        )}
      >
        <Check className="w-3 h-3" />
      </span>
    </button>
  );
}

// ---------- Tag input (chips) ----------

export function TagInput({
  value,
  onChange,
  placeholder = 'Type and press Enter',
  max,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  max?: number;
}) {
  const [draft, setDraft] = React.useState('');
  const atMax = max !== undefined && value.length >= max;

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed || atMax) return;
    if (value.includes(trimmed)) {
      setDraft('');
      return;
    }
    onChange([...value, trimmed]);
    setDraft('');
  };

  const remove = (tag: string) => onChange(value.filter((v) => v !== tag));

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-primary-500/15 text-primary-300 border border-primary-500/30 px-2 py-1 text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="hover:text-white"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {!atMax && (
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                add();
              } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
                remove(value[value.length - 1]);
              }
            }}
            onBlur={add}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none px-1 py-0.5"
          />
        )}
      </div>
      {max !== undefined && (
        <div className="mt-1 text-[11px] text-slate-500 text-right">
          {value.length}/{max}
        </div>
      )}
    </div>
  );
}

// ---------- Approval bar ----------

export function ApprovalBar({
  approved,
  onToggle,
  label = 'CEO Approval',
  disabled,
}: {
  approved: boolean;
  onToggle: () => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        'mt-2 flex items-center justify-between rounded-lg border px-4 py-3',
        approved
          ? 'bg-emerald-500/10 border-emerald-500/40'
          : 'bg-slate-900 border-slate-700'
      )}
    >
      <div className="flex items-center gap-2">
        {approved ? (
          <Lock className="w-4 h-4 text-emerald-400" />
        ) : (
          <span className="w-4 h-4 rounded-full border-2 border-slate-500" />
        )}
        <span
          className={cn(
            'text-sm font-medium',
            approved ? 'text-emerald-300' : 'text-slate-300'
          )}
        >
          {label}: {approved ? 'Locked' : 'Pending'}
        </span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={cn(
          'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
          approved
            ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            : 'bg-primary-500 text-white hover:bg-primary-600',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {approved ? 'Unlock' : 'Approve & Lock'}
      </button>
    </div>
  );
}

// ---------- Slider field ----------

export function SliderField({
  value,
  onChange,
  label,
  min = 1,
  max = 10,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-sm font-mono text-primary-400">{value}/{max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
      />
    </div>
  );
}

// ---------- Add-row button ----------

export function AddRowButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-400 hover:text-primary-300"
    >
      <Plus className="w-3.5 h-3.5" /> {label}
    </button>
  );
}
