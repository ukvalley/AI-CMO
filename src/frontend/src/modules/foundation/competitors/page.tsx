/**
 * Competitors Module - Comprehensive Competitive Intelligence Framework
 *
 * Complete competitor analysis with market positioning, SWOT, and strategic insights.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { competitorApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import type { Competitor, ThreatLevel, MarketPosition, CompetitorType, PricingStrategy } from '@/types/entities';
import { Globe, ShieldAlert, ShieldCheck, ShieldQuestion, Target, Users, Building2, TrendingUp, AlertTriangle, Award, DollarSign } from 'lucide-react';

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
    key: 'logoUrl',
    header: 'Logo',
    render: (value) => {
      if (!value) return (
        <div className="w-10 h-10 bg-[#21262d] rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-[#686f7e]" />
        </div>
      );
      return (
        <img
          src={value as string}
          alt="Logo"
          className="w-10 h-10 object-contain rounded-lg bg-white p-1"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      );
    },
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
          className="text-[#C8FF2E] hover:text-[#d4ff5c] flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Globe className="w-3 h-3" />
          <span className="truncate max-w-[120px]">{(value as string).replace(/^https?:\/\//, '')}</span>
        </a>
      );
    },
  },
  {
    key: 'competitorType',
    header: 'Type',
    sortable: true,
    filterable: true,
    filterOptions: [
      { value: 'direct', label: 'Direct' },
      { value: 'indirect', label: 'Indirect' },
      { value: 'potential', label: 'Potential' },
      { value: 'replacement', label: 'Replacement' },
    ],
    render: (value) => {
      const labels: Record<string, { text: string; color: string }> = {
        direct: { text: 'Direct', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
        indirect: { text: 'Indirect', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
        potential: { text: 'Potential', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
        replacement: { text: 'Replacement', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      };
      const { text, color } = labels[value as string] || labels.direct;
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${color}`}>
          {text}
        </span>
      );
    },
  },
  {
    key: 'threatLevel',
    header: 'Threat',
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
        critical: { color: 'bg-red-500/20 text-red-400 border-red-500/50', icon: <AlertTriangle className="w-3 h-3" />, label: 'Critical' },
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
    key: 'marketPosition',
    header: 'Position',
    sortable: true,
    render: (value) => {
      const positions: Record<string, { text: string; icon: React.ReactNode }> = {
        leader: { text: 'Leader', icon: <Award className="w-3 h-3" /> },
        challenger: { text: 'Challenger', icon: <TrendingUp className="w-3 h-3" /> },
        follower: { text: 'Follower', icon: <Users className="w-3 h-3" /> },
        niche: { text: 'Niche', icon: <Target className="w-3 h-3" /> },
      };
      const { text, icon } = positions[value as string] || positions.follower;
      return (
        <span className="inline-flex items-center gap-1 text-[#afb6c4] text-sm">
          {icon}
          {text}
        </span>
      );
    },
  },
  {
    key: 'pricingStrategy',
    header: 'Pricing',
    render: (value) => {
      const strategies: Record<string, string> = {
        premium: 'Premium',
        competitive: 'Competitive',
        economy: 'Economy',
        freemium: 'Freemium',
        unknown: '-',
      };
      return (
        <span className="text-[#878e9a] text-sm">
          {strategies[value as string] || '-'}
        </span>
      );
    },
  },
];

// ============================================
// FORM FIELDS - Comprehensive Framework
// ============================================

const formFields: FormField[] = [
  // A. Basic Information
  {
    key: 'section-basic',
    label: 'A. Basic Information',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'name',
    label: 'Competitor Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Acme Corporation',
  },
  {
    key: 'isActive',
    label: 'Active Competitor',
    type: 'toggle',
    helperText: 'Toggle off if no longer a threat',
  },
  {
    key: 'website',
    label: 'Website',
    type: 'url',
    placeholder: 'https://competitor.com',
  },
  {
    key: 'logoUrl',
    label: 'Logo URL',
    type: 'url',
    placeholder: 'https://competitor.com/logo.png',
    helperText: 'Direct link to their logo',
  },
  {
    key: 'foundedYear',
    label: 'Founded Year',
    type: 'number',
    min: 1800,
    max: new Date().getFullYear(),
    placeholder: '2020',
  },
  {
    key: 'headquarters',
    label: 'Headquarters',
    type: 'text',
    placeholder: 'e.g., San Francisco, CA',
  },
  {
    key: 'companySize',
    label: 'Company Size',
    type: 'select',
    options: [
      { value: 'startup', label: 'Startup (1-10)' },
      { value: 'small', label: 'Small (11-50)' },
      { value: 'medium', label: 'Medium (51-200)' },
      { value: 'large', label: 'Large (201-1000)' },
      { value: 'enterprise', label: 'Enterprise (1000+)' },
    ],
  },
  {
    key: 'fundingStage',
    label: 'Funding Stage',
    type: 'select',
    options: [
      { value: 'bootstrapped', label: 'Bootstrapped' },
      { value: 'seed', label: 'Seed' },
      { value: 'series-a', label: 'Series A' },
      { value: 'series-b', label: 'Series B' },
      { value: 'series-c', label: 'Series C+' },
      { value: 'ipo', label: 'IPO/Public' },
      { value: 'acquired', label: 'Acquired' },
    ],
  },
  {
    key: 'fundingRaised',
    label: 'Funding Raised',
    type: 'text',
    placeholder: 'e.g., $10M Series A',
  },
  {
    key: 'employeeCount',
    label: 'Employee Count',
    type: 'number',
    min: 1,
    placeholder: 'e.g., 150',
  },
  {
    key: 'revenueEstimate',
    label: 'Revenue Estimate',
    type: 'text',
    placeholder: 'e.g., $5M - $10M ARR',
  },

  // B. Market Position
  {
    key: 'section-market',
    label: 'B. Market Position & Classification',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'competitorType',
    label: 'Competitor Type',
    type: 'select',
    required: true,
    options: [
      { value: 'direct', label: 'Direct - Same product, same market' },
      { value: 'indirect', label: 'Indirect - Different product, same market' },
      { value: 'potential', label: 'Potential - Could enter our market' },
      { value: 'replacement', label: 'Replacement - Solves same problem differently' },
    ],
  },
  {
    key: 'threatLevel',
    label: 'Threat Level',
    type: 'select',
    required: true,
    options: [
      { value: 'low', label: 'Low - Minimal overlap or impact' },
      { value: 'medium', label: 'Medium - Some competition' },
      { value: 'high', label: 'High - Direct competition' },
      { value: 'critical', label: 'Critical - Market leader or major threat' },
    ],
  },
  {
    key: 'marketPosition',
    label: 'Market Position',
    type: 'select',
    required: true,
    options: [
      { value: 'leader', label: 'Market Leader' },
      { value: 'challenger', label: 'Challenger' },
      { value: 'follower', label: 'Follower' },
      { value: 'niche', label: 'Niche Player' },
    ],
  },
  {
    key: 'marketShare',
    label: 'Market Share Estimate',
    type: 'text',
    placeholder: 'e.g., 15-20%',
  },
  {
    key: 'geographicReach',
    label: 'Geographic Reach',
    type: 'multiselect',
    options: [
      { value: 'north-america', label: 'North America' },
      { value: 'europe', label: 'Europe' },
      { value: 'asia-pacific', label: 'Asia Pacific' },
      { value: 'latin-america', label: 'Latin America' },
      { value: 'middle-east', label: 'Middle East' },
      { value: 'africa', label: 'Africa' },
      { value: 'global', label: 'Global' },
    ],
    colSpan: 2,
  },
  {
    key: 'targetAudience',
    label: 'Target Audience',
    type: 'textarea',
    rows: 2,
    placeholder: 'Who are they targeting?',
    colSpan: 2,
  },
  {
    key: 'industriesServed',
    label: 'Industries Served',
    type: 'tags',
    placeholder: 'Add industry...',
    colSpan: 2,
  },

  // C. Product Analysis
  {
    key: 'section-product',
    label: 'C. Product Analysis',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'primaryProduct',
    label: 'Primary Product/Offering',
    type: 'text',
    placeholder: 'e.g., CRM Software',
    colSpan: 2,
  },
  {
    key: 'productCategories',
    label: 'Product Categories',
    type: 'tags',
    placeholder: 'Add category...',
    colSpan: 2,
  },
  {
    key: 'keyFeatures',
    label: 'Key Features',
    type: 'tags',
    placeholder: 'Add feature...',
    colSpan: 2,
  },
  {
    key: 'pricingStrategy',
    label: 'Pricing Strategy',
    type: 'select',
    options: [
      { value: 'premium', label: 'Premium - Higher than market' },
      { value: 'competitive', label: 'Competitive - Market rate' },
      { value: 'economy', label: 'Economy - Lower than market' },
      { value: 'freemium', label: 'Freemium - Free tier available' },
      { value: 'unknown', label: 'Unknown/Not disclosed' },
    ],
  },
  {
    key: 'freeTrial',
    label: 'Free Trial Available',
    type: 'toggle',
  },
  {
    key: 'demoAvailable',
    label: 'Demo Available',
    type: 'toggle',
  },
  {
    key: 'pricingDetails',
    label: 'Pricing Details',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'Pricing tiers, plans, and comparison notes',
  },

  // D. Value Proposition
  {
    key: 'section-value',
    label: 'D. Value Proposition & Messaging',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'tagline',
    label: 'Tagline/Slogan',
    type: 'text',
    placeholder: 'e.g., "The future of work"',
    colSpan: 2,
  },
  {
    key: 'valueProposition',
    label: 'Value Proposition',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'What value do they promise to customers?',
  },
  {
    key: 'messaging',
    label: 'Key Messaging',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'Main themes and messages in their marketing',
  },
  {
    key: 'differentiators',
    label: 'Key Differentiators',
    type: 'tags',
    placeholder: 'Add differentiator...',
    colSpan: 2,
    helperText: 'What makes them unique compared to others',
  },

  // E. Marketing Intelligence
  {
    key: 'section-marketing',
    label: 'E. Marketing Intelligence',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'marketingChannels',
    label: 'Marketing Channels',
    type: 'multiselect',
    options: [
      { value: 'seo', label: 'SEO/Organic Search' },
      { value: 'ppc', label: 'PPC/Paid Ads' },
      { value: 'social', label: 'Social Media' },
      { value: 'content', label: 'Content Marketing' },
      { value: 'email', label: 'Email Marketing' },
      { value: 'events', label: 'Events/Webinars' },
      { value: 'partnerships', label: 'Partnerships' },
      { value: 'affiliate', label: 'Affiliate' },
      { value: 'pr', label: 'PR/Media' },
      { value: 'outbound', label: 'Outbound Sales' },
    ],
    colSpan: 2,
  },
  {
    key: 'contentStrategy',
    label: 'Content Strategy',
    type: 'textarea',
    rows: 3,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'What content do they produce? Blogs, videos, whitepapers?',
  },
  {
    key: 'seoKeywords',
    label: 'Target SEO Keywords',
    type: 'tags',
    placeholder: 'Add keyword...',
    colSpan: 2,
    helperText: 'Keywords they rank for or target',
  },
  {
    key: 'adSpendEstimate',
    label: 'Estimated Ad Spend',
    type: 'text',
    placeholder: 'e.g., $50K/month',
  },

  // F. SWOT Analysis
  {
    key: 'section-swot',
    label: 'F. SWOT Analysis',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'strengths',
    label: 'Their Strengths',
    type: 'tags',
    placeholder: 'Add strength...',
    colSpan: 2,
    helperText: 'What do they do well?',
  },
  {
    key: 'weaknesses',
    label: 'Their Weaknesses',
    type: 'tags',
    placeholder: 'Add weakness...',
    colSpan: 2,
    helperText: 'Where are they vulnerable?',
  },
  {
    key: 'opportunities',
    label: 'Opportunities for Them',
    type: 'tags',
    placeholder: 'Add opportunity...',
    colSpan: 2,
    helperText: 'What opportunities could they capitalize on?',
  },
  {
    key: 'threats',
    label: 'Threats to Them',
    type: 'tags',
    placeholder: 'Add threat...',
    colSpan: 2,
    helperText: 'External threats they face',
  },
  {
    key: 'swotSummary',
    label: 'SWOT Summary',
    type: 'textarea',
    rows: 5,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'Overall SWOT analysis and insights',
  },

  // G. Strategic Response
  {
    key: 'section-strategy',
    label: 'G. Our Strategic Response',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'ourAdvantages',
    label: 'Our Competitive Advantages',
    type: 'tags',
    placeholder: 'Add advantage...',
    colSpan: 2,
    helperText: 'Where do we beat them?',
  },
  {
    key: 'ourVulnerabilities',
    label: 'Our Vulnerabilities vs Them',
    type: 'tags',
    placeholder: 'Add vulnerability...',
    colSpan: 2,
    helperText: 'Where do they beat us?',
  },
  {
    key: 'recommendedStrategy',
    label: 'Recommended Strategy',
    type: 'textarea',
    rows: 5,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'How should we compete against them?',
  },
  {
    key: 'battlecards',
    label: 'Battlecards & Sales Notes',
    type: 'textarea',
    rows: 4,
    aiGenerate: true,
    colSpan: 2,
    helperText: 'Key talking points for sales team when competing',
  },

  // H. Intelligence
  {
    key: 'section-intel',
    label: 'H. Competitive Intelligence',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'screenshots',
    label: 'Screenshots & Assets',
    type: 'image-gallery',
    placeholder: 'Add screenshot URLs...',
    colSpan: 2,
    helperText: 'Screenshots of their website, app, ads, etc.',
  },
  {
    key: 'notes',
    label: 'Additional Notes',
    type: 'textarea',
    rows: 4,
    colSpan: 2,
    helperText: 'Any other important observations',
  },
];

// ============================================
// COMPETITORS PAGE
// ============================================

export default function CompetitorsPage() {
  const user = useAuthStore(s => s.user);
  const storeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (!companyId) {
      setCompetitors([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      const response = await competitorApi.getAll(companyId);
      if (response.data) setCompetitors(response.data as Competitor[]);
      setIsLoading(false);
    };

    loadData();
  }, [companyId]);

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    // Clean data
    const cleanedData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('section-')) return;
      if (value === '' || value === null || value === undefined) return;
      cleanedData[key] = value;
    });

    const response = await competitorApi.create({
      ...cleanedData,
      companyId,
      isActive: cleanedData.isActive ?? true,
    });

    if (response.data) {
      setCompetitors((prev) => [...prev, response.data as Competitor]);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Competitor>) => {
    // Clean data
    const cleanedData: Partial<Competitor> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('section-')) return;
      if (value === '' || value === null) return;
      (cleanedData as Record<string, unknown>)[key] = value;
    });

    const response = await competitorApi.update(id, cleanedData);
    if (response.data && (response.data as Competitor).id) {
      setCompetitors((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...(response.data as Competitor) } : c))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const response = await competitorApi.delete(id);
    if (!response.error) {
      setCompetitors((prev) => prev.filter((c) => c.id !== id));
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#878e9a]">Please select a company to view competitors.</p>
      </div>
    );
  }

  return (
    <ModulePage
      moduleId="competitors"
      columns={columns}
      fields={formFields}
      data={competitors}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
