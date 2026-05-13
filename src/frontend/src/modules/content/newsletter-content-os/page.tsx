'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Mail,
  Target,
  Calendar,
  Type,
  Sparkles,
  Layout,
  Image,
  CheckCircle,
  Download,
  Settings,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  X,
  Zap,
  Link,
  FileText,
  Globe,
  Users,
  AlertCircle,
  Palette,
  Building2,
  Package,
  Swords,
  Share2,
  BarChart3,
  PanelTop,
  PenTool,
  RotateCcw,
  Eye,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDataStore, useCompanyStore, useTaskStore } from '@/stores';
import {
  newsletterStrategyApi,
  newsletterCalendarApi,
  newsletterTitleApi,
  newsletterPostApi,
  newsletterContentChunkApi,
  newsletterExportApi,
} from '@/services/api';
import type {
  NewsletterStrategy,
  NewsletterGoal,
  FunnelStage,
  ContentDepth,
  NewsletterContentTypeConfig,
  NewsletterCalendar,
  NewsletterFrequency,
  SeasonalCampaign,
  NewsletterCalendarItem,
  NewsletterTitle,
  SubjectLineStyle,
  NewsletterPost,
  NewsletterContentStatus,
  NewsletterSection,
  NewsletterAssetSuggestion,
  NewsletterExport,
  ExportFormat,
  Brand,
  BusinessProfile,
  ICP,
  Persona,
  Product,
  Competitor,
} from '@/types/entities';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const NEWSLETTER_GOALS: { value: NewsletterGoal; label: string; description: string }[] = [
  { value: 'education', label: 'Education', description: 'Teach subscribers valuable skills and knowledge' },
  { value: 'product-awareness', label: 'Product Awareness', description: 'Keep subscribers informed about product updates' },
  { value: 'community-building', label: 'Community Building', description: 'Foster engagement and belonging' },
  { value: 'brand-awareness', label: 'Brand Awareness', description: 'Increase visibility and recognition' },
  { value: 'customer-engagement', label: 'Customer Engagement', description: 'Drive interaction and loyalty' },
  { value: 'retention', label: 'Retention', description: 'Reduce churn and keep subscribers active' },
  { value: 'updates', label: 'Company Updates', description: 'Share news, milestones, and announcements' },
  { value: 'founder-communication', label: 'Founder Communication', description: 'Personal updates from leadership' },
  { value: 'thought-leadership', label: 'Thought Leadership', description: 'Establish expertise and authority' },
];

const FUNNEL_STAGES: { value: FunnelStage; label: string; description: string }[] = [
  { value: 'tofu', label: 'TOFU', description: 'Top of Funnel - Awareness stage' },
  { value: 'mofu', label: 'MOFU', description: 'Middle of Funnel - Consideration stage' },
  { value: 'bofu', label: 'BOFU', description: 'Bottom of Funnel - Decision stage' },
];

const CONTENT_DEPTH_OPTIONS: { value: ContentDepth; label: string; wordRange: string }[] = [
  { value: 'brief', label: 'Brief', wordRange: '150-300 words' },
  { value: 'standard', label: 'Standard', wordRange: '400-800 words' },
  { value: 'deep', label: 'Deep Dive', wordRange: '1000-2000 words' },
  { value: 'comprehensive', label: 'Comprehensive', wordRange: '2500+ words' },
];

const DEFAULT_CONTENT_TYPES: Array<Partial<NewsletterContentTypeConfig>> = [
  { name: 'Educational Newsletter', type: 'educational', enabled: true, percentageAllocation: 25, priority: 1, recommendedLength: 600, funnelPosition: 'tofu', ctaStrategy: 'Read full guide', conversionGoal: 'Click-through' },
  { name: 'Product Updates', type: 'product-update', enabled: true, percentageAllocation: 15, priority: 2, recommendedLength: 400, funnelPosition: 'mofu', ctaStrategy: 'Try new feature', conversionGoal: 'Product adoption' },
  { name: 'Curated Content', type: 'curated', enabled: true, percentageAllocation: 15, priority: 3, recommendedLength: 500, funnelPosition: 'tofu', ctaStrategy: 'Read article', conversionGoal: 'Engagement' },
  { name: 'Community Digest', type: 'community', enabled: true, percentageAllocation: 10, priority: 4, recommendedLength: 400, funnelPosition: 'tofu', ctaStrategy: 'Join community', conversionGoal: 'Community growth' },
  { name: 'Founder Letter', type: 'founder-letter', enabled: true, percentageAllocation: 10, priority: 5, recommendedLength: 800, funnelPosition: 'mofu', ctaStrategy: 'Reply to founder', conversionGoal: 'Relationship building' },
  { name: 'Case Study', type: 'case-study', enabled: true, percentageAllocation: 10, priority: 6, recommendedLength: 700, funnelPosition: 'mofu', ctaStrategy: 'Book demo', conversionGoal: 'Lead capture' },
  { name: 'Industry News', type: 'industry-news', enabled: true, percentageAllocation: 8, priority: 7, recommendedLength: 500, funnelPosition: 'tofu', ctaStrategy: 'Share opinion', conversionGoal: 'Social engagement' },
  { name: 'Promotional', type: 'promotional', enabled: true, percentageAllocation: 7, priority: 8, recommendedLength: 350, funnelPosition: 'bofu', ctaStrategy: 'Claim offer', conversionGoal: 'Direct sale' },
];

const SUBJECT_LINE_STYLES: { value: SubjectLineStyle; label: string; description: string }[] = [
  { value: 'educational', label: 'Educational', description: 'Informative, value-driven subject lines' },
  { value: 'conversational', label: 'Conversational', description: 'Casual, friendly tone like a friend' },
  { value: 'founder-style', label: 'Founder Style', description: 'Personal, authentic founder voice' },
  { value: 'authority', label: 'Authority', description: 'Expert, data-backed subject lines' },
  { value: 'emotional', label: 'Emotional', description: 'Feeling-driven, relatable lines' },
  { value: 'insight', label: 'Insight', description: 'Curiosity-driven, teaser-style lines' },
  { value: 'minimal', label: 'Minimal', description: 'Short, punchy, under 5 words' },
];

