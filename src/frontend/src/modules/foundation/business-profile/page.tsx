/**
 * Business Profile Module
 *
 * Company information, mission, vision, social profiles, and branding basics.
 * One-to-one relationship with Company - each company has exactly one business profile.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Calendar, Users, DollarSign, Globe, Save, Edit2, Loader2, Target, Package, TrendingUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { businessProfileApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import type { BusinessProfile, BusinessStage, Industry } from '@/types/entities';

// ============================================
// FORM SECTION COMPONENT
// ============================================

function FormSection({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-[#C8FF2E]" />}
        <h3 className="text-sm font-semibold text-[#C8FF2E] uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-4 pl-6 border-l border-white/10">{children}</div>
    </div>
  );
}

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
    <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#C8FF2E]" />
        </div>
        <div>
          <p className="text-xs text-[#686f7e] uppercase tracking-wide">{label}</p>
          <p className="font-semibold text-white truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BUSINESS PROFILE FORM
// ============================================

function BusinessProfileForm({
  profile,
  onSave,
  onCancel,
  isCreating = false,
}: {
  profile?: BusinessProfile | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  isCreating?: boolean;
}) {
  const [formData, setFormData] = useState<Partial<BusinessProfile>>({
    // A. Basic Info
    name: profile?.name || '',
    startDate: profile?.startDate || '',
    stage: profile?.stage || 'idea',
    teamSize: profile?.teamSize || undefined,

    // B. Overview
    description: profile?.description || '',
    descriptionLong: profile?.descriptionLong || '',
    mission: profile?.mission || '',
    vision: profile?.vision || '',
    usp: profile?.usp || '',
    coreValues: profile?.coreValues || '',

    // C. Market
    primaryIndustry: profile?.primaryIndustry || '',
    secondaryIndustries: profile?.secondaryIndustries || '',
    targetGeography: profile?.targetGeography || '',
    businessModel: profile?.businessModel || 'b2b',

    // D. Offer Layer
    primaryOffering: profile?.primaryOffering || '',
    secondaryOfferings: profile?.secondaryOfferings || '',
    pricingModel: profile?.pricingModel || '',
    averageTicketSize: profile?.averageTicketSize || '',

    // E. Financial
    funding: profile?.funding || '',
    revenue: profile?.revenue || '',
    isRevenuePublic: profile?.isRevenuePublic || false,

    // F. Contact
    email: profile?.email || '',
    phone: profile?.phone || '',
    website: profile?.website || '',

    // G. Location
    address: profile?.address || '',
    city: profile?.city || '',
    country: profile?.country || '',

    // Legacy fields
    industries: profile?.industries || [],
    isFounderPublic: profile?.isFounderPublic ?? true,
    socialProfiles: profile?.socialProfiles || {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: keyof BusinessProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  const stages: { value: BusinessStage; label: string }[] = [
    { value: 'idea', label: 'Idea' },
    { value: 'mvp', label: 'Startup (MVP)' },
    { value: 'early', label: 'Early Stage' },
    { value: 'growth', label: 'Growth' },
    { value: 'scale', label: 'Scale' },
    { value: 'established', label: 'Established' },
  ];

  const industries: { value: Industry; label: string }[] = [
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
  ];

  const businessModels = [
    { value: 'b2b', label: 'B2B (Business to Business)' },
    { value: 'b2c', label: 'B2C (Business to Consumer)' },
    { value: 'b2b2c', label: 'B2B2C (Business to Business to Consumer)' },
    { value: 'saas', label: 'SaaS (Software as a Service)' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'd2c', label: 'D2C (Direct to Consumer)' },
    { value: 'freemium', label: 'Freemium' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const pricingModels = [
    { value: 'one-time', label: 'One-time Purchase' },
    { value: 'subscription', label: 'Subscription / Recurring' },
    { value: 'freemium', label: 'Freemium' },
    { value: 'usage-based', label: 'Usage Based / Pay-as-you-go' },
    { value: 'tiered', label: 'Tiered Pricing' },
    { value: 'custom-quote', label: 'Custom Quote / Enterprise' },
    { value: 'commission', label: 'Commission / Revenue Share' },
    { value: 'hybrid', label: 'Hybrid Model' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* A. Basic Info */}
      <FormSection title="A. Basic Info" icon={Building2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">
              Business Name <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter business name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Start Date</label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">
              Stage <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.stage}
              onChange={(e) => handleChange('stage', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white focus:outline-none focus:border-[#C8FF2E]/50"
              required
            >
              {stages.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Team Size</label>
            <Input
              type="number"
              value={formData.teamSize || ''}
              onChange={(e) => handleChange('teamSize', parseInt(e.target.value) || undefined)}
              placeholder="Number of employees"
            />
          </div>
        </div>
      </FormSection>

      {/* B. Overview */}
      <FormSection title="B. Overview" icon={Target}>
        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Description (Short)</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="One-line description of your business..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white placeholder:text-[#686f7e] focus:outline-none focus:border-[#C8FF2E]/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Description (Long)</label>
          <textarea
            value={formData.descriptionLong}
            onChange={(e) => handleChange('descriptionLong', e.target.value)}
            placeholder="Detailed description of your business..."
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white placeholder:text-[#686f7e] focus:outline-none focus:border-[#C8FF2E]/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">
            Mission <span className="text-[#686f7e] text-xs">(Why do you exist?)</span>
          </label>
          <textarea
            value={formData.mission}
            onChange={(e) => handleChange('mission', e.target.value)}
            placeholder="Your mission statement..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white placeholder:text-[#686f7e] focus:outline-none focus:border-[#C8FF2E]/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">
            Vision <span className="text-[#686f7e] text-xs">(Where are you headed?)</span>
          </label>
          <textarea
            value={formData.vision}
            onChange={(e) => handleChange('vision', e.target.value)}
            placeholder="Your vision statement..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white placeholder:text-[#686f7e] focus:outline-none focus:border-[#C8FF2E]/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">
            USP <span className="text-[#686f7e] text-xs">(Unique Selling Proposition)</span>
          </label>
          <textarea
            value={formData.usp}
            onChange={(e) => handleChange('usp', e.target.value)}
            placeholder="What makes you different? Why should customers choose you?"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white placeholder:text-[#686f7e] focus:outline-none focus:border-[#C8FF2E]/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Core Values</label>
          <textarea
            value={formData.coreValues}
            onChange={(e) => handleChange('coreValues', e.target.value)}
            placeholder="e.g., Innovation, Integrity, Customer First, Transparency..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white placeholder:text-[#686f7e] focus:outline-none focus:border-[#C8FF2E]/50 resize-y"
          />
        </div>
      </FormSection>

      {/* C. Market */}
      <FormSection title="C. Market" icon={TrendingUp}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Primary Industry</label>
            <select
              value={formData.primaryIndustry}
              onChange={(e) => handleChange('primaryIndustry', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white focus:outline-none focus:border-[#C8FF2E]/50"
            >
              <option value="">Select primary industry</option>
              {industries.map((ind) => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Target Geography</label>
            <Input
              type="text"
              value={formData.targetGeography}
              onChange={(e) => handleChange('targetGeography', e.target.value)}
              placeholder="e.g., Global, North America, APAC..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Secondary Industries</label>
          <Input
            type="text"
            value={formData.secondaryIndustries}
            onChange={(e) => handleChange('secondaryIndustries', e.target.value)}
            placeholder="e.g., Healthcare, Fintech, Education..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Business Model</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {businessModels.map((model) => (
              <button
                key={model.value}
                type="button"
                onClick={() => handleChange('businessModel', model.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors border text-left ${
                  formData.businessModel === model.value
                    ? 'bg-[#C8FF2E]/10 text-[#C8FF2E] border-[#C8FF2E]/30'
                    : 'bg-[#1a1d21] text-[#afb6c4] border-white/10 hover:border-[#C8FF2E]/30'
                }`}
              >
                {model.label}
              </button>
            ))}
          </div>
        </div>
      </FormSection>

      {/* D. Offer Layer */}
      <FormSection title="D. Offer Layer" icon={Package}>
        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">
            Primary Offering <span className="text-[#686f7e] text-xs">(What do you sell?)</span>
          </label>
          <textarea
            value={formData.primaryOffering}
            onChange={(e) => handleChange('primaryOffering', e.target.value)}
            placeholder="Describe your main product/service..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white placeholder:text-[#686f7e] focus:outline-none focus:border-[#C8FF2E]/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Secondary Offerings</label>
          <textarea
            value={formData.secondaryOfferings}
            onChange={(e) => handleChange('secondaryOfferings', e.target.value)}
            placeholder="Additional products, services, add-ons..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white placeholder:text-[#686f7e] focus:outline-none focus:border-[#C8FF2E]/50 resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Pricing Model</label>
            <select
              value={formData.pricingModel}
              onChange={(e) => handleChange('pricingModel', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white focus:outline-none focus:border-[#C8FF2E]/50"
            >
              <option value="">Select pricing model</option>
              {pricingModels.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Average Ticket Size</label>
            <Input
              type="text"
              value={formData.averageTicketSize}
              onChange={(e) => handleChange('averageTicketSize', e.target.value)}
              placeholder="e.g., $50, $500, $5,000..."
            />
          </div>
        </div>
      </FormSection>

      {/* E. Financial */}
      <FormSection title="E. Financial" icon={DollarSign}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Funding Stage</label>
            <Input
              type="text"
              value={formData.funding}
              onChange={(e) => handleChange('funding', e.target.value)}
              placeholder="e.g., Bootstrapped, Seed, Series A, Profitable..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Revenue Range</label>
            <Input
              type="text"
              value={formData.revenue}
              onChange={(e) => handleChange('revenue', e.target.value)}
              placeholder="e.g., $0-1M, $1M-5M, $5M-10M..."
            />
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isRevenuePublic}
              onChange={(e) => handleChange('isRevenuePublic', e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-[#1a1d21] text-[#C8FF2E] focus:ring-[#C8FF2E]/20"
            />
            <span className="text-sm text-[#afb6c4]">Make Revenue Public</span>
          </label>
        </div>
      </FormSection>

      {/* F. Contact */}
      <FormSection title="F. Contact" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Business Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contact@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Phone</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Website</label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://www.company.com"
          />
        </div>
      </FormSection>

      {/* G. Location */}
      <FormSection title="G. Location" icon={MapPin}>
        <div>
          <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Address</label>
          <Input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Street address"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">City</label>
            <Input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#afb6c4] mb-1.5">Country</label>
            <Input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="Country"
            />
          </div>
        </div>
      </FormSection>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
        {!isCreating && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? 'Create Profile' : 'Save Changes'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// ============================================
// VIEW SECTION COMPONENT
// ============================================

function ViewSection({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-white/10">
        {Icon && <Icon className="w-4 h-4 text-[#C8FF2E]" />}
        <h3 className="text-sm font-semibold text-[#C8FF2E] uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ViewField({ label, value, fullWidth = false }: { label: string; value?: string | React.ReactNode; fullWidth?: boolean }) {
  if (!value) return null;
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <h4 className="text-xs font-medium text-[#686f7e] uppercase tracking-wide mb-1">{label}</h4>
      <div className="text-white">{value}</div>
    </div>
  );
}

// ============================================
// BUSINESS PROFILE VIEW
// ============================================

function BusinessProfileView({
  profile,
  onEdit,
}: {
  profile: BusinessProfile;
  onEdit: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#C8FF2E] to-[#a3e635] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C8FF2E]/20">
            <Building2 className="w-8 h-8 text-[#0d1117]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <p className="text-[#878e9a]">
              <span className="capitalize">{profile.stage}</span> Stage
              {profile.primaryIndustry && <span> • {profile.primaryIndustry}</span>}
              {profile.businessModel && <span className="uppercase"> • {profile.businessModel}</span>}
            </p>
          </div>
        </div>
        <Button onClick={onEdit}>
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Founded" value={profile.startDate || 'Not set'} />
        <StatCard icon={Users} label="Team Size" value={profile.teamSize?.toString() || 'Not set'} />
        <StatCard icon={DollarSign} label="Revenue" value={profile.revenue || 'Not set'} />
        <StatCard icon={Globe} label="Website" value={profile.website ? 'Linked' : 'Not set'} />
      </div>

      {/* Profile Details Container */}
      <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-6 space-y-8">

        {/* A. Basic Info */}
        <ViewSection title="A. Basic Info" icon={Building2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ViewField label="Business Name" value={profile.name} />
            <ViewField label="Start Date" value={profile.startDate} />
            <ViewField label="Stage" value={profile.stage && <span className="capitalize">{profile.stage}</span>} />
            <ViewField label="Team Size" value={profile.teamSize?.toString()} />
          </div>
        </ViewSection>

        {/* B. Overview */}
        {(profile.description || profile.descriptionLong || profile.mission || profile.vision || profile.usp || profile.coreValues) && (
          <ViewSection title="B. Overview" icon={Target}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField label="Description (Short)" value={profile.description} fullWidth />
              <ViewField label="Description (Long)" value={profile.descriptionLong} fullWidth />
              <ViewField label="Mission" value={profile.mission} />
              <ViewField label="Vision" value={profile.vision} />
              <ViewField label="USP (Unique Selling Proposition)" value={profile.usp} fullWidth />
              <ViewField label="Core Values" value={profile.coreValues} fullWidth />
            </div>
          </ViewSection>
        )}

        {/* C. Market */}
        {(profile.primaryIndustry || profile.secondaryIndustries || profile.targetGeography || profile.businessModel) && (
          <ViewSection title="C. Market" icon={TrendingUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField label="Primary Industry" value={profile.primaryIndustry} />
              <ViewField label="Secondary Industries" value={profile.secondaryIndustries} />
              <ViewField label="Target Geography" value={profile.targetGeography} />
              <ViewField
                label="Business Model"
                value={profile.businessModel && <span className="uppercase">{profile.businessModel}</span>}
              />
            </div>
          </ViewSection>
        )}

        {/* D. Offer Layer */}
        {(profile.primaryOffering || profile.secondaryOfferings || profile.pricingModel || profile.averageTicketSize) && (
          <ViewSection title="D. Offer Layer" icon={Package}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField label="Primary Offering" value={profile.primaryOffering} fullWidth />
              <ViewField label="Secondary Offerings" value={profile.secondaryOfferings} fullWidth />
              <ViewField label="Pricing Model" value={profile.pricingModel} />
              <ViewField label="Average Ticket Size" value={profile.averageTicketSize} />
            </div>
          </ViewSection>
        )}

        {/* E. Financial */}
        {(profile.funding || profile.revenue || profile.isRevenuePublic !== undefined) && (
          <ViewSection title="E. Financial" icon={DollarSign}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField label="Funding Stage" value={profile.funding} />
              <ViewField label="Revenue Range" value={profile.revenue} />
              <ViewField
                label="Revenue Visibility"
                value={profile.isRevenuePublic ? 'Public' : 'Private'}
              />
            </div>
          </ViewSection>
        )}

        {/* F. Contact */}
        {(profile.email || profile.phone || profile.website) && (
          <ViewSection title="F. Contact" icon={Globe}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField label="Business Email" value={profile.email} />
              <ViewField label="Phone" value={profile.phone} />
              <ViewField
                label="Website"
                value={profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[#C8FF2E] hover:text-[#d4ff5c] hover:underline">
                    {profile.website}
                  </a>
                )}
                fullWidth
              />
            </div>
          </ViewSection>
        )}

        {/* G. Location */}
        {(profile.address || profile.city || profile.country) && (
          <ViewSection title="G. Location" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField label="Address" value={profile.address} fullWidth />
              <ViewField label="City" value={profile.city} />
              <ViewField label="Country" value={profile.country} />
            </div>
          </ViewSection>
        )}

        {/* Legacy Fields (if present) */}
        {(profile.industries?.length > 0 || profile.isFounderPublic !== undefined) && (
          <ViewSection title="Additional Info" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.industries?.length > 0 && (
                <div className="md:col-span-2">
                  <h4 className="text-xs font-medium text-[#686f7e] uppercase tracking-wide mb-2">Legacy Industries</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.industries.map((industry) => (
                      <span key={industry} className="px-2 py-1 bg-[#C8FF2E]/10 text-[#C8FF2E] text-sm rounded-full border border-[#C8FF2E]/30">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <ViewField label="Founder Public Visibility" value={profile.isFounderPublic ? 'Yes' : 'No'} />
            </div>
          </ViewSection>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function BusinessProfilePage() {
  const { user } = useAuthStore();
  const { activeCompanyId: storeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile from API
  useEffect(() => {
    if (!companyId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await businessProfileApi.getByCompany(companyId);
        if (response.data && (response.data as BusinessProfile).id) {
          setProfile(response.data as BusinessProfile);
        } else {
          setProfile(null);
        }
      } catch (err) {
        setError('Failed to load business profile');
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [companyId]);

  const handleCreate = async (data: Partial<BusinessProfile>) => {
    if (!companyId) return;

    const response = await businessProfileApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setProfile(response.data as BusinessProfile);
      setIsEditing(false);
    } else if (response.error) {
      setError(response.error);
    }
  };

  const handleUpdate = async (data: Partial<BusinessProfile>) => {
    if (!profile?.id) return;

    const response = await businessProfileApi.update(profile.id, data);
    if (response.data) {
      setProfile(response.data as BusinessProfile);
      setIsEditing(false);
    } else if (response.error) {
      setError(response.error);
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#878e9a]">Please select a company to view business profile.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8FF2E]" />
      </div>
    );
  }

  // If no profile exists, show create form
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#C8FF2E] to-[#a3e635] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C8FF2E]/20">
            <Building2 className="w-8 h-8 text-[#0d1117]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Business Profile</h1>
            <p className="text-[#878e9a]">Create your company&apos;s business profile to get started</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Create Form */}
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <BusinessProfileForm onSave={handleCreate} onCancel={() => {}} isCreating />
        </div>
      </div>
    );
  }

  // Show view or edit mode
  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {isEditing ? (
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#C8FF2E] to-[#a3e635] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#0d1117]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Business Profile</h1>
              <p className="text-[#878e9a]">Update your company&apos;s information</p>
            </div>
          </div>
          <BusinessProfileForm
            profile={profile}
            onSave={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <BusinessProfileView profile={profile} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
