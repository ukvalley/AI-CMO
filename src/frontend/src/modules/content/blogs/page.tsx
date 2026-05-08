/**
 * Blogs Module
 *
 * Blog posts with categories, tags, and publishing workflow.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { blogApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import type { Blog } from '@/types/entities';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<Blog>[] = [
  { key: 'title', header: 'Title', sortable: true },
  { key: 'author', header: 'Author' },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    filterable: true,
    filterOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'review', label: 'Review' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  { key: 'category', header: 'Category' },
  {
    key: 'readingTime',
    header: 'Reading Time',
    render: (value) =>
      value ? (
        <span className="flex items-center gap-1 text-[#878e9a]">
          <Clock className="w-3 h-3" />
          {String(value)} min
        </span>
      ) : (
        '-'
      ),
  },
  { key: 'viewCount', header: 'Views', align: 'right' },
];

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  { key: 'title', label: 'Blog Title', type: 'text', required: true },
  { key: 'slug', label: 'URL Slug', type: 'text', required: true },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'review', label: 'Review' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  { key: 'author', label: 'Author Name', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  {
    key: 'excerpt',
    label: 'Excerpt',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'content',
    label: 'Content',
    type: 'textarea',
    rows: 10,
    aiGenerate: true,
    colSpan: 2,
  },
  { key: 'featuredImage', label: 'Featured Image URL', type: 'url', colSpan: 2 },
  {
    key: 'tags',
    label: 'Tags',
    type: 'multiselect',
    options: [],
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
];

// ============================================
// BLOGS PAGE
// ============================================

export default function BlogsPage() {
  const { user } = useAuthStore();
  const { activeCompanyId: storeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (!companyId) {
      setBlogs([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      const response = await blogApi.getAll(companyId);
      if (response.data) {
        setBlogs(response.data as Blog[]);
      }
      setIsLoading(false);
    };

    loadData();
  }, [companyId]);

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const response = await blogApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setBlogs((prev) => [...prev, response.data as Blog]);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Blog>) => {
    const response = await blogApi.update(id, data);
    if (response.data) {
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...(response.data as Blog) } : b))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const response = await blogApi.delete(id);
    if (!response.error) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#878e9a]">Please select a company to view blogs.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8FF2E]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#C8FF2E] to-[#b3e628] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C8FF2E]/20">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Blogs</h1>
          <p className="text-[#878e9a]">
            Create and manage blog posts with categories and tags
          </p>
        </div>
      </div>

      {/* Module Page */}
      <ModulePage
        moduleId="blogs"
        columns={columns}
        fields={formFields}
        data={blogs}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
