/**
 * Business Profile Module
 *
 * Company information, mission, vision, social profiles, and branding basics.
 */

'use client';

import React from 'react';
import { Building2, Calendar, Users, DollarSign, Globe } from 'lucide-react';
import { ModulePage } from '@/components/shared';
import { UniversalForm, FormField } from '@/components/shared/UniversalForm';
import { useDataStore } from '@/stores';
import type { BusinessProfile, Industry, BusinessStage } from '@/types/entities';
import { cn } from '@/utils/cn';

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  // Basic Info
  { key: 'name', label: 'Business Name', type: 'text', required: true },
  { key: 'startDate', label: 'Start Date', type: 'date' },
  {
    key: 'stage',
    label: 'Business Stage',
    type: 'select',
    options: [
      { value: 'idea', label: 'Idea' },
      { value: 'mvp', label: 'MVP' },
      { value: 'early', label: 'Early Stage' },
      { value: 'growth', label: 'Growth' },
      { value: 'scale', label: 'Scale' },
      { value: 'established', label: 'Established' },
    ],
  },
  {
    key: 'industries',
    label: 'Industries',
    type: 'multiselect',
    options: [
      { value: 'technology', label: 'Technology' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'finance', label: 'Finance' },
      { value: 'education', label: 'Education' },
      { value: 'ecommerce', label: 'E-commerce' },
      { value: 'saas', label: 'SaaS' },
      { value: 'consulting', label: 'Consulting' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'retail', label: 'Retail' },
      { value: 'real-estate', label: 'Real Estate' },
      { value: 'hospitality', label: 'Hospitality' },
      { value: 'media', label: 'Media' },
      { value: 'non-profit', label: 'Non-Profit' },
      { value: 'legal', label: 'Legal' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'design', label: 'Design' },
      { value: 'food-beverage', label: 'Food & Beverage' },
      { value: 'sports', label: 'Sports' },
      { value: 'other', label: 'Other' },
    ],
  },

  // Business Details
  {
    key: 'usp',
    label: 'Unique Selling Proposition (USP)',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'description',
    label: 'Business Description',
    type: 'textarea',
    rows: 4,
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'mission',
    label: 'Mission Statement',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'vision',
    label: 'Vision Statement',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'coreValues',
    label: 'Core Values',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
  },

  // Financial
  { key: 'funding', label: 'Funding Stage', type: 'text' },
  { key: 'revenue', label: 'Revenue Range', type: 'text' },
  { key: 'teamSize', label: 'Team Size', type: 'number' },
  {
    key: 'isRevenuePublic',
    label: 'Make Revenue Public',
    type: 'toggle',
  },
  {
    key: 'isFounderPublic',
    label: 'Make Founders Public',
    type: 'toggle',
  },

  // Contact
  { key: 'email', label: 'Business Email', type: 'email' },
  { key: 'phone', label: 'Phone Number', type: 'tel' },
  { key: 'website', label: 'Website', type: 'url' },

  // Location
  { key: 'address', label: 'Address', type: 'text', colSpan: 2 },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'country', label: 'Country', type: 'text' },

  // Social Profiles
  {
    key: 'socialProfiles',
    label: 'Social Profiles',
    type: 'social-grid',
    colSpan: 2,
  },
];

// ============================================
// BUSINESS PROFILE PAGE
// ============================================

export default function BusinessProfilePage() {
  const { getItems, setItems } = useDataStore();
  const profiles = getItems('businessProfiles') as BusinessProfile[];

  const handleSubmit = (data: Record<string, unknown>) => {
    if (profiles.length > 0) {
      // Update existing
      const updated = profiles.map((p) =>
        p.id === profiles[0].id
          ? { ...p, ...data, updatedAt: new Date().toISOString() }
          : p
      );
      setItems('businessProfiles', updated);
    } else {
      // Create new
      const { addItem } = useDataStore.getState();
      addItem('businessProfiles', data as Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>);
    }
  };

  const profile = profiles[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Business Profile</h1>
          <p className="text-neutral-500">
            Define your company's identity, mission, and online presence
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      {profile && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Calendar}
            label="Founded"
            value={profile.startDate || 'Not set'}
          />
          <StatCard
            icon={Users}
            label="Team Size"
            value={profile.teamSize?.toString() || 'Not set'}
          />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={profile.revenue || 'Not set'}
          />
          <StatCard
            icon={Globe}
            label="Website"
            value={profile.website ? 'Linked' : 'Not set'}
          />
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <UniversalForm
          fields={formFields}
          initialData={(profile || {}) as unknown as Record<string, unknown>}
          onSubmit={handleSubmit}
          submitLabel={profile ? 'Update Profile' : 'Create Profile'}
        />
      </div>
    </div>
  );
}

// ============================================
// STAT CARD
// ============================================

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="font-semibold text-neutral-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
