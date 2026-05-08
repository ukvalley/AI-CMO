/**
 * Founders Module
 *
 * Founder profiles with assets and social links.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { founderApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import type { Founder, ResponsibilityArea, AssetType } from '@/types/entities';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<Founder>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'title', header: 'Title', sortable: true },
  { key: 'responsibilityArea', header: 'Responsibility', sortable: true },
  {
    key: 'assets',
    header: 'Assets',
    render: (value) => {
      const assets = (value as Founder['assets']) || [];
      return assets.length > 0 ? `${assets.length} assets` : 'No assets';
    },
  },
];

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  { key: 'name', label: 'Full Name', type: 'text', required: true },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'country', label: 'Country', type: 'text' },
  { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { key: 'workAnniversary', label: 'Work Anniversary', type: 'date' },
  {
    key: 'responsibilityArea',
    label: 'Responsibility Area',
    type: 'select',
    options: [
      { value: 'vision', label: 'Vision' },
      { value: 'tech', label: 'Technology' },
      { value: 'sales', label: 'Sales' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'operations', label: 'Operations' },
      { value: 'finance', label: 'Finance' },
      { value: 'product', label: 'Product' },
      { value: 'hr', label: 'HR' },
    ],
  },
  {
    key: 'bio',
    label: 'Bio',
    type: 'textarea',
    rows: 4,
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'socialProfiles',
    label: 'Social Profiles',
    type: 'social-grid',
    colSpan: 2,
  },
  {
    key: 'section-photos',
    label: 'Photos & Media',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'photos',
    label: 'Founder Photos',
    type: 'image-gallery',
    placeholder: 'Upload photos or add Canva/Figma URLs...',
    helperText: 'Add multiple photos (headshots, team photos, event photos)',
    colSpan: 2,
  },
  {
    key: 'driveLink',
    label: 'Google Drive Link',
    type: 'url',
    placeholder: 'https://drive.google.com/drive/folders/...',
    helperText: 'Link to Google Drive folder with additional photos/videos',
    colSpan: 2,
  },
];

// ============================================
// FOUNDERS PAGE
// ============================================

export default function FoundersPage() {
  const { user } = useAuthStore();
  const { activeCompanyId: storeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [founders, setFounders] = useState<Founder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (!companyId) {
      setFounders([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      const response = await founderApi.getAll(companyId);
      if (response.data) setFounders(response.data as Founder[]);
      setIsLoading(false);
    };

    loadData();
  }, [companyId]);

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const response = await founderApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setFounders((prev) => [...prev, response.data as Founder]);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Founder>) => {
    const response = await founderApi.update(id, data);
    if (response.data && (response.data as Founder).id) {
      setFounders((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...(response.data as Founder) } : f))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const response = await founderApi.delete(id);
    if (!response.error) {
      setFounders((prev) => prev.filter((f) => f.id !== id));
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#878e9a]">Please select a company to view founders.</p>
      </div>
    );
  }

  return (
    <ModulePage
      moduleId="founders"
      columns={columns}
      fields={formFields}
      data={founders}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
