/**
 * Website Pages Module
 *
 * Landing pages, home, about, contact, and other website pages.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Globe } from 'lucide-react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { websitePageApi } from '@/services/api';
import { useAuthStore } from '@/stores';
import type { WebsitePage } from '@/types/entities';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<WebsitePage>[] = [
  { key: 'title', header: 'Title', sortable: true },
  { key: 'slug', header: 'Slug', sortable: true },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    filterable: true,
    filterOptions: [
      { value: 'home', label: 'Home' },
      { value: 'about', label: 'About' },
      { value: 'contact', label: 'Contact' },
      { value: 'landing', label: 'Landing' },
      { value: 'product', label: 'Product' },
      { value: 'service', label: 'Service' },
      { value: 'blog', label: 'Blog' },
      { value: 'custom', label: 'Custom' },
    ],
  },
  {
    key: 'status',
    header: 'Status',
    filterable: true,
    filterOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  {
    key: 'isHomepage',
    header: 'Homepage',
    render: (value) =>
      value ? (
        <span className="text-green-400">Yes</span>
      ) : (
        <span className="text-slate-500">-</span>
      ),
  },
];

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  { key: 'title', label: 'Page Title', type: 'text', required: true },
  { key: 'slug', label: 'URL Slug', type: 'text', required: true },
  {
    key: 'type',
    label: 'Page Type',
    type: 'select',
    required: true,
    options: [
      { value: 'home', label: 'Home' },
      { value: 'about', label: 'About' },
      { value: 'contact', label: 'Contact' },
      { value: 'landing', label: 'Landing' },
      { value: 'product', label: 'Product' },
      { value: 'service', label: 'Service' },
      { value: 'blog', label: 'Blog' },
      { value: 'custom', label: 'Custom' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  {
    key: 'content',
    label: 'Page Content',
    type: 'textarea',
    rows: 10,
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'metaTitle',
    label: 'Meta Title',
    type: 'text',
    colSpan: 2,
  },
  {
    key: 'metaDescription',
    label: 'Meta Description',
    type: 'textarea',
    rows: 2,
    colSpan: 2,
  },
  { key: 'featuredImage', label: 'Featured Image URL', type: 'url', colSpan: 2 },
  {
    key: 'isHomepage',
    label: 'Set as Homepage',
    type: 'toggle',
  },
];

// ============================================
// WEBSITE PAGES PAGE
// ============================================

export default function WebsitePagesPage() {
  const { user } = useAuthStore();
  const companyId = user?.activeCompanyId;

  const [pages, setPages] = useState<WebsitePage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (!companyId) {
      setPages([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      const response = await websitePageApi.getAll(companyId);
      if (response.data) {
        setPages(response.data as WebsitePage[]);
      }
      setIsLoading(false);
    };

    loadData();
  }, [companyId]);

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const response = await websitePageApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setPages((prev) => [...prev, response.data as WebsitePage]);
    }
  };

  const handleUpdate = async (id: string, data: Partial<WebsitePage>) => {
    const response = await websitePageApi.update(id, data);
    if (response.data) {
      setPages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...(response.data as WebsitePage) } : p))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const response = await websitePageApi.delete(id);
    if (!response.error) {
      setPages((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Please select a company to view website pages.</p>
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
          <Globe className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Website Pages</h1>
          <p className="text-slate-400">
            Manage landing pages, home, about, contact, and other website pages
          </p>
        </div>
      </div>

      {/* Module Page */}
      <ModulePage
        moduleId="website-pages"
        columns={columns}
        fields={formFields}
        data={pages}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
