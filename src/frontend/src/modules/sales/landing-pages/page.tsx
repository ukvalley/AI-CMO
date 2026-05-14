'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FileCode,
  Target,
  Layout,
  FileText,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  X,
  Zap,
  Link,
  Eye,
  EyeOff,
  Globe,
  Users,
  AlertCircle,
  Palette,
  Building2,
  Package,
  Swords,
  CheckCircle,
  PenTool,
  RotateCcw,
  GripVertical,
  Copy,
  MessageSquare,
  Clock,
  Hash,
  Tag,
  ArrowRight,
  Layers,
  Image,
  Video,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  Shield,
  Gift,
  HelpCircle,
  List,
  Table,
  MapIcon,
  Phone,
  Mail,
  Send,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDataStore, useCompanyStore } from '@/stores';
import {
  landingPageApi,
  landingPageTemplateApi,
  landingPageExportApi,
} from '@/services/api';
import type {
  LandingPage,
  LandingPageType,
  LandingPageGoal,
  LandingPageStatus,
  LandingPageSection,
  LandingPageSectionType,
  LandingPageTrafficSource,
  LandingPageFramework,
  LandingPageTemplate,
  LandingPageExport,
  ExportFormat,
  FunnelStage,
  Brand,
  BusinessProfile,
  ICP,
  Persona,
  Product,
  Competitor,
  Founder,
  Employee,
} from '@/types/entities';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const LANDING_PAGE_TYPES: { value: LandingPageType; label: string; description: string }[] = [
  { value: 'lead-generation', label: 'Lead Generation', description: 'Capture leads with forms and offers' },
  { value: 'product', label: 'Product Page', description: 'Showcase a specific product' },
  { value: 'service', label: 'Service Page', description: 'Promote a service offering' },
  { value: 'saas', label: 'SaaS Page', description: 'Software subscription landing' },
  { value: 'webinar', label: 'Webinar Registration', description: 'Register attendees for webinars' },
  { value: 'event', label: 'Event Page', description: 'Promote an upcoming event' },
  { value: 'app-download', label: 'App Download', description: 'Drive mobile app installs' },
  { value: 'sales', label: 'Sales Page', description: 'Direct sales conversion page' },
  { value: 'long-form-sales', label: 'Long-Form Sales Letter', description: 'Detailed persuasive sales copy' },
  { value: 'course', label: 'Course Landing Page', description: 'Sell online courses' },
  { value: 'founder-brand', label: 'Founder Brand Page', description: 'Personal brand landing page' },
  { value: 'employee-portfolio', label: 'Employee Portfolio', description: 'Team member showcase' },
  { value: 'consultation-booking', label: 'Consultation Booking', description: 'Book strategy calls' },
  { value: 'demo-booking', label: 'Demo Booking', description: 'Schedule product demos' },
  { value: 'offer', label: 'Offer Page', description: 'Limited-time offer promotion' },
  { value: 'discount-campaign', label: 'Discount Campaign', description: 'Promote discounts and deals' },
  { value: 'launch', label: 'Launch Page', description: 'New product/service launch' },
  { value: 'waitlist', label: 'Waitlist Page', description: 'Collect early interest' },
  { value: 'recruitment', label: 'Recruitment Page', description: 'Hiring and careers' },
  { value: 'affiliate', label: 'Affiliate Page', description: 'Partner and affiliate signups' },
  { value: 'referral', label: 'Referral Page', description: 'Customer referral program' },
  { value: 'case-study', label: 'Case Study Page', description: 'Showcase client success stories' },
  { value: 'industry-specific', label: 'Industry-Specific', description: 'Tailored to an industry niche' },
  { value: 'location-based', label: 'Location-Based', description: 'Local business landing page' },
];

const LANDING_PAGE_GOALS: { value: LandingPageGoal; label: string }[] = [
  { value: 'lead-generation', label: 'Lead Generation' },
  { value: 'demo-booking', label: 'Demo Booking' },
  { value: 'call-booking', label: 'Call Booking' },
  { value: 'product-purchase', label: 'Product Purchase' },
  { value: 'webinar-registration', label: 'Webinar Registration' },
  { value: 'whatsapp-lead', label: 'WhatsApp Lead' },
  { value: 'form-submission', label: 'Form Submission' },
  { value: 'download', label: 'Download' },
  { value: 'consultation-booking', label: 'Consultation Booking' },
  { value: 'email-collection', label: 'Email Collection' },
];

const FUNNEL_STAGES: { value: FunnelStage; label: string; description: string }[] = [
  { value: 'tofu', label: 'TOFU', description: 'Awareness stage' },
  { value: 'mofu', label: 'MOFU', description: 'Consideration stage' },
  { value: 'bofu', label: 'BOFU', description: 'Decision stage' },
];

const TRAFFIC_SOURCES: { value: LandingPageTrafficSource; label: string }[] = [
  { value: 'facebook-ads', label: 'Facebook Ads' },
  { value: 'google-ads', label: 'Google Ads' },
  { value: 'seo', label: 'SEO / Organic' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'social-organic', label: 'Social Organic' },
  { value: 'affiliate', label: 'Affiliate' },
  { value: 'direct', label: 'Direct' },
  { value: 'referral', label: 'Referral' },
];

const FRAMEWORKS: { value: LandingPageFramework; label: string }[] = [
  { value: 'brunson', label: 'Russell Brunson' },
  { value: 'hormozi', label: 'Alex Hormozi' },
  { value: 'ogilvy', label: 'David Ogilvy' },
  { value: 'storybrand', label: 'StoryBrand' },
  { value: 'custom', label: 'Custom Framework' },
];

