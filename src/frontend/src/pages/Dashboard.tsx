/**
 * Dashboard Page
 *
 * Main dashboard with stat cards and module grid for all 60+ modules.
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MODULES, GROUPS, getModulesByGroup } from '@/lib/modules';
import { useDataStore, useTaskStore, useAuthStore, useCompanyStore } from '@/stores';
import {
  founderApi, employeeApi, competitorApi, brandAssetApi,
  stationeryApi, hrAssetApi, testimonialApi, salesScriptApi,
  salesCollateralApi, videoContentApi, faqApi,
  socialStrategyApi, landingPageApi, blogPostApi,
  newsletterPostApi,
} from '@/services/api';
import { cn } from '@/utils/cn';
import {
  Users,
  Users2,
  Package,
  Swords,
  FileText,
  HelpCircle,
  TrendingUp,
  Clock,
  Sparkles,
  Circle,
  LayoutDashboard,
  Building2,
  Target,
  Settings,
  Palette,
  Brain,
  BookOpen,
  Paintbrush,
  FolderHeart,
  Globe,
  FileEdit,
  Mail,
  Library,
  MessageSquareQuote,
  FileCode,
  Phone,
  FileStack,
  Video,
  PanelTop,
  BookMarked,
  Search,
  Megaphone,
  Newspaper,
  MailPlus,
  GraduationCap,
  Calendar,
  CalendarDays,
  Gift,
  CreditCard,
  Share2,
  ClipboardList,
  Scale,
  Layers,
  Zap,
  Settings2,
  Cpu,
  Image as ImageIcon,
  type LucideIcon,
} from 'lucide-react';

// Icon lookup for module cards — maps module icon names to components
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard, Building2, Users, Users2, Target, Package, Swords,
  Settings, Palette, Brain, BookOpen, Paintbrush, Image: ImageIcon,
  FileText, FolderHeart, Globe, FileEdit, Mail, HelpCircle, Library,
  MessageSquareQuote, FileCode, Phone, FileStack, Video, PanelTop,
  BookMarked, Search, Megaphone, Newspaper, MailPlus, GraduationCap,
  Calendar, CalendarDays, Gift, CreditCard, Share2, ClipboardList,
  Scale, Clock, Sparkles, Layers, TrendingUp, Zap, Settings2, Cpu, Circle,
};

// ============================================
// MODULE ID → DATA STORE KEY MAPPING
// ============================================

const MODULE_DATA_KEY_MAP: Record<string, string> = {
  // Foundation
  'business-profile': 'businessProfiles',
  founders: 'founders',
  employees: 'employees',
  'icp-personas': 'icps',
  products: 'products',
  competitors: 'competitors',
  // Brand
  brand: 'brand',
  'brand-assets': 'brandAssets',
  stationery: 'stationery',
  'hr-assets': 'jobPostings',
  // Content
  'website-planner': 'websitePlanners',
  'blog-content-os': 'blogPosts',
  'newsletter-content-os': 'newsletterPosts',
  'faq-bank': 'faqs',
  'content-library': 'contentItems',
  'stories-campaigns': 'stories',
  testimonials: 'testimonials',
  // Sales
  'landing-pages': 'landingPages',
  'sales-scripts': 'salesScripts',
  'sales-collateral': 'salesCollateral',
  'video-content': 'videoContent',
  banners: 'banners',
  books: 'books',
  // Marketing
  seo: 'seoPages',
  ads: 'ads',
  pr: 'prItems',
  'email-templates': 'emailTemplates',
  courses: 'courses',
  events: 'events',
  'social-media-os': 'socialCalendarEntries',
  // Programs
  'loyalty-programme': 'loyaltyProgrammes',
  'membership-plans': 'membershipPlans',
  'referral-programme': 'referralProgrammes',
  sops: 'sops',
  // Ops
  'legal-documents': 'legalDocuments',
};

// Modules that use direct API + local state (not dataStore)
const API_COUNT_MODULES: Record<string, (companyId: string) => Promise<number>> = {
  founders: async (cid) => { const r = await founderApi.getAll(cid); return (r.data as any[])?.length || 0; },
  employees: async (cid) => { const r = await employeeApi.getAll(cid); return (r.data as any[])?.length || 0; },
  competitors: async (cid) => { const r = await competitorApi.getAll(cid); return (r.data as any[])?.length || 0; },
  'brand-assets': async (cid) => { const r = await brandAssetApi.getAll(cid); return (r.data as any[])?.length || 0; },
  stationery: async (cid) => { const r = await stationeryApi.getAll(cid); return (r.data as any[])?.length || 0; },
  'hr-assets': async (cid) => { const r = await hrAssetApi.getAll(cid); return (r.data as any[])?.length || 0; },
  testimonials: async (cid) => { const r = await testimonialApi.getAll(cid); return (r.data as any[])?.length || 0; },
  'sales-scripts': async (cid) => { const r = await salesScriptApi.getAll(cid); return (r.data as any[])?.length || 0; },
  'sales-collateral': async (cid) => { const r = await salesCollateralApi.getAll(cid); return (r.data as any[])?.length || 0; },
  'video-content': async (cid) => { const r = await videoContentApi.getAll(cid); return (r.data as any[])?.length || 0; },
  'faq-bank': async (cid) => { const r = await faqApi.getAll(cid); return (r.data as any[])?.length || 0; },
  'social-media-os': async (cid) => { const r = await socialStrategyApi.getAll(cid); return (r.data as any[])?.length || 0; },
  'landing-pages': async (cid) => { const r = await landingPageApi.getAll(cid); return (r.data as any[])?.length || 0; },
  'blog-content-os': async (cid) => { const r = await blogPostApi.getAll(cid); return (r.data as any[])?.length || 0; },
  'newsletter-content-os': async (cid) => { const r = await newsletterPostApi.getAll(cid); return (r.data as any[])?.length || 0; },
};

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({
  icon: Icon,
  label,
  value,
  color = 'primary',
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: 'primary' | 'success' | 'warning' | 'info';
}) {
  const colorClasses = {
    primary: 'bg-[#C8FF2E]/10 text-[#C8FF2E]',
    success: 'bg-green-500/10 text-green-400',
    warning: 'bg-yellow-500/10 text-yellow-400',
    info: 'bg-blue-500/10 text-blue-400',
  };

  return (
    <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-[#C8FF2E]/30 transition-all">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-[#878e9a]">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MODULE CARD COMPONENT
// ============================================

function ModuleCard({
  module,
  itemCount,
}: {
  module: (typeof MODULES)[0];
  itemCount: number;
}) {
  const Icon = (ICON_MAP[module.icon] as LucideIcon) || Circle;
  const group = GROUPS.find((g) => g.id === module.group);

  return (
    <Link
      href={module.path}
      className="group block bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-[#C8FF2E]/30 transition-all hover:shadow-[0_0_20px_rgba(200,255,46,0.1)]"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${group?.color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: group?.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white group-hover:text-[#C8FF2E] transition-colors">
              {module.name}
            </h3>
            {itemCount > 0 && (
              <span className="text-xs bg-[#1a1d21] text-[#afb6c4] px-2 py-0.5 rounded-full border border-white/10">
                {itemCount}
              </span>
            )}
          </div>
          <p className="text-xs text-[#878e9a] mt-1 line-clamp-2">{module.description}</p>
          {module.hasAI && (
            <div className="flex items-center gap-1 mt-2">
              <Sparkles className="w-3 h-3 text-[#C8FF2E]" />
              <span className="text-[10px] text-[#C8FF2E]">AI-powered</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ============================================
// DASHBOARD COMPONENT
// ============================================

export default function Dashboard() {
  const { getStats, data, activeCompanyId } = useDataStore();
  const { runningTaskCount } = useTaskStore();
  const { user } = useAuthStore();
  const { activeCompanyId: companyId } = useCompanyStore();
  const stats = getStats();

  // Hydration guard — don't render dynamic values until client rehydrates
  const [mounted, setMounted] = useState(false);

  // API-fetched counts for modules not in dataStore
  const [apiCounts, setApiCounts] = useState<Record<string, number>>({});

  // Get module counts from data store + API counts
  const companyData = (activeCompanyId || companyId) ? data[activeCompanyId || companyId || ''] : null;

  const getModuleCount = (moduleId: string): number => {
    if (!mounted) return 0; // Avoid hydration mismatch
    // API counts take priority
    if (apiCounts[moduleId] !== undefined) return apiCounts[moduleId];
    if (!companyData) return 0;
    const dataKey = MODULE_DATA_KEY_MAP[moduleId];
    if (!dataKey) return 0;
    const value = (companyData as any)[dataKey];
    if (value === null || value === undefined) return 0;
    if (Array.isArray(value)) return value.length;
    if (typeof value === 'object') return 1; // single object like Brand
    return 0;
  };

  // Fetch API counts on mount
  useEffect(() => {
    setMounted(true);
    const cid = activeCompanyId || companyId;
    if (!cid) return;

    const fetchCounts = async () => {
      const entries = Object.entries(API_COUNT_MODULES);
      const results = await Promise.allSettled(
        entries.map(async ([modId, fetcher]) => {
          try {
            const count = await fetcher(cid);
            return { modId, count };
          } catch {
            return { modId, count: 0 };
          }
        })
      );

      const counts: Record<string, number> = {};
      results.forEach((r) => {
        if (r.status === 'fulfilled') {
          counts[r.value.modId] = r.value.count;
        }
      });
      setApiCounts(counts);
    };

    fetchCounts();
  }, [activeCompanyId, companyId]);

  // Compute stat card counts from API + dataStore (guard hydration)
  const statCounts = {
    founders: mounted ? (apiCounts.founders ?? stats.founders) : 0,
    employees: mounted ? (apiCounts.employees ?? stats.employees) : 0,
    products: mounted ? stats.products : 0,
    competitors: mounted ? (apiCounts.competitors ?? 0) : 0,
    blogs: mounted ? (apiCounts['blog-content-os'] ?? stats.blogs) : 0,
    faqs: mounted ? (apiCounts['faq-bank'] ?? stats.faqs) : 0,
    landingPages: mounted ? (apiCounts['landing-pages'] ?? 0) : 0,
    runningTasks: mounted ? runningTaskCount : 0,
  };

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-[#878e9a] mt-1">
              Welcome back{mounted && user?.name ? `, ${user.name}` : ''}! Manage your marketing across all modules.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Founders"
            value={statCounts.founders}
            color="success"
          />
          <StatCard
            icon={Users2}
            label="Employees"
            value={statCounts.employees}
            color="info"
          />
          <StatCard
            icon={Package}
            label="Products"
            value={statCounts.products}
            color="warning"
          />
          <StatCard
            icon={Swords}
            label="Competitors"
            value={statCounts.competitors}
            color="primary"
          />
          <StatCard
            icon={FileText}
            label="Blogs"
            value={statCounts.blogs}
            color="success"
          />
          <StatCard
            icon={HelpCircle}
            label="FAQs"
            value={statCounts.faqs}
            color="info"
          />
          <StatCard
            icon={TrendingUp}
            label="Landing Pages"
            value={statCounts.landingPages}
            color="primary"
          />
          <StatCard
            icon={Clock}
            label="Running Tasks"
            value={statCounts.runningTasks}
            color={statCounts.runningTasks > 0 ? 'warning' : 'primary'}
          />
        </div>

        {/* Module Grid by Group */}
        <div className="space-y-8">
          {GROUPS.map((group) => {
            const groupModules = getModulesByGroup(group.id).filter(
              (m) => m.status === 'active'
            );
            if (groupModules.length === 0) return null;

            return (
              <section key={group.id}>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-2 h-6 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <h2 className="text-lg font-semibold text-white">{group.name}</h2>
                  <span className="text-sm text-[#878e9a]">
                    ({groupModules.length} modules)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupModules.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      itemCount={getModuleCount(module.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    );
  }