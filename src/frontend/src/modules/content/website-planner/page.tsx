/**
 * Website Planner Module - Comprehensive Website Planning System
 *
 * A powerful website planning, requirements generation, and AI documentation tool.
 * NOT a website builder - this is for strategizing, planning, and creating
 * structured website requirement documents and AI prompts.
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Globe,
  Layout,
  FileText,
  MessageSquare,
  Settings,
  Layers,
  Target,
  Palette,
  Sparkles,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Bot,
  Save,
  Share2,
  History,
  Users,
  Search,
  Zap,
  Image,
  Video,
  File,
  Link,
  Code,
  Smartphone,
  Monitor,
  PenTool,
  Map,
  List,
  Grid,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDataStore, useCompanyStore } from '@/stores';
import type {
  WebsitePlanner,
  WebsiteSection,
  WebsitePage,
  WebsiteFeature,
  WebsiteFAQ,
  WebsiteCaseStudy,
  WebsiteAIPrompt,
  WebsiteRequirementDocument,
  SectionPriority,
  WebsiteType,
  WebsiteStatus,
  FeatureComplexity,
} from '@/types/entities';

// ============================================
// DEFAULT SECTIONS TEMPLATES
// ============================================

const DEFAULT_SECTIONS: Array<{
  name: string;
  enabled: boolean;
  order: number;
  priority: SectionPriority;
}> = [
  { name: 'Hero Section', enabled: true, order: 0, priority: 'critical' },
  { name: 'About Us', enabled: true, order: 1, priority: 'high' },
  { name: 'Services', enabled: true, order: 2, priority: 'high' },
  { name: 'Products', enabled: false, order: 3, priority: 'medium' },
  { name: 'Features', enabled: true, order: 4, priority: 'medium' },
  { name: 'Case Studies', enabled: false, order: 5, priority: 'medium' },
  { name: 'Testimonials', enabled: true, order: 6, priority: 'medium' },
  { name: 'FAQs', enabled: true, order: 7, priority: 'medium' },
  { name: 'Pricing', enabled: false, order: 8, priority: 'low' },
  { name: 'Process', enabled: false, order: 9, priority: 'low' },
  { name: 'Team', enabled: false, order: 10, priority: 'low' },
  { name: 'Industries Served', enabled: false, order: 11, priority: 'low' },
  { name: 'Portfolio', enabled: false, order: 12, priority: 'low' },
  { name: 'Blog', enabled: false, order: 13, priority: 'low' },
  { name: 'Careers', enabled: false, order: 14, priority: 'low' },
  { name: 'Contact', enabled: true, order: 15, priority: 'critical' },
  { name: 'Lead Form', enabled: true, order: 16, priority: 'high' },
  { name: 'CTA Blocks', enabled: true, order: 17, priority: 'high' },
  { name: 'Statistics', enabled: false, order: 18, priority: 'low' },
  { name: 'Integrations', enabled: false, order: 19, priority: 'low' },
  { name: 'Partners', enabled: false, order: 20, priority: 'low' },
  { name: 'Certifications', enabled: false, order: 21, priority: 'low' },
  { name: 'Download Brochure', enabled: false, order: 22, priority: 'low' },
  { name: 'Investor Section', enabled: false, order: 23, priority: 'low' },
  { name: 'Media Coverage', enabled: false, order: 24, priority: 'low' },
  { name: 'Event Section', enabled: false, order: 25, priority: 'low' },
];

const DEFAULT_PAGES: Array<{
  name: string;
  url: string;
  pageType: 'main' | 'landing' | 'dynamic' | 'legal' | 'seo';
  isPublished: boolean;
}> = [
  { name: 'Home', url: '/', pageType: 'main', isPublished: false },
  { name: 'About', url: '/about', pageType: 'main', isPublished: false },
  { name: 'Services', url: '/services', pageType: 'main', isPublished: false },
  { name: 'Contact', url: '/contact', pageType: 'main', isPublished: false },
  { name: 'Privacy Policy', url: '/privacy-policy', pageType: 'legal', isPublished: false },
  { name: 'Terms of Service', url: '/terms', pageType: 'legal', isPublished: false },
];

const DEFAULT_FEATURES: Array<{
  name: string;
  enabled: boolean;
  priority: SectionPriority;
  complexity: FeatureComplexity;
}> = [
  { name: 'Authentication', enabled: false, priority: 'medium', complexity: 'medium' },
  { name: 'Payment Gateway', enabled: false, priority: 'medium', complexity: 'complex' },
  { name: 'CRM Integration', enabled: false, priority: 'high', complexity: 'medium' },
  { name: 'WhatsApp Integration', enabled: false, priority: 'medium', complexity: 'simple' },
  { name: 'Chatbot', enabled: false, priority: 'medium', complexity: 'medium' },
  { name: 'AI Features', enabled: false, priority: 'low', complexity: 'complex' },
  { name: 'Blog System', enabled: true, priority: 'medium', complexity: 'medium' },
  { name: 'CMS', enabled: false, priority: 'high', complexity: 'complex' },
  { name: 'Multi-language', enabled: false, priority: 'low', complexity: 'complex' },
  { name: 'Admin Panel', enabled: false, priority: 'high', complexity: 'complex' },
  { name: 'Analytics', enabled: true, priority: 'high', complexity: 'simple' },
  { name: 'Lead Tracking', enabled: true, priority: 'high', complexity: 'medium' },
  { name: 'Booking System', enabled: false, priority: 'low', complexity: 'complex' },
  { name: 'Notifications', enabled: false, priority: 'medium', complexity: 'medium' },
  { name: 'API Integration', enabled: false, priority: 'medium', complexity: 'complex' },
  { name: 'Role Management', enabled: false, priority: 'medium', complexity: 'complex' },
];

const AI_PLATFORMS = [
  { id: 'chatgpt', name: 'ChatGPT', color: '#10A37F' },
  { id: 'claude', name: 'Claude', color: '#CC785C' },
  { id: 'cursor', name: 'Cursor', color: '#000000' },
  { id: 'lovable', name: 'Lovable', color: '#FF6B6B' },
  { id: 'bolt', name: 'Bolt', color: '#FFD93D' },
  { id: 'v0', name: 'V0', color: '#000000' },
  { id: 'replit', name: 'Replit', color: '#F26207' },
  { id: 'framer', name: 'Framer AI', color: '#0055FF' },
  { id: 'webflow', name: 'Webflow AI', color: '#4353FF' },
];

const WEBSITE_TYPES: { value: WebsiteType; label: string }[] = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'saas', label: 'SaaS' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'agency', label: 'Agency' },
  { value: 'personal-brand', label: 'Personal Brand' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function WebsitePlannerModule() {
  const { activeCompanyId: companyId } = useCompanyStore();
  const { getItems, addItem, updateItem, deleteItem } = useDataStore();

  const websites = useMemo(
    () => (getItems('websitePlanners') as WebsitePlanner[]) || [],
    [getItems]
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'pages' | 'content' | 'seo' | 'features' | 'ai'>('overview');
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Find selected website
  const selectedWebsite = useMemo(
    () => websites.find((w) => w.id === selectedWebsiteId) || null,
    [websites, selectedWebsiteId]
  );

  // Create new website
  const handleCreateWebsite = (data: { name: string; websiteType: WebsiteType; language: string }) => {
    if (!companyId) return;

    const newWebsite: WebsitePlanner = {
      id: crypto.randomUUID(),
      companyId,
      name: data.name,
      websiteType: data.websiteType,
      language: data.language,
      status: 'planning',
      version: 1,
      sections: DEFAULT_SECTIONS.map((s, i) => ({ ...s, id: `section-${i}` })),
      pages: DEFAULT_PAGES.map((p, i) => ({ ...p, id: `page-${i}`, sections: [] })),
      features: DEFAULT_FEATURES.map((f, i) => ({ ...f, id: `feature-${i}` })),
      contentBlocks: [],
      caseStudies: [],
      faqs: [],
      seoClusters: [],
      targetKeywords: [],
      aiPrompts: [],
      documents: [],
      comments: [],
      approvals: [],
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addItem('websitePlanners', newWebsite);
    setSelectedWebsiteId(newWebsite.id);
    setShowCreateModal(false);
  };

  // Update website
  const handleUpdateWebsite = (updates: Partial<WebsitePlanner>) => {
    if (!selectedWebsiteId) return;
    updateItem('websitePlanners', selectedWebsiteId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  // Delete website
  const handleDeleteWebsite = (id: string) => {
    if (confirm('Are you sure you want to delete this website?')) {
      deleteItem('websitePlanners', id);
      if (selectedWebsiteId === id) setSelectedWebsiteId(null);
    }
  };

  // Generate AI Prompt
  const generateAIPrompt = (platform: string): string => {
    if (!selectedWebsite) return '';

    const sections = selectedWebsite.sections
      .filter((s) => s.enabled)
      .map((s) => s.name)
      .join(', ');

    const features = selectedWebsite.features
      .filter((f) => f.enabled)
      .map((f) => f.name)
      .join(', ');

    return `Create a professional ${selectedWebsite.websiteType} website for "${selectedWebsite.name}".

WEBSITE GOAL:
${selectedWebsite.websiteGoal || 'To establish a strong online presence and convert visitors into customers.'}

TARGET AUDIENCE:
${selectedWebsite.targetAudience || 'Business professionals and decision-makers'}

PRIMARY CTA:
${selectedWebsite.primaryCTA || 'Contact Us'}

SECONDARY CTA:
${selectedWebsite.secondaryCTA || 'Learn More'}

SECTIONS TO INCLUDE:
${sections}

FEATURES REQUIRED:
${features}

LANGUAGE: ${selectedWebsite.language}
REGION: ${selectedWebsite.country || 'Global'}

Please provide:
1. Complete website structure
2. Section-by-section content recommendations
3. UI/UX design suggestions
4. Color scheme and typography recommendations
5. Call-to-action placements
6. SEO optimization tips
7. Responsive design considerations

Generate code-ready specifications that can be used with ${platform} to build this website.`;
  };

  // Copy prompt to clipboard
  const copyPrompt = async (platform: string) => {
    const prompt = generateAIPrompt(platform);
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Generate Markdown Document
  const generateMarkdown = (): string => {
    if (!selectedWebsite) return '';

    return `# ${selectedWebsite.name} - Website Requirements Document

## Overview
- **Website Type:** ${selectedWebsite.websiteType}
- **Status:** ${selectedWebsite.status}
- **Language:** ${selectedWebsite.language}
- **Target Region:** ${selectedWebsite.seoTargetRegion || 'Global'}

## Goals
${selectedWebsite.websiteGoal || 'N/A'}

## Target Audience
${selectedWebsite.targetAudience || 'N/A'}

## Primary CTA
${selectedWebsite.primaryCTA || 'N/A'}

## Secondary CTA
${selectedWebsite.secondaryCTA || 'N/A'}

## Website Structure

### Enabled Sections
${selectedWebsite.sections
  .filter((s) => s.enabled)
  .map((s) => `- **${s.name}** (Priority: ${s.priority})${s.purpose ? `\n  - Purpose: ${s.purpose}` : ''}`)
  .join('\n')}

### Pages
${selectedWebsite.pages.map((p) => `- **${p.name}** (${p.pageType}) - \`${p.url}\``).join('\n')}

## Features
${selectedWebsite.features
  .filter((f) => f.enabled)
  .map((f) => `- **${f.name}** (Complexity: ${f.complexity}, Priority: ${f.priority})`)
  .join('\n')}

## SEO

### Target Keywords
${selectedWebsite.targetKeywords.map((k) => `- ${k}`).join('\n') || 'None defined'}

## Additional Notes
- Generated: ${new Date().toLocaleDateString()}
- Version: ${selectedWebsite.version}
`;
  };

  // Download markdown
  const downloadMarkdown = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedWebsite?.name || 'website'}-requirements.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Globe className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-200 mb-2">No Company Selected</h2>
          <p className="text-slate-400">Please select a company to start planning websites.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/10 rounded-lg">
                <Globe className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-100">Website Planner</h1>
                <p className="text-sm text-slate-400">Plan, structure, and document website requirements</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedWebsite && (
                <button
                  onClick={() => setSelectedWebsiteId(null)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Back to List
                </button>
              )}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Website
              </button>
            </div>
          </div>
        </div>

        {/* Website Selector */}
        {websites.length > 0 && !selectedWebsite && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-4 overflow-x-auto">
              {websites.map((website) => (
                <button
                  key={website.id}
                  onClick={() => setSelectedWebsiteId(website.id)}
                  className={cn(
                    'flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg border transition-all',
                    selectedWebsiteId === website.id
                      ? 'bg-primary-500/10 border-primary-500/50 text-primary-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                  )}
                >
                  <Globe className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{website.name}</div>
                    <div className="text-xs opacity-70">{website.websiteType}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6">
        {!selectedWebsite ? (
          <WebsiteList
            websites={websites}
            onSelect={setSelectedWebsiteId}
            onDelete={handleDeleteWebsite}
          />
        ) : (
          <div className="space-y-6">
            {/* Website Header */}
            <WebsiteHeader
              website={selectedWebsite}
              onUpdate={handleUpdateWebsite}
              onDownload={downloadMarkdown}
            />

            {/* Tabs */}
            <div className="border-b border-slate-800">
              <div className="flex gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Layout },
                  { id: 'structure', label: 'Structure', icon: Layers },
                  { id: 'pages', label: 'Pages', icon: FileText },
                  { id: 'content', label: 'Content', icon: PenTool },
                  { id: 'seo', label: 'SEO', icon: Search },
                  { id: 'features', label: 'Features', icon: Zap },
                  { id: 'ai', label: 'AI Prompts', icon: Bot },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-400'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'overview' && (
                <OverviewTab website={selectedWebsite} onUpdate={handleUpdateWebsite} />
              )}
              {activeTab === 'structure' && (
                <StructureTab
                  website={selectedWebsite}
                  onUpdate={handleUpdateWebsite}
                />
              )}
              {activeTab === 'pages' && (
                <PagesTab website={selectedWebsite} onUpdate={handleUpdateWebsite} />
              )}
              {activeTab === 'content' && (
                <ContentTab website={selectedWebsite} onUpdate={handleUpdateWebsite} />
              )}
              {activeTab === 'seo' && (
                <SEOTab website={selectedWebsite} onUpdate={handleUpdateWebsite} />
              )}
              {activeTab === 'features' && (
                <FeaturesTab website={selectedWebsite} onUpdate={handleUpdateWebsite} />
              )}
              {activeTab === 'ai' && (
                <AIPromptsTab
                  website={selectedWebsite}
                  onCopy={copyPrompt}
                  copied={copiedPrompt}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateWebsiteModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateWebsite}
        />
      )}
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function WebsiteList({
  websites,
  onSelect,
  onDelete,
}: {
  websites: WebsitePlanner[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (websites.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Globe className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-200 mb-2">No Websites Yet</h3>
        <p className="text-slate-400 max-w-md mx-auto mb-6">
          Start planning your website by creating a new project. Define structure, content, and generate AI prompts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {websites.map((website) => (
        <div
          key={website.id}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <Globe className="w-6 h-6 text-primary-400" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(website.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-lg font-semibold text-slate-200 mb-1">{website.name}</h3>
          <p className="text-sm text-slate-400 mb-4 capitalize">{website.websiteType}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Layers className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">
                {website.sections.filter((s) => s.enabled).length} sections enabled
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">{website.pages.length} pages</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">
                {website.features.filter((f) => f.enabled).length} features
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span
              className={cn(
                'px-2 py-1 text-xs rounded-full',
                website.status === 'planning' && 'bg-yellow-500/10 text-yellow-400',
                website.status === 'live' && 'bg-green-500/10 text-green-400',
                website.status === 'development' && 'bg-blue-500/10 text-blue-400'
              )}
            >
              {website.status}
            </span>
            <button
              onClick={() => onSelect(website.id)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors"
            >
              Open
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function WebsiteHeader({
  website,
  onUpdate,
  onDownload,
}: {
  website: WebsitePlanner;
  onUpdate: (updates: Partial<WebsitePlanner>) => void;
  onDownload: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(website.name);

  const handleSave = () => {
    onUpdate({ name });
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-2xl font-semibold focus:outline-none focus:border-primary-500"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h2
                className="text-2xl font-semibold text-slate-100 cursor-pointer hover:text-primary-400 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                {website.name}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-slate-500 hover:text-slate-300"
              >
                <PenTool className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-slate-400 capitalize">
              {website.websiteType} Website
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-sm text-slate-400">v{website.version}</span>
            <span className="text-slate-600">|</span>
            <span
              className={cn(
                'px-2 py-0.5 text-xs rounded-full',
                website.status === 'planning' && 'bg-yellow-500/10 text-yellow-400',
                website.status === 'live' && 'bg-green-500/10 text-green-400',
                website.status === 'development' && 'bg-blue-500/10 text-blue-400'
              )}
            >
              {website.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export MD
          </button>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({
  website,
  onUpdate,
}: {
  website: WebsitePlanner;
  onUpdate: (updates: Partial<WebsitePlanner>) => void;
}) {
  const fields = [
    { key: 'name', label: 'Website Name', type: 'text' },
    { key: 'domain', label: 'Domain Name', type: 'text' },
    { key: 'websiteGoal', label: 'Website Goal', type: 'textarea' },
    { key: 'primaryCTA', label: 'Primary CTA', type: 'text' },
    { key: 'secondaryCTA', label: 'Secondary CTA', type: 'text' },
    { key: 'targetAudience', label: 'Target Audience', type: 'textarea' },
    { key: 'country', label: 'Country/Region', type: 'text' },
    { key: 'language', label: 'Language', type: 'text' },
    { key: 'seoTargetRegion', label: 'SEO Target Region', type: 'text' },
    { key: 'owner', label: 'Website Owner', type: 'text' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-slate-200">Basic Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Website Type
            </label>
            <select
              value={website.websiteType}
              onChange={(e) => onUpdate({ websiteType: e.target.value as WebsiteType })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              {WEBSITE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Status
            </label>
            <select
              value={website.status}
              onChange={(e) => onUpdate({ status: e.target.value as WebsiteStatus })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              <option value="planning">Planning</option>
              <option value="requirements">Requirements</option>
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="review">Review</option>
              <option value="live">Live</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={(website as any)[field.key] || ''}
                  onChange={(e) => onUpdate({ [field.key]: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              ) : (
                <input
                  type="text"
                  value={(website as any)[field.key] || ''}
                  onChange={(e) => onUpdate({ [field.key]: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-slate-200">Project Overview</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={Layers}
              label="Sections"
              value={website.sections.filter((s) => s.enabled).length}
              total={website.sections.length}
            />
            <StatCard
              icon={FileText}
              label="Pages"
              value={website.pages.filter((p) => p.isPublished).length}
              total={website.pages.length}
            />
            <StatCard
              icon={Zap}
              label="Features"
              value={website.features.filter((f) => f.enabled).length}
              total={website.features.length}
            />
            <StatCard
              icon={Bot}
              label="AI Prompts"
              value={website.aiPrompts.length}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-slate-200">Project Info</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Created</span>
              <span className="text-slate-200">
                {new Date(website.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Last Updated</span>
              <span className="text-slate-200">
                {new Date(website.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Version</span>
              <span className="text-slate-200">{website.version}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  total,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  total?: number;
}) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary-500/10 rounded-lg">
          <Icon className="w-4 h-4 text-primary-400" />
        </div>
        <span className="text-2xl font-semibold text-slate-200">{value}</span>
      </div>
      <p className="text-sm text-slate-400">
        {label}
        {total !== undefined && (
          <span className="text-slate-500"> / {total}</span>
        )}
      </p>
    </div>
  );
}

function StructureTab({
  website,
  onUpdate,
}: {
  website: WebsitePlanner;
  onUpdate: (updates: Partial<WebsitePlanner>) => void;
}) {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleToggleSection = (sectionId: string) => {
    const updatedSections = website.sections.map((s) =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    onUpdate({ sections: updatedSections });
  };

  const handleUpdateSection = (sectionId: string, updates: Partial<WebsiteSection>) => {
    const updatedSections = website.sections.map((s) =>
      s.id === sectionId ? { ...s, ...updates } : s
    );
    onUpdate({ sections: updatedSections });
  };

  const handleReorder = (sectionId: string, direction: 'up' | 'down') => {
    const index = website.sections.findIndex((s) => s.id === sectionId);
    if (index === -1) return;

    const newSections = [...website.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];

    // Update order numbers
    newSections.forEach((s, i) => {
      s.order = i;
    });

    onUpdate({ sections: newSections });
  };

  const enabledSections = website.sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const disabledSections = website.sections.filter((s) => !s.enabled);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Enabled Sections */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-slate-200">Website Structure</h3>
            </div>
            <span className="text-sm text-slate-400">
              {enabledSections.length} sections enabled
            </span>
          </div>

          <div className="space-y-3">
            {enabledSections.map((section, index) => (
              <div
                key={section.id}
                className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleSection(section.id)}
                      className="p-1 text-green-400 hover:text-green-300"
                      title="Disable section"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <span className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded text-xs text-slate-400">
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-200">{section.name}</span>
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs rounded-full',
                        section.priority === 'critical' && 'bg-red-500/10 text-red-400',
                        section.priority === 'high' && 'bg-orange-500/10 text-orange-400',
                        section.priority === 'medium' && 'bg-yellow-500/10 text-yellow-400',
                        section.priority === 'low' && 'bg-slate-500/10 text-slate-400'
                      )}
                    >
                      {section.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReorder(section.id, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingSection(section.id)}
                      className="p-1.5 text-slate-400 hover:text-primary-400"
                    >
                      <PenTool className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {editingSection === section.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Purpose</label>
                      <textarea
                        value={section.purpose || ''}
                        onChange={(e) => handleUpdateSection(section.id, { purpose: e.target.value })}
                        placeholder="What is the purpose of this section?"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Content Requirements</label>
                      <textarea
                        value={section.contentRequirement || ''}
                        onChange={(e) =>
                          handleUpdateSection(section.id, { contentRequirement: e.target.value })
                        }
                        placeholder="What content should be included?"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">CTA</label>
                        <input
                          type="text"
                          value={section.cta || ''}
                          onChange={(e) => handleUpdateSection(section.id, { cta: e.target.value })}
                          placeholder="Call to action"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Priority</label>
                        <select
                          value={section.priority}
                          onChange={(e) =>
                            handleUpdateSection(section.id, { priority: e.target.value as SectionPriority })
                          }
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                        >
                          <option value="critical">Critical</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setEditingSection(null)}
                        className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Sections */}
      <div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <List className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-slate-200">Available Sections</h3>
          </div>

          <div className="space-y-2">
            {disabledSections.map((section) => (
              <div
                key={section.id}
                className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
              >
                <button
                  onClick={() => handleToggleSection(section.id)}
                  className="p-1 text-slate-500 hover:text-primary-400"
                  title="Enable section"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <span className="text-slate-400">{section.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PagesTab({
  website,
  onUpdate,
}: {
  website: WebsitePlanner;
  onUpdate: (updates: Partial<WebsitePlanner>) => void;
}) {
  const [newPage, setNewPage] = useState({ name: '', url: '', pageType: 'main' as const });
  const [editingPage, setEditingPage] = useState<string | null>(null);

  const handleAddPage = () => {
    if (!newPage.name || !newPage.url) return;

    const page: WebsitePage = {
      id: crypto.randomUUID(),
      name: newPage.name,
      url: newPage.url,
      pageType: newPage.pageType,
      isPublished: false,
      sections: [],
    };

    onUpdate({ pages: [...website.pages, page] });
    setNewPage({ name: '', url: '', pageType: 'main' });
  };

  const handleUpdatePage = (pageId: string, updates: Partial<WebsitePage>) => {
    const updatedPages = website.pages.map((p) => (p.id === pageId ? { ...p, ...updates } : p));
    onUpdate({ pages: updatedPages });
  };

  const handleDeletePage = (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      onUpdate({ pages: website.pages.filter((p) => p.id !== pageId) });
    }
  };

  const pagesByType = {
    main: website.pages.filter((p) => p.pageType === 'main'),
    landing: website.pages.filter((p) => p.pageType === 'landing'),
    dynamic: website.pages.filter((p) => p.pageType === 'dynamic'),
    legal: website.pages.filter((p) => p.pageType === 'legal'),
    seo: website.pages.filter((p) => p.pageType === 'seo'),
  };

  return (
    <div className="space-y-6">
      {/* Add New Page */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-slate-200">Add New Page</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Page name"
            value={newPage.name}
            onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
          <input
            type="text"
            placeholder="URL path (e.g., /about)"
            value={newPage.url}
            onChange={(e) => setNewPage({ ...newPage, url: e.target.value })}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
          <select
            value={newPage.pageType}
            onChange={(e) => setNewPage({ ...newPage, pageType: e.target.value as any })}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
          >
            <option value="main">Main Page</option>
            <option value="landing">Landing Page</option>
            <option value="dynamic">Dynamic Page</option>
            <option value="legal">Legal Page</option>
            <option value="seo">SEO Page</option>
          </select>
          <button
            onClick={handleAddPage}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Add Page
          </button>
        </div>
      </div>

      {/* Pages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(pagesByType).map(([type, pages]) =>
          pages.length > 0 ? (
            <div key={type} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 capitalize">{type} Pages</h3>
              <div className="space-y-3">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-200">{page.name}</span>
                        {page.isPublished && (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">
                            Published
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingPage(editingPage === page.id ? null : page.id)}
                          className="p-1.5 text-slate-400 hover:text-primary-400"
                        >
                          <PenTool className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <code className="text-xs text-slate-500">{page.url}</code>

                    {editingPage === page.id && (
                      <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">Meta Title</label>
                          <input
                            type="text"
                            value={page.metaTitle || ''}
                            onChange={(e) => handleUpdatePage(page.id, { metaTitle: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">Meta Description</label>
                          <textarea
                            value={page.metaDescription || ''}
                            onChange={(e) =>
                              handleUpdatePage(page.id, { metaDescription: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                            rows={2}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm text-slate-400">
                            <input
                              type="checkbox"
                              checked={page.isPublished}
                              onChange={(e) =>
                                handleUpdatePage(page.id, { isPublished: e.target.checked })
                              }
                              className="rounded border-slate-600"
                            />
                            Published
                          </label>
                          <button
                            onClick={() => setEditingPage(null)}
                            className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

function ContentTab({
  website,
  onUpdate,
}: {
  website: WebsitePlanner;
  onUpdate: (updates: Partial<WebsitePlanner>) => void;
}) {
  const [activeContent, setActiveContent] = useState<'faqs' | 'case-studies'>('faqs');
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [newCaseStudy, setNewCaseStudy] = useState({ clientName: '', industry: '' });

  const handleAddFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) return;

    const faq: WebsiteFAQ = {
      id: crypto.randomUUID(),
      question: newFAQ.question,
      answer: newFAQ.answer,
      seoImportance: 'medium',
      schemaEnabled: true,
    };

    onUpdate({ faqs: [...website.faqs, faq] });
    setNewFAQ({ question: '', answer: '' });
  };

  const handleDeleteFAQ = (id: string) => {
    onUpdate({ faqs: website.faqs.filter((f) => f.id !== id) });
  };

  const handleAddCaseStudy = () => {
    if (!newCaseStudy.clientName) return;

    const caseStudy: WebsiteCaseStudy = {
      id: crypto.randomUUID(),
      clientName: newCaseStudy.clientName,
      industry: newCaseStudy.industry,
    };

    onUpdate({ caseStudies: [...website.caseStudies, caseStudy] });
    setNewCaseStudy({ clientName: '', industry: '' });
  };

  const handleDeleteCaseStudy = (id: string) => {
    onUpdate({ caseStudies: website.caseStudies.filter((c) => c.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800">
        <button
          onClick={() => setActiveContent('faqs')}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeContent === 'faqs'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          )}
        >
          <MessageSquare className="w-4 h-4" />
          FAQs ({website.faqs.length})
        </button>
        <button
          onClick={() => setActiveContent('case-studies')}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeContent === 'case-studies'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          )}
        >
          <FileText className="w-4 h-4" />
          Case Studies ({website.caseStudies.length})
        </button>
      </div>

      {/* FAQs */}
      {activeContent === 'faqs' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Add FAQ</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Question"
                value={newFAQ.question}
                onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
              />
              <textarea
                placeholder="Answer"
                value={newFAQ.answer}
                onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                rows={3}
              />
              <button
                onClick={handleAddFAQ}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Add FAQ
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {website.faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-200 mb-1">{faq.question}</h4>
                    <p className="text-sm text-slate-400">{faq.answer}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFAQ(faq.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Case Studies */}
      {activeContent === 'case-studies' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Add Case Study</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Client name"
                value={newCaseStudy.clientName}
                onChange={(e) => setNewCaseStudy({ ...newCaseStudy, clientName: e.target.value })}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
              />
              <input
                type="text"
                placeholder="Industry"
                value={newCaseStudy.industry}
                onChange={(e) => setNewCaseStudy({ ...newCaseStudy, industry: e.target.value })}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
              />
              <button
                onClick={handleAddCaseStudy}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Add Case Study
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {website.caseStudies.map((caseStudy) => (
              <div
                key={caseStudy.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-slate-200">{caseStudy.clientName}</h4>
                    {caseStudy.industry && (
                      <p className="text-sm text-slate-400">{caseStudy.industry}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCaseStudy(caseStudy.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SEOTab({
  website,
  onUpdate,
}: {
  website: WebsitePlanner;
  onUpdate: (updates: Partial<WebsitePlanner>) => void;
}) {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    onUpdate({ targetKeywords: [...website.targetKeywords, newKeyword.trim()] });
    setNewKeyword('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    onUpdate({ targetKeywords: website.targetKeywords.filter((k) => k !== keyword) });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Keywords */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Search className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-slate-200">Target Keywords</h3>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter keyword"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
          <button
            onClick={handleAddKeyword}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {website.targetKeywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm"
            >
              {keyword}
              <button
                onClick={() => handleRemoveKeyword(keyword)}
                className="p-0.5 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* SEO Summary */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-slate-200">SEO Summary</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Total Pages</span>
            <span className="text-slate-200 font-medium">{website.pages.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Published Pages</span>
            <span className="text-slate-200 font-medium">
              {website.pages.filter((p) => p.isPublished).length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Target Keywords</span>
            <span className="text-slate-200 font-medium">{website.targetKeywords.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">SEO Pages</span>
            <span className="text-slate-200 font-medium">
              {website.pages.filter((p) => p.pageType === 'seo').length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Pages with Meta</span>
            <span className="text-slate-200 font-medium">
              {website.pages.filter((p) => p.metaTitle && p.metaDescription).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturesTab({
  website,
  onUpdate,
}: {
  website: WebsitePlanner;
  onUpdate: (updates: Partial<WebsitePlanner>) => void;
}) {
  const handleToggleFeature = (featureId: string) => {
    const updatedFeatures = website.features.map((f) =>
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    );
    onUpdate({ features: updatedFeatures });
  };

  const handleUpdateFeature = (featureId: string, updates: Partial<WebsiteFeature>) => {
    const updatedFeatures = website.features.map((f) =>
      f.id === featureId ? { ...f, ...updates } : f
    );
    onUpdate({ features: updatedFeatures });
  };

  const enabledCount = website.features.filter((f) => f.enabled).length;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-slate-200">Website Features</h3>
          </div>
          <span className="text-sm text-slate-400">
            {enabledCount} of {website.features.length} enabled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {website.features.map((feature) => (
            <div
              key={feature.id}
              className={cn(
                'border rounded-lg p-4 transition-all',
                feature.enabled
                  ? 'bg-primary-500/5 border-primary-500/30'
                  : 'bg-slate-900/50 border-slate-700'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleFeature(feature.id)}
                    className={cn(
                      'p-1 rounded transition-colors',
                      feature.enabled ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'
                    )}
                  >
                    {feature.enabled ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <span
                    className={cn(
                      'font-medium',
                      feature.enabled ? 'text-slate-200' : 'text-slate-400'
                    )}
                  >
                    {feature.name}
                  </span>
                </div>
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs rounded-full',
                    feature.complexity === 'simple' && 'bg-green-500/10 text-green-400',
                    feature.complexity === 'medium' && 'bg-yellow-500/10 text-yellow-400',
                    feature.complexity === 'complex' && 'bg-orange-500/10 text-orange-400',
                    feature.complexity === 'enterprise' && 'bg-red-500/10 text-red-400'
                  )}
                >
                  {feature.complexity}
                </span>
              </div>

              {feature.enabled && (
                <div className="pl-9 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Notes</label>
                    <input
                      type="text"
                      value={feature.notes || ''}
                      onChange={(e) =>
                        handleUpdateFeature(feature.id, { notes: e.target.value })
                      }
                      placeholder="Add implementation notes..."
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Priority</label>
                      <select
                        value={feature.priority}
                        onChange={(e) =>
                          handleUpdateFeature(feature.id, { priority: e.target.value as any })
                        }
                        className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 mb-1">Timeline</label>
                      <input
                        type="text"
                        value={feature.estimatedTimeline || ''}
                        onChange={(e) =>
                          handleUpdateFeature(feature.id, { estimatedTimeline: e.target.value })
                        }
                        placeholder="e.g., 2 weeks"
                        className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIPromptsTab({
  website,
  onCopy,
  copied,
}: {
  website: WebsitePlanner;
  onCopy: (platform: string) => void;
  copied: boolean;
}) {
  const [selectedPlatform, setSelectedPlatform] = useState(AI_PLATFORMS[0].id);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bot className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-slate-200">AI Website Prompt Generator</h3>
        </div>

        <p className="text-slate-400 mb-6">
          Generate structured, context-aware prompts for AI website builders. These prompts include
          your brand identity, business foundation, website goals, and selected sections.
        </p>

        {/* Platform Selector */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-3">Target Platform</label>
          <div className="flex flex-wrap gap-2">
            {AI_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedPlatform === platform.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                )}
              >
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Preview */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-slate-200">Generated Prompt</h4>
            <button
              onClick={() => onCopy(selectedPlatform)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Prompt
                </>
              )}
            </button>
          </div>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
            {generatePrompt(website, selectedPlatform)}
          </pre>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-primary-500/5 border border-primary-500/20 rounded-lg p-4">
          <h4 className="font-medium text-primary-400 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Prompt Tips
          </h4>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Fill in all website details for best results</li>
            <li>• Enable sections you want included in the prompt</li>
            <li>• Select features that are important for your project</li>
            <li>• The prompt includes your target audience and goals</li>
            <li>• Copy and paste directly into your AI tool of choice</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function generatePrompt(website: WebsitePlanner, platform: string): string {
  const sections = website.sections.filter((s) => s.enabled).map((s) => s.name).join(', ');
  const features = website.features.filter((f) => f.enabled).map((f) => f.name).join(', ');

  return `Create a professional ${website.websiteType} website for "${website.name}" using ${platform}.

WEBSITE GOAL:
${website.websiteGoal || 'To establish a strong online presence and convert visitors into customers.'}

TARGET AUDIENCE:
${website.targetAudience || 'Business professionals and decision-makers'}

PRIMARY CTA:
${website.primaryCTA || 'Contact Us'}

SECONDARY CTA:
${website.secondaryCTA || 'Learn More'}

${sections ? `\nSECTIONS TO INCLUDE:\n${sections}` : ''}

${features ? `\nFEATURES REQUIRED:\n${features}` : ''}

LANGUAGE: ${website.language}
REGION: ${website.country || 'Global'}

Please provide:
1. Complete website structure with all sections
2. Section-by-section content recommendations
3. UI/UX design suggestions
4. Color scheme and typography recommendations
5. Call-to-action placements and messaging
6. SEO optimization tips
7. Responsive design considerations
8. Accessibility considerations

Generate production-ready specifications that can be implemented in ${platform}.`;
}

// ============================================
// MODALS
// ============================================

function CreateWebsiteModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: { name: string; websiteType: WebsiteType; language: string }) => void;
}) {
  const [name, setName] = useState('');
  const [websiteType, setWebsiteType] = useState<WebsiteType>('corporate');
  const [language, setLanguage] = useState('en');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), websiteType, language });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-200">Create New Website</h2>
          <p className="text-sm text-slate-400">Start planning your website project</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Website Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Acme Corporate Website"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Website Type
            </label>
            <select
              value={websiteType}
              onChange={(e) => setWebsiteType(e.target.value as WebsiteType)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              {WEBSITE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ar">Arabic</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Create Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