const DEFAULT_SECTIONS: Array<Partial<LandingPageSection>> = [
  { type: 'hero', name: 'Hero Section', enabled: true, order: 1 },
  { type: 'pain-points', name: 'Pain Points', enabled: true, order: 2 },
  { type: 'solution-explanation', name: 'Solution', enabled: true, order: 3 },
  { type: 'features', name: 'Features', enabled: true, order: 4 },
  { type: 'benefits', name: 'Benefits', enabled: true, order: 5 },
  { type: 'how-it-works', name: 'How It Works', enabled: true, order: 6 },
  { type: 'social-proof', name: 'Social Proof', enabled: true, order: 7 },
  { type: 'testimonials', name: 'Testimonials', enabled: true, order: 8 },
  { type: 'pricing', name: 'Pricing', enabled: false, order: 9 },
  { type: 'offer-breakdown', name: 'Offer Breakdown', enabled: false, order: 10 },
  { type: 'guarantee', name: 'Guarantee', enabled: true, order: 11 },
  { type: 'faqs', name: 'FAQs', enabled: true, order: 12 },
  { type: 'cta-section', name: 'CTA Section', enabled: true, order: 13 },
  { type: 'lead-form', name: 'Lead Form', enabled: false, order: 14 },
];

const STATUS_CONFIG: Record<LandingPageStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'text-yellow-400' },
  review: { label: 'In Review', color: 'text-purple-400' },
  approved: { label: 'Approved', color: 'text-green-400' },
  published: { label: 'Published', color: 'text-primary-400' },
  archived: { label: 'Archived', color: 'text-slate-500' },
};

const SECTION_TYPE_ICONS: Record<string, any> = {
  hero: FileCode,
  'cta-section': Zap,
  'sticky-cta': Zap,
  'floating-cta': Zap,
  'lead-form': Mail,
  'multi-step-form': List,
  'exit-intent': X,
  testimonials: Star,
  'video-testimonials': Video,
  'case-studies': BookOpen,
  'client-logos': Shield,
  'ratings-reviews': Star,
  certifications: Award,
  'media-mentions': Globe,
  'pain-points': AlertCircle,
  'problem-amplification': AlertCircle,
  'solution-explanation': CheckCircle,
  'before-after': ArrowRight,
  'transformation-journey': TrendingUp,
  pricing: BarChart3,
  'offer-breakdown': Gift,
  bonuses: Gift,
  'limited-offer': Clock,
  scarcity: Clock,
  guarantee: Shield,
  'risk-reversal': Shield,
  features: List,
  benefits: Check,
  'comparison-table': Table,
  'how-it-works': Layers,
  'process-explanation': Layers,
  faqs: HelpCircle,
  'industry-insights': Globe,
  'founder-story': Users,
  team: Users,
  mission: Target,
  expertise: Award,
  achievements: Award,
  'social-proof': Star,
  'interactive-faqs': HelpCircle,
  timeline: Clock,
  statistics: BarChart3,
  'video-block': Video,
  'demo-video': Video,
  'product-walkthrough': Eye,
  custom: FileText,
};

