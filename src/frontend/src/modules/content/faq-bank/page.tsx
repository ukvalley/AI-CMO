/**
 * FAQs Module
 *
 * Frequently asked questions with categories.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { faqApi } from '@/services/api';
import { useAuthStore } from '@/stores';
import type { FAQ } from '@/types/entities';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<FAQ>[] = [
  {
    key: 'question',
    header: 'Question',
    sortable: true,
  },
  {
    key: 'category',
    header: 'Category',
    sortable: true,
    filterable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    filterable: true,
    filterOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  {
    key: 'viewCount',
    header: 'Views',
    align: 'right',
  },
  {
    key: 'helpfulCount',
    header: 'Helpful',
    align: 'right',
    render: (value) => (
      <span className="flex items-center gap-1 text-green-400">
        <ThumbsUp className="w-3 h-3" />
        {value}
      </span>
    ),
  },
];

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  {
    key: 'question',
    label: 'Question',
    type: 'text',
    required: true,
    colSpan: 2,
  },
  {
    key: 'category',
    label: 'Category',
    type: 'text',
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
    key: 'answer',
    label: 'Answer',
    type: 'textarea',
    rows: 6,
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'multiselect',
    options: [],
    colSpan: 2,
  },
];

// ============================================
// FAQ PAGE
// ============================================

export default function FAQPage() {
  const { user } = useAuthStore();
  const companyId = user?.activeCompanyId;

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (!companyId) {
      setFaqs([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      const response = await faqApi.getAll(companyId);
      if (response.data) {
        setFaqs(response.data as FAQ[]);
      }
      setIsLoading(false);
    };

    loadData();
  }, [companyId]);

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const response = await faqApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setFaqs((prev) => [...prev, response.data as FAQ]);
    }
  };

  const handleUpdate = async (id: string, data: Partial<FAQ>) => {
    const response = await faqApi.update(id, data);
    if (response.data) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...(response.data as FAQ) } : f))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const response = await faqApi.delete(id);
    if (!response.error) {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Please select a company to view FAQs.</p>
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
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">FAQs</h1>
          <p className="text-slate-400">
            Manage frequently asked questions and answers
          </p>
        </div>
      </div>

      {/* Module Page */}
      <ModulePage
        moduleId="faqs"
        columns={columns}
        fields={formFields}
        data={faqs}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
