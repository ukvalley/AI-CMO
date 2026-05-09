/**
 * Brand Assets Module
 *
 * Manage logos, favicons, social media images, and other brand assets.
 * Supports both file upload and URL input for asset sources.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Image, Upload, Link, X, Check, Trash2, Edit, Plus, Download, Copy, Eye } from 'lucide-react';
import { brandAssetApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import { cn } from '@/utils/cn';
import type { BrandAsset } from '@/types/entities';

// ============================================
// BRAND ASSET TAGS
// ============================================

const BRAND_ASSET_TAGS = [
  { value: 'logo-primary', label: 'Primary Logo' },
  { value: 'logo-secondary', label: 'Secondary Logo' },
  { value: 'logo-icon', label: 'Logo Icon' },
  { value: 'favicon', label: 'Favicon' },
  { value: 'social-og', label: 'Social OG' },
  { value: 'social-twitter', label: 'Twitter Card' },
  { value: 'social-linkedin', label: 'LinkedIn' },
  { value: 'social-instagram', label: 'Instagram' },
  { value: 'social-facebook', label: 'Facebook' },
  { value: 'social-tiktok', label: 'TikTok' },
  { value: 'social-youtube', label: 'YouTube' },
  { value: 'email-header', label: 'Email Header' },
  { value: 'email-footer', label: 'Email Footer' },
  { value: 'email-signature', label: 'Email Signature' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'document', label: 'Document' },
  { value: 'web-banner', label: 'Web Banner' },
  { value: 'app-icon', label: 'App Icon' },
  { value: 'pattern', label: 'Pattern' },
  { value: 'background', label: 'Background' },
  { value: 'print-ready', label: 'Print Ready' },
  { value: 'vector', label: 'Vector' },
  { value: 'transparent', label: 'Transparent' },
  { value: 'dark-version', label: 'Dark Version' },
  { value: 'light-version', label: 'Light Version' },
];

// ============================================
// ASSET TYPES
// ============================================

const ASSET_TYPES = [
  { value: 'logo', label: 'Logo' },
  { value: 'logo-icon', label: 'Logo Icon' },
  { value: 'favicon', label: 'Favicon' },
  { value: 'social-og', label: 'Social OG Image' },
  { value: 'social-twitter', label: 'Twitter Card' },
  { value: 'social-linkedin', label: 'LinkedIn Image' },
  { value: 'social-instagram', label: 'Instagram Image' },
  { value: 'social-facebook', label: 'Facebook Image' },
  { value: 'social-tiktok', label: 'TikTok Image' },
  { value: 'social-youtube', label: 'YouTube Thumbnail' },
  { value: 'email-header', label: 'Email Header' },
  { value: 'email-footer', label: 'Email Footer' },
  { value: 'presentation', label: 'Presentation Template' },
  { value: 'document', label: 'Document Template' },
  { value: 'web-banner', label: 'Web Banner' },
  { value: 'app-icon', label: 'App Icon' },
  { value: 'other', label: 'Other' },
];

// ============================================
// COMPONENT: Asset Card
// ============================================

function AssetCard({
  asset,
  onEdit,
  onDelete,
  onSetPrimary,
}: {
  asset: BrandAsset;
  onEdit: (asset: BrandAsset) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string, isPrimary: boolean) => void;
}) {
  const [imageError, setImageError] = useState(false);

  const getAssetIcon = () => {
    if (asset.type?.includes('logo')) return '🔷';
    if (asset.type?.includes('favicon')) return '🔖';
    if (asset.type?.includes('social')) return '📱';
    if (asset.type?.includes('email')) return '📧';
    if (asset.type?.includes('presentation')) return '📊';
    if (asset.type?.includes('document')) return '📄';
    return '🎨';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-colors">
      {/* Preview */}
      <div className="aspect-video bg-slate-800/50 relative group">
        {(asset.url || asset.base64Data) && !imageError ? (
          <img
            src={asset.url || asset.base64Data}
            alt={asset.name}
            className="w-full h-full object-contain p-4"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">{getAssetIcon()}</div>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {(asset.url || asset.base64Data) && (
            <>
              <a
                href={asset.url || asset.base64Data || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                title="View Asset"
              >
                <Eye className="w-5 h-5" />
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(asset.url || asset.base64Data || '')}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                title="Copy Asset URL"
              >
                <Copy className="w-5 h-5" />
              </button>
            </>
          )}
          {asset.sourceUrl && (
            <a
              href={asset.sourceUrl}
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
            onClick={() => onEdit(asset)}
            className="p-2 bg-primary-500 hover:bg-primary-400 rounded-lg text-slate-900"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(asset.id)}
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
            <h3 className="font-medium text-slate-200">{asset.name}</h3>
            <p className="text-xs text-slate-500">
              {ASSET_TYPES.find(t => t.value === asset.type)?.label || asset.type}
            </p>
          </div>
          {asset.isPrimary && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
              Primary
            </span>
          )}
        </div>

        {/* Tags */}
        {asset.tags && asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {asset.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded"
              >
                {BRAND_ASSET_TAGS.find(t => t.value === tag)?.label || tag}
              </span>
            ))}
            {asset.tags.length > 3 && (
              <span className="text-xs text-slate-500">+{asset.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
          <span>{formatFileSize(asset.fileSize)}</span>
          {asset.dimensions?.width && asset.dimensions?.height && (
            <span>{asset.dimensions.width}×{asset.dimensions.height}</span>
          )}
        </div>

        {/* Source Type & Design Link */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            {asset.base64Data || asset.source === 'upload' ? (
              <>
                <Upload className="w-3 h-3" />
                <span>Uploaded</span>
              </>
            ) : (
              <>
                <Link className="w-3 h-3" />
                <span>URL</span>
              </>
            )}
          </span>
          {asset.sourceUrl && (
            <a
              href={asset.sourceUrl}
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
// COMPONENT: Asset Form Modal
// ============================================

function AssetFormModal({
  isOpen,
  onClose,
  onSave,
  asset,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  asset?: BrandAsset | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    url: '',
    sourceUrl: '', // Canva/Figma/design file URL
    tags: [] as string[],
    isPrimary: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        type: asset.type || '',
        description: asset.description || '',
        url: asset.url || '',
        sourceUrl: asset.sourceUrl || '',
        tags: asset.tags || [],
        isPrimary: asset.isPrimary || false,
      });
      // If asset has base64 data, show it as preview
      if (asset.base64Data) {
        setPreviewUrl(asset.base64Data);
      }
    } else {
      setFormData({
        name: '',
        type: '',
        description: '',
        url: '',
        sourceUrl: '',
        tags: [],
        isPrimary: false,
      });
      setSelectedFile(null);
      setPreviewUrl('');
    }
  }, [asset, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Extract format from file or URL
  const getFormat = (): string => {
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      return ext || 'png';
    }
    if (formData.url) {
      try {
        const url = new URL(formData.url);
        const pathname = url.pathname;
        const ext = pathname.split('.').pop()?.toLowerCase();
        if (ext && ['svg', 'png', 'jpg', 'jpeg', 'webp', 'pdf', 'ico', 'gif'].includes(ext)) {
          return ext === 'jpeg' ? 'jpg' : ext;
        }
      } catch {
        // Invalid URL, fallback to png
      }
    }
    return 'png'; // Default format
  };

  const handleSave = async () => {
    if (!formData.name || !formData.type) return;

    setIsUploading(true);

    const data: any = {
      ...formData,
      format: getFormat(), // Auto-detect format
    };

    // If uploading a file, convert to base64
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        data.base64Data = reader.result; // Backend expects base64Data
        data.fileName = selectedFile.name;
        data.fileSize = selectedFile.size;
        data.fileType = selectedFile.type;
        data.source = 'upload';
        data.url = reader.result; // Use base64 as URL for display
        onSave(data);
        setIsUploading(false);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      data.source = 'url';
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
            {asset ? 'Edit Asset' : 'Add Asset'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Section - Optional */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Upload Asset File
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
                accept="image/*,.svg,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="text-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-24 object-contain mx-auto mb-3 rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 text-primary-400" />
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
                    SVG, PNG, JPG, WebP, PDF up to 10MB
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

          {/* Asset URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Asset URL
              <span className="text-slate-500 font-normal"> - External link to the asset</span>
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://cdn.example.com/logo.png"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Source Design URL (Canva/Figma) */}
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
              Asset Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Primary Logo Dark"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Asset Type <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            >
              <option value="">Select type...</option>
              {ASSET_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this asset..."
              rows={2}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {BRAND_ASSET_TAGS.map(tag => {
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

          {/* Primary Toggle */}
          <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
            <input
              type="checkbox"
              id="isPrimary"
              checked={formData.isPrimary}
              onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
              className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-primary-500 focus:ring-primary-500"
            />
            <label htmlFor="isPrimary" className="flex-1 cursor-pointer">
              <span className="text-sm font-medium text-slate-300">
                Set as Primary Asset for this Type
              </span>
              <p className="text-xs text-slate-500">
                This will be the default asset for this type
              </p>
            </label>
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
            disabled={!formData.name || !formData.type || (!selectedFile && !formData.url && !asset) || isUploading}
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
                {asset ? 'Save Changes' : 'Add Asset'}
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

export default function BrandAssetsPage() {
  const { user } = useAuthStore();
  const { activeCompanyId: storeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<BrandAsset | null>(null);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Load assets
  useEffect(() => {
    if (!companyId) {
      setAssets([]);
      setIsLoading(false);
      return;
    }

    const loadAssets = async () => {
      setIsLoading(true);
      const response = await brandAssetApi.getAll(companyId);
      if (response.data) {
        setAssets(response.data as BrandAsset[]);
      }
      setIsLoading(false);
    };

    loadAssets();
  }, [companyId]);

  const handleCreate = async (data: any) => {
    if (!companyId) return;

    const response = await brandAssetApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setAssets(prev => [...prev, response.data as BrandAsset]);
      setIsModalOpen(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<BrandAsset>) => {
    const response = await brandAssetApi.update(id, data);
    if (response.data) {
      setAssets(prev =>
        prev.map(item => (item.id === id ? (response.data as BrandAsset) : item))
      );
      setIsModalOpen(false);
      setEditingAsset(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    const response = await brandAssetApi.delete(id);
    if (!response.error) {
      setAssets(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSetPrimary = async (id: string, isPrimary: boolean) => {
    const asset = assets.find(a => a.id === id);
    if (!asset) return;

    // If setting as primary, remove primary from others of same type
    if (isPrimary) {
      const updates = assets
        .filter(a => a.type === asset.type && a.isPrimary && a.id !== id)
        .map(a => brandAssetApi.update(a.id, { isPrimary: false }));
      await Promise.all(updates);
    }

    await handleUpdate(id, { isPrimary });
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(filter.toLowerCase()) ||
      asset.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
    const matchesType = !typeFilter || asset.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const groupedAssets = filteredAssets.reduce((groups, asset) => {
    const type = asset.type || 'other';
    if (!groups[type]) groups[type] = [];
    groups[type].push(asset);
    return groups;
  }, {} as Record<string, BrandAsset[]>);

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Please select a company to manage brand assets.</p>
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
            <Image className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-200">Brand Assets</h1>
            <p className="text-slate-400 text-sm">
              Manage logos, favicons, social images, and other brand assets
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingAsset(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-slate-900 font-medium rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-200">{assets.length}</p>
          <p className="text-sm text-slate-500">Total Assets</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-200">
            {assets.filter(a => a.isPrimary).length}
          </p>
          <p className="text-sm text-slate-500">Primary Assets</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-200">
            {assets.filter(a => a.source === 'upload').length}
          </p>
          <p className="text-sm text-slate-500">Uploaded</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-200">
            {new Set(assets.map(a => a.type)).size}
          </p>
          <p className="text-sm text-slate-500">Asset Types</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
        >
          <option value="">All Types</option>
          {ASSET_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-xl">
          <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">No assets yet</h3>
          <p className="text-slate-500 mb-4">Upload your first brand asset to get started</p>
          <button
            onClick={() => {
              setEditingAsset(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-400 text-slate-900 font-medium rounded-lg"
          >
            Add Asset
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedAssets).map(([type, typeAssets]) => (
            <div key={type}>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                {ASSET_TYPES.find(t => t.value === type)?.label || type}
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full">
                  {typeAssets.length}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {typeAssets.map(asset => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onEdit={(a) => {
                      setEditingAsset(a);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                    onSetPrimary={handleSetPrimary}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AssetFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAsset(null);
        }}
        onSave={(data) => {
          if (editingAsset) {
            handleUpdate(editingAsset.id, data);
          } else {
            handleCreate(data);
          }
        }}
        asset={editingAsset}
      />
    </div>
  );
}
