/**
 * Brand Assets Module
 *
 * Manage logos, favicons, social media images, and other brand assets.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Image, Upload, Check } from 'lucide-react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { brandAssetApi } from '@/services/api';
import { useAuthStore } from '@/stores';
import type { BrandAsset } from '@/types/entities';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<BrandAsset>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
  },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    filterable: true,
    filterOptions: [
      { value: 'logo', label: 'Logo' },
      { value: 'logo-icon', label: 'Logo Icon' },
      { value: 'favicon', label: 'Favicon' },
      { value: 'social-og', label: 'Social OG' },
      { value: 'social-twitter', label: 'Twitter Card' },
      { value: 'social-linkedin', label: 'LinkedIn' },
      { value: 'social-instagram', label: 'Instagram' },
      { value: 'social-facebook', label: 'Facebook' },
      { value: 'email-header', label: 'Email Header' },
      { value: 'email-footer', label: 'Email Footer' },
      { value: 'presentation', label: 'Presentation' },
      { value: 'document', label: 'Document' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'format',
    header: 'Format',
  },
  {
    key: 'isPrimary',
    header: 'Primary',
    render: (value) =>
      value ? (
        <span className="text-green-400 flex items-center gap-1">
          <Check className="w-4 h-4" /> Yes
        </span>
      ) : (
        <span className="text-slate-500">-</span>
      ),
  },
  {
    key: 'dimensions',
    header: 'Dimensions',
    render: (value) => {
      const dims = value as { width?: number; height?: number } | undefined;
      return dims?.width && dims?.height ? `${dims.width}×${dims.height}` : '-';
    },
  },
];

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  { key: 'name', label: 'Asset Name', type: 'text', required: true },
  {
    key: 'type',
    label: 'Asset Type',
    type: 'select',
    required: true,
    options: [
      { value: 'logo', label: 'Logo' },
      { value: 'logo-icon', label: 'Logo Icon' },
      { value: 'favicon', label: 'Favicon' },
      { value: 'social-og', label: 'Social OG Image' },
      { value: 'social-twitter', label: 'Twitter Card' },
      { value: 'social-linkedin', label: 'LinkedIn Image' },
      { value: 'social-instagram', label: 'Instagram Image' },
      { value: 'social-facebook', label: 'Facebook Image' },
      { value: 'email-header', label: 'Email Header' },
      { value: 'email-footer', label: 'Email Footer' },
      { value: 'presentation', label: 'Presentation Template' },
      { value: 'document', label: 'Document Template' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'format',
    label: 'Format',
    type: 'select',
    required: true,
    options: [
      { value: 'svg', label: 'SVG' },
      { value: 'png', label: 'PNG' },
      { value: 'jpg', label: 'JPG' },
      { value: 'webp', label: 'WebP' },
      { value: 'pdf', label: 'PDF' },
      { value: 'ico', label: 'ICO' },
    ],
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 2,
    colSpan: 2,
  },
  { key: 'url', label: 'Asset URL', type: 'url', colSpan: 2 },
  {
    key: 'isPrimary',
    label: 'Set as Primary Asset for this Type',
    type: 'toggle',
    colSpan: 2,
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'multiselect',
    options: [
      { value: 'print', label: 'Print' },
      { value: 'digital', label: 'Digital' },
      { value: 'web', label: 'Web' },
      { value: 'social', label: 'Social Media' },
      { value: 'email', label: 'Email' },
    ],
    colSpan: 2,
  },
];

// ============================================
// BRAND ASSETS PAGE
// ============================================

export default function BrandAssetsPage() {
  const { user } = useAuthStore();
  const companyId = user?.activeCompanyId;

  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load assets from API
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

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const response = await brandAssetApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setAssets((prev) => [...prev, response.data as BrandAsset]);
    }
  };

  const handleUpdate = async (id: string, data: Partial<BrandAsset>) => {
    const response = await brandAssetApi.update(id, data);
    if (response.data) {
      setAssets((prev) =>
        prev.map((item) => (item._id === id ? (response.data as BrandAsset) : item))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const response = await brandAssetApi.delete(id);
    if (!response.error) {
      setAssets((prev) => prev.filter((item) => item._id !== id));
    }
  };

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <Image className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Brand Assets</h1>
          <p className="text-slate-400">
            Manage logos, favicons, social images, and other brand assets
          </p>
        </div>
      </div>

      {/* Module Page */}
      <ModulePage
        moduleId="brand-assets"
        columns={columns}
        fields={formFields}
        data={assets}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
