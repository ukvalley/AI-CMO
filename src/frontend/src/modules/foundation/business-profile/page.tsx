/**
 * Business Profile Module
 *
 * Company information, mission, vision, social profiles, and branding basics.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Calendar, Users, DollarSign, Globe } from 'lucide-react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { Button } from '@/components/ui/Button';
import { businessProfileApi } from '@/services/api';
import { useAuthStore } from '@/stores';
import type { BusinessProfile } from '@/types/entities';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<BusinessProfile>[] = [
  { key: 'name', header: 'Business Name', sortable: true },
  { key: 'stage', header: 'Stage', sortable: true },
  {
    key: 'industries',
    header: 'Industries',
    render: (value) => {
      const industries = value as string[];
      return industries?.length > 0 ? industries.join(', ') : '-';
    },
  },
  { key: 'city', header: 'City' },
  { key: 'country', header: 'Country' },
  {
    key: 'teamSize',
    header: 'Team Size',
    sortable: true,
    align: 'right',
  },
];

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
// STAT CARD COMPONENT
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
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="font-semibold text-slate-200">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DETAIL VIEW
// ============================================

function BusinessProfileDetail({
  profile,
  onBack,
}: {
  profile: BusinessProfile;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-400 hover:text-slate-200">
        ← Back to Profile
      </Button>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Founded" value={profile.startDate || 'Not set'} />
        <StatCard icon={Users} label="Team Size" value={profile.teamSize?.toString() || 'Not set'} />
        <StatCard icon={DollarSign} label="Revenue" value={profile.revenue || 'Not set'} />
        <StatCard icon={Globe} label="Website" value={profile.website ? 'Linked' : 'Not set'} />
      </div>

      {/* Profile Details */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-700">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-slate-400 capitalize">{profile.stage} Stage</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.description && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Description</h3>
              <p className="text-slate-200">{profile.description}</p>
            </div>
          )}
          {profile.mission && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Mission</h3>
              <p className="text-slate-200">{profile.mission}</p>
            </div>
          )}
          {profile.vision && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Vision</h3>
              <p className="text-slate-200">{profile.vision}</p>
            </div>
          )}
          {profile.usp && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Unique Selling Proposition</h3>
              <p className="text-slate-200">{profile.usp}</p>
            </div>
          )}
          {profile.coreValues && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Core Values</h3>
              <p className="text-slate-200">{profile.coreValues}</p>
            </div>
          )}
          {profile.industries && profile.industries.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Industries</h3>
              <div className="flex flex-wrap gap-2">
                {profile.industries.map((industry) => (
                  <span
                    key={industry}
                    className="px-2 py-1 bg-primary-500/10 text-primary-400 text-sm rounded-full border border-primary-500/30"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(profile.city || profile.country) && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Location</h3>
              <p className="text-slate-200">
                {profile.city}
                {profile.city && profile.country ? ', ' : ''}
                {profile.country}
              </p>
            </div>
          )}
          {profile.email && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Email</h3>
              <p className="text-slate-200">{profile.email}</p>
            </div>
          )}
          {profile.phone && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Phone</h3>
              <p className="text-slate-200">{profile.phone}</p>
            </div>
          )}
          {profile.website && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Website</h3>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300"
              >
                {profile.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// BUSINESS PROFILE PAGE
// ============================================

export default function BusinessProfilePage() {
  const { user } = useAuthStore();
  const companyId = user?.activeCompanyId;

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from API
  useEffect(() => {
    if (!companyId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      const response = await businessProfileApi.getByCompany(companyId);
      if (response.data) {
        setProfile(response.data);
      }
      setIsLoading(false);
    };

    loadProfile();
  }, [companyId]);

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const response = await businessProfileApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setProfile(response.data as BusinessProfile);
    }
  };

  const handleUpdate = async (id: string, data: Partial<BusinessProfile>) => {
    const response = await businessProfileApi.update(id, data);
    if (response.data) {
      setProfile(response.data as BusinessProfile);
    }
  };

  const handleDelete = async (id: string) => {
    const response = await businessProfileApi.delete(id);
    if (!response.error) {
      setProfile(null);
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Please select a company to view business profile.</p>
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

  // If no profile exists, show create form
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Business Profile</h1>
            <p className="text-slate-400">Define your company's identity, mission, and online presence</p>
          </div>
        </div>

        {/* Create Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-6">Create your business profile to get started.</p>
          <ModulePage
            moduleId="business-profile"
            columns={columns}
            fields={formFields}
            data={[]}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      </div>
    );
  }

  // Show ModulePage with the profile
  return (
    <div className="max-w-4xl mx-auto">
      <ModulePage
        moduleId="business-profile"
        columns={columns}
        fields={formFields}
        data={profile ? [profile] : []}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        detailView={(item, onBack) => <BusinessProfileDetail profile={item} onBack={onBack} />}
      />
    </div>
  );
}
