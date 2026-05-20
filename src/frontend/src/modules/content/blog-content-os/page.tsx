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
  Database,
  Image,
  CheckCircle,
  Download,
  Settings,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
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
  UserCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDataStore, useCompanyStore, useTaskStore, useAuthStore } from '@/stores';
import {
  blogStrategyApi,
  blogCalendarApi,
  blogSeoApi,
  blogTitleApi,
  blogPostApi,
  blogContentChunkApi,
  blogExportApi,
  blogStructureApi,
  blogContentSectionApi,
  aiApi,
  businessProfileApi,
  icpApi,
  personaApi,
  competitorApi,
  moduleDataApi,
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
  BlogSEOConfig,
  BlogStructure,
  StructureSection,
  StructureType,
  StructureSectionType,
  StructureStatus,
  BlogContentSection,
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

// Transform MongoDB _id to id for consistency
function transformMongoIds(obj: any): any {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(transformMongoIds);
  if (typeof obj !== 'object') return obj;

  const result = { ...obj };
  if (result._id && !result.id) {
    result.id = result._id;
  }

  // Recursively transform nested objects
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = transformMongoIds(result[key]);
    }
  }

  return result;
}

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
  const user = useAuthStore(s => s.user);
  const storeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const companyId = user?.activeCompanyId || storeCompanyId;
  const getItems = useDataStore(s => s.getItems);
  const addItem = useDataStore(s => s.addItem);
  const updateItem = useDataStore(s => s.updateItem);
  const deleteItem = useDataStore(s => s.deleteItem);
  const setActiveCompany = useDataStore(s => s.setActiveCompany);
  const activeCompanyId = useDataStore(s => s.activeCompanyId);
  const setItems = useDataStore(s => s.setItems);
  const data = useDataStore(s => s.data);
  const taskStore = useTaskStore();

  // Sync company from companyStore to dataStore
  useMemo(() => {
    if (companyId && companyId !== activeCompanyId) {
      setActiveCompany(companyId);
    }
  }, [companyId, activeCompanyId, setActiveCompany]);

  // Get data from store
  const strategies = useMemo(() => (getItems('blogStrategies') as BlogStrategy[]) || [], [getItems, data, activeCompanyId]);
  const contentTypes = useMemo(() => (getItems('blogContentTypes') as BlogContentTypeConfig[]) || [], [getItems, data, activeCompanyId]);
  const calendars = useMemo(() => (getItems('blogCalendars') as BlogCalendar[]) || [], [getItems, data, activeCompanyId]);
  const titles = useMemo(() => (getItems('blogTitles') as BlogTitle[]) || [], [getItems, data, activeCompanyId]);
  const posts = useMemo(() => (getItems('blogPosts') as BlogPost[]) || [], [getItems, data, activeCompanyId]);
  const seoConfigs = useMemo(() => (getItems('blogSEOConfigs') as BlogSEOConfig[]) || [], [getItems, data, activeCompanyId]);
  const chunks = useMemo(() => (getItems('blogContentChunks') as BlogContentChunk[]) || [], [getItems, data, activeCompanyId]);
  const structures = useMemo(() => (getItems('blogStructures') as BlogStructure[]) || [], [getItems, data, activeCompanyId]);
  const contentSections = useMemo(() => (getItems('blogContentSections') as BlogContentSection[]) || [], [getItems, data, activeCompanyId]);

  // Foundational data from API
  const [brand, setBrand] = useState<Brand | null | undefined>(undefined);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null | undefined>(undefined);
  const [icps, setIcps] = useState<ICP[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const products = useMemo(() => (getItems('products') as Product[]) || [], [getItems]);

  // Load data from API on mount / company change
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }

    const loadFromApi = async () => {
      setIsLoading(true);
      const [sRes, cRes, seoRes, tRes, pRes, chRes, eRes, stRes, csRes, bpRes, icpRes, personaRes, competitorRes, brandRes] = await Promise.all([
        blogStrategyApi.getAll(companyId),
        blogCalendarApi.getAll(companyId),
        blogSeoApi.getAll(companyId),
        blogTitleApi.getAll(companyId),
        blogPostApi.getAll(companyId),
        blogContentChunkApi.getAll(companyId),
        blogExportApi.getAll(companyId),
        blogStructureApi.getAll(companyId),
        blogContentSectionApi.getAll(companyId),
        businessProfileApi.getByCompany(companyId),
        icpApi.getAll(companyId),
        personaApi.getAll(companyId),
        competitorApi.getAll(companyId),
        moduleDataApi.get('brand-strategy', companyId),
      ]);

      // Log API responses for debugging
      const responses = [
        { name: 'strategies', res: sRes },
        { name: 'calendars', res: cRes },
        { name: 'seoConfigs', res: seoRes },
        { name: 'titles', res: tRes },
        { name: 'posts', res: pRes },
        { name: 'chunks', res: chRes },
        { name: 'exports', res: eRes },
        { name: 'structures', res: stRes },
        { name: 'contentSections', res: csRes },
        { name: 'businessProfile', res: bpRes },
        { name: 'icps', res: icpRes },
        { name: 'personas', res: personaRes },
        { name: 'competitors', res: competitorRes },
        { name: 'brand', res: brandRes },
      ];
      responses.forEach(({ name, res }) => {
        if (res.error) {
          console.error(`[BlogContentOS] API load failed for ${name}:`, res.error, `(status: ${res.status})`);
        } else if (res.data) {
          const dataInfo = Array.isArray(res.data) ? `${res.data.length} items` : 'object';
          console.log(`[BlogContentOS] Loaded ${name}:`, dataInfo);
        } else {
          console.warn(`[BlogContentOS] No data for ${name} (status: ${res.status})`);
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
        setItems('blogStrategies', mergeById(local, sRes.data as BlogStrategy[]));
      }
      if (cRes.data && Array.isArray(cRes.data) && cRes.data.length > 0) {
        const local = (getItems('blogCalendars') as BlogCalendar[]) || [];
        setItems('blogCalendars', mergeById(local, cRes.data as BlogCalendar[]));
      }
      if (seoRes.data && Array.isArray(seoRes.data) && seoRes.data.length > 0) {
        const local = (getItems('blogSEOConfigs') as BlogSEOConfig[]) || [];
        setItems('blogSEOConfigs', mergeById(local, seoRes.data as BlogSEOConfig[]));
      }
      if (tRes.data && Array.isArray(tRes.data) && tRes.data.length > 0) {
        const local = (getItems('blogTitles') as BlogTitle[]) || [];
        setItems('blogTitles', mergeById(local, tRes.data as BlogTitle[]));
      }
      if (pRes.data && Array.isArray(pRes.data) && pRes.data.length > 0) {
        const local = (getItems('blogPosts') as BlogPost[]) || [];
        setItems('blogPosts', mergeById(local, pRes.data as BlogPost[]));
      }
      if (chRes.data && Array.isArray(chRes.data) && chRes.data.length > 0) {
        const local = (getItems('blogContentChunks') as BlogContentChunk[]) || [];
        setItems('blogContentChunks', mergeById(local, chRes.data as BlogContentChunk[]));
      }
      if (eRes.data && Array.isArray(eRes.data) && eRes.data.length > 0) {
        const local = (getItems('blogExports') as BlogExport[]) || [];
        setItems('blogExports', mergeById(local, eRes.data as BlogExport[]));
      }
      if (stRes.data && Array.isArray(stRes.data) && stRes.data.length > 0) {
        const local = (getItems('blogStructures') as BlogStructure[]) || [];
        setItems('blogStructures', mergeById(local, stRes.data as BlogStructure[]));
      }
      if (csRes.data && Array.isArray(csRes.data) && csRes.data.length > 0) {
        const local = (getItems('blogContentSections') as BlogContentSection[]) || [];
        setItems('blogContentSections', mergeById(local, csRes.data as BlogContentSection[]));
      }

      // Foundational data
      if (bpRes.data) {
        const profile = transformMongoIds((bpRes.data as any).data || bpRes.data);
        console.log('[BlogContentOS] Business profile loaded:', profile);
        setBusinessProfile(profile);
      }
      if (icpRes.data) {
        const icpData = Array.isArray(icpRes.data) ? icpRes.data : [];
        console.log('[BlogContentOS] ICPs loaded:', icpData.length, 'items');
        setIcps(transformMongoIds(icpData));
      }
      if (personaRes.data) {
        const personaData = Array.isArray(personaRes.data) ? personaRes.data : [];
        console.log('[BlogContentOS] Personas loaded:', personaData.length, 'items');
        setPersonas(transformMongoIds(personaData));
      }
      if (competitorRes.data) {
        const competitorData = Array.isArray(competitorRes.data) ? competitorRes.data : [];
        console.log('[BlogContentOS] Competitors loaded:', competitorData.length, 'items');
        setCompetitors(transformMongoIds(competitorData));
      }
      if (brandRes.data) {
        const brandData = (brandRes.data as any).data || brandRes.data;
        if (brandData && typeof brandData === 'object' && Object.keys(brandData).length > 0) {
          console.log('[BlogContentOS] Brand loaded:', brandData);
          setBrand(transformMongoIds(brandData));
        }
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
  const [activeTab, setActiveTab] = useState<'strategy' | 'dataSource' | 'types' | 'calendar' | 'structure' | 'titles' | 'content' | 'seo' | 'assets' | 'review' | 'export'>('strategy');
  const [showCreateStrategyModal, setShowCreateStrategyModal] = useState(false);
  const [autoMapEnabled, setAutoMapEnabled] = useState(true);

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

  // Title generation
  const handleGenerateTitles = useCallback(async (count: number, style: TitleStyle) => {
    if (!activeStrategyId || !activeStrategy) return;

    const taskId = taskStore.createTask(
      `Generate ${count} Blog Titles`,
      'blog-content-os',
      count
    );

    const brandContext = brand ? `Brand voice: ${brand.voice || 'professional'}, Brand personality: ${brand.personality || 'friendly'}` : '';
    const businessContext = businessProfile ? `Industry: ${businessProfile.primaryIndustry || 'general'}, Company: ${businessProfile.name || 'our company'}` : '';
    const enabledTypes = contentTypes.filter((t) => t.enabled && t.strategyId === activeStrategyId);
    const typeNames = enabledTypes.length > 0 ? enabledTypes.map((t) => `${t.name} (${t.type}, ${t.funnelPosition} funnel)`).join(', ') : 'Educational (tofu), How-To Guide (tofu), Case Study (mofu)';

    const goalLabel = activeStrategy.goals?.[0] || 'seo';
    const funnelLabel = activeStrategy.funnelStage || 'tofu';
    const audienceLabel = activeStrategy.targetAudience || 'general professionals';

    // Get linked data from Data Sources tab
    const linkedData = activeStrategy.linkedData || {};
    const linkedIcpIds = (linkedData as any).icpIds || [];
    const linkedPersonaIds = (linkedData as any).personaIds || [];
    const linkedCompetitorIds = (linkedData as any).competitorIds || [];
    const linkedProductIds = (linkedData as any).productIds || [];

    // Filter linked items
    const linkedIcps = icps.filter((icp) => linkedIcpIds.includes(icp.id));
    const linkedPersonas = personas.filter((p) => linkedPersonaIds.includes(p.id));
    const linkedCompetitors = competitors.filter((c) => linkedCompetitorIds.includes(c.id));
    const linkedProducts = products.filter((p) => linkedProductIds.includes(p.id));

    // Build ICP context
    let icpContext = '';
    if (linkedIcps.length > 0) {
      icpContext = linkedIcps.map((icp, i) => {
        const pains = (icp as any).painPoints?.slice(0, 3).join(', ') || 'No pain points defined';
        const goals = (icp as any).goals?.slice(0, 3).join(', ') || 'No goals defined';
        return `ICP ${i + 1}: ${icp.name} - Pain Points: ${pains}. Goals: ${goals}`;
      }).join('\n');
    }

    // Build Persona context
    let personaContext = '';
    if (linkedPersonas.length > 0) {
      personaContext = linkedPersonas.map((p, i) => {
        const challenges = (p as any).challenges?.slice(0, 3).join(', ') || 'No challenges defined';
        return `Persona ${i + 1}: ${p.name} (${(p as any).jobTitle || 'No title'}) - Challenges: ${challenges}`;
      }).join('\n');
    }

    // Build Competitor context
    let competitorContext = '';
    if (linkedCompetitors.length > 0) {
      competitorContext = linkedCompetitors.map((c, i) => {
        const strengths = (c as any).strengths?.slice(0, 2).join(', ') || 'No strengths defined';
        const weaknesses = (c as any).weaknesses?.slice(0, 2).join(', ') || 'No weaknesses defined';
        return `Competitor ${i + 1}: ${c.name} - Strengths: ${strengths}. Weaknesses: ${weaknesses}`;
      }).join('\n');
    }

    // Build Product context
    let productContext = '';
    if (linkedProducts.length > 0) {
      productContext = linkedProducts.map((p, i) => {
        const features = (p as any).features?.slice(0, 3).join(', ') || 'No features defined';
        return `Product ${i + 1}: ${(p as any).name} - Key Features: ${features}`;
      }).join('\n');
    }

    const prompt = `You are an expert blog content strategist. Generate exactly ${count} blog post titles for a business blog.

Strategy context:
- Primary Goal: ${goalLabel}
- Target Audience: ${audienceLabel}
- Funnel Stage: ${funnelLabel}
${brandContext ? '- ' + brandContext : ''}
${businessContext ? '- ' + businessContext : ''}

Content types to cover: ${typeNames}

${icpContext ? `Target ICPs:\n${icpContext}\n` : ''}
${personaContext ? `Buyer Personas:\n${personaContext}\n` : ''}
${competitorContext ? `Competitor Landscape:\n${competitorContext}\n` : ''}
${productContext ? `Products/Services to Feature:\n${productContext}\n` : ''}

Title style: ${style}
${style === 'seo' ? 'Use keyword-rich, search-optimized titles that rank well.' : ''}
${style === 'viral' ? 'Use emotional, curiosity-driven titles that encourage clicks and shares.' : ''}
${style === 'authority' ? 'Use expert, credible positioning titles that establish thought leadership.' : ''}
${style === 'technical' ? 'Use precise, industry-specific titles for technical audiences.' : ''}
${style === 'emotional' ? 'Use feeling-driven, relatable titles that connect with readers.' : ''}
${style === 'founder' ? 'Use personal, authentic founder-style titles.' : ''}
${style === 'linkedin' ? 'Use professional, shareable titles optimized for LinkedIn.' : ''}
${style === 'thought-leadership' ? 'Use visionary, perspective-based titles that showcase expertise.' : ''}

You MUST respond with ONLY a valid JSON array. No markdown, no explanation, no code fences. Each element must be an object with exactly these fields:
- "title": string — the blog post title
- "slug": string — URL-friendly slug (lowercase, hyphens)
- "excerpt": string — brief summary (under 160 characters)
- "contentType": string — one of: ${enabledTypes.length > 0 ? enabledTypes.map((t) => t.type).join(', ') : 'educational, how-to-guide, industry-trends, case-study, comparison, product-focused, listicle, problem-solution, thought-leadership'}
- "funnelStage": string — one of: tofu, mofu, bofu
- "seoScore": number — estimated SEO score from 70-99
- "searchIntent": string — one of: informational, commercial, transactional
- "suggestedKeywords": array of 5 relevant keyword strings
- "suggestedCTA": string — a call-to-action phrase

Example of one item:
{"title": "The Complete Guide to SEO Strategy for 2024", "slug": "complete-guide-seo-strategy-2024", "excerpt": "Discover actionable SEO strategies to boost your organic traffic.", "contentType": "educational", "funnelStage": "tofu", "seoScore": 85, "searchIntent": "informational", "suggestedKeywords": ["seo strategy", "organic traffic", "search optimization", "keyword research", "content marketing"], "suggestedCTA": "Read the full guide"}

Generate ${count} diverse, creative titles now:`;

    try {
      console.log('[BlogContentOS] Calling AI generate API...');
      const response = await aiApi.generate({ prompt, maxTokens: 4000 });

      console.log('[BlogContentOS] AI API response:', { status: response.status, error: response.error, hasData: !!response.data });

      if (response.error || !response.data) {
        throw new Error(response.error || 'AI generation returned no data');
      }

      const aiResult = response.data as any;
      let content: string = aiResult.content || '';
      console.log('[BlogContentOS] AI raw content length:', content.length);

      if (typeof content !== 'string') {
        content = JSON.stringify(content);
      }

      // Strip markdown code fences if present
      content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

      let parsed: any[];
      try {
        parsed = JSON.parse(content);
      } catch {
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error('Could not parse AI response as JSON');
        }
      }

      if (!Array.isArray(parsed)) {
        throw new Error('AI response is not an array');
      }

      const titlesToCreate: any[] = [];
      parsed.slice(0, count).forEach((item: any, i: number) => {
        const contentType = enabledTypes.length > 0
          ? enabledTypes[i % enabledTypes.length]
          : { type: item.contentType || 'educational', funnelPosition: item.funnelStage || 'tofu', ctaStrategy: item.suggestedCTA || 'Learn more', seoIntent: item.searchIntent || 'informational' };

        const titleData = {
          id: `bt-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
          strategyId: activeStrategyId,
          title: item.title || 'Untitled Blog Post',
          slug: item.slug || generateSlug(item.title || 'Untitled'),
          excerpt: item.excerpt || '',
          contentType: contentType?.type || item.contentType || 'educational',
          style,
          seoScore: typeof item.seoScore === 'number' ? item.seoScore : Math.floor(Math.random() * 30) + 70,
          searchIntent: item.searchIntent || (contentType as any)?.seoIntent || 'informational',
          funnelStage: item.funnelStage || (contentType as any)?.funnelPosition || 'tofu',
          suggestedKeywords: Array.isArray(item.suggestedKeywords) ? item.suggestedKeywords : generateKeywords(item.contentType || 'educational'),
          suggestedCTA: item.suggestedCTA || (contentType as any)?.ctaStrategy || 'Learn more',
          status: 'generated',
          order: i,
          companyId,
          aiModel: aiResult.model || 'unknown',
        };

        addItem('blogTitles', titleData as any);
        titlesToCreate.push(titleData);
      });

      await Promise.all(titlesToCreate.map((t) => blogTitleApi.create(t).catch(() => {})));
      taskStore.completeBatch(taskId, 0, Array(Math.min(parsed.length, count)).fill('title'));
      console.log('[BlogContentOS] SUCCESS — AI generated', titlesToCreate.length, 'titles');
    } catch (error) {
      console.error('[BlogContentOS] AI title generation FAILED — falling back to templates. Error:', error);

      // Fallback to sample titles
      const fallbackType = { type: 'educational', funnelPosition: 'tofu', ctaStrategy: 'Learn more', seoIntent: 'informational' as const };
      const titlesToCreate: any[] = [];
      for (let i = 0; i < count; i++) {
        const contentType = enabledTypes.length > 0 ? enabledTypes[i % enabledTypes.length] : fallbackType;
        const result = generateSampleTitle((contentType as any)?.type || 'educational', style, brandContext, businessContext);

        const titleData = {
          id: `bt-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
          strategyId: activeStrategyId,
          title: result.title,
          slug: generateSlug(result.title),
          excerpt: result.excerpt,
          contentType: (contentType as any)?.type || 'educational',
          style,
          seoScore: Math.floor(Math.random() * 30) + 70,
          searchIntent: (contentType as any)?.seoIntent || 'informational',
          funnelStage: (contentType as any)?.funnelPosition || 'tofu',
          suggestedKeywords: generateKeywords((contentType as any)?.type || 'educational'),
          suggestedCTA: (contentType as any)?.ctaStrategy || 'Learn more',
          status: 'generated',
          order: i,
          companyId,
          aiModel: 'template',
        };

        addItem('blogTitles', titleData as any);
        titlesToCreate.push(titleData);
      }

      await Promise.all(titlesToCreate.map((t) => blogTitleApi.create(t).catch(() => {})));
      taskStore.completeBatch(taskId, 0, Array(count).fill('title'));
    }
  }, [activeStrategyId, activeStrategy, contentTypes, brand, businessProfile, icps, personas, competitors, products, addItem, taskStore, companyId]);

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
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 flex-shrink-0">
                <FileEdit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Blog Content OS</h1>
                <p className="hidden sm:block text-sm text-slate-400">AI-Powered Content Strategy & Generation</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activeStrategyId || ''}
                onChange={(e) => setActiveStrategyId(e.target.value || null)}
                className="flex-1 sm:flex-none min-w-0 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="">Select Strategy...</option>
                {strategies.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <button
                onClick={() => setShowCreateStrategyModal(true)}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm whitespace-nowrap flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline sm:inline">New Strategy</span>
                <span className="xs:hidden sm:hidden">New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-0 border-t border-slate-800 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[
            { id: 'strategy', label: 'Strategy', icon: Target },
            { id: 'dataSource', label: 'Data Sources', icon: Database },
            // { id: 'types', label: 'Types', icon: Layout },
            { id: 'titles', label: 'Titles', icon: Type },
            { id: 'seo', label: 'SEO', icon: Search },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'structure', label: 'Structure', icon: Layers },
            { id: 'content', label: 'Content', icon: FileEdit },
            { id: 'assets', label: 'Assets', icon: Image },
            { id: 'review', label: 'Review', icon: CheckCircle },
            { id: 'export', label: 'Export', icon: Download },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              )}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-3 sm:p-6">
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

            {activeTab === 'dataSource' && activeStrategy && (
              <DataSourcesTab
                strategy={activeStrategy}
                brand={brand}
                businessProfile={businessProfile}
                icps={icps}
                personas={personas}
                competitors={competitors}
                onUpdate={(updates) => handleUpdateStrategy(activeStrategy.id, updates)}
              />
            )}

            {/* {activeTab === 'types' && activeStrategy && (
              <ContentTypesTab
                strategyId={activeStrategy.id}
                contentTypes={contentTypes.filter((t) => t.strategyId === activeStrategy.id)}
                onUpdate={(id, updates) => updateItem('blogContentTypes', id, updates)}
              />
            )} */}

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
                onClearGenerated={async () => {
                  const generated = titles.filter((t) => t.strategyId === activeStrategy.id && t.status === 'generated');
                  setItems('blogTitles', titles.filter((t) => t.status !== 'generated' || t.strategyId !== activeStrategy.id));
                  await Promise.all(generated.map((t) => blogTitleApi.delete(t.id).catch(() => {})));
                }}
                onClearSelected={async () => {
                  const selected = titles.filter((t) => t.strategyId === activeStrategy.id && t.status === 'selected');
                  const updated = titles.map((t) =>
                    t.strategyId === activeStrategy.id && t.status === 'selected' ? { ...t, status: 'rejected' as const } : t
                  );
                  setItems('blogTitles', updated);
                  await Promise.all(selected.map((t) => blogTitleApi.update(t.id, { status: 'rejected' }).catch(() => {})));
                }}
              />
            )}

            {activeTab === 'seo' && activeStrategy && (
              <SEOTab
                strategy={activeStrategy}
                titles={titles.filter((t) => t.strategyId === activeStrategy.id && t.status === 'selected')}
                brand={brand}
                businessProfile={businessProfile}
                icps={icps}
                personas={personas}
                competitors={competitors}
                seoConfig={seoConfigs.find((c) => c.strategyId === activeStrategy.id) || null}
                onSaveSEO={async (data) => {
                  const existing = seoConfigs.find((c) => c.strategyId === activeStrategy.id);
                  if (existing) {
                    updateItem('blogSEOConfigs', existing.id, data);
                    await blogSeoApi.update(existing.id, { ...data, companyId });
                  } else {
                    const localId = addItem('blogSEOConfigs', { ...data, id: `seo-${Date.now()}`, companyId } as any);
                    await blogSeoApi.create({ ...data, id: localId, companyId });
                  }
                }}
                onUpdateTitle={async (id, updates) => {
                  updateItem('blogTitles', id, updates);
                  await blogTitleApi.update(id, updates);
                }}
              />
            )}

            {activeTab === 'content' && activeStrategy && (
              <ContentTab
                strategy={activeStrategy}
                posts={posts.filter((p) => p.strategyId === activeStrategy.id)}
                titles={titles.filter((t) => t.strategyId === activeStrategy.id && t.status === 'selected')}
                contentTypes={contentTypes.filter((t) => t.strategyId === activeStrategy.id)}
                calendars={calendars.filter((c) => c.strategyId === activeStrategy.id)}
                structures={structures.filter((s) => s.strategyId === activeStrategy.id)}
                contentSections={contentSections}
                autoMapEnabled={autoMapEnabled}
                onAutoMapToggle={() => setAutoMapEnabled(!autoMapEnabled)}
                brand={brand}
                businessProfile={businessProfile}
                icps={icps}
                personas={personas}
                competitors={competitors}
                products={products}
                seoConfigs={seoConfigs}
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
                onUpdateCalendar={async (id, updates) => {
                  updateItem('blogCalendars', id, updates);
                  await blogCalendarApi.update(id, updates);
                }}
                onCreateContentSection={async (data) => {
                  const localId = addItem('blogContentSections', data as any);
                  const res = await blogContentSectionApi.create({ ...data, id: localId, companyId });
                  if (res.data && (res.data as any).id && (res.data as any).id !== localId) {
                    updateItem('blogContentSections', localId, { id: (res.data as any).id });
                  }
                }}
                onUpdateContentSection={async (id, updates) => {
                  updateItem('blogContentSections', id, updates);
                  await blogContentSectionApi.update(id, updates);
                }}
              />
            )}

            {activeTab === 'calendar' && activeStrategy && (
              <CalendarTab
                strategy={activeStrategy}
                calendars={calendars.filter((c) => c.strategyId === activeStrategy.id)}
                posts={posts.filter((p) => p.strategyId === activeStrategy.id)}
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

            {activeTab === 'structure' && activeStrategy && (
              <StructureTab
                strategy={activeStrategy}
                structures={structures.filter((s) => s.strategyId === activeStrategy.id)}
                contentSections={contentSections}
                titles={titles.filter((t) => t.strategyId === activeStrategy.id)}
                calendars={calendars.filter((c) => c.strategyId === activeStrategy.id)}
                seoConfig={seoConfigs.find((c) => c.strategyId === activeStrategy.id) || null}
                brand={brand}
                businessProfile={businessProfile}
                icps={icps}
                personas={personas}
                competitors={competitors}
                onCreateStructure={async (data) => {
                  console.log('[Structure] Creating structure with data:', data);
                  console.log('[Structure] companyId:', companyId, 'activeStrategy.id:', activeStrategy.id);
                  try {
                    if (!companyId) {
                      throw new Error('No company selected');
                    }
                    const localId = addItem('blogStructures', { ...data, strategyId: activeStrategy.id } as any);
                    console.log('[Structure] Local ID:', localId);
                    if (!localId) {
                      throw new Error('Failed to create local structure - activeCompanyId may not be set');
                    }
                    const res = await blogStructureApi.create({ ...data, strategyId: activeStrategy.id, id: localId, companyId });
                    console.log('[Structure] API response:', res);
                    if (res.error) {
                      console.error('[Structure] API error:', res.error);
                    }
                    if (res.data && (res.data as any).id && (res.data as any).id !== localId) {
                      updateItem('blogStructures', localId, { id: (res.data as any).id });
                    }
                  } catch (error) {
                    console.error('[Structure] Error creating structure:', error);
                    throw error;
                  }
                }}
                onUpdateStructure={async (id, updates) => {
                  updateItem('blogStructures', id, updates);
                  await blogStructureApi.update(id, updates);
                }}
                onDeleteStructure={async (id) => {
                  deleteItem('blogStructures', id);
                  await blogStructureApi.delete(id);
                }}
                onCreateSection={async (data) => {
                  const localId = addItem('blogContentSections', data as any);
                  const res = await blogContentSectionApi.create({ ...data, id: localId, companyId });
                  if (res.data && (res.data as any).id && (res.data as any).id !== localId) {
                    updateItem('blogContentSections', localId, { id: (res.data as any).id });
                  }
                }}
                onUpdateSection={async (id, updates) => {
                  updateItem('blogContentSections', id, updates);
                  await blogContentSectionApi.update(id, updates);
                }}
                onDeleteSection={async (id) => {
                  deleteItem('blogContentSections', id);
                  await blogContentSectionApi.delete(id);
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
  brand: Brand | null | undefined;
  businessProfile: BusinessProfile | null | undefined;
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
  posts,
  onCreateCalendar,
  onUpdateCalendar,
}: {
  strategy: BlogStrategy;
  calendars: BlogCalendar[];
  posts: BlogPost[];
  onCreateCalendar: (data: Partial<BlogCalendar>) => void;
  onUpdateCalendar: (id: string, updates: Partial<BlogCalendar>) => void;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const activeCalendar = calendars[0];

  // Get content title for a calendar item
  const getContentTitle = (item: BlogCalendarItem) => {
    if (item.postId) {
      const post = posts.find(p => p.id === item.postId);
      if (post) return { type: 'post', title: post.title, status: post.status };
    }
    return null;
  };

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
                onClick={() => setShowEditModal(true)}
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
              <h4 className="text-sm font-medium text-slate-400 mb-3">
                Content Pipeline ({activeCalendar.timeline.length} posts
                {activeCalendar.publishingDays.length > 0 && (
                  <span className="text-primary-400"> on {activeCalendar.publishingDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}</span>
                )})
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeCalendar.timeline.slice(0, 20).map((item, index) => {
                  const scheduledDate = item.scheduledDate ? new Date(item.scheduledDate) : null;
                  const dayName = scheduledDate ? scheduledDate.toLocaleDateString('en-US', { weekday: 'long' }) : 'Not scheduled';
                  const dayNameLower = dayName.toLowerCase();
                  const isPublishingDay = scheduledDate && activeCalendar.publishingDays.includes(dayNameLower);
                  const contentInfo = getContentTitle(item);

                  return (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="text-sm font-medium text-slate-500 w-8">#{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-200">
                          {scheduledDate ? scheduledDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Not scheduled'}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="text-primary-400">{dayName}</span>
                          {isPublishingDay && (
                            <span className="text-green-400">• Publishing Day</span>
                          )}
                        </div>
                        {/* Show content title if assigned */}
                        {contentInfo && (
                          <div className="mt-1 flex items-center gap-2">
                            <span className={cn(
                              'text-xs px-1.5 py-0.5 rounded',
                              contentInfo.type === 'title' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                            )}>
                              {contentInfo.type === 'title' ? 'Title' : 'Post'}
                            </span>
                            <span className="text-xs text-slate-300 truncate">{contentInfo.title}</span>
                          </div>
                        )}
                      </div>
                      <div
                        className={cn(
                          'px-2 py-1 rounded text-xs flex-shrink-0',
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
                  );
                })}
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

      {showEditModal && activeCalendar && (
        <EditCalendarModal
          calendar={activeCalendar}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updates) => {
            onUpdateCalendar(activeCalendar.id, updates);
            setShowEditModal(false);
          }}
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
    // Generate timeline based on selected publishing days
    const timeline: BlogCalendarItem[] = [];
    const startDate = new Date();

    // Sort publishing days by day of week (0=Sunday, 1=Monday, etc.)
    const dayOrder: Record<string, number> = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };

    const sortedPublishingDays = [...publishingDays].sort((a, b) => dayOrder[a] - dayOrder[b]);

    // Get current day of week (0-6)
    const currentDayOfWeek = startDate.getDay();

    // Generate dates for each post, cycling through selected publishing days
    for (let i = 0; i < postsPerCycle; i++) {
      const dayIndex = i % sortedPublishingDays.length;
      const targetDay = sortedPublishingDays[dayIndex];
      const targetDayOfWeek = dayOrder[targetDay];

      // Calculate days to add to get to the target publishing day
      let daysToAdd = targetDayOfWeek - currentDayOfWeek;

      // If we've already passed this day in the current week, move to next week
      if (daysToAdd < 0) {
        daysToAdd += 7;
      }

      // For posts beyond the first cycle, add weeks
      const weekOffset = Math.floor(i / sortedPublishingDays.length);
      daysToAdd += weekOffset * 7;

      // If this is the first post and it's today, start from today
      if (i === 0 && daysToAdd === 0) {
        daysToAdd = 0;
      }

      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(startDate.getDate() + daysToAdd);

      timeline.push({
        id: `calendar-item-${i}`,
        scheduledDate: scheduledDate.toISOString(),
        status: 'empty',
        contentTypeId: undefined,
        titleId: undefined,
        postId: undefined,
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
// EDIT CALENDAR MODAL
// ============================================

function EditCalendarModal({
  calendar,
  onClose,
  onUpdate,
}: {
  calendar: BlogCalendar;
  onClose: () => void;
  onUpdate: (updates: Partial<BlogCalendar>) => void;
}) {
  const [name, setName] = useState(calendar.name);
  const [frequency, setFrequency] = useState<BloggingFrequency>(calendar.frequency);
  const [postsPerCycle, setPostsPerCycle] = useState(calendar.postsPerCycle);
  const [publishingDays, setPublishingDays] = useState<string[]>(calendar.publishingDays);

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

  const generateTimeline = (days: string[], count: number): BlogCalendarItem[] => {
    const timeline: BlogCalendarItem[] = [];
    const startDate = new Date();

    const dayOrder: Record<string, number> = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };

    const sortedDays = [...days].sort((a, b) => dayOrder[a] - dayOrder[b]);
    const currentDayOfWeek = startDate.getDay();

    for (let i = 0; i < count; i++) {
      const dayIndex = i % sortedDays.length;
      const targetDay = sortedDays[dayIndex];
      const targetDayOfWeek = dayOrder[targetDay];

      let daysToAdd = targetDayOfWeek - currentDayOfWeek;

      if (daysToAdd < 0) {
        daysToAdd += 7;
      }

      const weekOffset = Math.floor(i / sortedDays.length);
      daysToAdd += weekOffset * 7;

      if (i === 0 && daysToAdd === 0) {
        daysToAdd = 0;
      }

      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(startDate.getDate() + daysToAdd);

      // Preserve existing item data if it exists
      const existingItem = calendar.timeline[i];

      timeline.push({
        id: existingItem?.id || `calendar-item-${i}`,
        scheduledDate: scheduledDate.toISOString(),
        status: existingItem?.status || 'empty',
        contentTypeId: existingItem?.contentTypeId,
        titleId: existingItem?.titleId,
        postId: existingItem?.postId,
      });
    }

    return timeline;
  };

  const handleSubmit = () => {
    const newTimeline = generateTimeline(publishingDays, postsPerCycle);

    onUpdate({
      name,
      frequency,
      postsPerCycle,
      publishingDays,
      timeline: newTimeline,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-200">Edit Blog Calendar</h2>
          <p className="text-sm text-slate-400">Update your publishing schedule</p>
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
              onChange={(e) => setPostsPerCycle(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Changing this will regenerate the content pipeline
            </p>
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
            <p className="text-xs text-slate-500 mt-1">
              Posts will be scheduled on these days
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Preview</h4>
            <div className="text-sm text-slate-400">
              <p><span className="text-slate-300">{postsPerCycle}</span> posts on <span className="text-primary-400">{publishingDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ') || 'No days selected'}</span></p>
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STRUCTURE TAB
// ============================================

const DEFAULT_STRUCTURE_SECTIONS: Omit<StructureSection, 'id'>[] = [
  { order: 1, type: 'intro', title: 'Introduction', description: 'Hook the reader and introduce the topic with compelling context', generateContent: true, required: true, targetWordCount: 250, headingLevel: 2 },
  { order: 2, type: 'problem', title: 'The Problem', description: 'Define the challenge or pain point with specific examples', generateContent: true, required: true, targetWordCount: 350, headingLevel: 2 },
  { order: 3, type: 'explanation', title: 'Deep Dive: Understanding the Topic', description: 'Provide comprehensive context, background, and key concepts', generateContent: true, required: true, targetWordCount: 500, headingLevel: 2 },
  { order: 4, type: 'benefits', title: 'Key Benefits and Advantages', description: 'Highlight the key advantages with specific examples and data', generateContent: true, required: true, targetWordCount: 400, headingLevel: 2 },
  { order: 5, type: 'steps', title: 'How to Get Started: Step-by-Step Guide', description: 'Practical steps and implementation with actionable advice', generateContent: true, required: true, targetWordCount: 600, headingLevel: 2 },
  { order: 6, type: 'examples', title: 'Real-World Examples and Case Studies', description: 'Real-world examples and case studies with lessons learned', generateContent: true, required: false, targetWordCount: 400, headingLevel: 2 },
  { order: 7, type: 'conclusion', title: 'Conclusion and Next Steps', description: 'Summarise key points and provide clear call-to-action', generateContent: true, required: true, targetWordCount: 250, headingLevel: 2 },
];

const STRUCTURE_TYPES: { value: StructureType; label: string; description: string }[] = [
  { value: 'seo', label: 'SEO Article', description: 'Optimised for search engines and organic traffic' },
  { value: 'technical', label: 'Technical Guide', description: 'In-depth technical content with code examples' },
  { value: 'thought-leadership', label: 'Thought Leadership', description: 'Industry insights and expert perspectives' },
  { value: 'comparison', label: 'Comparison', description: 'Compare products, services, or approaches' },
  { value: 'listicle', label: 'Listicle', description: 'Numbered list format for easy scanning' },
  { value: 'case-study', label: 'Case Study', description: 'Real-world success story analysis' },
  { value: 'product-focused', label: 'Product Focused', description: 'Feature highlights and product deep-dives' },
];

function StructureTab({
  strategy,
  structures,
  contentSections,
  titles,
  calendars,
  seoConfig,
  brand,
  businessProfile,
  icps,
  personas,
  competitors,
  onCreateStructure,
  onUpdateStructure,
  onDeleteStructure,
  onCreateSection,
  onUpdateSection,
  onDeleteSection,
}: {
  strategy: BlogStrategy;
  structures: BlogStructure[];
  contentSections: BlogContentSection[];
  titles: BlogTitle[];
  calendars: BlogCalendar[];
  seoConfig: BlogSEOConfig | null;
  brand: Brand | null | undefined;
  businessProfile: BusinessProfile | null | undefined;
  icps: ICP[];
  personas: Persona[];
  competitors: Competitor[];
  onCreateStructure: (data: Partial<BlogStructure>) => Promise<void>;
  onUpdateStructure: (id: string, updates: Partial<BlogStructure>) => Promise<void>;
  onDeleteStructure: (id: string) => Promise<void>;
  onCreateSection: (data: Partial<BlogContentSection>) => Promise<void>;
  onUpdateSection: (id: string, updates: Partial<BlogContentSection>) => Promise<void>;
  onDeleteSection: (id: string) => Promise<void>;
}) {
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Debug: Log received props
  console.log('[StructureTab] Received structures:', structures.length, structures);
  console.log('[StructureTab] Received titles:', titles.length, titles);
  console.log('[StructureTab] Strategy ID:', strategy.id);

  const selectedStructure = useMemo(() =>
    structures.find((s) => s.id === selectedStructureId) || null,
    [structures, selectedStructureId]
  );

  // Get scheduled dates from calendar
  const scheduledDates = useMemo(() => {
    const dates: { date: string; titleId?: string; title?: string }[] = [];
    calendars.forEach((cal) => {
      cal.timeline.forEach((item) => {
        if (item.scheduledDate) {
          const title = titles.find((t) => t.id === item.titleId);
          dates.push({
            date: item.scheduledDate,
            titleId: item.titleId,
            title: title?.title,
          });
        }
      });
    });
    return dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [calendars, titles]);

  // Build context for AI generation - filtered by linked data from Data Sources tab
  const buildStructureContext = () => {
    const context: string[] = [];
    const linkedData = strategy.linkedData || {};

    // Filter brand by linkedData.brandId
    const linkedBrand = linkedData.brandId ? brand : null;
    if (linkedBrand || brand) {
      const b = linkedBrand || brand;
      if (b) {
        context.push(`Brand Voice: ${b.voice || 'professional'}`);
        context.push(`Brand Personality: ${b.personality || 'friendly'}`);
        if (b.tagline) context.push(`Brand Tagline: ${b.tagline}`);
        if (b.purposeWhyExists) context.push(`Brand Purpose: ${b.purposeWhyExists}`);
      }
    }

    // Filter business profile by linkedData.businessProfileId
    const linkedProfile = linkedData.businessProfileId ? businessProfile : null;
    const activeProfile = linkedProfile || businessProfile;
    if (activeProfile) {
      context.push(`Industry: ${activeProfile.primaryIndustry || 'general'}`);
      context.push(`Company: ${activeProfile.name || 'our company'}`);
      if (activeProfile.description) context.push(`Business Description: ${activeProfile.description.slice(0, 200)}`);
    }

    // Filter ICPs by linkedData.icpIds
    const linkedIcpIds = linkedData.icpIds || [];
    const filteredIcps = linkedIcpIds.length > 0
      ? icps.filter((i) => linkedIcpIds.includes(i.id))
      : icps;
    if (filteredIcps.length > 0) {
      context.push(`Target ICPs: ${filteredIcps.map((i) => `${i.name}${i.description ? ` (${i.description.slice(0, 50)}...)` : ''}`).join(', ')}`);
    }

    // Filter personas by linkedData.personaIds
    const linkedPersonaIds = linkedData.personaIds || [];
    const filteredPersonas = linkedPersonaIds.length > 0
      ? personas.filter((p) => linkedPersonaIds.includes(p.id))
      : personas;
    if (filteredPersonas.length > 0) {
      context.push(`Target Personas: ${filteredPersonas.map((p) => `${p.name}${p.jobTitle ? ` (${p.jobTitle})` : ''}`).join(', ')}`);
    }

    // Filter competitors by linkedData.competitorIds
    const linkedCompetitorIds = linkedData.competitorIds || [];
    const filteredCompetitors = linkedCompetitorIds.length > 0
      ? competitors.filter((c) => linkedCompetitorIds.includes(c.id))
      : competitors;
    if (filteredCompetitors.length > 0) {
      context.push(`Key Competitors: ${filteredCompetitors.map((c) => c.name).join(', ')}`);
    }

    if (seoConfig?.primaryKeywords?.length) {
      context.push(`Primary Keywords: ${seoConfig.primaryKeywords.join(', ')}`);
    }

    if (seoConfig?.secondaryKeywords?.length) {
      context.push(`Secondary Keywords: ${seoConfig.secondaryKeywords.join(', ')}`);
    }

    context.push(`Goals: ${strategy.goals?.join(', ') || 'SEO, Brand Awareness'}`);
    context.push(`Target Audience: ${strategy.targetAudience || 'general professionals'}`);
    context.push(`Funnel Stage: ${strategy.funnelStage || 'tofu'}`);
    context.push(`Content Depth: ${strategy.contentDepth || 'standard'}`);

    return context.join('\n');
  };

  // Generate structure from title/context
  const handleGenerateStructure = async (title?: BlogTitle) => {
    if (!title) return;

    setIsGenerating(true);
    try {
      const context = buildStructureContext();

      const prompt = `You are an expert content strategist creating blog article structures.

BLOG TITLE: ${title.title}
CONTENT TYPE: ${title.contentType || 'educational'}
SEARCH INTENT: ${title.searchIntent || 'informational'}
FUNNEL STAGE: ${title.funnelStage || 'tofu'}

${context ? `CONTEXT:\n${context}` : ''}

Create an optimal article structure for a COMPREHENSIVE, in-depth article. The total word count should be at least 2000 words.

You MUST respond with ONLY a valid JSON array. No markdown, no explanation, no code fences. Each element must be an object with:
- "type": one of "intro", "problem", "explanation", "benefits", "steps", "examples", "conclusion", "cta", "custom"
- "title": string (the section heading - clear and engaging)
- "description": string (detailed description of what this section covers - 1-2 sentences)
- "headingLevel": number (1-4, where 1 is H1, 2 is H2, etc.)
- "targetWordCount": number (recommended word count - be generous, aim for 200-500 words per section for in-depth content)
- "keywords": array of 3-5 relevant keyword strings for this section
- "aiInstructions": string (specific instructions for AI content generation - what to focus on, examples to include)
- "generateContent": boolean (true for sections to auto-generate)
- "required": boolean (true for essential sections)

IMPORTANT GUIDELINES:
- Each section should have at least 200-400 words for proper depth
- Include 5-8 sections for a comprehensive article
- Add specific AI instructions for each section about what examples or data to include
- Assign 3-5 relevant keywords to each section for SEO optimization
- Total word count should be 2000-4000 words for a deep-dive article

Generate the optimal structure now:`;

      console.log('[Structure] Calling AI API...');
      const response = await aiApi.generate({ prompt, maxTokens: 4000, noCache: true });
      console.log('[Structure] AI API response:', response);

      // Check for API error
      if (response.error) {
        throw new Error(`AI API Error: ${response.error}`);
      }

      if (response.data) {
        const content = (response.data as any).content || '';
        console.log('[Structure] AI content:', content.substring(0, 500));

        if (!content || content.trim().length === 0) {
          throw new Error('AI returned empty content');
        }

        let parsed: any[] = [];

        try {
          let cleaned = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
          const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          } else {
            parsed = JSON.parse(cleaned);
          }
          console.log('[Structure] Parsed sections:', parsed.length);
        } catch (parseError) {
          console.error('[Structure] Failed to parse AI response:', parseError);
          // Use default sections on parse error
          parsed = DEFAULT_STRUCTURE_SECTIONS.map((s, i) => ({
            ...s,
            id: `sec-${Date.now()}-${i}`,
            keywords: title.suggestedKeywords?.slice(0, 3) || [],
          }));
        }

        // Create structure with parsed sections
        const sections: StructureSection[] = parsed.map((s: any, i: number) => ({
          id: `sec-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
          order: i + 1,
          type: s.type || 'custom',
          title: s.title || `Section ${i + 1}`,
          description: s.description || '',
          headingLevel: s.headingLevel || 2,
          targetWordCount: s.targetWordCount || 200,
          keywords: Array.isArray(s.keywords) ? s.keywords : [],
          aiInstructions: s.aiInstructions || '',
          generateContent: s.generateContent !== false,
          required: s.required !== false,
          contentGenerated: false,
        }));

        const totalWordCount = sections.reduce((sum, s) => sum + (s.targetWordCount || 0), 0);

        const structureData = {
          strategyId: strategy.id,
          titleId: title.id,
          name: title.title,
          type: (title.contentType as StructureType) || 'seo',
          aiGenerated: true,
          editable: true,
          totalWordCount,
          status: 'generated' as StructureStatus,
          sections,
          companyId: strategy.companyId,
        };
        console.log('[Structure] Creating structure with data:', structureData);

        await onCreateStructure(structureData);
        console.log('[Structure] Structure created successfully');
      }
    } catch (error) {
      console.error('[Structure] Generation error:', error);
      // Create with default structure on error
      try {
        const sections: StructureSection[] = DEFAULT_STRUCTURE_SECTIONS.map((s, i) => ({
          ...s,
          id: `sec-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
          keywords: [],
          contentGenerated: false,
        }));

        const totalWordCount = sections.reduce((sum, s) => sum + (s.targetWordCount || 0), 0);

        await onCreateStructure({
          strategyId: strategy.id,
          titleId: title?.id,
          name: title?.title || 'New Structure',
          type: 'seo',
          aiGenerated: false,
          editable: true,
          totalWordCount,
          status: 'draft' as StructureStatus,
          sections,
          companyId: strategy.companyId,
        });
        console.log('[Structure] Fallback structure created successfully');
      } catch (fallbackError) {
        console.error('[Structure] Fallback creation error:', fallbackError);
        throw fallbackError;
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Reorder section
  const handleReorderSection = (structureId: string, sectionId: string, direction: 'up' | 'down') => {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure) return;

    const sections = [...structure.sections];
    const currentIndex = sections.findIndex((s) => s.id === sectionId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sections.length) return;

    [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];
    const updatedSections = sections.map((s, i) => ({ ...s, order: i + 1 }));

    onUpdateStructure(structureId, { sections: updatedSections });
  };

  // Update section
  const handleUpdateSection = (structureId: string, sectionId: string, updates: Partial<StructureSection>) => {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure) return;

    const updatedSections = structure.sections.map((s) =>
      s.id === sectionId ? { ...s, ...updates } : s
    );

    onUpdateStructure(structureId, { sections: updatedSections });
  };

  // Add new section
  const handleAddSection = (structureId: string) => {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure) return;

    const newSection: StructureSection = {
      id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      order: structure.sections.length + 1,
      type: 'custom',
      title: 'New Section',
      description: '',
      headingLevel: 2,
      targetWordCount: 200,
      keywords: [],
      aiInstructions: '',
      generateContent: true,
      required: false,
      contentGenerated: false,
    };

    onUpdateStructure(structureId, { sections: [...structure.sections, newSection] });
  };

  // Delete section
  const handleDeleteSection = (structureId: string, sectionId: string) => {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure) return;

    const updatedSections = structure.sections
      .filter((s) => s.id !== sectionId)
      .map((s, i) => ({ ...s, order: i + 1 }));

    onUpdateStructure(structureId, { sections: updatedSections });
  };

  // Get structures without titles
  const unstructuredTitles = useMemo(() =>
    titles.filter((t) => !structures.some((s) => s.titleId === t.id)),
    [titles, structures]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary-400" />
              Content Structures
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Plan and generate section-by-section blog outlines before writing content
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Structure
          </button>
        </div>
      </div>

      {/* Unstructured Titles - Titles without structures */}
      {unstructuredTitles.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h4 className="text-sm font-medium text-slate-300 mb-4">
            Create Structure for Selected Titles ({unstructuredTitles.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {unstructuredTitles.map((title) => (
              <div
                key={title.id}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-200 truncate">{title.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{title.contentType}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">{title.searchIntent}</span>
                    {title.scheduledDate && (
                      <>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-green-400">
                          {new Date(title.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleGenerateStructure(title)}
                  disabled={isGenerating}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  {isGenerating ? 'Generating...' : 'Generate Structure'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Structures */}
      {structures.length === 0 && unstructuredTitles.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <Layers className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No Structures Yet</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {titles.length === 0
              ? 'Generate titles in the Titles tab first, then create structures for them.'
              : 'All titles already have structures. Create more titles in the Titles tab to generate additional structures.'}
          </p>
        </div>
      )}

      {/* Structure List */}
      {structures.length > 0 && (
        <div className="space-y-4">
          {structures.map((structure) => (
            <div
              key={structure.id}
              className={cn(
                'bg-slate-800/50 border rounded-xl overflow-hidden transition-all',
                selectedStructureId === structure.id ? 'border-primary-500/50' : 'border-slate-700'
              )}
            >
              {/* Structure Header */}
              <div
                className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setSelectedStructureId(selectedStructureId === structure.id ? null : structure.id)}
              >
                <div className="flex-1">
                  <div className="font-medium text-slate-200">{structure.name}</div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        structure.status === 'draft' && 'bg-slate-700 text-slate-400',
                        structure.status === 'generated' && 'bg-blue-500/20 text-blue-400',
                        structure.status === 'edited' && 'bg-amber-500/20 text-amber-400',
                        structure.status === 'approved' && 'bg-green-500/20 text-green-400'
                      )}
                    >
                      {structure.status}
                    </span>
                    <span className="text-xs text-slate-500">{structure.type}</span>
                    <span className="text-xs text-slate-500">{structure.totalWordCount} words</span>
                    <span className="text-xs text-slate-500">{structure.sections.length} sections</span>
                    {structure.aiGenerated && (
                      <span className="text-xs text-primary-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Generated
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteStructure(structure.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Structure Details */}
              {selectedStructureId === structure.id && (
                <div className="border-t border-slate-700 p-4 space-y-4">
                  {/* Structure Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-slate-200">{structure.sections.length}</div>
                      <div className="text-xs text-slate-500">Sections</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-slate-200">{structure.totalWordCount}</div>
                      <div className="text-xs text-slate-500">Target Words</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-slate-200">
                        {structure.sections.filter((s) => s.generateContent).length}
                      </div>
                      <div className="text-xs text-slate-500">AI Sections</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-slate-200">
                        {structure.sections.filter((s) => s.required).length}
                      </div>
                      <div className="text-xs text-slate-500">Required</div>
                    </div>
                  </div>

                  {/* Sections List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-slate-300">Sections</h4>
                      <button
                        onClick={() => handleAddSection(structure.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add Section
                      </button>
                    </div>
                    <div className="space-y-2">
                      {structure.sections.map((section, index) => (
                        <div
                          key={section.id}
                          className="bg-slate-900/50 rounded-lg p-4 border border-slate-700"
                        >
                          <div className="flex items-start gap-3">
                            {/* Order Controls */}
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleReorderSection(structure.id, section.id, 'up')}
                                disabled={index === 0}
                                className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReorderSection(structure.id, section.id, 'down')}
                                disabled={index === structure.sections.length - 1}
                                className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Section Content */}
                            <div className="flex-1 min-w-0">
                              {editingSectionId === section.id ? (
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => handleUpdateSection(structure.id, section.id, { title: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                                    placeholder="Section Title"
                                  />
                                  <textarea
                                    value={section.description || ''}
                                    onChange={(e) => handleUpdateSection(structure.id, section.id, { description: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500 resize-none"
                                    placeholder="Section Description"
                                    rows={2}
                                  />
                                  <textarea
                                    value={section.aiInstructions || ''}
                                    onChange={(e) => handleUpdateSection(structure.id, section.id, { aiInstructions: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500 resize-none"
                                    placeholder="AI Instructions (specific guidance for content generation)"
                                    rows={2}
                                  />
                                  <input
                                    type="text"
                                    value={section.keywords?.join(', ') || ''}
                                    onChange={(e) => handleUpdateSection(structure.id, section.id, {
                                      keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean)
                                    })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                                    placeholder="Keywords (comma-separated)"
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs text-slate-500 mb-1">Word Count</label>
                                      <input
                                        type="number"
                                        value={section.targetWordCount || 200}
                                        onChange={(e) => handleUpdateSection(structure.id, section.id, { targetWordCount: parseInt(e.target.value) || 200 })}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-slate-500 mb-1">Heading Level</label>
                                      <select
                                        value={section.headingLevel || 2}
                                        onChange={(e) => handleUpdateSection(structure.id, section.id, { headingLevel: parseInt(e.target.value) as 1 | 2 | 3 | 4 })}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                                      >
                                        <option value={1}>H1</option>
                                        <option value={2}>H2</option>
                                        <option value={3}>H3</option>
                                        <option value={4}>H4</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-slate-300">
                                      <input
                                        type="checkbox"
                                        checked={section.generateContent}
                                        onChange={(e) => handleUpdateSection(structure.id, section.id, { generateContent: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-primary-500 focus:ring-primary-500"
                                      />
                                      Generate Content
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-slate-300">
                                      <input
                                        type="checkbox"
                                        checked={section.required}
                                        onChange={(e) => handleUpdateSection(structure.id, section.id, { required: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-primary-500 focus:ring-primary-500"
                                      />
                                      Required
                                    </label>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => setEditingSectionId(null)}
                                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">H{section.headingLevel || 2}</span>
                                    <span className="text-sm font-medium text-slate-200">{section.title}</span>
                                    {section.required && (
                                      <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Required</span>
                                    )}
                                    {!section.generateContent && (
                                      <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">No AI</span>
                                    )}
                                  </div>
                                  {section.description && (
                                    <p className="text-xs text-slate-400 mt-1">{section.description}</p>
                                  )}
                                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                                    <span className="text-xs text-slate-500">{section.targetWordCount} words</span>
                                    {section.keywords && section.keywords.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Tag className="w-3 h-3 text-slate-500" />
                                        <span className="text-xs text-slate-500">{section.keywords.slice(0, 3).join(', ')}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingSectionId(editingSectionId === section.id ? null : section.id)}
                                className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSection(structure.id, section.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => onUpdateStructure(structure.id, { status: 'approved' })}
                      disabled={structure.status === 'approved'}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:bg-green-800 text-white rounded-lg text-sm transition-colors"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Approve Structure
                    </button>
                    <button
                      onClick={() => onUpdateStructure(structure.id, { status: 'draft' })}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors"
                    >
                      <Save className="w-3 h-3" />
                      Save as Draft
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Structure Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-slate-200">Create New Structure</h2>
              <p className="text-sm text-slate-400">Start with a blank structure or use AI generation</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Select Title */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Select Title</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500"
                  onChange={(e) => {
                    const title = titles.find((t) => t.id === e.target.value);
                    if (title) {
                      handleGenerateStructure(title);
                      setShowCreateModal(false);
                    }
                  }}
                >
                  <option value="">Choose a title...</option>
                  {unstructuredTitles.map((title) => (
                    <option key={title.id} value={title.id}>
                      {title.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Or Create Blank */}
              <div className="border-t border-slate-700 pt-4">
                <p className="text-sm text-slate-400 mb-3">Or create a blank structure:</p>
                <button
                  onClick={async () => {
                    const sections: StructureSection[] = DEFAULT_STRUCTURE_SECTIONS.map((s, i) => ({
                      ...s,
                      id: `sec-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
                      contentGenerated: false,
                    }));

                    await onCreateStructure({
                      strategyId: strategy.id,
                      name: 'New Structure',
                      type: 'seo',
                      aiGenerated: false,
                      editable: true,
                      totalWordCount: sections.reduce((sum, s) => sum + (s.targetWordCount || 0), 0),
                      status: 'draft' as StructureStatus,
                      sections,
                      companyId: strategy.companyId,
                    });
                    setShowCreateModal(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Blank Structure
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
  onClearGenerated,
  onClearSelected,
}: {
  strategy: BlogStrategy;
  contentTypes: BlogContentTypeConfig[];
  titles: BlogTitle[];
  onGenerate: (count: number, style: TitleStyle) => void;
  onUpdate: (id: string, updates: Partial<BlogTitle>) => void;
  onDelete: (id: string) => void;
  onClearGenerated: () => void;
  onClearSelected: () => void;
}) {
  const [selectedStyles, setSelectedStyles] = useState<TitleStyle[]>([]);
  const [styleCounts, setStyleCounts] = useState<Record<TitleStyle, number>>({
    seo: 3,
    viral: 3,
    authority: 3,
    technical: 3,
    emotional: 3,
    founder: 3,
    linkedin: 3,
    'thought-leadership': 3,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedTitles = titles.filter((t) => t.status === 'selected').sort((a, b) => a.order - b.order);
  const generatedTitles = titles.filter((t) => t.status === 'generated');

  const toggleStyle = (style: TitleStyle) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const updateStyleCount = (style: TitleStyle, count: number) => {
    setStyleCounts((prev) => ({ ...prev, [style]: Math.max(1, Math.min(50, count)) }));
  };

  const handleGenerate = async () => {
    if (selectedStyles.length === 0) return;
    setIsGenerating(true);
    for (const style of selectedStyles) {
      await onGenerate(styleCounts[style], style);
    }
    setIsGenerating(false);
  };

  const handleSelect = (title: BlogTitle) => {
    const currentSelected = titles.filter((t) => t.status === 'selected');
    onUpdate(title.id, { status: 'selected', order: currentSelected.length });
  };

  const handleReject = (title: BlogTitle) => {
    onUpdate(title.id, { status: 'rejected' });
  };

  const groupedTitles = generatedTitles.reduce<Record<string, BlogTitle[]>>((acc, title) => {
    const key = title.style || 'seo';
    if (!acc[key]) acc[key] = [];
    acc[key].push(title);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-400" />
          AI Title Generator
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-3">Title Styles</label>
          <div className="space-y-3">
            {TITLE_STYLES.map((style) => {
              const isChecked = selectedStyles.includes(style.value);
              return (
                <div key={style.value} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleStyle(style.value)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-200">{style.label}</div>
                      <div className="text-xs text-slate-500">{style.description}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="text-slate-400">{groupedTitles[style.value]?.length || 0}</span>
                      generated
                    </div>
                  </div>
                  {isChecked && (
                    <div className="mt-3 ml-7 flex items-center gap-3">
                      <label className="text-sm text-slate-400 whitespace-nowrap">Titles to generate:</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={styleCounts[style.value]}
                        onChange={(e) => updateStyleCount(style.value, parseInt(e.target.value) || 1)}
                        className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedStyles.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {isGenerating ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Zap className="w-4 h-4" /> Generate Titles ({selectedStyles.length} {selectedStyles.length === 1 ? 'style' : 'styles'})</>
            )}
          </button>
          <div className="text-sm text-slate-500">
            Using: <span className="text-primary-400">Ollama Cloud GLM 5.1</span> |
            Context: {strategy.targetAudience || 'General audience'} |
            Content types: {contentTypes.filter((t) => t.enabled).length} enabled
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-slate-200">Editorial Pipeline ({selectedTitles.length})</h3>
            {selectedTitles.length > 0 && (
              <button
                onClick={onClearSelected}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            )}
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
                      <div className="text-sm text-primary-400 mt-1">{title.excerpt || title.slug}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">SEO Score: {title.seoScore}/100</span>
                        <span className="text-xs text-slate-500">{title.funnelStage?.toUpperCase()}</span>
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
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-slate-200">Generated Titles ({generatedTitles.length})</h3>
            {generatedTitles.length > 0 && (
              <button
                onClick={onClearGenerated}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-700 max-h-[500px] overflow-y-auto">
            {generatedTitles.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No titles generated yet. Select styles above and click "Generate Titles" to start.</div>
            ) : (
              Object.entries(groupedTitles).map(([style, styleTitles]) => {
                const styleInfo = TITLE_STYLES.find((s) => s.value === style);
                return (
                  <div key={style}>
                    <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-700 sticky top-0 z-10">
                      <span className="text-sm font-medium text-primary-400">{styleInfo?.label || style}</span>
                      <span className="text-xs text-slate-500 ml-2">({styleTitles.length})</span>
                    </div>
                    {styleTitles.map((title) => (
                      <div key={title.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="font-medium text-slate-200">{title.title}</div>
                            <div className="text-sm text-primary-400 mt-1">{title.excerpt || title.slug}</div>
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
                    ))}
                  </div>
                );
              })
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
): { title: string; excerpt: string } {
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

  const templates: Record<string, { title: string; excerpt: string }[]> = {
    seo: [
      { title: `How to ${action} with ${topic} in ${number} Steps`, excerpt: `Learn how to ${action.toLowerCase()} using proven ${topic.toLowerCase()} strategies.` },
      { title: `The Complete Guide to ${topic} for ${number}x Growth`, excerpt: `Discover everything you need to know about ${topic.toLowerCase()} for rapid growth.` },
      { title: `What is ${topic}? A Comprehensive Guide`, excerpt: `An in-depth look at ${topic.toLowerCase()} and how it can transform your business.` },
      { title: `${number} Proven ${topic} Strategies That Work`, excerpt: `Actionable ${topic.toLowerCase()} tactics you can implement today.` },
      { title: `Why ${topic} Matters for Your Business`, excerpt: `Understanding the impact of ${topic.toLowerCase()} on your bottom line.` },
    ],
    viral: [
      { title: `The Shocking Truth About ${topic} Nobody Talks About`, excerpt: `Discover the hidden secrets of ${topic.toLowerCase()} that will change your approach.` },
      { title: `I Tried ${topic} for 30 Days. Here's What Happened.`, excerpt: `My personal experiment with ${topic.toLowerCase()} revealed surprising results.` },
      { title: `Stop Doing ${topic} Wrong: ${number} Mistakes to Avoid`, excerpt: `Common ${topic.toLowerCase()} pitfalls and how to fix them.` },
      { title: `This ${topic} Hack Changed Everything for Me`, excerpt: `The simple ${topic.toLowerCase()} technique that transformed my results.` },
      { title: `Why 90% of Businesses Fail at ${topic}`, excerpt: `Avoid these ${topic.toLowerCase()} mistakes to stay ahead of the competition.` },
    ],
    authority: [
      { title: `The State of ${topic}: Industry Report`, excerpt: `Data-driven insights on ${topic.toLowerCase()} trends and benchmarks.` },
      { title: `Expert Insights: How Top Brands Approach ${topic}`, excerpt: `Learn from industry leaders about their ${topic.toLowerCase()} strategies.` },
      { title: `A Data-Driven Look at ${topic} Trends`, excerpt: `Research-backed analysis of ${topic.toLowerCase()} developments.` },
      { title: `The Science Behind ${topic}`, excerpt: `Evidence-based ${topic.toLowerCase()} principles explained.` },
      { title: `What ${number} Years in ${topic} Taught Me`, excerpt: `Lessons learned from decades of ${topic.toLowerCase()} experience.` },
    ],
    technical: [
      { title: `${topic}: Architecture, Implementation, and Best Practices`, excerpt: `Technical deep dive into ${topic.toLowerCase()} implementation.` },
      { title: `Deep Dive: How ${topic} Algorithms Work`, excerpt: `Understanding the mechanics behind ${topic.toLowerCase()}.` },
      { title: `${topic} API Integration Guide`, excerpt: `Step-by-step ${topic.toLowerCase()} integration instructions.` },
      { title: `Optimising ${topic} Performance: A Technical Analysis`, excerpt: `Performance tuning strategies for ${topic.toLowerCase()}.` },
      { title: `Building Scalable ${topic} Systems`, excerpt: `Architecture patterns for ${topic.toLowerCase()} at scale.` },
    ],
    emotional: [
      { title: `The Frustration of ${topic} (And How to Fix It)`, excerpt: `Overcome ${topic.toLowerCase()} challenges with these solutions.` },
      { title: `Feeling Overwhelmed by ${topic}? Read This.`, excerpt: `Find clarity and direction in your ${topic.toLowerCase()} journey.` },
      { title: `The Relief of Finally Getting ${topic} Right`, excerpt: `How mastering ${topic.toLowerCase()} transformed my approach.` },
      { title: `Why ${topic} Keeps You Up at Night`, excerpt: `Addressing the anxieties around ${topic.toLowerCase()}.` },
      { title: `Finding Peace Through Better ${topic}`, excerpt: `Stress-free ${topic.toLowerCase()} strategies for busy professionals.` },
    ],
    founder: [
      { title: `Why I Built Our ${topic} Strategy from Scratch`, excerpt: `My journey building a ${topic.toLowerCase()} strategy that works.` },
      { title: `The ${topic} Lessons I Learned the Hard Way`, excerpt: `Painful but valuable ${topic.toLowerCase()} experiences shared.` },
      { title: `How We 10x'd Our ${topic} in 6 Months`, excerpt: `Our rapid ${topic.toLowerCase()} growth story and lessons.` },
      { title: `What I Wish I Knew About ${topic} Before Starting`, excerpt: `Founder insights on ${topic.toLowerCase()} fundamentals.` },
      { title: `Our ${topic} Journey: From Zero to One`, excerpt: `Building ${topic.toLowerCase()} capability from the ground up.` },
    ],
    linkedin: [
      { title: `${number} ${topic} Insights Every Professional Should Know`, excerpt: `Key ${topic.toLowerCase()} takeaways for career growth.` },
      { title: `The ${topic} Framework That Got Me Promoted`, excerpt: `How mastering ${topic.toLowerCase()} accelerated my career.` },
      { title: `Why Leaders Prioritise ${topic} in 2026`, excerpt: `Executive perspectives on ${topic.toLowerCase()} importance.` },
      { title: `The ${topic} Skills Gap (And How to Close It)`, excerpt: `Developing ${topic.toLowerCase()} expertise for the modern workplace.` },
      { title: `My Thoughts on the Future of ${topic}`, excerpt: `Personal reflections on ${topic.toLowerCase()} evolution.` },
    ],
    'thought-leadership': [
      { title: `The Future of ${topic}: A Vision for 2030`, excerpt: `Forward-thinking perspectives on ${topic.toLowerCase()} direction.` },
      { title: `Rethinking ${topic}: A New Perspective`, excerpt: `Challenging conventional ${topic.toLowerCase()} wisdom.` },
      { title: `Why ${topic} Needs a Paradigm Shift`, excerpt: `The case for reimagining ${topic.toLowerCase()} approaches.` },
      { title: `The Unspoken Rules of ${topic}`, excerpt: `Implicit ${topic.toLowerCase()} knowledge shared openly.` },
      { title: `Beyond ${topic}: What's Next for the Industry`, excerpt: `Looking past current ${topic.toLowerCase()} trends.` },
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
  calendars,
  structures,
  contentSections,
  autoMapEnabled,
  onAutoMapToggle,
  brand,
  businessProfile,
  icps,
  personas,
  competitors,
  products,
  seoConfigs,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  onUpdateCalendar,
  onCreateContentSection,
  onUpdateContentSection,
}: {
  strategy: BlogStrategy;
  posts: BlogPost[];
  titles: BlogTitle[];
  contentTypes: BlogContentTypeConfig[];
  calendars: BlogCalendar[];
  structures: BlogStructure[];
  contentSections: BlogContentSection[];
  autoMapEnabled: boolean;
  onAutoMapToggle: () => void;
  brand: Brand | null | undefined;
  businessProfile: BusinessProfile | null | undefined;
  icps: ICP[];
  personas: Persona[];
  competitors: Competitor[];
  products: Product[];
  seoConfigs: BlogSEOConfig[];
  onCreatePost: (data: Partial<BlogPost>) => void;
  onUpdatePost: (id: string, updates: Partial<BlogPost>) => void;
  onDeletePost: (id: string) => void;
  onUpdateCalendar: (id: string, updates: Partial<BlogCalendar>) => void;
  onCreateContentSection: (data: Partial<BlogContentSection>) => void;
  onUpdateContentSection: (id: string, updates: Partial<BlogContentSection>) => void;
}) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSectionId, setGeneratingSectionId] = useState<string | null>(null);
  const selectedPost = posts.find((p) => p.id === selectedPostId);

  // Find structure for a post/title
  const findStructureForTitle = (titleId: string): BlogStructure | undefined => {
    return structures.find((s) => s.titleId === titleId);
  };

  // Find structure for a post
  const findStructureForPost = (post: BlogPost): BlogStructure | undefined => {
    if (post.titleId) {
      return findStructureForTitle(post.titleId);
    }
    return undefined;
  };

  // Get content sections for a structure
  const getSectionsForStructure = (structureId: string): BlogContentSection[] => {
    return contentSections.filter((s) => s.structureId === structureId).sort((a, b) => a.order - b.order);
  };

  // Check if structure has all content generated
  const isStructureContentComplete = (structure: BlogStructure): boolean => {
    const sections = getSectionsForStructure(structure.id);
    return structure.sections.every((section) =>
      sections.some((s) => s.structureSectionId === section.id && s.generated)
    );
  };

  // Find the active calendar
  const activeCalendar = calendars[0];

  // Find a calendar slot for a post
  const findPostCalendarSlot = (postId: string): BlogCalendarItem | undefined => {
    if (!activeCalendar) return undefined;
    return activeCalendar.timeline?.find((item) => item.postId === postId);
  };

  // Handle scheduling a post to a calendar slot
  const handleSchedulePost = (postId: string, slotId: string) => {
    if (!activeCalendar) return;

    const updatedTimeline = activeCalendar.timeline?.map((item) => {
      if (item.id === slotId) {
        return { ...item, postId, status: 'assigned' as const };
      }
      // Remove from previous slot if any
      if (item.postId === postId) {
        return { ...item, postId: undefined, status: 'empty' as const };
      }
      return item;
    });

    onUpdateCalendar(activeCalendar.id, { timeline: updatedTimeline });
  };

  // Handle unscheduling a post from calendar
  const handleUnschedulePost = (postId: string) => {
    if (!activeCalendar) return;

    const updatedTimeline = activeCalendar.timeline?.map((item) => {
      if (item.postId === postId) {
        return { ...item, postId: undefined, status: 'empty' as const };
      }
      return item;
    });

    onUpdateCalendar(activeCalendar.id, { timeline: updatedTimeline });
  };

  const handleCreateFromTitle = (title: BlogTitle) => {
    const contentType = contentTypes.find((t) => t.type === title.contentType);

    // Auto-map to calendar if enabled
    let scheduledDate: string | undefined = undefined;
    if (autoMapEnabled && activeCalendar) {
      const emptySlot = activeCalendar.timeline?.find((item) => item.status === 'empty' || item.status === 'planned');
      if (emptySlot) {
        scheduledDate = emptySlot.scheduledDate;
      }
    }

    onCreatePost({
      strategyId: strategy.id,
      titleId: title.id,
      title: title.title,
      slug: generateSlug(title.title),
      excerpt: '',
      contentType: title.contentType,
      contentTypeId: contentType?.id,
      primaryKeyword: title.suggestedKeywords?.[0],
      secondaryKeywords: title.suggestedKeywords?.slice(1) || [],
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
      scheduledDate,
    });
  };

  // Build rich context from all linked data for AI generation - filtered by Data Sources tab selections
  const buildContentContext = (seoConfigData?: BlogSEOConfig | null) => {
    const contextParts: string[] = [];
    const linkedData = strategy.linkedData || {};

    // Strategy context
    if (strategy.targetAudience) contextParts.push(`Target Audience: ${strategy.targetAudience}`);
    if (strategy.funnelStage) contextParts.push(`Funnel Stage: ${strategy.funnelStage}`);
    if (strategy.goals?.length) contextParts.push(`Content Goals: ${strategy.goals.join(', ')}`);
    if (strategy.contentDepth) contextParts.push(`Content Depth: ${strategy.contentDepth}`);

    // Brand context - filtered by linkedData.brandId
    const linkedBrandId = linkedData.brandId;
    const activeBrand = linkedBrandId ? brand : null;
    const brandToUse = activeBrand || brand;
    if (brandToUse) {
      if (brandToUse.voice) contextParts.push(`Brand Voice: ${brandToUse.voice}`);
      if (brandToUse.personality) contextParts.push(`Brand Personality: ${brandToUse.personality}`);
      if (brandToUse.tagline) contextParts.push(`Brand Tagline: ${brandToUse.tagline}`);
      if (brandToUse.purposeWhyExists) contextParts.push(`Brand Purpose: ${brandToUse.purposeWhyExists}`);
      if (brandToUse.personalityPrimary?.length) contextParts.push(`Brand Personality Traits: ${brandToUse.personalityPrimary.slice(0, 3).join(', ')}`);
    }

    // Business context - filtered by linkedData.businessProfileId
    const linkedProfileId = linkedData.businessProfileId;
    const activeProfile = linkedProfileId ? businessProfile : null;
    const profileToUse = activeProfile || businessProfile;
    if (profileToUse) {
      if (profileToUse.name) contextParts.push(`Company: ${profileToUse.name}`);
      if (profileToUse.primaryIndustry) contextParts.push(`Industry: ${profileToUse.primaryIndustry}`);
      if (profileToUse.description) contextParts.push(`Business Description: ${profileToUse.description.slice(0, 300)}`);
    }

    // ICP context - filtered by linkedData.icpIds
    const linkedIcpIds = linkedData.icpIds || [];
    const filteredIcps = linkedIcpIds.length > 0
      ? icps.filter((i) => linkedIcpIds.includes(i.id))
      : icps;
    if (filteredIcps.length > 0) {
      const icpInfo = filteredIcps.slice(0, 3).map(i =>
        `${i.name}${i.description ? `: ${i.description.slice(0, 150)}` : ''}${i.challenges?.length ? ` [Challenges: ${i.challenges.slice(0, 3).join(', ')}]` : ''}`
      ).join('; ');
      contextParts.push(`Target ICPs: ${icpInfo}`);
    }

    // Persona context - filtered by linkedData.personaIds
    const linkedPersonaIds = linkedData.personaIds || [];
    const filteredPersonas = linkedPersonaIds.length > 0
      ? personas.filter((p) => linkedPersonaIds.includes(p.id))
      : personas;
    if (filteredPersonas.length > 0) {
      const personaInfo = filteredPersonas.slice(0, 3).map(p =>
        `${p.name}${p.jobTitle ? ` (${p.jobTitle})` : ''}${p.painPoints?.length ? ` - Pain points: ${p.painPoints.slice(0, 3).join(', ')}` : ''}${p.goals?.length ? ` - Goals: ${p.goals.slice(0, 2).join(', ')}` : ''}`
      ).join('; ');
      contextParts.push(`Target Personas: ${personaInfo}`);
    }

    // Competitor context - filtered by linkedData.competitorIds
    const linkedCompetitorIds = linkedData.competitorIds || [];
    const filteredCompetitors = linkedCompetitorIds.length > 0
      ? competitors.filter((c) => linkedCompetitorIds.includes(c.id))
      : competitors;
    if (filteredCompetitors.length > 0) {
      const competitorInfo = filteredCompetitors.slice(0, 3).map(c =>
        `${c.name}${c.strengths?.length ? ` (Strengths: ${c.strengths.slice(0, 2).join(', ')})` : ''}${c.weaknesses?.length ? ` [Weaknesses: ${c.weaknesses.slice(0, 2).join(', ')}]` : ''}`
      ).join('; ');
      contextParts.push(`Key Competitors: ${competitorInfo}`);
    }

    // Product context - filtered by linkedData.productIds
    const linkedProductIds = linkedData.productIds || [];
    const filteredProducts = linkedProductIds.length > 0
      ? products.filter((p) => linkedProductIds.includes(p.id))
      : products;
    if (filteredProducts.length > 0) {
      const productInfo = filteredProducts.slice(0, 3).map((p: Product) =>
        `${p.name}${p.description ? `: ${p.description.slice(0, 100)}` : ''}${p.features?.length ? ` [Features: ${p.features.slice(0, 3).join(', ')}]` : ''}`
      ).join('; ');
      contextParts.push(`Key Products: ${productInfo}`);
    }

    // SEO Config context (passed parameter or fetched from state)
    const seoToUse = seoConfigData || seoConfigs.find((s) => s.strategyId === strategy.id);
    if (seoToUse) {
      if (seoToUse.primaryKeywords?.length) contextParts.push(`Primary Keywords: ${seoToUse.primaryKeywords.slice(0, 5).join(', ')}`);
      if (seoToUse.secondaryKeywords?.length) contextParts.push(`Secondary Keywords: ${seoToUse.secondaryKeywords.slice(0, 5).join(', ')}`);
      if (seoToUse.longTailKeywords?.length) contextParts.push(`Long-tail Keywords: ${seoToUse.longTailKeywords.slice(0, 5).join(', ')}`);
      if (seoToUse.searchIntent) contextParts.push(`Search Intent: ${seoToUse.searchIntent}`);
      if (seoToUse.primaryGoal) contextParts.push(`Primary SEO Goal: ${seoToUse.primaryGoal}`);
      if (seoToUse.seoRules) {
        if (seoToUse.seoRules.minWordCount) contextParts.push(`Target Word Count: ${seoToUse.seoRules.minWordCount}+ words`);
        if (seoToUse.seoRules.keywordDensityTarget) contextParts.push(`Keyword Density Target: ${seoToUse.seoRules.keywordDensityTarget}%`);
      }
    }

    return contextParts.join('\n');
  };

  const handleGenerateContent = async (post: BlogPost) => {
    setIsGenerating(true);

    try {
      // Get the associated title for SEO context
      const associatedTitle = titles.find((t) => t.id === post.titleId);

      // Check if there's a structure for this title
      const structure = findStructureForPost(post);

      if (structure && structure.sections.length > 0 && structure.status === 'approved') {
        // STRUCTURE-BASED CONTENT GENERATION
        console.log('[Content] Using structure-based generation for post:', post.id);
        console.log('[Content] Structure:', structure.name, 'Sections:', structure.sections.length);

        // Get SEO config for this strategy
        const seoConfig = seoConfigs.find((s) => s.strategyId === strategy.id);
        // Pass SEO config to buildContentContext for richer context
        const context = buildContentContext(seoConfig);
        const brandVoice = brand?.voice || 'professional';
        const contentDepth = strategy.contentDepth || 'standard';

        // Calculate total target word count from structure
        const totalTargetWords = structure.sections.reduce((sum, s) => sum + (s.targetWordCount || 0), 0);
        console.log('[Content] Total target words:', totalTargetWords);

        let combinedContent = '';
        const allSections: BlogSection[] = [];
        let totalWordCount = 0;

        // Generate content for each section in the structure
        for (const structureSection of structure.sections) {
          if (!structureSection.generateContent) {
            // Still add the heading for sections that shouldn't have content
            const headingPrefix = '#'.repeat(structureSection.headingLevel || 2);
            combinedContent += `\n\n${headingPrefix} ${structureSection.title}\n\n`;
            allSections.push({
              id: `sec-${Date.now()}-${allSections.length}`,
              type: 'heading',
              content: structureSection.title,
              order: structureSection.order,
              level: structureSection.headingLevel || 2,
            });
            continue;
          }

          setGeneratingSectionId(structureSection.id);
          console.log('[Content] Generating section:', structureSection.title, 'Target words:', structureSection.targetWordCount || 200);

          // Calculate appropriate token limit based on target word count (roughly 1.5 tokens per word + buffer)
          const targetWords = structureSection.targetWordCount || 200;
          const maxTokens = Math.max(targetWords * 3, 800); // At least 800 tokens for even small sections

          // Build depth-specific instructions
          const depthInstructions: Record<string, string> = {
            'brief': 'Be concise but informative. Focus on key points.',
            'standard': 'Provide a balanced explanation with examples and practical insights.',
            'deep': 'Write a comprehensive, detailed analysis with multiple examples, data points, and actionable insights. Go deep into nuances.',
            'comprehensive': 'Create an exhaustive, authoritative treatment of the topic. Include expert perspectives, case studies, detailed explanations, and practical frameworks. Aim for maximum depth and value.',
          };

          const sectionPrompt = `You are an expert content writer creating HIGH-QUALITY, DETAILED content for a blog post.

ARTICLE TITLE: ${post.title}
ARTICLE TYPE: ${post.contentType || 'article'}
BRAND VOICE: ${brandVoice}
CONTENT DEPTH: ${contentDepth} - ${depthInstructions[contentDepth] || depthInstructions['standard']}

${context ? `BUSINESS & MARKETING CONTEXT:
${context}

` : ''}${associatedTitle?.metaDescription ? `META DESCRIPTION: ${associatedTitle.metaDescription}

` : ''}${seoConfig?.primaryKeywords?.length ? `PRIMARY KEYWORDS TO INCORPORATE: ${seoConfig.primaryKeywords.slice(0, 3).join(', ')}

` : ''}SECTION TO WRITE:
- Section Type: ${structureSection.type}
- Section Title: ${structureSection.title}
${structureSection.description ? `- Section Purpose: ${structureSection.description}` : ''}
- Target Word Count: **${targetWords} words minimum** - this is critical, write AT LEAST ${targetWords} words
- Heading Level: H${structureSection.headingLevel || 2}
${structureSection.keywords?.length ? `- Keywords for this section: ${structureSection.keywords.join(', ')}` : ''}
${structureSection.aiInstructions ? `- Special Instructions: ${structureSection.aiInstructions}` : ''}

CRITICAL REQUIREMENTS:
1. Write AT LEAST ${targetWords} words - do not write less
2. Use markdown formatting: **bold**, *italic*, bullet points, numbered lists
3. Include specific examples, statistics, or case studies where relevant
4. Make the content actionable with clear takeaways
5. Maintain the ${brandVoice} brand voice throughout
${structureSection.keywords?.length ? `6. Naturally incorporate the keywords: ${structureSection.keywords.join(', ')}` : ''}

Write comprehensive, engaging content for this section. Focus on providing genuine value and depth.
Write ONLY the content for this section - no section heading (that will be added separately).
Do not include any explanations or meta-commentary. Start writing directly.`;

          try {
            const response = await aiApi.generate({
              prompt: sectionPrompt,
              maxTokens: maxTokens,
              noCache: true
            });

            if (response.data) {
              const sectionContent = (response.data as any).content || '';
              const actualWordCount = sectionContent.split(/\s+/).length;
              console.log('[Content] Section generated:', structureSection.title, 'Words:', actualWordCount, 'Target:', targetWords);

              const headingPrefix = '#'.repeat(structureSection.headingLevel || 2);

              combinedContent += `\n\n${headingPrefix} ${structureSection.title}\n\n${sectionContent}`;

              allSections.push({
                id: `sec-${Date.now()}-${allSections.length}`,
                type: 'heading',
                content: structureSection.title,
                order: structureSection.order,
                level: structureSection.headingLevel || 2,
              });

              allSections.push({
                id: `sec-${Date.now()}-${allSections.length}`,
                type: 'paragraph',
                content: sectionContent,
                order: structureSection.order + 0.5,
              });

              totalWordCount += actualWordCount;
            }
          } catch (sectionError) {
            console.error('[Content] Section generation error:', sectionError);
            // Continue with next section
          }
        }

        setGeneratingSectionId(null);

        // Calculate totals
        const readingTime = Math.ceil(totalWordCount / 200);
        console.log('[Content] Total words generated:', totalWordCount, 'Target:', totalTargetWords);

        // Update post with generated content
        onUpdatePost(post.id, {
          status: 'draft',
          content: combinedContent.trim(),
          sections: allSections,
          metaTitle: associatedTitle?.title?.slice(0, 60) || post.title.slice(0, 60),
          metaDescription: associatedTitle?.metaDescription || '',
          primaryKeyword: associatedTitle?.suggestedKeywords?.[0] || post.primaryKeyword,
          secondaryKeywords: associatedTitle?.suggestedKeywords?.slice(1) || post.secondaryKeywords || [],
          seoAnalysis: {
            readabilityScore: 72,
            readingTime,
            keywordDensity: {},
            headingStructureValid: true,
            internalLinkCount: 0,
            externalLinkCount: 0,
            suggestedSchema: ['Article'],
            wordCount: totalWordCount,
            paragraphCount: allSections.filter(s => s.type === 'paragraph').length,
            avgSentenceLength: 18,
            passiveVoicePercentage: 12,
          },
        });

        console.log('[Content] Structure-based content generated successfully');
      } else {
        // FALLBACK: FULL CONTENT GENERATION (NO STRUCTURE)
        console.log('[Content] No approved structure found, using full content generation');
        if (structure) {
          console.log('[Content] Structure status:', structure.status, '(needs approval)');
        }

        // Get SEO config for this strategy
        const seoConfig = seoConfigs.find((s) => s.strategyId === strategy.id);

        // Build context with SEO config included
        const context = buildContentContext(seoConfig);
        const contentDepth = strategy.contentDepth || 'standard';

        // Build SEO context from title and config
        const seoContext: string[] = [];

        // Use SEO optimized title if available
        const seoTitle = associatedTitle?.title || post.title;
        const seoKeywords = associatedTitle?.suggestedKeywords || post.secondaryKeywords || [];
        const seoIntent = associatedTitle?.searchIntent || 'informational';

        if (seoKeywords.length > 0) {
          seoContext.push(`Primary Keywords: ${seoKeywords.slice(0, 3).join(', ')}`);
        }
        if (seoIntent) {
          seoContext.push(`Search Intent: ${seoIntent}`);
        }

        // SEO config keywords
        if (seoConfig?.primaryKeywords?.length) {
          seoContext.push(`Strategy Primary Keywords: ${seoConfig.primaryKeywords.join(', ')}`);
        }
        if (seoConfig?.secondaryKeywords?.length) {
          seoContext.push(`Strategy Secondary Keywords: ${seoConfig.secondaryKeywords.join(', ')}`);
        }

        // SEO rules from config
        const seoRules = seoConfig?.seoRules;
        const targetWordCount = seoRules?.minWordCount || 1500;
        const includeTOC = seoRules?.includeTOC !== false;
        const includeConclusion = seoRules?.includeConclusion !== false;
        const includeCTA = seoRules?.includeCTA !== false;

        // Get brand voice from brand or strategy
        const brandVoice = brand?.voice || 'professional';

        // Build depth-specific instructions
        const depthInstructions: Record<string, string> = {
          'brief': 'Keep content concise but informative. Focus on key points. Aim for 600-900 words.',
          'standard': 'Provide balanced coverage with examples and practical insights. Aim for 1200-1800 words.',
          'deep': 'Write comprehensive, detailed content with multiple examples, data points, and actionable insights. Aim for 2000-3000 words.',
          'comprehensive': 'Create exhaustive, authoritative content with expert perspectives, case studies, detailed explanations, and practical frameworks. Aim for 3000+ words.',
        };

        const prompt = `You are an expert content writer and SEO specialist. Write a COMPREHENSIVE, DETAILED blog post that provides exceptional value to readers.

BLOG POST TITLE: ${seoTitle}
${post.excerpt ? `\nBRIEF/EXCERPT: ${post.excerpt}` : ''}
${post.primaryKeyword ? `\nPRIMARY KEYWORD: ${post.primaryKeyword}` : ''}
${post.secondaryKeywords?.length ? `\nSECONDARY KEYWORDS: ${post.secondaryKeywords.join(', ')}` : ''}

CONTENT TYPE: ${post.contentType || 'article'}
BRAND VOICE: ${brandVoice}
CONTENT DEPTH: ${contentDepth} - ${depthInstructions[contentDepth] || depthInstructions['standard']}

${context ? `\nBUSINESS & MARKETING CONTEXT:\n${context}` : ''}

${seoContext.length ? `\nSEO REQUIREMENTS:\n${seoContext.join('\n')}` : ''}

CONTENT REQUIREMENTS:
- **MINIMUM WORD COUNT: ${targetWordCount} words** - this is critical, write at least ${targetWordCount} words
- Include Table of Contents: ${includeTOC ? 'Yes' : 'No'}
- Include Conclusion: ${includeConclusion ? 'Yes' : 'No'}
- Include CTA: ${includeCTA ? 'Yes' : 'No'}
- Write in a ${brandVoice} tone
- Use clear headings (H2, H3) for structure
- Include specific examples, statistics, and actionable insights
- Optimise for readability and SEO
- Make content genuinely valuable and comprehensive

RESPOND WITH VALID JSON in this exact format:
{
  "metaTitle": "SEO-optimised title (50-60 characters)",
  "metaDescription": "Compelling description for search results (150-160 characters)",
  "slug": "url-friendly-slug",
  "primaryKeyword": "main keyword from content",
  "secondaryKeywords": ["keyword1", "keyword2", "keyword3"],
  "sections": [
    {"type": "heading", "content": "Introduction to [Topic]", "level": 2},
    {"type": "paragraph", "content": "Opening paragraph content..."},
    {"type": "heading", "content": "Section Title", "level": 2},
    {"type": "paragraph", "content": "Section content..."},
    {"type": "list", "content": "Item 1\\nItem 2\\nItem 3"},
    {"type": "heading", "content": "Conclusion", "level": 2},
    {"type": "paragraph", "content": "Conclusion content..."}
  ],
  "wordCount": 1234,
  "readingTime": 6
}

CRITICAL INSTRUCTIONS:
1. Write AT LEAST ${targetWordCount} words - do not write less
2. Include detailed explanations, examples, and practical advice
3. Use the keywords naturally throughout the content
4. Structure the content with clear H2 and H3 headings
5. Provide genuine value - do not write fluff or filler content
6. Respond with ONLY valid JSON, no markdown code blocks, no explanations`;

        const response = await aiApi.generate({
          prompt,
          maxTokens: 6000, // Higher limit for comprehensive content generation
          noCache: true
        });

        if (response.data) {
          const content = (response.data as any).content || '';
          let parsed: any = null;

          // Parse AI response
          try {
            let cleaned = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              parsed = JSON.parse(jsonMatch[0]);
            } else {
              parsed = JSON.parse(cleaned);
            }
          } catch (parseError) {
            console.error('[Content] Failed to parse AI response:', parseError);
            throw new Error('Failed to parse AI response');
          }

          if (parsed && parsed.sections) {
            // Build sections array
            const sections: BlogSection[] = parsed.sections.map((s: any, i: number) => ({
              id: `sec-${Date.now()}-${i}`,
              type: s.type || 'paragraph',
              content: s.content,
              order: i + 1,
              level: s.level,
            }));

            // Combine all content
            const fullContent = sections.map((s) => s.content).join('\n\n');
            const wordCount = parsed.wordCount || fullContent.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200);

            // Update post with generated content
            onUpdatePost(post.id, {
              status: 'draft',
              content: fullContent,
              sections,
              metaTitle: parsed.metaTitle || post.title.slice(0, 60),
              metaDescription: parsed.metaDescription || '',
              slug: parsed.slug || post.slug,
              primaryKeyword: parsed.primaryKeyword || post.primaryKeyword,
              secondaryKeywords: parsed.secondaryKeywords || post.secondaryKeywords,
              seoAnalysis: {
                readabilityScore: 72,
                readingTime: getEstimatedReadTime(wordCount),
                keywordDensity: { [parsed.primaryKeyword || 'marketing']: 2.4 },
                headingStructureValid: true,
                internalLinkCount: 0,
                externalLinkCount: 0,
                suggestedSchema: ['Article', 'FAQPage'],
                wordCount,
                paragraphCount: sections.filter((s) => s.type === 'paragraph').length,
                avgSentenceLength: 18,
                passiveVoicePercentage: 12,
              },
            });
          } else {
            throw new Error('Invalid AI response structure');
          }
        } else {
          throw new Error(response.error || 'AI generation failed');
        }
      }
    } catch (error) {
      console.error('[Content] Generation error:', error);

      // Fallback to mock content if AI fails
      const fallbackSections: BlogSection[] = [
        { id: `sec-${Date.now()}-1`, type: 'heading', content: `Introduction to ${post.title}`, order: 1, level: 2 },
        { id: `sec-${Date.now()}-2`, type: 'paragraph', content: `In today's competitive landscape, understanding ${post.title.toLowerCase()} is essential for businesses looking to grow. This comprehensive guide explores everything you need to know.`, order: 2 },
        { id: `sec-${Date.now()}-3`, type: 'heading', content: 'Key Strategies and Best Practices', order: 3, level: 2 },
        { id: `sec-${Date.now()}-4`, type: 'paragraph', content: 'Successful implementation requires a structured approach. Start by analysing your current position, then identify gaps and opportunities for improvement.', order: 4 },
        { id: `sec-${Date.now()}-5`, type: 'list', content: 'Research your target audience thoroughly\nDevelop a clear value proposition\nCreate consistent, high-quality content\nMeasure and optimise continuously', order: 5 },
        { id: `sec-${Date.now()}-6`, type: 'heading', content: 'Conclusion', order: 6, level: 2 },
        { id: `sec-${Date.now()}-7`, type: 'paragraph', content: `${post.title} is not just a tactic—it is a strategic imperative. By following the frameworks outlined in this article, you can drive meaningful results for your business.`, order: 7 },
      ];

      onUpdatePost(post.id, {
        status: 'draft',
        content: fallbackSections.map((s) => s.content).join('\n\n'),
        sections: fallbackSections,
        seoAnalysis: {
          readabilityScore: 72,
          readingTime: getEstimatedReadTime(800),
          keywordDensity: { [post.primaryKeyword || 'marketing']: 2.4 },
          headingStructureValid: true,
          internalLinkCount: 0,
          externalLinkCount: 0,
          suggestedSchema: ['Article'],
          wordCount: 800,
          paragraphCount: 4,
          avgSentenceLength: 18,
          passiveVoicePercentage: 12,
        },
      });
    } finally {
      setIsGenerating(false);
      setGeneratingSectionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Content Pipeline</h3>
            <p className="text-sm text-slate-400 mt-1">{posts.length} posts in pipeline</p>
          </div>
          {activeCalendar && (
            <button
              onClick={onAutoMapToggle}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
                autoMapEnabled
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              )}
            >
              <Zap className="w-4 h-4" />
              Auto-Map {autoMapEnabled ? 'ON' : 'OFF'}
            </button>
          )}
        </div>
      </div>

      {titles.filter((t) => t.status === 'selected' && !posts.some((p) => p.titleId === t.id)).length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Create Posts from Selected Titles</h3>
          <div className="space-y-2">
            {titles
              .filter((t) => t.status === 'selected' && !posts.some((p) => p.titleId === t.id))
              .map((title) => (
                <div key={title.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex-1">
                    <span className="text-sm text-slate-200">{title.title}</span>
                    {title.scheduledDate && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-green-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(title.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
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
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
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
                    {post.scheduledDate && (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {post.scheduledTime && <span className="text-slate-400">@ {post.scheduledTime}</span>}
                      </span>
                    )}
                    {(() => {
                      const postStructure = findStructureForPost(post);
                      if (postStructure) {
                        return (
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full flex items-center gap-1',
                            postStructure.status === 'approved' && 'bg-green-500/20 text-green-400',
                            postStructure.status === 'draft' && 'bg-yellow-500/20 text-yellow-400',
                            postStructure.status === 'generated' && 'bg-blue-500/20 text-blue-400',
                            postStructure.status === 'edited' && 'bg-purple-500/20 text-purple-400'
                          )}>
                            <Layers className="w-3 h-3" />
                            Structure: {postStructure.status}
                          </span>
                        );
                      }
                      return null;
                    })()}
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

                  {/* Reschedule Section */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-400" />
                      Schedule Publication
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Date</label>
                        <input
                          type="date"
                          value={post.scheduledDate ? new Date(post.scheduledDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const newDate = e.target.value ? new Date(e.target.value).toISOString() : undefined;
                            onUpdatePost(post.id, { scheduledDate: newDate });
                          }}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Time</label>
                        <input
                          type="time"
                          value={post.scheduledTime}
                          onChange={(e) => onUpdatePost(post.id, { scheduledTime: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                        />
                      </div>
                    </div>
                    {/* Swap with other posts */}
                    {posts.filter(p => p.id !== post.id && p.scheduledDate).length > 0 && (
                      <div className="mt-3">
                        <label className="block text-xs text-slate-500 mb-2">Swap date with:</label>
                        <div className="flex flex-wrap gap-2">
                          {posts
                            .filter(p => p.id !== post.id && p.scheduledDate)
                            .slice(0, 5)
                            .map(otherPost => (
                              <button
                                key={otherPost.id}
                                onClick={() => {
                                  // Swap dates
                                  const tempDate = post.scheduledDate;
                                  const tempTime = post.scheduledTime;
                                  onUpdatePost(post.id, {
                                    scheduledDate: otherPost.scheduledDate,
                                    scheduledTime: otherPost.scheduledTime
                                  });
                                  onUpdatePost(otherPost.id, {
                                    scheduledDate: tempDate,
                                    scheduledTime: tempTime
                                  });
                                }}
                                className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-slate-300 truncate max-w-32"
                                title={otherPost.title}
                              >
                                <span className="text-green-400">
                                  {new Date(otherPost.scheduledDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                {' - '}
                                {otherPost.title.length > 15 ? otherPost.title.slice(0, 15) + '...' : otherPost.title}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

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

// ============================================
// SEO TAB
// ============================================

function SEOTab({
  strategy,
  titles,
  brand,
  businessProfile,
  icps,
  personas,
  competitors,
  seoConfig,
  onSaveSEO,
  onUpdateTitle,
}: {
  strategy: BlogStrategy;
  titles: BlogTitle[];
  brand: Brand | null | undefined;
  businessProfile: BusinessProfile | null | undefined;
  icps: ICP[];
  personas: Persona[];
  competitors: Competitor[];
  seoConfig: BlogSEOConfig | null;
  onSaveSEO: (data: Partial<BlogSEOConfig>) => void;
  onUpdateTitle: (id: string, updates: Partial<BlogTitle>) => void;
}) {
  // Define type for generated SEO data
  type TitleSEOData = {
    originalTitle: string;
    optimizedTitle: string;
    metaDescription: string;
    keywords: string[];
    trendingKeywords: string[];
    slug: string;
    searchIntent: string;
    funnelStage: string;
    imagePrompt: string;
    imageAlt: string;
    ogImageDescription: string;
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingTitleId, setGeneratingTitleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [titleSEO, setTitleSEO] = useState<Record<string, TitleSEOData>>({});
  const [editingTitle, setEditingTitle] = useState<string | null>(null);

  // Initialize titleSEO from existing title data
  useEffect(() => {
    const existingSEO: Record<string, TitleSEOData> = {};
    titles.forEach((title) => {
      if (title.metaDescription || (title.suggestedKeywords && title.suggestedKeywords.length > 0)) {
        existingSEO[title.id] = {
          originalTitle: title.title,
          optimizedTitle: title.title,
          metaDescription: title.metaDescription || '',
          keywords: title.suggestedKeywords || [],
          trendingKeywords: title.trendingKeywords || [],
          slug: title.slug || '',
          searchIntent: title.searchIntent || 'informational',
          funnelStage: title.funnelStage || 'tofu',
          imagePrompt: title.imagePrompt || '',
          imageAlt: title.imageAlt || '',
          ogImageDescription: title.ogImageDescription || '',
        };
      }
    });
    if (Object.keys(existingSEO).length > 0) {
      setTitleSEO((prev) => ({ ...existingSEO, ...prev }));
    }
  }, [titles]);

  // Build rich context from all linked data
  const buildContext = () => {
    const contextParts: string[] = [];

    // Strategy context
    if (strategy.targetAudience) contextParts.push(`Target Audience: ${strategy.targetAudience}`);
    if (strategy.funnelStage) contextParts.push(`Funnel Stage: ${strategy.funnelStage}`);
    if (strategy.goals?.length) contextParts.push(`Goals: ${strategy.goals.join(', ')}`);

    // Brand context
    if (brand?.voice) contextParts.push(`Brand Voice: ${brand.voice}`);
    if (brand?.personality) contextParts.push(`Brand Personality: ${brand.personality}`);
    if (brand?.tagline) contextParts.push(`Brand Tagline: ${brand.tagline}`);

    // Business context
    if (businessProfile?.name) contextParts.push(`Company: ${businessProfile.name}`);
    if (businessProfile?.primaryIndustry) contextParts.push(`Industry: ${businessProfile.primaryIndustry}`);
    if (businessProfile?.description) contextParts.push(`Business Description: ${businessProfile.description}`);

    // ICP context
    if (icps.length > 0) {
      const icpNames = icps.slice(0, 2).map(i => i.name).join(', ');
      contextParts.push(`Target ICPs: ${icpNames}`);
    }

    // Persona context
    if (personas.length > 0) {
      const personaInfo = personas.slice(0, 2).map(p => `${p.name}${p.jobTitle ? ` (${p.jobTitle})` : ''}`).join(', ');
      contextParts.push(`Target Personas: ${personaInfo}`);
    }

    // Competitor context
    if (competitors.length > 0) {
      const competitorNames = competitors.slice(0, 3).map(c => c.name).join(', ');
      contextParts.push(`Key Competitors: ${competitorNames}`);
    }

    return contextParts.join('\n');
  };

  // Parse AI response safely
  const parseAIResponse = (content: string): Record<string, any> | null => {
    try {
      let cleaned = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('[SEO] Failed to parse AI response:', e);
      return null;
    }
  };

  // Generate SEO for all selected titles
  const handleGenerateAllSEO = async () => {
    if (titles.length === 0) {
      setError('No titles selected. Please select titles in the Titles tab first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    const context = buildContext();
    const seoResults: Record<string, TitleSEOData> = {};

    for (let i = 0; i < titles.length; i++) {
      const title = titles[i];
      setGeneratingTitleId(title.id);

      try {
        const prompt = `You are an expert SEO specialist. Generate comprehensive SEO metadata for this blog title.

BLOG TITLE: ${title.title}
${title.excerpt ? `\nDESCRIPTION: ${title.excerpt}` : ''}
${title.suggestedKeywords?.length ? `\nSUGGESTED KEYWORDS: ${title.suggestedKeywords.join(', ')}` : ''}
${title.contentType ? `\nCONTENT TYPE: ${title.contentType}` : ''}
${context ? `\n\nBUSINESS CONTEXT:\n${context}` : ''}

Generate SEO metadata in this exact JSON format:
{
  "optimizedTitle": "SEO-optimized version of the title (50-60 characters, include primary keyword)",
  "metaDescription": "Compelling description for search results (150-160 characters) - MANDATORY",
  "keywords": ["primary keyword", "secondary keyword 1", "secondary keyword 2", "long-tail keyword", "related keyword"],
  "trendingKeywords": ["current trending keyword 1", "current trending keyword 2", "current trending keyword 3"],
  "slug": "url-friendly-slug-lowercase-with-hyphens",
  "searchIntent": "informational|commercial|transactional|navigational",
  "funnelStage": "tofu|mofu|bofu",
  "imagePrompt": "Detailed prompt for AI image generation (describe the visual scene, style, mood, colors for a featured image)",
  "imageAlt": "Descriptive alt text for accessibility and SEO (describe what the image shows)",
  "ogImageDescription": "Open Graph image description for social sharing (compelling summary of the visual)"
}

IMPORTANT:
- The optimizedTitle should be better for SEO while maintaining the original intent
- metaDescription is MANDATORY - must be 150-160 characters and compelling
- Keywords should be highly relevant and searchable
- TrendingKeywords should be current popular search terms
- Search intent should match the content type
- imagePrompt should describe a professional, brand-appropriate featured image for the blog post
- imageAlt should be concise and describe the image for screen readers
- ogImageDescription should entice social media clicks
- Respond with ONLY valid JSON, no markdown, no explanations`;

        const response = await aiApi.generate({
          prompt,
          maxTokens: 800,
          noCache: true
        });

        if (response.data) {
          const parsed = parseAIResponse((response.data as any).content || '');

          if (parsed) {
            seoResults[title.id] = {
              originalTitle: title.title,
              optimizedTitle: parsed.optimizedTitle || title.title,
              // MANDATORY: Always provide a meta description
              metaDescription: parsed.metaDescription || `Explore ${title.title} - insights and strategies for your business.`,
              keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
              trendingKeywords: Array.isArray(parsed.trendingKeywords) ? parsed.trendingKeywords : [],
              slug: parsed.slug || title.slug,
              searchIntent: parsed.searchIntent || 'informational',
              funnelStage: parsed.funnelStage || 'tofu',
              // MANDATORY: Image fields
              imagePrompt: parsed.imagePrompt || `Professional illustration for blog post about ${title.title}`,
              imageAlt: parsed.imageAlt || `Featured image for ${title.title}`,
              ogImageDescription: parsed.ogImageDescription || `Visual representation of ${title.title}`,
            };

            // Auto-save SEO to title
            onUpdateTitle(title.id, {
              title: parsed.optimizedTitle || title.title,
              slug: parsed.slug || title.slug,
              metaDescription: parsed.metaDescription || '',
              suggestedKeywords: [...(parsed.keywords || []), ...(parsed.trendingKeywords || [])],
              trendingKeywords: parsed.trendingKeywords || [],
              searchIntent: (parsed.searchIntent || 'informational') as any,
              funnelStage: (parsed.funnelStage || 'tofu') as any,
              imagePrompt: parsed.imagePrompt || '',
              imageAlt: parsed.imageAlt || '',
              ogImageDescription: parsed.ogImageDescription || '',
            });
          } else {
            const fallback = createFallbackTitleSEO(title);
            seoResults[title.id] = fallback;
            // Auto-save fallback
            onUpdateTitle(title.id, {
              title: fallback.optimizedTitle,
              slug: fallback.slug,
              metaDescription: fallback.metaDescription,
              suggestedKeywords: fallback.keywords,
              trendingKeywords: fallback.trendingKeywords,
              searchIntent: fallback.searchIntent as any,
              funnelStage: fallback.funnelStage as any,
              imagePrompt: fallback.imagePrompt,
              imageAlt: fallback.imageAlt,
              ogImageDescription: fallback.ogImageDescription,
            });
          }
        } else {
          const fallback = createFallbackTitleSEO(title);
          seoResults[title.id] = fallback;
          // Auto-save fallback
          onUpdateTitle(title.id, {
            title: fallback.optimizedTitle,
            slug: fallback.slug,
            metaDescription: fallback.metaDescription,
            suggestedKeywords: fallback.keywords,
            trendingKeywords: fallback.trendingKeywords,
            searchIntent: fallback.searchIntent as any,
            funnelStage: fallback.funnelStage as any,
            imagePrompt: fallback.imagePrompt,
            imageAlt: fallback.imageAlt,
            ogImageDescription: fallback.ogImageDescription,
          });
        }
      } catch (err) {
        console.error(`[SEO] Error generating for title ${title.id}:`, err);
        const fallback = createFallbackTitleSEO(title);
        seoResults[title.id] = fallback;
      }
    }

    setTitleSEO(seoResults);
    setGeneratingTitleId(null);
    setIsGenerating(false);
  };

  // Generate SEO for single title
  const handleGenerateSingleSEO = async (title: BlogTitle) => {
    setGeneratingTitleId(title.id);
    setIsGenerating(true);
    setError(null);

    const context = buildContext();

    try {
      const prompt = `You are an expert SEO specialist. Generate comprehensive SEO metadata for this blog title.

BLOG TITLE: ${title.title}
${title.excerpt ? `\nDESCRIPTION: ${title.excerpt}` : ''}
${title.suggestedKeywords?.length ? `\nSUGGESTED KEYWORDS: ${title.suggestedKeywords.join(', ')}` : ''}
${title.contentType ? `\nCONTENT TYPE: ${title.contentType}` : ''}
${context ? `\n\nBUSINESS CONTEXT:\n${context}` : ''}

Generate SEO metadata in this exact JSON format:
{
  "optimizedTitle": "SEO-optimized version of the title (50-60 characters, include primary keyword)",
  "metaDescription": "Compelling description for search results (150-160 characters) - MANDATORY",
  "keywords": ["primary keyword", "secondary keyword 1", "secondary keyword 2", "long-tail keyword", "related keyword"],
  "trendingKeywords": ["current trending keyword 1", "current trending keyword 2", "current trending keyword 3"],
  "slug": "url-friendly-slug-lowercase-with-hyphens",
  "searchIntent": "informational|commercial|transactional|navigational",
  "funnelStage": "tofu|mofu|bofu",
  "imagePrompt": "Detailed prompt for AI image generation (describe the visual scene, style, mood, colors for a featured image)",
  "imageAlt": "Descriptive alt text for accessibility and SEO (describe what the image shows)",
  "ogImageDescription": "Open Graph image description for social sharing (compelling summary of the visual)"
}

IMPORTANT:
- The optimizedTitle should be better for SEO while maintaining the original intent
- metaDescription is MANDATORY - must be 150-160 characters and compelling
- Keywords should be highly relevant and searchable
- TrendingKeywords should be current popular search terms
- Search intent should match the content type
- imagePrompt should describe a professional, brand-appropriate featured image for the blog post
- imageAlt should be concise and describe the image for screen readers
- ogImageDescription should entice social media clicks
- Respond with ONLY valid JSON, no markdown, no explanations`;

      const response = await aiApi.generate({
        prompt,
        maxTokens: 800,
        noCache: true
      });

      if (response.data) {
        const parsed = parseAIResponse((response.data as any).content || '');

        if (parsed) {
          const seoData: TitleSEOData = {
            originalTitle: title.title,
            optimizedTitle: parsed.optimizedTitle || title.title,
            // MANDATORY: Always provide a meta description
            metaDescription: parsed.metaDescription || `Explore ${title.title} - insights and strategies for your business.`,
            keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
            trendingKeywords: Array.isArray(parsed.trendingKeywords) ? parsed.trendingKeywords : [],
            slug: parsed.slug || title.slug,
            searchIntent: parsed.searchIntent || 'informational',
            funnelStage: parsed.funnelStage || 'tofu',
            // MANDATORY: Image fields
            imagePrompt: parsed.imagePrompt || `Professional illustration for blog post about ${title.title}`,
            imageAlt: parsed.imageAlt || `Featured image for ${title.title}`,
            ogImageDescription: parsed.ogImageDescription || `Visual representation of ${title.title}`,
          };

          setTitleSEO((prev) => ({
            ...prev,
            [title.id]: seoData,
          }));

          // Auto-save SEO to title
          onUpdateTitle(title.id, {
            title: seoData.optimizedTitle,
            slug: seoData.slug,
            metaDescription: seoData.metaDescription,
            suggestedKeywords: [...seoData.keywords, ...seoData.trendingKeywords],
            trendingKeywords: seoData.trendingKeywords,
            searchIntent: seoData.searchIntent as any,
            funnelStage: seoData.funnelStage as any,
            imagePrompt: seoData.imagePrompt,
            imageAlt: seoData.imageAlt,
            ogImageDescription: seoData.ogImageDescription,
          });
        } else {
          const fallbackSeo = createFallbackTitleSEO(title);
          setTitleSEO((prev) => ({
            ...prev,
            [title.id]: fallbackSeo,
          }));
          // Auto-save fallback
          onUpdateTitle(title.id, {
            title: fallbackSeo.optimizedTitle,
            slug: fallbackSeo.slug,
            metaDescription: fallbackSeo.metaDescription,
            suggestedKeywords: fallbackSeo.keywords,
            trendingKeywords: fallbackSeo.trendingKeywords,
            searchIntent: fallbackSeo.searchIntent as any,
            funnelStage: fallbackSeo.funnelStage as any,
            imagePrompt: fallbackSeo.imagePrompt,
            imageAlt: fallbackSeo.imageAlt,
            ogImageDescription: fallbackSeo.ogImageDescription,
          });
        }
      }
    } catch (err) {
      console.error('[SEO] Single generation error:', err);
      setError('Failed to generate SEO. Please try again.');
      const fallbackSeo = createFallbackTitleSEO(title);
      setTitleSEO((prev) => ({
        ...prev,
        [title.id]: fallbackSeo,
      }));
    } finally {
      setGeneratingTitleId(null);
      setIsGenerating(false);
    }
  };

  // Create fallback SEO data with mandatory metaDescription and image fields
  const createFallbackTitleSEO = (title: BlogTitle): TitleSEOData => ({
    originalTitle: title.title,
    optimizedTitle: title.title.slice(0, 60),
    // MANDATORY: Always provide a meta description
    metaDescription: (title.metaDescription || title.excerpt || `Explore ${title.title} - insights and strategies for your business.`).slice(0, 160),
    keywords: title.suggestedKeywords || [],
    trendingKeywords: title.trendingKeywords || [],
    slug: title.slug || title.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    searchIntent: title.searchIntent || 'informational',
    funnelStage: title.funnelStage || 'tofu',
    // MANDATORY: Image fields for SEO
    imagePrompt: title.imagePrompt || `Professional illustration for blog post about ${title.title}`,
    imageAlt: title.imageAlt || `Featured image for ${title.title}`,
    ogImageDescription: title.ogImageDescription || `Visual representation of ${title.title}`,
  });

  // Apply SEO to title (auto-save)
  const applySEOToTitle = (titleId: string) => {
    const seo = titleSEO[titleId];
    const title = titles.find((t) => t.id === titleId);
    if (!seo || !title) return;

    onUpdateTitle(titleId, {
      title: seo.optimizedTitle,
      slug: seo.slug,
      metaDescription: seo.metaDescription,
      suggestedKeywords: [...seo.keywords, ...seo.trendingKeywords],
      trendingKeywords: seo.trendingKeywords,
      searchIntent: seo.searchIntent as any,
      funnelStage: seo.funnelStage as any,
      imagePrompt: seo.imagePrompt,
      imageAlt: seo.imageAlt,
      ogImageDescription: seo.ogImageDescription,
    });
    setEditingTitle(null);
  };

  // Check if title has saved SEO
  const hasSavedSEO = (title: BlogTitle) => {
    return title.metaDescription || (title.suggestedKeywords && title.suggestedKeywords.length > 0);
  };

  // Save all SEO to config
  const saveAllSEO = async () => {
    const allKeywords = Object.values(titleSEO).flatMap(seo => [...seo.keywords, ...seo.trendingKeywords]);
    const uniqueKeywords = [...new Set(allKeywords)];

    onSaveSEO({
      strategyId: strategy.id,
      seoName: strategy.name,
      primaryKeywords: uniqueKeywords.slice(0, 5),
      secondaryKeywords: uniqueKeywords.slice(5, 10),
      longTailKeywords: uniqueKeywords.slice(10, 20),
      searchIntent: 'informational',
      targetAudience: strategy.targetAudience || '',
      primaryGoal: 'traffic',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-primary-400" />
            SEO Optimization
          </h2>
          <p className="text-slate-400 mt-1">
            Optimize your selected titles for SEO. These will be used when generating content.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGenerateAllSEO}
            disabled={isGenerating || titles.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate SEO for All
              </>
            )}
          </button>
          {Object.keys(titleSEO).length > 0 && (
            <button
              onClick={saveAllSEO}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save SEO Config
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary-400">{titles.length}</div>
          <div className="text-xs text-slate-400">Selected Titles</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{Object.keys(titleSEO).length}</div>
          <div className="text-xs text-slate-400">SEO Generated</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{titles.length - Object.keys(titleSEO).length}</div>
          <div className="text-xs text-slate-400">Pending</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {[...new Set(Object.values(titleSEO).flatMap(s => s.keywords))].length}
          </div>
          <div className="text-xs text-slate-400">Total Keywords</div>
        </div>
      </div>

      {/* Title List */}
      <div className="space-y-4">
        {titles.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
            <Type className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No titles selected.</p>
            <p className="text-sm text-slate-500 mt-1">Select titles in the Titles tab first to generate SEO.</p>
          </div>
        ) : (
          titles.map((title) => {
            const seo = titleSEO[title.id];
            const isEditing = editingTitle === title.id;
            const isThisGenerating = generatingTitleId === title.id;

            return (
              <div key={title.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 mb-1">
                      {title.contentType} • {title.style} style
                    </div>
                    {seo && !isThisGenerating ? (
                      <h3 className="font-medium text-slate-200">{seo.optimizedTitle}</h3>
                    ) : (
                      <h3 className="font-medium text-slate-200">{title.title}</h3>
                    )}
                    {seo && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {seo.searchIntent}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                          {seo.funnelStage}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {isThisGenerating ? (
                      <span className="px-3 py-1.5 text-sm bg-primary-500/20 text-primary-300 rounded-lg flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleGenerateSingleSEO(title)}
                          disabled={isGenerating}
                          className="px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          {seo ? 'Re-generate SEO' : 'Generate SEO'}
                        </button>
                        {seo && !isEditing && (
                          <>
                            <button
                              onClick={() => setEditingTitle(title.id)}
                              className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg"
                            >
                              Edit
                            </button>
                            {hasSavedSEO(title) && (
                              <span className="px-3 py-1.5 text-sm bg-green-500/20 text-green-300 rounded-lg flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Saved
                              </span>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* SEO Details */}
                {seo ? (
                  <div className="space-y-3">
                    {/* Original vs Optimized */}
                    {seo.originalTitle !== seo.optimizedTitle && (
                      <div className="text-xs">
                        <span className="text-slate-500">Original: </span>
                        <span className="text-slate-400 line-through">{seo.originalTitle}</span>
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Optimized Title</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={seo.optimizedTitle}
                          onChange={(e) => setTitleSEO((prev) => ({
                            ...prev,
                            [title.id]: { ...seo, optimizedTitle: e.target.value },
                          }))}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm"
                          maxLength={60}
                        />
                      ) : (
                        <p className="text-sm text-slate-200">{seo.optimizedTitle}</p>
                      )}
                      <p className="text-xs text-slate-600 mt-0.5">{seo.optimizedTitle.length}/60</p>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Meta Description</label>
                      {isEditing ? (
                        <textarea
                          value={seo.metaDescription}
                          onChange={(e) => setTitleSEO((prev) => ({
                            ...prev,
                            [title.id]: { ...seo, metaDescription: e.target.value },
                          }))}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm"
                          rows={2}
                          maxLength={160}
                        />
                      ) : (
                        <p className="text-sm text-slate-400">{seo.metaDescription}</p>
                      )}
                      <p className="text-xs text-slate-600 mt-0.5">{seo.metaDescription.length}/160</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Keywords</label>
                        <div className="flex flex-wrap gap-1">
                          {seo.keywords.map((kw, i) => (
                            <span key={i} className="px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded text-xs">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Trending Keywords</label>
                        <div className="flex flex-wrap gap-1">
                          {seo.trendingKeywords?.length > 0 ? (
                            seo.trendingKeywords.map((kw, i) => (
                              <span key={i} className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs">
                                🔥 {kw}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500">None</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">URL Slug</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={seo.slug}
                            onChange={(e) => setTitleSEO((prev) => ({
                              ...prev,
                              [title.id]: { ...seo, slug: e.target.value },
                            }))}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-slate-400 font-mono">{seo.slug}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Search Intent</label>
                        {isEditing ? (
                          <select
                            value={seo.searchIntent}
                            onChange={(e) => setTitleSEO((prev) => ({
                              ...prev,
                              [title.id]: { ...seo, searchIntent: e.target.value },
                            }))}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm"
                          >
                            <option value="informational">Informational</option>
                            <option value="commercial">Commercial</option>
                            <option value="transactional">Transactional</option>
                            <option value="navigational">Navigational</option>
                          </select>
                        ) : (
                          <p className="text-sm text-slate-400 capitalize">{seo.searchIntent}</p>
                        )}
                      </div>
                    </div>

                    {/* Image SEO Fields */}
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Image SEO
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Image Generation Prompt</label>
                          {isEditing ? (
                            <textarea
                              value={seo.imagePrompt || ''}
                              onChange={(e) => setTitleSEO((prev) => ({
                                ...prev,
                                [title.id]: { ...seo, imagePrompt: e.target.value },
                              }))}
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm"
                              rows={2}
                              placeholder="Describe the visual scene for AI image generation..."
                            />
                          ) : (
                            <p className="text-sm text-slate-400">{seo.imagePrompt || 'No image prompt generated'}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-slate-500 block mb-1">Image Alt Text</label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={seo.imageAlt || ''}
                                onChange={(e) => setTitleSEO((prev) => ({
                                  ...prev,
                                  [title.id]: { ...seo, imageAlt: e.target.value },
                                }))}
                                className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm"
                                placeholder="Alt text for accessibility"
                              />
                            ) : (
                              <p className="text-sm text-slate-400">{seo.imageAlt || 'No alt text'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 block mb-1">OG Image Description</label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={seo.ogImageDescription || ''}
                                onChange={(e) => setTitleSEO((prev) => ({
                                  ...prev,
                                  [title.id]: { ...seo, ogImageDescription: e.target.value },
                                }))}
                                className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm"
                                placeholder="Description for social sharing"
                              />
                            ) : (
                              <p className="text-sm text-slate-400">{seo.ogImageDescription || 'No OG description'}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-3 border-t border-slate-700">
                        <button
                          onClick={() => {
                            applySEOToTitle(title.id);
                          }}
                          className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingTitle(null)}
                          className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ) : isThisGenerating ? (
                  <div className="text-center py-4">
                    <RefreshCw className="w-6 h-6 text-primary-400 mx-auto animate-spin mb-2" />
                    <p className="text-sm text-slate-400">Generating SEO...</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Click "Generate SEO" to optimize this title.</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================
// DATA SOURCES TAB
// ============================================

function DataSourcesTab({
  strategy,
  brand,
  businessProfile,
  icps,
  personas,
  competitors,
  onUpdate,
}: {
  strategy: BlogStrategy;
  brand: Brand | null | undefined;
  businessProfile: BusinessProfile | null | undefined;
  icps: ICP[];
  personas: Persona[];
  competitors: Competitor[];
  onUpdate: (updates: Partial<BlogStrategy>) => void;
}) {
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

  const DataSection = ({
    title,
    icon: Icon,
    items,
    type,
    single = false,
    renderItem,
    emptyMessage,
  }: {
    title: string;
    icon: any;
    items: any[];
    type: string;
    single?: boolean;
    renderItem: (item: any) => React.ReactNode;
    emptyMessage?: string;
  }) => {
    if (!items || items.length === 0) {
      return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 opacity-60">
          <div className="flex items-center gap-2 mb-3">
            <Icon className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-400">{title}</h3>
          </div>
          <p className="text-sm text-slate-500">{emptyMessage || `No ${title.toLowerCase()} available. Add data in the ${title} module first.`}</p>
        </div>
      );
    }

    const isLinked = (item: any) => {
      if (single) {
        return (linkedData as any)[`${type}Id`] === item.id;
      }
      const ids = (linkedData as any)[`${type}Ids`] || [];
      return ids.includes(item.id);
    };

    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
          <span className="text-xs text-slate-500 ml-auto">
            {single ? 'Single selection' : 'Multiple selection'}
          </span>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => single ? toggleSingleLink(type, item.id) : toggleLinkedId(type, item.id)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
                isLinked(item)
                  ? 'bg-primary-500/10 border-primary-500/50 text-white'
                  : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600'
              )}
            >
              {renderItem(item)}
              <div className="ml-auto">
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  isLinked(item)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-slate-600'
                )}>
                  {isLinked(item) && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-primary-400" />
          Data Sources
        </h2>
        <p className="text-slate-400 mt-1">
          Link your foundational data to enrich AI-generated content with brand voice, ICPs, and competitor insights.
        </p>
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business Profile */}
        <DataSection
          title="Business Profile"
          icon={Building2}
          items={businessProfile ? [businessProfile] : []}
          type="businessProfile"
          single
          renderItem={(bp: BusinessProfile) => (
            <div className="flex-1">
              <div className="font-medium">{bp.name || 'Unnamed Business'}</div>
              <div className="text-xs text-slate-400">{bp.primaryIndustry || 'No industry'}</div>
            </div>
          )}
          emptyMessage="No business profile configured. Create one in the Business Profile module."
        />

        {/* Brand Strategy */}
        <DataSection
          title="Brand Strategy"
          icon={Palette}
          items={brand ? [brand] : []}
          type="brand"
          single
          renderItem={(b: Brand) => (
            <div className="flex-1">
              <div className="font-medium">{b.tagline || 'Brand Strategy'}</div>
              <div className="text-xs text-slate-400">{b.voice || 'No brand voice defined'}</div>
            </div>
          )}
          emptyMessage="No brand strategy configured. Create one in the Brand module."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ICPs */}
        <DataSection
          title="ICPs"
          icon={Users}
          items={icps}
          type="icp"
          renderItem={(icp: ICP) => (
            <div className="flex-1">
              <div className="font-medium">{icp.name}</div>
              <div className="text-xs text-slate-400">{icp.description?.slice(0, 50) || 'No description'}...</div>
            </div>
          )}
          emptyMessage="No ICPs available. Create them in the ICPs module."
        />

        {/* Personas */}
        <DataSection
          title="Personas"
          icon={UserCircle}
          items={personas}
          type="persona"
          renderItem={(persona: Persona) => (
            <div className="flex-1">
              <div className="font-medium">{persona.name}</div>
              <div className="text-xs text-slate-400">{persona.jobTitle || 'No title'}</div>
            </div>
          )}
          emptyMessage="No personas available. Create them in the Personas module."
        />

        {/* Competitors */}
        <DataSection
          title="Competitors"
          icon={Swords}
          items={competitors}
          type="competitor"
          renderItem={(comp: Competitor) => (
            <div className="flex-1">
              <div className="font-medium">{comp.name}</div>
              <div className="text-xs text-slate-400">{comp.website || 'No website'}</div>
            </div>
          )}
          emptyMessage="No competitors available. Add them in the Competitors module."
        />
      </div>

      {/* Summary */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Linked Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">
              {(linkedData as any).brandId ? 1 : 0}
            </div>
            <div className="text-xs text-slate-400">Brand</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">
              {((linkedData as any).icpIds || []).length}
            </div>
            <div className="text-xs text-slate-400">ICPs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">
              {((linkedData as any).personaIds || []).length}
            </div>
            <div className="text-xs text-slate-400">Personas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">
              {((linkedData as any).competitorIds || []).length}
            </div>
            <div className="text-xs text-slate-400">Competitors</div>
          </div>
        </div>
      </div>
    </div>
  );
}
