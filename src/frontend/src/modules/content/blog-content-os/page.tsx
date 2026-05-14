/**
 * Blog Content Operating System
 *
 * A comprehensive AI-powered blog planning, strategy, and content generation system.
 * Acts as: SEO Strategist + Content Manager + AI Blog Writer + Brand Copywriter
 *
 * Features:
 * - Blog Strategy Setup (goals, audience, funnel stage)
 * - Content Type Selector (20+ types with allocation)
 * - Calendar System (frequency, seasonal campaigns)
 * - AI Title Generator (Ollama Cloud GLM 5.1)
 * - Title Selection & Reorder Flow
 * - AI Content Writing Engine (chunked generation)
 * - Human-like Content Rules
 * - SEO Content Engine
 * - Content Chunking System
 * - Quality Control
 * - Asset Suggestions
 * - Versioning & Approval
 * - Export System
 */

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FileEdit,
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
  GripVertical,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  Bot,
  Globe,
  TrendingUp,
  Users,
  Search,
  Zap,
  ArrowRight,
  ArrowUpDown,
  X,
  Link,
  FileText,
  MessageSquare,
  Clock,
  BarChart3,
  Palette,
  BookOpen,
  Lightbulb,
  Award,
  Share2,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
  Send,
  PenTool,
  Layers,
  AlignLeft,
  Heading,
  List,
  Table,
  Quote,
  Hash,
  Tag,
  FolderOpen,
  Filter,
  SortAsc,
  Grid,
  List as ListIcon,
  AlertCircle,
  Building2,
  Package,
  Swords,
  PanelTop,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDataStore, useCompanyStore, useTaskStore } from '@/stores';
import {
  blogStrategyApi,
  blogCalendarApi,
  blogTitleApi,
  blogPostApi,
  blogContentChunkApi,
  blogExportApi,
} from '@/services/api';
import type {
  BlogStrategy,
  BlogGoal,
  FunnelStage,
  ContentDepth,
  BlogContentTypeConfig,
  ContentTypeCategory,
  SEOIntent,
  BlogCalendar,
  BloggingFrequency,
  SeasonalCampaign,
  BlogCalendarItem,
  BlogTitle,
  TitleStyle,
  BlogPost,
  BlogContentStatus,
  ContentChunkType,
  BlogContentChunk,
  ChunkStatus,
  BlogSection,
  BlogFAQ,
  BlogVersion,
  BlogComment,
  BlogApproval,
  ApprovalStage,
  ApprovalStatus,
  BlogAssetSuggestion,
  AssetSuggestionType,
  BlogSEOAnalysis,
  BlogExport,
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

const BLOG_GOALS: { value: BlogGoal; label: string; description: string }[] = [
  { value: 'seo', label: 'SEO', description: 'Improve search rankings and organic traffic' },
  { value: 'brand-awareness', label: 'Brand Awareness', description: 'Increase visibility and recognition' },
  { value: 'lead-generation', label: 'Lead Generation', description: 'Capture qualified leads' },
  { value: 'product-education', label: 'Product Education', description: 'Teach customers about products' },
  { value: 'authority-building', label: 'Authority Building', description: 'Establish thought leadership' },
  { value: 'traffic-growth', label: 'Traffic Growth', description: 'Drive more website visitors' },
  { value: 'conversion', label: 'Conversion', description: 'Convert readers to customers' },
  { value: 'community-building', label: 'Community Building', description: 'Build engaged audience' },
];

const FUNNEL_STAGES: { value: FunnelStage; label: string; description: string }[] = [
  { value: 'tofu', label: 'TOFU', description: 'Top of Funnel - Awareness stage' },
  { value: 'mofu', label: 'MOFU', description: 'Middle of Funnel - Consideration stage' },
  { value: 'bofu', label: 'BOFU', description: 'Bottom of Funnel - Decision stage' },
];

const CONTENT_DEPTH_OPTIONS: { value: ContentDepth; label: string; wordRange: string }[] = [
  { value: 'brief', label: 'Brief', wordRange: '300-600 words' },
  { value: 'standard', label: 'Standard', wordRange: '800-1200 words' },
  { value: 'deep', label: 'Deep Dive', wordRange: '1500-2500 words' },
  { value: 'comprehensive', label: 'Comprehensive', wordRange: '3000+ words' },
];

const DEFAULT_CONTENT_TYPES: Array<Partial<BlogContentTypeConfig>> = [
  { name: 'Educational Blogs', type: 'educational', enabled: true, percentageAllocation: 20, priority: 1, seoIntent: 'informational', recommendedLength: 1200, funnelPosition: 'tofu', ctaStrategy: 'Subscribe to newsletter', conversionGoal: 'Email capture' },
  { name: 'How-To Guides', type: 'how-to-guide', enabled: true, percentageAllocation: 15, priority: 2, seoIntent: 'informational', recommendedLength: 1500, funnelPosition: 'tofu', ctaStrategy: 'Download resource', conversionGoal: 'Lead magnet' },
  { name: 'Industry Trends', type: 'industry-trends', enabled: true, percentageAllocation: 10, priority: 3, seoIntent: 'informational', recommendedLength: 1000, funnelPosition: 'tofu', ctaStrategy: 'Share on social', conversionGoal: 'Social engagement' },
  { name: 'Case Studies', type: 'case-study', enabled: true, percentageAllocation: 10, priority: 4, seoIntent: 'commercial', recommendedLength: 2000, funnelPosition: 'mofu', ctaStrategy: 'Book consultation', conversionGoal: 'Demo request' },
  { name: 'Comparison Blogs', type: 'comparison', enabled: true, percentageAllocation: 10, priority: 5, seoIntent: 'commercial', recommendedLength: 1800, funnelPosition: 'mofu', ctaStrategy: 'Start free trial', conversionGoal: 'Trial signup' },
  { name: 'Product Focused', type: 'product-focused', enabled: true, percentageAllocation: 10, priority: 6, seoIntent: 'transactional', recommendedLength: 1500, funnelPosition: 'bofu', ctaStrategy: 'Purchase now', conversionGoal: 'Direct sale' },
  { name: 'Listicles', type: 'listicle', enabled: true, percentageAllocation: 10, priority: 7, seoIntent: 'informational', recommendedLength: 1200, funnelPosition: 'tofu', ctaStrategy: 'Read related', conversionGoal: 'Page views' },
  { name: 'Problem-Solution', type: 'problem-solution', enabled: true, percentageAllocation: 8, priority: 8, seoIntent: 'commercial', recommendedLength: 1500, funnelPosition: 'mofu', ctaStrategy: 'Get solution', conversionGoal: 'Lead capture' },
  { name: 'Thought Leadership', type: 'thought-leadership', enabled: true, percentageAllocation: 7, priority: 9, seoIntent: 'informational', recommendedLength: 1800, funnelPosition: 'tofu', ctaStrategy: 'Follow author', conversionGoal: 'Authority building' },
];

const TITLE_STYLES: { value: TitleStyle; label: string; description: string }[] = [
  { value: 'seo', label: 'SEO Optimized', description: 'Keyword-rich, search-friendly titles' },
  { value: 'viral', label: 'Viral/Clickbait', description: 'Emotional, curiosity-driven titles' },
  { value: 'authority', label: 'Authority', description: 'Expert, credible positioning titles' },
  { value: 'technical', label: 'Technical', description: 'Precise, industry-specific titles' },
  { value: 'emotional', label: 'Emotional', description: 'Feeling-driven, relatable titles' },
  { value: 'founder', label: 'Founder Voice', description: 'Personal, authentic founder-style' },
  { value: 'linkedin', label: 'LinkedIn Style', description: 'Professional, shareable titles' },
  { value: 'thought-leadership', label: 'Thought Leadership', description: 'Visionary, perspective titles' },
];

const BLOG_STATUS_CONFIG: Record<BlogContentStatus, { label: string; color: string; icon: any }> = {
  planning: { label: 'Planning', color: 'text-slate-400', icon: Lightbulb },
  outlining: { label: 'Outlining', color: 'text-blue-400', icon: Layout },
  generating: { label: 'Generating', color: 'text-amber-400', icon: RefreshCw },
  draft: { label: 'Draft', color: 'text-yellow-400', icon: FileEdit },
  review: { label: 'In Review', color: 'text-purple-400', icon: Eye },
  revisions: { label: 'Revisions', color: 'text-orange-400', icon: PenTool },
  approved: { label: 'Approved', color: 'text-green-400', icon: CheckCircle },
  published: { label: 'Published', color: 'text-primary-400', icon: Globe },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 60);
}

function getEstimatedReadTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BlogContentOSModule() {
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
  const strategies = useMemo(() => (getItems('blogStrategies') as BlogStrategy[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const contentTypes = useMemo(() => (getItems('blogContentTypes') as BlogContentTypeConfig[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const calendars = useMemo(() => (getItems('blogCalendars') as BlogCalendar[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const titles = useMemo(() => (getItems('blogTitles') as BlogTitle[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const posts = useMemo(() => (getItems('blogPosts') as BlogPost[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const chunks = useMemo(() => (getItems('blogContentChunks') as BlogContentChunk[]) || [], [getItems, dataStore.data, activeCompanyId]);

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
      const [sRes, cRes, tRes, pRes, chRes, eRes] = await Promise.all([
        blogStrategyApi.getAll(companyId),
        blogCalendarApi.getAll(companyId),
        blogTitleApi.getAll(companyId),
        blogPostApi.getAll(companyId),
        blogContentChunkApi.getAll(companyId),
        blogExportApi.getAll(companyId),
      ]);

      // Log API errors for debugging
      const responses = [
        { name: 'strategies', res: sRes },
        { name: 'calendars', res: cRes },
        { name: 'titles', res: tRes },
        { name: 'posts', res: pRes },
        { name: 'chunks', res: chRes },
        { name: 'exports', res: eRes },
      ];
      responses.forEach(({ name, res }) => {
        if (res.error) {
          console.error(`[BlogContentOS] API load failed for ${name}:`, res.error, `(status: ${res.status})`);
        }
      });

      // Merge API data with local store — never overwrite with empty arrays
      const mergeById = <T extends { id: string }>(local: T[], remote: T[]): T[] => {
        const map = new Map<string, T>();
        local.forEach((item) => map.set(item.id, item));
        remote.forEach((item) => {
          if (!map.has(item.id)) map.set(item.id, item);
        });
        return Array.from(map.values());
      };

      if (sRes.data && Array.isArray(sRes.data) && sRes.data.length > 0) {
        const local = (getItems('blogStrategies') as BlogStrategy[]) || [];
        dataStore.setItems('blogStrategies', mergeById(local, sRes.data as BlogStrategy[]));
      }
      if (cRes.data && Array.isArray(cRes.data) && cRes.data.length > 0) {
        const local = (getItems('blogCalendars') as BlogCalendar[]) || [];
        dataStore.setItems('blogCalendars', mergeById(local, cRes.data as BlogCalendar[]));
      }
      if (tRes.data && Array.isArray(tRes.data) && tRes.data.length > 0) {
        const local = (getItems('blogTitles') as BlogTitle[]) || [];
        dataStore.setItems('blogTitles', mergeById(local, tRes.data as BlogTitle[]));
      }
      if (pRes.data && Array.isArray(pRes.data) && pRes.data.length > 0) {
        const local = (getItems('blogPosts') as BlogPost[]) || [];
        dataStore.setItems('blogPosts', mergeById(local, pRes.data as BlogPost[]));
      }
      if (chRes.data && Array.isArray(chRes.data) && chRes.data.length > 0) {
        const local = (getItems('blogContentChunks') as BlogContentChunk[]) || [];
        dataStore.setItems('blogContentChunks', mergeById(local, chRes.data as BlogContentChunk[]));
      }
      if (eRes.data && Array.isArray(eRes.data) && eRes.data.length > 0) {
        const local = (getItems('blogExports') as BlogExport[]) || [];
        dataStore.setItems('blogExports', mergeById(local, eRes.data as BlogExport[]));
      }

      setIsLoading(false);
    };

    // Hard timeout fallback: hide loader after 6s no matter what
    const fallbackTimer = setTimeout(() => setIsLoading(false), 6000);

    loadFromApi().finally(() => clearTimeout(fallbackTimer));

    return () => clearTimeout(fallbackTimer);
  }, [companyId]);

  // Active selections
  const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'strategy' | 'types' | 'calendar' | 'titles' | 'content' | 'assets' | 'review' | 'export'>('strategy');
  const [showCreateStrategyModal, setShowCreateStrategyModal] = useState(false);

  // Get active strategy
  const activeStrategy = useMemo(() => strategies.find((s) => s.id === activeStrategyId), [strategies, activeStrategyId]);

  // Strategy actions
  const handleCreateStrategy = useCallback(async (data: Partial<BlogStrategy>) => {
    if (!companyId) return;
    const localId = addItem('blogStrategies', {
      ...data,
      companyId,
      linkedData: {},
    } as any);
    setActiveStrategyId(localId);

    // Create default content types for this strategy
    DEFAULT_CONTENT_TYPES.forEach((type, index) => {
      addItem('blogContentTypes', {
        ...type,
        strategyId: localId,
        companyId,
      } as any);
    });

    // Sync to backend
    const response = await blogStrategyApi.create({
      ...data,
      companyId,
      id: localId,
      linkedData: {},
    });
    if (response.data && (response.data as any).id && (response.data as any).id !== localId) {
      updateItem('blogStrategies', localId, { id: (response.data as any).id });
      setActiveStrategyId((response.data as any).id);
    }
  }, [companyId, addItem, updateItem]);

  const handleUpdateStrategy = useCallback(async (id: string, updates: Partial<BlogStrategy>) => {
    updateItem('blogStrategies', id, updates);
    await blogStrategyApi.update(id, updates);
  }, [updateItem]);

  const handleDeleteStrategy = useCallback(async (id: string) => {
    if (confirm('Are you sure? This will delete the strategy and all associated data.')) {
      deleteItem('blogStrategies', id);
      if (activeStrategyId === id) setActiveStrategyId(null);
      await blogStrategyApi.delete(id);
    }
  }, [deleteItem, activeStrategyId]);

  // Title generation (simulated - would connect to Ollama Cloud)
  const handleGenerateTitles = useCallback(async (count: number = 10, style: TitleStyle = 'seo') => {
    if (!activeStrategyId || !activeStrategy) return;

    // Create background task
    const taskId = taskStore.createTask(
      `Generate ${count} Blog Titles`,
      'blog-content-os',
      count
    );

    // Simulate AI generation with context
    const brandContext = brand ? `Brand: ${brand.voice || 'professional'}, Tone: ${brand.personality || 'friendly'}` : '';
    const businessContext = businessProfile ? `Industry: ${businessProfile.primaryIndustry || 'general'}` : '';

    // Generate titles based on content types
    const enabledTypes = contentTypes.filter((t) => t.enabled && t.strategyId === activeStrategyId);

    setTimeout(async () => {
      const titlesToCreate: any[] = [];
      for (let i = 0; i < count; i++) {
        const contentType = enabledTypes[i % enabledTypes.length] || enabledTypes[0];
        const title = generateSampleTitle(contentType?.type || 'educational', style, brandContext, businessContext);

        const titleData = {
          strategyId: activeStrategyId,
          title,
          contentType: contentType?.type || 'educational',
          style,
          seoScore: Math.floor(Math.random() * 30) + 70,
          searchIntent: contentType?.seoIntent || 'informational',
          funnelStage: contentType?.funnelPosition || 'tofu',
          suggestedKeywords: generateKeywords(contentType?.type || 'educational'),
          suggestedCTA: contentType?.ctaStrategy || 'Learn more',
          status: 'generated',
          order: i,
          companyId,
        };

        addItem('blogTitles', titleData as any);
        titlesToCreate.push(titleData);
      }

      // Sync to backend in parallel
      await Promise.all(titlesToCreate.map((t) => blogTitleApi.create(t)));

      taskStore.completeBatch(taskId, 0, Array(count).fill('title'));
    }, 2000);
  }, [activeStrategyId, activeStrategy, contentTypes, brand, businessProfile, addItem, taskStore, companyId]);

  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Select a Company</h2>
          <p className="text-slate-400">Please select a company to access the Blog Content OS.</p>
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
                <FileEdit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Blog Content OS</h1>
                <p className="text-sm text-slate-400">AI-Powered Content Strategy & Generation</p>
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
            { id: 'content', label: 'Content', icon: FileEdit },
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
                onUpdate={(id, updates) => updateItem('blogContentTypes', id, updates)}
              />
            )}

            {activeTab === 'calendar' && activeStrategy && (
              <CalendarTab
                strategy={activeStrategy}
                calendars={calendars.filter((c) => c.strategyId === activeStrategy.id)}
                onCreateCalendar={async (data) => {
                  const localId = addItem('blogCalendars', { ...data, strategyId: activeStrategy.id } as any);
                  const res = await blogCalendarApi.create({ ...data, strategyId: activeStrategy.id, id: localId, companyId });
                  if (res.data && (res.data as any).id && (res.data as any).id !== localId) {
                    updateItem('blogCalendars', localId, { id: (res.data as any).id });
                  }
                }}
                onUpdateCalendar={async (id, updates) => {
                  updateItem('blogCalendars', id, updates);
                  await blogCalendarApi.update(id, updates);
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
                  updateItem('blogTitles', id, updates);
                  await blogTitleApi.update(id, updates);
                }}
                onDelete={async (id) => {
                  deleteItem('blogTitles', id);
                  await blogTitleApi.delete(id);
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
                  const localId = addItem('blogPosts', data as any);
                  const res = await blogPostApi.create({ ...data, id: localId, companyId });
                  if (res.data && (res.data as any).id && (res.data as any).id !== localId) {
                    updateItem('blogPosts', localId, { id: (res.data as any).id });
                  }
                }}
                onUpdatePost={async (id, updates) => {
                  updateItem('blogPosts', id, updates);
                  await blogPostApi.update(id, updates);
                }}
                onDeletePost={async (id) => {
                  deleteItem('blogPosts', id);
                  await blogPostApi.delete(id);
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
                  updateItem('blogPosts', id, updates);
                  await blogPostApi.update(id, updates);
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
          <BookOpen className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Blog Strategy Yet</h2>
        <p className="text-slate-400 mb-6">
          Create your first blog content strategy to start planning SEO-focused, brand-aligned content that drives results.
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
  strategy: BlogStrategy;
  brand: Brand | null;
  businessProfile: BusinessProfile | undefined;
  icps: ICP[];
  personas: Persona[];
  products: Product[];
  competitors: Competitor[];
  onUpdate: (updates: Partial<BlogStrategy>) => void;
}) {
  const [activeSection, setActiveSection] = useState<'goals' | 'audience' | 'linked'>('goals');

  const linkedData = strategy.linkedData || {};

  const toggleGoal = (goal: BlogGoal) => {
    const currentGoals = strategy.goals || [];
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g) => g !== goal)
      : [...currentGoals, goal];
    onUpdate({ goals: newGoals });
  };

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
              placeholder="e.g., Q1 2026 Content Strategy"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Language</label>
              <select
                value={strategy.language || 'en'}
                onChange={(e) => onUpdate({ language: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
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
            <label className="block text-sm font-medium text-slate-400 mb-2">Target Region</label>
            <input
              type="text"
              value={strategy.targetRegion || ''}
              onChange={(e) => onUpdate({ targetRegion: e.target.value })}
              placeholder="e.g., North America"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Target Audience</label>
            <input
              type="text"
              value={strategy.targetAudience || ''}
              onChange={(e) => onUpdate({ targetAudience: e.target.value })}
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
          <label className="block text-sm font-medium text-slate-400 mb-2">Competitor Blogs to Monitor</label>
          <input
            type="text"
            value={strategy.competitorBlogs?.join(', ') || ''}
            onChange={(e) => onUpdate({ competitorBlogs: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            placeholder="e.g., competitor1.com/blog, competitor2.com/blog"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">AI Creativity Level</label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Conservative</span>
            <input
              type="range"
              min="1"
              max="10"
              value={strategy.creativityLevel || 5}
              onChange={(e) => onUpdate({ creativityLevel: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm text-slate-500">Creative</span>
            <span className="text-lg font-semibold text-primary-400 w-8 text-center">{strategy.creativityLevel || 5}</span>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-slate-800">
        {[
          { id: 'goals', label: 'Blog Goals', icon: Target },
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
            Select Your Blogging Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BLOG_GOALS.map((goal) => {
              const isSelected = strategy.goals?.includes(goal.value);
              return (
                <button
                  key={goal.value}
                  onClick={() => toggleGoal(goal.value)}
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
            {/* Brand Voice */}
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
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Writing Style</div>
                    <div className="text-slate-200">{brand.voiceWritingStyle || 'Not defined'}</div>
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

            {/* Business Context */}
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
            Link data from other modules to enrich your content generation with business context,
            ICP insights, product details, and competitive intelligence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ICPs */}
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

            {/* Personas */}
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

            {/* Products */}
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

            {/* Competitors */}
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
  contentTypes: BlogContentTypeConfig[];
  onUpdate: (id: string, updates: Partial<BlogContentTypeConfig>) => void;
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
      {/* Allocation Summary */}
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

        {/* Visual Bar */}
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

      {/* Content Types List */}
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
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs rounded-full',
                          type.seoIntent === 'informational' && 'bg-blue-500/20 text-blue-400',
                          type.seoIntent === 'commercial' && 'bg-purple-500/20 text-purple-400',
                          type.seoIntent === 'transactional' && 'bg-green-500/20 text-green-400',
                          type.seoIntent === 'navigational' && 'bg-slate-500/20 text-slate-400'
                        )}
                      >
                        {type.seoIntent}
                      </span>
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
  strategy: BlogStrategy;
  calendars: BlogCalendar[];
  onCreateCalendar: (data: Partial<BlogCalendar>) => void;
  onUpdateCalendar: (id: string, updates: Partial<BlogCalendar>) => void;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const activeCalendar = calendars[0];

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getPublishingDayLabel = (day: string) => {
    const labels: Record<string, string> = {
      daily: 'Every Day',
      weekly: 'Once per week',
      'bi-weekly': 'Twice per week',
      monthly: 'Once per month',
    };
    return labels[day] || day;
  };

  return (
    <div className="space-y-6">
      {!activeCalendar ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No Calendar Created</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Create a publishing calendar to schedule your blog content and track your content pipeline.</p>
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
          {/* Calendar Overview */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-200">{activeCalendar.name}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-slate-400">Frequency: {getPublishingDayLabel(activeCalendar.frequency)}</span>
                  <span className="text-sm text-slate-400">Posts per cycle: {activeCalendar.postsPerCycle}</span>
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

            {/* Publishing Schedule */}
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

            {/* Timeline */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3">Content Pipeline ({activeCalendar.timeline.length} posts)</h4>
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
  strategy: BlogStrategy;
  onClose: () => void;
  onCreate: (data: Partial<BlogCalendar>) => void;
}) {
  const [name, setName] = useState(strategy.name + ' Calendar');
  const [frequency, setFrequency] = useState<BloggingFrequency>('weekly');
  const [postsPerCycle, setPostsPerCycle] = useState(4);
  const [publishingDays, setPublishingDays] = useState<string[]>(['monday']);

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
    // Generate timeline
    const timeline: BlogCalendarItem[] = [];
    const startDate = new Date();

    for (let i = 0; i < postsPerCycle; i++) {
      timeline.push({
        id: `calendar-item-${i}`,
        scheduledDate: new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'empty',
      });
    }

    onCreate({
      name,
      frequency,
      postsPerCycle,
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
          <h2 className="text-lg font-semibold text-slate-200">Create Blog Calendar</h2>
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
              onChange={(e) => setFrequency(e.target.value as BloggingFrequency)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Posts per Cycle</label>
            <input
              type="number"
              min="1"
              max="52"
              value={postsPerCycle}
              onChange={(e) => setPostsPerCycle(parseInt(e.target.value))}
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
// TITLES TAB - AI Title Generation
// ============================================

function TitlesTab({
  strategy,
  contentTypes,
  titles,
  onGenerate,
  onUpdate,
  onDelete,
}: {
  strategy: BlogStrategy;
  contentTypes: BlogContentTypeConfig[];
  titles: BlogTitle[];
  onGenerate: (count: number, style: TitleStyle) => void;
  onUpdate: (id: string, updates: Partial<BlogTitle>) => void;
  onDelete: (id: string) => void;
}) {
  const [selectedStyle, setSelectedStyle] = useState<TitleStyle>('seo');
  const [generateCount, setGenerateCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedTitles = titles.filter((t) => t.status === 'selected').sort((a, b) => a.order - b.order);
  const generatedTitles = titles.filter((t) => t.status === 'generated');

  const handleGenerate = async () => {
    setIsGenerating(true);
    await onGenerate(generateCount, selectedStyle);
    setIsGenerating(false);
  };

  const handleSelect = (title: BlogTitle) => {
    onUpdate(title.id, { status: 'selected', order: selectedTitles.length });
  };

  const handleReject = (title: BlogTitle) => {
    onUpdate(title.id, { status: 'rejected' });
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-400" />
          AI Title Generator
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Title Style</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as TitleStyle)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            >
              {TITLE_STYLES.map((style) => (
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
          Context: {strategy.targetAudience || 'General audience'} |
          Content types: {contentTypes.filter((t) => t.enabled).length} enabled
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Titles */}
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
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">SEO Score: {title.seoScore}/100</span>
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

        {/* Generated Titles */}
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
                      <div className="flex items-center gap-3 mt-1">
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          title.seoScore >= 80 && 'bg-green-500/20 text-green-400',
                          title.seoScore >= 60 && title.seoScore < 80 && 'bg-yellow-500/20 text-yellow-400',
                          title.seoScore < 60 && 'bg-red-500/20 text-red-400'
                        )}>
                          SEO {title.seoScore}
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
): string {
  const topics = [
    'Marketing Automation',
    'SEO Strategy',
    'Content Marketing',
    'Social Media Growth',
    'Lead Generation',
    'Brand Building',
    'Customer Retention',
    'Email Marketing',
    'Conversion Optimisation',
    'Data Analytics',
    'AI in Marketing',
    'Influencer Partnerships',
    'Video Marketing',
    'Podcasting',
    'Webinar Strategy',
  ];
  const actions = [
    'Increase Conversions',
    'Drive Traffic',
    'Build Authority',
    'Generate Leads',
    'Boost Engagement',
    'Reduce Churn',
    'Scale Revenue',
    'Improve ROI',
  ];
  const numbers = ['5', '7', '10', '12', '15', '21', '30', '101'];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const number = numbers[Math.floor(Math.random() * numbers.length)];

  const templates: Record<string, string[]> = {
    seo: [
      `How to ${action} with ${topic} in ${number} Steps`,
      `The Complete Guide to ${topic} for ${number}x Growth`,
      `What is ${topic}? A Comprehensive Guide`,
      `${number} Proven ${topic} Strategies That Work`,
      `Why ${topic} Matters for Your Business`,
    ],
    viral: [
      `The Shocking Truth About ${topic} Nobody Talks About`,
      `I Tried ${topic} for 30 Days. Here's What Happened.`,
      `Stop Doing ${topic} Wrong: ${number} Mistakes to Avoid`,
      `This ${topic} Hack Changed Everything for Me`,
      `Why 90% of Businesses Fail at ${topic}`,
    ],
    authority: [
      `The State of ${topic}: Industry Report`,
      `Expert Insights: How Top Brands Approach ${topic}`,
      `A Data-Driven Look at ${topic} Trends`,
      `The Science Behind ${topic}`,
      `What ${number} Years in ${topic} Taught Me`,
    ],
    technical: [
      `${topic}: Architecture, Implementation, and Best Practices`,
      `Deep Dive: How ${topic} Algorithms Work`,
      `${topic} API Integration Guide`,
      `Optimising ${topic} Performance: A Technical Analysis`,
      `Building Scalable ${topic} Systems`,
    ],
    emotional: [
      `The Frustration of ${topic} (And How to Fix It)`,
      `Feeling Overwhelmed by ${topic}? Read This.`,
      `The Relief of Finally Getting ${topic} Right`,
      `Why ${topic} Keeps You Up at Night`,
      `Finding Peace Through Better ${topic}`,
    ],
    founder: [
      `Why I Built Our ${topic} Strategy from Scratch`,
      `The ${topic} Lessons I Learned the Hard Way`,
      `How We 10x'd Our ${topic} in 6 Months`,
      `What I Wish I Knew About ${topic} Before Starting`,
      `Our ${topic} Journey: From Zero to One`,
    ],
    linkedin: [
      `${number} ${topic} Insights Every Professional Should Know`,
      `The ${topic} Framework That Got Me Promoted`,
      `Why Leaders Prioritise ${topic} in 2026`,
      `The ${topic} Skills Gap (And How to Close It)`,
      `My Thoughts on the Future of ${topic}`,
    ],
    'thought-leadership': [
      `The Future of ${topic}: A Vision for 2030`,
      `Rethinking ${topic}: A New Perspective`,
      `Why ${topic} Needs a Paradigm Shift`,
      `The Unspoken Rules of ${topic}`,
      `Beyond ${topic}: What's Next for the Industry`,
    ],
  };

  const styleTemplates = templates[style] || templates.seo;
  return styleTemplates[Math.floor(Math.random() * styleTemplates.length)];
}

function generateKeywords(contentType: string): string[] {
  const keywordMap: Record<string, string[]> = {
    educational: ['guide', 'tutorial', 'learn', 'explained', 'basics'],
    'how-to-guide': ['how to', 'step by step', 'tutorial', 'guide', 'instructions'],
    'industry-trends': ['trends', 'industry', 'future', 'predictions', 'insights'],
    'case-study': ['case study', 'success story', 'results', 'example', 'proof'],
    comparison: ['vs', 'comparison', 'best', 'top', 'review'],
    'product-focused': ['product', 'features', 'review', 'demo', 'solution'],
    listicle: ['list', 'best', 'top', 'ways to', 'tips'],
    'problem-solution': ['solution', 'fix', 'problem', 'how to solve', 'overcome'],
    'thought-leadership': ['future', 'vision', 'strategy', 'leadership', 'innovation'],
  };
  return keywordMap[contentType] || ['marketing', 'strategy', 'growth', 'business'];
}

// ============================================
// CREATE STRATEGY MODAL
// ============================================

function CreateStrategyModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: Partial<BlogStrategy>) => void;
}) {
  const [name, setName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [targetRegion, setTargetRegion] = useState('');
  const [funnelStage, setFunnelStage] = useState<FunnelStage>('tofu');
  const [contentDepth, setContentDepth] = useState<ContentDepth>('standard');
  const [creativityLevel, setCreativityLevel] = useState(5);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate({
      name,
      targetAudience,
      targetRegion,
      funnelStage,
      contentDepth,
      creativityLevel,
      goals: [],
      language: 'en',
      competitorBlogs: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-200">Create Blog Strategy</h2>
          <p className="text-sm text-slate-400">Define your content strategy foundation</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Strategy Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Q3 2026 Content Strategy"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Target Audience</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Marketing Managers"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Target Region</label>
              <input
                type="text"
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                placeholder="e.g., North America"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">AI Creativity Level</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">Conservative</span>
              <input
                type="range"
                min="1"
                max="10"
                value={creativityLevel}
                onChange={(e) => setCreativityLevel(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-slate-500">Creative</span>
              <span className="text-lg font-semibold text-primary-400 w-8 text-center">{creativityLevel}</span>
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
  strategy: BlogStrategy;
  posts: BlogPost[];
  titles: BlogTitle[];
  contentTypes: BlogContentTypeConfig[];
  onCreatePost: (data: Partial<BlogPost>) => void;
  onUpdatePost: (id: string, updates: Partial<BlogPost>) => void;
  onDeletePost: (id: string) => void;
}) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const selectedPost = posts.find((p) => p.id === selectedPostId);

  const handleCreateFromTitle = (title: BlogTitle) => {
    const contentType = contentTypes.find((t) => t.type === title.contentType);
    onCreatePost({
      strategyId: strategy.id,
      titleId: title.id,
      title: title.title,
      slug: generateSlug(title.title),
      excerpt: '',
      contentType: title.contentType,
      contentTypeId: contentType?.id,
      primaryKeyword: title.suggestedKeywords[0],
      secondaryKeywords: title.suggestedKeywords.slice(1),
      nlpKeywords: [],
      metaTitle: title.title,
      metaDescription: '',
      status: 'planning',
      version: 1,
      versions: [],
      comments: [],
      approvals: [],
      suggestedAssets: [],
      contentChunks: [],
      sections: [],
      faqs: [],
      internalLinks: [],
      externalLinks: [],
    });
  };

  const handleGenerateContent = async (post: BlogPost) => {
    setIsGenerating(true);
    setTimeout(() => {
      const sections: BlogSection[] = [
        { id: `sec-${Date.now()}-1`, type: 'heading', content: `Introduction to ${post.title}`, order: 1, level: 1 },
        { id: `sec-${Date.now()}-2`, type: 'paragraph', content: `In today's competitive landscape, understanding ${post.title.toLowerCase()} is essential for businesses looking to grow. This comprehensive guide explores everything you need to know.`, order: 2 },
        { id: `sec-${Date.now()}-3`, type: 'heading', content: 'Key Strategies and Best Practices', order: 3, level: 2 },
        { id: `sec-${Date.now()}-4`, type: 'paragraph', content: 'Successful implementation requires a structured approach. Start by analysing your current position, then identify gaps and opportunities for improvement.', order: 4 },
        { id: `sec-${Date.now()}-5`, type: 'list', content: 'Research your target audience thoroughly\nDevelop a clear value proposition\nCreate consistent, high-quality content\nMeasure and optimise continuously', order: 5 },
        { id: `sec-${Date.now()}-6`, type: 'heading', content: 'Common Mistakes to Avoid', order: 6, level: 2 },
        { id: `sec-${Date.now()}-7`, type: 'paragraph', content: 'Many businesses fail because they lack patience and consistency. Avoid shortcuts and focus on building sustainable systems that compound over time.', order: 7 },
        { id: `sec-${Date.now()}-8`, type: 'heading', content: 'Conclusion', order: 8, level: 2 },
        { id: `sec-${Date.now()}-9`, type: 'paragraph', content: `${post.title} is not just a tactic—it is a strategic imperative. By following the frameworks outlined in this article, you can drive meaningful results for your business.`, order: 9 },
      ];

      onUpdatePost(post.id, {
        status: 'draft',
        content: sections.map((s) => s.content).join('\n\n'),
        sections,
        seoAnalysis: {
          readabilityScore: 72,
          readingTime: getEstimatedReadTime(1200),
          keywordDensity: { [post.primaryKeyword || 'marketing']: 2.4 },
          headingStructureValid: true,
          internalLinkCount: 0,
          externalLinkCount: 0,
          suggestedSchema: ['Article', 'FAQPage'],
          wordCount: 1200,
          paragraphCount: 6,
          avgSentenceLength: 18,
          passiveVoicePercentage: 12,
        },
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
            <p className="text-sm text-slate-400 mt-1">{posts.length} posts in pipeline</p>
          </div>
        </div>
      </div>

      {titles.filter((t) => t.status === 'selected').length > 0 && posts.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Create Posts from Selected Titles</h3>
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
                    Create Post
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
            <FileEdit className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-200 mb-2">No Posts Yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Select titles from the Titles tab and create posts, or start writing from scratch.
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
                    {post.seoAnalysis && (
                      <span className="text-xs text-slate-500">{post.seoAnalysis.wordCount} words</span>
                    )}
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

                  {post.seoAnalysis && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-slate-200">{post.seoAnalysis.wordCount}</div>
                        <div className="text-xs text-slate-500">Words</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-slate-200">{post.seoAnalysis.readingTime}m</div>
                        <div className="text-xs text-slate-500">Read Time</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-slate-200">{post.seoAnalysis.readabilityScore}</div>
                        <div className="text-xs text-slate-500">Readability</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-slate-200">{post.seoAnalysis.paragraphCount}</div>
                        <div className="text-xs text-slate-500">Paragraphs</div>
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
                          onClick={() => onUpdatePost(post.id, { status: 'revisions' })}
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
  strategy: BlogStrategy;
  posts: BlogPost[];
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
          AI-recommended visual assets for your blog content based on strategy and post topics.
        </p>

        {draftPosts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Image className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No draft posts available for asset suggestions.</p>
            <p className="text-sm mt-1">Create and draft posts in the Content tab first.</p>
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
                      <span className="text-sm font-medium text-slate-300">Featured Image</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Hero image for the blog post. Recommended: 1200x630px.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-slate-300">Social Post</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      LinkedIn + Twitter promotional graphics for this article.
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
                      End-of-article call-to-action banner graphic.
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
  strategy: BlogStrategy;
  posts: BlogPost[];
  onUpdatePost: (id: string, updates: Partial<BlogPost>) => void;
}) {
  const reviewPosts = posts.filter((p) => ['review', 'revisions', 'approved'].includes(p.status));

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
            <p>No posts in review.</p>
            <p className="text-sm mt-1">Send posts to review from the Content tab.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviewPosts.map((post) => (
              <div key={post.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-slate-200">{post.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          post.status === 'review' && 'bg-purple-500/20 text-purple-400',
                          post.status === 'revisions' && 'bg-orange-500/20 text-orange-400',
                          post.status === 'approved' && 'bg-green-500/20 text-green-400'
                        )}
                      >
                        {post.status === 'review' && 'In Review'}
                        {post.status === 'revisions' && 'Needs Revisions'}
                        {post.status === 'approved' && 'Approved'}
                      </span>
                      {post.seoAnalysis && (
                        <span className="text-xs text-slate-500">Readability: {post.seoAnalysis.readabilityScore}/100</span>
                      )}
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
                        onClick={() =>
                          onUpdatePost(post.id, {
                            status: 'approved',
                            approvals: [
                              ...(post.approvals || []),
                              {
                                stage: 'content-review',
                                status: 'approved',
                                userName: 'Editor',
                                completedAt: new Date().toISOString(),
                              },
                            ],
                          })
                        }
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          onUpdatePost(post.id, {
                            status: 'revisions',
                            approvals: [
                              ...(post.approvals || []),
                              {
                                stage: 'content-review',
                                status: 'rejected',
                                userName: 'Editor',
                                comment: 'Needs revisions.',
                                completedAt: new Date().toISOString(),
                              },
                            ],
                          })
                        }
                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <PenTool className="w-3 h-3" />
                        Request Revisions
                      </button>
                    </>
                  )}
                  {post.status === 'revisions' && (
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
                      Publish Now
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
  strategy: BlogStrategy;
  posts: BlogPost[];
}) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');

  const formats: { value: ExportFormat; label: string; description: string }[] = [
    { value: 'markdown', label: 'Markdown', description: 'Clean .md files for GitHub, dev blogs, or static sites' },
    { value: 'html', label: 'HTML', description: 'Fully formatted HTML for direct publishing' },
    { value: 'docx', label: 'Word Document', description: 'Microsoft Word compatible .docx format' },
    { value: 'wordpress', label: 'WordPress', description: 'Ready-to-paste WordPress Gutenberg blocks' },
    { value: 'seo-brief', label: 'SEO Brief', description: 'Technical SEO document with meta and schema' },
  ];

  const handleExport = (post: BlogPost) => {
    let content = '';
    const fileName = `${generateSlug(post.title)}.${selectedFormat === 'markdown' ? 'md' : selectedFormat === 'html' ? 'html' : selectedFormat === 'docx' ? 'docx' : 'txt'}`;

    switch (selectedFormat) {
      case 'markdown':
        content = `# ${post.title}\n\n${post.excerpt || ''}\n\n${post.content || ''}\n\n---\n*Generated by Mengo Blog Content OS*`;
        break;
      case 'html':
        content = `<article>\n  <h1>${post.title}</h1>\n  <p class="excerpt">${post.excerpt || ''}</p>\n  <div class="content">\n    ${(post.content || '').replace(/\n/g, '<br/>')}\n  </div>\n</article>`;
        break;
      case 'seo-brief':
        content = `Title: ${post.title}\nMeta Title: ${post.metaTitle || post.title}\nMeta Description: ${post.metaDescription || ''}\nPrimary Keyword: ${post.primaryKeyword || ''}\nSecondary Keywords: ${post.secondaryKeywords?.join(', ') || ''}\n\n${post.content || ''}`;
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
          Export Content
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
            <p>No approved or published posts to export.</p>
            <p className="text-sm mt-1">Approve posts in the Review tab to make them available for export.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <div>
                  <div className="font-medium text-slate-200">{post.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{post.contentType}</span>
                    {post.seoAnalysis && (
                      <span className="text-xs text-slate-500">{post.seoAnalysis.wordCount} words</span>
                    )}
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
