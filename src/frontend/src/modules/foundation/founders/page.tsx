/**
 * Founders Module
 *
 * Founder profiles with assets and social links.
 */

'use client';

import React from 'react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { useDataStore } from '@/stores';
import type { Founder, ResponsibilityArea, AssetType } from '@/types/entities';
import { TableColumn } from '@/components/shared';

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
];

// ============================================
// FOUNDERS PAGE
// ============================================

export default function FoundersPage() {
  const { getItems, addItem, updateItem, deleteItem } = useDataStore();
  const founders = getItems('founders') as Founder[];

  return (
    <ModulePage
      moduleId="founders"
      columns={columns}
      fields={formFields}
      data={founders}
      onCreate={(data) => {
        const { addItem } = useDataStore.getState();
        addItem('founders', data);
      }}
      onUpdate={(id, data) => {
        updateItem('founders', id, data);
      }}
      onDelete={(id) => {
        deleteItem('founders', id);
      }}
    />
  );
}
