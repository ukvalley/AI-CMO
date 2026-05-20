'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { getTemplateForContentType, buildTemplatePromptGuidance } from './templates';
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
  Database,
  FolderOpen,
  UserCircle,
  MessageSquare,
  Copy,
  ExternalLink,
  Pencil,
  Link2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDataStore, useCompanyStore, useTaskStore, useAuthStore } from '@/stores';
import {
  newsletterStrategyApi,
  newsletterCalendarApi,
  newsletterTitleApi,
  newsletterPostApi,
  newsletterContentChunkApi,
  newsletterExportApi,
  aiApi,
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

// Maps newsletter objective (from Strategy) to content types used for generation
const OBJECTIVE_TO_CONTENT_TYPES: Record<NewsletterGoal, string[]> = {
  'education': ['educational', 'case-study', 'weekly-insight'],
  'product-awareness': ['product-update', 'sales', 'problem-solution'],
  'community-building': ['community', 'high-engagement', 'carousel'],
  'brand-awareness': ['promotional', 'personal-branding', 'storytelling'],
  'customer-engagement': ['community', 'carousel', 'high-engagement'],
  'retention': ['sales', 'weekly-insight', 'problem-solution'],
  'updates': ['product-update', 'industry-news', 'founder-letter'],
  'founder-communication': ['founder-letter', 'founder-story', 'storytelling'],
  'thought-leadership': ['authority', 'storytelling', 'educational'],
};

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
  // { name: 'Curated Content', type: 'curated', enabled: true, percentageAllocation: 15, priority: 3, recommendedLength: 500, funnelPosition: 'tofu', ctaStrategy: 'Read article', conversionGoal: 'Engagement' },
  { name: 'Community', type: 'community', enabled: true, percentageAllocation: 10, priority: 4, recommendedLength: 400, funnelPosition: 'tofu', ctaStrategy: 'Join community', conversionGoal: 'Community growth' },
  { name: 'Founder Letter', type: 'founder-letter', enabled: true, percentageAllocation: 10, priority: 5, recommendedLength: 800, funnelPosition: 'mofu', ctaStrategy: 'Reply to founder', conversionGoal: 'Relationship building' },
  { name: 'Case Study', type: 'case-study', enabled: true, percentageAllocation: 10, priority: 6, recommendedLength: 700, funnelPosition: 'mofu', ctaStrategy: 'Book demo', conversionGoal: 'Lead capture' },
  { name: 'Industry News', type: 'industry-news', enabled: true, percentageAllocation: 8, priority: 7, recommendedLength: 500, funnelPosition: 'tofu', ctaStrategy: 'Share opinion', conversionGoal: 'Social engagement' },
  { name: 'Promotional', type: 'promotional', enabled: true, percentageAllocation: 7, priority: 8, recommendedLength: 350, funnelPosition: 'bofu', ctaStrategy: 'Claim offer', conversionGoal: 'Direct sale' },
  { name: 'AI Newsletter', type: 'ai', enabled: true, percentageAllocation: 5, priority: 9, recommendedLength: 500, funnelPosition: 'tofu', ctaStrategy: 'Explore AI tools', conversionGoal: 'Engagement' },
  { name: 'Founder Story', type: 'founder-story', enabled: true, percentageAllocation: 5, priority: 10, recommendedLength: 700, funnelPosition: 'mofu', ctaStrategy: 'Read our story', conversionGoal: 'Relationship building' },
  { name: 'Sales Newsletter', type: 'sales', enabled: true, percentageAllocation: 5, priority: 11, recommendedLength: 500, funnelPosition: 'bofu', ctaStrategy: 'Start free trial', conversionGoal: 'Direct sale' },
  { name: 'Weekly Insight', type: 'weekly-insight', enabled: true, percentageAllocation: 5, priority: 12, recommendedLength: 600, funnelPosition: 'tofu', ctaStrategy: 'Read full analysis', conversionGoal: 'Engagement' },
  { name: 'Carousel', type: 'carousel', enabled: true, percentageAllocation: 3, priority: 13, recommendedLength: 400, funnelPosition: 'tofu', ctaStrategy: 'Swipe through', conversionGoal: 'Engagement' },
  { name: 'Problem-Solution', type: 'problem-solution', enabled: true, percentageAllocation: 5, priority: 14, recommendedLength: 500, funnelPosition: 'mofu', ctaStrategy: 'See the solution', conversionGoal: 'Lead capture' },
  { name: 'Authority Building', type: 'authority', enabled: true, percentageAllocation: 5, priority: 15, recommendedLength: 800, funnelPosition: 'tofu', ctaStrategy: 'Read the research', conversionGoal: 'Thought leadership' },
  { name: 'Storytelling', type: 'storytelling', enabled: true, percentageAllocation: 5, priority: 16, recommendedLength: 700, funnelPosition: 'mofu', ctaStrategy: 'Continue reading', conversionGoal: 'Relationship building' },
  { name: 'Personal Branding', type: 'personal-branding', enabled: true, percentageAllocation: 3, priority: 17, recommendedLength: 600, funnelPosition: 'tofu', ctaStrategy: 'Follow for more', conversionGoal: 'Audience growth' },
  { name: 'High Engagement', type: 'high-engagement', enabled: true, percentageAllocation: 5, priority: 18, recommendedLength: 400, funnelPosition: 'tofu', ctaStrategy: 'Share your take', conversionGoal: 'Community growth' },
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

function transformMongoIds(obj: any): any {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(transformMongoIds);
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key === '_id' ? 'id' : key] = transformMongoIds(obj[key]);
    }
    return result;
  }
  return obj;
}

// ============================================
// FOUNDATIONAL CONTEXT
// ============================================

interface FoundationalContext {
  isLoading: boolean;
  error: string | null;
  businessProfile: any | null;
  founders: any[];
  icps: any[];
  personas: any[];
  products: any[];
  productCategories: any[];
  competitors: any[];
  brandAssets: any[];
  brandStrategy: any | null;
  visualIdentity: any | null;
  salesCollateral: any[];
  allIcps: any[];
  allPersonas: any[];
  allProducts: any[];
  allProductCategories: any[];
  allCompetitors: any[];
  allBrandAssets: any[];
  allSalesCollateral: any[];
}

