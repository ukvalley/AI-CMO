/**
 * Stationery Module
 *
 * Comprehensive stationery management including:
 * - Core Stationery (Must Have): Business cards, letterheads, envelopes, email signatures, presentations
 * - Office Use Assets: Invoices, quotations, receipts, purchase orders, billing, proposals
 * - Packaging Stationery: Thank you cards, warranty cards, manuals, inserts, stickers, tape
 * - Print Stationery: Stamps, branding, standees, booth designs, T-shirts
 * - Marketing Assets: Newsletters, brochures, pitch decks, taglines, marketing collateral
 *
 * Supports file upload, dimension presets, and URL for templates and previews.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Link, X, Check, Trash2, Edit, Plus, Eye, Copy, Download, Clock, Archive } from 'lucide-react';
import { stationeryApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import { cn } from '@/utils/cn';
import type { Stationery } from '@/types/entities';

// ============================================
// STATIONERY TYPES & TAGS
// ============================================

interface StationeryTypeOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DimensionPreset {
  label: string;
  width: number;
  height: number;
  unit: 'mm' | 'in' | 'px';
}

// Core Stationery (Must Have)
const CORE_STATIONERY: StationeryTypeOption[] = [
  { value: 'business-card', label: 'Business Card (Visiting Card)' },
  { value: 'letterhead', label: 'Letterhead' },
  { value: 'envelope-a4', label: 'Envelope (A4 Size)' },
  { value: 'envelope-dl', label: 'Envelope (DL Size)' },
  { value: 'email-signature', label: 'Email Signature Design' },
  { value: 'presentation-template', label: 'Presentation (PPT) Template' },
];

// Office Use Assets
const OFFICE_ASSETS: StationeryTypeOption[] = [
  { value: 'invoice-template', label: 'Invoice Template' },
  { value: 'quotation-template', label: 'Quotation Template' },
  { value: 'receipt-design', label: 'Receipt Design' },
  { value: 'purchase-order', label: 'Purchase Order (PO) Template' },
  { value: 'billing-format', label: 'Billing Format' },
  { value: 'proposal-template', label: 'Proposal Template' },
];

// Packaging Stationery
const PACKAGING_STATIONERY: StationeryTypeOption[] = [
  { value: 'thank-you-card', label: 'Thank You Card' },
  { value: 'warranty-card', label: 'Warranty Card' },
  { value: 'instruction-manual', label: 'Instruction Manual' },
  { value: 'product-insert-card', label: 'Product Insert Card' },
  { value: 'branded-stickers', label: 'Branded Stickers' },
  { value: 'packaging-tape', label: 'Packaging Tape Branding' },
];

// Print Stationery
const PRINT_STATIONERY: StationeryTypeOption[] = [
  { value: 'stamps', label: 'Stamps' },
  { value: 'branding-print', label: 'Branding (Print)' },
  { value: 'standees-print', label: 'Standees' },
  { value: 'booth-designs', label: 'Booth Designs' },
  { value: 't-shirts', label: 'T-shirts' },
];

// Marketing Assets
const MARKETING_ASSETS: StationeryTypeOption[] = [
  { value: 'newsletter-template', label: 'Newsletter Template' },
  { value: 'brochure-pdf', label: 'Brochure PDF' },
  { value: 'pitch-deck', label: 'Pitch Deck' },
  { value: 'tagline', label: 'Tagline' },
  { value: 'hook-style', label: 'Hook Style' },
  { value: 'standees-marketing', label: 'Standee (Marketing)' },
  { value: 'marketing-collateral', label: 'Marketing Collateral' },
];

// Legacy/Other types
const OTHER_STATIONERY: StationeryTypeOption[] = [
  { value: 'memo-pad', label: 'Memo Pad' },
  { value: 'folder', label: 'Folder' },
  { value: 'compliment-slip', label: 'Compliment Slip' },
  { value: 'envelope', label: 'Envelope (Generic)' },
  { value: 'other', label: 'Other' },
];

// Combined list for select dropdown (grouped by category)
const STATIONERY_TYPES: StationeryTypeOption[] = [
  { value: '_header_core', label: '━━ Core Stationery (Must Have) ━━', disabled: true },
  ...CORE_STATIONERY,
  { value: '_header_office', label: '━━ Office Use Assets ━━', disabled: true },
  ...OFFICE_ASSETS,
  { value: '_header_packaging', label: '━━ Packaging Stationery ━━', disabled: true },
  ...PACKAGING_STATIONERY,
  { value: '_header_print', label: '━━ Print Stationery ━━', disabled: true },
  ...PRINT_STATIONERY,
  { value: '_header_marketing', label: '━━ Marketing Assets ━━', disabled: true },
  ...MARKETING_ASSETS,
  { value: '_header_other', label: '━━ Other ━━', disabled: true },
  ...OTHER_STATIONERY,
];

// Categories for filtering
const STATIONERY_CATEGORIES = {
  'core-stationery': 'Core Stationery',
  'office-assets': 'Office Use Assets',
  'packaging-stationery': 'Packaging Stationery',
  'print-stationery': 'Print Stationery',
  'marketing-assets': 'Marketing Assets',
  'other': 'Other',
};

// Dimension presets by type
const DIMENSION_PRESETS: Record<string, DimensionPreset[]> = {
  'business-card': [
    { label: 'Standard (US) - 89 × 51 mm', width: 89, height: 51, unit: 'mm' },
    { label: 'Standard (EU) - 85 × 55 mm', width: 85, height: 55, unit: 'mm' },
    { label: 'Square - 65 × 65 mm', width: 65, height: 65, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'letterhead': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'US Letter - 8.5 × 11 in', width: 8.5, height: 11, unit: 'in' },
    { label: 'Legal - 8.5 × 14 in', width: 8.5, height: 14, unit: 'in' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'envelope-a4': [
    { label: 'C4 - 229 × 324 mm', width: 229, height: 324, unit: 'mm' },
    { label: 'C5 - 162 × 229 mm', width: 162, height: 229, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'envelope-dl': [
    { label: 'DL - 110 × 220 mm', width: 110, height: 220, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'presentation-template': [
    { label: 'Standard (16:9) - 1920 × 1080 px', width: 1920, height: 1080, unit: 'px' },
    { label: 'Standard (4:3) - 1024 × 768 px', width: 1024, height: 768, unit: 'px' },
    { label: 'Widescreen - 2560 × 1440 px', width: 2560, height: 1440, unit: 'px' },
    { label: 'Custom', width: 0, height: 0, unit: 'px' },
  ],
  'invoice-template': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'US Letter - 8.5 × 11 in', width: 8.5, height: 11, unit: 'in' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'brochure-pdf': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'A5 - 148 × 210 mm', width: 148, height: 210, unit: 'mm' },
    { label: 'US Letter - 8.5 × 11 in', width: 8.5, height: 11, unit: 'in' },
    { label: 'Tri-fold (US) - 11 × 8.5 in', width: 11, height: 8.5, unit: 'in' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'standees-print': [
    { label: 'Small - 600 × 1600 mm', width: 600, height: 1600, unit: 'mm' },
    { label: 'Medium - 800 × 2000 mm', width: 800, height: 2000, unit: 'mm' },
    { label: 'Large - 1000 × 2400 mm', width: 1000, height: 2400, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'standees-marketing': [
    { label: 'Small - 600 × 1600 mm', width: 600, height: 1600, unit: 'mm' },
    { label: 'Medium - 800 × 2000 mm', width: 800, height: 2000, unit: 'mm' },
    { label: 'Large - 1000 × 2400 mm', width: 1000, height: 2400, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  't-shirts': [
    { label: 'Small (S)', width: 0, height: 0, unit: 'mm' },
    { label: 'Medium (M)', width: 0, height: 0, unit: 'mm' },
    { label: 'Large (L)', width: 0, height: 0, unit: 'mm' },
    { label: 'Extra Large (XL)', width: 0, height: 0, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'pitch-deck': [
    { label: 'Standard (16:9) - 1920 × 1080 px', width: 1920, height: 1080, unit: 'px' },
    { label: 'Standard (4:3) - 1024 × 768 px', width: 1024, height: 768, unit: 'px' },
    { label: 'Custom', width: 0, height: 0, unit: 'px' },
  ],
  'default': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'A5 - 148 × 210 mm', width: 148, height: 210, unit: 'mm' },
    { label: 'US Letter - 8.5 × 11 in', width: 8.5, height: 11, unit: 'in' },
    { label: 'Social Square - 1080 × 1080 px', width: 1080, height: 1080, unit: 'px' },
    { label: 'Social Story - 1080 × 1920 px', width: 1080, height: 1920, unit: 'px' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
};

const STATIONERY_TAGS = [
  // Usage Type
  { value: 'print', label: 'Print Ready' },
  { value: 'digital', label: 'Digital' },
  { value: 'print-digital', label: 'Print + Digital' },
  // Category
  { value: 'core-stationery', label: 'Core Stationery' },
  { value: 'office-assets', label: 'Office Assets' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'print', label: 'Print' },
  { value: 'marketing', label: 'Marketing' },
  // Usage Context
  { value: 'corporate', label: 'Corporate' },
  { value: 'external', label: 'External Use' },
  { value: 'internal', label: 'Internal Use' },
  { value: 'customer-facing', label: 'Customer Facing' },
  { value: 'vendor-facing', label: 'Vendor Facing' },
  // Status
  { value: 'approved', label: 'Approved' },
  { value: 'draft', label: 'Draft' },
  { value: 'needs-review', label: 'Needs Review' },
  // Priority
  { value: 'must-have', label: 'Must Have' },
  { value: 'optional', label: 'Optional' },
  // Size
  { value: 'letter-size', label: 'Letter Size' },
  { value: 'a4', label: 'A4' },
  { value: 'a5', label: 'A5' },
  { value: 'us-standard', label: 'US Standard' },
  { value: 'metric', label: 'Metric (mm)' },
  { value: 'imperial', label: 'Imperial (in)' },
  { value: 'digital-px', label: 'Digital (px)' },
];

// ============================================
// COMPONENT: Stationery Card
// ============================================

function StationeryCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Stationery;
  onEdit: (item: Stationery) => void;
  onDelete: (id: string) => void;
}) {
  const [imageError, setImageError] = useState(false);

  const getStatusIcon = () => {
    switch (item.status) {
      case 'approved':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-slate-400" />;
      default:
        return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusLabel = () => {
    switch (item.status) {
      case 'approved':
        return 'Approved';
      case 'archived':
        return 'Archived';
      default:
        return 'Draft';
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'approved':
        return 'text-green-400';
      case 'archived':
        return 'text-slate-400';
      default:
        return 'text-amber-400';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get preview image URL
  const previewUrl = item.previewImageUrl || item.base64Data;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-colors">
      {/* Preview */}
      <div className="aspect-video bg-slate-800/50 relative group">
        {previewUrl && !imageError ? (
          <img
            src={previewUrl}
            alt={item.name}
            className="w-full h-full object-contain p-4"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">📄</div>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {(item.templateUrl || item.base64Data) && (
            <>
              <a
                href={item.templateUrl || item.base64Data || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                title="View Template"
              >
                <Eye className="w-5 h-5" />
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(item.templateUrl || '')}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                title="Copy Template URL"
              >
                <Copy className="w-5 h-5" />
              </button>
            </>
          )}
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-purple-500 hover:bg-purple-400 rounded-lg text-white"
              title="Open Design File (Canva/Figma)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </a>
          )}
          <button
            onClick={() => onEdit(item)}
            className="p-2 bg-primary-500 hover:bg-primary-400 rounded-lg text-slate-900"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 bg-red-500 hover:bg-red-400 rounded-lg text-white"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-slate-200">{item.name}</h3>
            <p className="text-xs text-slate-500">
              {STATIONERY_TYPES.find(t => t.value === item.type)?.label || item.type}
            </p>
          </div>
          <span className={`flex items-center gap-1 text-xs ${getStatusColor()}`}>
            {getStatusIcon()}
            {getStatusLabel()}
          </span>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded"
              >
                {STATIONERY_TAGS.find(t => t.value === tag)?.label || tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-slate-500">+{item.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
          <span>{formatFileSize(item.fileSize)}</span>
          {item.dimensions?.width && item.dimensions?.height && (
            <span>{item.dimensions.width}×{item.dimensions.height} {item.dimensions.unit}</span>
          )}
        </div>

        {/* Source Links */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {(item.base64Data || item.templateUrl) && (
            <span className="flex items-center gap-1">
              <Upload className="w-3 h-3" />
              <span>Template</span>
            </span>
          )}
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-primary-400 hover:text-primary-300"
            >
              <span>Design File</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENT: Stationery Form Modal
// ============================================

function StationeryFormModal({
  isOpen,
  onClose,
  onSave,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  item?: Stationery | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    templateUrl: '',
    previewImageUrl: '',
    sourceUrl: '',
    status: 'draft' as 'draft' | 'approved' | 'archived',
    tags: [] as string[],
    dimensions: { width: '', height: '', unit: 'mm' as 'mm' | 'in' | 'px' },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        type: item.type || '',
        description: item.description || '',
        templateUrl: item.templateUrl || '',
        previewImageUrl: item.previewImageUrl || '',
        sourceUrl: item.sourceUrl || '',
        status: item.status || 'draft',
        tags: item.tags || [],
        dimensions: {
          width: item.dimensions?.width?.toString() || '',
          height: item.dimensions?.height?.toString() || '',
          unit: item.dimensions?.unit || 'mm',
        },
      });
      if (item.base64Data) {
        setPreviewUrl(item.base64Data);
      }
    } else {
      setFormData({
        name: '',
        type: '',
        description: '',
        templateUrl: '',
        previewImageUrl: '',
        sourceUrl: '',
        status: 'draft',
        tags: [],
        dimensions: { width: '', height: '', unit: 'mm' },
      });
      setSelectedFile(null);
      setPreviewUrl('');
    }
  }, [item, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.type) return;

    setIsUploading(true);

    const data: any = {
      ...formData,
      dimensions: formData.dimensions.width && formData.dimensions.height
        ? {
          width: parseInt(formData.dimensions.width),
          height: parseInt(formData.dimensions.height),
          unit: formData.dimensions.unit,
        }
        : undefined,
    };

    // If uploading a file, convert to base64
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        data.base64Data = reader.result;
        data.fileName = selectedFile.name;
        data.fileSize = selectedFile.size;
        data.fileType = selectedFile.type;
        data.templateUrl = reader.result; // Use base64 as template URL
        onSave(data);
        setIsUploading(false);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      onSave(data);
      setIsUploading(false);
    }
  };

  const toggleTag = (tagValue: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagValue)
        ? prev.tags.filter(t => t !== tagValue)
        : [...prev.tags, tagValue],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-200">
            {item ? 'Edit Stationery' : 'Add Stationery'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
          {/* Upload Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Upload Template File
              <span className="text-slate-500 font-normal ml-2">- or use URL below</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors',
                selectedFile
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.ai,.psd,.sketch,.fig,.svg,.png,.jpg,.webp"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="text-center">
                  {previewUrl && selectedFile.type.startsWith('image/') ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-24 object-contain mx-auto mb-3 rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-primary-400" />
                    </div>
                  )}
                  <p className="text-slate-200 font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="mt-2 text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-300 font-medium text-sm">Click to upload file</p>
                  <p className="text-xs text-slate-500 mt-1">
                    PDF, DOC, PPT, AI, PSD, Sketch, Figma, Images
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-slate-900 text-xs text-slate-500 uppercase">Or</span>
            </div>
          </div>

          {/* Template URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Template URL
              <span className="text-slate-500 font-normal"> - Link to download the template</span>
            </label>
            <input
              type="url"
              value={formData.templateUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, templateUrl: e.target.value }))}
              placeholder="https://drive.google.com/... or https://cdn.example.com/template.pdf"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Preview Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Preview Image URL
              <span className="text-slate-500 font-normal"> - Thumbnail preview</span>
            </label>
            <input
              type="url"
              value={formData.previewImageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, previewImageUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Source Design URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Source Design URL
              <span className="text-slate-500 font-normal"> - Canva, Figma, Google Drive, etc.</span>
            </label>
            <input
              type="url"
              value={formData.sourceUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
              placeholder="https://www.figma.com/file/... or https://www.canva.com/design/..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Link to the editable design file for future updates
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Template Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Business Card Front"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Stationery Type <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => {
                const newType = e.target.value;
                // Reset dimensions when type changes
                setFormData(prev => ({
                  ...prev,
                  type: newType,
                  dimensions: { width: '', height: '', unit: 'mm' }
                }));
              }}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            >
              <option value="">Select type...</option>
              {STATIONERY_TYPES.map(type => (
                <option
                  key={type.value}
                  value={type.value}
                  disabled={type.disabled}
                  className={type.disabled ? 'text-slate-500 font-semibold bg-slate-800' : ''}
                >
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            >
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Dimensions Preset */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dimensions Preset
            </label>
            <select
              value={formData.type && DIMENSION_PRESETS[formData.type]
                ? `${formData.dimensions.width}x${formData.dimensions.height}_${formData.dimensions.unit}`
                : 'custom'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'custom') {
                  setFormData(prev => ({
                    ...prev,
                    dimensions: { width: '', height: '', unit: 'mm' }
                  }));
                } else {
                  const presets = DIMENSION_PRESETS[formData.type] || DIMENSION_PRESETS['default'];
                  const preset = presets.find(p => `${p.width}x${p.height}_${p.unit}` === value);
                  if (preset) {
                    setFormData(prev => ({
                      ...prev,
                      dimensions: {
                        width: preset.width.toString(),
                        height: preset.height.toString(),
                        unit: preset.unit
                      }
                    }));
                  }
                }
              }}
              disabled={!formData.type}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!formData.type ? 'Select stationery type first...' : 'Select preset...'}
              </option>
              {(formData.type && DIMENSION_PRESETS[formData.type]
                ? DIMENSION_PRESETS[formData.type]
                : DIMENSION_PRESETS['default']
              ).map((preset) => (
                <option key={`${preset.width}x${preset.height}_${preset.unit}`} value={`${preset.width}x${preset.height}_${preset.unit}`}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Dimensions */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Custom Dimensions
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <div className="flex gap-2 flex-1">
                <input
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, width: e.target.value }
                  }))}
                  placeholder="Width"
                  className="flex-1 min-w-0 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
                />
                <input
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, height: e.target.value }
                  }))}
                  placeholder="Height"
                  className="flex-1 min-w-0 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
                />
              </div>
              <select
                value={formData.dimensions.unit}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dimensions: { ...prev.dimensions, unit: e.target.value as any }
                }))}
                className="w-full sm:w-auto px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
              >
                <option value="mm">mm</option>
                <option value="in">in</option>
                <option value="px">px</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {STATIONERY_TAGS.map(tag => {
                const isSelected = formData.tags.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    onClick={() => toggleTag(tag.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm transition-colors',
                      isSelected
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-slate-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.name || !formData.type || (!selectedFile && !formData.templateUrl && !item) || isUploading}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-medium rounded-lg flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {item ? 'Save Changes' : 'Add Stationery'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function StationeryPage() {
  const user = useAuthStore(s => s.user);
  const storeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [items, setItems] = useState<Stationery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Stationery | null>(null);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Load stationery
  useEffect(() => {
    if (!companyId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const loadItems = async () => {
      setIsLoading(true);
      const response = await stationeryApi.getAll(companyId);
      if (response.data) {
        setItems(response.data as Stationery[]);
      }
      setIsLoading(false);
    };

    loadItems();
  }, [companyId]);

  const handleCreate = async (data: any) => {
    if (!companyId) return;

    const response = await stationeryApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setItems(prev => [...prev, response.data as Stationery]);
      setIsModalOpen(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Stationery>) => {
    const response = await stationeryApi.update(id, data);
    if (response.data) {
      setItems(prev =>
        prev.map(item => (item.id === id ? (response.data as Stationery) : item))
      );
      setIsModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stationery?')) return;
    const response = await stationeryApi.delete(id);
    if (!response.error) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Helper to get category for a stationery type
  const getCategoryForType = (type: string): string => {
    if (CORE_STATIONERY.some(t => t.value === type)) return 'core-stationery';
    if (OFFICE_ASSETS.some(t => t.value === type)) return 'office-assets';
    if (PACKAGING_STATIONERY.some(t => t.value === type)) return 'packaging-stationery';
    if (PRINT_STATIONERY.some(t => t.value === type)) return 'print-stationery';
    if (MARKETING_ASSETS.some(t => t.value === type)) return 'marketing-assets';
    return 'other';
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
    const matchesType = !typeFilter || item.type === typeFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesCategory = !categoryFilter || getCategoryForType(item.type || 'other') === categoryFilter;
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = getCategoryForType(item.type || 'other');
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {} as Record<string, Stationery[]>);

  // Category display order
  const categoryOrder = ['core-stationery', 'office-assets', 'packaging-stationery', 'print-stationery', 'marketing-assets', 'other'];

  // Stats
  const stats = {
    total: items.length,
    approved: items.filter(i => i.status === 'approved').length,
    draft: items.filter(i => i.status === 'draft').length,
    archived: items.filter(i => i.status === 'archived').length,
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Please select a company to manage stationery.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-200">Stationery</h1>
            <p className="text-slate-400 text-sm">
              Core stationery, office assets, packaging, print materials, and marketing collateral
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-slate-900 font-medium rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Add Stationery
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-200">{stats.total}</p>
          <p className="text-sm text-slate-500">Total Items</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
          <p className="text-sm text-slate-500">Approved</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-amber-400">{stats.draft}</p>
          <p className="text-sm text-slate-500">Draft</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-400">{stats.archived}</p>
          <p className="text-sm text-slate-500">Archived</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search stationery..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setTypeFilter(''); // Reset type filter when category changes
          }}
          className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
        >
          <option value="">All Categories</option>
          <option value="core-stationery">Core Stationery</option>
          <option value="office-assets">Office Use Assets</option>
          <option value="packaging-stationery">Packaging Stationery</option>
          <option value="print-stationery">Print Stationery</option>
          <option value="marketing-assets">Marketing Assets</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
        >
          <option value="">All Types</option>
          {STATIONERY_TYPES
            .filter(type => !type.disabled && (!categoryFilter || getCategoryForType(type.value) === categoryFilter))
            .map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="approved">Approved</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-xl">
          <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">No stationery yet</h3>
          <p className="text-slate-500 mb-4">Upload your first stationery template to get started</p>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-400 text-slate-900 font-medium rounded-lg"
          >
            Add Stationery
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {categoryOrder
            .filter(category => groupedItems[category]?.length > 0)
            .map((category) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  {STATIONERY_CATEGORIES[category as keyof typeof STATIONERY_CATEGORIES] || category}
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full">
                    {groupedItems[category].length}
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupedItems[category].map(item => (
                    <StationeryCard
                      key={item.id}
                      item={item}
                      onEdit={(i) => {
                        setEditingItem(i);
                        setIsModalOpen(true);
                      }}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal */}
      <StationeryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={(data) => {
          if (editingItem) {
            handleUpdate(editingItem.id, data);
          } else {
            handleCreate(data);
          }
        }}
        item={editingItem}
      />
    </div>
  );
}
