/**
 * Universal Form Component
 *
 * Shared form component used across all 60+ modules.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { Sparkles, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'tel'
  | 'url'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'toggle'
  | 'radio'
  | 'color'
  | 'social-grid';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: FieldOption[];
  min?: number;
  max?: number;
  rows?: number;
  aiGenerate?: boolean;
  colSpan?: 1 | 2;
  dependsOn?: {
    field: string;
    value: unknown;
  };
}

export interface UniversalFormProps<T extends Record<string, unknown>> {
  fields: FormField[];
  initialData?: Partial<T>;
  onSubmit: (data: T) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  className?: string;
}

const SOCIAL_PLATFORMS = [
  { key: 'linkedIn', label: 'LinkedIn' },
  { key: 'twitter', label: 'Twitter/X' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'tikTok', label: 'TikTok' },
  { key: 'youTube', label: 'YouTube' },
  { key: 'pinterest', label: 'Pinterest' },
  { key: 'threads', label: 'Threads' },
  { key: 'quora', label: 'Quora' },
  { key: 'medium', label: 'Medium' },
  { key: 'reddit', label: 'Reddit' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'whatsApp', label: 'WhatsApp' },
  { key: 'googleBusiness', label: 'Google Business' },
  { key: 'meetup', label: 'Meetup' },
  { key: 'spotifyPodcast', label: 'Spotify Podcast' },
  { key: 'applePodcast', label: 'Apple Podcast' },
  { key: 'website', label: 'Website' },
  { key: 'github', label: 'GitHub' },
];

export function UniversalForm<T extends Record<string, unknown>>({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isLoading,
  className,
}: UniversalFormProps<T>) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const defaults: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === 'multiselect') defaults[f.key] = [];
      else if (f.type === 'toggle') defaults[f.key] = false;
      else if (f.type === 'social-grid') defaults[f.key] = {};
      else defaults[f.key] = '';
    });
    return { ...defaults, ...initialData };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiGenerating, setAiGenerating] = useState<Record<string, boolean>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    (field: FormField, value: unknown): string | null => {
      if (field.required && !value) {
        return `${field.label} is required`;
      }
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          return 'Please enter a valid email address';
        }
      }
      return null;
    },
    []
  );

  const handleChange = useCallback(
    (key: string, value: unknown) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setTouched((prev) => ({ ...prev, [key]: true }));

      const field = fields.find((f) => f.key === key);
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [key]: error || '' }));
      }
    },
    [fields, validateField]
  );

  const handleAiGenerate = useCallback(async (field: FormField) => {
    setAiGenerating((prev) => ({ ...prev, [field.key]: true }));
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const mockResponse = `AI-generated ${field.label.toLowerCase()} content...`;
    handleChange(field.key, mockResponse);
    setAiGenerating((prev) => ({ ...prev, [field.key]: false }));
  }, [handleChange]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const newErrors: Record<string, string> = {};
      fields.forEach((field) => {
        const error = validateField(field, formData[field.key]);
        if (error) newErrors[field.key] = error;
      });

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        onSubmit(formData as T);
      }
    },
    [fields, formData, onSubmit, validateField]
  );

  const visibleFields = fields.filter((field) => {
    if (!field.dependsOn) return true;
    const dependentValue = formData[field.dependsOn.field];
    return dependentValue === field.dependsOn.value;
  });

  const hasErrors = Object.keys(errors).some((key) => errors[key]);

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">
            Please fix the errors below before submitting.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleFields.map((field) => {
          const value = formData[field.key];
          const error = touched[field.key] ? errors[field.key] : null;

          return (
            <div key={field.key} className={cn(field.colSpan === 2 && 'md:col-span-2')}>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>

              {(field.type === 'text' ||
                field.type === 'email' ||
                field.type === 'tel' ||
                field.type === 'url') && (
                <Input
                  type={field.type}
                  value={String(value || '')}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={cn(error && 'border-red-500 focus:border-red-500')}
                />
              )}

              {field.type === 'number' && (
                <Input
                  type="number"
                  value={value as number | undefined}
                  onChange={(e) =>
                    handleChange(
                      field.key,
                      e.target.value ? parseFloat(e.target.value) : ''
                    )
                  }
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  className={cn(error && 'border-red-500 focus:border-red-500')}
                />
              )}

              {field.type === 'textarea' && (
                <div className="relative">
                  <textarea
                    value={String(value || '')}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={field.rows || 4}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg border bg-white',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                      'transition-all duration-200 resize-y',
                      error && 'border-red-500 focus:border-red-500',
                      field.aiGenerate && 'pr-12'
                    )}
                  />
                  {field.aiGenerate && (
                    <button
                      type="button"
                      onClick={() => handleAiGenerate(field)}
                      disabled={aiGenerating[field.key]}
                      className="absolute right-2 top-2 p-1.5 rounded-md bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                    >
                      {aiGenerating[field.key] ? (
                        <span className="animate-spin">✦</span>
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              )}

              {field.type === 'select' && (
                <div className="relative">
                  <select
                    value={String(value || '')}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg border bg-white appearance-none',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                      error && 'border-red-500 focus:border-red-500'
                    )}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              )}

              {field.type === 'multiselect' && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-white">
                  {field.options?.map((opt) => {
                    const selected = ((value as string[]) || []).includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          const current = (value as string[]) || [];
                          const updated = selected
                            ? current.filter((v) => v !== opt.value)
                            : [...current, opt.value];
                          handleChange(field.key, updated);
                        }}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm transition-colors',
                          selected
                            ? 'bg-primary-100 text-primary-700 border border-primary-300'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        )}
                      >
                        {selected && <Check className="w-3 h-3 inline mr-1" />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {field.type === 'toggle' && (
                <button
                  type="button"
                  onClick={() => handleChange(field.key, !value)}
                  className={cn(
                    'relative inline-flex h-6 w-11 rounded-full transition-colors',
                    value ? 'bg-primary-500' : 'bg-neutral-200'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      value ? 'translate-x-6' : 'translate-x-1',
                      'top-1 absolute'
                    )}
                  />
                </button>
              )}

              {field.type === 'color' && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={String(value || '#7C6BF0')}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-10 h-10 rounded-lg border cursor-pointer"
                  />
                  <Input
                    value={String(value || '')}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder="#7C6BF0"
                    className="flex-1"
                  />
                </div>
              )}

              {field.type === 'date' && (
                <Input
                  type="date"
                  value={String(value || '')}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={cn(error && 'border-red-500 focus:border-red-500')}
                />
              )}

              {field.type === 'social-grid' && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const socialValue = (value as Record<string, string>) || {};
                    const hasValue = !!socialValue[platform.key];
                    return (
                      <div key={platform.key} className="relative">
                        <input
                          type="url"
                          placeholder={platform.label}
                          value={socialValue[platform.key] || ''}
                          onChange={(e) => {
                            handleChange(field.key, {
                              ...socialValue,
                              [platform.key]: e.target.value,
                            });
                          }}
                          className={cn(
                            'w-full px-2 py-1.5 text-xs rounded border',
                            'focus:outline-none focus:border-primary-500',
                            hasValue && 'border-green-300 bg-green-50'
                          )}
                        />
                        <span className="text-[10px] text-neutral-500 block mt-0.5">
                          {platform.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {field.helperText && !error && (
                <p className="mt-1 text-xs text-neutral-500">{field.helperText}</p>
              )}

              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
