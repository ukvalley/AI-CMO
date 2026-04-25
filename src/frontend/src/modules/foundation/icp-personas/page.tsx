/**
 * ICPs & Personas Module
 *
 * Ideal Customer Profiles and Buyer Personas management.
 */

'use client';

import React, { useState } from 'react';
import { Plus, Target, UserCircle, Users } from 'lucide-react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { useDataStore } from '@/stores';
import type { ICP, Persona } from '@/types/entities';
import { Button } from '@/components/ui/Button';

// ============================================
// ICP TABLE COLUMNS
// ============================================

const icpColumns: TableColumn<ICP>[] = [
  {
    key: 'name',
    header: 'ICP Name',
    sortable: true,
  },
  {
    key: 'industry',
    header: 'Industry',
    sortable: true,
  },
  {
    key: 'companySize',
    header: 'Company Size',
    sortable: true,
  },
  {
    key: 'location',
    header: 'Location',
    sortable: true,
  },
  {
    key: 'isActive',
    header: 'Status',
    render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs border ${
        value ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-slate-700 text-slate-400 border-slate-600'
      }`}>
        {value ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

// ============================================
// ICP FORM FIELDS
// ============================================

const icpFormFields: FormField[] = [
  { key: 'name', label: 'ICP Name', type: 'text', required: true, placeholder: 'e.g., Enterprise SaaS Companies' },
  { key: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g., Technology, Healthcare' },
  { key: 'companySize', label: 'Company Size', type: 'select', options: [
    { value: 'startup', label: 'Startup (1-10)' },
    { value: 'small', label: 'Small (11-50)' },
    { value: 'medium', label: 'Medium (51-200)' },
    { value: 'enterprise', label: 'Enterprise (200+)' },
  ]},
  { key: 'location', label: 'Geographic Location', type: 'text', placeholder: 'e.g., North America, Europe' },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'painPoints',
    label: 'Pain Points',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'What problems are they trying to solve?',
  },
  {
    key: 'goals',
    label: 'Goals & Objectives',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'What are they trying to achieve?',
  },
  {
    key: 'isActive',
    label: 'Active',
    type: 'toggle',
  },
];

// ============================================
// PERSONA TABLE COLUMNS
// ============================================

function usePersonaColumns(icps: ICP[]): TableColumn<Persona>[] {
  return [
    {
      key: 'name',
      header: 'Persona Name',
      sortable: true,
    },
    {
      key: 'icpId',
      header: 'Linked ICP',
      sortable: true,
      render: (value) => {
        const icp = icps.find((i) => i.id === value);
        return icp?.name || 'Unknown ICP';
      },
    },
    {
      key: 'age',
      header: 'Age Range',
    },
    {
      key: 'job',
      header: 'Job Title',
      sortable: true,
    },
  ];
}

// ============================================
// PERSONA FORM FIELDS
// ============================================

function usePersonaFormFields(icps: ICP[]): FormField[] {
  const icpOptions = icps.map((i) => ({ value: i.id, label: i.name }));

  return [
    {
      key: 'icpId',
      label: 'Linked ICP',
      type: 'select',
      options: icpOptions.length > 0 ? icpOptions : [{ value: '', label: 'No ICPs available' }],
      required: true,
    },
    { key: 'name', label: 'Persona Name', type: 'text', required: true, placeholder: 'e.g., Marketing Mary' },
    { key: 'age', label: 'Age Range', type: 'text', placeholder: 'e.g., 25-34' },
    { key: 'job', label: 'Job Title', type: 'text', placeholder: 'e.g., Marketing Manager' },
    {
      key: 'bio',
      label: 'Bio / Background',
      type: 'textarea',
      rows: 4,
      aiGenerate: true,
      colSpan: 2,
    },
    {
      key: 'goals',
      label: 'Goals',
      type: 'textarea',
      rows: 3,
      aiGenerate: true,
      colSpan: 2,
      helperText: 'What does this persona want to achieve?',
    },
    {
      key: 'painPoints',
      label: 'Pain Points',
      type: 'textarea',
      rows: 3,
      aiGenerate: true,
      colSpan: 2,
      helperText: 'What frustrates this persona?',
    },
  ];
}

// ============================================
// ICPs & PERSONAS PAGE
// ============================================

export default function IcpPersonasPage() {
  const [activeTab, setActiveTab] = useState<'icps' | 'personas'>('icps');
  const { getItems, updateItem, deleteItem } = useDataStore();
  const icps = getItems('icps') as ICP[];
  const personas = getItems('personas') as Persona[];

  const personaColumns = usePersonaColumns(icps);
  const personaFormFields = usePersonaFormFields(icps);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('icps')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'icps'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          Ideal Customer Profiles
          <span className="ml-2 px-2 py-0.5 text-xs bg-slate-800 rounded-full">{icps.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('personas')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'personas'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCircle className="w-4 h-4" />
          Buyer Personas
          <span className="ml-2 px-2 py-0.5 text-xs bg-slate-800 rounded-full">{personas.length}</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'icps' ? (
        <ModulePage
          moduleId="icp-personas"
          columns={icpColumns}
          fields={icpFormFields}
          data={icps}
          onCreate={(data) => {
            const { addItem } = useDataStore.getState();
            addItem('icps', { ...data, isActive: true } as Omit<ICP, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>);
          }}
          onUpdate={(id, data) => {
            updateItem('icps', id, data);
          }}
          onDelete={(id) => {
            deleteItem('icps', id);
          }}
        />
      ) : (
        <>
          {icps.length === 0 ? (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No ICPs Available</h3>
              <p className="text-slate-400 mb-4">
                Create at least one Ideal Customer Profile before adding Personas.
              </p>
              <Button onClick={() => setActiveTab('icps')}>
                <Plus className="w-4 h-4 mr-2" />
                Create ICP First
              </Button>
            </div>
          ) : (
            <ModulePage
              moduleId="icp-personas"
              columns={personaColumns}
              fields={personaFormFields}
              data={personas}
              onCreate={(data) => {
                const { addItem } = useDataStore.getState();
                addItem('personas', data as Omit<Persona, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>);
              }}
              onUpdate={(id, data) => {
                updateItem('personas', id, data);
              }}
              onDelete={(id) => {
                deleteItem('personas', id);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