const NEWSLETTER_STATUS_CONFIG: Record<NewsletterContentStatus, { label: string; color: string; icon: any }> = {
  planning: { label: 'Planning', color: 'text-slate-400', icon: Target },
  draft: { label: 'Draft', color: 'text-yellow-400', icon: FileText },
  review: { label: 'In Review', color: 'text-purple-400', icon: Eye },
  approved: { label: 'Approved', color: 'text-green-400', icon: CheckCircle },
  published: { label: 'Published', color: 'text-primary-400', icon: Globe },
  archived: { label: 'Archived', color: 'text-slate-500', icon: BookOpen },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getEstimatedReadTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function NewsletterContentOSModule() {
  const companyStore = useCompanyStore();
  const dataStore = useDataStore();
  const taskStore = useTaskStore();

  const { getItems, addItem, updateItem, deleteItem, setActiveCompany, activeCompanyId } = dataStore;

  // Sync company from companyStore to dataStore
  const companyId = companyStore.activeCompanyId;
  useMemo(() => {
    if (companyId && companyId !== activeCompanyId) {
      setActiveCompany(companyId);
    }
  }, [companyId, activeCompanyId, setActiveCompany]);

  // Get data from store
  const strategies = useMemo(() => (getItems('newsletterStrategies') as NewsletterStrategy[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const contentTypes = useMemo(() => (getItems('newsletterContentTypes') as NewsletterContentTypeConfig[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const calendars = useMemo(() => (getItems('newsletterCalendars') as NewsletterCalendar[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const titles = useMemo(() => (getItems('newsletterTitles') as NewsletterTitle[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const posts = useMemo(() => (getItems('newsletterPosts') as NewsletterPost[]) || [], [getItems, dataStore.data, activeCompanyId]);

  // Linked data
  const brand = useMemo(() => getItems('brand') as Brand | null, [getItems]);
  const businessProfile = useMemo(() => (getItems('businessProfiles') as BusinessProfile[])[0], [getItems]);
  const icps = useMemo(() => (getItems('icps') as ICP[]) || [], [getItems]);
  const personas = useMemo(() => (getItems('personas') as Persona[]) || [], [getItems]);
  const products = useMemo(() => (getItems('products') as Product[]) || [], [getItems]);
  const competitors = useMemo(() => (getItems('competitors') as Competitor[]) || [], [getItems]);

  // Load data from API on mount / company change
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }

    const loadFromApi = async () => {
      setIsLoading(true);
      const [sRes, cRes, tRes, pRes, eRes] = await Promise.all([
        newsletterStrategyApi.getAll(companyId),
        newsletterCalendarApi.getAll(companyId),
        newsletterTitleApi.getAll(companyId),
        newsletterPostApi.getAll(companyId),
        newsletterExportApi.getAll(companyId),
      ]);

      const responses = [
        { name: 'strategies', res: sRes },
        { name: 'calendars', res: cRes },
        { name: 'titles', res: tRes },
        { name: 'posts', res: pRes },
        { name: 'exports', res: eRes },
      ];
      responses.forEach(({ name, res }) => {
        if (res.error) {
          console.error(`[NewsletterContentOS] API load failed for ${name}:`, res.error, `(status: ${res.status})`);
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

      if (sRes.data && Array.isArray(sRes.data) && sRes.data.length > 0) {
        const local = (getItems('newsletterStrategies') as NewsletterStrategy[]) || [];
        dataStore.setItems('newsletterStrategies', mergeById(local, sRes.data as NewsletterStrategy[]));
      }
      if (cRes.data && Array.isArray(cRes.data) && cRes.data.length > 0) {
        const local = (getItems('newsletterCalendars') as NewsletterCalendar[]) || [];
        dataStore.setItems('newsletterCalendars', mergeById(local, cRes.data as NewsletterCalendar[]));
      }
      if (tRes.data && Array.isArray(tRes.data) && tRes.data.length > 0) {
        const local = (getItems('newsletterTitles') as NewsletterTitle[]) || [];
        dataStore.setItems('newsletterTitles', mergeById(local, tRes.data as NewsletterTitle[]));
      }
      if (pRes.data && Array.isArray(pRes.data) && pRes.data.length > 0) {
        const local = (getItems('newsletterPosts') as NewsletterPost[]) || [];
        dataStore.setItems('newsletterPosts', mergeById(local, pRes.data as NewsletterPost[]));
      }
      if (eRes.data && Array.isArray(eRes.data) && eRes.data.length > 0) {
        const local = (getItems('newsletterExports') as NewsletterExport[]) || [];
        dataStore.setItems('newsletterExports', mergeById(local, eRes.data as NewsletterExport[]));
      }

      setIsLoading(false);
    };

    loadFromApi();
  }, [companyId]);

  // Active selections
  const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'strategy' | 'types' | 'calendar' | 'titles' | 'content' | 'assets' | 'review' | 'export'>('strategy');
  const [showCreateStrategyModal, setShowCreateStrategyModal] = useState(false);

  const activeStrategy = useMemo(() => strategies.find((s) => s.id === activeStrategyId), [strategies, activeStrategyId]);

  // Strategy actions
  const handleCreateStrategy = useCallback(async (data: Partial<NewsletterStrategy>) => {
    if (!companyId) return;
    const localId = addItem('newsletterStrategies', {
      ...data,
      companyId,
      linkedData: {},
    } as any);
    setActiveStrategyId(localId);

    DEFAULT_CONTENT_TYPES.forEach((type) => {
      addItem('newsletterContentTypes', {
        ...type,
        strategyId: localId,
        companyId,
      } as any);
    });

    const response = await newsletterStrategyApi.create({
      ...data,
      companyId,
      id: localId,
      linkedData: {},
    });
    if (response.data && (response.data as any).id && (response.data as any).id !== localId) {
      updateItem('newsletterStrategies', localId, { id: (response.data as any).id });
      setActiveStrategyId((response.data as any).id);
    }
  }, [companyId, addItem, updateItem]);

  const handleUpdateStrategy = useCallback(async (id: string, updates: Partial<NewsletterStrategy>) => {
    updateItem('newsletterStrategies', id, updates);
    await newsletterStrategyApi.update(id, updates);
  }, [updateItem]);

  const handleDeleteStrategy = useCallback(async (id: string) => {
    if (confirm('Are you sure? This will delete the strategy and all associated data.')) {
      deleteItem('newsletterStrategies', id);
      if (activeStrategyId === id) setActiveStrategyId(null);
      await newsletterStrategyApi.delete(id);
    }
  }, [deleteItem, activeStrategyId]);

  // Title generation
  const handleGenerateTitles = useCallback(async (count: number = 10, style: SubjectLineStyle = 'educational') => {
    if (!activeStrategyId || !activeStrategy) return;

    const taskId = taskStore.createTask(
      `Generate ${count} Newsletter Titles`,
      'newsletter-content-os',
      count
    );

    const brandContext = brand ? `Brand: ${brand.voice || 'professional'}, Tone: ${brand.personality || 'friendly'}` : '';
    const businessContext = businessProfile ? `Industry: ${businessProfile.primaryIndustry || 'general'}` : '';
    const enabledTypes = contentTypes.filter((t) => t.enabled && t.strategyId === activeStrategyId);

    setTimeout(async () => {
      const titlesToCreate: any[] = [];
      for (let i = 0; i < count; i++) {
        const contentType = enabledTypes[i % enabledTypes.length] || enabledTypes[0];
        const result = generateSampleTitle(contentType?.type || 'educational', style, brandContext, businessContext);

        const titleData = {
          strategyId: activeStrategyId,
          title: result.title,
          subjectLine: result.subjectLine,
          previewText: result.previewText,
          contentType: contentType?.type || 'educational',
          style,
          engagementScore: Math.floor(Math.random() * 30) + 70,
          funnelStage: contentType?.funnelPosition || 'tofu',
          suggestedKeywords: generateKeywords(contentType?.type || 'educational'),
          suggestedCTA: contentType?.ctaStrategy || 'Learn more',
          status: 'generated',
          order: i,
          companyId,
        };

        addItem('newsletterTitles', titleData as any);
        titlesToCreate.push(titleData);
      }

      await Promise.all(titlesToCreate.map((t) => newsletterTitleApi.create(t)));
      taskStore.completeBatch(taskId, 0, Array(count).fill('title'));
    }, 2000);
  }, [activeStrategyId, activeStrategy, contentTypes, brand, businessProfile, addItem, taskStore, companyId]);

  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Mail className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Select a Company</h2>
          <p className="text-slate-400">Please select a company to access the Newsletter Content OS.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading newsletter data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Newsletter Content OS</h1>
                <p className="text-sm text-slate-400">AI-Powered Newsletter Strategy & Generation</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeStrategy && (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <Target className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-slate-200">{activeStrategy.name}</span>
                </div>
              )}

              <select
                value={activeStrategyId || ''}
                onChange={(e) => setActiveStrategyId(e.target.value || null)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              >
                <option value="">Select Strategy...</option>
                {strategies.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <button
                onClick={() => setShowCreateStrategyModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Strategy
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 flex gap-1 border-t border-slate-800">
          {[
            { id: 'strategy', label: 'Strategy', icon: Target },
            { id: 'types', label: 'Content Types', icon: Layout },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'titles', label: 'Titles', icon: Type },
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'assets', label: 'Assets', icon: Image },
            { id: 'review', label: 'Review', icon: CheckCircle },
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
      <main className="p-6">
        {!activeStrategyId ? (
          <EmptyState onCreate={() => setShowCreateStrategyModal(true)} />
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'strategy' && (
              <StrategyTab
                strategy={activeStrategy!}
                brand={brand}
                businessProfile={businessProfile}
                icps={icps}
                personas={personas}
                products={products}
                competitors={competitors}
                onUpdate={(updates) => handleUpdateStrategy(activeStrategy!.id, updates)}
              />
            )}

            {activeTab === 'types' && activeStrategy && (
              <ContentTypesTab
                strategyId={activeStrategy.id}
                contentTypes={contentTypes.filter((t) => t.strategyId === activeStrategy.id)}
                onUpdate={(id, updates) => updateItem('newsletterContentTypes', id, updates)}
              />
            )}

            {activeTab === 'calendar' && activeStrategy && (
              <CalendarTab
                strategy={activeStrategy}
                calendars={calendars.filter((c) => c.strategyId === activeStrategy.id)}
                onCreateCalendar={async (data) => {
                  const localId = addItem('newsletterCalendars', { ...data, strategyId: activeStrategy.id } as any);
                  const res = await newsletterCalendarApi.create({ ...data, strategyId: activeStrategy.id, id: localId, companyId });
                  if (res.data && (res.data as any).id && (res.data as any).id !== localId) {
                    updateItem('newsletterCalendars', localId, { id: (res.data as any).id });
                  }
                }}
                onUpdateCalendar={async (id, updates) => {
                  updateItem('newsletterCalendars', id, updates);
                  await newsletterCalendarApi.update(id, updates);
                }}
              />
            )}

            {activeTab === 'titles' && activeStrategy && (
              <TitlesTab
                strategy={activeStrategy}
                contentTypes={contentTypes.filter((t) => t.strategyId === activeStrategy.id)}
                titles={titles.filter((t) => t.strategyId === activeStrategy.id)}
                onGenerate={handleGenerateTitles}
                onUpdate={async (id, updates) => {
                  updateItem('newsletterTitles', id, updates);
                  await newsletterTitleApi.update(id, updates);
                }}
                onDelete={async (id) => {
                  deleteItem('newsletterTitles', id);
                  await newsletterTitleApi.delete(id);
                }}
              />
            )}

            {activeTab === 'content' && activeStrategy && (
              <ContentTab
                strategy={activeStrategy}
                posts={posts.filter((p) => p.strategyId === activeStrategy.id)}
                titles={titles.filter((t) => t.strategyId === activeStrategy.id && t.status === 'selected')}
                contentTypes={contentTypes.filter((t) => t.strategyId === activeStrategy.id)}
                onCreatePost={async (data) => {
                  const localId = addItem('newsletterPosts', data as any);
                  const res = await newsletterPostApi.create({ ...data, id: localId, companyId });
                  if (res.data && (res.data as any).id && (res.data as any).id !== localId) {
                    updateItem('newsletterPosts', localId, { id: (res.data as any).id });
                  }
                }}
                onUpdatePost={async (id, updates) => {
                  updateItem('newsletterPosts', id, updates);
                  await newsletterPostApi.update(id, updates);
                }}
                onDeletePost={async (id) => {
                  deleteItem('newsletterPosts', id);
                  await newsletterPostApi.delete(id);
                }}
              />
            )}

            {activeTab === 'assets' && activeStrategy && (
              <AssetsTab
                strategy={activeStrategy}
                posts={posts.filter((p) => p.strategyId === activeStrategy.id)}
              />
            )}

            {activeTab === 'review' && activeStrategy && (
              <ReviewTab
                strategy={activeStrategy}
                posts={posts.filter((p) => p.strategyId === activeStrategy.id)}
                onUpdatePost={async (id, updates) => {
                  updateItem('newsletterPosts', id, updates);
                  await newsletterPostApi.update(id, updates);
                }}
              />
            )}

            {activeTab === 'export' && activeStrategy && (
              <ExportTab
                strategy={activeStrategy}
                posts={posts.filter((p) => p.strategyId === activeStrategy.id && ['approved', 'published'].includes(p.status))}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateStrategyModal && (
        <CreateStrategyModal
          onClose={() => setShowCreateStrategyModal(false)}
          onCreate={handleCreateStrategy}
        />
      )}
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Newsletter Strategy Yet</h2>
        <p className="text-slate-400 mb-6">
          Create your first newsletter content strategy to start planning engaging, brand-aligned newsletters that build subscriber loyalty.
        </p>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium mx-auto transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Strategy
        </button>
      </div>
    </div>
  );
}

// ============================================
// STRATEGY TAB
// ============================================

function StrategyTab({
  strategy,
  brand,
  businessProfile,
  icps,
  personas,
  products,
  competitors,
  onUpdate,
}: {
  strategy: NewsletterStrategy;
  brand: Brand | null;
  businessProfile: BusinessProfile | undefined;
  icps: ICP[];
  personas: Persona[];
  products: Product[];
  competitors: Competitor[];
  onUpdate: (updates: Partial<NewsletterStrategy>) => void;
}) {
  const [activeSection, setActiveSection] = useState<'goals' | 'audience' | 'linked'>('goals');
  const linkedData = strategy.linkedData || {};

  const toggleLinkedId = (type: string, id: string) => {
    const key = `${type}Ids` as keyof typeof linkedData;
    const currentIds = (linkedData[key] as string[]) || [];
    const newIds = currentIds.includes(id)
      ? currentIds.filter((i) => i !== id)
      : [...currentIds, id];
    onUpdate({
      linkedData: { ...linkedData, [key]: newIds },
    });
  };

  const toggleSingleLink = (type: string, id: string) => {
    const key = `${type}Id` as keyof typeof linkedData;
    const currentId = linkedData[key] as string | undefined;
    onUpdate({
      linkedData: { ...linkedData, [key]: currentId === id ? undefined : id },
    });
  };

  return (
    <div className="space-y-6">
      {/* Strategy Header */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Strategy Name</label>
            <input
              type="text"
              value={strategy.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              placeholder="e.g., Q1 2026 Newsletter Strategy"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Objective</label>
              <select
                value={strategy.objective || 'education'}
                onChange={(e) => onUpdate({ objective: e.target.value as NewsletterGoal })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              >
                {NEWSLETTER_GOALS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Content Depth</label>
              <select
                value={strategy.contentDepth || 'standard'}
                onChange={(e) => onUpdate({ contentDepth: e.target.value as ContentDepth })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              >
                {CONTENT_DEPTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label} ({opt.wordRange})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Industry</label>
            <input
              type="text"
              value={strategy.industry || ''}
              onChange={(e) => onUpdate({ industry: e.target.value })}
              placeholder="e.g., SaaS"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Audience</label>
            <input
              type="text"
              value={strategy.audience || ''}
              onChange={(e) => onUpdate({ audience: e.target.value })}
              placeholder="e.g., Marketing Managers"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Funnel Stage</label>
            <select
              value={strategy.funnelStage || 'tofu'}
              onChange={(e) => onUpdate({ funnelStage: e.target.value as FunnelStage })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              {FUNNEL_STAGES.map((stage) => (
                <option key={stage.value} value={stage.value}>{stage.label} - {stage.description}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">CTA Goal</label>
          <input
            type="text"
            value={strategy.ctaGoal || ''}
            onChange={(e) => onUpdate({ ctaGoal: e.target.value })}
            placeholder="e.g., Drive traffic to blog"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">Communication Tone</label>
          <input
            type="text"
            value={strategy.communicationTone || ''}
            onChange={(e) => onUpdate({ communicationTone: e.target.value })}
            placeholder="e.g., Friendly, professional, conversational"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-slate-800">
        {[
          { id: 'goals', label: 'Objective', icon: Target },
          { id: 'audience', label: 'Audience Context', icon: Users },
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
            Newsletter Objective
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NEWSLETTER_GOALS.map((goal) => {
              const isSelected = strategy.objective === goal.value;
              return (
                <button
                  key={goal.value}
                  onClick={() => onUpdate({ objective: goal.value })}
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
                    <div>
                      <div className="font-medium text-slate-200">{goal.label}</div>
                      <div className="text-sm text-slate-400 mt-1">{goal.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Audience Context Section */}
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
                    <div className="text-slate-200">{brand.voiceWritingStyle || brand.voice || 'Not defined'}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Personality</div>
                    <div className="text-slate-200">{brand.personalityPrimary?.join(', ') || brand.personality || 'Not defined'}</div>
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
                      Define your brand in the Brand module to enable brand-aware content generation.
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
                    <div className="text-slate-200">{businessProfile.primaryIndustry || 'Not specified'}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Description</div>
                    <div className="text-slate-200 text-sm">{businessProfile.description || 'Not specified'}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">USP</div>
                    <div className="text-slate-200 text-sm">{businessProfile.usp || 'Not specified'}</div>
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
            Link data from other modules to enrich your newsletter generation with business context,
            ICP insights, product details, and competitive intelligence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {icps.length > 0 && (
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h5 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary-400" />
                  ICPs ({icps.length})
                </h5>
                <div className="space-y-2">
                  {icps.map((icp) => {
                    const isLinked = linkedData.icpIds?.includes(icp.id);
                    return (
                      <button
                        key={icp.id}
                        onClick={() => toggleLinkedId('icp', icp.id)}
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
                        <span className={cn('text-sm', isLinked ? 'text-slate-200' : 'text-slate-400')}>{icp.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {personas.length > 0 && (
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h5 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary-400" />
                  Buyer Personas ({personas.length})
                </h5>
                <div className="space-y-2">
                  {personas.map((persona) => {
                    const isLinked = linkedData.personaIds?.includes(persona.id);
                    return (
                      <button
                        key={persona.id}
                        onClick={() => toggleLinkedId('persona', persona.id)}
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
                        <span className={cn('text-sm', isLinked ? 'text-slate-200' : 'text-slate-400')}>{persona.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {products.length > 0 && (
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h5 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary-400" />
                  Products ({products.length})
                </h5>
                <div className="space-y-2">
                  {products.map((product) => {
                    const isLinked = linkedData.productIds?.includes(product.id);
                    return (
                      <button
                        key={product.id}
                        onClick={() => toggleLinkedId('product', product.id)}
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
                        <span className={cn('text-sm', isLinked ? 'text-slate-200' : 'text-slate-400')}>{product.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {competitors.length > 0 && (
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h5 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-primary-400" />
                  Competitors ({competitors.length})
                </h5>
                <div className="space-y-2">
                  {competitors.map((competitor) => {
                    const isLinked = linkedData.competitorIds?.includes(competitor.id);
                    return (
                      <button
                        key={competitor.id}
                        onClick={() => toggleLinkedId('competitor', competitor.id)}
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
                        <span className={cn('text-sm', isLinked ? 'text-slate-200' : 'text-slate-400')}>{competitor.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {icps.length === 0 && personas.length === 0 && products.length === 0 && competitors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No modules available to link. Add data in:</p>
              <ul className="text-slate-400 mt-2 space-y-1">
                <li>ICPs & Personas module</li>
                <li>Products module</li>
                <li>Competitors module</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// CONTENT TYPES TAB
// ============================================

function ContentTypesTab({
  strategyId,
  contentTypes,
  onUpdate,
}: {
  strategyId: string;
  contentTypes: NewsletterContentTypeConfig[];
  onUpdate: (id: string, updates: Partial<NewsletterContentTypeConfig>) => void;
}) {
  const enabledTypes = contentTypes.filter((t) => t.enabled);
  const totalAllocation = enabledTypes.reduce((sum, t) => sum + t.percentageAllocation, 0);

  const toggleEnabled = (id: string, current: boolean) => {
    onUpdate(id, { enabled: !current });
  };

  const updateAllocation = (id: string, value: number) => {
    onUpdate(id, { percentageAllocation: Math.max(0, Math.min(100, value)) });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Content Mix Allocation</h3>
            <p className="text-sm text-slate-400 mt-1">{enabledTypes.length} content types enabled</p>
          </div>
          <div className="text-right">
            <div
              className={cn(
                'text-2xl font-bold',
                totalAllocation === 100 ? 'text-green-400' : totalAllocation > 100 ? 'text-red-400' : 'text-amber-400'
              )}
            >
              {totalAllocation}%
            </div>
            <div className="text-xs text-slate-500">{totalAllocation === 100 ? 'Perfect balance' : totalAllocation > 100 ? 'Over allocated' : 'Under allocated'}</div>
          </div>
        </div>

        <div className="h-4 bg-slate-900 rounded-full overflow-hidden flex">
          {enabledTypes.map((type, index) => {
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500', 'bg-lime-500', 'bg-rose-500', 'bg-violet-500'];
            return (
              <div
                key={type.id}
                className={colors[index % colors.length]}
                style={{ width: `${type.percentageAllocation}%` }}
                title={`${type.name}: ${type.percentageAllocation}%`}
              />
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          {enabledTypes.map((type, index) => {
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500', 'bg-lime-500', 'bg-rose-500', 'bg-violet-500'];
            return (
              <div key={type.id} className="flex items-center gap-2 text-sm">
                <div className={cn('w-3 h-3 rounded', colors[index % colors.length])} />
                <span className="text-slate-300">{type.name}</span>
                <span className="text-slate-500">({type.percentageAllocation}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200">Configure Content Types</h3>
        </div>

        <div className="divide-y divide-slate-700">
          {contentTypes
            .sort((a, b) => a.priority - b.priority)
            .map((type) => (
              <div key={type.id} className={cn('p-6 transition-colors', type.enabled ? 'bg-slate-800/30' : 'bg-slate-900/30 opacity-60')}>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleEnabled(type.id, type.enabled)}
                    className={cn(
                      'mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors',
                      type.enabled ? 'bg-primary-500 border-primary-500' : 'border-slate-600'
                    )}
                  >
                    {type.enabled && <Check className="w-3 h-3 text-white" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-slate-200">{type.name}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-300">{type.funnelPosition.toUpperCase()}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="text-sm text-slate-400">
                        <span className="text-slate-500">Recommended Length: </span>{type.recommendedLength} words
                      </div>
                      <div className="text-sm text-slate-400">
                        <span className="text-slate-500">CTA Strategy: </span>{type.ctaStrategy}
                      </div>
                    </div>

                    {type.enabled && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-400">Allocation</span>
                            <span className="text-sm font-medium text-slate-200">{type.percentageAllocation}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={type.percentageAllocation}
                            onChange={(e) => updateAllocation(type.id, parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={type.conversionGoal}
                            onChange={(e) => onUpdate(type.id, { conversionGoal: e.target.value })}
                            placeholder="Conversion goal..."
                            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-primary-500"
                          />
                          <input
                            type="number"
                            value={type.priority}
                            onChange={(e) => onUpdate(type.id, { priority: parseInt(e.target.value) })}
                            placeholder="Priority (1-10)"
                            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-primary-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// CALENDAR TAB
// ============================================

function CalendarTab({
  strategy,
  calendars,
  onCreateCalendar,
  onUpdateCalendar,
}: {
  strategy: NewsletterStrategy;
  calendars: NewsletterCalendar[];
  onCreateCalendar: (data: Partial<NewsletterCalendar>) => void;
  onUpdateCalendar: (id: string, updates: Partial<NewsletterCalendar>) => void;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const activeCalendar = calendars[0];

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      daily: 'Every Day',
      weekly: 'Once per week',
      'bi-weekly': 'Twice per week',
      monthly: 'Once per month',
      quarterly: 'Once per quarter',
    };
    return labels[freq] || freq;
  };

  return (
    <div className="space-y-6">
      {!activeCalendar ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No Calendar Created</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Create a publishing calendar to schedule your newsletters and track your content pipeline.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg mx-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Calendar
          </button>
        </div>
      ) : (
        <>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-200">{activeCalendar.name}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-slate-400">Frequency: {getFrequencyLabel(activeCalendar.frequency)}</span>
                  <span className="text-sm text-slate-400">Newsletters per cycle: {activeCalendar.newslettersPerCycle}</span>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors"
              >
                <Settings className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Publishing Schedule</h4>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const isPublishingDay = activeCalendar.publishingDays.includes(day.toLowerCase());
                  return (
                    <div
                      key={day}
                      className={cn(
                        'p-3 rounded-lg text-center border',
                        isPublishingDay
                          ? 'bg-primary-500/10 border-primary-500/30'
                          : 'bg-slate-900/50 border-slate-700'
                      )}
                    >
                      <div className="text-xs text-slate-500">{day.slice(0, 3)}</div>
                      {isPublishingDay && <div className="mt-1 w-2 h-2 bg-primary-500 rounded-full mx-auto" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3">Content Pipeline ({activeCalendar.timeline.length} newsletters)</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeCalendar.timeline.slice(0, 20).map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="text-sm font-medium text-slate-500 w-8">#{index + 1}</div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-200">{item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'Not scheduled'}</div>
                      <div className="text-xs text-slate-500">Status: {item.status}</div>
                    </div>
                    <div
                      className={cn(
                        'px-2 py-1 rounded text-xs',
                        item.status === 'empty' && 'bg-slate-700 text-slate-400',
                        item.status === 'planned' && 'bg-blue-500/20 text-blue-400',
                        item.status === 'title-generated' && 'bg-purple-500/20 text-purple-400',
                        item.status === 'assigned' && 'bg-amber-500/20 text-amber-400',
                        item.status === 'in-progress' && 'bg-orange-500/20 text-orange-400',
                        item.status === 'ready' && 'bg-green-500/20 text-green-400'
                      )}
                    >
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {showCreateModal && (
        <CreateCalendarModal
          strategy={strategy}
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreateCalendar}
        />
      )}
    </div>
  );
}

function CreateCalendarModal({
  strategy,
  onClose,
  onCreate,
}: {
  strategy: NewsletterStrategy;
  onClose: () => void;
  onCreate: (data: Partial<NewsletterCalendar>) => void;
}) {
  const [name, setName] = useState(strategy.name + ' Calendar');
  const [frequency, setFrequency] = useState<NewsletterFrequency>('weekly');
  const [newslettersPerCycle, setNewslettersPerCycle] = useState(4);
  const [publishingDays, setPublishingDays] = useState<string[]>(['tuesday']);

  const weekDays = [
    { value: 'sunday', label: 'Sunday' },
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
  ];

  const toggleDay = (day: string) => {
    setPublishingDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleSubmit = () => {
    const timeline: NewsletterCalendarItem[] = [];
    const startDate = new Date();

    for (let i = 0; i < newslettersPerCycle; i++) {
      timeline.push({
        id: `calendar-item-${i}`,
        scheduledDate: new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'empty',
      });
    }

    onCreate({
      name,
      frequency,
      newslettersPerCycle,
      publishingDays,
      timeline,
      startDate: startDate.toISOString(),
      priorityTopics: [],
      seasonalCampaigns: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-200">Create Newsletter Calendar</h2>
          <p className="text-sm text-slate-400">Set up your publishing schedule</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Calendar Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Publishing Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as NewsletterFrequency)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Newsletters per Cycle</label>
            <input
              type="number"
              min="1"
              max="52"
              value={newslettersPerCycle}
              onChange={(e) => setNewslettersPerCycle(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Publishing Days</label>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const isSelected = publishingDays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    onClick={() => toggleDay(day.value)}
                    className={cn(
                      'p-2 text-center text-sm rounded-lg transition-colors',
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    )}
                  >
                    {day.label.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!name || publishingDays.length === 0}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            Create Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TITLES TAB
// ============================================

function TitlesTab({
  strategy,
  contentTypes,
  titles,
  onGenerate,
  onUpdate,
  onDelete,
}: {
  strategy: NewsletterStrategy;
  contentTypes: NewsletterContentTypeConfig[];
  titles: NewsletterTitle[];
  onGenerate: (count: number, style: SubjectLineStyle) => void;
  onUpdate: (id: string, updates: Partial<NewsletterTitle>) => void;
  onDelete: (id: string) => void;
}) {
  const [selectedStyle, setSelectedStyle] = useState<SubjectLineStyle>('educational');
  const [generateCount, setGenerateCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedTitles = titles.filter((t) => t.status === 'selected').sort((a, b) => a.order - b.order);
  const generatedTitles = titles.filter((t) => t.status === 'generated');

  const handleGenerate = async () => {
    setIsGenerating(true);
    await onGenerate(generateCount, selectedStyle);
    setIsGenerating(false);
  };

  const handleSelect = (title: NewsletterTitle) => {
    onUpdate(title.id, { status: 'selected', order: selectedTitles.length });
  };

  const handleReject = (title: NewsletterTitle) => {
    onUpdate(title.id, { status: 'rejected' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-400" />
          AI Title & Subject Line Generator
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Subject Line Style</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as SubjectLineStyle)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              {SUBJECT_LINE_STYLES.map((style) => (
                <option key={style.value} value={style.value}>{style.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Number of Titles</label>
            <input
              type="number"
              min="1"
              max="50"
              value={generateCount}
              onChange={(e) => setGenerateCount(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || contentTypes.filter((t) => t.enabled).length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors w-full justify-center"
            >
              {isGenerating ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Zap className="w-4 h-4" /> Generate Titles</>
              )}
            </button>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          Using: <span className="text-primary-400">Ollama Cloud GLM 5.1</span> |
          Context: {strategy.audience || 'General audience'} |
          Content types: {contentTypes.filter((t) => t.enabled).length} enabled
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-slate-200">Editorial Pipeline ({selectedTitles.length})</h3>
          </div>

          <div className="divide-y divide-slate-700">
            {selectedTitles.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No titles selected yet. Select titles from the generated list.</div>
            ) : (
              selectedTitles.map((title) => (
                <div key={title.id} className="p-4 bg-slate-800/30">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-slate-200">{title.title}</div>
                      <div className="text-sm text-primary-400 mt-1">{title.subjectLine}</div>
                      <div className="text-xs text-slate-500 mt-1">{title.previewText}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">Engagement: {title.engagementScore}/100</span>
                        <span className="text-xs text-slate-500">{title.funnelStage.toUpperCase()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDelete(title.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="font-semibold text-slate-200">Generated Titles ({generatedTitles.length})</h3>
          </div>

          <div className="divide-y divide-slate-700 max-h-[500px] overflow-y-auto">
            {generatedTitles.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No titles generated yet. Click "Generate Titles" to start.</div>
            ) : (
              generatedTitles.map((title) => (
                <div key={title.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-slate-200">{title.title}</div>
                      <div className="text-sm text-primary-400 mt-1">{title.subjectLine}</div>
                      <div className="text-xs text-slate-500 mt-1">{title.previewText}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          title.engagementScore >= 80 && 'bg-green-500/20 text-green-400',
                          title.engagementScore >= 60 && title.engagementScore < 80 && 'bg-yellow-500/20 text-yellow-400',
                          title.engagementScore < 60 && 'bg-red-500/20 text-red-400'
                        )}>
                          Engagement {title.engagementScore}
                        </span>
                        <span className="text-xs text-slate-500 capitalize">{title.contentType}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelect(title)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Select
                      </button>
                      <button
                        onClick={() => handleReject(title)}
                        className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateSampleTitle(
  contentType: string,
  style: string,
  _brandContext: string,
  _businessContext: string
): { title: string; subjectLine: string; previewText: string } {
  const topics = [
    'Marketing Automation', 'SEO Strategy', 'Content Marketing', 'Social Media Growth',
    'Lead Generation', 'Brand Building', 'Customer Retention', 'Email Marketing',
    'Conversion Optimisation', 'Data Analytics', 'AI in Marketing', 'Influencer Partnerships',
    'Video Marketing', 'Podcasting', 'Webinar Strategy',
  ];
  const topic = topics[Math.floor(Math.random() * topics.length)];

  const titleTemplates: Record<string, string[]> = {
    educational: [
      `The Complete Guide to ${topic}`,
      `How to Master ${topic} in 30 Days`,
      `${topic}: Everything You Need to Know`,
      `Top Strategies for ${topic} Success`,
      `Understanding ${topic} from Scratch`,
    ],
    conversational: [
      `Let us Talk About ${topic}`,
      `What No One Tells You About ${topic}`,
      `I Was Wrong About ${topic}`,
      `Quick Thought on ${topic}`,
      `Here is What I Learned About ${topic}`,
    ],
    'founder-style': [
      `Why ${topic} Matters to Our Mission`,
      `How ${topic} Shaped Our Journey`,
      `A Personal Note on ${topic}`,
      `What ${topic} Taught Me as a Founder`,
      `Our Team's Take on ${topic}`,
    ],
    authority: [
      `The State of ${topic}: 2026 Report`,
      `Data-Driven Insights on ${topic}`,
      `Industry Experts on ${topic}`,
      `Proven Frameworks for ${topic}`,
      `Research-Backed ${topic} Strategies`,
    ],
    emotional: [
      `The Frustration of ${topic} (And How to Fix It)`,
      `Feeling Overwhelmed by ${topic}? Read This`,
      `Why ${topic} Keeps You Up at Night`,
      `The Relief of Finally Nailing ${topic}`,
      `Stop Stressing About ${topic} — Here is How`,
    ],
    insight: [
      `The Hidden Pattern in ${topic}`,
      `One Counterintuitive Idea About ${topic}`,
      `What I Noticed About ${topic} This Week`,
      `The ${topic} Trend You Cannot Ignore`,
      `A Different Angle on ${topic}`,
    ],
    minimal: [
      `${topic}`,
      `On ${topic}`,
      `${topic} Update`,
      `Re: ${topic}`,
      `${topic} Notes`,
    ],
  };

  const subjectTemplates: Record<string, string[]> = {
    educational: [
      `Your guide to ${topic.toLowerCase()} is here`,
      `Learn ${topic.toLowerCase()} in 10 minutes`,
      `The ${topic.toLowerCase()} playbook inside`,
      `Master ${topic.toLowerCase()} this week`,
      `Free ${topic.toLowerCase()} training`,
    ],
    conversational: [
      `Quick question about ${topic.toLowerCase()}`,
      `I was thinking about ${topic.toLowerCase()}...`,
      `Want to chat about ${topic.toLowerCase()}?`,
      `Something cool about ${topic.toLowerCase()}`,
      `Real talk: ${topic.toLowerCase()}`,
    ],
    'founder-style': [
      `A note from the founder on ${topic.toLowerCase()}`,
      `Why we care about ${topic.toLowerCase()}`,
      `My honest thoughts on ${topic.toLowerCase()}`,
      `Behind the scenes: ${topic.toLowerCase()}`,
      `From our team to you: ${topic.toLowerCase()}`,
    ],
    authority: [
      `New data on ${topic.toLowerCase()}`,
      `Research: ${topic.toLowerCase()} trends`,
      `Expert analysis of ${topic.toLowerCase()}`,
      `The numbers on ${topic.toLowerCase()}`,
      `Industry report: ${topic.toLowerCase()}`,
    ],
    emotional: [
      `Stop struggling with ${topic.toLowerCase()}`,
      `Feel confident about ${topic.toLowerCase()}`,
      `The stress-free way to ${topic.toLowerCase()}`,
      `You are not alone with ${topic.toLowerCase()}`,
      `Finally: ${topic.toLowerCase()} made simple`,
    ],
    insight: [
      `The ${topic.toLowerCase()} insight you missed`,
      `One thing about ${topic.toLowerCase()}...`,
      `Did you know this about ${topic.toLowerCase()}?`,
      `The ${topic.toLowerCase()} surprise inside`,
      `Unpopular opinion: ${topic.toLowerCase()}`,
    ],
    minimal: [
      `${topic}`,
      `${topic} inside`,
      `Re: ${topic}`,
      `Update: ${topic}`,
      `${topic}?`,
    ],
  };

  const styleList = titleTemplates[style] || titleTemplates.educational;
  const subjectList = subjectTemplates[style] || subjectTemplates.educational;

  return {
    title: styleList[Math.floor(Math.random() * styleList.length)],
    subjectLine: subjectList[Math.floor(Math.random() * subjectList.length)],
    previewText: `Discover actionable insights about ${topic.toLowerCase()} in this week's newsletter.`,
  };
}

function generateKeywords(contentType: string): string[] {
  const keywordMap: Record<string, string[]> = {
    educational: ['guide', 'tutorial', 'learn', 'explained', 'basics'],
    'product-update': ['update', 'new feature', 'release', 'changelog', 'product'],
    curated: ['roundup', 'best of', 'top picks', 'weekly', 'resources'],
    community: ['community', 'member spotlight', 'discussion', 'event', 'join'],
    'founder-letter': ['founder', 'letter', 'story', 'journey', 'behind the scenes'],
    'case-study': ['case study', 'success story', 'results', 'example', 'proof'],
    'industry-news': ['news', 'trends', 'industry', 'update', 'insights'],
    promotional: ['offer', 'deal', 'discount', 'limited', 'exclusive'],
  };
  return keywordMap[contentType] || ['newsletter', 'marketing', 'growth', 'business'];
}

// ============================================
// CREATE STRATEGY MODAL
// ============================================

function CreateStrategyModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: Partial<NewsletterStrategy>) => void;
}) {
  const [name, setName] = useState('');
  const [audience, setAudience] = useState('');
  const [industry, setIndustry] = useState('');
  const [funnelStage, setFunnelStage] = useState<FunnelStage>('tofu');
  const [contentDepth, setContentDepth] = useState<ContentDepth>('standard');
  const [objective, setObjective] = useState<NewsletterGoal>('education');
  const [communicationTone, setCommunicationTone] = useState('');
  const [ctaGoal, setCtaGoal] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate({
      name,
      audience,
      industry,
      funnelStage,
      contentDepth,
      objective,
      communicationTone,
      ctaGoal,
      linkedData: {},
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-200">Create Newsletter Strategy</h2>
          <p className="text-sm text-slate-400">Define your newsletter content strategy foundation</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Strategy Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Q3 2026 Newsletter Strategy"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., Marketing Managers"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., SaaS"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Objective</label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value as NewsletterGoal)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              >
                {NEWSLETTER_GOALS.map((g) => (
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
                {FUNNEL_STAGES.map((stage) => (
                  <option key={stage.value} value={stage.value}>{stage.label} - {stage.description}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Content Depth</label>
              <select
                value={contentDepth}
                onChange={(e) => setContentDepth(e.target.value as ContentDepth)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              >
                {CONTENT_DEPTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label} ({opt.wordRange})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">CTA Goal</label>
              <input
                type="text"
                value={ctaGoal}
                onChange={(e) => setCtaGoal(e.target.value)}
                placeholder="e.g., Drive traffic"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Communication Tone</label>
            <input
              type="text"
              value={communicationTone}
              onChange={(e) => setCommunicationTone(e.target.value)}
              placeholder="e.g., Friendly, professional, conversational"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            Create Strategy
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CONTENT TAB
// ============================================

function ContentTab({
  strategy,
  posts,
  titles,
  contentTypes,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
}: {
  strategy: NewsletterStrategy;
  posts: NewsletterPost[];
  titles: NewsletterTitle[];
  contentTypes: NewsletterContentTypeConfig[];
  onCreatePost: (data: Partial<NewsletterPost>) => void;
  onUpdatePost: (id: string, updates: Partial<NewsletterPost>) => void;
  onDeletePost: (id: string) => void;
}) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const selectedPost = posts.find((p) => p.id === selectedPostId);

  const handleCreateFromTitle = (title: NewsletterTitle) => {
    const contentType = contentTypes.find((t) => t.type === title.contentType);
    onCreatePost({
      strategyId: strategy.id,
      titleId: title.id,
      title: title.title,
      subjectLine: title.subjectLine,
      previewText: title.previewText,
      contentType: title.contentType,
      content: '',
      sections: [],
      suggestedCTA: title.suggestedCTA,
      status: 'planning',
      version: 1,
      suggestedAssets: [],
    });
  };

  const handleGenerateContent = async (post: NewsletterPost) => {
    setIsGenerating(true);
    setTimeout(() => {
      const sections: NewsletterSection[] = [
        { id: `sec-${Date.now()}-1`, type: 'heading', content: `Welcome to ${post.title}`, order: 1 },
        { id: `sec-${Date.now()}-2`, type: 'paragraph', content: `Hey there! In this edition, we dive into ${post.title.toLowerCase()} and what it means for you. Let us get started.`, order: 2 },
        { id: `sec-${Date.now()}-3`, type: 'heading', content: 'What You Will Learn', order: 3 },
        { id: `sec-${Date.now()}-4`, type: 'list', content: 'Key insight #1\nKey insight #2\nActionable takeaway\nResource recommendation', order: 4 },
        { id: `sec-${Date.now()}-5`, type: 'heading', content: 'Deep Dive', order: 5 },
        { id: `sec-${Date.now()}-6`, type: 'paragraph', content: 'Here is where we unpack the details. Whether you are new to this or a seasoned pro, there is something here for you.', order: 6 },
        { id: `sec-${Date.now()}-7`, type: 'quote', content: '"The best way to predict the future is to create it." — Peter Drucker', order: 7 },
        { id: `sec-${Date.now()}-8`, type: 'cta', content: post.suggestedCTA || 'Check out our latest resources', order: 8 },
      ];

      const content = sections.map((s) => s.content).join('\n\n');
      onUpdatePost(post.id, {
        status: 'draft',
        content,
        sections,
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Content Pipeline</h3>
            <p className="text-sm text-slate-400 mt-1">{posts.length} newsletters in pipeline</p>
          </div>
        </div>
      </div>

      {titles.filter((t) => t.status === 'selected').length > 0 && posts.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Create Newsletters from Selected Titles</h3>
          <div className="space-y-2">
            {titles
              .filter((t) => t.status === 'selected')
              .map((title) => (
                <div key={title.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-sm text-slate-200">{title.title}</span>
                  <button
                    onClick={() => handleCreateFromTitle(title)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Create Newsletter
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-200 mb-2">No Newsletters Yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Select titles from the Titles tab and create newsletters, or start writing from scratch.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className={cn(
                'bg-slate-800/50 border rounded-xl overflow-hidden transition-all',
                selectedPostId === post.id ? 'border-primary-500/50' : 'border-slate-700'
              )}
            >
              <div
                className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
              >
                <div className="flex-1">
                  <div className="font-medium text-slate-200">{post.title}</div>
                  <div className="text-sm text-primary-400 mt-0.5">{post.subjectLine}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        post.status === 'planning' && 'bg-slate-700 text-slate-400',
                        post.status === 'draft' && 'bg-yellow-500/20 text-yellow-400',
                        post.status === 'review' && 'bg-purple-500/20 text-purple-400',
                        post.status === 'approved' && 'bg-green-500/20 text-green-400',
                        post.status === 'published' && 'bg-primary-500/20 text-primary-400'
                      )}
                    >
                      {post.status}
                    </span>
                    <span className="text-xs text-slate-500">{post.contentType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {post.status === 'planning' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateContent(post);
                      }}
                      disabled={isGenerating}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePost(post.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedPostId === post.id && (
                <div className="border-t border-slate-700 p-4 space-y-4">
                  {post.content && (
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Content Preview</h4>
                      <div className="text-sm text-slate-400 whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {post.content}
                      </div>
                    </div>
                  )}

                  {post.sections && post.sections.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-slate-200">{post.sections.length}</div>
                        <div className="text-xs text-slate-500">Sections</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-slate-200">{getEstimatedReadTime(post.content?.length || 0)}m</div>
                        <div className="text-xs text-slate-500">Read Time</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-slate-200">{post.version}</div>
                        <div className="text-xs text-slate-500">Version</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-slate-200">{post.content?.split(' ').length || 0}</div>
                        <div className="text-xs text-slate-500">Words</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {post.status === 'draft' && (
                      <button
                        onClick={() => onUpdatePost(post.id, { status: 'review' })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        Send to Review
                      </button>
                    )}
                    {post.status === 'review' && (
                      <>
                        <button
                          onClick={() => onUpdatePost(post.id, { status: 'approved' })}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => onUpdatePost(post.id, { status: 'draft' })}
                          className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition-colors"
                        >
                          <PenTool className="w-3 h-3" />
                          Request Revisions
                        </button>
                      </>
                    )}
                    {post.status === 'approved' && (
                      <button
                        onClick={() => onUpdatePost(post.id, { status: 'published', publishedAt: new Date().toISOString() })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <Globe className="w-3 h-3" />
                        Publish
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================
// ASSETS TAB
// ============================================

function AssetsTab({
  strategy,
  posts,
}: {
  strategy: NewsletterStrategy;
  posts: NewsletterPost[];
}) {
  const draftPosts = posts.filter((p) => ['draft', 'review', 'approved'].includes(p.status));

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Image className="w-5 h-5 text-primary-400" />
          Asset Suggestions
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          AI-recommended visual assets for your newsletters based on strategy and content topics.
        </p>

        {draftPosts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Image className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No draft newsletters available for asset suggestions.</p>
            <p className="text-sm mt-1">Create and draft newsletters in the Content tab first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {draftPosts.map((post) => (
              <div key={post.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-slate-200">{post.title}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{post.contentType}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-slate-300">Hero Image</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Top banner image for the newsletter. Recommended: 600x300px.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-slate-300">Social Card</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Open Graph image for social sharing. Recommended: 1200x630px.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-slate-300">Infographic</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Data visualisation or process diagram based on content.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <PanelTop className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-slate-300">CTA Banner</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Call-to-action banner graphic for the newsletter footer.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// REVIEW TAB
// ============================================

function ReviewTab({
  strategy,
  posts,
  onUpdatePost,
}: {
  strategy: NewsletterStrategy;
  posts: NewsletterPost[];
  onUpdatePost: (id: string, updates: Partial<NewsletterPost>) => void;
}) {
  const reviewPosts = posts.filter((p) => ['review', 'draft', 'approved'].includes(p.status));

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary-400" />
          Review & Approval
        </h3>

        {reviewPosts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Eye className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No newsletters in review.</p>
            <p className="text-sm mt-1">Send newsletters to review from the Content tab.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviewPosts.map((post) => (
              <div key={post.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-slate-200">{post.title}</div>
                    <div className="text-sm text-primary-400 mt-0.5">{post.subjectLine}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          post.status === 'review' && 'bg-purple-500/20 text-purple-400',
                          post.status === 'draft' && 'bg-orange-500/20 text-orange-400',
                          post.status === 'approved' && 'bg-green-500/20 text-green-400'
                        )}
                      >
                        {post.status === 'review' && 'In Review'}
                        {post.status === 'draft' && 'Needs Revisions'}
                        {post.status === 'approved' && 'Approved'}
                      </span>
                    </div>
                  </div>
                </div>

                {post.content && (
                  <div className="bg-slate-800/30 rounded-lg p-3 mb-3 max-h-48 overflow-y-auto">
                    <div className="text-sm text-slate-400 whitespace-pre-wrap">{post.content}</div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {post.status === 'review' && (
                    <>
                      <button
                        onClick={() => onUpdatePost(post.id, { status: 'approved' })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => onUpdatePost(post.id, { status: 'draft' })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <PenTool className="w-3 h-3" />
                        Request Revisions
                      </button>
                    </>
                  )}
                  {post.status === 'draft' && (
                    <button
                      onClick={() => onUpdatePost(post.id, { status: 'review' })}
                      className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Re-submit for Review
                    </button>
                  )}
                  {post.status === 'approved' && (
                    <button
                      onClick={() => onUpdatePost(post.id, { status: 'published', publishedAt: new Date().toISOString() })}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      Publish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// EXPORT TAB
// ============================================

function ExportTab({
  strategy,
  posts,
}: {
  strategy: NewsletterStrategy;
  posts: NewsletterPost[];
}) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');

  const formats: { value: ExportFormat; label: string; description: string }[] = [
    { value: 'markdown', label: 'Markdown', description: 'Clean .md files for documentation' },
    { value: 'html', label: 'HTML', description: 'Fully formatted HTML for email clients' },
    { value: 'docx', label: 'Word Document', description: 'Microsoft Word compatible .docx format' },
    { value: 'wordpress', label: 'WordPress', description: 'Ready-to-paste WordPress blocks' },
  ];

  const handleExport = (post: NewsletterPost) => {
    let content = '';
    const fileName = `${post.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').substring(0, 60)}.${selectedFormat === 'markdown' ? 'md' : selectedFormat === 'html' ? 'html' : selectedFormat === 'docx' ? 'docx' : 'txt'}`;

    switch (selectedFormat) {
      case 'markdown':
        content = `# ${post.title}\n\n**Subject:** ${post.subjectLine}\n\n**Preview:** ${post.previewText}\n\n${post.content || ''}\n\n---\n*Generated by Mengo Newsletter Content OS*`;
        break;
      case 'html':
        content = `<!DOCTYPE html>\n<html>\n<head><title>${post.title}</title></head>\n<body>\n<h1>${post.title}</h1>\n<p><strong>Subject:</strong> ${post.subjectLine}</p>\n<p><strong>Preview:</strong> ${post.previewText}</p>\n<hr/>\n${(post.content || '').replace(/\n/g, '<br/>')}\n</body>\n</html>`;
        break;
      case 'wordpress':
        content = `<!-- wp:heading -->\n<h1>${post.title}</h1>\n<!-- /wp:heading -->\n<!-- wp:paragraph -->\n<p><strong>Subject:</strong> ${post.subjectLine}</p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p><strong>Preview:</strong> ${post.previewText}</p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p>${(post.content || '').replace(/\n/g, '</p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p>')}</p>\n<!-- /wp:paragraph -->`;
        break;
      default:
        content = post.content || '';
    }

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
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary-400" />
          Export Newsletters
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

        {posts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Download className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No approved or published newsletters to export.</p>
            <p className="text-sm mt-1">Approve newsletters in the Review tab to make them available for export.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <div>
                  <div className="font-medium text-slate-200">{post.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{post.contentType}</span>
                    <span className="text-xs text-slate-500">{post.content?.split(' ').length || 0} words</span>
                  </div>
                </div>
                <button
                  onClick={() => handleExport(post)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
