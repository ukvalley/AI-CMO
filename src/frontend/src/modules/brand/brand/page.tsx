/**
 * Brand Module
 *
 * Brand identity and visual guidelines for the company.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { brandApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import type { Brand } from '@/types/entities';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<Brand>[] = [
  {
    key: 'tagline',
    header: 'Tagline',
    sortable: true,
    render: (value) => value || 'No tagline set',
  },
  {
    key: 'primaryColor',
    header: 'Primary Color',
    render: (value) => (
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded border border-slate-600"
          style={{ backgroundColor: value as string }}
        />
        <span className="text-slate-400 text-sm">{value as string}</span>
      </div>
    ),
  },
  {
    key: 'personality',
    header: 'Personality',
    render: (value) => {
      if (!value) return <span className="text-slate-500">Not defined</span>;
      const personalities = Array.isArray(value) ? value : [value];
      return (
        <div className="flex flex-wrap gap-1">
          {personalities.slice(0, 3).map((p) => (
            <span key={p} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">
              {p}
            </span>
          ))}
          {personalities.length > 3 && (
            <span className="text-slate-500 text-xs">+{personalities.length - 3}</span>
          )}
        </div>
      );
    },
  },
  {
    key: 'voice',
    header: 'Voice',
    render: (value) => value || <span className="text-slate-500">Not defined</span>,
  },
];

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  {
    key: 'section-visual',
    label: 'Visual Identity',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'primaryColor',
    label: 'Primary Color',
    type: 'color',
    required: true,
    helperText: 'Main brand color used for primary actions and highlights',
  },
  {
    key: 'secondaryColor',
    label: 'Secondary Color',
    type: 'color',
    helperText: 'Supporting color for backgrounds and secondary elements',
  },
  {
    key: 'accentColor',
    label: 'Accent Color',
    type: 'color',
    helperText: 'Accent color for special highlights and CTAs',
  },
  {
    key: 'headingFont',
    label: 'Heading Font',
    type: 'select',
    options: [
      { value: 'inter', label: 'Inter' },
      { value: 'roboto', label: 'Roboto' },
      { value: 'montserrat', label: 'Montserrat' },
      { value: 'playfair', label: 'Playfair Display' },
      { value: 'poppins', label: 'Poppins' },
      { value: 'open-sans', label: 'Open Sans' },
      { value: 'lato', label: 'Lato' },
    ],
  },
  {
    key: 'bodyFont',
    label: 'Body Font',
    type: 'select',
    options: [
      { value: 'inter', label: 'Inter' },
      { value: 'roboto', label: 'Roboto' },
      { value: 'open-sans', label: 'Open Sans' },
      { value: 'lato', label: 'Lato' },
      { value: 'source-sans', label: 'Source Sans Pro' },
    ],
  },
  {
    key: 'section-identity',
    label: 'Brand Identity',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'tagline',
    label: 'Brand Tagline',
    type: 'text',
    placeholder: 'Your company tagline...',
    helperText: 'A short, memorable phrase that captures your brand essence',
  },
  {
    key: 'personality',
    label: 'Brand Personality',
    type: 'multiselect',
    options: [
      { value: 'professional', label: 'Professional' },
      { value: 'friendly', label: 'Friendly' },
      { value: 'innovative', label: 'Innovative' },
      { value: 'trustworthy', label: 'Trustworthy' },
      { value: 'bold', label: 'Bold' },
      { value: 'playful', label: 'Playful' },
      { value: 'sophisticated', label: 'Sophisticated' },
      { value: 'approachable', label: 'Approachable' },
      { value: 'authoritative', label: 'Authoritative' },
      { value: 'creative', label: 'Creative' },
    ],
    helperText: 'Select 3-5 traits that describe your brand personality',
  },
  {
    key: 'voice',
    label: 'Brand Voice',
    type: 'select',
    options: [
      { value: 'professional', label: 'Professional & Corporate' },
      { value: 'conversational', label: 'Conversational & Friendly' },
      { value: 'playful', label: 'Playful & Casual' },
      { value: 'technical', label: 'Technical & Precise' },
      { value: 'inspirational', label: 'Inspirational & Motivational' },
      { value: 'authoritative', label: 'Authoritative & Expert' },
    ],
    helperText: 'How your brand communicates with its audience',
  },
  {
    key: 'section-messaging',
    label: 'Brand Messaging',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'purposeWhyExists',
    label: 'Why We Exist',
    type: 'textarea',
    rows: 3,
    placeholder: 'The fundamental reason your company exists...',
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'brandPromise',
    label: 'Brand Promise',
    type: 'textarea',
    rows: 2,
    placeholder: 'What you promise to deliver to customers...',
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'emotionalBenefit',
    label: 'Emotional Benefit',
    type: 'textarea',
    rows: 2,
    placeholder: 'How customers feel when using your product...',
    aiGenerate: true,
    colSpan: 2,
  },
];

// ============================================
// BRAND PAGE
// ============================================

export default function BrandPage() {
  const { user } = useAuthStore();
  const { activeCompanyId: storeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [brand, setBrand] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (!companyId) {
      setBrand([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await brandApi.getByCompany(companyId);
        if (response.data) {
          setBrand([response.data as Brand]);
        } else {
          // If no brand exists, create default
          const createResponse = await brandApi.create({
            companyId,
            primaryColor: '#7C6BF0',
            secondaryColor: '#1E293B',
            accentColor: '#22D3EE',
            headingFont: 'inter',
            bodyFont: 'inter',
          });
          if (createResponse.data) {
            setBrand([createResponse.data as Brand]);
          }
        }
      } catch (error) {
        console.error('Failed to load brand:', error);
      }
      setIsLoading(false);
    };

    loadData();
  }, [companyId]);

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const response = await brandApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setBrand([response.data as Brand]);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Brand>) => {
    const response = await brandApi.update(id, data);
    if (response.data) {
      setBrand([response.data as Brand]);
    }
  };

  const handleDelete = async (id: string) => {
    // Brand is singleton - don't allow delete, just reset to defaults
    const response = await brandApi.update(id, {
      primaryColor: '#7C6BF0',
      secondaryColor: '#1E293B',
      accentColor: '#22D3EE',
      headingFont: 'inter',
      bodyFont: 'inter',
      tagline: '',
      voice: '',
      personality: [],
      purposeWhyExists: '',
      brandPromise: '',
      emotionalBenefit: '',
    });
    if (response.data) {
      setBrand([response.data as Brand]);
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Please select a company to view brand settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Brand Preview Card */}
      {brand.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Brand Preview</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Primary:</span>
              <div
                className="w-10 h-10 rounded-lg border border-slate-600"
                style={{ backgroundColor: brand[0]?.primaryColor }}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Secondary:</span>
              <div
                className="w-10 h-10 rounded-lg border border-slate-600"
                style={{ backgroundColor: brand[0]?.secondaryColor }}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Accent:</span>
              <div
                className="w-10 h-10 rounded-lg border border-slate-600"
                style={{ backgroundColor: brand[0]?.accentColor }}
              />
            </div>
          </div>
          {brand[0]?.tagline && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <span className="text-sm text-slate-400">Tagline:</span>
              <p className="text-slate-200 mt-1">{brand[0].tagline}</p>
            </div>
          )}
        </div>
      )}

      <ModulePage
        moduleId="brand"
        columns={columns}
        fields={formFields}
        data={brand}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