function useFoundationalContext(strategy: NewsletterStrategy | null): FoundationalContext {
  const companyId = useCompanyStore(s => s.activeCompanyId);
  const getItems = useDataStore(s => s.getItems);
  const storeData = useDataStore(s => s.data);
  const storeActiveCompanyId = useDataStore(s => s.activeCompanyId);

  // State for API-fetched data (primary source)
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [founders, setFounders] = useState<any[]>([]);
  const [allIcps, setAllIcps] = useState<any[]>([]);
  const [allPersonas, setAllPersonas] = useState<any[]>([]);
  const [brandStrategy, setBrandStrategy] = useState<any>(null);
  const [visualIdentity, setVisualIdentity] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allProductCategories, setAllProductCategories] = useState<any[]>([]);
  const [allCompetitors, setAllCompetitors] = useState<any[]>([]);
  const [allBrandAssets, setAllBrandAssets] = useState<any[]>([]);
  const [allSalesCollateral, setAllSalesCollateral] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkedData = strategy?.linkedData || {};

  const resolveIds = (items: any[], ids: string[]) =>
    ids.map(id => items.find((i: any) => i.id === id)).filter(Boolean);

  const icps = linkedData.icpIds?.length ? resolveIds(allIcps, linkedData.icpIds) : [];
  const personas = linkedData.personaIds?.length ? resolveIds(allPersonas, linkedData.personaIds) : [];
  const products = resolveIds(allProducts, linkedData.productIds || []);
  const productCategories = resolveIds(allProductCategories, linkedData.productCategoryIds || []);
  const competitors = resolveIds(allCompetitors, linkedData.competitorIds || []);
  const brandAssets = resolveIds(allBrandAssets, linkedData.brandAssetIds || []);
  const salesCollateral = resolveIds(allSalesCollateral, linkedData.salesCollateralIds || []);

  useEffect(() => {
    if (!companyId) {
      setBusinessProfile(null);
      setFounders([]);
      setAllIcps([]);
      setAllPersonas([]);
      setBrandStrategy(null);
      setVisualIdentity(null);
      setAllProducts([]);
      setAllProductCategories([]);
      setAllCompetitors([]);
      setAllBrandAssets([]);
      setAllSalesCollateral([]);
      return;
    }
    let cancelled = false;

    const fetchFoundationalData = async () => {
      setIsLoading(true);
      setError(null);

      // First, try to populate from local store (instant, no API call needed)
      const storeBp = (getItems('businessProfiles') as any[]) || [];
      if (storeBp.length > 0) setBusinessProfile(storeBp[0]);

      const storeFoundersList = (getItems('founders') as any[]) || [];
      if (storeFoundersList.length > 0) setFounders(storeFoundersList);

      const storeIcpsList = (getItems('icps') as any[]) || [];
      if (storeIcpsList.length > 0) setAllIcps(storeIcpsList);

      const storePersonasList = (getItems('personas') as any[]) || [];
      if (storePersonasList.length > 0) setAllPersonas(storePersonasList);

      const storeProductsList = (getItems('products') as any[]) || [];
      if (storeProductsList.length > 0) setAllProducts(storeProductsList);

      const storeCompetitorsList = (getItems('competitors') as any[]) || [];
      if (storeCompetitorsList.length > 0) setAllCompetitors(storeCompetitorsList);

      const storeBrandAssetsList = (getItems('brandAssets') as any[]) || [];
      if (storeBrandAssetsList.length > 0) setAllBrandAssets(storeBrandAssetsList);

      const storeSalesCollateralList = (getItems('salesCollateral') as any[]) || [];
      if (storeSalesCollateralList.length > 0) setAllSalesCollateral(storeSalesCollateralList);

      // Then fetch from API to get latest data and fill gaps
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = typeof window !== 'undefined' ? useAuthStore.getState().token : '';
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const [bpRes, foundersRes, icpsRes, personasRes, strategyRes, visualRes,
               productsRes, productCategoriesRes, competitorsRes,
               brandAssetsRes, salesCollateralRes] =
          await Promise.allSettled([
            fetch(`${baseUrl}/business-profiles/${companyId}`, { headers }),
            fetch(`${baseUrl}/founders/${companyId}`, { headers }),
            fetch(`${baseUrl}/icps/${companyId}`, { headers }),
            fetch(`${baseUrl}/personas/${companyId}`, { headers }),
            fetch(`${baseUrl}/module-data/brand-strategy/${companyId}`, { headers }),
            fetch(`${baseUrl}/module-data/visual-identity/${companyId}`, { headers }),
            fetch(`${baseUrl}/products/${companyId}`, { headers }),
            fetch(`${baseUrl}/products/categories/${companyId}`, { headers }),
            fetch(`${baseUrl}/competitors/${companyId}`, { headers }),
            fetch(`${baseUrl}/brand-assets/${companyId}`, { headers }),
            fetch(`${baseUrl}/sales-collateral/collateral/${companyId}`, { headers }),
          ]);

        if (!cancelled) {
          if (bpRes.status === 'fulfilled' && bpRes.value.ok) {
            const bp = await bpRes.value.json();
            if (bp && !bp.error) setBusinessProfile(transformMongoIds(bp));
          }
          if (foundersRes.status === 'fulfilled' && foundersRes.value.ok) {
            const fList = await foundersRes.value.json();
            if (Array.isArray(fList) && fList.length > 0) setFounders(transformMongoIds(fList));
          }
          if (icpsRes.status === 'fulfilled' && icpsRes.value.ok) {
            const icpList = await icpsRes.value.json();
            if (Array.isArray(icpList) && icpList.length > 0) setAllIcps(transformMongoIds(icpList));
          }
          if (personasRes.status === 'fulfilled' && personasRes.value.ok) {
            const pList = await personasRes.value.json();
            if (Array.isArray(pList) && pList.length > 0) setAllPersonas(transformMongoIds(pList));
          }
          if (strategyRes.status === 'fulfilled' && strategyRes.value.ok) {
            const sd = await strategyRes.value.json();
            const strategyData = sd?.data || sd;
            if (strategyData && typeof strategyData === 'object' && Object.keys(strategyData).length > 0) {
              setBrandStrategy(transformMongoIds(strategyData));
            }
          }
          if (visualRes.status === 'fulfilled' && visualRes.value.ok) {
            const vd = await visualRes.value.json();
            const identityData = vd?.data || vd;
            if (identityData && typeof identityData === 'object' && Object.keys(identityData).length > 0) {
              setVisualIdentity(transformMongoIds(identityData));
            }
          }
          if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
            const pList = await productsRes.value.json();
            if (Array.isArray(pList) && pList.length > 0) setAllProducts(transformMongoIds(pList));
          }
          if (productCategoriesRes.status === 'fulfilled' && productCategoriesRes.value.ok) {
            const pcList = await productCategoriesRes.value.json();
            if (Array.isArray(pcList) && pcList.length > 0) setAllProductCategories(transformMongoIds(pcList));
          }
          if (competitorsRes.status === 'fulfilled' && competitorsRes.value.ok) {
            const cList = await competitorsRes.value.json();
            if (Array.isArray(cList) && cList.length > 0) setAllCompetitors(transformMongoIds(cList));
          }
          if (brandAssetsRes.status === 'fulfilled' && brandAssetsRes.value.ok) {
            const baList = await brandAssetsRes.value.json();
            if (Array.isArray(baList) && baList.length > 0) setAllBrandAssets(transformMongoIds(baList));
          }
          if (salesCollateralRes.status === 'fulfilled' && salesCollateralRes.value.ok) {
            const scRes = await salesCollateralRes.value.json();
            if (Array.isArray(scRes) && scRes.length > 0) {
              setAllSalesCollateral(transformMongoIds(scRes));
            }
          }
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load foundational data');
      }
      if (!cancelled) setIsLoading(false);
    };

    fetchFoundationalData();
    return () => { cancelled = true; };
  }, [companyId, storeData, storeActiveCompanyId, getItems]);

  return {
    isLoading, error, businessProfile, founders, icps, personas,
    products, productCategories, competitors, brandAssets,
    salesCollateral, brandStrategy, visualIdentity,
    allIcps, allPersonas, allProducts, allProductCategories,
    allCompetitors, allBrandAssets, allSalesCollateral,
  };
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function NewsletterContentOSModule() {
  const companyId = useCompanyStore(s => s.activeCompanyId);
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
  const strategies = useMemo(() => (getItems('newsletterStrategies') as NewsletterStrategy[]) || [], [getItems, data, activeCompanyId]);
  const contentTypes = useMemo(() => (getItems('newsletterContentTypes') as NewsletterContentTypeConfig[]) || [], [getItems, data, activeCompanyId]);
  const calendars = useMemo(() => (getItems('newsletterCalendars') as NewsletterCalendar[]) || [], [getItems, data, activeCompanyId]);
  const titles = useMemo(() => (getItems('newsletterTitles') as NewsletterTitle[]) || [], [getItems, data, activeCompanyId]);
  const posts = useMemo(() => (getItems('newsletterPosts') as NewsletterPost[]) || [], [getItems, data, activeCompanyId]);

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
        const serverStrategies = sRes.data as NewsletterStrategy[];

        // Build a map from local strategy IDs to server strategy IDs
        // so we can update content types that reference local IDs
        const idMap = new Map<string, string>();
        local.forEach((localStrategy) => {
          const serverMatch = serverStrategies.find((s) =>
            s.name === localStrategy.name && s.companyId === localStrategy.companyId && s.id !== localStrategy.id
          );
          if (serverMatch) {
            idMap.set(localStrategy.id, serverMatch.id);
          }
        });

        // Fix content types referencing old local strategy IDs
        if (idMap.size > 0) {
          const contentTypes = (getItems('newsletterContentTypes') as any[]) || [];
          const fixed = contentTypes.map((ct) => {
            const newStrategyId = idMap.get(ct.strategyId);
            if (newStrategyId) {
              return { ...ct, strategyId: newStrategyId };
            }
            return ct;
          });
          setItems('newsletterContentTypes', fixed);
        }

        setItems('newsletterStrategies', mergeById(local, serverStrategies));
      }
      if (cRes.data && Array.isArray(cRes.data) && cRes.data.length > 0) {
        const local = (getItems('newsletterCalendars') as NewsletterCalendar[]) || [];
        setItems('newsletterCalendars', mergeById(local, cRes.data as NewsletterCalendar[]));
      }
      if (tRes.data && Array.isArray(tRes.data) && tRes.data.length > 0) {
        const local = (getItems('newsletterTitles') as NewsletterTitle[]) || [];
        setItems('newsletterTitles', mergeById(local, tRes.data as NewsletterTitle[]));
      }
      if (pRes.data && Array.isArray(pRes.data) && pRes.data.length > 0) {
        const local = (getItems('newsletterPosts') as NewsletterPost[]) || [];
        setItems('newsletterPosts', mergeById(local, pRes.data as NewsletterPost[]));
      }
      if (eRes.data && Array.isArray(eRes.data) && eRes.data.length > 0) {
        const local = (getItems('newsletterExports') as NewsletterExport[]) || [];
        setItems('newsletterExports', mergeById(local, eRes.data as NewsletterExport[]));
      }

      // Ensure content types exist for every strategy (they are only stored locally
      // and are never synced from the server, so server-loaded strategies lose them)
      const allStrategies = (getItems('newsletterStrategies') as NewsletterStrategy[]) || [];
      const existingCT = (getItems('newsletterContentTypes') as NewsletterContentTypeConfig[]) || [];
      const existingStrategyIds = new Set(existingCT.map((ct) => ct.strategyId));
      allStrategies.forEach((s) => {
        if (!existingStrategyIds.has(s.id)) {
          DEFAULT_CONTENT_TYPES.forEach((type) => {
            addItem('newsletterContentTypes', {
              ...type,
              strategyId: s.id,
              companyId,
            } as any);
          });
        }
      });

      setIsLoading(false);
    };

    // Hard timeout fallback: hide loader after 6s no matter what
    const fallbackTimer = setTimeout(() => setIsLoading(false), 6000);

    loadFromApi().finally(() => clearTimeout(fallbackTimer));

    return () => clearTimeout(fallbackTimer);
  }, [companyId]);

  // Active selections
  const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'strategy' | 'types' | 'data' | 'calendar' | 'titles' | 'content' | 'assets' | 'review' | 'export'>('strategy');
  const [showCreateStrategyModal, setShowCreateStrategyModal] = useState(false);
  const [autoMapEnabled, setAutoMapEnabled] = useState(true);
  const [titleFallbackNotice, setTitleFallbackNotice] = useState<string | null>(null);

  const activeStrategy = useMemo(() => strategies.find((s) => s.id === activeStrategyId), [strategies, activeStrategyId]);

  // Foundational context — fetched from API, filtered by linkedData
  const foundationalContext = useFoundationalContext(activeStrategy ?? null);

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
      const serverId = (response.data as any).id;
      updateItem('newsletterStrategies', localId, { id: serverId });
      // Update content types to reference the new server-side strategy ID
      const ctItems = (getItems('newsletterContentTypes') as any[]) || [];
      ctItems
        .filter((ct: any) => ct.strategyId === localId)
        .forEach((ct: any) => {
          updateItem('newsletterContentTypes', ct.id, { strategyId: serverId });
        });
      setActiveStrategyId(serverId);
    }
  }, [companyId, addItem, updateItem, getItems]);

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
  const handleGenerateTitles = useCallback(async (count: number = 10, style: SubjectLineStyle = 'educational', selectedContentType?: string) => {
    if (!activeStrategyId || !activeStrategy) return;

    const taskId = taskStore.createTask(
      `Generate ${count} Newsletter Titles`,
      'newsletter-content-os',
      count
    );

    const brandContext = brand ? `Brand voice: ${brand.voice || 'professional'}, Brand personality: ${brand.personality || 'friendly'}` : '';
    const businessContext = businessProfile ? `Industry: ${businessProfile.primaryIndustry || 'general'}, Company: ${businessProfile.name || 'our company'}` : '';
    const storeTypes = contentTypes.filter((t) => t.enabled && t.strategyId === activeStrategyId);
    const enabledTypes = storeTypes.length > 0 ? storeTypes : DEFAULT_CONTENT_TYPES.filter((t) => t.enabled) as NewsletterContentTypeConfig[];
    // If user selected a specific content type, generate only that type
    const targetTypes = selectedContentType
      ? enabledTypes.filter((t) => t.type === selectedContentType)
      : enabledTypes;
    const typeNames = targetTypes.length > 0 ? targetTypes.map((t) => `${t.name} (${t.type}, ${t.funnelPosition} funnel)`).join(', ') : 'Educational (tofu), Product Update (mofu), Promotional (bofu)';

    // Build foundational context from linked data
    const linkedCtx = foundationalContext;
    const contextParts: string[] = [];
    if (linkedCtx.businessProfile) {
      const bp = linkedCtx.businessProfile;
      contextParts.push(`BUSINESS: ${bp.name || bp.companyName || 'N/A'}${bp.primaryIndustry ? `, Industry: ${bp.primaryIndustry}` : ''}${bp.description ? `, Description: ${bp.description}` : ''}${bp.usp ? `, USP: ${bp.usp}` : ''}`);
    }
    if (linkedCtx.founders.length > 0) {
      contextParts.push(`FOUNDERS: ${linkedCtx.founders.map((f: any) => `${f.name}${f.title ? ` (${f.title})` : ''}`).join(', ')}`);
    }
    if (linkedCtx.icps.length > 0) {
      contextParts.push(`ICPs: ${linkedCtx.icps.map((i: any) => `${i.name}${i.industry ? ` (${i.industry})` : ''}`).join(', ')}`);
    }
    if (linkedCtx.personas.length > 0) {
      contextParts.push(`PERSONAS: ${linkedCtx.personas.map((p: any) => `${p.name}${p.jobTitle ? ` (${p.jobTitle})` : ''}`).join(', ')}`);
    }
    if (linkedCtx.products.length > 0) {
      contextParts.push(`PRODUCTS: ${linkedCtx.products.map((p: any) => `${p.name}${p.category ? ` (${p.category})` : ''}`).join(', ')}`);
    }
    if (linkedCtx.productCategories.length > 0) {
      contextParts.push(`PRODUCT CATEGORIES: ${linkedCtx.productCategories.map((c: any) => c.name).join(', ')}`);
    }
    if (linkedCtx.competitors.length > 0) {
      contextParts.push(`COMPETITORS: ${linkedCtx.competitors.map((c: any) => c.name).join(', ')}`);
    }
    if (linkedCtx.brandAssets.length > 0) {
      contextParts.push(`BRAND ASSETS: ${linkedCtx.brandAssets.map((a: any) => `${a.name} (${a.type})`).join(', ')}`);
    }
    if (linkedCtx.brandStrategy) {
      const bs = linkedCtx.brandStrategy;
      contextParts.push(`BRAND STRATEGY: ${bs.brandName || 'Brand'}${bs.brandArchetype ? `, Archetype: ${bs.brandArchetype}` : ''}${bs.brandVoice ? `, Voice: ${bs.brandVoice}` : ''}`);
    }
    if (linkedCtx.visualIdentity) {
      const vi = linkedCtx.visualIdentity;
      contextParts.push(`VISUAL IDENTITY: ${vi.primaryColor ? `Primary Color: ${vi.primaryColor}` : ''}${vi.headingFont ? `, Fonts: ${vi.headingFont}/${vi.bodyFont}` : ''}`);
    }
    if (linkedCtx.salesCollateral.length > 0) {
      contextParts.push(`SALES COLLATERAL: ${linkedCtx.salesCollateral.map((s: any) => s.name || s.title).join(', ')}`);
    }
    const linkedContextStr = contextParts.length > 0 ? `\n\nLinked Module Context:\n${contextParts.join('\n')}` : '';

    // Build template guidance for each enabled content type
    const templateGuidanceParts = enabledTypes.map((t) => {
      const template = getTemplateForContentType(t.type);
      return `- "${t.type}" → Use "${template.name}" template. Tone: ${template.design.tone}. Style: ${template.design.visualStyle}. Subject patterns: "${template.subjectPatterns.slice(0, 2).join('" or "')}"`;
    });
    const templateGuidance = templateGuidanceParts.length > 0
      ? `\n\nTemplate Structure Guidance:\nEach contentType must follow its corresponding newsletter template:\n${templateGuidanceParts.join('\n')}\nEnsure titles and subject lines match the template's tone, style, and structure.`
      : '';

    const objectiveLabel = activeStrategy.objective || 'education';
    const funnelLabel = activeStrategy.funnelStage || 'tofu';
    const toneLabel = activeStrategy.communicationTone || 'professional';
    const depthLabel = activeStrategy.contentDepth || 'standard';

    const prompt = `Generate ${count} newsletter titles as JSON.

Strategy: Objective=${objectiveLabel}, Audience=${activeStrategy.audience || 'general professionals'}, Funnel=${funnelLabel}, Tone=${toneLabel}, Depth=${depthLabel}
${brandContext ? brandContext : ''}
${businessContext ? businessContext : ''}
${linkedContextStr}
${templateGuidance}

Content types: ${typeNames}
Subject line style: ${style}

RESPOND WITH ONLY a valid JSON array. No markdown, no explanation. Each element:
- "title": newsletter title (max 10 words)
- "subjectLine": email subject line (max 60 chars)
- "previewText": short preview (under 100 chars)
- "contentType": one of: ${targetTypes.length > 0 ? targetTypes.map((t) => t.type).join(', ') : 'educational, product-update, curated, community, founder-letter, case-study, industry-news, promotional, ai'}
- "funnelStage": one of: tofu, mofu, bofu
- "engagementScore": number 70-99
- "suggestedCTA": call-to-action phrase (max 8 words)
- "suggestedKeywords": array of 5 relevant keywords

Example: {"title":"The Complete Guide to SEO Strategy","subjectLine":"Your SEO strategy guide is here","previewText":"Discover actionable insights about SEO this week.","contentType":"educational","funnelStage":"tofu","engagementScore":85,"suggestedCTA":"Read full guide","suggestedKeywords":["guide","tutorial","learn","explained","basics"]}

Generate ${count} diverse titles now:`;

    try {
      console.log('[NewsletterContentOS] Calling AI generate API...');
      const response = await aiApi.generate({ prompt, maxTokens: 4000 });

      console.log('[NewsletterContentOS] AI API response:', { status: response.status, error: response.error, hasData: !!response.data, provider: (response.data as any)?.provider });

      if (response.error || !response.data) {
        throw new Error(response.error || 'AI generation returned no data');
      }

      const aiResult = response.data as any;
      let content: string = aiResult.content || '';
      console.log('[NewsletterContentOS] AI raw content length:', content.length, 'provider:', aiResult.provider, 'model:', aiResult.model);
      if (typeof content !== 'string') {
        content = JSON.stringify(content);
      }

      // Strip markdown code fences if present
      content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

      let parsed: any[];
      try {
        parsed = JSON.parse(content);
      } catch {
        // Try to extract JSON array from the text
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
      const enabledTypeKeys = enabledTypes.map((t) => t.type);
      parsed.slice(0, count).forEach((item: any, i: number) => {
        // Determine the content type for this title:
        // 1. If user selected a specific type from dropdown → force that type
        // 2. If AI returned a valid contentType → trust the AI
        // 3. Fall back to round-robin across enabled types
        let resolvedType: string;
        let resolvedFunnel: string;
        let resolvedCta: string;

        if (selectedContentType) {
          resolvedType = selectedContentType;
          const ctInfo = targetTypes[0];
          resolvedFunnel = ctInfo?.funnelPosition || 'tofu';
          resolvedCta = ctInfo?.ctaStrategy || 'Learn more';
        } else if (item.contentType && enabledTypeKeys.includes(item.contentType)) {
          // Trust the AI's contentType if it's a valid enabled type
          resolvedType = item.contentType;
          const ctInfo = enabledTypes.find((t) => t.type === item.contentType);
          resolvedFunnel = ctInfo?.funnelPosition || item.funnelStage || 'tofu';
          resolvedCta = ctInfo?.ctaStrategy || item.suggestedCTA || 'Learn more';
        } else {
          // Fallback: round-robin across enabled types
          const ctInfo = enabledTypes.length > 0
            ? enabledTypes[i % enabledTypes.length]
            : null;
          resolvedType = ctInfo?.type || item.contentType || 'educational';
          resolvedFunnel = ctInfo?.funnelPosition || item.funnelStage || 'tofu';
          resolvedCta = ctInfo?.ctaStrategy || item.suggestedCTA || 'Learn more';
        }

        const titleData = {
          id: `nlt-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
          strategyId: activeStrategyId,
          title: item.title || 'Untitled Newsletter',
          subjectLine: item.subjectLine || '',
          previewText: item.previewText || '',
          contentType: resolvedType,
          style,
          engagementScore: typeof item.engagementScore === 'number' ? item.engagementScore : Math.floor(Math.random() * 30) + 70,
          funnelStage: item.funnelStage || resolvedFunnel,
          suggestedKeywords: Array.isArray(item.suggestedKeywords) ? item.suggestedKeywords : generateKeywords(resolvedType),
          suggestedCTA: item.suggestedCTA || resolvedCta,
          status: 'generated',
          order: i,
          companyId,
          aiModel: aiResult.model || 'unknown',
          aiPrompt: prompt.slice(0, 500),
        };

        addItem('newsletterTitles', titleData as any);
        titlesToCreate.push(titleData);
      });

      await Promise.all(titlesToCreate.map((t) => newsletterTitleApi.create(t).catch(() => {})));
      taskStore.completeBatch(taskId, 0, Array(Math.min(parsed.length, count)).fill('title'));
      console.log('[NewsletterContentOS] SUCCESS — AI generated', titlesToCreate.length, 'titles via', aiResult.provider, '/', aiResult.model);
      setTitleFallbackNotice(null);
    } catch (error) {
      console.error('[NewsletterContentOS] AI title generation FAILED — falling back to templates. Error:', error);
      setTitleFallbackNotice('AI generation unavailable. Titles generated from built-in templates — try regenerating later.');
      const fallbackType = { type: selectedContentType || 'educational', funnelPosition: 'tofu', ctaStrategy: 'Learn more' };
      const titlesToCreate: any[] = [];
      for (let i = 0; i < count; i++) {
        const contentType = selectedContentType
          ? targetTypes[0] || fallbackType
          : enabledTypes.length > 0
            ? enabledTypes[i % enabledTypes.length]
            : fallbackType;
        const result = generateSampleTitle(contentType?.type || 'educational', style, brandContext, businessContext);

        const titleData = {
          id: `nlt-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
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
          aiModel: 'template',
        };

        addItem('newsletterTitles', titleData as any);
        titlesToCreate.push(titleData);
      }

      await Promise.all(titlesToCreate.map((t) => newsletterTitleApi.create(t).catch(() => {})));
      taskStore.completeBatch(taskId, 0, Array(count).fill('title'));
    }
  }, [activeStrategyId, activeStrategy, contentTypes, brand, businessProfile, addItem, taskStore, companyId, foundationalContext]);

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
            // { id: 'types', label: 'Content Types', icon: Layout },
            { id: 'data', label: 'Data Sources', icon: Database },
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
                foundationalContext={foundationalContext}
                onUpdate={(updates) => handleUpdateStrategy(activeStrategy!.id, updates)}
              />
            )}

            {activeTab === 'data' && activeStrategy && (
              <DataSourcesTab
                strategy={activeStrategy}
                onUpdate={(updates) => handleUpdateStrategy(activeStrategy!.id, updates)}
                foundationalContext={foundationalContext}
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
                posts={posts.filter((p) => p.strategyId === activeStrategy.id)}
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
                titleFallbackNotice={titleFallbackNotice}
                onUpdate={async (id, updates) => {
                  updateItem('newsletterTitles', id, updates);
                  await newsletterTitleApi.update(id, updates);
                }}
                onDelete={async (id) => {
                  deleteItem('newsletterTitles', id);
                  await newsletterTitleApi.delete(id);
                }}
                onClearGenerated={async () => {
                  const generated = titles.filter((t) => t.strategyId === activeStrategy.id && t.status === 'generated');
                  setItems('newsletterTitles', titles.filter((t) => t.status !== 'generated' || t.strategyId !== activeStrategy.id));
                  await Promise.all(generated.map((t) => newsletterTitleApi.delete(t.id).catch(() => {})));
                }}
                onClearSelected={async () => {
                  const selected = titles.filter((t) => t.strategyId === activeStrategy.id && t.status === 'selected');
                  const updated = titles.map((t) =>
                    t.strategyId === activeStrategy.id && t.status === 'selected' ? { ...t, status: 'rejected' as const } : t
                  );
                  setItems('newsletterTitles', updated);
                  await Promise.all(selected.map((t) => newsletterTitleApi.update(t.id, { status: 'rejected' }).catch(() => {})));
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
                autoMapEnabled={autoMapEnabled}
                onAutoMapToggle={() => setAutoMapEnabled(!autoMapEnabled)}
                foundationalContext={foundationalContext}
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
                onUpdateCalendar={async (id, updates) => {
                  updateItem('newsletterCalendars', id, updates);
                  await newsletterCalendarApi.update(id, updates);
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
                foundationalContext={foundationalContext}
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
                foundationalContext={foundationalContext}
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
  foundationalContext,
  onUpdate,
}: {
  strategy: NewsletterStrategy;
  brand: Brand | null;
  businessProfile: BusinessProfile | undefined;
  icps: ICP[];
  personas: Persona[];
  products: Product[];
  competitors: Competitor[];
  foundationalContext?: FoundationalContext;
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
      {activeSection === 'linked' && (() => {
        const fCtx = foundationalContext;
        const linkedCount = [
          linkedData.businessProfileId ? 1 : 0,
          (linkedData.founderIds || []).length,
          (linkedData.icpIds || []).length,
          (linkedData.personaIds || []).length,
          (linkedData.productIds || []).length,
          (linkedData.productCategoryIds || []).length,
          (linkedData.competitorIds || []).length,
          (linkedData.brandAssetIds || []).length,
          linkedData.brandStrategyId ? 1 : 0,
          linkedData.visualIdentityId ? 1 : 0,
          (linkedData.salesCollateralIds || []).length,
        ].reduce((a, b) => a + b, 0);

        type LinkedModule = { key: string; label: string; icon: any; count: number; linked: number; items: { id: string; name: string; sub?: string }[] };
        const modules: LinkedModule[] = [
          {
            key: 'businessProfile', label: 'Business Profile', icon: Building2,
            count: fCtx?.businessProfile ? 1 : 0, linked: linkedData.businessProfileId ? 1 : 0,
            items: fCtx?.businessProfile ? [{ id: fCtx.businessProfile.id || 'bp', name: fCtx.businessProfile.name || fCtx.businessProfile.companyName || 'Business Profile', sub: fCtx.businessProfile.primaryIndustry }] : [],
          },
          {
            key: 'founder', label: 'Founders', icon: Users,
            count: fCtx?.allIcps ? (fCtx as any).founders?.length || 0 : 0, linked: (linkedData.founderIds || []).length,
            items: (fCtx as any)?.founders?.map((f: any) => ({ id: f.id, name: f.name, sub: f.title })) || [],
          },
          {
            key: 'icp', label: 'ICPs', icon: Target,
            count: fCtx?.allIcps?.length || icps.length, linked: (linkedData.icpIds || []).length,
            items: (fCtx?.allIcps || icps).map((i: any) => ({ id: i.id, name: i.name, sub: i.industry })),
          },
          {
            key: 'persona', label: 'Buyer Personas', icon: UserCircle,
            count: fCtx?.allPersonas?.length || personas.length, linked: (linkedData.personaIds || []).length,
            items: (fCtx?.allPersonas || personas).map((p: any) => ({ id: p.id, name: p.name, sub: p.jobTitle })),
          },
          {
            key: 'product', label: 'Products', icon: Package,
            count: fCtx?.allProducts?.length || products.length, linked: (linkedData.productIds || []).length,
            items: (fCtx?.allProducts || products).map((p: any) => ({ id: p.id, name: p.name, sub: p.category })),
          },
          {
            key: 'productCategory', label: 'Product Categories', icon: FolderOpen,
            count: fCtx?.allProductCategories?.length || 0, linked: (linkedData.productCategoryIds || []).length,
            items: (fCtx?.allProductCategories || []).map((c: any) => ({ id: c.id, name: c.name })),
          },
          {
            key: 'competitor', label: 'Competitors', icon: Swords,
            count: fCtx?.allCompetitors?.length || competitors.length, linked: (linkedData.competitorIds || []).length,
            items: (fCtx?.allCompetitors || competitors).map((c: any) => ({ id: c.id, name: c.name, sub: c.website })),
          },
          {
            key: 'brandAsset', label: 'Brand Assets', icon: Image,
            count: fCtx?.allBrandAssets?.length || 0, linked: (linkedData.brandAssetIds || []).length,
            items: (fCtx?.allBrandAssets || []).map((a: any) => ({ id: a.id, name: a.name, sub: a.type })),
          },
          {
            key: 'brandStrategy', label: 'Brand Strategy', icon: Sparkles,
            count: fCtx?.brandStrategy ? 1 : 0, linked: linkedData.brandStrategyId ? 1 : 0,
            items: fCtx?.brandStrategy ? [{ id: 'brand-strategy', name: fCtx.brandStrategy.brandName || 'Brand Strategy', sub: fCtx.brandStrategy.brandArchetype ? `Archetype: ${fCtx.brandStrategy.brandArchetype}` : undefined }] : [],
          },
          {
            key: 'visualIdentity', label: 'Visual Identity', icon: Palette,
            count: fCtx?.visualIdentity ? 1 : 0, linked: linkedData.visualIdentityId ? 1 : 0,
            items: fCtx?.visualIdentity ? [{ id: 'visual-identity', name: fCtx.visualIdentity.headingFont ? `${fCtx.visualIdentity.headingFont} / ${fCtx.visualIdentity.bodyFont}` : 'Visual Identity', sub: fCtx.visualIdentity.primaryColor }] : [],
          },
          {
            key: 'salesCollateral', label: 'Sales Collateral', icon: FileText,
            count: fCtx?.allSalesCollateral?.length || 0, linked: (linkedData.salesCollateralIds || []).length,
            items: (fCtx?.allSalesCollateral || []).map((s: any) => ({ id: s.id, name: s.name || s.title, sub: s.type || s.scriptType })),
          },
        ];

        return (
          <div className="space-y-6">
            <div className="bg-primary-500/5 border border-primary-500/20 rounded-lg p-4">
              <h4 className="font-medium text-primary-400 mb-2 flex items-center gap-2">
                <Link className="w-4 h-4" />
                Linked Modules
              </h4>
              <p className="text-sm text-slate-400">
                {linkedCount > 0
                  ? `${linkedCount} data source${linkedCount === 1 ? '' : 's'} linked — this data enriches AI-generated titles and newsletter content.`
                  : 'No data sources linked yet. Use the Data Sources tab to link modules for richer AI generation.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((mod) => {
                if (mod.count === 0 && mod.linked === 0) return null;
                const Icon = mod.icon;
                return (
                  <div key={mod.key} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-slate-200 flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary-400" />
                        {mod.label}
                      </h5>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        mod.linked > 0 ? 'bg-primary-500/10 text-primary-400' : 'bg-slate-800 text-slate-500'
                      )}>
                        {mod.linked}/{mod.count}
                      </span>
                    </div>
                    {mod.items.length > 0 ? (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {mod.items.map((item) => {
                          const isLinked = mod.key === 'businessProfile' || mod.key === 'brandStrategy' || mod.key === 'visualIdentity'
                            ? !!(linkedData as any)[`${mod.key}Id`]
                            : ((linkedData as any)[`${mod.key}Ids`] || []).includes(item.id);
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                'flex items-center gap-2 p-1.5 rounded text-sm',
                                isLinked ? 'text-slate-200' : 'text-slate-500'
                              )}
                            >
                              <div className={cn(
                                'w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0',
                                isLinked ? 'bg-primary-500 border-primary-500' : 'border-slate-600'
                              )}>
                                {isLinked && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <span className="truncate">{item.name}</span>
                              {item.sub && <span className="text-xs text-slate-500 truncate ml-auto">{item.sub}</span>}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No items available</p>
                    )}
                  </div>
                );
              })}
            </div>

            {linkedCount === 0 && (
              <div className="text-center py-6">
                <p className="text-slate-500 mb-3">No data sources linked yet.</p>
                <p className="text-sm text-slate-400">
                  Go to the <strong className="text-primary-400">Data Sources</strong> tab to link modules for richer AI-generated content.
                </p>
              </div>
            )}
          </div>
        );
      })()}
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
  posts,
  onCreateCalendar,
  onUpdateCalendar,
}: {
  strategy: NewsletterStrategy;
  calendars: NewsletterCalendar[];
  posts: NewsletterPost[];
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
      'bi-weekly': 'Every 2 weeks',
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
                {activeCalendar.timeline.slice(0, 20).map((item, index) => {
                  const mappedPost = item.postId ? posts.find((p) => p.id === item.postId) : undefined;
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="text-sm font-medium text-slate-500 w-8">#{index + 1}</div>
                      <div className="flex-1">
                        <div className="text-sm text-slate-200">{item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'Not scheduled'}</div>
                        {mappedPost ? (
                          <div className="text-xs text-primary-400 mt-0.5">{mappedPost.title}</div>
                        ) : item.titleId ? (
                          <div className="text-xs text-slate-500 mt-0.5">Title assigned</div>
                        ) : (
                          <div className="text-xs text-slate-500 mt-0.5">No content assigned</div>
                        )}
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
          calendar={activeCalendar}
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreateCalendar}
          onUpdate={onUpdateCalendar}
        />
      )}
    </div>
  );
}

function CreateCalendarModal({
  strategy,
  calendar,
  onClose,
  onCreate,
  onUpdate,
}: {
  strategy: NewsletterStrategy;
  calendar?: NewsletterCalendar;
  onClose: () => void;
  onCreate: (data: Partial<NewsletterCalendar>) => void;
  onUpdate?: (id: string, updates: Partial<NewsletterCalendar>) => void;
}) {
  const isEditing = !!calendar;

  const [name, setName] = useState(calendar?.name || strategy.name + ' Calendar');
  const [frequency, setFrequency] = useState<NewsletterFrequency>(calendar?.frequency || 'weekly');
  const [newslettersPerCycle, setNewslettersPerCycle] = useState(calendar?.newslettersPerCycle || 4);
  const [publishingDays, setPublishingDays] = useState<string[]>(calendar?.publishingDays || ['tuesday']);

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
    startDate.setHours(0, 0, 0, 0);

    const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const sortedDayNums = [...publishingDays]
      .map((d) => dayOrder.indexOf(d))
      .sort((a, b) => a - b);

    if (sortedDayNums.length === 0) return;

    // Find the first publishing day on or after startDate
    const startDayNum = startDate.getDay();
    const firstIdx = sortedDayNums.findIndex((d) => d >= startDayNum);

    let currentDayOffset: number;
    let publishIdx: number;

    if (firstIdx !== -1) {
      currentDayOffset = sortedDayNums[firstIdx] - startDayNum;
      publishIdx = firstIdx;
    } else {
      currentDayOffset = 7 - startDayNum + sortedDayNums[0];
      publishIdx = 0;
    }

    for (let i = 0; i < newslettersPerCycle; i++) {
      const scheduledDate = new Date(startDate.getTime() + currentDayOffset * 24 * 60 * 60 * 1000);

      timeline.push({
        id: `calendar-item-${i}`,
        scheduledDate: scheduledDate.toISOString(),
        status: 'empty',
      });

      // Advance to next publishing day
      publishIdx++;
      if (publishIdx >= sortedDayNums.length) {
        publishIdx = 0;
      }

      // Calculate days from current scheduled day to the next publishing day
      const currentDayOfWeek = (startDayNum + currentDayOffset) % 7;
      const nextDayNum = sortedDayNums[publishIdx];
      const gap = nextDayNum > currentDayOfWeek
        ? nextDayNum - currentDayOfWeek
        : 7 - currentDayOfWeek + nextDayNum;

      currentDayOffset += gap;
    }

    if (isEditing && calendar && onUpdate) {
      onUpdate(calendar.id, {
        name,
        frequency,
        newslettersPerCycle,
        publishingDays,
        timeline,
        startDate: startDate.toISOString(),
      });
    } else {
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
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-200">{isEditing ? 'Edit Newsletter Calendar' : 'Create Newsletter Calendar'}</h2>
          <p className="text-sm text-slate-400">{isEditing ? 'Update your publishing schedule' : 'Set up your publishing schedule'}</p>
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
            {isEditing ? 'Save Changes' : 'Create Calendar'}
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
  onClearGenerated,
  onClearSelected,
  titleFallbackNotice,
}: {
  strategy: NewsletterStrategy;
  contentTypes: NewsletterContentTypeConfig[];
  titles: NewsletterTitle[];
  onGenerate: (count: number, style: SubjectLineStyle, contentType?: string) => void;
  onUpdate: (id: string, updates: Partial<NewsletterTitle>) => void;
  onDelete: (id: string) => void;
  onClearGenerated: () => void;
  onClearSelected: () => void;
  titleFallbackNotice?: string | null;
}) {
  const [selectedStyles, setSelectedStyles] = useState<SubjectLineStyle[]>([]);
  // Content types are now derived from strategy objective, not a manual dropdown
  const objectiveContentTypes = OBJECTIVE_TO_CONTENT_TYPES[strategy.objective || 'education'] || ['educational'];
  const [styleCounts, setStyleCounts] = useState<Record<SubjectLineStyle, number>>({
    educational: 3,
    conversational: 3,
    'founder-style': 3,
    authority: 3,
    emotional: 3,
    insight: 3,
    minimal: 3,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedTitles = titles.filter((t) => t.status === 'selected').sort((a, b) => a.order - b.order);
  const generatedTitles = titles.filter((t) => t.status === 'generated');

  const toggleStyle = (style: SubjectLineStyle) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const updateStyleCount = (style: SubjectLineStyle, count: number) => {
    setStyleCounts((prev) => ({ ...prev, [style]: Math.max(1, Math.min(50, count)) }));
  };

  const handleGenerate = async () => {
    console.log("Button Hit");
    if (selectedStyles.length === 0) return;
    setIsGenerating(true);
    // Distribute titles across objective-based content types
    for (const style of selectedStyles) {
      const total = styleCounts[style];
      // Round-robin distribute total count across content types
      let remaining = total;
      for (let i = 0; i < objectiveContentTypes.length && remaining > 0; i++) {
        const perType = Math.ceil(remaining / (objectiveContentTypes.length - i));
        await onGenerate(perType, style, objectiveContentTypes[i]);
        remaining -= perType;
      }
    }
    setIsGenerating(false);
  };

  const handleSelect = (title: NewsletterTitle) => {
    const currentSelected = titles.filter((t) => t.status === 'selected');
    onUpdate(title.id, { status: 'selected', order: currentSelected.length });
  };

  const handleReject = (title: NewsletterTitle) => {
    onUpdate(title.id, { status: 'rejected' });
  };

  const groupedTitles = generatedTitles.reduce<Record<string, NewsletterTitle[]>>((acc, title) => {
    const key = title.style || 'educational';
    if (!acc[key]) acc[key] = [];
    acc[key].push(title);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {titleFallbackNotice && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-amber-400">AI Unavailable</div>
            <div className="text-sm text-slate-400 mt-1">{titleFallbackNotice}</div>
          </div>
          <button onClick={() => onGenerate(10, 'educational')} className="text-xs px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-amber-400 transition-colors">
            Retry with AI
          </button>
        </div>
      )}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-400" />
          AI Title & Subject Line Generator
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-3">Subject Line Styles</label>
          <div className="space-y-3">
            {SUBJECT_LINE_STYLES.map((style) => {
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Newsletter Formats <span className="text-slate-500 text-xs">(from Strategy Objective)</span></label>
          <div className="flex flex-wrap gap-2">
            {objectiveContentTypes.map((ct) => {
              const ctInfo = DEFAULT_CONTENT_TYPES.find(t => t.type === ct);
              return (
                <span key={ct} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                  {ctInfo?.name || ct}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-1.5">Formats are automatically selected based on your Strategy Objective: <span className="text-slate-400">{NEWSLETTER_GOALS.find(g => g.value === strategy.objective)?.label || 'Education'}</span></p>
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
            Context: {strategy.audience || 'General audience'} |
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
                const styleInfo = SUBJECT_LINE_STYLES.find((s) => s.value === style);
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
    ai: ['AI', 'artificial intelligence', 'automation', 'tools', 'productivity'],
  };
  return keywordMap[contentType] || ['newsletter', 'marketing', 'growth', 'business'];
}

// ============================================
// DATA SOURCES TAB
// ============================================

function DataSourcesTab({
  strategy,
  onUpdate,
  foundationalContext,
}: {
  strategy: NewsletterStrategy;
  onUpdate: (updates: Partial<NewsletterStrategy>) => void;
  foundationalContext?: FoundationalContext;
}) {
  const linkedData = strategy.linkedData || {};

  const businessProfileData = foundationalContext?.businessProfile || null;
  const foundersData = (foundationalContext as any)?.founders || [];
  const icpsData = foundationalContext?.allIcps || [];
  const personasData = foundationalContext?.allPersonas || [];
  const brandStrategyData = foundationalContext?.brandStrategy || null;
  const visualIdentityData = foundationalContext?.visualIdentity || null;
  const productsData = foundationalContext?.allProducts || [];
  const productCategoriesData = foundationalContext?.allProductCategories || [];
  const competitorsData = foundationalContext?.allCompetitors || [];
  const brandAssetsData = foundationalContext?.allBrandAssets || [];
  const salesCollateralData = foundationalContext?.allSalesCollateral || [];

  const toggleLink = (type: string, id: string, isArray = false) => {
    const currentIds = (linkedData as any)[`${type}Ids`] || [];
    let newIds: string[];
    if (isArray) {
      newIds = currentIds.includes(id)
        ? currentIds.filter((i: string) => i !== id)
        : [...currentIds, id];
    } else {
      newIds = currentIds.includes(id) ? [] : [id];
    }
    onUpdate({
      linkedData: { ...linkedData, [`${type}Ids`]: newIds },
    });
  };

  const toggleSingleLink = (type: string, id: string) => {
    const currentId = (linkedData as any)[`${type}Id`];
    onUpdate({
      linkedData: { ...linkedData, [`${type}Id`]: currentId === id ? undefined : id },
    });
  };

  const DataSection = ({
    title,
    icon: Icon,
    items,
    type,
    isArray = false,
    single = false,
    renderItem,
    emptyMessage,
  }: {
    title: string;
    icon: any;
    items: any[];
    type: string;
    isArray?: boolean;
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
          <span className="ml-auto text-sm text-slate-500">{items.length} items</span>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                single ? toggleSingleLink(type, item.id) : toggleLink(type, item.id, isArray)
              }
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all',
                isLinked(item)
                  ? 'bg-primary-500/10 border border-primary-500/30'
                  : 'bg-slate-900/50 border border-slate-700 hover:border-slate-600'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded border flex items-center justify-center',
                  isLinked(item)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-slate-600'
                )}
              >
                {isLinked(item) && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">{renderItem(item)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary-500/5 border border-primary-500/20 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-primary-400 mb-2 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Data Sources for Newsletter Generation
        </h4>
        <p className="text-sm text-slate-400">
          Link data from other modules to enrich your newsletter content generation with business context,
          ICP insights, product details, brand identity, and competitive intelligence. Selected data will be
          used as context for AI-generated titles and newsletters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Foundation */}
        <DataSection
          title="Business Profile"
          icon={Building2}
          items={businessProfileData ? [businessProfileData] : []}
          type="businessProfile"
          single
          renderItem={(item) => (
            <div>
              <div className="font-medium text-slate-200">{item.name || item.companyName || 'Business Profile'}</div>
              {item.primaryIndustry && <div className="text-xs text-slate-500">{item.primaryIndustry}</div>}
            </div>
          )}
        />

        <DataSection
          title="Founders"
          icon={Users}
          items={foundersData}
          type="founder"
          isArray
          renderItem={(item) => (
            <div className="flex items-center gap-2">
              {item.photos?.length && (
                <img src={item.photos[0]} alt="" className="w-8 h-8 rounded-full object-cover" />
              )}
              <div>
                <div className="font-medium text-slate-200">{item.name}</div>
                {item.title && <div className="text-xs text-slate-500">{item.title}</div>}
              </div>
            </div>
          )}
        />

        {/* ICPs & Personas */}
        <DataSection
          title="Ideal Customer Profiles (ICPs)"
          icon={Target}
          items={icpsData}
          type="icp"
          isArray
          renderItem={(item) => (
            <div>
              <div className="font-medium text-slate-200">{item.name}</div>
              {item.industry && <div className="text-xs text-slate-500">{item.industry}</div>}
            </div>
          )}
        />

        <DataSection
          title="Buyer Personas"
          icon={UserCircle}
          items={personasData}
          type="persona"
          isArray
          renderItem={(item) => (
            <div>
              <div className="font-medium text-slate-200">{item.name}</div>
              {item.jobTitle && <div className="text-xs text-slate-500">{item.jobTitle}</div>}
            </div>
          )}
        />

        {/* Products */}
        <DataSection
          title="Products"
          icon={Package}
          items={productsData}
          type="product"
          isArray
          renderItem={(item) => (
            <div>
              <div className="font-medium text-slate-200">{item.name}</div>
              {item.category && <div className="text-xs text-slate-500">{item.category}</div>}
            </div>
          )}
        />

        <DataSection
          title="Product Categories"
          icon={FolderOpen}
          items={productCategoriesData}
          type="productCategory"
          isArray
          renderItem={(item) => (
            <div className="font-medium text-slate-200">{item.name}</div>
          )}
        />

        {/* Competitors */}
        <DataSection
          title="Competitors"
          icon={Swords}
          items={competitorsData}
          type="competitor"
          isArray
          renderItem={(item) => (
            <div>
              <div className="font-medium text-slate-200">{item.name}</div>
              {item.website && (
                <div className="text-xs text-slate-500 truncate">{item.website}</div>
              )}
            </div>
          )}
        />

        <DataSection
          title="Brand Assets"
          icon={Image}
          items={brandAssetsData}
          type="brandAsset"
          isArray
          emptyMessage="No brand assets available. Add logos and assets in Brand Assets module."
          renderItem={(item) => (
            <div className="flex items-center gap-2">
              {item.thumbnailUrl && (
                <img src={item.thumbnailUrl} alt="" className="w-8 h-8 rounded object-cover" />
              )}
              <div>
                <div className="font-medium text-slate-200">{item.name}</div>
                <div className="text-xs text-slate-500 capitalize">{item.type}</div>
              </div>
            </div>
          )}
        />

        {/* Brand Strategy */}
        <DataSection
          title="Brand Strategy"
          icon={Sparkles}
          items={brandStrategyData ? [{ id: 'brand-strategy', ...brandStrategyData }] : []}
          type="brandStrategy"
          single
          emptyMessage="No brand strategy available. Configure brand strategy in the Brand Strategy module."
          renderItem={(item) => (
            <div>
              <div className="font-medium text-slate-200">{item.brandName || 'Brand Strategy'}</div>
              {item.brandArchetype && <div className="text-xs text-slate-500">Archetype: {item.brandArchetype}</div>}
              {item.brandVoice && <div className="text-xs text-slate-500">Voice: {item.brandVoice}</div>}
            </div>
          )}
        />

        {/* Visual Identity */}
        <DataSection
          title="Visual Identity"
          icon={Palette}
          items={visualIdentityData ? [{ id: 'visual-identity', ...visualIdentityData }] : []}
          type="visualIdentity"
          single
          emptyMessage="No visual identity available. Configure visual identity in the Visual Identity module."
          renderItem={(item) => (
            <div className="flex items-center gap-2">
              {item.primaryColor && (
                <div className="w-6 h-6 rounded-md border border-slate-600" style={{ backgroundColor: item.primaryColor }} />
              )}
              <div>
                <div className="font-medium text-slate-200">{item.headingFont ? `${item.headingFont} / ${item.bodyFont}` : 'Visual Identity'}</div>
                {item.primaryColor && <div className="text-xs text-slate-500">Primary: {item.primaryColor}</div>}
              </div>
            </div>
          )}
        />

        {/* Sales Collateral */}
        <DataSection
          title="Sales Collateral"
          icon={FileText}
          items={salesCollateralData}
          type="salesCollateral"
          isArray
          emptyMessage="No sales collateral available. Add documents in Sales Collateral module."
          renderItem={(item) => (
            <div className="min-w-0">
              <div className="font-medium text-slate-200 truncate">{item.name || item.title}</div>
              <div className="flex items-center gap-2">
                {(item.type || item.scriptType) && <span className="text-xs text-slate-500 capitalize">{item.type || item.scriptType}</span>}
                {item.funnelStage && <span className="text-xs text-slate-600">&middot; {item.funnelStage}</span>}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
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
// BACKLINK EDITOR
// ============================================

function BacklinkEditor({
  backlinks,
  onSave,
  onCancel,
}: {
  backlinks: NewsletterSection['backlinks'];
  onSave: (backlinks: NewsletterSection['backlinks']) => void;
  onCancel: () => void;
}) {
  const [items, setItems] = useState<Array<{ label: string; url: string; type: 'internal' | 'external' }>>(
    backlinks && backlinks.length > 0
      ? backlinks.map(bl => ({ label: bl.label, url: bl.url, type: bl.type }))
      : [{ label: '', url: '', type: 'external' as const }]
  );

  const updateItem = (index: number, field: 'label' | 'url' | 'type', value: string) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems(prev => [...prev, { label: '', url: '', type: 'external' as const }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-2 p-3 bg-slate-900/80 border border-slate-600/50 rounded-lg space-y-2">
      <div className="text-xs font-medium text-slate-300 mb-1">Edit Links</div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={item.label}
            onChange={(e) => updateItem(i, 'label', e.target.value)}
            placeholder="Link label"
            className="flex-1 px-2 py-1 text-xs bg-slate-800 border border-slate-600 rounded text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary-500"
          />
          <input
            type="url"
            value={item.url}
            onChange={(e) => updateItem(i, 'url', e.target.value)}
            placeholder="https://..."
            className="flex-1 px-2 py-1 text-xs bg-slate-800 border border-slate-600 rounded text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary-500"
          />
          <select
            value={item.type}
            onChange={(e) => updateItem(i, 'type', e.target.value)}
            className="px-2 py-1 text-xs bg-slate-800 border border-slate-600 rounded text-slate-200 focus:outline-none focus:border-primary-500"
          >
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
          <button
            onClick={() => removeItem(i)}
            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
            title="Remove link"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={addItem}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
        >
          <Plus className="w-3 h-3" /> Add link
        </button>
        <div className="flex-1" />
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1 text-slate-500 hover:text-slate-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            const cleaned = items.filter(it => it.label.trim() && it.url.trim());
            onSave(cleaned);
          }}
          className="text-xs px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
        >
          Save links
        </button>
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
  calendars,
  onUpdateCalendar,
  autoMapEnabled,
  onAutoMapToggle,
  foundationalContext,
}: {
  strategy: NewsletterStrategy;
  posts: NewsletterPost[];
  titles: NewsletterTitle[];
  contentTypes: NewsletterContentTypeConfig[];
  onCreatePost: (data: Partial<NewsletterPost>) => void;
  onUpdatePost: (id: string, updates: Partial<NewsletterPost>) => void;
  onDeletePost: (id: string) => void;
  calendars: NewsletterCalendar[];
  onUpdateCalendar: (id: string, updates: Partial<NewsletterCalendar>) => void;
  autoMapEnabled: boolean;
  onAutoMapToggle: () => void;
  foundationalContext?: FoundationalContext;
}) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [generatingPostId, setGeneratingPostId] = useState<string | null>(null);
  const [schedulingPostId, setSchedulingPostId] = useState<string | null>(null);
  const [aiFallbackNotice, setAiFallbackNotice] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; subjectLine: string; previewText: string; content: string }>({ title: '', subjectLine: '', previewText: '', content: '' });
  const [editingBacklinks, setEditingBacklinks] = useState<string | null>(null); // section ID being backlink-edited
  const [editingLogo, setEditingLogo] = useState<string | null>(null); // post ID being logo-edited
  const [logoInput, setLogoInput] = useState('');
  const selectedPost = posts.find((p) => p.id === selectedPostId);
  const activeCalendar = calendars[0];

  const handleCopyContent = async (post: NewsletterPost) => {
    const text = post.sections && post.sections.length > 0
      ? post.sections.map((s) => {
          const prefix = s.type === 'heading' ? '## ' : s.type === 'subheading' ? '### ' : s.type === 'quote' ? '> ' : s.type === 'cta' ? '➤ ' : s.type === 'image' ? '🖼 ' : s.type === 'list' ? '' : '';
          const ctaUrl = s.type === 'cta' && s.backlinks && s.backlinks.length > 0 ? ` (${s.backlinks[0].url})` : '';
          const backlinks = s.backlinks && s.backlinks.length > 0 && s.type !== 'cta'
            ? '\n' + s.backlinks.map(b => `  → ${b.label}: ${b.url}`).join('\n')
            : '';
          return `${prefix}${s.content}${ctaUrl}${backlinks}`;
        }).join('\n\n')
      : post.content || '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2000);
    }
  };

  // Update backlinks for a specific section within a post
  const handleUpdateSectionBacklinks = (postId: string, sectionId: string, backlinks: NewsletterSection['backlinks']) => {
    const post = posts.find(p => p.id === postId);
    if (!post || !post.sections) return;
    const updatedSections = post.sections.map(sec =>
      sec.id === sectionId ? { ...sec, backlinks } : sec
    );
    onUpdatePost(postId, { sections: updatedSections });
  };

  const findPostCalendarSlot = (postId: string) => {
    if (!activeCalendar) return undefined;
    return activeCalendar.timeline.find((item) => item.postId === postId);
  };

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

    // Auto-map to next empty calendar slot
    if (autoMapEnabled && activeCalendar) {
      const emptySlot = activeCalendar.timeline.find((item) => item.status === 'empty');
      if (emptySlot) {
        const updatedTimeline = activeCalendar.timeline.map((item) =>
          item.id === emptySlot.id
            ? { ...item, titleId: title.id, status: 'planned' as const }
            : item
        );
        onUpdateCalendar(activeCalendar.id, { timeline: updatedTimeline });
      }
    }
  };

  const handleSchedulePost = (postId: string, slotId: string) => {
    if (!activeCalendar) return;

    const updatedTimeline = activeCalendar.timeline.map((item) => {
      // Remove post from old slot if it was assigned
      if (item.postId === postId) {
        return { ...item, postId: undefined, titleId: undefined, status: 'empty' as const };
      }
      // Assign to new slot
      if (item.id === slotId) {
        const post = posts.find((p) => p.id === postId);
        return {
          ...item,
          postId,
          titleId: post?.titleId,
          status: 'assigned' as const,
        };
      }
      return item;
    });

    onUpdateCalendar(activeCalendar.id, { timeline: updatedTimeline });
    onUpdatePost(postId, { calendarId: activeCalendar.id });
    setSchedulingPostId(null);
  };

  const handleUnschedulePost = (postId: string) => {
    if (!activeCalendar) return;

    const updatedTimeline = activeCalendar.timeline.map((item) => {
      if (item.postId === postId) {
        return { ...item, postId: undefined, titleId: undefined, status: 'empty' as const };
      }
      return item;
    });

    onUpdateCalendar(activeCalendar.id, { timeline: updatedTimeline });
    onUpdatePost(postId, { calendarId: undefined });
  };

  const handleDeletePost = (postId: string) => {
    // Clear calendar slot before deleting the post
    if (activeCalendar) {
      const slotHasPost = activeCalendar.timeline.some((item) => item.postId === postId);
      if (slotHasPost) {
        const updatedTimeline = activeCalendar.timeline.map((item) => {
          if (item.postId === postId) {
            return { ...item, postId: undefined, titleId: undefined, status: 'empty' as const };
          }
          return item;
        });
        onUpdateCalendar(activeCalendar.id, { timeline: updatedTimeline });
      }
    }
    if (selectedPostId === postId) setSelectedPostId(null);
    onDeletePost(postId);
  };

  const handleGenerateContent = async (post: NewsletterPost) => {
    setGeneratingPostId(post.id);
    setAiFallbackNotice(null);

    const titleData = titles.find((t) => t.id === post.titleId);
    const contentTypeInfo = contentTypes.find((t) => t.type === post.contentType) || DEFAULT_CONTENT_TYPES.find((t) => t.type === post.contentType);

    const objectiveLabel = strategy.objective || 'education';
    const toneLabel = strategy.communicationTone || 'professional';
    const depthLabel = strategy.contentDepth || 'standard';
    const audienceLabel = strategy.audience || 'general professionals';

    const cta = post.suggestedCTA || contentTypeInfo?.ctaStrategy || 'Learn more';
    const depthHint = depthLabel === 'brief' ? '150-300 words total, 4-6 sections'
      : depthLabel === 'deep' ? '800-1500 words total, 8-12 sections'
      : depthLabel === 'comprehensive' ? '1500-2500 words total, 10-15 sections'
      : '400-800 words total, 6-10 sections';

    // Build foundational context from linked data
    const linkedCtx = foundationalContext;
    const contextParts: string[] = [];
    if (linkedCtx?.businessProfile) {
      const bp = linkedCtx.businessProfile;
      contextParts.push(`BUSINESS: ${bp.name || bp.companyName || 'N/A'}${bp.primaryIndustry ? `, Industry: ${bp.primaryIndustry}` : ''}${bp.description ? `, Description: ${bp.description}` : ''}${bp.usp ? `, USP: ${bp.usp}` : ''}`);
    }
    if (linkedCtx?.founders && linkedCtx.founders.length > 0) {
      contextParts.push(`FOUNDERS: ${linkedCtx.founders.map((f: any) => `${f.name}${f.title ? ` (${f.title})` : ''}`).join(', ')}`);
    }
    if (linkedCtx?.icps && linkedCtx.icps.length > 0) {
      contextParts.push(`ICPs: ${linkedCtx.icps.map((i: any) => `${i.name}${i.industry ? ` (${i.industry})` : ''}`).join(', ')}`);
    }
    if (linkedCtx?.personas && linkedCtx.personas.length > 0) {
      contextParts.push(`PERSONAS: ${linkedCtx.personas.map((p: any) => `${p.name}${p.jobTitle ? ` (${p.jobTitle})` : ''}`).join(', ')}`);
    }
    if (linkedCtx?.products && linkedCtx.products.length > 0) {
      contextParts.push(`PRODUCTS: ${linkedCtx.products.map((p: any) => `${p.name}${p.category ? ` (${p.category})` : ''}`).join(', ')}`);
    }
    if (linkedCtx?.productCategories && linkedCtx.productCategories.length > 0) {
      contextParts.push(`PRODUCT CATEGORIES: ${linkedCtx.productCategories.map((c: any) => c.name).join(', ')}`);
    }
    if (linkedCtx?.competitors && linkedCtx.competitors.length > 0) {
      contextParts.push(`COMPETITORS: ${linkedCtx.competitors.map((c: any) => c.name).join(', ')}`);
    }
    if (linkedCtx?.brandAssets && linkedCtx.brandAssets.length > 0) {
      contextParts.push(`BRAND ASSETS: ${linkedCtx.brandAssets.map((a: any) => `${a.name} (${a.type})`).join(', ')}`);
    }
    if (linkedCtx?.brandStrategy) {
      const bs = linkedCtx.brandStrategy;
      contextParts.push(`BRAND STRATEGY: ${bs.brandName || 'Brand'}${bs.brandArchetype ? `, Archetype: ${bs.brandArchetype}` : ''}${bs.brandVoice ? `, Voice: ${bs.brandVoice}` : ''}`);
    }
    if (linkedCtx?.visualIdentity) {
      const vi = linkedCtx.visualIdentity;
      contextParts.push(`VISUAL IDENTITY: ${vi.primaryColor ? `Primary Color: ${vi.primaryColor}` : ''}${vi.headingFont ? `, Fonts: ${vi.headingFont}/${vi.bodyFont}` : ''}`);
    }
    if (linkedCtx?.salesCollateral && linkedCtx.salesCollateral.length > 0) {
      contextParts.push(`SALES COLLATERAL: ${linkedCtx.salesCollateral.map((s: any) => s.name || s.title).join(', ')}`);
    }
    const linkedContextStr = contextParts.length > 0 ? `\n\nLinked Data Context:\n${contextParts.join('\n')}` : '';

    // Get the template for this content type
    const template = getTemplateForContentType(post.contentType || 'educational');
    const templatePromptGuidance = buildTemplatePromptGuidance(template);

    const prompt = `Generate a COMPLETE newsletter as JSON for: "${post.title}"
Type: ${post.contentType || 'educational'} | CTA: "${cta}" | Tone: ${toneLabel}

${templatePromptGuidance}

${titleData ? `Keywords: ${titleData.suggestedKeywords?.join(', ') || 'N/A'}` : ''}

${linkedContextStr}

OUTPUT: JSON array. Each element: {"type":"heading|subheading|paragraph|list|quote|cta|image","content":"...","order":1..N}
For image sections, include: {"type":"image","content":"[description]","imageType":"hero|feature|product|team|event|banner","alt":"[alt text]","caption":"[optional caption]","imageLayout":"full-width|card|inline","order":N}
For sections with links, include backlinks: {"type":"list","content":"...","order":N,"backlinks":[{"label":"Link text","url":"https://...","type":"internal|external"}]}
Add 1-3 backlinks to CTA and list sections where relevant. Use "internal" for same-site links, "external" for outside links.
NO markdown. NO explanation. ONLY the JSON array.

CRITICAL RULES — VIOLATION = REJECTED:
1. MINIMUM ${template.flowRules.minSections} sections. Generate ALL required sections. Output fewer = rejected.
2. heading: MAX 6 words. One punchy line.
3. subheading: MAX 8 words. One idea.
4. paragraph: MAX ${template.flowRules.maxParagraphLength} words. ONE sentence per paragraph. No compound sentences.
5. list: 2-4 bullet items. Each item MAX 10 words. Format: **Key** — Detail. Separate items with \\n.
6. quote: MAX 20 words. Include attribution.
7. cta: MAX 6 words. Action verb first.
8. Use MORE list sections than paragraph sections. At least 3 list sections.
9. NEVER write long paragraphs. If a thought exceeds ${template.flowRules.maxParagraphLength} words, split into a list.
10. Each section must contain SUBSTANCE — never output bare questions or one-word sections.
11. MUST include a heading as section 1 and a cta as the last or second-to-last section.

FULL EXAMPLE (educational, 9 sections):
[{"type":"heading","content":"AI Weekly — Issue 47","order":1},{"type":"paragraph","content":"This week: how small teams use AI to ship 3x faster, plus 5 tools you can try today.","order":2},{"type":"subheading","content":"Why AI Adoption Accelerated","order":3},{"type":"list","content":"**Copilot coding** — 40% faster pull requests\\n**Auto-testing** — Catches bugs before review\\n**Smart scheduling** — Reduces meeting time 60%","order":4},{"type":"paragraph","content":"Teams using these tools report shipping features in days, not weeks.","order":5},{"type":"quote","content":"\"We cut our sprint cycle from 2 weeks to 3 days.\" — Sarah Chen, CTO at Buildr","order":6},{"type":"list","content":"**LangChain** — Build AI agents visually\\n**Cursor** — AI-first code editor\\n**Replit** — Deploy AI apps in minutes","order":7},{"type":"cta","content":"Explore the Full Guide","order":8},{"type":"paragraph","content":"Next week: AI in design workflows. Stay tuned and keep building.","order":9}]

Generate ${template.flowRules.minSections}+ sections now:`;

    try {
      console.log('[NewsletterContentOS] Calling AI for content generation...');
      const response = await aiApi.generate({
        prompt,
        maxTokens: 6000,
        context: {
          systemPrompt: `You write COMPLETE newsletters as JSON arrays for a ${template.name}. MINIMUM ${template.flowRules.minSections} sections — never fewer. Each section is a card: headings max 6 words, paragraphs max ${template.flowRules.maxParagraphLength} words and ONE sentence only, lists use **bold key** — detail format with 2-4 items, CTAs max 6 words. Prefer lists over paragraphs (at least 3 list sections). No walls of text. No compound sentences. No bare questions. Every section must have substance. Tone: ${template.design.tone}. Output ONLY valid JSON.`,
        },
      });

      console.log('[NewsletterContentOS] Content AI response:', { status: response.status, error: response.error, hasData: !!response.data });

      if (response.error || !response.data) {
        console.error('[NewsletterContentOS] AI response error:', response.error, 'status:', response.status);
        throw new Error(response.error || 'AI content generation returned no data');
      }

      const aiResult = response.data as any;
      let rawContent: string = aiResult.content || '';
      if (typeof rawContent !== 'string') {
        rawContent = JSON.stringify(rawContent);
      }

      rawContent = rawContent.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      console.log('[NewsletterContentOS] Raw AI content length:', rawContent.length, 'first 200 chars:', rawContent.substring(0, 200));

      let parsed: any[];
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        const match = rawContent.match(/\[[\s\S]*\]/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error('Could not parse AI content response as JSON');
        }
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('AI response is not a valid sections array');
      }

      const validTypes = ['heading', 'subheading', 'paragraph', 'list', 'quote', 'cta', 'image'];

      // Strict word limit enforcement per section type
      const maxWords: Record<string, number> = {
        heading: 8,
        subheading: 10,
        paragraph: template.flowRules.maxParagraphLength,
        list: 80, // total for all items
        quote: 25,
        cta: 8,
      };

      const truncateToWords = (text: string, maxWords: number): string => {
        const words = text.split(/\s+/);
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ').replace(/[.,;:!?]+$/, '') + '.';
      };

      // Split long paragraphs into separate sections for scannability
      const splitLongParagraphs = (sections: any[]): any[] => {
        const result: any[] = [];
        let orderOffset = 0;
        for (const s of sections) {
          if (s.type === 'paragraph') {
            const sentences = s.content.split(/(?<=[.!?])\s+/).filter((sent: string) => sent.trim().length > 0);
            if (sentences.length > 1 && s.content.split(/\s+/).length > maxWords.paragraph) {
              // First sentence stays as paragraph, rest become list items
              result.push({ ...s, content: sentences[0], order: s.order + orderOffset });
              orderOffset++;
              const listItems = sentences.slice(1).map((sent: string) => `**${sent.split(/\s+/).slice(0, 2).join(' ')}** — ${sent.split(/\s+/).slice(2).join(' ')}`).join('\n');
              result.push({ id: `${s.id}-list`, type: 'list', content: listItems, order: s.order + orderOffset });
            } else {
              result.push(s);
            }
          } else {
            result.push(s);
          }
        }
        return result;
      };

      let sections: NewsletterSection[] = parsed
        .filter((s: any) => s.type && s.content && validTypes.includes(s.type))
        .map((s: any, i: number) => {
          let content = String(s.content).trim();
          // Image sections don't have word limits on content (it's alt/caption text)
          if (s.type !== 'image') {
            const limit = maxWords[s.type] || template.flowRules.maxParagraphLength;
            content = truncateToWords(content, limit);
          }
          const section: NewsletterSection = {
            id: `sec-${Date.now()}-${i + 1}`,
            type: s.type as NewsletterSection['type'],
            content,
            order: s.order ?? (i + 1),
          };
          // Pass through image fields if present
          if (s.type === 'image') {
            if (s.imageType) section.imageType = s.imageType;
            if (s.src) section.src = s.src;
            if (s.alt) section.alt = s.alt;
            if (s.caption) section.caption = s.caption;
            if (s.imageLayout) section.imageLayout = s.imageLayout;
            if (s.imagePosition) section.imagePosition = s.imagePosition;
            if (s.imagePriority) section.imagePriority = s.imagePriority;
          }
          // Pass through backlinks if present
          if (s.backlinks && Array.isArray(s.backlinks) && s.backlinks.length > 0) {
            section.backlinks = s.backlinks.map((bl: any) => ({
              label: String(bl.label || ''),
              url: String(bl.url || ''),
              type: bl.type === 'external' ? 'external' : 'internal',
            }));
          }
          return section;
        });

      // Split long paragraphs into shorter sections
      sections = splitLongParagraphs(sections);

      // Re-sort and re-number after potential splitting
      sections = sections
        .sort((a: NewsletterSection, b: NewsletterSection) => a.order - b.order)
        .map((s, i) => ({ ...s, order: i + 1 }));

      // ----- Post-generation validation & auto-expansion -----
      // Ensure minimum section count and structural completeness
      const minSections = template.flowRules.minSections;
      const hasHeading = sections.some(s => s.type === 'heading');
      const hasCta = sections.some(s => s.type === 'cta');
      const hasList = sections.some(s => s.type === 'list');
      const title = post.title || 'Newsletter';

      // Auto-expand if below minimum sections
      if (sections.length < minSections) {
        const expansionSections: NewsletterSection[] = [];
        let nextOrder = sections.length + 1;

        // Add heading if missing
        if (!hasHeading) {
          expansionSections.push({
            id: `expand-${Date.now()}-0`,
            type: 'heading',
            content: title,
            order: 1,
          });
        }

        // Add list if missing (newsletter without a list is too thin)
        if (!hasList) {
          expansionSections.push({
            id: `expand-${Date.now()}-${nextOrder}`,
            type: 'list',
            content: `**${title}** — Key highlights this week\n**What changed** — Important updates you should know\n**Why it matters** — Impact on your workflow`,
            order: nextOrder,
          });
          nextOrder++;
        }

        // Add supporting content to reach minimum
        if (sections.length + expansionSections.length < minSections) {
          expansionSections.push({
            id: `expand-${Date.now()}-${nextOrder}`,
            type: 'paragraph',
            content: `Here's what makes ${title.toLowerCase()} worth your attention this week.`,
            order: nextOrder,
          });
          nextOrder++;
        }

        if (sections.length + expansionSections.length < minSections) {
          expansionSections.push({
            id: `expand-${Date.now()}-${nextOrder}`,
            type: 'quote',
            content: `"This is transforming how teams work." — Industry Expert`,
            order: nextOrder,
          });
          nextOrder++;
        }

        // Add CTA if missing
        if (!hasCta) {
          expansionSections.push({
            id: `expand-${Date.now()}-${nextOrder}`,
            type: 'cta',
            content: post.suggestedCTA || 'Learn More',
            order: nextOrder + 1,
          });
        }

        sections = [...sections, ...expansionSections];
        // Re-sort by order and re-number
        sections = sections
          .sort((a, b) => a.order - b.order)
          .map((s, i) => ({ ...s, order: i + 1 }));
      }

      // Ensure heading exists at position 1
      if (!sections.some(s => s.type === 'heading')) {
        sections.unshift({
          id: `expand-${Date.now()}-heading`,
          type: 'heading',
          content: title,
          order: 1,
        });
        sections = sections.map((s, i) => ({ ...s, order: i + 1 }));
      }

      // Ensure CTA exists at the end
      if (!sections.some(s => s.type === 'cta')) {
        sections.push({
          id: `expand-${Date.now()}-cta`,
          type: 'cta',
          content: post.suggestedCTA || 'Learn More',
          order: sections.length + 1,
        });
        sections = sections.map((s, i) => ({ ...s, order: i + 1 }));
      }

      // Enforce minimum list count (at least 2 lists for scannability)
      const listCount = sections.filter(s => s.type === 'list').length;
      if (listCount < 2) {
        const needed = 2 - listCount;
        for (let i = 0; i < needed; i++) {
          const ctaOrder = sections.find(s => s.type === 'cta')?.order || sections.length + 1;
          const insertBefore = ctaOrder;
          const newSection: NewsletterSection = {
            id: `expand-${Date.now()}-list-${i}`,
            type: 'list',
            content: i === 0
              ? `**${title}** — Why this matters now\n**Key benefit** — What you gain\n**Next step** — How to get started`
              : `**Trend one** — Brief context and impact\n**Trend two** — What to watch for\n**Trend three** — How to prepare`,
            order: insertBefore,
          };
          sections.push(newSection);
        }
        sections = sections
          .sort((a, b) => a.order - b.order)
          .map((s, i) => ({ ...s, order: i + 1 }));
      }

      if (sections.length === 0) {
        throw new Error('AI generated no valid sections');
      }

      const content = sections.map((s) => {
        const prefix = s.type === 'heading' ? '## ' : s.type === 'subheading' ? '### ' : s.type === 'quote' ? '> ' : s.type === 'cta' ? '➤ ' : s.type === 'image' ? '🖼 ' : '';
        return `${prefix}${s.content}`;
      }).join('\n\n');

      onUpdatePost(post.id, {
        status: 'draft',
        content,
        sections,
      });
      setGeneratingPostId(null);

      console.log('[NewsletterContentOS] SUCCESS — AI generated', sections.length, 'sections via', aiResult.provider, '/', aiResult.model);

      // Auto-map to next empty calendar slot after generation
      if (autoMapEnabled && activeCalendar) {
        const emptySlot = activeCalendar.timeline.find(
          (item) => item.status === 'empty' || (item.status === 'planned' && item.titleId === post.titleId && !item.postId)
        );
        if (emptySlot) {
          const updatedTimeline = activeCalendar.timeline.map((item) =>
            item.id === emptySlot.id
              ? { ...item, postId: post.id, titleId: post.titleId || item.titleId, status: 'assigned' as const }
              : item
          );
          onUpdateCalendar(activeCalendar.id, { timeline: updatedTimeline });
        }
      }
    } catch (error) {
      console.error('[NewsletterContentOS] AI content generation FAILED — falling back to template. Error:', error);
      setAiFallbackNotice('AI generation unavailable. Showing template-based content — edit it to customize.');

      // Fallback to template-aware content with real placeholder content
      const fallbackTemplate = getTemplateForContentType(post.contentType || 'educational');
      const fallbackTitle = post.title || 'Newsletter';
      const fallbackContentMap: Record<string, string> = {
        'heading': fallbackTitle,
        'subheading': `${fallbackTitle} — Key Highlights`,
        'paragraph': `Here's what you need to know about ${fallbackTitle.toLowerCase()} this week.`,
        'list': `**Key insight** — Important update worth knowing\n**Why it matters** — Impact on your workflow\n**Next step** — How to get started`,
        'quote': `"This is transforming how teams work." — Industry Expert`,
        'cta': post.suggestedCTA || 'Learn More',
        'image': '',
      };
      const fallbackSections: NewsletterSection[] = fallbackTemplate.sections
        .filter(sec => sec.required || fallbackTemplate.sections.indexOf(sec) < fallbackTemplate.flowRules.minSections)
        .map((sec, i) => ({
          id: `sec-${Date.now()}-${i + 1}`,
          type: sec.outputType,
          content: sec.outputType === 'heading' ? fallbackTitle
            : sec.outputType === 'cta' ? (post.suggestedCTA || 'Learn More')
            : fallbackContentMap[sec.outputType] || sec.label,
          order: i + 1,
        }));

      const content = fallbackSections.map((s) => {
        const prefix = s.type === 'heading' ? '## ' : s.type === 'subheading' ? '### ' : s.type === 'quote' ? '> ' : s.type === 'cta' ? '➤ ' : s.type === 'image' ? '🖼 ' : '';
        return `${prefix}${s.content}`;
      }).join('\n\n');
      onUpdatePost(post.id, {
        status: 'draft',
        content,
        sections: fallbackSections,
      });
      setGeneratingPostId(null);

      // Auto-map to next empty calendar slot after generation (fallback too)
      if (autoMapEnabled && activeCalendar) {
        const emptySlot = activeCalendar.timeline.find(
          (item) => item.status === 'empty' || (item.status === 'planned' && item.titleId === post.titleId && !item.postId)
        );
        if (emptySlot) {
          const updatedTimeline = activeCalendar.timeline.map((item) =>
            item.id === emptySlot.id
              ? { ...item, postId: post.id, titleId: post.titleId || item.titleId, status: 'assigned' as const }
              : item
          );
          onUpdateCalendar(activeCalendar.id, { timeline: updatedTimeline });
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {aiFallbackNotice && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-amber-400">AI Unavailable</div>
            <div className="text-sm text-slate-400 mt-1">{aiFallbackNotice} Click the generate button on any post to retry.</div>
          </div>
          <button onClick={() => setAiFallbackNotice(null)} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Content Pipeline</h3>
            <p className="text-sm text-slate-400 mt-1">{posts.length} newsletters in pipeline</p>
          </div>
          <button
            onClick={onAutoMapToggle}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
              autoMapEnabled
                ? 'bg-primary-500/20 text-primary-400 border-primary-500/40 hover:bg-primary-500/30'
                : 'bg-slate-700/50 text-slate-400 border-slate-600 hover:bg-slate-700 hover:text-slate-300'
            )}
            title={autoMapEnabled ? 'Auto-Map is ON: Newsletters will be automatically mapped to calendar slots' : 'Auto-Map is OFF: Manually schedule newsletters on the calendar'}
          >
            <Zap className={cn('w-3.5 h-3.5', autoMapEnabled && 'text-primary-400')} />
            Auto-Map
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded',
              autoMapEnabled ? 'bg-primary-500/30 text-primary-300' : 'bg-slate-600 text-slate-500'
            )}>
              {autoMapEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {titles.filter((t) => t.status === 'selected' && !posts.some((p) => p.titleId === t.id)).length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Create Newsletters from Selected Titles</h3>
          <div className="space-y-2">
            {titles
              .filter((t) => t.status === 'selected' && !posts.some((p) => p.titleId === t.id))
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
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">{getTemplateForContentType(post.contentType || 'educational').name}</span>
                    {(() => {
                      const slot = findPostCalendarSlot(post.id);
                      if (slot) {
                        return (
                          <span className="text-xs text-primary-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(slot.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                      disabled={generatingPostId === post.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      {generatingPostId === post.id ? 'Generating...' : 'Generate'}
                    </button>
                  )}
                  {(() => {
                    const slot = findPostCalendarSlot(post.id);
                    if (slot) {
                      return (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSchedulingPostId(post.id);
                            }}
                            className="flex items-center gap-1 px-2 py-1.5 text-primary-400 hover:text-primary-300 border border-primary-500/30 hover:border-primary-500/50 rounded-lg text-xs transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Reschedule
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnschedulePost(post.id);
                            }}
                            className="flex items-center gap-1 px-2 py-1.5 text-slate-400 hover:text-red-400 border border-slate-600 hover:border-red-500/30 rounded-lg text-xs transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Unschedule
                          </button>
                        </>
                      );
                    }
                    if (activeCalendar) {
                      return (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSchedulingPostId(post.id);
                          }}
                          className="flex items-center gap-1 px-2 py-1.5 text-slate-300 hover:text-primary-400 border border-slate-600 hover:border-primary-500/30 rounded-lg text-xs transition-colors"
                        >
                          <Calendar className="w-3 h-3" />
                          Schedule
                        </button>
                      );
                    }
                    return null;
                  })()}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedPostId === post.id && (
                <div className="border-t border-slate-700 p-4 space-y-4">
                  {editingPostId === post.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject Line</label>
                          <input
                            type="text"
                            value={editForm.subjectLine}
                            onChange={(e) => setEditForm((f) => ({ ...f, subjectLine: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Preview Text</label>
                        <input
                          type="text"
                          value={editForm.previewText}
                          onChange={(e) => setEditForm((f) => ({ ...f, previewText: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                          placeholder="Short preview shown in email clients"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Content</label>
                        <p className="text-xs text-slate-500 mb-1">Use ## for headings, ### for subheadings, &gt; for quotes, ➤ for CTAs, 🖼 for images. Separate sections with blank lines.</p>
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                          rows={12}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500 transition-colors resize-y"
                          placeholder="Newsletter body content"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            // Re-parse content into sections so the structured view stays in sync
                            const editedContent = editForm.content;
                            const editedSections: NewsletterSection[] = editedContent
                              ? editedContent.split(/\n\n+/).filter(Boolean).map((block, i) => {
                                  const trimmed = block.trim();
                                  // Detect section type from prefix markers
                                  if (trimmed.startsWith('## ')) {
                                    return { id: `edit-${Date.now()}-${i}`, type: 'heading' as const, content: trimmed.replace(/^##\s*/, ''), order: i + 1 };
                                  }
                                  if (trimmed.startsWith('### ')) {
                                    return { id: `edit-${Date.now()}-${i}`, type: 'subheading' as const, content: trimmed.replace(/^###\s*/, ''), order: i + 1 };
                                  }
                                  if (trimmed.startsWith('> ')) {
                                    return { id: `edit-${Date.now()}-${i}`, type: 'quote' as const, content: trimmed.replace(/^>\s*/, ''), order: i + 1 };
                                  }
                                  if (trimmed.startsWith('➤ ')) {
                                    return { id: `edit-${Date.now()}-${i}`, type: 'cta' as const, content: trimmed.replace(/^➤\s*/, ''), order: i + 1 };
                                  }
                                  if (trimmed.startsWith('🖼 ') || trimmed.startsWith('[Image:')) {
                                    const imgContent = trimmed.startsWith('🖼 ') ? trimmed.replace(/^🖼\s*/, '') : trimmed.replace(/^\[Image:\s*/, '').replace(/\]$/, '');
                                    return { id: `edit-${Date.now()}-${i}`, type: 'image' as const, content: imgContent, alt: imgContent, order: i + 1 };
                                  }
                                  if (trimmed.includes('\n') && trimmed.split('\n').every(line => line.startsWith('- ') || line.startsWith('• ') || line.startsWith('**') || /^[A-Z]/.test(line))) {
                                    return { id: `edit-${Date.now()}-${i}`, type: 'list' as const, content: trimmed, order: i + 1 };
                                  }
                                  return { id: `edit-${Date.now()}-${i}`, type: 'paragraph' as const, content: trimmed, order: i + 1 };
                                })
                              : [];
                            onUpdatePost(post.id, {
                              title: editForm.title,
                              subjectLine: editForm.subjectLine,
                              previewText: editForm.previewText,
                              content: editedContent,
                              sections: editedSections.length > 0 ? editedSections : undefined,
                            });
                            setEditingPostId(null);
                          }}
                          className="flex items-center gap-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingPostId(null)}
                          className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {post.content && (
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-slate-300">Content Preview</h4>
                            <button
                              onClick={() => handleCopyContent(post)}
                              className={cn(
                                'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                                copiedPostId === post.id
                                  ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                                  : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:text-slate-200 hover:bg-slate-700 hover:border-slate-500'
                              )}
                            >
                              {copiedPostId === post.id ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {(() => {
                              const logoAsset = foundationalContext?.allBrandAssets?.find((a: any) => a.type === 'logo' && (a.url || a.base64Data));
                              const brandLogo = post.logoUrl || logoAsset?.url || logoAsset?.base64Data;
                              return (
                                <div className="flex items-center gap-3 mb-2 group">
                                  {brandLogo ? (
                                    <img src={brandLogo} alt="Logo" className="h-12 max-w-[200px] object-contain" />
                                  ) : (
                                    <div className="h-12 w-[200px] bg-slate-800/50 border border-dashed border-slate-600 rounded-lg flex items-center justify-center">
                                      <span className="text-xs text-slate-500">No logo</span>
                                    </div>
                                  )}
                                  <button
                                    onClick={() => { setEditingLogo(editingLogo === post.id ? null : post.id); setLogoInput(post.logoUrl || ''); }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 bg-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded border border-slate-600 flex items-center gap-1"
                                  >
                                    <Pencil className="w-3 h-3" />
                                    {brandLogo ? 'Change' : 'Add logo'}
                                  </button>
                                </div>
                              );
                            })()}
                            {editingLogo === post.id && (
                              <div className="flex items-center gap-2 mb-2 p-2 bg-slate-900/80 border border-slate-600/50 rounded-lg">
                                <input
                                  type="url"
                                  value={logoInput}
                                  onChange={(e) => setLogoInput(e.target.value)}
                                  placeholder="Paste logo URL (https://...)"
                                  className="flex-1 px-2 py-1.5 text-xs bg-slate-800 border border-slate-600 rounded text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary-500"
                                />
                                <button
                                  onClick={() => { onUpdatePost(post.id, { logoUrl: logoInput || undefined }); setEditingLogo(null); }}
                                  className="text-xs px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
                                >
                                  Save
                                </button>
                                {post.logoUrl && (
                                  <button
                                    onClick={() => { onUpdatePost(post.id, { logoUrl: undefined }); setLogoInput(''); setEditingLogo(null); }}
                                    className="text-xs px-2 py-1.5 text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    Remove
                                  </button>
                                )}
                                <button onClick={() => setEditingLogo(null)} className="text-xs px-2 py-1.5 text-slate-500 hover:text-slate-300 transition-colors">
                                  Cancel
                                </button>
                              </div>
                            )}
                            {(post.sections && post.sections.length > 0
                              ? post.sections
                              : post.content
                                ? post.content.split('\n\n').map((p, i) => ({ id: `plain-${i}`, type: 'paragraph' as const, content: p, order: i }))
                                : []
                            ).map((section) => {
                              const sec = section as NewsletterSection;
                              if (sec.type === 'heading') return (
                                <div key={sec.id} className="bg-slate-800/60 border-l-2 border-l-[#C8FF2E] rounded-r-lg px-4 py-3">
                                  <h3 className="text-lg font-bold text-white leading-snug">{sec.content}</h3>
                                </div>
                              );
                              if (sec.type === 'subheading') return (
                                <div key={sec.id} className="bg-slate-800/40 rounded-lg px-4 py-2.5">
                                  <p className="text-sm font-semibold text-slate-200">{sec.content}</p>
                                </div>
                              );
                              if (sec.type === 'list') return (
                                <div key={sec.id} className="bg-slate-800/30 rounded-lg px-4 py-3 border border-slate-700/50">
                                  <ul className="space-y-1.5">
                                    {sec.content.split(/\n/).filter(Boolean).map((item, j) => (
                                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                                        <span className="text-[#C8FF2E] mt-1.5 shrink-0">•</span>
                                        <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700/50">
                                    {(sec.backlinks && sec.backlinks.length > 0) ? (
                                      <>
                                        {sec.backlinks.map((bl, bi) => (
                                          <a key={bi} href={bl.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 transition-colors">
                                            <ExternalLink className="w-2.5 h-2.5" />
                                            {bl.label}
                                          </a>
                                        ))}
                                        <button onClick={() => setEditingBacklinks(editingBacklinks === sec.id ? null : sec.id)} className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700/50 text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors">
                                          <Pencil className="w-2.5 h-2.5 inline -mt-0.5" /> Edit
                                        </button>
                                      </>
                                    ) : (
                                      <button onClick={() => setEditingBacklinks(editingBacklinks === sec.id ? null : sec.id)} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-500 hover:text-primary-400 hover:bg-slate-700 transition-colors flex items-center gap-1">
                                        <Link2 className="w-2.5 h-2.5" /> Add links
                                      </button>
                                    )}
                                  </div>
                                  {editingBacklinks === sec.id && (
                                    <BacklinkEditor
                                      backlinks={sec.backlinks || []}
                                      onSave={(backlinks) => { handleUpdateSectionBacklinks(post.id, sec.id, backlinks); setEditingBacklinks(null); }}
                                      onCancel={() => setEditingBacklinks(null)}
                                    />
                                  )}
                                </div>
                              );
                              if (sec.type === 'quote') return (
                                <div key={sec.id} className="bg-slate-800/30 rounded-lg px-4 py-3 border-l-2 border-slate-500 italic">
                                  <p className="text-sm text-slate-300 leading-relaxed">{sec.content}</p>
                                </div>
                              );
                              if (sec.type === 'cta') return (
                                <div key={sec.id} className="bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 rounded-lg px-4 py-3">
                                  <div className="flex items-center justify-center">
                                    {sec.backlinks && sec.backlinks.length > 0 ? (
                                      <a href={sec.backlinks[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#C8FF2E] tracking-wide hover:text-[#C8FF2E]/80 transition-colors">
                                        {sec.content}
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    ) : (
                                      <span className="text-sm font-bold text-[#C8FF2E] tracking-wide">{sec.content}</span>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-[#C8FF2E]/20">
                                    {(sec.backlinks && sec.backlinks.length > 0) ? (
                                      <>
                                        {sec.backlinks.map((bl, bi) => (
                                          <a key={bi} href={bl.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/20 hover:bg-[#C8FF2E]/20 transition-colors">
                                            <ExternalLink className="w-2.5 h-2.5" />
                                            {bl.label}
                                          </a>
                                        ))}
                                        <button onClick={() => setEditingBacklinks(editingBacklinks === sec.id ? null : sec.id)} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C8FF2E]/5 text-[#C8FF2E]/60 hover:text-[#C8FF2E] hover:bg-[#C8FF2E]/15 transition-colors">
                                          <Pencil className="w-2.5 h-2.5 inline -mt-0.5" /> Edit
                                        </button>
                                      </>
                                    ) : (
                                      <button onClick={() => setEditingBacklinks(editingBacklinks === sec.id ? null : sec.id)} className="text-[10px] px-2 py-0.5 rounded-full bg-[#C8FF2E]/5 text-[#C8FF2E]/60 hover:text-[#C8FF2E] hover:bg-[#C8FF2E]/15 transition-colors flex items-center gap-1">
                                        <Link2 className="w-2.5 h-2.5" /> Add links
                                      </button>
                                    )}
                                  </div>
                                  {editingBacklinks === sec.id && (
                                    <BacklinkEditor
                                      backlinks={sec.backlinks || []}
                                      onSave={(backlinks) => { handleUpdateSectionBacklinks(post.id, sec.id, backlinks); setEditingBacklinks(null); }}
                                      onCancel={() => setEditingBacklinks(null)}
                                    />
                                  )}
                                </div>
                              );
                              if (sec.type === 'image') return (
                                <div key={sec.id} className={`${sec.imageLayout === 'full-width' ? '' : 'max-w-xs mx-auto'} bg-slate-800/40 rounded-lg overflow-hidden border border-slate-700/50`}>
                                  {sec.src ? (
                                    <img src={sec.src} alt={sec.alt || sec.content || 'Newsletter image'} className={`w-full ${sec.imageLayout === 'card' ? 'h-32' : 'h-40'} object-cover`} />
                                  ) : (
                                    <div className={`w-full ${sec.imageLayout === 'card' ? 'h-32' : 'h-40'} bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center`}>
                                      <Image className="w-8 h-8 text-slate-600" />
                                    </div>
                                  )}
                                  {(sec.caption || sec.content) && (
                                    <div className="px-3 py-2">
                                      <p className="text-xs text-slate-500">{sec.caption || sec.content}</p>
                                    </div>
                                  )}
                                  {sec.imageType && (
                                    <span className="inline-block m-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-700/50 text-slate-500 border border-slate-600/50">{sec.imageType}</span>
                                  )}
                                </div>
                              );
                              // paragraph (default)
                              return (
                                <div key={sec.id} className="bg-slate-800/30 rounded-lg px-4 py-3">
                                  <p className="text-sm text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: sec.content.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-200">$1</strong>') }} />
                                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700/50">
                                    {(sec.backlinks && sec.backlinks.length > 0) ? (
                                      <>
                                        {sec.backlinks.map((bl, bi) => (
                                          <a key={bi} href={bl.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 transition-colors">
                                            <ExternalLink className="w-2.5 h-2.5" />
                                            {bl.label}
                                          </a>
                                        ))}
                                        <button onClick={() => setEditingBacklinks(editingBacklinks === sec.id ? null : sec.id)} className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700/50 text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors">
                                          <Pencil className="w-2.5 h-2.5 inline -mt-0.5" /> Edit
                                        </button>
                                      </>
                                    ) : (
                                      <button onClick={() => setEditingBacklinks(editingBacklinks === sec.id ? null : sec.id)} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-500 hover:text-primary-400 hover:bg-slate-700 transition-colors flex items-center gap-1">
                                        <Link2 className="w-2.5 h-2.5" /> Add links
                                      </button>
                                    )}
                                  </div>
                                  {editingBacklinks === sec.id && (
                                    <BacklinkEditor
                                      backlinks={sec.backlinks || []}
                                      onSave={(backlinks) => { handleUpdateSectionBacklinks(post.id, sec.id, backlinks); setEditingBacklinks(null); }}
                                      onCancel={() => setEditingBacklinks(null)}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {post.sections && post.sections.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {/* <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                            <div className="text-sm font-semibold text-primary-400">{getTemplateForContentType(post.contentType || 'educational').name}</div>
                            <div className="text-xs text-slate-500">Newsletter Type</div>
                          </div> */}
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
                        <button
                          onClick={() => {
                            setEditForm({
                              title: post.title,
                              subjectLine: post.subjectLine || '',
                              previewText: post.previewText || '',
                              content: post.sections && post.sections.length > 0
                                ? post.sections.map((s) => {
                                    const prefix = s.type === 'heading' ? '## ' : s.type === 'subheading' ? '### ' : s.type === 'quote' ? '> ' : s.type === 'cta' ? '➤ ' : s.type === 'image' ? '🖼 ' : '';
                                    return `${prefix}${s.content}`;
                                  }).join('\n\n')
                                : post.content || '',
                            });
                            setEditingPostId(post.id);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors"
                        >
                          <PenTool className="w-3 h-3" />
                          Edit
                        </button>
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
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Schedule to Calendar Modal */}
      {schedulingPostId && activeCalendar && (() => {
        const currentSlot = findPostCalendarSlot(schedulingPostId);
        const availableSlots = activeCalendar.timeline.filter(
          (item) => item.status === 'empty' || item.id === currentSlot?.id
        );
        const post = posts.find((p) => p.id === schedulingPostId);
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSchedulingPostId(null)}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200">
                  {currentSlot ? 'Reschedule Newsletter' : 'Schedule Newsletter'}
                </h3>
                <button onClick={() => setSchedulingPostId(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                {post ? `"${post.title}"` : 'Select a calendar slot'} — choose a date to {currentSlot ? 'reschedule' : 'schedule'}:
              </p>
              {availableSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400">No available slots in the calendar.</p>
                  <p className="text-sm text-slate-500 mt-1">Edit the calendar to add more publishing dates.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableSlots.map((slot) => {
                    const slotDate = new Date(slot.scheduledDate);
                    const dayName = slotDate.toLocaleDateString('en-US', { weekday: 'long' });
                    const dateStr = slotDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const isCurrentSlot = slot.id === currentSlot?.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleSchedulePost(schedulingPostId, slot.id)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
                          isCurrentSlot
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-slate-700 bg-slate-900/50 hover:border-primary-500/50 hover:bg-slate-800/80'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold',
                          isCurrentSlot ? 'bg-primary-500 text-white' : 'bg-slate-700 text-slate-300'
                        )}>
                          {slotDate.getDate()}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-200">{dayName}</div>
                          <div className="text-xs text-slate-400">{dateStr}</div>
                        </div>
                        {isCurrentSlot && (
                          <span className="text-xs text-primary-400 font-medium">Current</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}
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
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">{getTemplateForContentType(post.contentType || 'educational').name}</span>
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
  foundationalContext,
}: {
  strategy: NewsletterStrategy;
  posts: NewsletterPost[];
  onUpdatePost: (id: string, updates: Partial<NewsletterPost>) => void;
  foundationalContext?: FoundationalContext;
}) {
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const handleCopyContent = async (post: NewsletterPost) => {
    const text = post.sections && post.sections.length > 0
      ? post.sections.map((s) => {
          const prefix = s.type === 'heading' ? '## ' : s.type === 'subheading' ? '### ' : s.type === 'quote' ? '> ' : s.type === 'cta' ? '➤ ' : s.type === 'image' ? '🖼 ' : s.type === 'list' ? '' : '';
          const ctaUrl = s.type === 'cta' && s.backlinks && s.backlinks.length > 0 ? ` (${s.backlinks[0].url})` : '';
          const backlinks = s.backlinks && s.backlinks.length > 0 && s.type !== 'cta'
            ? '\n' + s.backlinks.map(b => `  → ${b.label}: ${b.url}`).join('\n')
            : '';
          return `${prefix}${s.content}${ctaUrl}${backlinks}`;
        }).join('\n\n')
      : post.content || '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

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
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex-1" />
                      <button
                        onClick={() => handleCopyContent(post)}
                        className={cn(
                          'flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-all shrink-0',
                          copiedPostId === post.id
                            ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                            : 'bg-slate-700/50 text-slate-500 border border-slate-600 hover:text-slate-300 hover:bg-slate-700 hover:border-slate-500'
                        )}
                      >
                        {copiedPostId === post.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {(() => {
                        const logoAsset = foundationalContext?.allBrandAssets?.find((a: any) => a.type === 'logo' && (a.url || a.base64Data));
                        const brandLogo = post.logoUrl || logoAsset?.url || logoAsset?.base64Data;
                        if (!brandLogo) return null;
                        return (
                          <div className="flex justify-start mb-1.5">
                            <img src={brandLogo} alt="Logo" className="h-10 max-w-[160px] object-contain" />
                          </div>
                        );
                      })()}
                      {(post.sections && post.sections.length > 0
                        ? post.sections
                        : post.content
                          ? post.content.split('\n\n').map((p, i) => ({ id: `plain-${i}`, type: 'paragraph' as const, content: p, order: i }))
                          : []
                      ).map((section) => {
                        const sec = section as NewsletterSection;
                        if (sec.type === 'heading') return (
                          <div key={sec.id} className="bg-slate-800/60 border-l-2 border-l-[#C8FF2E] rounded-r-lg px-3 py-2">
                            <h3 className="text-sm font-bold text-white leading-snug">{sec.content}</h3>
                          </div>
                        );
                        if (sec.type === 'subheading') return (
                          <div key={sec.id} className="bg-slate-800/40 rounded-lg px-3 py-1.5">
                            <p className="text-xs font-semibold text-slate-200">{sec.content}</p>
                          </div>
                        );
                        if (sec.type === 'list') return (
                          <div key={sec.id} className="bg-slate-800/30 rounded-lg px-3 py-2 border border-slate-700/50">
                            <ul className="space-y-1">
                              {sec.content.split(/\n/).filter(Boolean).map((item, j) => (
                                <li key={j} className="flex items-start gap-1.5 text-xs text-slate-300">
                                  <span className="text-[#C8FF2E] mt-0.5 shrink-0">•</span>
                                  <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                                </li>
                              ))}
                            </ul>
                            {sec.backlinks && sec.backlinks.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5 pt-1.5 border-t border-slate-700/50">
                                {sec.backlinks.map((bl, bi) => (
                                  <a key={bi} href={bl.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 transition-colors">
                                    <ExternalLink className="w-2 h-2" />
                                    {bl.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                        if (sec.type === 'quote') return (
                          <div key={sec.id} className="bg-slate-800/30 rounded-lg px-3 py-2 border-l-2 border-slate-500 italic">
                            <p className="text-xs text-slate-300 leading-relaxed">{sec.content}</p>
                          </div>
                        );
                        if (sec.type === 'cta') return (
                          <div key={sec.id} className="bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 rounded-lg px-3 py-2">
                            <div className="flex items-center justify-center">
                              {sec.backlinks && sec.backlinks.length > 0 ? (
                                <a href={sec.backlinks[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8FF2E] tracking-wide hover:text-[#C8FF2E]/80 transition-colors">
                                  {sec.content}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-xs font-bold text-[#C8FF2E] tracking-wide">{sec.content}</span>
                              )}
                            </div>
                            {sec.backlinks && sec.backlinks.length > 0 && (
                              <div className="flex flex-wrap justify-center gap-1.5 mt-1.5 pt-1.5 border-t border-[#C8FF2E]/20">
                                {sec.backlinks.map((bl, bi) => (
                                  <a key={bi} href={bl.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/20 hover:bg-[#C8FF2E]/20 transition-colors">
                                    <ExternalLink className="w-2 h-2" />
                                    {bl.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                        if (sec.type === 'image') return (
                          <div key={sec.id} className={`${sec.imageLayout === 'full-width' ? '' : 'max-w-[200px]'} bg-slate-800/40 rounded-lg overflow-hidden border border-slate-700/50`}>
                            {sec.src ? (
                              <img src={sec.src} alt={sec.alt || sec.content || 'Image'} className={`w-full ${sec.imageLayout === 'card' ? 'h-20' : 'h-24'} object-cover`} />
                            ) : (
                              <div className={`w-full ${sec.imageLayout === 'card' ? 'h-20' : 'h-24'} bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center`}>
                                <Image className="w-6 h-6 text-slate-600" />
                              </div>
                            )}
                            {sec.caption && <p className="text-[10px] text-slate-500 px-2 py-1">{sec.caption}</p>}
                          </div>
                        );
                        return (
                          <div key={sec.id} className="bg-slate-800/30 rounded-lg px-3 py-2">
                            <p className="text-xs text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: sec.content.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-200">$1</strong>') }} />
                            {sec.backlinks && sec.backlinks.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5 pt-1.5 border-t border-slate-700/50">
                                {sec.backlinks.map((bl, bi) => (
                                  <a key={bi} href={bl.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 transition-colors">
                                    <ExternalLink className="w-2 h-2" />
                                    {bl.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
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
  foundationalContext,
}: {
  strategy: NewsletterStrategy;
  posts: NewsletterPost[];
  foundationalContext?: FoundationalContext;
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

    const sections = post.sections && post.sections.length > 0 ? post.sections : [];
    const template = getTemplateForContentType(post.contentType || 'educational');
    // Get logo from post override, brand data, or template
    const logoAsset = foundationalContext?.allBrandAssets?.find((a: any) => a.type === 'logo' && (a.url || a.base64Data));
    const brandLogo = post.logoUrl || logoAsset?.url || logoAsset?.base64Data || template.logoUrl;
    // Collect all backlinks from sections
    const allBacklinks = sections.flatMap(s => s.backlinks || []);

    const formatBacklinks = (fmt: string): string => {
      if (allBacklinks.length === 0) return '';
      if (fmt === 'markdown') {
        return `\n\n---\n**Links:**\n${allBacklinks.map(b => `- [${b.label}](${b.url})${b.type === 'external' ? ' ↗' : ''}`).join('\n')}`;
      }
      if (fmt === 'html') {
        return `\n<hr style="border-color:#334155;margin:2em 0 1em"/>\n<p style="font-size:0.85em;color:#64748b"><strong>Links:</strong></p>\n<ul style="margin:0.5em 0;padding-left:1.2em">${allBacklinks.map(b => `<li><a href="${b.url}" style="color:#C8FF2E;text-decoration:none">${b.label}</a>${b.type === 'external' ? ' ↗' : ''}</li>`).join('')}</ul>`;
      }
      if (fmt === 'wordpress') {
        return `\n<!-- wp:separator -->\n<hr class="wp-block-separator"/>\n<!-- /wp:separator -->\n<!-- wp:list -->\n<ul>${allBacklinks.map(b => `<li><a href="${b.url}">${b.label}</a></li>`).join('')}</ul>\n<!-- /wp:list -->`;
      }
      // plain
      return `\n\nLinks:\n${allBacklinks.map(b => `- ${b.label}: ${b.url}`).join('\n')}`;
    };

    const formatSection = (sec: NewsletterSection, fmt: string): string => {
      const c = sec.content;
      // Append backlinks if this section has them
      const secBacklinksMd = sec.backlinks && sec.backlinks.length > 0
        ? (fmt === 'markdown' ? '\n' + sec.backlinks.map(b => `  - [${b.label}](${b.url})`).join('\n')
           : fmt === 'html' ? `<ul style="margin:0.3em 0 0;padding-left:1.2em;font-size:0.85em">${sec.backlinks.map(b => `<li><a href="${b.url}" style="color:#C8FF2E">${b.label}</a></li>`).join('')}</ul>`
           : fmt === 'wordpress' ? `<ul>${sec.backlinks.map(b => `<li><a href="${b.url}">${b.label}</a></li>`).join('')}</ul>`
           : '\n' + sec.backlinks.map(b => `  - ${b.label}: ${b.url}`).join('\n'))
        : '';

      if (fmt === 'markdown') {
        if (sec.type === 'heading') return `## ${c}`;
        if (sec.type === 'subheading') return `### ${c}`;
        if (sec.type === 'list') return c.split(/\n/).map(i => `- ${i.replace(/\*\*/g, '**')}`).join('\n');
        if (sec.type === 'quote') return `> ${c}`;
        if (sec.type === 'cta') {
          const ctaUrl = sec.backlinks && sec.backlinks.length > 0 ? sec.backlinks[0].url : '';
          return ctaUrl ? `[**${c}**](${ctaUrl})` : `**[${c}]**`;
        }
        if (sec.type === 'image') return sec.src ? `![${sec.alt || c}](${sec.src})${sec.caption ? `\n*${sec.caption}*` : ''}` : `*[Image: ${c}]*`;
        return c + secBacklinksMd;
      }
      if (fmt === 'html') {
        if (sec.type === 'heading') return `<h2 style="color:#C8FF2E;font-size:1.5rem;font-weight:700;margin:1.5em 0 0.5em">${c}</h2>`;
        if (sec.type === 'subheading') return `<h3 style="font-size:1.1rem;font-weight:600;color:#e2e8f0;margin:1em 0 0.5em">${c}</h3>`;
        if (sec.type === 'list') return `<ul style="margin:0.5em 0;padding-left:1.2em">${c.split(/\n/).map(i => `<li>${i.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`;
        if (sec.type === 'quote') return `<blockquote style="border-left:3px solid #C8FF2E;padding-left:1em;margin:1em 0;font-style:italic;color:#94a3b8">${c}</blockquote>`;
        if (sec.type === 'cta') {
          const ctaUrl = sec.backlinks && sec.backlinks.length > 0 ? sec.backlinks[0].url : '';
          return ctaUrl
            ? `<div style="text-align:center;margin:1.5em 0"><a href="${ctaUrl}" style="background:#C8FF2E;color:#0d1117;padding:0.75em 2em;border-radius:8px;font-weight:700;text-decoration:none;display:inline-block" target="_blank" rel="noopener noreferrer">${c}</a></div>`
            : `<div style="text-align:center;margin:1.5em 0"><a style="background:#C8FF2E;color:#0d1117;padding:0.75em 2em;border-radius:8px;font-weight:700;text-decoration:none;display:inline-block">${c}</a></div>`;
        }
        if (sec.type === 'image') return sec.src
          ? `<figure style="margin:1em 0"><img src="${sec.src}" alt="${sec.alt || c}" style="width:100%;border-radius:8px;${sec.imageLayout === 'card' ? 'max-width:300px;margin:0 auto;' : ''}" />${sec.caption ? `<figcaption style="color:#64748b;font-size:0.85em;text-align:center;margin-top:0.5em">${sec.caption}</figcaption>` : ''}</figure>`
          : `<div style="background:#1e293b;border-radius:8px;padding:2em;text-align:center;color:#64748b">[Image: ${c}]</div>`;
        return `<p style="color:#94a3b8;line-height:1.6">${c.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#e2e8f0">$1</strong>')}</p>${secBacklinksMd}`;
      }
      // wordpress or plain
      if (sec.type === 'heading') return `<!-- wp:heading -->\n<h2>${c}</h2>\n<!-- /wp:heading -->`;
      if (sec.type === 'list') return `<!-- wp:list -->\n<ul>${c.split(/\n/).map(i => `<li>${i.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>\n<!-- /wp:list -->`;
      if (sec.type === 'quote') return `<!-- wp:quote -->\n<blockquote><p>${c}</p></blockquote>\n<!-- /wp:quote -->`;
      if (sec.type === 'cta') {
        const ctaUrl = sec.backlinks && sec.backlinks.length > 0 ? sec.backlinks[0].url : '';
        return ctaUrl
          ? `<!-- wp:button -->\n<div class="wp-block-button"><a href="${ctaUrl}" class="wp-block-button__link">${c}</a></div>\n<!-- /wp:button -->`
          : `<!-- wp:button -->\n<div class="wp-block-button"><a class="wp-block-button__link">${c}</a></div>\n<!-- /wp:button -->`;
      }
      if (sec.type === 'image') return sec.src
        ? `<!-- wp:image -->\n<figure class="wp-block-image"><img src="${sec.src}" alt="${sec.alt || c}" />${sec.caption ? `<figcaption>${sec.caption}</figcaption>` : ''}</figure>\n<!-- /wp:image -->`
        : `<!-- wp:paragraph -->\n<p><em>[Image: ${c}]</em></p>\n<!-- /wp:paragraph -->`;
      return `<!-- wp:paragraph -->\n<p>${c.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</p>\n<!-- /wp:paragraph -->` + secBacklinksMd;
    };

    // Logo header for export (larger: 56px)
    const logoMd = brandLogo ? `![Logo](${brandLogo})\n\n` : '';
    const logoHtml = brandLogo
      ? `<div style="text-align:center;margin-bottom:1.5em"><img src="${brandLogo}" alt="Logo" style="height:56px;object-fit:contain;opacity:0.9"/></div>\n`
      : '';
    const logoWp = brandLogo ? `<!-- wp:image -->\n<figure class="wp-block-image" style="text-align:center"><img src="${brandLogo}" alt="Logo" style="height:56px;object-fit:contain"/></figure>\n<!-- /wp:image -->\n` : '';

    switch (selectedFormat) {
      case 'markdown':
        content = `# ${post.title}\n\n**Subject:** ${post.subjectLine}\n\n${logoMd}${sections.length > 0 ? sections.map(s => formatSection(s, 'markdown')).join('\n\n') : post.content || ''}${formatBacklinks('markdown')}\n\n---\n*Generated by Mengo Newsletter Content OS*`;
        break;
      case 'html':
        content = `<!DOCTYPE html>\n<html><head><title>${post.title}</title><style>body{background:#0d1117;color:#e2e8f0;font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:2em}</style></head>\n<body>\n${logoHtml}<h1 style="color:#C8FF2E;font-size:2rem">${post.title}</h1>\n<p style="color:#94a3b8"><strong>Subject:</strong> ${post.subjectLine}</p>\n${sections.length > 0 ? sections.map(s => formatSection(s, 'html')).join('\n') : (post.content || '').replace(/\n/g, '<br/>')}${formatBacklinks('html')}\n</body></html>`;
        break;
      case 'wordpress':
        content = `<!-- wp:heading -->\n<h1>${post.title}</h1>\n<!-- /wp:heading -->\n<!-- wp:paragraph -->\n<p><strong>Subject:</strong> ${post.subjectLine}</p>\n<!-- /wp:paragraph -->\n${logoWp}${sections.length > 0 ? sections.map(s => formatSection(s, 'wordpress')).join('\n') : `<!-- wp:paragraph -->\n<p>${(post.content || '').replace(/\n/g, '</p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p>')}</p>\n<!-- /wp:paragraph -->`}${formatBacklinks('wordpress')}`;
        break;
      default:
        content = sections.length > 0 ? sections.map(s => s.content).join('\n\n') : post.content || '';
        if (brandLogo) content = `[Logo: ${brandLogo}]\n\n` + content;
        if (allBacklinks.length > 0) content += formatBacklinks('plain');
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
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">{getTemplateForContentType(post.contentType || 'educational').name}</span>
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
