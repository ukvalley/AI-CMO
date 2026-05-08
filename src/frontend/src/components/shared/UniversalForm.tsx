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
  | 'social-grid'
  | 'tags'
  | 'section-header'
  | 'image-gallery'     // Multiple images (uploaded files + URLs)
  | 'pdf-upload'         // PDF with upload + URL options
  | 'video-urls'         // Multiple video URLs
  | 'design-url';        // Canva/Figma URL

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
      if (f.type === 'section-header') return; // Skip section headers
      if (f.type === 'multiselect') defaults[f.key] = [];
      else if (f.type === 'toggle') defaults[f.key] = false;
      else if (f.type === 'social-grid') defaults[f.key] = {};
      else if (f.type === 'image-gallery') defaults[f.key] = [];
      else if (f.type === 'video-urls') defaults[f.key] = [];
      else if (f.type === 'file-upload') defaults[f.key] = '';
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
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-sm text-red-400">
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
              <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">
                {field.label}
                {field.required && <span className="text-red-400 ml-0.5">*</span>}
              </label>

              {field.type === 'section-header' && (
                <div className="border-t border-[#C8FF2E]/30 pt-4 mt-2">
                  <h3 className="text-[#C8FF2E] font-semibold text-base">{field.label}</h3>
                </div>
              )}

              {(field.type === 'text' ||
                field.type === 'email' ||
                field.type === 'tel' ||
                field.type === 'url') && (
                <Input
                  type={field.type}
                  value={String(value || '')}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={cn(
                    'bg-[#1a1d21] border-white/10 text-white placeholder:text-[#686f7e]',
                    'focus:border-[#C8FF2E]/50 focus:ring-[#C8FF2E]/20',
                    error && 'border-red-500 focus:border-red-500'
                  )}
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
                  className={cn(
                    'bg-[#1a1d21] border-white/10 text-white',
                    'focus:border-[#C8FF2E]/50 focus:ring-[#C8FF2E]/20',
                    error && 'border-red-500 focus:border-red-500'
                  )}
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
                      'w-full px-3 py-2 rounded-lg border bg-[#1a1d21] text-white',
                      'placeholder:text-[#686f7e]',
                      'focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50',
                      'transition-all duration-200 resize-y',
                      'border-white/10',
                      error && 'border-red-500 focus:border-red-500',
                      field.aiGenerate && 'pr-12'
                    )}
                  />
                  {field.aiGenerate && (
                    <button
                      type="button"
                      onClick={() => handleAiGenerate(field)}
                      disabled={aiGenerating[field.key]}
                      className="absolute right-2 top-2 p-1.5 rounded-md bg-[#C8FF2E]/10 text-[#C8FF2E] hover:bg-[#C8FF2E]/20 transition-colors"
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
                      'w-full px-3 py-2 rounded-lg border appearance-none',
                      'bg-[#1a1d21] text-white border-white/10',
                      'focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50',
                      error && 'border-red-500 focus:border-red-500'
                    )}
                  >
                    <option value="" className="bg-[#1a1d21]">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#1a1d21]">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#686f7e] pointer-events-none" />
                </div>
              )}

              {field.type === 'multiselect' && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-[#1a1d21] border-white/10">
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
                            ? 'bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/30'
                            : 'bg-[#21262d] text-[#878e9a] border border-white/10 hover:border-[#C8FF2E]/30'
                        )}
                      >
                        {selected && <Check className="w-3 h-3 inline mr-1" />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {field.type === 'tags' && (
                <TagsInput
                  value={(value as string[]) || []}
                  onChange={(tags) => handleChange(field.key, tags)}
                  placeholder={field.placeholder || 'Add a feature...'}
                />
              )}

              {field.type === 'toggle' && (
                <button
                  type="button"
                  onClick={() => handleChange(field.key, !value)}
                  className={cn(
                    'relative inline-flex h-6 w-11 rounded-full transition-colors',
                    value ? 'bg-[#C8FF2E]' : 'bg-[#21262d]'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-[#0d1117] transition-transform',
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
                    value={String(value || '#C8FF2E')}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-[#1a1d21]"
                  />
                  <Input
                    value={String(value || '')}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder="#C8FF2E"
                    className="flex-1 bg-[#1a1d21] border-white/10 text-white"
                  />
                </div>
              )}

              {field.type === 'date' && (
                <Input
                  type="date"
                  value={String(value || '')}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={cn(
                    'bg-[#1a1d21] border-white/10 text-white',
                    'focus:border-[#C8FF2E]/50 focus:ring-[#C8FF2E]/20',
                    error && 'border-red-500 focus:border-red-500'
                  )}
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
                            'bg-[#1a1d21] text-white placeholder:text-[#686f7e]',
                            'focus:outline-none focus:border-[#C8FF2E]/50',
                            'border-white/10',
                            hasValue && 'border-[#C8FF2E]/50 bg-[#C8FF2E]/10'
                          )}
                        />
                        <span className="text-[10px] text-[#686f7e] block mt-0.5">
                          {platform.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {field.type === 'image-gallery' && (
                <ImageGalleryInput
                  value={(value as string[]) || []}
                  onChange={(urls) => handleChange(field.key, urls)}
                  placeholder={field.placeholder || 'Add image URL...'}
                />
              )}

              {field.type === 'pdf-upload' && (
                <PdfUploadInput
                  value={String(value || '')}
                  onChange={(url) => handleChange(field.key, url)}
                  placeholder={field.placeholder || 'Enter Canva/Figma PDF URL...'}
                />
              )}

              {field.type === 'video-urls' && (
                <VideoUrlsInput
                  value={(value as string[]) || []}
                  onChange={(urls) => handleChange(field.key, urls)}
                  placeholder={field.placeholder || 'Add YouTube video URL...'}
                />
              )}

              {field.type === 'design-url' && (
                <DesignUrlInput
                  value={String(value || '')}
                  onChange={(url) => handleChange(field.key, url)}
                  placeholder={field.placeholder || 'Enter Canva or Figma link...'}
                />
              )}

              {field.helperText && !error && (
                <p className="mt-1 text-xs text-[#686f7e]">{field.helperText}</p>
              )}

              {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
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

// ============================================
// TAGS INPUT COMPONENT
// ============================================

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

function TagsInput({ value, onChange, placeholder }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-[#1a1d21] border-white/10 min-h-[42px]">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-1 bg-[#C8FF2E]/10 text-[#C8FF2E] text-sm rounded-full border border-[#C8FF2E]/30"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-[#d4ff5c] transition-colors"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder:text-[#686f7e] text-sm"
      />
    </div>
  );
}

// ============================================
// IMAGE GALLERY INPUT COMPONENT
// ============================================

interface ImageGalleryInputProps {
  value: string[];
  onChange: (urls: string[]) => void;
  placeholder?: string;
}

import { uploadApi } from '@/services/api';

function ImageGalleryInput({ value, onChange, placeholder }: ImageGalleryInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [previewError, setPreviewError] = useState<Record<number, boolean>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const response = await uploadApi.uploadFile(files[i]);
        newUrls.push(response.url);
      }
      onChange([...value, ...newUrls]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddImage = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      try {
        new URL(trimmed);
        onChange([...value, trimmed]);
        setInputValue('');
      } catch {
        // Invalid URL
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddImage();
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    setPreviewError((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const handleImageError = (index: number) => {
    setPreviewError((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="space-y-3">
      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              {previewError[index] ? (
                <div className="w-full h-full bg-[#21262d] rounded-lg border border-white/10 flex items-center justify-center">
                  <span className="text-xs text-[#686f7e] text-center px-2">Image unavailable</span>
                </div>
              ) : (
                <img
                  src={url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${url}` : url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-white/10"
                  onError={() => handleImageError(index)}
                />
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
              <div className="absolute bottom-1 left-1 right-1 bg-black/60 rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white truncate">{url.split('/').pop()?.slice(0, 15)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Options */}
      <div className="space-y-2">
        {/* File Upload Button */}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1"
          >
            {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>

        {/* URL Input */}
        <div className="flex gap-2">
          <input
            type="url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Or enter image URL (Canva/Figma)...'}
            className="flex-1 px-3 py-2 rounded-lg border bg-[#1a1d21] text-white placeholder:text-[#686f7e] border-white/10 focus:outline-none focus:border-[#C8FF2E]/50 text-sm"
          />
          <Button type="button" variant="secondary" onClick={handleAddImage} disabled={!inputValue.trim()}>
            Add URL
          </Button>
        </div>

        {uploadError && (
          <p className="text-xs text-red-400">{uploadError}</p>
        )}
        <p className="text-xs text-[#686f7e]">
          Upload images (JPG, PNG, GIF, WebP) or add external URLs. Max 5MB per image.
        </p>
      </div>
    </div>
  );
}

// ============================================
// PDF UPLOAD INPUT COMPONENT
// ============================================

interface PdfUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

function PdfUploadInput({ value, onChange, placeholder }: PdfUploadInputProps) {
  const [isEditing, setIsEditing] = useState(!value);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const response = await uploadApi.uploadFile(file);
      onChange(response.url);
      setIsEditing(false);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveUrl = (newValue: string) => {
    onChange(newValue);
    if (newValue) setIsEditing(false);
  };

  const handleClear = () => {
    onChange('');
    setIsEditing(true);
  };

  const getFileName = (url: string) => {
    if (!url) return '';
    try {
      const pathname = new URL(url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`).pathname;
      return pathname.split('/').pop() || url;
    } catch {
      return url.split('/').pop() || url;
    }
  };

  return (
    <div className="space-y-3">
      {value && !isEditing ? (
        <div className="flex items-center gap-3 p-3 bg-[#1a1d21] border border-white/10 rounded-lg">
          <div className="w-10 h-10 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-[#C8FF2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{getFileName(value)}</p>
            <p className="text-xs text-[#686f7e] truncate">PDF Catalog</p>
          </div>
          <div className="flex gap-2">
            <a
              href={value.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${value}` : value}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-lg hover:bg-[#C8FF2E]/20 transition-colors"
            >
              View
            </a>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 text-sm bg-[#21262d] text-white rounded-lg hover:bg-[#30363d] transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Upload Option */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf"
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload PDF Catalog'}
          </Button>

          {/* URL Option */}
          <div className="flex gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => handleSaveUrl(e.target.value)}
              placeholder={placeholder || 'Or enter Canva/Figma PDF URL...'}
              className="flex-1 px-3 py-2 rounded-lg border bg-[#1a1d21] text-white placeholder:text-[#686f7e] border-white/10 focus:outline-none focus:border-[#C8FF2E]/50 text-sm"
            />
          </div>

          {uploadError && (
            <p className="text-xs text-red-400">{uploadError}</p>
          )}
          <p className="text-xs text-[#686f7e]">
            Upload a PDF file or paste a Canva/Figma PDF link. Max 20MB.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// DESIGN URL INPUT COMPONENT (Canva/Figma)
// ============================================

interface DesignUrlInputProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

function DesignUrlInput({ value, onChange, placeholder }: DesignUrlInputProps) {
  const getPlatformIcon = (url: string) => {
    if (url.includes('canva.com')) {
      return (
        <svg className="w-5 h-5 text-[#00C4CC]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      );
    }
    if (url.includes('figma.com')) {
      return (
        <svg className="w-5 h-5 text-[#F24E1E]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.02-3.019-3.02h-3.117v6.039zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.588-7.51c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.588 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.018 3.019 3.018h3.117V8.981H8.148zm4.588 8.981c2.476 0 4.49-2.014 4.49-4.49s-2.014-4.49-4.49-4.49h-4.588v8.98h4.588zm0-7.51c1.665 0 3.019 1.354 3.019 3.02 0 1.664-1.354 3.019-3.019 3.019h-3.117V10.45h3.117z"/>
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-[#C8FF2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    );
  };

  const getPlatformName = (url: string) => {
    if (url.includes('canva.com')) return 'Canva';
    if (url.includes('figma.com')) return 'Figma';
    return 'External Link';
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-center gap-3 p-3 bg-[#1a1d21] border border-white/10 rounded-lg">
          <div className="w-10 h-10 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center">
            {getPlatformIcon(value)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{getPlatformName(value)} Design</p>
            <p className="text-xs text-[#686f7e] truncate">{value.slice(0, 50)}...</p>
          </div>
          <div className="flex gap-2">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-lg hover:bg-[#C8FF2E]/20 transition-colors"
            >
              Open
            </a>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Enter Canva or Figma link...'}
            className="w-full px-3 py-2 rounded-lg border bg-[#1a1d21] text-white placeholder:text-[#686f7e] border-white/10 focus:outline-none focus:border-[#C8FF2E]/50 text-sm"
          />
          <p className="text-xs text-[#686f7e]">
            Paste a shareable Canva or Figma link for easy editing
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// VIDEO URLS INPUT COMPONENT
// ============================================

interface VideoUrlsInputProps {
  value: string[];
  onChange: (urls: string[]) => void;
  placeholder?: string;
}

function VideoUrlsInput({ value, onChange, placeholder }: VideoUrlsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const extractVideoId = (url: string): { platform: 'youtube' | 'vimeo' | null; id: string | null } => {
    // YouTube patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
      /youtube\.com\/watch\?.*v=([^&\s]+)/,
    ];

    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match) return { platform: 'youtube', id: match[1] };
    }

    // Vimeo patterns
    const vimeoPattern = /vimeo\.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoPattern);
    if (vimeoMatch) return { platform: 'vimeo', id: vimeoMatch[1] };

    return { platform: null, id: null };
  };

  const getThumbnailUrl = (url: string): string | null => {
    const { platform, id } = extractVideoId(url);
    if (platform === 'youtube' && id) {
      return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    }
    return null;
  };

  const handleAddVideo = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      const { platform } = extractVideoId(trimmed);
      if (platform) {
        onChange([...value, trimmed]);
        setInputValue('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddVideo();
    }
  };

  const removeVideo = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Video Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url, index) => {
            const { platform, id } = extractVideoId(url);
            const thumbnail = getThumbnailUrl(url);

            return (
              <div key={index} className="relative group">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-video bg-[#21262d] rounded-lg border border-white/10 overflow-hidden hover:border-[#C8FF2E]/30 transition-colors"
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={`Video thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#686f7e]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black/60 rounded px-1.5 py-0.5">
                    <span className="text-[10px] text-white uppercase">{platform}</span>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Video Input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-lg border bg-[#1a1d21] text-white placeholder:text-[#686f7e] border-white/10 focus:outline-none focus:border-[#C8FF2E]/50 text-sm"
        />
        <Button type="button" variant="secondary" onClick={handleAddVideo} disabled={!inputValue.trim()}>
          Add Video
        </Button>
      </div>
      <p className="text-xs text-[#686f7e]">Enter YouTube or Vimeo URL and press Enter</p>
    </div>
  );
}
