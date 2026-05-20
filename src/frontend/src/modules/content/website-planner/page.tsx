/**
 * Website Planner Module - Comprehensive Website Planning System
 *
 * A powerful website planning, requirements generation, and AI documentation tool.
 * NOT a website builder - this is for strategizing, planning, and creating
 * structured website requirement documents and AI prompts.
 */

'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  ChevronRight,
  Plus,
  Trash2,
  Bot,
  History,
  Users,
  Search,
  Zap,
  Image,
  File,
  Link,
  Upload,
  PenTool,
  List,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  AlertCircle,
  X,
  Building2,
  Package,
  FolderOpen,
  Swords,
  UserCircle,
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
// GLM 5 AI UTILITY (via Ollama)
// ============================================

const OLLAMA_API_URL = 'http://localhost:11434/v1/chat/completions';
const OLLAMA_MODEL = 'glm-5:cloud';

interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callGLM(
  messages: GLMMessage[],
  options?: { temperature?: number; maxTokens?: number; responseFormat?: 'text' | 'json_object' }
): Promise<string> {
  const response = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
      stream: false,
      ...(options?.responseFormat === 'json_object' ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Ollama GLM API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

function parseJsonFromAI(text: string): any {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch { /* fall through */ }
  try { return JSON.parse(text); } catch { /* fall through */ }
  return null;
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < maxRetries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw lastError;
}

// ============================================
// FEATURE-TO-PROMPT MAPPING
// ============================================

const FEATURE_PROMPT_RULES: Array<{ keywords: string[]; prompt: string }> = [
  { keywords: ['booking'], prompt: 'BOOKING SYSTEM: Include an online booking/scheduling flow with calendar integration, timezone support, availability display, confirmation emails, and cancellation policy.' },
  { keywords: ['payment'], prompt: 'PAYMENT GATEWAY: Include secure payment processing with Stripe/PayPal integration, invoice generation, receipt emails, and refund flow.' },
  { keywords: ['auth'], prompt: 'AUTHENTICATION: Include user registration, login, password reset, email verification, session management, and role-based access control.' },
  { keywords: ['chatbot'], prompt: 'CHATBOT: Include an AI-powered chatbot widget with configurable responses, escalation to human support, conversation history, and brand-consistent tone.' },
  { keywords: ['whatsapp'], prompt: 'WHATSAPP INTEGRATION: Include WhatsApp Business API integration with floating chat button, pre-filled message templates, and click-to-chat links.' },
  { keywords: ['multi-language', 'multilanguage'], prompt: 'MULTI-LANGUAGE: Include i18n support with language switcher, RTL support, translation management, and locale-aware date/number formatting.' },
  { keywords: ['cms'], prompt: 'CMS: Include a content management system with WYSIWYG editor, media library, page builder, draft/publish workflow, and version history.' },
  { keywords: ['analytics'], prompt: 'ANALYTICS: Include analytics integration (Google Analytics 4, Mixpanel, or similar) with event tracking, conversion funnels, and dashboard.' },
  { keywords: ['crm'], prompt: 'CRM INTEGRATION: Include CRM integration (HubSpot, Salesforce, or similar) with lead capture, contact sync, deal pipeline, and activity logging.' },
  { keywords: ['admin'], prompt: 'ADMIN PANEL: Include an admin dashboard with user management, content moderation, system settings, audit logs, and role-based permissions.' },
  { keywords: ['api'], prompt: 'API INTEGRATION: Include RESTful API design with authentication, rate limiting, documentation (OpenAPI/Swagger), webhook support, and SDK generation.' },
  { keywords: ['role'], prompt: 'ROLE MANAGEMENT: Include granular role-based access control with permission groups, team management, and audit trail.' },
  { keywords: ['lead'], prompt: 'LEAD TRACKING: Include lead capture forms, scoring, nurture workflows, and conversion tracking with CRM integration.' },
  { keywords: ['notification'], prompt: 'NOTIFICATIONS: Include real-time notifications (in-app, email, push) with user preferences, digest settings, and priority levels.' },
  { keywords: ['blog'], prompt: 'BLOG SYSTEM: Include a blog with categories, tags, author profiles, draft/publish workflow, RSS feed, and social sharing.' },
];

function getFeaturePrompts(enabledFeatures: string[]): string {
  const lower = enabledFeatures.map(f => f.toLowerCase());
  const prompts = FEATURE_PROMPT_RULES
    .filter(rule => rule.keywords.some(kw => lower.some(f => f.includes(kw))))
    .map(rule => rule.prompt);
  return prompts.length > 0 ? prompts.join('\n') : '';
}

// ============================================
// MONGODB ID TRANSFORM
// ============================================

// MongoDB documents use _id, but the frontend expects id.
// Direct fetch() calls bypass apiRequest which normally transforms these.
function transformMongoIds(data: any): any {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) return data.map(transformMongoIds);
  if (typeof data === 'object') {
    const out: any = {};
    for (const key of Object.keys(data)) {
      if (key === '_id') {
        out['id'] = data[key];
      } else if (typeof data[key] === 'object') {
        out[key] = transformMongoIds(data[key]);
      } else {
        out[key] = data[key];
      }
    }
    return out;
  }
  return data;
}

// ============================================
// FOUNDATIONAL CONTEXT HOOK
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
  faqs: any[];
  salesCollateral: any[];
  testimonials: any[];
  brandStrategy: any | null;
  visualIdentity: any | null;
  // Full lists for selection UI (not filtered by linkedData)
  allIcps: any[];
  allPersonas: any[];
  allProducts: any[];
  allProductCategories: any[];
  allCompetitors: any[];
  allBrandAssets: any[];
  allFaqs: any[];
  allSalesCollateral: any[];
  allTestimonials: any[];
}

function useFoundationalContext(website: WebsitePlanner | null): FoundationalContext {
  const companyId = useCompanyStore(s => s.activeCompanyId);
  const getItems = useDataStore(s => s.getItems);
  useDataStore(s => s.data);

  // API-fetched foundational data — stored as full lists
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
  const [allFaqs, setAllFaqs] = useState<any[]>([]);
  const [allSalesCollateral, setAllSalesCollateral] = useState<any[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkedData = website?.linkedData || {};

  const resolveIds = (items: any[], ids: string[]) =>
    ids.map(id => items.find((i: any) => i.id === id)).filter(Boolean);

  // ICPs and Personas: only return items the user explicitly selected via linkedData
  const icps = linkedData.icpIds?.length
    ? resolveIds(allIcps, linkedData.icpIds)
    : [];
  const personas = linkedData.personaIds?.length
    ? resolveIds(allPersonas, linkedData.personaIds)
    : [];

  const products = resolveIds(allProducts, linkedData.productIds || []);
  const productCategories = resolveIds(allProductCategories, linkedData.productCategoryIds || []);
  const competitors = resolveIds(allCompetitors, linkedData.competitorIds || []);
  const brandAssets = resolveIds(allBrandAssets, linkedData.brandAssetIds || []);
  const faqs = resolveIds(allFaqs, (linkedData as any).faqIds || []);
  const salesCollateral = resolveIds(allSalesCollateral, (linkedData as any).salesCollateralIds || []);
  const testimonials = resolveIds(allTestimonials, (linkedData as any).testimonialIds || []);

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
      setAllFaqs([]);
      setAllSalesCollateral([]);
      setAllTestimonials([]);
      return;
    }
    let cancelled = false;
    const fetchFoundationalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = typeof window !== 'undefined'
          ? (await import('@/stores')).useAuthStore.getState().token : '';
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Fetch all foundational data sources in parallel
        const [bpRes, foundersRes, icpsRes, personasRes, strategyRes, visualRes,
               productsRes, productCategoriesRes, competitorsRes,
               brandAssetsRes, faqsRes, salesCollateralRes, testimonialsRes] =
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
            fetch(`${baseUrl}/faqs/${companyId}`, { headers }),
            fetch(`${baseUrl}/sales-collateral/collateral/${companyId}`, { headers }),
            fetch(`${baseUrl}/testimonials/${companyId}`, { headers }),
          ]);

        if (!cancelled) {
          // Business Profile — returns the profile object directly (or 404)
          if (bpRes.status === 'fulfilled' && bpRes.value.ok) {
            const bp = await bpRes.value.json();
            if (bp && !bp.error) setBusinessProfile(transformMongoIds(bp));
          }
          // Founders — returns array directly
          if (foundersRes.status === 'fulfilled' && foundersRes.value.ok) {
            const fList = await foundersRes.value.json();
            if (Array.isArray(fList)) setFounders(transformMongoIds(fList));
          }
          // ICPs — full list for selection UI
          if (icpsRes.status === 'fulfilled' && icpsRes.value.ok) {
            const icpList = await icpsRes.value.json();
            if (Array.isArray(icpList)) setAllIcps(transformMongoIds(icpList));
          }
          // Personas — full list for selection UI
          if (personasRes.status === 'fulfilled' && personasRes.value.ok) {
            const pList = await personasRes.value.json();
            if (Array.isArray(pList)) setAllPersonas(transformMongoIds(pList));
          }
          // Brand Strategy — module-data API returns the data object directly (not wrapped)
          if (strategyRes.status === 'fulfilled' && strategyRes.value.ok) {
            const sd = await strategyRes.value.json();
            // API returns data directly, or wrapped in { data: ... }
            const strategyData = sd?.data || sd;
            if (strategyData && typeof strategyData === 'object' && Object.keys(strategyData).length > 0) {
              setBrandStrategy(transformMongoIds(strategyData));
            }
          }
          // Visual Identity — module-data API returns the data object directly (not wrapped)
          if (visualRes.status === 'fulfilled' && visualRes.value.ok) {
            const vd = await visualRes.value.json();
            const identityData = vd?.data || vd;
            if (identityData && typeof identityData === 'object' && Object.keys(identityData).length > 0) {
              setVisualIdentity(transformMongoIds(identityData));
            }
          }
          // Products — returns array
          if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
            const pList = await productsRes.value.json();
            if (Array.isArray(pList)) setAllProducts(transformMongoIds(pList));
          }
          // Product Categories — returns array
          if (productCategoriesRes.status === 'fulfilled' && productCategoriesRes.value.ok) {
            const pcList = await productCategoriesRes.value.json();
            if (Array.isArray(pcList)) setAllProductCategories(transformMongoIds(pcList));
          }
          // Competitors — returns array
          if (competitorsRes.status === 'fulfilled' && competitorsRes.value.ok) {
            const cList = await competitorsRes.value.json();
            if (Array.isArray(cList)) setAllCompetitors(transformMongoIds(cList));
          }
          // Brand Assets — returns array
          if (brandAssetsRes.status === 'fulfilled' && brandAssetsRes.value.ok) {
            const baList = await brandAssetsRes.value.json();
            if (Array.isArray(baList)) setAllBrandAssets(transformMongoIds(baList));
          }
          // FAQs — returns array
          if (faqsRes.status === 'fulfilled' && faqsRes.value.ok) {
            const fList = await faqsRes.value.json();
            if (Array.isArray(fList)) setAllFaqs(transformMongoIds(fList));
          }
          // Sales Collateral — try API first, fallback to dataStore
          if (salesCollateralRes.status === 'fulfilled' && salesCollateralRes.value.ok) {
            const scRes = await salesCollateralRes.value.json();
            if (Array.isArray(scRes) && scRes.length > 0) {
              setAllSalesCollateral(transformMongoIds(scRes));
            }
            // If API returns empty or wrapped data, fall through to dataStore fallback below
          }
          // Testimonials — returns array
          if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.ok) {
            const tList = await testimonialsRes.value.json();
            if (Array.isArray(tList)) setAllTestimonials(transformMongoIds(tList));
          }
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load foundational data');
      }
      if (!cancelled) setIsLoading(false);
    };
    fetchFoundationalData();
    return () => { cancelled = true; };
  }, [companyId]);

  // Fallback: sync sales collateral from dataStore (module saves to localStorage, API may 404)
  useEffect(() => {
    const storeItems = getItems('salesCollateral') as any[];
    if (Array.isArray(storeItems) && storeItems.length > 0 && allSalesCollateral.length === 0) {
      setAllSalesCollateral(storeItems);
    }
  }, [getItems, allSalesCollateral.length]);

  return {
    isLoading, error, businessProfile, founders, icps, personas,
    products, productCategories, competitors, brandAssets, faqs,
    salesCollateral, testimonials, brandStrategy, visualIdentity,
    allIcps, allPersonas,
    allProducts, allProductCategories, allCompetitors,
    allBrandAssets, allFaqs, allSalesCollateral, allTestimonials,
  };
}

