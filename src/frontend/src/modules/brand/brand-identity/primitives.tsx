/**
 * Brand Identity Primitives
 *
 * Shared UI components for brand identity and website project modules.
 */

'use client';

import React, { useState } from 'react';
import { Lock, Unlock, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

// ============================================
// Section Card
// ============================================

interface SectionCardProps {
  step?: string;
  title: string;
  description?: string;
  approved?: boolean;
  approvalLabel?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionCard({
  step,
  title,
  description,
  approved = false,
  approvalLabel = 'Locked',
  rightSlot,
  children,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-[#1a1d21]',
        approved ? 'border-emerald-500/30' : 'border-white/10'
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          {step && (
            <span className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">
              {step}
            </span>
          )}
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            {description && (
              <p className="text-xs text-[#878e9a] mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {approved && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium">
              <Lock className="w-3 h-3" />
              {approvalLabel}
            </span>
          )}
          {rightSlot}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ============================================
// Field Wrapper
// ============================================

interface FieldProps {
  label?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({ label, hint, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-200">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// ============================================
// Approval Bar
// ============================================

interface ApprovalBarProps {
  approved: boolean;
  onToggle: () => void;
  label?: string;
}

export function ApprovalBar({ approved, onToggle, label }: ApprovalBarProps) {
  return (
    <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
      <div className="flex items-center gap-2">
        {approved ? (
          <>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm text-emerald-400">{label || 'Approved'}</span>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
              <Unlock className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-sm text-slate-400">{label || 'Not approved'}</span>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          approved
            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
        )}
      >
        {approved ? 'Unlock' : 'Approve & Lock'}
      </button>
    </div>
  );
}

// ============================================
// Check Row
// ============================================

interface CheckRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckRow({ label, checked, onChange }: CheckRowProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={cn(
          'w-5 h-5 rounded border flex items-center justify-center transition-colors',
          checked
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-600 bg-slate-800 group-hover:border-slate-500'
        )}
        onClick={() => onChange(!checked)}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
      <span className="text-sm text-slate-200">{label}</span>
    </label>
  );
}

// ============================================
// Tag Input
// ============================================

interface TagInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((v) => v !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2.5 bg-[#1a1d21] border border-white/10 rounded-lg min-h-[44px]">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-md text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-white transition-colors"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="flex-1 min-w-[120px] bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
      />
    </div>
  );
}
