/**
 * Stationery Module
 *
 * Business cards, letterheads, email signatures, and other stationery.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Check, Clock, Archive } from 'lucide-react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { stationeryApi } from '@/services/api';
import { useAuthStore } from '@/stores';
import type { Stationery } from '@/types/entities';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<Stationery>[] = [
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
      { value: 'business-card', label: 'Business Card' },
      { value: 'letterhead', label: 'Letterhead' },
      { value: 'email-signature', label: 'Email Signature' },
      { value: 'envelope', label: 'Envelope' },
      { value: 'memo-pad', label: 'Memo Pad' },
      { value: 'folder', label: 'Folder' },
      { value: 'compliment-slip', label: 'Compliment Slip' },
      { value: 'invoice-template', label: 'Invoice Template' },
      { value: 'proposal-template', label: 'Proposal Template' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'status',
    header: 'Status',
    filterable: true,
    filterOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'approved', label: 'Approved' },
      { value: 'archived', label: 'Archived' },
    ],
    render: (value) => {
      const status = value as string;
      if (status === 'approved') {
        return (
          <span className="text-green-400 flex items-center gap-1">
            <Check className="w-4 h-4" /> Approved
          </span>
        );
      }
      if (status === 'archived') {
        return (
          <span className="text-slate-400 flex items-center gap-1">
            <Archive className="w-4 h-4" /> Archived
          </span>
        );
      }
      return (
        <span className="text-amber-400 flex items-center gap-1">
          <Clock className="w-4 h-4" /> Draft
        </span>
      );
    },
  },
  {
    key: 'dimensions',
    header: 'Dimensions',
    render: (value) => {
      const dims = value as { width?: number; height?: number; unit?: string } | undefined;
      return dims?.width && dims?.height ? `${dims.width}×${dims.height} ${dims.unit || ''}` : '-';
    },
  },
];

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  { key: 'name', label: 'Template Name', type: 'text', required: true },
  {
    key: 'type',
    label: 'Stationery Type',
    type: 'select',
    required: true,
    options: [
      { value: 'business-card', label: 'Business Card' },
      { value: 'letterhead', label: 'Letterhead' },
      { value: 'email-signature', label: 'Email Signature' },
      { value: 'envelope', label: 'Envelope' },
      { value: 'memo-pad', label: 'Memo Pad' },
      { value: 'folder', label: 'Folder' },
      { value: 'compliment-slip', label: 'Compliment Slip' },
      { value: 'invoice-template', label: 'Invoice Template' },
      { value: 'proposal-template', label: 'Proposal Template' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'approved', label: 'Approved' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 3,
    colSpan: 2,
  },
  { key: 'templateUrl', label: 'Template URL', type: 'url', colSpan: 2 },
  { key: 'previewImageUrl', label: 'Preview Image URL', type: 'url', colSpan: 2 },
  {
    key: 'tags',
    label: 'Tags',
    type: 'multiselect',
    options: [
      { value: 'print', label: 'Print' },
      { value: 'digital', label: 'Digital' },
      { value: 'corporate', label: 'Corporate' },
      { value: 'external', label: 'External' },
      { value: 'internal', label: 'Internal' },
    ],
    colSpan: 2,
  },
];

// ============================================
// STATIONERY PAGE
// ============================================

export default function StationeryPage() {
  const { user } = useAuthStore();
  const companyId = user?.activeCompanyId;

  const [items, setItems] = useState<Stationery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load stationery from API
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

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const response = await stationeryApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setItems((prev) => [...prev, response.data as Stationery]);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Stationery>) => {
    const response = await stationeryApi.update(id, data);
    if (response.data) {
      setItems((prev) =>
        prev.map((item) => (item._id === id ? (response.data as Stationery) : item))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const response = await stationeryApi.delete(id);
    if (!response.error) {
      setItems((prev) => prev.filter((item) => item._id !== id));
    }
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Stationery</h1>
          <p className="text-slate-400">
            Manage business cards, letterheads, email signatures, and templates
          </p>
        </div>
      </div>

      {/* Module Page */}
      <ModulePage
        moduleId="stationery"
        columns={columns}
        fields={formFields}
        data={items}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