function buildAiContextString(website: WebsitePlanner, ctx: FoundationalContext): string {
  const parts: string[] = [];

  // Business Profile — comprehensive company data
  if (ctx.businessProfile) {
    const bp = ctx.businessProfile;
    parts.push(`BUSINESS: ${bp.name || bp.companyName || 'N/A'}`);
    if (bp.description) parts.push(`Description: ${bp.description}`);
    if (bp.mission) parts.push(`Mission: ${bp.mission}`);
    if (bp.vision) parts.push(`Vision: ${bp.vision}`);
    if (bp.coreValues) parts.push(`Core Values: ${bp.coreValues}`);
    if (bp.usp) parts.push(`USP: ${bp.usp}`);
    if (bp.primaryIndustry) parts.push(`Industry: ${bp.primaryIndustry}`);
    if (bp.businessModel) parts.push(`Business Model: ${bp.businessModel}`);
    if (bp.primaryOffering) parts.push(`Primary Offering: ${bp.primaryOffering}`);
    if (bp.secondaryOfferings) parts.push(`Secondary Offerings: ${bp.secondaryOfferings}`);
    if (bp.pricingModel) parts.push(`Pricing Model: ${bp.pricingModel}`);
    if (bp.targetGeography) parts.push(`Target Geography: ${bp.targetGeography}`);
    if (bp.stage) parts.push(`Business Stage: ${bp.stage}`);
    if (bp.teamSize) parts.push(`Team Size: ${bp.teamSize}`);
    // Contact details
    const contactParts: string[] = [];
    if (bp.email) contactParts.push(`Email: ${bp.email}`);
    if (bp.phone) contactParts.push(`Phone: ${bp.phone}`);
    if (bp.website) contactParts.push(`Website: ${bp.website}`);
    if (bp.address) contactParts.push(`Address: ${bp.address}`);
    if (bp.city) contactParts.push(`City: ${bp.city}`);
    if (bp.country) contactParts.push(`Country: ${bp.country}`);
    if (contactParts.length) parts.push(`Contact: ${contactParts.join(', ')}`);
    // Social profiles
    const socials = bp.socialProfiles;
    if (socials) {
      const socialParts: string[] = [];
      if (socials.linkedIn) socialParts.push(`LinkedIn: ${socials.linkedIn}`);
      if (socials.twitter) socialParts.push(`Twitter: ${socials.twitter}`);
      if (socials.instagram) socialParts.push(`Instagram: ${socials.instagram}`);
      if (socials.facebook) socialParts.push(`Facebook: ${socials.facebook}`);
      if (socials.youTube) socialParts.push(`YouTube: ${socials.youTube}`);
      if (socials.tikTok) socialParts.push(`TikTok: ${socials.tikTok}`);
      if (socials.whatsApp) socialParts.push(`WhatsApp: ${socials.whatsApp}`);
      if (socials.telegram) socialParts.push(`Telegram: ${socials.telegram}`);
      if (socials.googleBusiness) socialParts.push(`Google Business: ${socials.googleBusiness}`);
      if (socials.website) socialParts.push(`Social Website: ${socials.website}`);
      if (socialParts.length) parts.push(`Social Links: ${socialParts.join(', ')}`);
    }
  }

  // Founders / Website Owner
  if (ctx.founders.length) {
    const founderParts = ctx.founders.map((f: any) => {
      const details = [f.name];
      if (f.title) details.push(`(${f.title})`);
      if (f.bio) details.push(`— ${f.bio.substring(0, 200)}`);
      if (f.expertise?.length) details.push(`Expertise: ${f.expertise.join(', ')}`);
      if (f.email) details.push(`Email: ${f.email}`);
      if (f.phone) details.push(`Phone: ${f.phone}`);
      if (f.city || f.country) details.push(`Location: ${[f.city, f.country].filter(Boolean).join(', ')}`);
      const fSocials = f.socialProfiles;
      if (fSocials) {
        const fSocialParts: string[] = [];
        if (fSocials.linkedIn) fSocialParts.push(`LinkedIn: ${fSocials.linkedIn}`);
        if (fSocials.twitter) fSocialParts.push(`Twitter: ${fSocials.twitter}`);
        if (fSocials.instagram) fSocialParts.push(`Instagram: ${fSocials.instagram}`);
        if (fSocials.youTube) fSocialParts.push(`YouTube: ${fSocials.youTube}`);
        if (fSocials.website) fSocialParts.push(`Website: ${fSocials.website}`);
        if (fSocialParts.length) details.push(fSocialParts.join(', '));
      }
      return details.join(' ');
    });
    parts.push(`FOUNDERS/OWNERS: ${founderParts.join('; ')}`);
  }

  // Brand Strategy — tone, positioning, messaging
  if (ctx.brandStrategy) {
    const bs = ctx.brandStrategy;
    if (bs.brandName) parts.push(`Brand Name: ${bs.brandName}`);
    if (bs.tagline) parts.push(`Tagline: ${bs.tagline}`);
    if (bs.brandVoice) parts.push(`Brand Voice: ${bs.brandVoice}`);
    if (bs.brandArchetype) parts.push(`Archetype: ${bs.brandArchetype}`);
    if (bs.brandPromise) parts.push(`Promise: ${bs.brandPromise}`);
    if (bs.brandPositioning) parts.push(`Positioning: ${bs.brandPositioning}`);
    if (bs.brandPersonality?.length) parts.push(`Personality: ${bs.brandPersonality.join(', ')}`);
    if (bs.brandValues?.length) parts.push(`Values: ${bs.brandValues.join(', ')}`);
    if (bs.emotionalBenefits) parts.push(`Emotional Benefits: ${bs.emotionalBenefits}`);
    if (bs.rationalBenefits) parts.push(`Rational Benefits: ${bs.rationalBenefits}`);
    if (bs.uniqueValueProposition) parts.push(`UVP: ${bs.uniqueValueProposition}`);
    if (bs.elevatorPitch) parts.push(`Elevator Pitch: ${bs.elevatorPitch}`);
    if (bs.toneAttributes) {
      const ta = bs.toneAttributes;
      const toneParts: string[] = [];
      if (ta.professional !== undefined) toneParts.push(`Professional: ${ta.professional}/100`);
      if (ta.friendly !== undefined) toneParts.push(`Friendly: ${ta.friendly}/100`);
      if (ta.authoritative !== undefined) toneParts.push(`Authoritative: ${ta.authoritative}/100`);
      if (ta.playful !== undefined) toneParts.push(`Playful: ${ta.playful}/100`);
      if (ta.empathetic !== undefined) toneParts.push(`Empathetic: ${ta.empathetic}/100`);
      if (ta.bold !== undefined) toneParts.push(`Bold: ${ta.bold}/100`);
      if (toneParts.length) parts.push(`Tone Attributes: ${toneParts.join(', ')}`);
    }
    if (bs.toneGuidelines) parts.push(`Tone Guidelines: ${bs.toneGuidelines}`);
    if (bs.targetAudience) {
      const tAud = bs.targetAudience;
      const audParts: string[] = [];
      if (tAud.demographics) audParts.push(`Demographics: ${tAud.demographics}`);
      if (tAud.psychographics) audParts.push(`Psychographics: ${tAud.psychographics}`);
      if (tAud.painPoints?.length) audParts.push(`Pain Points: ${tAud.painPoints.join(', ')}`);
      if (tAud.desires?.length) audParts.push(`Desires: ${tAud.desires.join(', ')}`);
      if (audParts.length) parts.push(`Brand Target Audience: ${audParts.join('; ')}`);
    }
    if (bs.brandMessage) parts.push(`Brand Message: ${bs.brandMessage}`);
    if (bs.keyMessages?.length) parts.push(`Key Messages: ${bs.keyMessages.join('; ')}`);
  }

  // Visual Identity — full design system
  if (ctx.visualIdentity) {
    const vi = ctx.visualIdentity;
    const viParts: string[] = [];
    if (vi.primaryColor) viParts.push(`Primary: ${vi.primaryColor}`);
    if (vi.secondaryColor) viParts.push(`Secondary: ${vi.secondaryColor}`);
    if (vi.accentColor) viParts.push(`Accent: ${vi.accentColor}`);
    if (vi.backgroundColor) viParts.push(`Background: ${vi.backgroundColor}`);
    if (vi.surfaceColor) viParts.push(`Surface: ${vi.surfaceColor}`);
    if (vi.textColor) viParts.push(`Text: ${vi.textColor}`);
    if (vi.textMutedColor) viParts.push(`Muted: ${vi.textMutedColor}`);
    if (viParts.length) parts.push(`Brand Colours: ${viParts.join(', ')}`);
    const fontParts: string[] = [];
    if (vi.headingFont) fontParts.push(`Heading: ${vi.headingFont}`);
    if (vi.bodyFont) fontParts.push(`Body: ${vi.bodyFont}`);
    if (vi.accentFont) fontParts.push(`Accent: ${vi.accentFont}`);
    if (vi.monoFont) fontParts.push(`Mono: ${vi.monoFont}`);
    if (fontParts.length) parts.push(`Fonts: ${fontParts.join(', ')}`);
    if (vi.headingLineHeight) parts.push(`Heading Line Height: ${vi.headingLineHeight}`);
    if (vi.bodyLineHeight) parts.push(`Body Line Height: ${vi.bodyLineHeight}`);
    if (vi.borderRadiusSm || vi.borderRadiusMd || vi.borderRadiusLg) {
      parts.push(`Border Radius: ${[vi.borderRadiusSm, vi.borderRadiusMd, vi.borderRadiusLg].filter(Boolean).join('/')}`);
    }
    if (vi.sectionSpacing) parts.push(`Section Spacing: ${vi.sectionSpacing}`);
    if (vi.componentSpacing) parts.push(`Component Spacing: ${vi.componentSpacing}`);
    if (vi.iconStyle?.name) parts.push(`Icon Style: ${vi.iconStyle.name}`);
    if (vi.imageStyle?.name) parts.push(`Image Style: ${vi.imageStyle.name}`);
  }

  if (ctx.icps.length) {
    parts.push('ICPs: ' + ctx.icps.map((i: any) => `${i.name} (${i.industry || 'unknown'} industry, challenges: ${(i.challenges || []).join(', ') || 'N/A'})`).join('; '));
  }

  if (ctx.personas.length) {
    parts.push('Personas: ' + ctx.personas.map((p: any) => `${p.name} - ${p.jobTitle || 'N/A'}, goals: ${(p.goals || []).join(', ') || 'N/A'}`).join('; '));
  }

  if (ctx.competitors.length) {
    parts.push('Competitors: ' + ctx.competitors.map((c: any) => `${c.name} - strengths: ${(c.strengths || []).join(', ') || 'N/A'}`).join('; '));
  }

  if (ctx.products.length) {
    parts.push('Products: ' + ctx.products.map((p: any) => `${p.name}${p.usp ? ` (${p.usp})` : ''}`).join(', '));
  }

  if (ctx.productCategories.length) {
    parts.push('Product Categories: ' + ctx.productCategories.map((pc: any) => pc.name).join(', '));
  }

  if (ctx.brandAssets.length) {
    parts.push('Brand Assets: ' + ctx.brandAssets.map((ba: any) => `${ba.name} (${ba.type || 'asset'})`).join(', '));
  }

  if (ctx.faqs.length) {
    parts.push('FAQs: ' + ctx.faqs.slice(0, 20).map((f: any) => f.question || f.title).join('; '));
  }

  if (ctx.salesCollateral.length) {
    parts.push('Sales Collateral: ' + ctx.salesCollateral.map((sc: any) => {
      const name = sc.name || sc.title || 'Document';
      const type = sc.type || sc.scriptType || 'document';
      return `${name} (${type})`;
    }).join(', '));
  }

  if (ctx.testimonials.length) {
    parts.push('Testimonials: ' + ctx.testimonials.map((t: any) => {
      const author = t.customerName || t.name || t.author || 'Unknown';
      const role = [t.customerDesignation, t.customerCompany].filter(Boolean).join(' at ');
      const co = role ? ` (${role})` : '';
      const quote = t.shortQuote || t.fullTestimonial ? `: "${(t.shortQuote || t.fullTestimonial).substring(0, 100)}"` : '';
      return `${author}${co}${quote}`;
    }).join('; '));
  }

  if (website.websiteGoal) parts.push(`Website Goal: ${website.websiteGoal}`);
  if (website.targetAudience) parts.push(`Target Audience: ${website.targetAudience}`);

  return parts.join('\n');
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function WebsitePlannerModule() {
  const companyId = useCompanyStore(s => s.activeCompanyId);
  const getItems = useDataStore(s => s.getItems);
  const addItem = useDataStore(s => s.addItem);
  const updateItem = useDataStore(s => s.updateItem);
  const deleteItem = useDataStore(s => s.deleteItem);
  const setActiveCompany = useDataStore(s => s.setActiveCompany);
  const activeCompanyId = useDataStore(s => s.activeCompanyId);
  const data = useDataStore(s => s.data);

  // Sync company from companyStore to dataStore
  useEffect(() => {
    if (companyId && companyId !== activeCompanyId) {
      setActiveCompany(companyId);
    }
  }, [companyId, activeCompanyId, setActiveCompany]);

  // Reset selection on company switch to prevent stale data
  useEffect(() => {
    setSelectedWebsiteId(null);
  }, [companyId]);

  // Get websites from store - use data directly for reactivity
  const websites = useMemo(
    () => {
      const items = (getItems('websitePlanners') as WebsitePlanner[]) || [];
      console.log('Fetching websites:', items.length);
      return items;
    },
    [getItems, data, activeCompanyId] // Add data as dependency
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'pages' | 'content' | 'seo' | 'features' | 'ai' | 'data'>('overview');
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Find selected website
  const selectedWebsite = useMemo(
    () => websites.find((w) => w.id === selectedWebsiteId) || null,
    [websites, selectedWebsiteId]
  );

  // Foundational context — resolves linkedData IDs into full entity objects
  const foundationalContext = useFoundationalContext(selectedWebsite);

  // Create new website
  const handleCreateWebsite = (data: { name: string; websiteType: WebsiteType; language: string }) => {
    console.log('=== Creating website ===', { companyId, data, activeCompanyId });

    if (!companyId) {
      alert('Please select a company first before creating a website.');
      console.error('No companyId available');
      return;
    }

    if (!activeCompanyId) {
      console.log('Syncing company to data store:', companyId);
      setActiveCompany(companyId);
    }

    try {
      // Generate ID - fallback for older browsers
      const websiteId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      console.log('Generated website ID:', websiteId);

      const newWebsite: WebsitePlanner = {
        id: websiteId,
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
        linkedData: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Adding website to store:', newWebsite);
      const addedId = addItem('websitePlanners', newWebsite);
      console.log('Website added with ID:', addedId);

      // Verify it was added
      const currentWebsites = getItems('websitePlanners') as WebsitePlanner[];
      console.log('Current websites in store:', currentWebsites.length, currentWebsites.map(w => w.name));

      // Force update
      setSelectedWebsiteId(addedId || websiteId);
      setShowCreateModal(false);
      console.log('Website created successfully');
    } catch (error) {
      console.error('Failed to create website:', error);
      alert('Failed to create website. Check console for details.');
    }
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
    return generatePrompt(selectedWebsite, platform, foundationalContext);
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="py-4">
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
      <div className="py-6">
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
              <div className="flex gap-1 overflow-x-auto scrollbar-none">
                {[
                  { id: 'overview', label: 'Overview', icon: Layout },
                  { id: 'data', label: 'Data Sources', icon: Link },
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
                <OverviewTab website={selectedWebsite} onUpdate={handleUpdateWebsite} foundationalContext={foundationalContext} />
              )}
              {activeTab === 'structure' && (
                <StructureTab
                  website={selectedWebsite}
                  onUpdate={handleUpdateWebsite}
                  foundationalContext={foundationalContext}
                />
              )}
              {activeTab === 'pages' && (
                <PagesTab website={selectedWebsite} onUpdate={handleUpdateWebsite} />
              )}
              {activeTab === 'content' && (
                <ContentTab website={selectedWebsite} onUpdate={handleUpdateWebsite} foundationalContext={foundationalContext} />
              )}
              {activeTab === 'data' && (
                <DataSourcesTab website={selectedWebsite} onUpdate={handleUpdateWebsite} foundationalContext={foundationalContext} />
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
                  foundationalContext={foundationalContext}
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
  foundationalContext,
}: {
  website: WebsitePlanner;
  onUpdate: (updates: Partial<WebsitePlanner>) => void;
  foundationalContext?: FoundationalContext;
}) {
  const [showAiFill, setShowAiFill] = useState(false);
  const [aiFillMode, setAiFillMode] = useState<'paste' | 'upload' | 'url'>('paste');
  const [pastedText, setPastedText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractSuccess, setExtractSuccess] = useState(false);

  const handleAiExtract = useCallback(async () => {
    setIsExtracting(true);
    setExtractError(null);
    setExtractSuccess(false);
    try {
      let content = '';
      let sourceType = 'text';

      if (aiFillMode === 'paste') {
        content = pastedText;
        sourceType = 'text';
      } else if (aiFillMode === 'url') {
        content = urlInput;
        sourceType = 'url';
      } else if (aiFillMode === 'upload' && uploadedFile) {
        if (uploadedFile.type === 'application/pdf') {
          content = await uploadedFile.text();
          sourceType = 'pdf';
        } else {
          content = await uploadedFile.text();
          sourceType = 'document';
        }
      }

      if (!content.trim()) {
        setExtractError('Please provide content to analyse');
        setIsExtracting(false);
        return;
      }

      const systemPrompt = `You are a business document analyser. Extract structured business information from the provided content and return it as a JSON object. Use null for any field that cannot be determined.`;

      const userPrompt = `Extract the following fields from this ${sourceType} content and return ONLY a valid JSON object:
- name: Website or business name
- domain: Domain name if mentioned
- websiteGoal: The primary goal or purpose of the website
- targetAudience: Description of the target audience
- primaryCTA: Primary call to action
- secondaryCTA: Secondary call to action
- country: Country or region
- language: Primary language (ISO 639-1 code, e.g., "en")
- seoTargetRegion: SEO target region
- description: Brief business description
- mission: Mission statement if present
- vision: Vision statement if present
- industry: Primary industry
- usp: Unique selling proposition
- products: Array of product/service names
- competitors: Array of competitor names
- keyFeatures: Array of key features or capabilities
- brandVoice: Brand voice description
- toneKeywords: Array of tone keywords (e.g., "professional", "friendly")

Content:
${content}

Return ONLY valid JSON. No explanation, no markdown formatting.`;

      const result = await withRetry(() => callGLM(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.3, maxTokens: 2000, responseFormat: 'json_object' }
      ));

      const extracted = parseJsonFromAI(result);
      if (!extracted) {
        setExtractError('AI returned invalid data. Please try again or fill manually.');
        setIsExtracting(false);
        return;
      }

      const updates: Partial<WebsitePlanner> = {};
      if (extracted.name && !website.name) updates.name = extracted.name;
      if (extracted.domain) updates.domain = extracted.domain;
      if (extracted.websiteGoal) updates.websiteGoal = extracted.websiteGoal;
      if (extracted.targetAudience) updates.targetAudience = extracted.targetAudience;
      if (extracted.primaryCTA) updates.primaryCTA = extracted.primaryCTA;
      if (extracted.secondaryCTA) updates.secondaryCTA = extracted.secondaryCTA;
      if (extracted.country) updates.country = extracted.country;
      if (extracted.language) updates.language = extracted.language;
      if (extracted.seoTargetRegion) updates.seoTargetRegion = extracted.seoTargetRegion;

      if (Object.keys(updates).length > 0) {
        onUpdate(updates);
        setExtractSuccess(true);
        setTimeout(() => setExtractSuccess(false), 3000);
      }
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : 'AI extraction failed. Please try again.');
    }
    setIsExtracting(false);
  }, [aiFillMode, pastedText, urlInput, uploadedFile, website, onUpdate]);

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
    <div className="space-y-6">
      {/* AI Auto-Fill Panel */}
      <div className="bg-primary-500/5 border border-primary-500/20 rounded-xl p-4">
        <button
          onClick={() => setShowAiFill(!showAiFill)}
          className="flex items-center gap-2 text-primary-400 font-medium w-full text-left"
        >
          <Sparkles className="w-4 h-4" />
          Fill Details with AI
          <span className="text-xs text-slate-500 ml-2">Powered by GLM 5.1</span>
          <ChevronRight className={cn('w-4 h-4 ml-auto transition-transform', showAiFill && 'rotate-90')} />
        </button>

        {showAiFill && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-slate-400">
              Upload a business document, paste text, or enter a website URL. AI will extract key information and auto-fill empty fields.
            </p>

            {/* Mode selector */}
            <div className="flex gap-2">
              {[
                { mode: 'paste' as const, label: 'Paste Text', icon: FileText },
                { mode: 'upload' as const, label: 'Upload Document', icon: Upload },
                { mode: 'url' as const, label: 'Website URL', icon: Link },
              ].map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setAiFillMode(mode)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                    aiFillMode === mode ? 'bg-primary-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Input area */}
            {aiFillMode === 'paste' && (
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your business description, about page, marketing materials, or any business document text here..."
                rows={6}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500"
              />
            )}
            {aiFillMode === 'upload' && (
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-slate-600 transition-colors">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="text-sm text-slate-400"
                />
                {uploadedFile && (
                  <p className="text-xs text-slate-500 mt-2">{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)</p>
                )}
              </div>
            )}
            {aiFillMode === 'url' && (
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500"
              />
            )}

            {extractError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {extractError}
              </div>
            )}
            {extractSuccess && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Fields auto-filled successfully! You can edit any field manually.
              </div>
            )}

            <button
              onClick={handleAiExtract}
              disabled={isExtracting}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isExtracting
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              )}
            >
              <Sparkles className="w-4 h-4" />
              {isExtracting ? 'Analysing with AI...' : 'Extract & Fill Fields'}
            </button>
          </div>
        )}
      </div>

      {/* Sync from Foundational Data */}
      {foundationalContext && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
          <button
            onClick={() => {
              const updates: Partial<WebsitePlanner> = {};
              const bp = foundationalContext.businessProfile;
              const fList = foundationalContext.founders;

              // Auto-fill owner from first founder
              if (!website.owner && fList?.length) {
                updates.owner = fList[0].name;
              }
              // Auto-fill country from business profile
              if (!website.country && bp?.country) {
                updates.country = bp.country;
              }
              // Auto-fill website goal from business mission/vision
              if (!website.websiteGoal) {
                if (bp?.mission) updates.websiteGoal = bp.mission;
                else if (bp?.vision) updates.websiteGoal = bp.vision;
              }
              // Auto-fill target audience from ICPs or personas
              if (!website.targetAudience) {
                if (foundationalContext.icps?.length) {
                  updates.targetAudience = foundationalContext.icps.map((i: any) => i.name).join(', ');
                } else if (foundationalContext.personas?.length) {
                  updates.targetAudience = foundationalContext.personas.map((p: any) => `${p.name}${p.jobTitle ? ` (${p.jobTitle})` : ''}`).join(', ');
                }
              }
              // Auto-fill domain from business website
              if (!website.domain && bp?.website) {
                try {
                  const url = new URL(bp.website.startsWith('http') ? bp.website : `https://${bp.website}`);
                  updates.domain = url.hostname;
                } catch { /* not a valid URL */ }
              }
              // Auto-fill SEO target region from business target geography
              if (!website.seoTargetRegion && bp?.targetGeography) {
                updates.seoTargetRegion = bp.targetGeography;
              }
              // Auto-fill primary CTA from brand strategy
              if (!website.primaryCTA && foundationalContext.brandStrategy?.brandMessage) {
                updates.primaryCTA = 'Get Started';
              }

              if (Object.keys(updates).length > 0) {
                onUpdate(updates);
              }
            }}
            className="flex items-center gap-2 text-emerald-400 font-medium w-full text-left"
          >
            <Zap className="w-4 h-4" />
            Sync from Foundational Data
            <span className="text-xs text-slate-500 ml-2">Auto-fill empty fields from Business Profile, Founders & Brand</span>
          </button>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              { label: 'Business Profile', active: !!foundationalContext.businessProfile },
              { label: 'Founders', active: foundationalContext.founders?.length > 0 },
              { label: 'Brand Strategy', active: !!foundationalContext.brandStrategy },
              { label: 'Visual Identity', active: !!foundationalContext.visualIdentity },
              { label: 'ICPs', active: foundationalContext.icps?.length > 0, available: foundationalContext.allIcps?.length },
              { label: 'Personas', active: foundationalContext.personas?.length > 0, available: foundationalContext.allPersonas?.length },
            ].map(({ label, active, available }) => (
              <span
                key={label}
                className={cn(
                  'px-2 py-0.5 rounded text-xs',
                  active
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : available
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-slate-800 text-slate-500'
                )}
              >
                {active ? '✓' : available ? '◉' : '○'} {label}{available ? ` (${foundationalContext.icps?.length || foundationalContext.personas?.length || 0}/${available})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

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

          {/* Foundational Data Status */}
          {foundationalContext && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Link className="w-5 h-5 text-primary-400" />
                  <h3 className="text-lg font-semibold text-slate-200">Module Connections</h3>
                </div>
                {!foundationalContext.isLoading && (
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    [
                      foundationalContext.businessProfile,
                      foundationalContext.founders?.length,
                      foundationalContext.brandStrategy,
                      foundationalContext.visualIdentity,
                    ].filter(Boolean).length > 0
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-700 text-slate-500'
                  )}>
                    {[
                      foundationalContext.businessProfile,
                      foundationalContext.founders?.length,
                      foundationalContext.brandStrategy,
                      foundationalContext.visualIdentity,
                    ].filter(Boolean).length}/4 core
                  </span>
                )}
              </div>

              {foundationalContext.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
                  <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  Loading connections...
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    {
                      label: 'Business Profile',
                      icon: Building2,
                      active: !!foundationalContext.businessProfile,
                      detail: foundationalContext.businessProfile
                        ? foundationalContext.businessProfile.name || foundationalContext.businessProfile.companyName || 'Profile loaded'
                        : 'No business profile — add one in Business Profile module',
                    },
                    {
                      label: 'Founder Data',
                      icon: Users,
                      active: foundationalContext.founders?.length > 0,
                      detail: foundationalContext.founders?.length > 0
                        ? `${foundationalContext.founders.map((f: any) => f.name).join(', ')}`
                        : 'No founders — add them in Founders module',
                    },
                    {
                      label: 'Brand Strategy',
                      icon: Sparkles,
                      active: !!foundationalContext.brandStrategy,
                      detail: foundationalContext.brandStrategy
                        ? `${foundationalContext.brandStrategy.brandName || 'Strategy'} — ${foundationalContext.brandStrategy.brandArchetype || 'no archetype'} archetype`
                        : 'No brand strategy — configure in Brand Strategy module',
                    },
                    {
                      label: 'Visual Identity',
                      icon: Palette,
                      active: !!foundationalContext.visualIdentity,
                      detail: foundationalContext.visualIdentity
                        ? `${foundationalContext.visualIdentity.primaryColor || ''} ${foundationalContext.visualIdentity.headingFont ? `/ ${foundationalContext.visualIdentity.headingFont}` : ''}`
                        : 'No visual identity — configure in Visual Identity module',
                    },
                  ].map(({ label, icon: ModIcon, active, detail }) => (
                    <div
                      key={label}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                        active
                          ? 'bg-emerald-500/5 border border-emerald-500/20'
                          : 'bg-slate-900/30 border border-slate-700/50'
                      )}
                    >
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                        active ? 'bg-emerald-500/10' : 'bg-slate-800'
                      )}>
                        {active ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ModIcon className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          'text-sm font-medium',
                          active ? 'text-emerald-400' : 'text-slate-500'
                        )}>
                          {label} {active ? '— Connected' : '— Not Connected'}
                        </div>
                        <div className={cn(
                          'text-xs truncate',
                          active ? 'text-slate-400' : 'text-slate-600'
                        )}>
                          {detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Additional data sources */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Additional Sources</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'ICPs', active: foundationalContext.icps?.length > 0, count: foundationalContext.icps?.length, available: foundationalContext.allIcps?.length },
                    { label: 'Personas', active: foundationalContext.personas?.length > 0, count: foundationalContext.personas?.length, available: foundationalContext.allPersonas?.length },
                    { label: 'Competitors', active: foundationalContext.competitors?.length > 0, count: foundationalContext.competitors?.length },
                    { label: 'Products', active: foundationalContext.products?.length > 0, count: foundationalContext.products?.length },
                    { label: 'Product Categories', active: foundationalContext.productCategories?.length > 0, count: foundationalContext.productCategories?.length },
                    { label: 'FAQs', active: foundationalContext.faqs?.length > 0, count: foundationalContext.faqs?.length },
                    { label: 'Sales Collateral', active: foundationalContext.salesCollateral?.length > 0, count: foundationalContext.salesCollateral?.length },
                    { label: 'Testimonials', active: foundationalContext.testimonials?.length > 0, count: foundationalContext.testimonials?.length },
                    { label: 'Brand Assets', active: foundationalContext.brandAssets?.length > 0, count: foundationalContext.brandAssets?.length },
                  ].map(({ label, active, count, available }) => (
                    <span
                      key={label}
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        active
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : available
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-slate-900/50 text-slate-600'
                      )}
                    >
                      {active ? '✓' : available ? '◉' : '○'} {label}{count ? ` (${count}${available && count !== available ? `/${available}` : ''})` : available ? ` (0/${available})` : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact & Social availability */}
              {foundationalContext.businessProfile && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Available Data</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Email', active: !!foundationalContext.businessProfile.email },
                      { label: 'Phone', active: !!foundationalContext.businessProfile.phone },
                      { label: 'Website', active: !!foundationalContext.businessProfile.website },
                      { label: 'Address', active: !!foundationalContext.businessProfile.address || !!foundationalContext.businessProfile.city },
                      { label: 'Social Links', active: !!foundationalContext.businessProfile.socialProfiles && Object.values(foundationalContext.businessProfile.socialProfiles || {}).filter(Boolean).length > 0 },
                      { label: 'Brand Tone', active: !!foundationalContext.brandStrategy?.toneAttributes },
                      { label: 'Brand Colours', active: !!foundationalContext.visualIdentity?.primaryColor },
                      { label: 'Typography', active: !!foundationalContext.visualIdentity?.headingFont },
                    ].map(({ label, active }) => (
                      <span key={label} className={cn(
                        'px-2 py-0.5 rounded text-xs',
                        active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900/50 text-slate-600'
                      )}>
                        {active ? '✓' : '○'} {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
  foundationalContext,
}: {
  website: WebsitePlanner;
  onUpdate: (updates: Partial<WebsitePlanner>) => void;
  foundationalContext?: FoundationalContext;
}) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [aiSectionLoading, setAiSectionLoading] = useState<string | null>(null);

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

  // Section-aware AI auto-fill
  const sectionPromptMap: Record<string, string> = {
    'Hero Section': 'Generate a compelling hero section with headline, subheadline, primary CTA, and supporting tagline. The hero must immediately communicate the brand value proposition and create an emotional connection.',
    'About Section': 'Generate an about section that tells the brand story, mission, and what makes the company unique. Include a compelling narrative that builds trust.',
    'Mission/Vision': 'Generate clear mission and vision statements. The mission should state what the company does and for whom. The vision should describe the aspirational future impact.',
    'Services': 'Generate a services section listing each service with a concise description, key benefit, and relevant CTA. Focus on outcomes, not features.',
    'Products': 'Generate a products section with product names, key benefits, pricing indicators, and CTAs. Highlight unique selling points and competitive advantages.',
    'FAQs': 'Generate frequently asked questions with clear, concise answers. Address common objections, pricing concerns, and process questions. Structure answers to build trust.',
    'Testimonials': 'Generate testimonial content with customer name, designation, company, and review text. Focus on specific results and transformational outcomes.',
    'Case Studies': 'Generate case study content with challenge, solution, and results. Include specific metrics and outcomes where possible.',
    'CTA Sections': 'Generate call-to-action section content with compelling headline, supporting text, and button copy. Focus on urgency and value.',
    'Footer Content': 'Generate footer content including company description, navigation labels, contact info, and legal links. Keep it concise and organized.',
    'Contact Section': 'Generate a contact section with headline, supporting text encouraging visitors to reach out, and CTA copy. Include trust-building elements.',
    'Team Section': 'Generate team member descriptions with name, role, and a brief bio for each founder/key person. Highlight expertise and credibility.',
    'Pricing Section': 'Generate pricing tier content with plan names, key features, price points, and CTAs. Focus on value differentiation between tiers.',
    'Portfolio Section': 'Generate portfolio/work showcase content with project titles, brief descriptions, and outcomes. Focus on measurable results.',
    'Blog/News Section': 'Generate blog/news section content with article topic suggestions, categories, and headlines. Focus on SEO-relevant topics for the industry.',
  };

  const handleAutoFillSection = async (sectionId: string, sectionName: string) => {
    const section = website.sections.find((s) => s.id === sectionId);
    if (!section) return;

    setAiSectionLoading(sectionId);
    try {
      const contextStr = foundationalContext
        ? buildAiContextString(website, foundationalContext)
        : `Website: ${website.name}, Goal: ${website.websiteGoal || 'N/A'}, Type: ${website.websiteType || 'general'}`;

      const sectionGuidance = sectionPromptMap[sectionName] || sectionPromptMap[section.name] ||
        `Generate content for the "${sectionName}" section. Include a clear purpose, content requirements, and recommended CTA.`;

      const existingContent = section.purpose || section.contentRequirement || section.uiNotes || section.cta
        ? `\n\nExisting content in this section (preserve and enhance - do NOT remove user-written content):\n${section.purpose ? `Purpose: ${section.purpose}` : ''}\n${section.contentRequirement ? `Content Requirements: ${section.contentRequirement}` : ''}\n${section.uiNotes ? `UI Notes: ${section.uiNotes}` : ''}\n${section.cta ? `CTA: ${section.cta}` : ''}`
        : '';

      const result = await withRetry(() => callGLM([
        {
          role: 'system',
          content: `You are an expert website content strategist. Generate production-ready, context-aware content for a specific website section. You must use ALL provided brand, business, and audience context to create highly relevant, conversion-focused content. Follow the brand tone and voice exactly. Return ONLY valid JSON.`
        },
        {
          role: 'user',
          content: `${sectionGuidance}\n\nWebsite: "${website.name}"${website.websiteGoal ? `\nGoal: ${website.websiteGoal}` : ''}${website.targetAudience ? `\nTarget Audience: ${website.targetAudience}` : ''}\n\n${contextStr}${existingContent}\n\nReturn a JSON object with these keys:\n- purpose: A clear, specific purpose statement for this section (1-2 sentences)\n- contentRequirement: Detailed content requirements - what text, images, and elements this section should contain (3-5 sentences)\n- uiNotes: Specific UI/UX recommendations for layout, styling, and user experience (2-3 sentences)\n- cta: The primary call-to-action text for this section (short, action-oriented)\n- seoNotes: SEO recommendations for this section (keywords, meta suggestions)\n- mediaRequirement: What images, videos, or media this section needs\n\nReturn ONLY the JSON object.`
        }
      ], { temperature: 0.7, maxTokens: 1500, responseFormat: 'json_object' }));

      const parsed = parseJsonFromAI(result);
      if (parsed) {
        const updatedSections = website.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                purpose: parsed.purpose || s.purpose,
                contentRequirement: parsed.contentRequirement || s.contentRequirement,
                uiNotes: parsed.uiNotes || s.uiNotes,
                cta: parsed.cta || s.cta,
                seoNotes: parsed.seoNotes || s.seoNotes,
                mediaRequirement: parsed.mediaRequirement || s.mediaRequirement,
              }
            : s
        );
        onUpdate({ sections: updatedSections });
      }
    } catch (err) {
      // Silently fail — the user can try again
    }
    setAiSectionLoading(null);
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
                      onClick={() => handleAutoFillSection(section.id, section.name)}
                      disabled={aiSectionLoading === section.id}
                      className={cn(
                        'p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all',
                        aiSectionLoading === section.id
                          ? 'bg-primary-500/20 text-primary-300 cursor-wait'
                          : 'text-primary-400 hover:bg-primary-500/10 hover:text-primary-300'
                      )}
                      title="Auto Fill by AI"
                    >
                      {aiSectionLoading === section.id ? (
                        <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">AI Fill</span>
                    </button>
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
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary-400">Edit Section</span>
                      <button
                        onClick={() => handleAutoFillSection(section.id, section.name)}
                        disabled={aiSectionLoading === section.id}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                          aiSectionLoading === section.id
                            ? 'bg-primary-500/20 text-primary-300 cursor-wait'
                            : 'bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 hover:text-primary-300 border border-primary-500/30'
                        )}
                      >
                        {aiSectionLoading === section.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        {aiSectionLoading === section.id ? 'Generating...' : 'Auto Fill by AI'}
                      </button>
                    </div>
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
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">UI Notes</label>
                      <textarea
                        value={section.uiNotes || ''}
                        onChange={(e) => handleUpdateSection(section.id, { uiNotes: e.target.value })}
                        placeholder="UI/UX recommendations for this section"
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
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">SEO Notes</label>
                      <textarea
                        value={section.seoNotes || ''}
                        onChange={(e) => handleUpdateSection(section.id, { seoNotes: e.target.value })}
                        placeholder="SEO recommendations for this section"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Media Requirement</label>
                      <textarea
                        value={section.mediaRequirement || ''}
                        onChange={(e) => handleUpdateSection(section.id, { mediaRequirement: e.target.value })}
                        placeholder="What images, videos, or media this section needs"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-primary-500"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => handleAutoFillSection(section.id, section.name)}
                        disabled={aiSectionLoading === section.id}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                          aiSectionLoading === section.id
                            ? 'bg-primary-500/20 text-primary-300 cursor-wait'
                            : 'bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 hover:text-primary-300 border border-primary-500/30'
                        )}
                      >
                        {aiSectionLoading === section.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        {aiSectionLoading === section.id ? 'Regenerating...' : 'Regenerate with AI'}
                      </button>
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
  foundationalContext,
}: {
  website: WebsitePlanner;
  onUpdate: (updates: Partial<WebsitePlanner>) => void;
  foundationalContext?: FoundationalContext;
}) {
  const [activeContent, setActiveContent] = useState<'faqs' | 'case-studies' | 'sections'>('faqs');
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [newCaseStudy, setNewCaseStudy] = useState({ clientName: '', industry: '' });
  const [isGeneratingFaq, setIsGeneratingFaq] = useState(false);
  const [isGeneratingCaseStudy, setIsGeneratingCaseStudy] = useState(false);
  const [isGeneratingSection, setIsGeneratingSection] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

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

  const handleAiGenerateFaqs = useCallback(async () => {
    setIsGeneratingFaq(true);
    setAiError(null);
    try {
      const contextStr = foundationalContext
        ? buildAiContextString(website, foundationalContext)
        : `Website: ${website.name}, Goal: ${website.websiteGoal || 'N/A'}, Audience: ${website.targetAudience || 'N/A'}`;

      const result = await withRetry(() => callGLM([
        { role: 'system', content: 'You are a business content strategist. Generate FAQs that are relevant, informative, and optimised for SEO. Return ONLY a JSON array.' },
        { role: 'user', content: `Based on the following business context, generate 5 frequently asked questions with detailed answers for the website "${website.name}".\n\n${contextStr}\n\nReturn as a JSON array of objects with keys: question, answer. Each answer should be 2-3 sentences. Return ONLY the JSON array, no explanation.` },
      ], { temperature: 0.7, maxTokens: 2000, responseFormat: 'json_object' }));

      const parsed = parseJsonFromAI(result);
      const faqsArray = Array.isArray(parsed) ? parsed : parsed?.faqs || parsed?.questions || [];
      if (faqsArray.length > 0) {
        const newFaqs: WebsiteFAQ[] = faqsArray.map((faq: any) => ({
          id: crypto.randomUUID(),
          question: faq.question || faq.title || '',
          answer: faq.answer || faq.shortAnswer || '',
          seoImportance: 'medium' as const,
          schemaEnabled: true,
          aiGenerated: true,
        }));
        onUpdate({ faqs: [...website.faqs, ...newFaqs] });
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'FAQ generation failed');
    }
    setIsGeneratingFaq(false);
  }, [website, foundationalContext, onUpdate]);

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

  const handleAiGenerateCaseStudy = useCallback(async () => {
    setIsGeneratingCaseStudy(true);
    setAiError(null);
    try {
      const contextStr = foundationalContext
        ? buildAiContextString(website, foundationalContext)
        : `Website: ${website.name}, Type: ${website.websiteType}`;

      const result = await withRetry(() => callGLM([
        { role: 'system', content: 'You are a business content strategist. Generate a case study template based on the business context. Return ONLY valid JSON.' },
        { role: 'user', content: `Generate a case study for the website "${website.name}" based on the following context:\n\n${contextStr}\n\nReturn a JSON object with keys: clientName, industry, problem, solution, results, technologies (array of strings). Return ONLY the JSON object.` },
      ], { temperature: 0.7, maxTokens: 1500, responseFormat: 'json_object' }));

      const parsed = parseJsonFromAI(result);
      if (parsed && parsed.clientName) {
        const caseStudy: WebsiteCaseStudy = {
          id: crypto.randomUUID(),
          clientName: parsed.clientName,
          industry: parsed.industry || '',
          problem: parsed.problem || '',
          solution: parsed.solution || '',
          results: parsed.results || '',
          technologies: parsed.technologies || [],
        };
        onUpdate({ caseStudies: [...website.caseStudies, caseStudy] });
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Case study generation failed');
    }
    setIsGeneratingCaseStudy(false);
  }, [website, foundationalContext, onUpdate]);

  const handleAiGenerateSectionContent = useCallback(async (sectionId: string, sectionName: string) => {
    setIsGeneratingSection(sectionId);
    setAiError(null);
    try {
      const contextStr = foundationalContext
        ? buildAiContextString(website, foundationalContext)
        : `Website: ${website.name}, Goal: ${website.websiteGoal || 'N/A'}`;

      const result = await withRetry(() => callGLM([
        { role: 'system', content: 'You are a website content strategist. Generate content suggestions for website sections. Return ONLY valid JSON.' },
        { role: 'user', content: `Generate content suggestions for the "${sectionName}" section of a ${website.websiteType} website for "${website.name}".\n\nContext:\n${contextStr}\n\nReturn a JSON object with keys:\n- purpose: A clear purpose statement for this section (1-2 sentences)\n- contentRequirement: What content should be included (2-3 sentences)\n- uiNotes: UI/UX recommendations for this section (1-2 sentences)\n- suggestedCopy: Suggested headline or main copy text for this section\nReturn ONLY the JSON object.` },
      ], { temperature: 0.7, maxTokens: 1000, responseFormat: 'json_object' }));

      const parsed = parseJsonFromAI(result);
      if (parsed) {
        const updatedSections = website.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                purpose: parsed.purpose || s.purpose,
                contentRequirement: parsed.contentRequirement || s.contentRequirement,
                uiNotes: parsed.uiNotes || s.uiNotes,
              }
            : s
        );
        onUpdate({ sections: updatedSections });
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Section content generation failed');
    }
    setIsGeneratingSection(null);
  }, [website, foundationalContext, onUpdate]);

  return (
    <div className="space-y-6">
      {aiError && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {aiError}
          <button onClick={() => setAiError(null)} className="ml-auto text-red-400 hover:text-red-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800 overflow-x-auto scrollbar-none">
        {[
          { id: 'faqs' as const, label: 'FAQs', icon: MessageSquare, count: website.faqs.length },
          { id: 'case-studies' as const, label: 'Case Studies', icon: FileText, count: website.caseStudies.length },
          { id: 'sections' as const, label: 'Section Content', icon: PenTool, count: website.sections.filter(s => s.enabled).length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveContent(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeContent === tab.id
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* FAQs */}
      {activeContent === 'faqs' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-200">Add FAQ</h3>
              <button
                onClick={handleAiGenerateFaqs}
                disabled={isGeneratingFaq}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  isGeneratingFaq
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-primary-500/10 border border-primary-500/30 text-primary-400 hover:bg-primary-500/20'
                )}
              >
                <Sparkles className="w-3 h-3" />
                {isGeneratingFaq ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
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
                className={cn(
                  'bg-slate-800/50 border border-slate-700 rounded-lg p-4',
                  (faq as any).aiGenerated && 'border-primary-500/20'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-200">{faq.question}</h4>
                      {(faq as any).aiGenerated && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-primary-500/10 text-primary-400">AI</span>
                      )}
                    </div>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-200">Add Case Study</h3>
              <button
                onClick={handleAiGenerateCaseStudy}
                disabled={isGeneratingCaseStudy}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  isGeneratingCaseStudy
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-primary-500/10 border border-primary-500/30 text-primary-400 hover:bg-primary-500/20'
                )}
              >
                <Sparkles className="w-3 h-3" />
                {isGeneratingCaseStudy ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  className="w-full md:w-auto md:self-start px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Add Case Study
                </button>
              </div>
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
                    {caseStudy.problem && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{caseStudy.problem}</p>
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

      {/* Section Content AI */}
      {activeContent === 'sections' && (
        <div className="space-y-4">
          <div className="bg-primary-500/5 border border-primary-500/20 rounded-lg p-4">
            <h4 className="font-medium text-primary-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Section Content
            </h4>
            <p className="text-sm text-slate-400">
              Generate content suggestions for each enabled section. AI uses your brand identity and foundational data to create relevant, on-brand content.
            </p>
          </div>

          {website.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order).map((section) => (
            <div
              key={section.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-200">{section.name}</span>
                  <span className={cn(
                    'px-2 py-0.5 text-xs rounded-full',
                    section.priority === 'critical' && 'bg-red-500/10 text-red-400',
                    section.priority === 'high' && 'bg-orange-500/10 text-orange-400',
                    section.priority === 'medium' && 'bg-yellow-500/10 text-yellow-400',
                    section.priority === 'low' && 'bg-slate-500/10 text-slate-400'
                  )}>
                    {section.priority}
                  </span>
                </div>
                <button
                  onClick={() => handleAiGenerateSectionContent(section.id, section.name)}
                  disabled={isGeneratingSection === section.id}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    isGeneratingSection === section.id
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-primary-500/10 border border-primary-500/30 text-primary-400 hover:bg-primary-500/20'
                  )}
                >
                  <Sparkles className="w-3 h-3" />
                  {isGeneratingSection === section.id ? 'Generating...' : 'AI Content Suggestion'}
                </button>
              </div>

              {section.purpose && (
                <div className="mb-2">
                  <span className="text-xs text-slate-500">Purpose:</span>
                  <p className="text-sm text-slate-300">{section.purpose}</p>
                </div>
              )}
              {section.contentRequirement && (
                <div className="mb-2">
                  <span className="text-xs text-slate-500">Content Requirements:</span>
                  <p className="text-sm text-slate-300">{section.contentRequirement}</p>
                </div>
              )}
              {section.uiNotes && (
                <div>
                  <span className="text-xs text-slate-500">UI Notes:</span>
                  <p className="text-sm text-slate-300">{section.uiNotes}</p>
                </div>
              )}
              {!section.purpose && !section.contentRequirement && !section.uiNotes && (
                <p className="text-sm text-slate-500">No content generated yet. Click &ldquo;AI Content Suggestion&rdquo; to generate.</p>
              )}
            </div>
          ))}
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
  foundationalContext,
}: {
  website: WebsitePlanner;
  onCopy: (platform: string) => void;
  copied: boolean;
  foundationalContext?: FoundationalContext;
}) {
  const [selectedPlatform, setSelectedPlatform] = useState(AI_PLATFORMS[0].id);

  const ctx = foundationalContext;
  const contextBadges = [
    { label: 'Business', active: !!ctx?.businessProfile },
    { label: 'Brand', active: !!ctx?.brandStrategy },
    { label: 'ICPs', active: (ctx?.icps?.length || 0) > 0 },
    { label: 'Personas', active: (ctx?.personas?.length || 0) > 0 },
    { label: 'Competitors', active: (ctx?.competitors?.length || 0) > 0 },
    { label: 'Products', active: (ctx?.products?.length || 0) > 0 },
    { label: 'Visual Identity', active: !!ctx?.visualIdentity },
  ].filter(b => b.active);

  const handleDownloadPrompt = () => {
    const prompt = generatePrompt(website, selectedPlatform, foundationalContext);
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${website.name || 'website'}-prompt-${selectedPlatform}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

        {/* Context Badges */}
        {contextBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs text-slate-500 self-center mr-1">Included context:</span>
            {contextBadges.map(b => (
              <span key={b.label} className="px-2 py-1 text-xs rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                {b.label}
              </span>
            ))}
          </div>
        )}

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
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPrompt}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
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
          </div>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto">
            {generatePrompt(website, selectedPlatform, foundationalContext)}
          </pre>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-primary-500/5 border border-primary-500/20 rounded-lg p-4">
          <h4 className="font-medium text-primary-400 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Prompt Tips
          </h4>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Link foundational data in Data Sources tab for richer prompts</li>
            <li>• Fill in all website details for best results</li>
            <li>• Enable sections you want included in the prompt</li>
            <li>• Select features that are important for your project</li>
            <li>• Brand identity, ICPs, and personas are automatically included when linked</li>
            <li>• Copy and paste directly into your AI tool of choice</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function generatePrompt(website: WebsitePlanner, platform: string, ctx?: FoundationalContext): string {
  const sections = website.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order)
    .map((s) => `  - ${s.name} (Priority: ${s.priority}${s.purpose ? `. Purpose: ${s.purpose}` : ''})`)
    .join('\n');

  const features = website.features
    .filter((f) => f.enabled)
    .map((f) => `  - ${f.name} (Complexity: ${f.complexity}, Priority: ${f.priority}${f.notes ? `. Notes: ${f.notes}` : ''})`)
    .join('\n');

  let prompt = `Create a professional ${website.websiteType} website for "${website.name}" using ${platform}.

WEBSITE GOAL:
${website.websiteGoal || 'To establish a strong online presence and convert visitors into customers.'}

TARGET AUDIENCE:
${website.targetAudience || 'Business professionals and decision-makers'}

PRIMARY CTA:
${website.primaryCTA || 'Contact Us'}

SECONDARY CTA:
${website.secondaryCTA || 'Learn More'}

SECTIONS TO INCLUDE:
${sections || '  None specified'}

FEATURES REQUIRED:
${features || '  None specified'}

LANGUAGE: ${website.language}
REGION: ${website.country || 'Global'}`;

  // Brand Identity
  if (ctx?.brandStrategy || ctx?.visualIdentity) {
    prompt += '\n\nBRAND IDENTITY:';
    if (ctx.brandStrategy) {
      const bs = ctx.brandStrategy;
      if (bs.brandName) prompt += `\n  Brand Name: ${bs.brandName}`;
      if (bs.tagline) prompt += `\n  Tagline: ${bs.tagline}`;
      if (bs.brandPromise) prompt += `\n  Brand Promise: ${bs.brandPromise}`;
      if (bs.brandVoice) prompt += `\n  Brand Voice: ${bs.brandVoice}`;
      if (bs.brandArchetype) prompt += `\n  Brand Archetype: ${bs.brandArchetype}`;
      if (bs.brandPersonality?.length) prompt += `\n  Personality Traits: ${bs.brandPersonality.join(', ')}`;
      if (bs.brandValues?.length) prompt += `\n  Brand Values: ${bs.brandValues.join(', ')}`;
      if (bs.brandPositioning) prompt += `\n  Positioning: ${bs.brandPositioning}`;
      if (bs.uniqueValueProposition) prompt += `\n  Unique Value Proposition: ${bs.uniqueValueProposition}`;
      if (bs.emotionalBenefits) prompt += `\n  Emotional Benefits: ${bs.emotionalBenefits}`;
      if (bs.rationalBenefits) prompt += `\n  Rational Benefits: ${bs.rationalBenefits}`;
      if (bs.elevatorPitch) prompt += `\n  Elevator Pitch: ${bs.elevatorPitch}`;
      if (bs.brandMessage) prompt += `\n  Brand Message: ${bs.brandMessage}`;
      if (bs.keyMessages?.length) prompt += `\n  Key Messages: ${bs.keyMessages.join('; ')}`;
      if (bs.toneGuidelines) prompt += `\n  Tone Guidelines: ${bs.toneGuidelines}`;
    }
    // Brand Tone Attributes (slider values)
    if (ctx.brandStrategy?.toneAttributes) {
      const ta = ctx.brandStrategy.toneAttributes;
      prompt += '\n  TONE ATTRIBUTES:';
      if (ta.professional !== undefined) prompt += `\n    Professional: ${ta.professional}/100`;
      if (ta.friendly !== undefined) prompt += `\n    Friendly: ${ta.friendly}/100`;
      if (ta.authoritative !== undefined) prompt += `\n    Authoritative: ${ta.authoritative}/100`;
      if (ta.playful !== undefined) prompt += `\n    Playful: ${ta.playful}/100`;
      if (ta.empathetic !== undefined) prompt += `\n    Empathetic: ${ta.empathetic}/100`;
      if (ta.bold !== undefined) prompt += `\n    Bold: ${ta.bold}/100`;
    }
    // Brand Target Audience
    if (ctx.brandStrategy?.targetAudience) {
      const tAud = ctx.brandStrategy.targetAudience;
      prompt += '\n  BRAND TARGET AUDIENCE:';
      if (tAud.demographics) prompt += `\n    Demographics: ${tAud.demographics}`;
      if (tAud.psychographics) prompt += `\n    Psychographics: ${tAud.psychographics}`;
      if (tAud.painPoints?.length) prompt += `\n    Pain Points: ${tAud.painPoints.join(', ')}`;
      if (tAud.desires?.length) prompt += `\n    Desires: ${tAud.desires.join(', ')}`;
      if (tAud.behaviors) prompt += `\n    Behaviours: ${tAud.behaviors}`;
    }
    if (ctx.visualIdentity) {
      const vi = ctx.visualIdentity;
      prompt += '\n  COLOUR SCHEME:';
      if (vi.primaryColor) prompt += `\n    Primary: ${vi.primaryColor}`;
      if (vi.secondaryColor) prompt += `\n    Secondary: ${vi.secondaryColor}`;
      if (vi.accentColor) prompt += `\n    Accent: ${vi.accentColor}`;
      if (vi.backgroundColor) prompt += `\n    Background: ${vi.backgroundColor}`;
      if (vi.surfaceColor) prompt += `\n    Surface: ${vi.surfaceColor}`;
      if (vi.textColor) prompt += `\n    Text: ${vi.textColor}`;
      if (vi.textMutedColor) prompt += `\n    Muted Text: ${vi.textMutedColor}`;
      prompt += '\n  TYPOGRAPHY:';
      if (vi.headingFont) prompt += `\n    Heading Font: ${vi.headingFont}`;
      if (vi.bodyFont) prompt += `\n    Body Font: ${vi.bodyFont}`;
      if (vi.accentFont) prompt += `\n    Accent Font: ${vi.accentFont}`;
      if (vi.monoFont) prompt += `\n    Monospace Font: ${vi.monoFont}`;
      if (vi.headingLineHeight) prompt += `\n    Heading Line Height: ${vi.headingLineHeight}`;
      if (vi.bodyLineHeight) prompt += `\n    Body Line Height: ${vi.bodyLineHeight}`;
      prompt += '\n  DESIGN TOKENS:';
      if (vi.borderRadiusSm) prompt += `\n    Border Radius Small: ${vi.borderRadiusSm}`;
      if (vi.borderRadiusMd) prompt += `\n    Border Radius Medium: ${vi.borderRadiusMd}`;
      if (vi.borderRadiusLg) prompt += `\n    Border Radius Large: ${vi.borderRadiusLg}`;
      if (vi.sectionSpacing) prompt += `\n    Section Spacing: ${vi.sectionSpacing}`;
      if (vi.componentSpacing) prompt += `\n    Component Spacing: ${vi.componentSpacing}`;
      if (vi.iconStyle?.name) prompt += `\n    Icon Style: ${vi.iconStyle.name}`;
      if (vi.imageStyle?.name) prompt += `\n    Image Style: ${vi.imageStyle.name}`;
    }
  }

  // Business Context — comprehensive company data
  if (ctx?.businessProfile) {
    const bp = ctx.businessProfile;
    prompt += '\n\nBUSINESS CONTEXT:';
    if (bp.name || bp.companyName) prompt += `\n  Company: ${bp.name || bp.companyName}`;
    if (bp.description) prompt += `\n  Description: ${bp.description}`;
    if (bp.descriptionLong) prompt += `\n  Detailed Description: ${bp.descriptionLong}`;
    if (bp.mission) prompt += `\n  Mission: ${bp.mission}`;
    if (bp.vision) prompt += `\n  Vision: ${bp.vision}`;
    if (bp.coreValues) prompt += `\n  Core Values: ${bp.coreValues}`;
    if (bp.usp) prompt += `\n  Unique Selling Proposition: ${bp.usp}`;
    if (bp.primaryIndustry) prompt += `\n  Industry: ${bp.primaryIndustry}`;
    if (bp.secondaryIndustries) prompt += `\n  Secondary Industries: ${bp.secondaryIndustries}`;
    if (bp.businessModel) prompt += `\n  Business Model: ${bp.businessModel}`;
    if (bp.targetGeography) prompt += `\n  Target Geography: ${bp.targetGeography}`;
    if (bp.primaryOffering) prompt += `\n  Primary Offering: ${bp.primaryOffering}`;
    if (bp.secondaryOfferings) prompt += `\n  Secondary Offerings: ${bp.secondaryOfferings}`;
    if (bp.pricingModel) prompt += `\n  Pricing Model: ${bp.pricingModel}`;
    if (bp.stage) prompt += `\n  Business Stage: ${bp.stage}`;
    if (bp.teamSize) prompt += `\n  Team Size: ${bp.teamSize}`;
    // Contact details
    const contactParts: string[] = [];
    if (bp.email) contactParts.push(`Email: ${bp.email}`);
    if (bp.phone) contactParts.push(`Phone: ${bp.phone}`);
    if (bp.website) contactParts.push(`Website: ${bp.website}`);
    if (bp.address) contactParts.push(`Address: ${bp.address}`);
    if (bp.city || bp.country) contactParts.push(`Location: ${[bp.city, bp.country].filter(Boolean).join(', ')}`);
    if (contactParts.length) prompt += `\n  Contact: ${contactParts.join('; ')}`;
    // Social profiles
    if (bp.socialProfiles) {
      const socialParts: string[] = [];
      const sp = bp.socialProfiles;
      if (sp.linkedIn) socialParts.push(`LinkedIn: ${sp.linkedIn}`);
      if (sp.twitter) socialParts.push(`Twitter: ${sp.twitter}`);
      if (sp.instagram) socialParts.push(`Instagram: ${sp.instagram}`);
      if (sp.facebook) socialParts.push(`Facebook: ${sp.facebook}`);
      if (sp.youTube) socialParts.push(`YouTube: ${sp.youTube}`);
      if (sp.tikTok) socialParts.push(`TikTok: ${sp.tikTok}`);
      if (sp.whatsApp) socialParts.push(`WhatsApp: ${sp.whatsApp}`);
      if (sp.telegram) socialParts.push(`Telegram: ${sp.telegram}`);
      if (sp.googleBusiness) socialParts.push(`Google Business: ${sp.googleBusiness}`);
      if (sp.threads) socialParts.push(`Threads: ${sp.threads}`);
      if (sp.medium) socialParts.push(`Medium: ${sp.medium}`);
      if (sp.reddit) socialParts.push(`Reddit: ${sp.reddit}`);
      if (sp.quora) socialParts.push(`Quora: ${sp.quora}`);
      if (sp.pinterest) socialParts.push(`Pinterest: ${sp.pinterest}`);
      if (sp.github) socialParts.push(`GitHub: ${sp.github}`);
      if (sp.website) socialParts.push(`Social Website: ${sp.website}`);
      if (socialParts.length) prompt += `\n  Social Links: ${socialParts.join('; ')}`;
    }
  }

  // Founders & Website Owner
  if (ctx?.founders?.length) {
    prompt += '\n\nFOUNDERS & WEBSITE OWNERS:';
    ctx.founders.forEach((f: any) => {
      prompt += `\n  - ${f.name}`;
      if (f.title) prompt += ` (${f.title})`;
      if (f.responsibilityArea) prompt += `, Area: ${f.responsibilityArea}`;
      if (f.bio) prompt += `\n    Bio: ${f.bio.substring(0, 300)}`;
      if (f.expertise?.length) prompt += `\n    Expertise: ${f.expertise.join(', ')}`;
      if (f.email) prompt += `\n    Email: ${f.email}`;
      if (f.phone) prompt += `\n    Phone: ${f.phone}`;
      if (f.city || f.country) prompt += `\n    Location: ${[f.city, f.country].filter(Boolean).join(', ')}`;
      if (f.socialProfiles) {
        const fsParts: string[] = [];
        const fs = f.socialProfiles;
        if (fs.linkedIn) fsParts.push(`LinkedIn: ${fs.linkedIn}`);
        if (fs.twitter) fsParts.push(`Twitter: ${fs.twitter}`);
        if (fs.instagram) fsParts.push(`Instagram: ${fs.instagram}`);
        if (fs.youTube) fsParts.push(`YouTube: ${fs.youTube}`);
        if (fs.website) fsParts.push(`Website: ${fs.website}`);
        if (fsParts.length) prompt += `\n    Social: ${fsParts.join('; ')}`;
      }
    });
  }

  // ICPs
  if (ctx?.icps?.length) {
    prompt += '\n\nIDEAL CUSTOMER PROFILES:';
    ctx.icps.forEach((icp: any) => {
      prompt += `\n  - ${icp.name}`;
      if (icp.industry) prompt += ` (Industry: ${icp.industry})`;
      if (icp.companySize) prompt += `, Size: ${icp.companySize}`;
      if (icp.challenges?.length) prompt += `, Challenges: ${icp.challenges.join('; ')}`;
      if (icp.painPoints?.length) prompt += `, Pain Points: ${icp.painPoints.join('; ')}`;
      if (icp.businessGoals?.length) prompt += `, Goals: ${icp.businessGoals.join('; ')}`;
    });
  }

  // Personas
  if (ctx?.personas?.length) {
    prompt += '\n\nBUYER PERSONAS:';
    ctx.personas.forEach((p: any) => {
      prompt += `\n  - ${p.name}`;
      if (p.jobTitle) prompt += ` (${p.jobTitle})`;
      if (p.industry) prompt += `, Industry: ${p.industry}`;
      if (p.ageRange) prompt += `, Age: ${p.ageRange}`;
      if (p.painPoints?.length) prompt += `, Pain Points: ${p.painPoints.join('; ')}`;
      if (p.goals?.length) prompt += `, Goals: ${p.goals.join('; ')}`;
      if (p.motivations?.length) prompt += `, Motivations: ${p.motivations.join('; ')}`;
    });
  }

  // Competitors
  if (ctx?.competitors?.length) {
    prompt += '\n\nCOMPETITORS:';
    ctx.competitors.forEach((c: any) => {
      prompt += `\n  - ${c.name}`;
      if (c.website) prompt += ` (${c.website})`;
      if (c.marketPosition) prompt += `, Position: ${c.marketPosition}`;
      if (c.strengths?.length) prompt += `, Strengths: ${Array.isArray(c.strengths) ? c.strengths.join('; ') : c.strengths}`;
      if (c.weaknesses?.length) prompt += `, Weaknesses: ${Array.isArray(c.weaknesses) ? c.weaknesses.join('; ') : c.weaknesses}`;
    });
  }

  // Products/Services
  if (ctx?.products?.length) {
    prompt += '\n\nPRODUCTS/SERVICES:';
    ctx.products.forEach((p: any) => {
      prompt += `\n  - ${p.name}`;
      if (p.description) prompt += `: ${p.description}`;
      if (p.price) prompt += ` (Price: ${p.price})`;
      if (p.usp) prompt += `, USP: ${p.usp}`;
    });
  }

  // Product Categories
  if (ctx?.productCategories?.length) {
    prompt += '\n\nPRODUCT CATEGORIES:';
    ctx.productCategories.forEach((pc: any) => {
      prompt += `\n  - ${pc.name}`;
      if (pc.description) prompt += `: ${pc.description}`;
    });
  }

  // Brand Assets
  if (ctx?.brandAssets?.length) {
    prompt += '\n\nBRAND ASSETS:';
    ctx.brandAssets.forEach((ba: any) => {
      prompt += `\n  - ${ba.name}`;
      if (ba.type) prompt += ` (${ba.type})`;
      if (ba.thumbnailUrl) prompt += ` [Image available]`;
    });
  }

  // Sales Collateral
  if (ctx?.salesCollateral?.length) {
    prompt += '\n\nSALES COLLATERAL:';
    ctx.salesCollateral.slice(0, 10).forEach((sc: any) => {
      prompt += `\n  - ${sc.name || sc.title || 'Document'}`;
      if (sc.type || sc.scriptType) prompt += ` (${sc.type || sc.scriptType})`;
      if (sc.funnelStage) prompt += ` [Stage: ${sc.funnelStage}]`;
      if (sc.description) prompt += `: ${sc.description.substring(0, 100)}`;
    });
  }

  // Testimonials
  if (ctx?.testimonials?.length) {
    prompt += '\n\nTESTIMONIALS:';
    ctx.testimonials.forEach((t: any) => {
      prompt += `\n  - ${t.customerName || t.name || t.author || 'Unknown'}`;
      if (t.customerDesignation) prompt += `, ${t.customerDesignation}`;
      if (t.customerCompany) prompt += ` at ${t.customerCompany}`;
      if (t.shortQuote) prompt += `: "${t.shortQuote}"`;
      else if (t.fullTestimonial) prompt += `: "${t.fullTestimonial.substring(0, 150)}"`;
      if (t.rating) prompt += ` [Rating: ${t.rating}/5]`;
    });
  }

  // Feature-specific prompt extensions
  const enabledFeatureNames = website.features.filter((f) => f.enabled).map((f) => f.name);
  const featurePrompts = getFeaturePrompts(enabledFeatureNames);
  if (featurePrompts) {
    prompt += '\n\nFEATURE-SPECIFIC REQUIREMENTS:\n' + featurePrompts;
  }

  // SEO Keywords
  if (website.targetKeywords?.length) {
    prompt += `\n\nSEO TARGET KEYWORDS:\n${website.targetKeywords.map(k => `  - ${k}`).join('\n')}`;
  }

  // Foundational FAQs
  if (ctx?.faqs?.length) {
    prompt += '\n\nEXISTING FAQ CONTEXT (use as reference):';
    ctx.faqs.slice(0, 10).forEach((faq: any) => {
      prompt += `\n  Q: ${faq.question || faq.title}`;
      if (faq.answer || faq.shortAnswer) prompt += `\n  A: ${faq.shortAnswer || faq.answer}`;
    });
  }

  // Website Owner auto-resolved from founder or business profile
  const ownerName = website.owner || (ctx?.founders?.length ? ctx.founders[0].name : ctx?.businessProfile?.name);
  if (ownerName) {
    prompt += `\n\nWEBSITE OWNER: ${ownerName}`;
  }

  prompt += `

MOBILE RESPONSIVENESS:
  - Mobile-first responsive design
  - Touch-friendly navigation and interactive elements
  - Optimised images and lazy loading
  - Viewport meta tag and proper scaling

CTA STRATEGY:
  - Primary CTA: ${website.primaryCTA || 'Contact Us'} — use brand voice and prominent placement
  - Secondary CTA: ${website.secondaryCTA || 'Learn More'} — complementary positioning
  - CTAs should appear above the fold and at logical decision points

Please provide:
1. Complete website structure with all sections and their content
2. Section-by-section content recommendations informed by the brand identity and target audience
3. UI/UX design suggestions aligned with the brand colours and typography
4. Colour scheme and typography implementation details
5. Call-to-action placements and messaging consistent with brand voice
6. SEO optimization recommendations for each page
7. Responsive design and mobile-first considerations
8. Accessibility requirements (WCAG 2.1 AA compliance)
9. Technical architecture recommendations for the enabled features
10. Performance optimisation strategies

Generate production-ready specifications that can be implemented in ${platform}.`;

  return prompt;
}

// ============================================
// DATA SOURCES TAB - Link ERP Module Data
// ============================================

function DataSourcesTab({
  website,
  onUpdate,
  foundationalContext,
}: {
  website: WebsitePlanner;
  onUpdate: (updates: Partial<WebsitePlanner>) => void;
  foundationalContext?: FoundationalContext;
}) {
  const linkedData = website.linkedData || {};

  // Derive all data from shared foundationalContext — no duplicate API calls
  const businessProfileData = foundationalContext?.businessProfile || null;
  const foundersData = foundationalContext?.founders || [];
  const icpsData = foundationalContext?.allIcps || [];
  const personasData = foundationalContext?.allPersonas || [];
  const brandStrategyData = foundationalContext?.brandStrategy || null;
  const visualIdentityData = foundationalContext?.visualIdentity || null;
  const productsData = foundationalContext?.allProducts || [];
  const productCategoriesData = foundationalContext?.allProductCategories || [];
  const competitorsData = foundationalContext?.allCompetitors || [];
  const brandAssetsData = foundationalContext?.allBrandAssets || [];
  const faqsData = foundationalContext?.allFaqs || [];
  const salesCollateralData = foundationalContext?.allSalesCollateral || [];
  const testimonialsData = foundationalContext?.allTestimonials || [];

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
      linkedData: {
        ...linkedData,
        [`${type}Ids`]: newIds,
      },
    });
  };

  const toggleSingleLink = (type: string, id: string) => {
    const currentId = (linkedData as any)[`${type}Id`];
    onUpdate({
      linkedData: {
        ...linkedData,
        [`${type}Id`]: currentId === id ? undefined : id,
      },
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
          <Link className="w-4 h-4" />
          Linked Data for Research & SEO
        </h4>
        <p className="text-sm text-slate-400">
          Link data from other modules to enrich your website content, improve SEO, and generate
          more accurate AI prompts. Select items to include their data in website planning.
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

        {/* Brand Strategy — fetched from module-data API */}
        <DataSection
          title="Brand Strategy"
          icon={Bot}
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

        {/* Visual Identity — fetched from module-data API */}
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

        {/* FAQs & Sales */}
        <DataSection
          title="FAQ Bank"
          icon={MessageSquare}
          items={faqsData}
          type="faq"
          isArray
          emptyMessage="No FAQs available. Add FAQs in the FAQ Bank module to enrich your website."
          renderItem={(item) => (
            <div>
              <div className="font-medium text-slate-200 truncate">{item.question || item.title}</div>
              {item.category && <div className="text-xs text-slate-500">{item.category}</div>}
            </div>
          )}
        />

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
                {item.status && <span className="text-xs text-slate-600 capitalize">{item.status}</span>}
              </div>
            </div>
          )}
        />

        <DataSection
          title="Testimonials"
          icon={MessageSquare}
          items={testimonialsData}
          type="testimonial"
          isArray
          emptyMessage="No testimonials available. Add testimonials to build trust on your website."
          renderItem={(item) => (
            <div className="min-w-0">
              <div className="font-medium text-slate-200">{item.customerName || item.name || item.author}</div>
              {(item.customerDesignation || item.customerCompany) && (
                <div className="text-xs text-slate-500">
                  {[item.customerDesignation, item.customerCompany].filter(Boolean).join(' at ')}
                </div>
              )}
              {item.shortQuote && (
                <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">&ldquo;{item.shortQuote}&rdquo;</div>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
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
