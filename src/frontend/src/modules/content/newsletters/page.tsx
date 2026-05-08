/**
 * Newsletters Module
 *
 * Email campaigns with templates and scheduling.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, Calendar, Eye, MousePointer } from 'lucide-react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { newsletterApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import type { Newsletter } from '@/types/entities';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<Newsletter>[] = [
  { key: 'name', header: 'Campaign Name', sortable: true },
  { key: 'subject', header: 'Subject Line' },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    filterable: true,
    filterOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'sending', label: 'Sending' },
      { value: 'sent', label: 'Sent' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  {
    key: 'type',
    header: 'Type',
    filterable: true,
    filterOptions: [
      { value: 'regular', label: 'Regular' },
      { value: 'automation', label: 'Automation' },
      { value: 'template', label: 'Template' },
    ],
  },
  {
    key: 'recipientCount',
    header: 'Recipients',
    align: 'right',
  },
  {
    key: 'openCount',
    header: 'Opens',
    align: 'right',
    render: (value, row) => {
      const pct = (row.recipientCount ?? 0) > 0
        ? Math.round(((value as number) / (row.recipientCount ?? 1)) * 100)
        : 0;
      return (
        <span className="flex items-center gap-1 text-[#878e9a]">
          <Eye className="w-3 h-3" />
          {String(value ?? 0)} ({pct}%)
        </span>
      );
    },
  },
  {
    key: 'clickCount',
    header: 'Clicks',
    align: 'right',
    render: (value, row) => {
      const pct = (row.recipientCount ?? 0) > 0
        ? Math.round(((value as number) / (row.recipientCount ?? 1)) * 100)
        : 0;
      return (
        <span className="flex items-center gap-1 text-[#878e9a]">
          <MousePointer className="w-3 h-3" />
          {String(value ?? 0)} ({pct}%)
        </span>
      );
    },
  },
];

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  { key: 'name', label: 'Campaign Name', type: 'text', required: true },
  { key: 'subject', label: 'Subject Line', type: 'text', required: true },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'regular', label: 'Regular' },
      { value: 'automation', label: 'Automation' },
      { value: 'template', label: 'Template' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'sending', label: 'Sending' },
      { value: 'sent', label: 'Sent' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  {
    key: 'preheader',
    label: 'Preheader Text',
    type: 'text',
    colSpan: 2,
  },
  {
    key: 'content',
    label: 'Email Content',
    type: 'textarea',
    rows: 10,
    aiGenerate: true,
    colSpan: 2,
  },
  { key: 'fromName', label: 'From Name', type: 'text' },
  { key: 'fromEmail', label: 'From Email', type: 'email' },
  { key: 'replyTo', label: 'Reply-To Email', type: 'email' },
  { key: 'recipientList', label: 'Recipient List', type: 'text' },
  {
    key: 'scheduledAt',
    label: 'Scheduled For',
    type: 'date',
  },
];

// ============================================
// NEWSLETTERS PAGE
// ============================================

export default function NewslettersPage() {
  const { user } = useAuthStore();
  const { activeCompanyId: storeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (!companyId) {
      setNewsletters([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      const response = await newsletterApi.getAll(companyId);
      if (response.data) {
        setNewsletters(response.data as Newsletter[]);
      }
      setIsLoading(false);
    };

    loadData();
  }, [companyId]);

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const response = await newsletterApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setNewsletters((prev) => [...prev, response.data as Newsletter]);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Newsletter>) => {
    const response = await newsletterApi.update(id, data);
    if (response.data) {
      setNewsletters((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...(response.data as Newsletter) } : n))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const response = await newsletterApi.delete(id);
    if (!response.error) {
      setNewsletters((prev) => prev.filter((n) => n.id !== id));
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#878e9a]">Please select a company to view newsletters.</p>
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
          <Mail className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Newsletters</h1>
          <p className="text-[#878e9a]">
            Create and manage email campaigns and newsletters
          </p>
        </div>
      </div>

      {/* Module Page */}
      <ModulePage
        moduleId="newsletters"
        columns={columns}
        fields={formFields}
        data={newsletters}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