const DEFAULT_TEMPLATES: Array<Partial<LandingPageTemplate>> = [
  {
    name: 'SaaS Landing Page',
    description: 'High-converting SaaS signup page with features, pricing, and demo CTA',
    pageType: 'saas',
  },
  {
    name: 'Lead Magnet Landing Page',
    description: 'Free resource download with email capture form',
    pageType: 'lead-generation',
  },
  {
    name: 'Webinar Registration',
    description: 'Registration page with countdown, speaker info, and urgency elements',
    pageType: 'webinar',
  },
  {
    name: 'Consultation Booking',
    description: 'Calendar booking page with trust signals and social proof',
    pageType: 'consultation-booking',
  },
  {
    name: 'Product Launch',
    description: 'New product announcement with waitlist or purchase CTA',
    pageType: 'launch',
  },
  {
    name: 'Case Study Landing Page',
    description: 'Client success story with metrics, quotes, and CTA',
    pageType: 'case-study',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function LandingPagesModule() {
  const companyStore = useCompanyStore();
  const dataStore = useDataStore();

  const { getItems, addItem, updateItem, deleteItem, setActiveCompany, activeCompanyId } = dataStore;

  const companyId = companyStore.activeCompanyId;
  useMemo(() => {
    if (companyId && companyId !== activeCompanyId) {
      setActiveCompany(companyId);
    }
  }, [companyId, activeCompanyId, setActiveCompany]);

  const pages = useMemo(() => (getItems('landingPages') as LandingPage[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const templates = useMemo(() => (getItems('landingPageTemplates') as LandingPageTemplate[]) || [], [getItems, dataStore.data, activeCompanyId]);

  const brand = useMemo(() => getItems('brand') as Brand | null, [getItems]);
  const businessProfile = useMemo(() => (getItems('businessProfiles') as BusinessProfile[])[0], [getItems]);
  const icps = useMemo(() => (getItems('icps') as ICP[]) || [], [getItems]);
  const personas = useMemo(() => (getItems('personas') as Persona[]) || [], [getItems]);
  const products = useMemo(() => (getItems('products') as Product[]) || [], [getItems]);
  const competitors = useMemo(() => (getItems('competitors') as Competitor[]) || [], [getItems]);
  const founders = useMemo(() => (getItems('founders') as Founder[]) || [], [getItems]);
  const employees = useMemo(() => (getItems('employees') as Employee[]) || [], [getItems]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }

    const loadFromApi = async () => {
      setIsLoading(true);
      const [pRes, tRes, eRes] = await Promise.all([
        landingPageApi.getAll(companyId),
        landingPageTemplateApi.getAll(companyId),
        landingPageExportApi.getAll(companyId),
      ]);

      const responses = [
        { name: 'pages', res: pRes },
        { name: 'templates', res: tRes },
        { name: 'exports', res: eRes },
      ];
      responses.forEach(({ name, res }) => {
        if (res.error) {
          console.error(`[LandingPages] API load failed for ${name}:`, res.error, `(status: ${res.status})`);
        }
      });

      const mergeById = <T extends { id: string }>(local: T[], remote: T[]): T[] => {
        const map = new Map<string, T>();
        local.forEach((item) => map.set(item.id, item));
        remote.forEach((item) => {
          if (!map.has(item.id)) map.set(item.id, item);
        });
        return Array.from(map.values());
      };

      if (pRes.data && Array.isArray(pRes.data) && pRes.data.length > 0) {
        const local = (getItems('landingPages') as LandingPage[]) || [];
        dataStore.setItems('landingPages', mergeById(local, pRes.data as LandingPage[]));
      }
      if (tRes.data && Array.isArray(tRes.data) && tRes.data.length > 0) {
        const local = (getItems('landingPageTemplates') as LandingPageTemplate[]) || [];
        dataStore.setItems('landingPageTemplates', mergeById(local, tRes.data as LandingPageTemplate[]));
      }
      if (eRes.data && Array.isArray(eRes.data) && eRes.data.length > 0) {
        const local = (getItems('landingPageExports') as LandingPageExport[]) || [];
        dataStore.setItems('landingPageExports', mergeById(local, eRes.data as LandingPageExport[]));
      }

      setIsLoading(false);
    };

    loadFromApi();
  }, [companyId]);

  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pages' | 'strategy' | 'structure' | 'content' | 'templates' | 'ai-prompt' | 'export'>('pages');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activePage = useMemo(() => pages.find((p) => p.id === activePageId), [pages, activePageId]);

  const handleCreatePage = useCallback(async (data: Partial<LandingPage>) => {
    if (!companyId) return;
    const sections = DEFAULT_SECTIONS.map((s, i) => ({ ...s, id: `section-${Date.now()}-${i}` })) as LandingPageSection[];
    const localId = addItem('landingPages', {
      ...data,
      companyId,
      sections,
      linkedData: {},
      status: 'draft',
      version: 1,
    } as any);
    setActivePageId(localId);

    const response = await landingPageApi.create({
      ...data,
      companyId,
      id: localId,
      sections,
      linkedData: {},
      status: 'draft',
      version: 1,
    });
    if (response.data && (response.data as any).id && (response.data as any).id !== localId) {
      updateItem('landingPages', localId, { id: (response.data as any).id });
      setActivePageId((response.data as any).id);
    }
  }, [companyId, addItem, updateItem]);

  const handleUpdatePage = useCallback(async (id: string, updates: Partial<LandingPage>) => {
    updateItem('landingPages', id, updates);
    await landingPageApi.update(id, updates);
  }, [updateItem]);

  const handleDeletePage = useCallback(async (id: string) => {
    if (confirm('Are you sure? This will delete the landing page and all associated data.')) {
      deleteItem('landingPages', id);
      if (activePageId === id) setActivePageId(null);
      await landingPageApi.delete(id);
    }
  }, [deleteItem, activePageId]);

  const handleApplyTemplate = useCallback((template: LandingPageTemplate) => {
    if (!companyId || !activePage) return;
    handleUpdatePage(activePage.id, {
      sections: (template.sections || []).map((s, i) => ({ ...s, id: `section-${Date.now()}-${i}` })),
      pageType: template.pageType,
    });
  }, [companyId, activePage, handleUpdatePage]);

  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileCode className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Select a Company</h2>
          <p className="text-slate-400">Please select a company to access the Landing Page OS.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading landing page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-slate-800 sticky top-16 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <FileCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Landing Page OS</h1>
                <p className="text-sm text-slate-400">AI-Powered Conversion Planning & Architecture</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activePage && (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <Target className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-slate-200 truncate max-w-[200px]">{activePage.name}</span>
                </div>
              )}

              <select
                value={activePageId || ''}
                onChange={(e) => setActivePageId(e.target.value || null)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              >
                <option value="">Select Page...</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Page
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 flex gap-1 border-t border-slate-800">
          {[
            { id: 'pages', label: 'Pages', icon: FileCode },
            { id: 'strategy', label: 'Strategy', icon: Target },
            { id: 'structure', label: 'Structure', icon: Layout },
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'templates', label: 'Templates', icon: Layers },
            { id: 'ai-prompt', label: 'AI Prompt', icon: Sparkles },
            { id: 'export', label: 'Export', icon: Download },
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
      </header>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'pages' && (
          <PagesTab
            pages={pages}
            onCreate={() => setShowCreateModal(true)}
            onSelect={setActivePageId}
            onDelete={handleDeletePage}
            onUpdateStatus={(id, status) => handleUpdatePage(id, { status })}
          />
        )}

        {activeTab === 'strategy' && activePage && (
          <StrategyTab
            page={activePage}
            brand={brand}
            businessProfile={businessProfile}
            icps={icps}
            personas={personas}
            products={products}
            competitors={competitors}
            founders={founders}
            employees={employees}
            onUpdate={(updates) => handleUpdatePage(activePage.id, updates)}
          />
        )}

        {activeTab === 'structure' && activePage && (
          <StructureTab
            page={activePage}
            onUpdateSections={(sections) => handleUpdatePage(activePage.id, { sections })}
          />
        )}

        {activeTab === 'content' && activePage && (
          <ContentTab
            page={activePage}
            onUpdateSection={(sectionId, updates) => {
              const updatedSections = (activePage.sections || []).map((s) =>
                s.id === sectionId ? { ...s, ...updates } : s
              );
              handleUpdatePage(activePage.id, { sections: updatedSections });
            }}
          />
        )}

        {activeTab === 'templates' && activePage && (
          <TemplatesTab
            templates={templates}
            defaultTemplates={DEFAULT_TEMPLATES}
            onApply={handleApplyTemplate}
          />
        )}

        {activeTab === 'ai-prompt' && activePage && (
          <AIPromptTab
            page={activePage}
            brand={brand}
            businessProfile={businessProfile}
          />
        )}

        {activeTab === 'export' && activePage && (
          <ExportTab page={activePage} />
        )}

        {!activePage && activeTab !== 'pages' && (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-center max-w-md">
              <FileCode className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No Landing Page Selected</h2>
              <p className="text-slate-400 mb-6">Select a landing page from the dropdown or create a new one.</p>
              <button
                onClick={() => setActiveTab('pages')}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium mx-auto transition-colors"
              >
                <FileCode className="w-5 h-5" />
                View Pages
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreatePageModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePage}
        />
      )}
    </div>
  );
}

// ============================================
// PAGES TAB
// ============================================

function PagesTab({
  pages,
  onCreate,
  onSelect,
  onDelete,
  onUpdateStatus,
}: {
  pages: LandingPage[];
  onCreate: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: LandingPageStatus) => void;
}) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = pages.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterType !== 'all' && p.pageType !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(['draft', 'review', 'approved', 'published', 'archived'] as LandingPageStatus[]).map((status) => (
          <div key={status} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className={cn('text-2xl font-bold', STATUS_CONFIG[status].color)}>
              {pages.filter((p) => p.status === status).length}
            </div>
            <div className="text-sm text-slate-400">{STATUS_CONFIG[status].label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
        >
          <option value="all">All Types</option>
          {LANDING_PAGE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <div className="flex-1" />
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Landing Page
        </button>
      </div>

      {/* Pages Grid */}
      {filtered.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <FileCode className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No Landing Pages Yet</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Create your first conversion-focused landing page to start planning high-performing page architecture.
          </p>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg mx-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Page
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((page) => {
            const statusConfig = STATUS_CONFIG[page.status || 'draft'];
            const typeLabel = LANDING_PAGE_TYPES.find((t) => t.value === page.pageType)?.label || page.pageType;
            const enabledSections = page.sections?.filter((s) => s.enabled).length || 0;
            return (
              <div
                key={page.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-200">{page.name}</h3>
                    <p className="text-sm text-slate-400">{typeLabel}</p>
                  </div>
                  <span className={cn('text-xs font-medium', statusConfig.color)}>{statusConfig.label}</span>
                </div>

                <div className="flex items-center gap-3 mb-4 text-xs text-slate-500">
                  <span>{enabledSections} sections</span>
                  <span>{page.sections?.length || 0} total</span>
                  {page.trafficSource && <span className="capitalize">{page.trafficSource.replace('-', ' ')}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelect(page.id)}
                    className="flex-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors"
                  >
                    Open
                  </button>
                  <select
                    value={page.status}
                    onChange={(e) => onUpdateStatus(page.id, e.target.value as LandingPageStatus)}
                    className="px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => onDelete(page.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// STRATEGY TAB
// ============================================

function StrategyTab({
  page,
  brand,
  businessProfile,
  icps,
  personas,
  products,
  competitors,
  founders,
  employees,
  onUpdate,
}: {
  page: LandingPage;
  brand: Brand | null;
  businessProfile: BusinessProfile | undefined;
  icps: ICP[];
  personas: Persona[];
  products: Product[];
  competitors: Competitor[];
  founders: Founder[];
  employees: Employee[];
  onUpdate: (updates: Partial<LandingPage>) => void;
}) {
  const [activeSection, setActiveSection] = useState<'goals' | 'audience' | 'linked'>('goals');
  const linkedData = page.linkedData || {};

  const toggleLinkedId = (type: string, id: string) => {
    const key = `${type}Ids` as keyof typeof linkedData;
    const currentIds = (linkedData[key] as string[]) || [];
    const newIds = currentIds.includes(id)
      ? currentIds.filter((i) => i !== id)
      : [...currentIds, id];
    onUpdate({ linkedData: { ...linkedData, [key]: newIds } });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Basic Info */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Page Name</label>
            <input
              type="text"
              value={page.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Page Type</label>
            <select
              value={page.pageType}
              onChange={(e) => onUpdate({ pageType: e.target.value as LandingPageType })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              {LANDING_PAGE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Primary Goal</label>
            <select
              value={page.primaryGoal}
              onChange={(e) => onUpdate({ primaryGoal: e.target.value as LandingPageGoal })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              {LANDING_PAGE_GOALS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Funnel Stage</label>
            <select
              value={page.funnelStage}
              onChange={(e) => onUpdate({ funnelStage: e.target.value as FunnelStage })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              {FUNNEL_STAGES.map((s) => (
                <option key={s.value} value={s.value}>{s.label} - {s.description}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Traffic Source</label>
            <select
              value={page.trafficSource || ''}
              onChange={(e) => onUpdate({ trafficSource: e.target.value as LandingPageTrafficSource || undefined })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              <option value="">Select source...</option>
              {TRAFFIC_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Conversion Framework</label>
            <select
              value={page.framework || 'custom'}
              onChange={(e) => onUpdate({ framework: e.target.value as LandingPageFramework })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              {FRAMEWORKS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">CTA Goal Text</label>
            <input
              type="text"
              value={page.ctaGoal || ''}
              onChange={(e) => onUpdate({ ctaGoal: e.target.value })}
              placeholder="e.g., Book a free strategy call"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">Headline</label>
          <input
            type="text"
            value={page.headline || ''}
            onChange={(e) => onUpdate({ headline: e.target.value })}
            placeholder="Main page headline"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Subheadline</label>
          <input
            type="text"
            value={page.subHeadline || ''}
            onChange={(e) => onUpdate({ subHeadline: e.target.value })}
            placeholder="Supporting subheadline"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Primary CTA Text</label>
          <input
            type="text"
            value={page.ctaText || ''}
            onChange={(e) => onUpdate({ ctaText: e.target.value })}
            placeholder="e.g., Get Started Free"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Meta Title</label>
          <input
            type="text"
            value={page.metaTitle || ''}
            onChange={(e) => onUpdate({ metaTitle: e.target.value })}
            placeholder="SEO page title"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Meta Description</label>
          <textarea
            value={page.metaDescription || ''}
            onChange={(e) => onUpdate({ metaDescription: e.target.value })}
            placeholder="SEO meta description"
            rows={2}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">SEO Keywords</label>
          <input
            type="text"
            value={page.seoKeywords?.join(', ') || ''}
            onChange={(e) => onUpdate({ seoKeywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            placeholder="keyword1, keyword2, keyword3"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-slate-800">
        {[
          { id: 'goals', label: 'Goals & Offer', icon: Target },
          { id: 'audience', label: 'Brand Context', icon: Palette },
          { id: 'linked', label: 'Linked Modules', icon: Link },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeSection === section.id
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            )}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Goals Section */}
      {activeSection === 'goals' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-400" />
            Landing Page Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LANDING_PAGE_GOALS.map((goal) => {
              const isSelected = page.primaryGoal === goal.value || page.secondaryGoal === goal.value;
              return (
                <button
                  key={goal.value}
                  onClick={() => onUpdate({ primaryGoal: goal.value })}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all',
                    isSelected
                      ? 'bg-primary-500/10 border-primary-500/50'
                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded border flex items-center justify-center mt-0.5',
                        isSelected ? 'bg-primary-500 border-primary-500' : 'border-slate-600'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="font-medium text-slate-200">{goal.label}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">Secondary Goal</label>
            <select
              value={page.secondaryGoal || ''}
              onChange={(e) => onUpdate({ secondaryGoal: e.target.value as LandingPageGoal || undefined })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              <option value="">None</option>
              {LANDING_PAGE_GOALS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">Conversion Goal Description</label>
            <textarea
              value={page.conversionGoal || ''}
              onChange={(e) => onUpdate({ conversionGoal: e.target.value })}
              placeholder="Describe the ideal conversion outcome..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      )}

      {/* Brand Context Section */}
      {activeSection === 'audience' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {brand && (
              <div className="space-y-4">
                <h4 className="font-medium text-slate-200 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary-400" />
                  Brand Voice
                </h4>
                <div className="space-y-3">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Brand Voice</div>
                    <div className="text-slate-200">{brand?.voiceWritingStyle || brand?.voice || 'Not defined'}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Personality</div>
                    <div className="text-slate-200">{brand?.personalityPrimary?.join(', ') || brand?.personality || 'Not defined'}</div>
                  </div>
                </div>
              </div>
            )}

            {!brand && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-400">No Brand Data</div>
                    <div className="text-sm text-slate-400 mt-1">
                      Define your brand in the Brand module to enable brand-aware landing page generation.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-medium text-slate-200 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary-400" />
                Business Context
              </h4>
              {businessProfile ? (
                <div className="space-y-3">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Industry</div>
                    <div className="text-slate-200">{businessProfile?.primaryIndustry || 'Not specified'}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">USP</div>
                    <div className="text-slate-200 text-sm">{businessProfile?.usp || 'Not specified'}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-sm text-amber-400">No business profile defined.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Linked Modules Section */}
      {activeSection === 'linked' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <p className="text-slate-400 mb-6">
            Link data from other modules to enrich your landing page with business context,
            ICP insights, product details, and team information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.length > 0 && (
              <LinkedModuleCard
                title={`Products (${products.length})`}
                icon={Package}
                items={products}
                linkedIds={linkedData.productIds || []}
                onToggle={(id) => toggleLinkedId('product', id)}
              />
            )}

            {icps.length > 0 && (
              <LinkedModuleCard
                title={`ICPs (${icps.length})`}
                icon={Target}
                items={icps}
                linkedIds={linkedData.icpIds || []}
                onToggle={(id) => toggleLinkedId('icp', id)}
              />
            )}

            {personas.length > 0 && (
              <LinkedModuleCard
                title={`Personas (${personas.length})`}
                icon={Users}
                items={personas}
                linkedIds={linkedData.personaIds || []}
                onToggle={(id) => toggleLinkedId('persona', id)}
              />
            )}

            {competitors.length > 0 && (
              <LinkedModuleCard
                title={`Competitors (${competitors.length})`}
                icon={Swords}
                items={competitors}
                linkedIds={linkedData.competitorIds || []}
                onToggle={(id) => toggleLinkedId('competitor', id)}
              />
            )}

            {founders.length > 0 && (
              <LinkedModuleCard
                title={`Founders (${founders.length})`}
                icon={Users}
                items={founders}
                linkedIds={linkedData.founderIds || []}
                onToggle={(id) => toggleLinkedId('founder', id)}
              />
            )}

            {employees.length > 0 && (
              <LinkedModuleCard
                title={`Employees (${employees.length})`}
                icon={Users}
                items={employees}
                linkedIds={linkedData.employeeIds || []}
                onToggle={(id) => toggleLinkedId('employee', id)}
              />
            )}
          </div>

          {products.length === 0 && icps.length === 0 && personas.length === 0 && competitors.length === 0 && founders.length === 0 && employees.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No modules available to link. Add data in:</p>
              <ul className="text-slate-400 mt-2 space-y-1">
                <li>Products module</li>
                <li>ICPs & Personas module</li>
                <li>Competitors module</li>
                <li>Founders module</li>
                <li>Employees module</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LinkedModuleCard({
  title,
  icon: Icon,
  items,
  linkedIds,
  onToggle,
}: {
  title: string;
  icon: any;
  items: Array<{ id: string; name: string }>;
  linkedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
      <h5 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary-400" />
        {title}
      </h5>
      <div className="space-y-2">
        {items.map((item) => {
          const isLinked = linkedIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={cn(
                'w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors',
                isLinked ? 'bg-primary-500/10' : 'hover:bg-slate-800'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center',
                  isLinked ? 'bg-primary-500 border-primary-500' : 'border-slate-600'
                )}
              >
                {isLinked && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={cn('text-sm', isLinked ? 'text-slate-200' : 'text-slate-400')}>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// STRUCTURE TAB
// ============================================

function StructureTab({
  page,
  onUpdateSections,
}: {
  page: LandingPage;
  onUpdateSections: (sections: LandingPageSection[]) => void;
}) {
  const sections = page.sections || [];

  const toggleEnabled = (id: string) => {
    onUpdateSections(
      sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const moveSection = (id: string, direction: -1 | 1) => {
    const index = sections.findIndex((s) => s.id === id);
    if (index === -1) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(newIndex, 0, moved);
    onUpdateSections(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const enabledCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Page Structure</h3>
            <p className="text-sm text-slate-400 mt-1">{enabledCount} of {sections.length} sections enabled</p>
          </div>
        </div>

        <div className="space-y-2">
          {sections
            .sort((a, b) => a.order - b.order)
            .map((section, index) => {
              const IconComp = SECTION_TYPE_ICONS[section.type] || FileText;
              return (
                <div
                  key={section.id}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border transition-colors',
                    section.enabled
                      ? 'bg-slate-800/30 border-slate-700'
                      : 'bg-slate-900/30 border-slate-800 opacity-60'
                  )}
                >
                  <button
                    onClick={() => toggleEnabled(section.id)}
                    className={cn(
                      'w-5 h-5 rounded border flex items-center justify-center transition-colors',
                      section.enabled ? 'bg-primary-500 border-primary-500' : 'border-slate-600'
                    )}
                  >
                    {section.enabled && <Check className="w-3 h-3 text-white" />}
                  </button>

                  <IconComp className={cn('w-5 h-5', section.enabled ? 'text-primary-400' : 'text-slate-600')} />

                  <div className="flex-1">
                    <div className="font-medium text-slate-200">{section.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{section.type.replace(/-/g, ' ')}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveSection(section.id, -1)}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                    <button
                      onClick={() => moveSection(section.id, 1)}
                      disabled={index === sections.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// ============================================
// CONTENT TAB
// ============================================

function ContentTab({
  page,
  onUpdateSection,
}: {
  page: LandingPage;
  onUpdateSection: (id: string, updates: Partial<LandingPageSection>) => void;
}) {
  const enabledSections = (page.sections || []).filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(enabledSections[0]?.id || null);
  const activeSection = enabledSections.find((s) => s.id === activeSectionId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {enabledSections.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <Layout className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No Sections Enabled</h3>
          <p className="text-slate-400">Enable sections in the Structure tab to start adding content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section List */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Sections ({enabledSections.length})</h3>
            {enabledSections.map((section) => {
              const IconComp = SECTION_TYPE_ICONS[section.type] || FileText;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors',
                    activeSectionId === section.id
                      ? 'bg-primary-500/10 border-primary-500/50'
                      : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                  )}
                >
                  <IconComp className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-200">{section.name}</span>
                </button>
              );
            })}
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-2">
            {activeSection && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const IconComp = SECTION_TYPE_ICONS[activeSection.type] || FileText;
                    return <IconComp className="w-5 h-5 text-primary-400" />;
                  })()}
                  <h3 className="text-lg font-semibold text-slate-200">{activeSection.name}</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Headline</label>
                  <input
                    type="text"
                    value={activeSection.headline || ''}
                    onChange={(e) => onUpdateSection(activeSection.id, { headline: e.target.value })}
                    placeholder="Section headline"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Subheadline</label>
                  <input
                    type="text"
                    value={activeSection.subheadline || ''}
                    onChange={(e) => onUpdateSection(activeSection.id, { subheadline: e.target.value })}
                    placeholder="Supporting text"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                  <textarea
                    value={activeSection.description || ''}
                    onChange={(e) => onUpdateSection(activeSection.id, { description: e.target.value })}
                    placeholder="Main content for this section"
                    rows={5}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">CTA Text</label>
                  <input
                    type="text"
                    value={activeSection.cta || ''}
                    onChange={(e) => onUpdateSection(activeSection.id, { cta: e.target.value })}
                    placeholder="Call-to-action text"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Bullet Points</label>
                  <textarea
                    value={activeSection.bulletPoints?.join('\n') || ''}
                    onChange={(e) => onUpdateSection(activeSection.id, { bulletPoints: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="One bullet point per line"
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Trust Statements</label>
                  <textarea
                    value={activeSection.trustStatements?.join('\n') || ''}
                    onChange={(e) => onUpdateSection(activeSection.id, { trustStatements: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="One statement per line"
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">UI/UX Notes</label>
                  <textarea
                    value={activeSection.uiNotes || ''}
                    onChange={(e) => onUpdateSection(activeSection.id, { uiNotes: e.target.value })}
                    placeholder="Design and layout notes"
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Conversion Notes</label>
                  <textarea
                    value={activeSection.conversionNotes || ''}
                    onChange={(e) => onUpdateSection(activeSection.id, { conversionNotes: e.target.value })}
                    placeholder="Conversion optimization notes"
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// TEMPLATES TAB
// ============================================

function TemplatesTab({
  templates,
  defaultTemplates,
  onApply,
}: {
  templates: LandingPageTemplate[];
  defaultTemplates: Array<Partial<LandingPageTemplate>>;
  onApply: (template: LandingPageTemplate) => void;
}) {
  const allTemplates = [...templates, ...(defaultTemplates as LandingPageTemplate[])];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary-400" />
          Landing Page Templates
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Apply a pre-built template to instantly populate your landing page structure with optimized sections.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTemplates.map((template, index) => {
            const typeLabel = LANDING_PAGE_TYPES.find((t) => t.value === template.pageType)?.label || template.pageType || 'General';
            const sectionCount = template.sections?.length || DEFAULT_SECTIONS.length;
            return (
              <div key={template.id || `default-${index}`} className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-200">{template.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{typeLabel}</span>
                </div>
                <p className="text-sm text-slate-400 mb-4">{template.description}</p>
                <div className="text-xs text-slate-500 mb-4">{sectionCount} sections</div>
                <button
                  onClick={() => {
                    const fullTemplate: LandingPageTemplate = {
                      ...template,
                      id: template.id || `template-${Date.now()}`,
                      companyId: '',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      sections: template.sections?.length ? template.sections : DEFAULT_SECTIONS.map((s, i) => ({ ...s, id: `section-${Date.now()}-${i}` })) as LandingPageSection[],
                    };
                    onApply(fullTemplate);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Apply Template
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================
// AI PROMPT TAB
// ============================================

function AIPromptTab({
  page,
  brand,
  businessProfile,
}: {
  page: LandingPage;
  brand: Brand | null;
  businessProfile: BusinessProfile | undefined;
}) {
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    const enabledSections = (page.sections || []).filter((s) => s.enabled).sort((a, b) => a.order - b.order);
    const typeLabel = LANDING_PAGE_TYPES.find((t) => t.value === page.pageType)?.label || page.pageType;
    const goalLabel = LANDING_PAGE_GOALS.find((g) => g.value === page.primaryGoal)?.label || page.primaryGoal;
    const frameworkLabel = FRAMEWORKS.find((f) => f.value === page.framework)?.label || page.framework || 'Custom';

    let prompt = `# LANDING PAGE BUILDER PROMPT

## Project Overview
Build a high-converting **${typeLabel}** landing page.

## Brand Context
- **Brand Name**: ${businessProfile?.name || '[Your Brand]'}
- **Brand Voice**: ${brand?.voiceWritingStyle || brand?.voice || 'Professional'}
- **Brand Personality**: ${brand?.personalityPrimary?.join(', ') || brand?.personality || 'Friendly and trustworthy'}
- **Industry**: ${businessProfile?.primaryIndustry || '[Your Industry]'}
- **USP**: ${businessProfile?.usp || '[Your Unique Selling Proposition]'}

## Page Strategy
- **Primary Goal**: ${goalLabel}
- **Funnel Stage**: ${(page.funnelStage || 'tofu').toUpperCase()}
- **Conversion Framework**: ${frameworkLabel}
- **Traffic Source**: ${page.trafficSource || 'Mixed'}
- **CTA Goal**: ${page.ctaGoal || page.ctaText || '[Main CTA]'}

## Headline & Copy
- **Main Headline**: ${page.headline || '[Write a compelling headline]'}
- **Subheadline**: ${page.subHeadline || '[Supporting subheadline]'}
- **Primary CTA**: ${page.ctaText || '[CTA Button Text]'}

## Page Structure (${enabledSections.length} Sections)
`;

    enabledSections.forEach((section, i) => {
      prompt += `\n### ${i + 1}. ${section.name} (${section.type})
`;
      if (section.headline) prompt += `- **Headline**: ${section.headline}\n`;
      if (section.subheadline) prompt += `- **Subheadline**: ${section.subheadline}\n`;
      if (section.description) prompt += `- **Content**: ${section.description}\n`;
      if (section.cta) prompt += `- **CTA**: ${section.cta}\n`;
      if (section.bulletPoints?.length) prompt += `- **Bullet Points**: ${section.bulletPoints.join(', ')}\n`;
      if (section.trustStatements?.length) prompt += `- **Trust Statements**: ${section.trustStatements.join(', ')}\n`;
      if (section.uiNotes) prompt += `- **Design Notes**: ${section.uiNotes}\n`;
      if (section.conversionNotes) prompt += `- **Conversion Notes**: ${section.conversionNotes}\n`;
    });

    prompt += `
## SEO Requirements
- **Meta Title**: ${page.metaTitle || page.headline || '[Meta Title]'}
- **Meta Description**: ${page.metaDescription || '[Meta Description]'}
- **Keywords**: ${page.seoKeywords?.join(', ') || '[Target Keywords]'}

## Design Style
- Dark theme compatible
- Mobile-first responsive design
- Fast loading, minimal animations
- Strong visual hierarchy
- Clear CTA contrast

## Technical Requirements
- Clean HTML/CSS or React/Next.js
- Form validation and tracking
- Conversion pixel ready
- Schema markup for SEO
`;

    return prompt;
  };

  const prompt = generatePrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            AI Landing Page Prompt
          </h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          This prompt is optimized for AI builders like ChatGPT, Claude, Lovable, Bolt, V0, Framer AI, and Webflow AI.
        </p>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto">
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">{prompt}</pre>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXPORT TAB
// ============================================

function ExportTab({ page }: { page: LandingPage }) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');

  const formats: { value: ExportFormat; label: string; description: string }[] = [
    { value: 'markdown', label: 'Markdown', description: 'Clean .md for documentation and version control' },
    { value: 'html', label: 'HTML', description: 'Structured HTML requirement document' },
    { value: 'docx', label: 'Word Document', description: 'Microsoft Word compatible format for stakeholders' },
  ];

  const generateExportContent = () => {
    const enabledSections = (page.sections || []).filter((s) => s.enabled).sort((a, b) => a.order - b.order);
    const typeLabel = LANDING_PAGE_TYPES.find((t) => t.value === page.pageType)?.label || page.pageType;
    const goalLabel = LANDING_PAGE_GOALS.find((g) => g.value === page.primaryGoal)?.label || page.primaryGoal;

    switch (selectedFormat) {
      case 'markdown':
        return `# Landing Page Requirements: ${page.name}

## Overview
- **Type**: ${typeLabel}
- **Primary Goal**: ${goalLabel}
- **Funnel Stage**: ${(page.funnelStage || 'tofu').toUpperCase()}
- **Status**: ${page.status || 'draft'}
- **Version**: ${page.version || 1}

## Strategy
- **Headline**: ${page.headline || 'N/A'}
- **Subheadline**: ${page.subHeadline || 'N/A'}
- **Primary CTA**: ${page.ctaText || 'N/A'}
- **Conversion Goal**: ${page.conversionGoal || 'N/A'}

## SEO
- **Meta Title**: ${page.metaTitle || 'N/A'}
- **Meta Description**: ${page.metaDescription || 'N/A'}
- **Keywords**: ${page.seoKeywords?.join(', ') || 'N/A'}

## Sections (${enabledSections.length})
${enabledSections.map((s, i) => `\n### ${i + 1}. ${s.name}\n- **Type**: ${s.type}\n- **Headline**: ${s.headline || 'N/A'}\n- **Subheadline**: ${s.subheadline || 'N/A'}\n- **Description**: ${s.description || 'N/A'}\n- **CTA**: ${s.cta || 'N/A'}\n- **Bullets**: ${s.bulletPoints?.join(', ') || 'N/A'}\n- **Trust Statements**: ${s.trustStatements?.join(', ') || 'N/A'}\n- **UI Notes**: ${s.uiNotes || 'N/A'}\n- **Conversion Notes**: ${s.conversionNotes || 'N/A'}`).join('\n')}

---
*Generated by Mengo Landing Page OS*`;

      case 'html':
        return `<!DOCTYPE html>
<html>
<head><title>${page.name} - Requirements</title></head>
<body>
<h1>${page.name}</h1>
<p><strong>Type:</strong> ${typeLabel}</p>
<p><strong>Goal:</strong> ${goalLabel}</p>
<p><strong>Stage:</strong> ${(page.funnelStage || 'tofu').toUpperCase()}</p>
<hr/>
<h2>Sections</h2>
${enabledSections.map((s, i) => `<h3>${i + 1}. ${s.name}</h3><p><strong>Headline:</strong> ${s.headline || 'N/A'}</p><p><strong>Description:</strong> ${s.description || 'N/A'}</p>`).join('')}
</body>
</html>`;

      default:
        return `Landing Page: ${page.name}\nType: ${typeLabel}\nGoal: ${goalLabel}\n\nSections:\n${enabledSections.map((s) => `- ${s.name}: ${s.headline || 'N/A'}`).join('\n')}`;
    }
  };

  const handleExport = () => {
    const content = generateExportContent();
    const ext = selectedFormat === 'markdown' ? 'md' : selectedFormat === 'html' ? 'html' : 'txt';
    const fileName = `${(page.name || 'landing-page').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-requirements.${ext}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary-400" />
          Export Requirements
        </h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-3">Export Format</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {formats.map((fmt) => (
              <button
                key={fmt.value}
                onClick={() => setSelectedFormat(fmt.value)}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  selectedFormat === fmt.value
                    ? 'bg-primary-500/10 border-primary-500/50'
                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                )}
              >
                <div className="font-medium text-slate-200">{fmt.label}</div>
                <div className="text-xs text-slate-500 mt-1">{fmt.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6 max-h-96 overflow-y-auto">
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">{generateExportContent()}</pre>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Requirements
        </button>
      </div>
    </div>
  );
}

// ============================================
// CREATE PAGE MODAL
// ============================================

function CreatePageModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: Partial<LandingPage>) => void;
}) {
  const [name, setName] = useState('');
  const [pageType, setPageType] = useState<LandingPageType>('lead-generation');
  const [primaryGoal, setPrimaryGoal] = useState<LandingPageGoal>('lead-generation');
  const [funnelStage, setFunnelStage] = useState<FunnelStage>('tofu');
  const [trafficSource, setTrafficSource] = useState<LandingPageTrafficSource>('facebook-ads');
  const [framework, setFramework] = useState<LandingPageFramework>('custom');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate({
      name,
      pageType,
      primaryGoal,
      funnelStage,
      trafficSource,
      framework,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-200">Create Landing Page</h2>
          <p className="text-sm text-slate-400">Define your conversion-focused landing page</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Page Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., SaaS Free Trial Landing Page"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Page Type</label>
            <select
              value={pageType}
              onChange={(e) => setPageType(e.target.value as LandingPageType)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              {LANDING_PAGE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Primary Goal</label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as LandingPageGoal)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              >
                {LANDING_PAGE_GOALS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Funnel Stage</label>
              <select
                value={funnelStage}
                onChange={(e) => setFunnelStage(e.target.value as FunnelStage)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              >
                {FUNNEL_STAGES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Traffic Source</label>
              <select
                value={trafficSource}
                onChange={(e) => setTrafficSource(e.target.value as LandingPageTrafficSource)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              >
                {TRAFFIC_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value as LandingPageFramework)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              >
                {FRAMEWORKS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            Create Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}
