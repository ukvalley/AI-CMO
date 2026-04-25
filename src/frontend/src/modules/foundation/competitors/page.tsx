/**
 * Competitors Module
 *
 * Competitive analysis with SWOT tracking and threat levels.
 */

'use client';

import React from 'react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { useDataStore } from '@/stores';
import type { Competitor, ThreatLevel } from '@/types/entities';
import { Globe, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<Competitor>[] = [
  {
    key: 'name',
    header: 'Competitor',
    sortable: true,
  },
  {
    key: 'website',
    header: 'Website',
    render: (value) => {
      if (!value) return '-';
      return (
        <a
          href={value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 hover:text-primary-300 flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Globe className="w-3 h-3" />
          <span className="truncate max-w-[150px]">{value as string}</span>
        </a>
      );
    },
  },
  {
    key: 'threatLevel',
    header: 'Threat Level',
    sortable: true,
    filterable: true,
    filterOptions: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' },
    ],
    render: (value) => {
      const config: Record<ThreatLevel, { color: string; icon: React.ReactNode; label: string }> = {
        low: { color: 'bg-green-500/20 text-green-400 border-green-500/50', icon: <ShieldCheck className="w-3 h-3" />, label: 'Low' },
        medium: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', icon: <ShieldQuestion className="w-3 h-3" />, label: 'Medium' },
        high: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/50', icon: <ShieldAlert className="w-3 h-3" />, label: 'High' },
        critical: { color: 'bg-red-500/20 text-red-400 border-red-500/50', icon: <ShieldAlert className="w-3 h-3" />, label: 'Critical' },
      };
      const { color, icon, label } = config[value as ThreatLevel] || config.medium;
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${color}`}>
          {icon}
          {label}
        </span>
      );
    },
  },
  {
    key: 'usp',
    header: 'Their USP',
    render: (value) => {
      if (!value) return '-';
      return (
        <span className="truncate max-w-[200px] block" title={value as string}>
          {value as string}
        </span>
      );
    },
  },
];

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  { key: 'name', label: 'Competitor Name', type: 'text', required: true },
  { key: 'website', label: 'Website', type: 'url', placeholder: 'https://competitor.com' },
  {
    key: 'threatLevel',
    label: 'Threat Level',
    type: 'select',
    options: [
      { value: 'low', label: 'Low - Minimal threat' },
      { value: 'medium', label: 'Medium - Some overlap' },
      { value: 'high', label: 'High - Direct competitor' },
      { value: 'critical', label: 'Critical - Market leader' },
    ],
    required: true,
  },
  {
    key: 'usp',
    label: 'Their Unique Selling Proposition',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'What makes them stand out from others?',
  },
  {
    key: 'strengths',
    label: 'Their Strengths',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'What do they do well?',
  },
  {
    key: 'weaknesses',
    label: 'Their Weaknesses',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'Where are they vulnerable?',
  },
  {
    key: 'swot',
    label: 'Full SWOT Analysis',
    type: 'textarea',
    rows: 6,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'Complete Strengths, Weaknesses, Opportunities, and Threats analysis',
  },
];

// ============================================
// COMPETITORS PAGE
// ============================================

export default function CompetitorsPage() {
  const { getItems, updateItem, deleteItem } = useDataStore();
  const competitors = getItems('competitors') as Competitor[];

  return (
    <ModulePage
      moduleId="competitors"
      columns={columns}
      fields={formFields}
      data={competitors}
      onCreate={(data) => {
        const { addItem } = useDataStore.getState();
        addItem('competitors', data as Omit<Competitor, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>);
      }}
      onUpdate={(id, data) => {
        updateItem('competitors', id, data);
      }}
      onDelete={(id) => {
        deleteItem('competitors', id);
      }}
    />
  );
}
