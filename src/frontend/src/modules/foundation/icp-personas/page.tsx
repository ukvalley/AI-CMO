/**
 * ICPs & Personas Module - Full Framework
 *
 * Ideal Customer Profiles and Buyer Personas management
 * with ICP → Persona → Product mapping framework
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Target, UserCircle, Users, Link2, Map, BookOpen, Package } from 'lucide-react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { icpApi, personaApi, productApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { AudienceMapper } from './AudienceMapper';
import type { ICP, Persona, Product } from '@/types/entities';

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
    key: 'revenueRange',
    header: 'Revenue Range',
  },
  {
    key: 'priority',
    header: 'Priority',
    render: (value) =>
      value ? (
        <span
          className={`px-2 py-1 text-xs rounded-full border ${
            value === 'high'
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : value === 'medium'
              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
              : 'bg-[#878e9a]/10 text-[#878e9a] border-[#878e9a]/30'
          }`}
        >
          {String(value)}
        </span>
      ) : (
        '-'
      ),
  },
  {
    key: 'isActive',
    header: 'Status',
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs border ${
          value
            ? 'bg-green-500/20 text-green-400 border-green-500/50'
            : 'bg-[#21262d] text-[#878e9a] border-white/10'
        }`}
      >
        {value ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

// ============================================
// ICP FORM FIELDS - Full Framework
// ============================================

const icpFormFields: FormField[] = [
  // A. Basic Info
  {
    key: 'name',
    label: 'ICP Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Enterprise SaaS Companies',
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 2,
    aiGenerate: true,
    colSpan: 2,
  },
  { key: 'isActive', label: 'Active', type: 'toggle' },

  // Section Divider: Firmographics
  {
    key: 'section-firmographics',
    label: 'A. Firmographics',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'industry',
    label: 'Industry',
    type: 'text',
    placeholder: 'e.g., Technology, Healthcare, Finance',
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
    key: 'location',
    label: 'Geographic Location',
    type: 'text',
    placeholder: 'e.g., North America, Europe, APAC',
  },
  {
    key: 'revenueRange',
    label: 'Revenue Range',
    type: 'text',
    placeholder: 'e.g., $1M-$10M, $10M-$50M',
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
      { value: 'series-c', label: 'Series C' },
      { value: 'ipo', label: 'IPO / Public' },
      { value: 'enterprise', label: 'Enterprise' },
    ],
  },
  {
    key: 'employeeCount',
    label: 'Employee Count',
    type: 'text',
    placeholder: 'e.g., 50-200, 500+',
  },
  {
    key: 'yearsInBusiness',
    label: 'Years in Business',
    type: 'number',
    min: 0,
  },

  // Section Divider: Technographics
  {
    key: 'section-technographics',
    label: 'B. Technographics',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'techStack',
    label: 'Tech Stack',
    type: 'multiselect',
    options: [
      { value: 'aws', label: 'AWS' },
      { value: 'azure', label: 'Azure' },
      { value: 'gcp', label: 'Google Cloud' },
      { value: 'salesforce', label: 'Salesforce' },
      { value: 'hubspot', label: 'HubSpot' },
      { value: 'slack', label: 'Slack' },
      { value: 'microsoft-365', label: 'Microsoft 365' },
      { value: 'google-workspace', label: 'Google Workspace' },
      { value: 'sap', label: 'SAP' },
      { value: 'oracle', label: 'Oracle' },
    ],
    colSpan: 2,
  },

  // Section Divider: Behavioral Traits
  {
    key: 'section-behavioral',
    label: 'C. Behavioral Traits',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'buyingProcess',
    label: 'Buying Process',
    type: 'textarea',
    rows: 2,
    placeholder: 'Describe their typical buying process...',
    colSpan: 2,
  },
  {
    key: 'decisionTimeframe',
    label: 'Decision Timeframe',
    type: 'text',
    placeholder: 'e.g., 3-6 months, 1 year',
  },
  {
    key: 'budgetAuthority',
    label: 'Budget Authority',
    type: 'select',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
  },
  {
    key: 'priceSensitivity',
    label: 'Price Sensitivity',
    type: 'select',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
  },

  // Section Divider: Psychographics
  {
    key: 'section-psychographics',
    label: 'D. Psychographics',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'businessGoals',
    label: 'Business Goals',
    type: 'textarea',
    rows: 2,
    aiGenerate: true,
    placeholder: 'What are they trying to achieve?',
    colSpan: 2,
  },
  {
    key: 'challenges',
    label: 'Key Challenges',
    type: 'textarea',
    rows: 2,
    aiGenerate: true,
    placeholder: 'What challenges do they face?',
    colSpan: 2,
  },
  {
    key: 'painPoints',
    label: 'Pain Points',
    type: 'textarea',
    rows: 2,
    aiGenerate: true,
    placeholder: 'What problems are they trying to solve?',
    colSpan: 2,
  },
  {
    key: 'priorities',
    label: 'Current Priorities',
    type: 'textarea',
    rows: 2,
    placeholder: 'What are their top priorities right now?',
    colSpan: 2,
  },

  // Section Divider: Activation Criteria
  {
    key: 'section-activation',
    label: 'E. Activation Criteria',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'triggerEvents',
    label: 'Trigger Events',
    type: 'textarea',
    rows: 2,
    placeholder: 'What events trigger their need for a solution?',
    colSpan: 2,
  },
  {
    key: 'fitScore',
    label: 'Fit Score (0-100)',
    type: 'number',
    min: 0,
    max: 100,
  },
  {
    key: 'priority',
    label: 'ICP Priority',
    type: 'select',
    options: [
      { value: 'low', label: 'Low Priority' },
      { value: 'medium', label: 'Medium Priority' },
      { value: 'high', label: 'High Priority' },
    ],
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
      key: 'jobTitle',
      header: 'Job Title',
      sortable: true,
    },
    {
      key: 'seniorityLevel',
      header: 'Seniority',
      render: (value) =>
        value ? (
          <span className="capitalize px-2 py-1 text-xs bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-full">
            {String(value)}
          </span>
        ) : (
          '-'
        ),
    },
    {
      key: 'buyingRole',
      header: 'Buying Role',
      render: (value) =>
        value ? (
          <span className="capitalize px-2 py-1 text-xs bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-full border border-[#C8FF2E]/30">
            {String(value)}
          </span>
        ) : (
          '-'
        ),
    },
    {
      key: 'budgetAuthority',
      header: 'Budget',
      render: (value) =>
        value ? (
          <span className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-full">✓ Yes</span>
        ) : (
          <span className="px-2 py-1 text-xs bg-[#878e9a]/10 text-[#878e9a] rounded-full">-</span>
        ),
    },
  ];
}

// ============================================
// PERSONA FORM FIELDS - Full Framework
// ============================================

function usePersonaFormFields(icps: ICP[]): FormField[] {
  const icpOptions = icps.map((i) => ({ value: i.id, label: i.name }));

  return [
    // A. Basic Info
    {
      key: 'icpId',
      label: 'Linked ICP *',
      type: 'select',
      options: icpOptions.length > 0 ? icpOptions : [{ value: '', label: 'No ICPs available' }],
      required: true,
    },
    {
      key: 'name',
      label: 'Persona Name *',
      type: 'text',
      required: true,
      placeholder: 'e.g., Marketing Mary',
    },
    { key: 'isActive', label: 'Active', type: 'toggle' },

    // Section: Demographics
    {
      key: 'section-demographics',
      label: 'A. Demographics',
      type: 'section-header',
      colSpan: 2,
    },
    {
      key: 'ageRange',
      label: 'Age Range',
      type: 'text',
      placeholder: 'e.g., 25-34, 35-44',
    },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'non-binary', label: 'Non-binary' },
        { value: 'prefer-not-say', label: 'Prefer not to say' },
      ],
    },
    {
      key: 'jobTitle',
      label: 'Job Title',
      type: 'text',
      placeholder: 'e.g., Marketing Manager',
    },
    {
      key: 'seniorityLevel',
      label: 'Seniority Level',
      type: 'select',
      options: [
        { value: 'entry', label: 'Entry Level' },
        { value: 'mid', label: 'Mid Level' },
        { value: 'senior', label: 'Senior' },
        { value: 'c-level', label: 'C-Level' },
        { value: 'founder', label: 'Founder' },
      ],
    },
    {
      key: 'department',
      label: 'Department',
      type: 'text',
      placeholder: 'e.g., Marketing, Sales, Engineering',
    },
    {
      key: 'industry',
      label: 'Industry',
      type: 'text',
      placeholder: 'e.g., SaaS, Healthcare',
    },

    // Section: Professional Profile
    {
      key: 'section-professional',
      label: 'B. Professional Profile',
      type: 'section-header',
      colSpan: 2,
    },
    {
      key: 'experience',
      label: 'Years of Experience',
      type: 'text',
      placeholder: 'e.g., 5-10 years',
    },
    {
      key: 'skills',
      label: 'Key Skills',
      type: 'textarea',
      rows: 2,
      placeholder: 'List their key skills...',
    },
    {
      key: 'toolsUsed',
      label: 'Tools They Use',
      type: 'textarea',
      rows: 2,
      placeholder: 'Software and tools they use daily...',
    },
    {
      key: 'certifications',
      label: 'Certifications',
      type: 'textarea',
      rows: 2,
      placeholder: 'Relevant certifications...',
    },

    // Section: Psychographics
    {
      key: 'section-psychographics',
      label: 'C. Psychographics',
      type: 'section-header',
      colSpan: 2,
    },
    {
      key: 'bio',
      label: 'Bio / Background',
      type: 'textarea',
      rows: 4,
      aiGenerate: true,
      colSpan: 2,
    },
    {
      key: 'quote',
      label: 'Representative Quote',
      type: 'text',
      placeholder: 'A quote that represents this persona...',
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
    {
      key: 'motivations',
      label: 'Motivations',
      type: 'textarea',
      rows: 2,
      colSpan: 2,
    },
    {
      key: 'values',
      label: 'Values',
      type: 'textarea',
      rows: 2,
      colSpan: 2,
    },
    {
      key: 'fears',
      label: 'Fears & Concerns',
      type: 'textarea',
      rows: 2,
      colSpan: 2,
    },

    // Section: Behavioral
    {
      key: 'section-behavioral',
      label: 'D. Behavioral Traits',
      type: 'section-header',
      colSpan: 2,
    },
    {
      key: 'decisionMakingStyle',
      label: 'Decision Making Style',
      type: 'select',
      options: [
        { value: 'analytical', label: 'Analytical' },
        { value: 'intuitive', label: 'Intuitive' },
        { value: 'collaborative', label: 'Collaborative' },
        { value: 'authoritative', label: 'Authoritative' },
      ],
    },
    {
      key: 'researchHabits',
      label: 'Research Habits',
      type: 'text',
      placeholder: 'How do they research solutions?',
    },
    {
      key: 'contentPreferences',
      label: 'Content Preferences',
      type: 'multiselect',
      options: [
        { value: 'blog-posts', label: 'Blog Posts' },
        { value: 'videos', label: 'Videos' },
        { value: 'whitepapers', label: 'Whitepapers' },
        { value: 'case-studies', label: 'Case Studies' },
        { value: 'webinars', label: 'Webinars' },
        { value: 'podcasts', label: 'Podcasts' },
        { value: 'infographics', label: 'Infographics' },
        { value: 'email', label: 'Email Newsletters' },
      ],
      colSpan: 2,
    },
    {
      key: 'communicationChannel',
      label: 'Preferred Communication',
      type: 'multiselect',
      options: [
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'slack', label: 'Slack' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'in-person', label: 'In-Person' },
        { value: 'video-call', label: 'Video Call' },
      ],
      colSpan: 2,
    },

    // Section: Day in the Life
    {
      key: 'section-daily',
      label: 'E. Day in the Life',
      type: 'section-header',
      colSpan: 2,
    },
    {
      key: 'dailyChallenges',
      label: 'Daily Challenges',
      type: 'textarea',
      rows: 2,
      colSpan: 2,
    },
    {
      key: 'successMetrics',
      label: 'Success Metrics',
      type: 'textarea',
      rows: 2,
      placeholder: 'How is their success measured?',
      colSpan: 2,
    },
    {
      key: 'kpi',
      label: 'Key KPIs',
      type: 'textarea',
      rows: 2,
      placeholder: 'What KPIs do they track?',
      colSpan: 2,
    },

    // Section: Buying Behavior
    {
      key: 'section-buying',
      label: 'F. Buying Behavior',
      type: 'section-header',
      colSpan: 2,
    },
    { key: 'budgetAuthority', label: 'Has Budget Authority', type: 'toggle' },
    {
      key: 'influenceLevel',
      label: 'Influence Level',
      type: 'select',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
      ],
    },
    {
      key: 'buyingRole',
      label: 'Buying Role',
      type: 'select',
      options: [
        { value: 'champion', label: 'Champion' },
        { value: 'decision-maker', label: 'Decision Maker' },
        { value: 'influencer', label: 'Influencer' },
        { value: 'end-user', label: 'End User' },
        { value: 'blocker', label: 'Blocker' },
      ],
    },
    {
      key: 'objections',
      label: 'Common Objections',
      type: 'textarea',
      rows: 2,
      placeholder: 'What objections might they raise?',
      colSpan: 2,
    },
  ];
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

type TabType = 'icps' | 'personas' | 'mapping' | 'framework';

export default function IcpPersonasPage() {
  const [activeTab, setActiveTab] = useState<TabType>('icps');
  const { user } = useAuthStore();
  const { activeCompanyId: storeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [icps, setIcps] = useState<ICP[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (!companyId) {
      setIcps([]);
      setPersonas([]);
      setProducts([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      const [icpsRes, personasRes, productsRes] = await Promise.all([
        icpApi.getAll(companyId),
        personaApi.getAll(companyId),
        productApi.getAll(companyId),
      ]);
      if (icpsRes.data) setIcps(icpsRes.data as ICP[]);
      if (personasRes.data) setPersonas(personasRes.data as Persona[]);
      if (productsRes.data) setProducts(productsRes.data as Product[]);
      setIsLoading(false);
    };

    loadData();
  }, [companyId]);

  const personaColumns = usePersonaColumns(icps);
  const personaFormFields = usePersonaFormFields(icps);

  // ICP Handlers
  const handleIcpCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    // Clean data: remove empty strings for enum/select fields
    const cleanedData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      // Skip section-header fields
      if (key.startsWith('section-')) return;
      // Convert empty strings to undefined for enum fields
      if (value === '') {
        cleanedData[key] = undefined;
      } else {
        cleanedData[key] = value;
      }
    });

    const response = await icpApi.create({
      ...cleanedData,
      companyId,
      isActive: true,
    });

    if (response.data) {
      setIcps((prev) => [...prev, response.data as ICP]);
    }
  };

  const handleIcpUpdate = async (id: string, data: Partial<ICP>) => {
    // Clean data: remove empty strings for enum/select fields
    const cleanedData: Partial<ICP> = {};
    Object.entries(data).forEach(([key, value]) => {
      // Convert empty strings to undefined
      if (value === '') {
        (cleanedData as Record<string, unknown>)[key] = undefined;
      } else {
        (cleanedData as Record<string, unknown>)[key] = value;
      }
    });

    const response = await icpApi.update(id, cleanedData);
    if (response.data && (response.data as ICP).id) {
      setIcps((prev) => prev.map((i) => (i.id === id ? { ...i, ...(response.data as ICP) } : i)));
    }
  };

  const handleIcpDelete = async (id: string) => {
    const response = await icpApi.delete(id);
    if (!response.error) {
      setIcps((prev) => prev.filter((i) => i.id !== id));
      // Also remove personas linked to this ICP
      setPersonas((prev) => prev.filter((p) => p.icpId !== id));
    }
  };

  // Persona Handlers
  const handlePersonaCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    // Clean data: remove empty strings for enum/select fields
    const cleanedData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      // Skip section-header fields
      if (key.startsWith('section-')) return;
      // Convert empty strings to undefined
      if (value === '') {
        cleanedData[key] = undefined;
      } else {
        cleanedData[key] = value;
      }
    });

    const response = await personaApi.create({
      ...cleanedData,
      companyId,
    });

    if (response.data) {
      const newPersona = response.data as Persona;
      setPersonas((prev) => [...prev, newPersona]);
      // Update ICP's personaIds
      setIcps((prev) =>
        prev.map((icp) =>
          icp.id === newPersona.icpId
            ? { ...icp, personaIds: [...(icp.personaIds || []), newPersona.id] }
            : icp
        )
      );
    }
  };

  const handlePersonaUpdate = async (id: string, data: Partial<Persona>) => {
    // Clean data: remove empty strings for enum/select fields
    const cleanedData: Partial<Persona> = {};
    Object.entries(data).forEach(([key, value]) => {
      // Convert empty strings to undefined
      if (value === '') {
        (cleanedData as Record<string, unknown>)[key] = undefined;
      } else {
        (cleanedData as Record<string, unknown>)[key] = value;
      }
    });

    const response = await personaApi.update(id, cleanedData);
    if (response.data && (response.data as Persona).id) {
      setPersonas((prev) => prev.map((p) => (p.id === id ? { ...p, ...(response.data as Persona) } : p)));
    }
  };

  const handlePersonaDelete = async (id: string) => {
    const response = await personaApi.delete(id);
    if (!response.error) {
      setPersonas((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Mapping Handlers
  const handleLinkPersonaToICP = (personaId: string, icpId: string) => {
    // This would update the persona's icpId
    handlePersonaUpdate(personaId, { icpId });
  };

  const handleLinkPersonaToProduct = (personaId: string, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const newPersonaIds = [...(product.personaIds || []), personaId];
      productApi.update(productId, { personaIds: newPersonaIds });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, personaIds: newPersonaIds } : p
        )
      );
    }
  };

  const handleRemoveLink = (
    fromId: string,
    toId: string,
    type: 'persona-icp' | 'persona-product'
  ) => {
    if (type === 'persona-product') {
      const product = products.find((p) => p.id === toId);
      if (product) {
        const newPersonaIds = (product.personaIds || []).filter((id) => id !== fromId);
        productApi.update(toId, { personaIds: newPersonaIds });
        setProducts((prev) =>
          prev.map((p) =>
            p.id === toId ? { ...p, personaIds: newPersonaIds } : p
          )
        );
      }
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#878e9a]">Please select a company to view ICPs & Personas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#C8FF2E] to-[#a3e635] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C8FF2E]/20">
          <Target className="w-8 h-8 text-[#0d1117]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">ICPs & Personas</h1>
          <p className="text-[#878e9a]">Define your Ideal Customer Profiles and Buyer Personas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10">
        {[
          { id: 'icps', label: 'ICPs', icon: Target, count: icps.length },
          { id: 'personas', label: 'Personas', icon: UserCircle, count: personas.length },
          { id: 'mapping', label: 'Mapping', icon: Map, count: null },
          { id: 'framework', label: 'Framework Guide', icon: BookOpen, count: null },
        ].map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as TabType)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-[#C8FF2E] text-[#C8FF2E]'
                : 'border-transparent text-[#878e9a] hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {count !== null && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-[#1a1d21] rounded-full">{count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'icps' && (
        <ModulePage
          moduleId="icp-personas"
          columns={icpColumns}
          fields={icpFormFields}
          data={icps}
          onCreate={handleIcpCreate}
          onUpdate={handleIcpUpdate}
          onDelete={handleIcpDelete}
        />
      )}

      {activeTab === 'personas' && (
        <>
          {icps.length === 0 ? (
            <div className="bg-[#1a1d21]/50 rounded-xl border border-white/10 p-8 text-center">
              <Users className="w-12 h-12 text-[#686f7e] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No ICPs Available</h3>
              <p className="text-[#878e9a] mb-4">
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
              onCreate={handlePersonaCreate}
              onUpdate={handlePersonaUpdate}
              onDelete={handlePersonaDelete}
            />
          )}
        </>
      )}

      {activeTab === 'mapping' && (
        <AudienceMapper
          icps={icps}
          personas={personas}
          products={products}
          onLinkPersonaToICP={handleLinkPersonaToICP}
          onLinkPersonaToProduct={handleLinkPersonaToProduct}
          onRemoveLink={handleRemoveLink}
        />
      )}

      {activeTab === 'framework' && (
        <FrameworkGuide />
      )}
    </div>
  );
}

// ============================================
// FRAMEWORK GUIDE COMPONENT
// ============================================

function FrameworkGuide() {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="bg-[#151920] rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">ICP → Persona → Product Framework</h2>
        <p className="text-[#878e9a] mb-6">
          This framework helps you create a complete picture of who your customers are,
          how they make decisions, and which products best serve their needs.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1a1d21] rounded-lg p-4 border border-[#C8FF2E]/20">
            <div className="w-10 h-10 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-[#C8FF2E]" />
            </div>
            <h3 className="font-semibold text-white mb-2">1. ICP</h3>
            <p className="text-sm text-[#878e9a]">
              Define the ideal companies that would benefit most from your solution.
            </p>
          </div>

          <div className="bg-[#1a1d21] rounded-lg p-4 border border-[#C8FF2E]/20">
            <div className="w-10 h-10 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center mb-3">
              <UserCircle className="w-5 h-5 text-[#C8FF2E]" />
            </div>
            <h3 className="font-semibold text-white mb-2">2. Persona</h3>
            <p className="text-sm text-[#878e9a]">
              Identify the specific individuals within those companies who influence or make purchasing decisions.
            </p>
          </div>

          <div className="bg-[#1a1d21] rounded-lg p-4 border border-[#C8FF2E]/20">
            <div className="w-10 h-10 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center mb-3">
              <Package className="w-5 h-5 text-[#C8FF2E]" />
            </div>
            <h3 className="font-semibold text-white mb-2">3. Product</h3>
            <p className="text-sm text-[#878e9a]">
              Map your products/services to the specific personas and ICPs they serve.
            </p>
          </div>
        </div>
      </div>

      {/* ICP Framework */}
      <div className="bg-[#151920] rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#C8FF2E]" />
          ICP Framework Sections
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              title: 'A. Firmographics',
              desc: 'Industry, company size, location, revenue, funding stage, employee count',
            },
            {
              title: 'B. Technographics',
              desc: 'Tech stack, tools used, platforms they operate on',
            },
            {
              title: 'C. Behavioral Traits',
              desc: 'Buying process, decision timeframe, budget authority, price sensitivity',
            },
            {
              title: 'D. Psychographics',
              desc: 'Business goals, challenges, pain points, priorities',
            },
            {
              title: 'E. Activation Criteria',
              desc: 'Trigger events, fit score, priority level',
            },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-[#1a1d21] rounded-lg p-4">
              <h4 className="font-medium text-[#C8FF2E] mb-1">{title}</h4>
              <p className="text-sm text-[#878e9a]">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Persona Framework */}
      <div className="bg-[#151920] rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-[#C8FF2E]" />
          Persona Framework Sections
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              title: 'A. Demographics',
              desc: 'Age, gender, job title, seniority, department, industry',
            },
            {
              title: 'B. Professional Profile',
              desc: 'Experience, skills, tools used, certifications',
            },
            {
              title: 'C. Psychographics',
              desc: 'Goals, pain points, motivations, values, fears',
            },
            {
              title: 'D. Behavioral',
              desc: 'Decision style, research habits, content preferences, communication channels',
            },
            {
              title: 'E. Day in the Life',
              desc: 'Daily challenges, success metrics, KPIs',
            },
            {
              title: 'F. Buying Behavior',
              desc: 'Budget authority, influence level, buying role, objections',
            },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-[#1a1d21] rounded-lg p-4">
              <h4 className="font-medium text-[#C8FF2E] mb-1">{title}</h4>
              <p className="text-sm text-[#878e9a]">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-[#151920] rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Best Practices</h3>

        <ul className="space-y-3">
          {[
            'Start with ICPs - define the companies first, then the people within them',
            'Keep ICPs focused - 3-5 well-defined ICPs are better than 10 vague ones',
            'Link personas to specific ICPs - personas should fit within an ICP',
            'Map products to personas - show which products solve which persona needs',
            'Use the Mapping view to identify gaps in your audience coverage',
            'Review and update quarterly - markets and customers evolve',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-[#878e9a]">
              <span className="text-[#C8FF2E]">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
