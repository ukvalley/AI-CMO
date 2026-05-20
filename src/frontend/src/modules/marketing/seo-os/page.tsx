/**
 * SEO Operating System
 *
 * Centralized SEO management across all modules with:
 * - Strategy configuration
 * - SEO records for all source modules
 * - Keyword bank management
 * - SEO audit dashboard
 * - Calendar for scheduled optimizations
 */

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Search, Target, FileText, Layout, Hash, CheckCircle, Download,
  Plus, Trash2, ChevronDown, ChevronRight, RefreshCw, X, Clock,
  BarChart3, Building2, Settings, Copy, PenTool, Layers, AlertTriangle,
  Table, AlignLeft, ExternalLink, Lightbulb, Link, Zap, Eye,
  TrendingUp, Users, Package, Globe, BookOpen, Calendar, Megaphone,
  FileCode, MessageSquare, Video, Award, Briefcase,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDataStore, useCompanyStore } from '@/stores';
import type {
  SeoSystem, SeoStrategy, SeoRecord, SeoKeyword, SeoKeywordBank, SeoAudit,
  SeoSourceModule, SeoRecordStatus, SeoPriority, SeoSchemaType, RobotsDirective,
  TwitterCardType, SeoSearchIntent, SeoIssue, SeoIssueType, SeoIssueSeverity,
  SEOPageType,
  Brand, BusinessProfile, ICP, Persona, Product, Competitor, Blog, LandingPage,
  FAQ, Testimonial, Course, Event, Newsletter, SalesCollateral, VideoContent,
} from '@/types/entities';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const SOURCE_MODULE_CONFIG: Record<SeoSourceModule, { label: string; icon: any; color: string; description: string }> = {
  products: { label: 'Products', icon: Package, color: 'text-blue-400', description: 'Product pages SEO' },
  blogs: { label: 'Blogs', icon: BookOpen, color: 'text-green-400', description: 'Blog post SEO' },
  'landing-pages': { label: 'Landing Pages', icon: FileCode, color: 'text-purple-400', description: 'Landing page SEO' },
  'website-pages': { label: 'Website Pages', icon: Globe, color: 'text-cyan-400', description: 'Website page SEO' },
  faqs: { label: 'FAQs', icon: MessageSquare, color: 'text-amber-400', description: 'FAQ schema SEO' },
  'business-profile': { label: 'Business Profile', icon: Building2, color: 'text-pink-400', description: 'Homepage SEO' },
  founders: { label: 'Founders', icon: Users, color: 'text-indigo-400', description: 'Founder profile SEO' },
  employees: { label: 'Employees', icon: Users, color: 'text-violet-400', description: 'Team page SEO' },
  testimonials: { label: 'Testimonials', icon: Award, color: 'text-yellow-400', description: 'Testimonial SEO' },
  courses: { label: 'Courses', icon: Briefcase, color: 'text-teal-400', description: 'Course page SEO' },
  events: { label: 'Events', icon: Calendar, color: 'text-orange-400', description: 'Event page SEO' },
  newsletters: { label: 'Newsletters', icon: Megaphone, color: 'text-rose-400', description: 'Newsletter SEO' },
  'sales-collateral': { label: 'Sales Collateral', icon: FileText, color: 'text-emerald-400', description: 'Sales content SEO' },
  videos: { label: 'Videos', icon: Video, color: 'text-red-400', description: 'Video SEO' },
};

const STATUS_CONFIG: Record<SeoRecordStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  pending: { label: 'Pending', color: 'text-slate-400', bgColor: 'bg-slate-800', icon: Clock },
  generating: { label: 'Generating', color: 'text-blue-400', bgColor: 'bg-blue-900/30', icon: RefreshCw },
  draft: { label: 'Draft', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30', icon: PenTool },
  review: { label: 'Review', color: 'text-amber-400', bgColor: 'bg-amber-900/30', icon: Eye },
  optimized: { label: 'Optimized', color: 'text-green-400', bgColor: 'bg-green-900/30', icon: CheckCircle },
  published: { label: 'Published', color: 'text-primary-400', bgColor: 'bg-primary-900/30', icon: Globe },
  'needs-update': { label: 'Needs Update', color: 'text-orange-400', bgColor: 'bg-orange-900/30', icon: AlertTriangle },
  failed: { label: 'Failed', color: 'text-red-400', bgColor: 'bg-red-900/30', icon: X },
};

const PRIORITY_CONFIG: Record<SeoPriority, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Low', color: 'text-slate-400', bgColor: 'bg-slate-800' },
  medium: { label: 'Medium', color: 'text-blue-400', bgColor: 'bg-blue-900/30' },
  high: { label: 'High', color: 'text-amber-400', bgColor: 'bg-amber-900/30' },
  critical: { label: 'Critical', color: 'text-red-400', bgColor: 'bg-red-900/30' },
};

const SCHEMA_TYPE_OPTIONS: { value: SeoSchemaType; label: string; group: string }[] = [
  { value: 'Article', label: 'Article', group: 'Content' },
  { value: 'Product', label: 'Product', group: 'Commerce' },
  { value: 'Service', label: 'Service', group: 'Commerce' },
  { value: 'FAQ', label: 'FAQ', group: 'Content' },
  { value: 'HowTo', label: 'How-To', group: 'Content' },
  { value: 'LocalBusiness', label: 'Local Business', group: 'Business' },
  { value: 'Organization', label: 'Organization', group: 'Business' },
  { value: 'Person', label: 'Person', group: 'Business' },
  { value: 'Event', label: 'Event', group: 'Event' },
  { value: 'Course', label: 'Course', group: 'Education' },
  { value: 'Review', label: 'Review', group: 'Content' },
  { value: 'VideoObject', label: 'Video', group: 'Media' },
  { value: 'NewsArticle', label: 'News Article', group: 'Content' },
  { value: 'Custom', label: 'Custom Schema', group: 'Advanced' },
];

const SEARCH_INTENT_OPTIONS: { value: SeoSearchIntent; label: string; description: string }[] = [
  { value: 'informational', label: 'Informational', description: 'Seeking information' },
  { value: 'navigational', label: 'Navigational', description: 'Looking for specific site/page' },
  { value: 'transactional', label: 'Transactional', description: 'Ready to buy/act' },
  { value: 'commercial', label: 'Commercial', description: 'Researching before purchase' },
];

const ISSUE_TYPE_CONFIG: Record<SeoIssueType, { label: string; severity: SeoIssueSeverity; description: string }> = {
  'missing-meta-title': { label: 'Missing Meta Title', severity: 'critical', description: 'Page has no meta title' },
  'missing-meta-description': { label: 'Missing Meta Description', severity: 'critical', description: 'Page has no meta description' },
  'missing-focus-keyword': { label: 'Missing Focus Keyword', severity: 'high', description: 'No primary keyword defined' },
  'duplicate-meta-title': { label: 'Duplicate Meta Title', severity: 'high', description: 'Title used elsewhere' },
  'duplicate-meta-description': { label: 'Duplicate Meta Description', severity: 'high', description: 'Description used elsewhere' },
  'missing-h1': { label: 'Missing H1', severity: 'critical', description: 'No H1 heading found' },
  'multiple-h1': { label: 'Multiple H1', severity: 'medium', description: 'More than one H1 tag' },
  'missing-alt-text': { label: 'Missing Alt Text', severity: 'medium', description: 'Images without alt text' },
  'broken-link': { label: 'Broken Link', severity: 'high', description: 'Link returns error' },
  'missing-canonical': { label: 'Missing Canonical', severity: 'medium', description: 'No canonical URL set' },
  'missing-schema': { label: 'Missing Schema', severity: 'medium', description: 'No structured data' },
  'keyword-stuffing': { label: 'Keyword Stuffing', severity: 'medium', description: 'Over-optimized keywords' },
  'thin-content': { label: 'Thin Content', severity: 'high', description: 'Content is too short' },
  'slow-page-speed': { label: 'Slow Page Speed', severity: 'medium', description: 'Page loads slowly' },
  'not-mobile-friendly': { label: 'Not Mobile Friendly', severity: 'high', description: 'Poor mobile experience' },
  'missing-og-tags': { label: 'Missing OG Tags', severity: 'low', description: 'No Open Graph tags' },
  'long-url': { label: 'Long URL', severity: 'low', description: 'URL is too long' },
  'missing-internal-links': { label: 'Missing Internal Links', severity: 'medium', description: 'No internal links' },
  'missing-external-links': { label: 'Missing External Links', severity: 'low', description: 'No external links' },
  'low-readability': { label: 'Low Readability', severity: 'medium', description: 'Complex content' },
  'custom': { label: 'Custom Issue', severity: 'low', description: 'Other SEO issue' },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const generateId = () => `seo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function calculateSeoScore(record: SeoRecord): number {
  let score = 0;
  const weights = { meta: 25, content: 25, links: 20, images: 15, technical: 15 };

  // Meta tags (25 points)
  if (record.metaTitle) score += 10;
  if (record.metaDescription) score += 10;
  if (record.focusKeyword) score += 5;

  // Content (25 points)
  if (record.wordCount && record.wordCount >= 300) score += 10;
  if (record.readabilityScore && record.readabilityScore >= 60) score += 8;
  if (record.headingStructure?.h1) score += 7;

  // Links (20 points)
  if (record.internalLinks && record.internalLinks.length > 0) score += 10;
  if (record.externalLinks && record.externalLinks.length > 0) score += 10;

  // Images (15 points)
  if (record.altTextsComplete) score += 15;

  // Technical (15 points)
  if (record.schemaMarkup) score += 8;
  if (record.canonicalUrl) score += 7;

  return Math.min(100, score);
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function SEOOSModule() {
  // Get company ID from company store (source of truth)
  const companyId = useCompanyStore(s => s.activeCompanyId);

  // Get data store methods and state
  const getItems = useDataStore(s => s.getItems);
  const addItem = useDataStore(s => s.addItem);
  const updateItem = useDataStore(s => s.updateItem);
  const deleteItem = useDataStore(s => s.deleteItem);
  const setActiveCompany = useDataStore(s => s.setActiveCompany);
  const dataActiveCompanyId = useDataStore(s => s.activeCompanyId);
  const setItems = useDataStore(s => s.setItems);
  const data = useDataStore(s => s.data);

  // Use companyStore's activeCompanyId as the source of truth
  const activeCompanyId = companyId;

  // Sync company ID to data store
  useEffect(() => {
    if (companyId && companyId !== dataActiveCompanyId) {
      console.log('[SEO OS] Syncing company ID:', companyId);
      setActiveCompany(companyId);
    }
  }, [companyId, dataActiveCompanyId, setActiveCompany]);

  // SEO OS Data
  const seoSystem = useMemo(() => getItems('seoSystem') as SeoSystem | null, [getItems, data, activeCompanyId]);
  const seoStrategies = useMemo(() => (getItems('seoStrategies') as SeoStrategy[]) || [], [getItems, data, activeCompanyId]);
  const seoRecords = useMemo(() => (getItems('seoRecords') as SeoRecord[]) || [], [getItems, data, activeCompanyId]);
  const seoKeywords = useMemo(() => (getItems('seoKeywords') as SeoKeyword[]) || [], [getItems, data, activeCompanyId]);
  const seoKeywordBanks = useMemo(() => (getItems('seoKeywordBanks') as SeoKeywordBank[]) || [], [getItems, data, activeCompanyId]);
  const seoAudits = useMemo(() => (getItems('seoAudits') as SeoAudit[]) || [], [getItems, data, activeCompanyId]);

  // Source Data (from all modules)
  const businessProfile = useMemo(() => (getItems('businessProfiles') as BusinessProfile[])[0], [getItems, data, activeCompanyId]);
  const brand = useMemo(() => getItems('brand') as Brand | null, [getItems, data, activeCompanyId]);
  const products = useMemo(() => (getItems('products') as Product[]) || [], [getItems, data, activeCompanyId]);
  const icps = useMemo(() => (getItems('icps') as ICP[]) || [], [getItems, data, activeCompanyId]);
  const personas = useMemo(() => (getItems('personas') as Persona[]) || [], [getItems, data, activeCompanyId]);
  const competitors = useMemo(() => (getItems('competitors') as Competitor[]) || [], [getItems, data, activeCompanyId]);
  const founders = useMemo(() => (getItems('founders') as any[]) || [], [getItems, data, activeCompanyId]);
  const employees = useMemo(() => (getItems('employees') as any[]) || [], [getItems, data, activeCompanyId]);
  const blogs = useMemo(() => (getItems('blogs') as Blog[]) || [], [getItems, data, activeCompanyId]);
  const blogPosts = useMemo(() => (getItems('blogPosts') as any[]) || [], [getItems, data, activeCompanyId]);
  const landingPages = useMemo(() => (getItems('landingPages') as LandingPage[]) || [], [getItems, data, activeCompanyId]);
  const faqs = useMemo(() => (getItems('faqs') as FAQ[]) || [], [getItems, data, activeCompanyId]);
  const testimonials = useMemo(() => (getItems('testimonials') as Testimonial[]) || [], [getItems, data, activeCompanyId]);
  const courses = useMemo(() => (getItems('courses') as Course[]) || [], [getItems, data, activeCompanyId]);
  const events = useMemo(() => (getItems('events') as Event[]) || [], [getItems, data, activeCompanyId]);
  const newsletters = useMemo(() => (getItems('newsletters') as Newsletter[]) || [], [getItems, data, activeCompanyId]);
  const salesCollateral = useMemo(() => (getItems('salesCollateral') as SalesCollateral[]) || [], [getItems, data, activeCompanyId]);
  const videoContent = useMemo(() => (getItems('videoContent') as VideoContent[]) || [], [getItems, data, activeCompanyId]);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Set loading to false once company is available
  useEffect(() => {
    if (!companyId) {
      setIsLoading(true);
      return;
    }
    // Small delay to ensure data is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);
    return () => clearTimeout(timer);
  }, [companyId]);

  // Active state
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'keywords' | 'audit' | 'calendar' | 'settings'>('overview');
  const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);
  const [selectedSourceModule, setSelectedSourceModule] = useState<SeoSourceModule | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SeoRecordStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<SeoPriority | 'all'>('all');

  // Modals
  const [showCreateRecordModal, setShowCreateRecordModal] = useState(false);
  const [showCreateKeywordModal, setShowCreateKeywordModal] = useState(false);
  const [showCreateStrategyModal, setShowCreateStrategyModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showBulkGenerateModal, setShowBulkGenerateModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SeoRecord | null>(null);
  const [editingKeyword, setEditingKeyword] = useState<SeoKeyword | null>(null);

  // Computed data
  const activeStrategy = useMemo(() =>
    seoStrategies.find(s => s.id === activeStrategyId),
    [seoStrategies, activeStrategyId]
  );

  const filteredRecords = useMemo(() => {
    let filtered = seoRecords;

    if (selectedSourceModule !== 'all') {
      filtered = filtered.filter(r => r.sourceModule === selectedSourceModule);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(r => r.priority === priorityFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.sourceItemName.toLowerCase().includes(query) ||
        r.metaTitle.toLowerCase().includes(query) ||
        r.focusKeyword.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [seoRecords, selectedSourceModule, statusFilter, priorityFilter, searchQuery]);

  // Get items from source module
  const getSourceItems = useCallback((module: SeoSourceModule): { id: string; name: string }[] => {
    switch (module) {
      case 'products': return products.map(p => ({ id: p.id, name: p.name }));
      case 'blogs': return blogPosts.map(b => ({ id: b.id, name: b.title }));
      case 'landing-pages': return landingPages.map(l => ({ id: l.id, name: l.name }));
      case 'faqs': return faqs.map(f => ({ id: f.id, name: f.title }));
      case 'founders': return founders.map(f => ({ id: f.id, name: f.name }));
      case 'employees': return employees.map(e => ({ id: e.id, name: e.name }));
      case 'testimonials': return testimonials.map(t => ({ id: t.id, name: t.customerName }));
      case 'courses': return courses.map(c => ({ id: c.id, name: c.name }));
      case 'events': return events.map(e => ({ id: e.id, name: e.name }));
      case 'newsletters': return newsletters.map(n => ({ id: n.id, name: n.name }));
      case 'sales-collateral': return salesCollateral.map(s => ({ id: s.id, name: s.name }));
      case 'videos': return videoContent.map(v => ({ id: v.id, name: v.name }));
      case 'business-profile': return businessProfile ? [{ id: businessProfile.id, name: businessProfile.name }] : [];
      case 'website-pages': return [];
      default: return [];
    }
  }, [products, blogPosts, landingPages, faqs, founders, employees, testimonials, courses, events, newsletters, salesCollateral, videoContent, businessProfile]);

  // Stats
  const stats = useMemo(() => {
    const totalRecords = seoRecords.length;
    const optimizedRecords = seoRecords.filter(r => r.status === 'optimized' || r.status === 'published').length;
    const pendingRecords = seoRecords.filter(r => r.status === 'pending').length;
    const issuesCount = seoRecords.reduce((sum, r) => sum + r.issues.length, 0);
    const avgScore = seoRecords.length > 0
      ? Math.round(seoRecords.reduce((sum, r) => sum + calculateSeoScore(r), 0) / seoRecords.length)
      : 0;

    const recordsByModule: Record<string, number> = {};
    seoRecords.forEach(r => {
      recordsByModule[r.sourceModule] = (recordsByModule[r.sourceModule] || 0) + 1;
    });

    const criticalIssues = seoRecords.flatMap(r => r.issues).filter(i => i.severity === 'critical').length;
    const highIssues = seoRecords.flatMap(r => r.issues).filter(i => i.severity === 'high').length;

    return {
      totalRecords,
      optimizedRecords,
      pendingRecords,
      issuesCount,
      avgScore,
      recordsByModule,
      criticalIssues,
      highIssues,
    };
  }, [seoRecords]);

  // Handlers
  const handleCreateRecord = useCallback((data: Partial<SeoRecord>) => {
    if (!companyId) return;
    const id = generateId();
    const newRecord: SeoRecord = {
      id,
      companyId,
      sourceModule: data.sourceModule || 'products',
      sourceItemId: data.sourceItemId || '',
      sourceItemName: data.sourceItemName || '',
      metaTitle: data.metaTitle || '',
      metaDescription: data.metaDescription || '',
      focusKeyword: data.focusKeyword || '',
      secondaryKeywords: data.secondaryKeywords || [],
      targetKeywords: data.targetKeywords || [],
      ogTitle: data.ogTitle || '',
      ogDescription: data.ogDescription || '',
      twitterCardType: data.twitterCardType || 'summary_large_image',
      robotsDirective: data.robotsDirective || 'index, follow',
      schemaType: data.schemaType || 'Article',
      status: 'pending',
      priority: data.priority || 'medium',
      searchIntent: data.searchIntent || 'informational',
      internalLinks: [],
      externalLinks: [],
      images: [],
      brokenLinks: [],
      issues: [],
      recommendations: [],
      altTextsComplete: false,
      aiGenerated: false,
      manualEdits: false,
      version: 1,
      versionHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pageType: data.pageType || 'custom',
    };
    addItem('seoRecords', newRecord);
    setShowCreateRecordModal(false);
  }, [companyId, addItem]);

  const handleUpdateRecord = useCallback((id: string, updates: Partial<SeoRecord>) => {
    updateItem('seoRecords', id, { ...updates, updatedAt: new Date().toISOString() });
  }, [updateItem]);

  const handleDeleteRecord = useCallback((id: string) => {
    if (confirm('Delete this SEO record?')) {
      deleteItem('seoRecords', id);
    }
  }, [deleteItem]);

  const handleBulkGenerate = useCallback(() => {
    setShowBulkGenerateModal(true);
  }, []);

  // Render loading state
  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Select a company to manage SEO</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-spin" />
          <p className="text-slate-400">Loading SEO data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">SEO Operating System</h1>
          <p className="text-slate-400 mt-1">
            Centralized SEO management across all content modules
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateStrategyModal(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Strategy
          </button>
          <button
            onClick={handleBulkGenerate}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Bulk Generate
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalRecords}</p>
              <p className="text-sm text-slate-400">Total Records</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.optimizedRecords}</p>
              <p className="text-sm text-slate-400">Optimized</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.issuesCount}</p>
              <p className="text-sm text-slate-400">Issues Found</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.avgScore}</p>
              <p className="text-sm text-slate-400">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Layout },
            { id: 'records', label: 'SEO Records', icon: FileText },
            { id: 'keywords', label: 'Keywords', icon: Hash },
            { id: 'audit', label: 'Audit', icon: CheckCircle },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Source Module Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(Object.keys(SOURCE_MODULE_CONFIG) as SeoSourceModule[]).map((module) => {
                const config = SOURCE_MODULE_CONFIG[module];
                const sourceItems = getSourceItems(module);
                const moduleRecords = seoRecords.filter(r => r.sourceModule === module);
                const optimizedCount = moduleRecords.filter(r => r.status === 'optimized' || r.status === 'published').length;
                const pendingCount = moduleRecords.filter(r => r.status === 'pending').length;
                const issuesCount = moduleRecords.reduce((sum, r) => sum + r.issues.length, 0);

                return (
                  <button
                    key={module}
                    onClick={() => {
                      setSelectedSourceModule(module);
                      setActiveTab('records');
                    }}
                    className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-left hover:border-primary-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn('p-2 rounded-lg bg-slate-700', config.color)}>
                        <config.icon className="w-5 h-5" />
                      </div>
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        pendingCount > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
                      )}>
                        {pendingCount > 0 ? `${pendingCount} pending` : 'Up to date'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{config.label}</h3>
                    <p className="text-sm text-slate-400 mb-3">{config.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        {sourceItems.length} items • {moduleRecords.length} SEO records
                      </span>
                      {issuesCount > 0 && (
                        <span className="text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {issuesCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleBulkGenerate}
                    className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <div className="text-left">
                        <p className="text-white font-medium">Generate All SEO</p>
                        <p className="text-sm text-slate-400">Auto-generate for all items</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => setShowAuditModal(true)}
                    className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div className="text-left">
                        <p className="text-white font-medium">Run SEO Audit</p>
                        <p className="text-sm text-slate-400">Check for issues</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => setActiveTab('keywords')}
                    className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Hash className="w-5 h-5 text-blue-400" />
                      <div className="text-left">
                        <p className="text-white font-medium">Keyword Bank</p>
                        <p className="text-sm text-slate-400">Manage target keywords</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Issues Summary */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Issues Summary</h3>
                {stats.criticalIssues === 0 && stats.highIssues === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mb-3" />
                    <p className="text-slate-300">All SEO records are optimized!</p>
                    <p className="text-sm text-slate-500 mt-1">No critical issues found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.criticalIssues > 0 && (
                      <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <span className="text-red-400">Critical Issues</span>
                        </div>
                        <span className="font-bold text-red-400">{stats.criticalIssues}</span>
                      </div>
                    )}
                    {stats.highIssues > 0 && (
                      <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                          <span className="text-amber-400">High Priority Issues</span>
                        </div>
                        <span className="font-bold text-amber-400">{stats.highIssues}</span>
                      </div>
                    )}
                    <button
                      onClick={() => setActiveTab('audit')}
                      className="w-full mt-2 text-sm text-primary-400 hover:text-primary-300 flex items-center justify-center gap-1"
                    >
                      View all issues <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name, title, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedSourceModule}
                  onChange={(e) => setSelectedSourceModule(e.target.value as SeoSourceModule | 'all')}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="all">All Modules</option>
                  {(Object.keys(SOURCE_MODULE_CONFIG) as SeoSourceModule[]).map((module) => (
                    <option key={module} value={module}>
                      {SOURCE_MODULE_CONFIG[module].label}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as SeoRecordStatus | 'all')}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  {(Object.keys(STATUS_CONFIG) as SeoRecordStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {STATUS_CONFIG[status].label}
                    </option>
                  ))}
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as SeoPriority | 'all')}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="all">All Priority</option>
                  {(Object.keys(PRIORITY_CONFIG) as SeoPriority[]).map((priority) => (
                    <option key={priority} value={priority}>
                      {PRIORITY_CONFIG[priority].label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowCreateRecordModal(true)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Record
                </button>
              </div>
            </div>

            {/* Records Table */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 text-slate-400 font-medium">Source</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Item</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Meta Title</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Keyword</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Score</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Priority</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-slate-500">
                          No SEO records found. Create one or bulk generate.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((record) => {
                        const moduleConfig = SOURCE_MODULE_CONFIG[record.sourceModule];
                        const statusConfig = STATUS_CONFIG[record.status];
                        const priorityConfig = PRIORITY_CONFIG[record.priority];
                        const score = calculateSeoScore(record);

                        return (
                          <tr key={record.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <moduleConfig.icon className={cn('w-4 h-4', moduleConfig.color)} />
                                <span className="text-slate-300">{moduleConfig.label}</span>
                              </div>
                            </td>
                            <td className="p-4 text-white">{record.sourceItemName}</td>
                            <td className="p-4">
                              <span className="text-slate-300 line-clamp-1">{record.metaTitle || '—'}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-primary-400">{record.focusKeyword || '—'}</span>
                            </td>
                            <td className="p-4">
                              <div className={cn(
                                'px-2 py-1 rounded text-sm font-medium',
                                score >= 80 ? 'bg-green-500/20 text-green-400' :
                                score >= 60 ? 'bg-amber-500/20 text-amber-400' :
                                'bg-red-500/20 text-red-400'
                              )}>
                                {score}/100
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={cn(
                                'px-2 py-1 rounded text-sm',
                                statusConfig.bgColor,
                                statusConfig.color
                              )}>
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={cn(
                                'px-2 py-1 rounded text-sm',
                                priorityConfig.bgColor,
                                priorityConfig.color
                              )}>
                                {priorityConfig.label}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingRecord(record)}
                                  className="p-1.5 text-slate-400 hover:text-white transition-colors"
                                >
                                  <PenTool className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRecord(record.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Keywords Tab */}
        {activeTab === 'keywords' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Keyword Bank</h3>
              <button
                onClick={() => setShowCreateKeywordModal(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Keyword
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              {seoKeywords.length === 0 ? (
                <div className="text-center py-12">
                  <Hash className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No keywords added yet</p>
                  <p className="text-sm text-slate-500 mt-1">Add target keywords to track and optimize</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {seoKeywords.map((keyword) => (
                    <div key={keyword.id} className="bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{keyword.keyword}</span>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded',
                          keyword.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          keyword.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                          keyword.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        )}>
                          {keyword.difficulty}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">
                        Volume: {keyword.searchVolume.toLocaleString()} • Intent: {keyword.searchIntent}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">SEO Audit</h3>
              <button
                onClick={() => setShowAuditModal(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Run Audit
              </button>
            </div>

            {/* Audit History */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              {seoAudits.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No audits run yet</p>
                  <p className="text-sm text-slate-500 mt-1">Run an audit to check for SEO issues</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {seoAudits.map((audit) => (
                    <div key={audit.id} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">{audit.name}</h4>
                          <p className="text-sm text-slate-400">
                            {new Date(audit.createdAt).toLocaleDateString()} • {audit.status}
                          </p>
                        </div>
                        <div className={cn(
                          'px-3 py-1 rounded-full text-sm',
                          audit.results.averageScore >= 80 ? 'bg-green-500/20 text-green-400' :
                          audit.results.averageScore >= 60 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        )}>
                          Score: {audit.results.averageScore}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Total</span>
                          <p className="text-white">{audit.results.totalItems}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Passed</span>
                          <p className="text-green-400">{audit.results.itemsPassed}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Issues</span>
                          <p className="text-amber-400">{audit.results.totalIssues}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Critical</span>
                          <p className="text-red-400">{audit.results.criticalIssues}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">SEO Calendar</h3>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Schedule Task
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">SEO Calendar coming soon</p>
                <p className="text-sm text-slate-500 mt-1">Schedule audits, content publishing, and optimizations</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">SEO System Settings</h3>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-6">
              {/* Auto-Generation Settings */}
              <div>
                <h4 className="text-white font-medium mb-3">Auto-Generation</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-slate-300">Auto-generate SEO for new content</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-slate-300">Auto-generate meta titles</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-slate-300">Auto-generate meta descriptions</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-slate-300">Auto-generate schema markup</span>
                    <input type="checkbox" className="toggle" />
                  </label>
                </div>
              </div>

              {/* Templates */}
              <div>
                <h4 className="text-white font-medium mb-3">Default Templates</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Meta Title Template</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="{title} | {brand}"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Meta Description Template</label>
                    <textarea
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      rows={2}
                      placeholder="Discover {title}. {description}"
                    />
                  </div>
                </div>
              </div>

              {/* Default Settings */}
              <div>
                <h4 className="text-white font-medium mb-3">Default Values</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Default Robots Directive</label>
                    <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option value="index, follow">Index, Follow</option>
                      <option value="noindex, follow">NoIndex, Follow</option>
                      <option value="index, nofollow">Index, NoFollow</option>
                      <option value="noindex, nofollow">NoIndex, NoFollow</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Default Schema Type</label>
                    <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      {SCHEMA_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Record Modal */}
      {showCreateRecordModal && (
        <CreateSEORecordModal
          sourceModules={SOURCE_MODULE_CONFIG}
          getSourceItems={getSourceItems}
          onClose={() => setShowCreateRecordModal(false)}
          onCreate={handleCreateRecord}
        />
      )}

      {/* Edit Record Modal */}
      {editingRecord && (
        <EditSEORecordModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={(updates) => {
            handleUpdateRecord(editingRecord.id, updates);
            setEditingRecord(null);
          }}
        />
      )}

      {/* Bulk Generate Modal */}
      {showBulkGenerateModal && (
        <BulkGenerateModal
          sourceModules={SOURCE_MODULE_CONFIG}
          getSourceItems={getSourceItems}
          existingRecords={seoRecords}
          onClose={() => setShowBulkGenerateModal(false)}
          onGenerate={(records) => {
            records.forEach(r => addItem('seoRecords', r));
            setShowBulkGenerateModal(false);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// CREATE RECORD MODAL
// ============================================

interface CreateRecordModalProps {
  sourceModules: Record<SeoSourceModule, { label: string; icon: any; color: string; description: string }>;
  getSourceItems: (module: SeoSourceModule) => { id: string; name: string }[];
  onClose: () => void;
  onCreate: (data: Partial<SeoRecord>) => void;
}

function CreateSEORecordModal({ sourceModules, getSourceItems, onClose, onCreate }: CreateRecordModalProps) {
  const [sourceModule, setSourceModule] = useState<SeoSourceModule>('products');
  const [sourceItemId, setSourceItemId] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [priority, setPriority] = useState<SeoPriority>('medium');

  const sourceItems = getSourceItems(sourceModule);
  const selectedItem = sourceItems.find(item => item.id === sourceItemId);

  const handleCreate = () => {
    onCreate({
      sourceModule,
      sourceItemId,
      sourceItemName: selectedItem?.name || '',
      metaTitle,
      metaDescription,
      focusKeyword,
      priority,
      pageType: 'custom',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Create SEO Record</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Source Module */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Source Module</label>
            <select
              value={sourceModule}
              onChange={(e) => {
                setSourceModule(e.target.value as SeoSourceModule);
                setSourceItemId('');
              }}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              {(Object.keys(sourceModules) as SeoSourceModule[]).map((module) => (
                <option key={module} value={module}>{sourceModules[module].label}</option>
              ))}
            </select>
          </div>

          {/* Source Item */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Source Item</label>
            <select
              value={sourceItemId}
              onChange={(e) => setSourceItemId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              <option value="">Select item...</option>
              {sourceItems.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          {/* Meta Title */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Enter meta title..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
            <p className="text-xs text-slate-500 mt-1">{metaTitle.length}/60 characters</p>
          </div>

          {/* Meta Description */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
            <p className="text-xs text-slate-500 mt-1">{metaDescription.length}/160 characters</p>
          </div>

          {/* Focus Keyword */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Focus Keyword</label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="Primary keyword..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as SeoPriority)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!sourceItemId}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white disabled:opacity-50"
          >
            Create Record
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EDIT RECORD MODAL
// ============================================

interface EditRecordModalProps {
  record: SeoRecord;
  onClose: () => void;
  onSave: (updates: Partial<SeoRecord>) => void;
}

function EditSEORecordModal({ record, onClose, onSave }: EditRecordModalProps) {
  const [metaTitle, setMetaTitle] = useState(record.metaTitle);
  const [metaDescription, setMetaDescription] = useState(record.metaDescription);
  const [focusKeyword, setFocusKeyword] = useState(record.focusKeyword);
  const [secondaryKeywords, setSecondaryKeywords] = useState(record.secondaryKeywords.join(', '));
  const [priority, setPriority] = useState(record.priority);
  const [status, setStatus] = useState(record.status);

  const handleSave = () => {
    onSave({
      metaTitle,
      metaDescription,
      focusKeyword,
      secondaryKeywords: secondaryKeywords.split(',').map(k => k.trim()).filter(Boolean),
      priority,
      status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <div>
            <h3 className="text-lg font-semibold text-white">Edit SEO Record</h3>
            <p className="text-sm text-slate-400">{record.sourceItemName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Meta Title */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
            <p className="text-xs text-slate-500 mt-1">{metaTitle.length}/60 characters</p>
          </div>

          {/* Meta Description */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
            <p className="text-xs text-slate-500 mt-1">{metaDescription.length}/160 characters</p>
          </div>

          {/* Focus Keyword */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Focus Keyword</label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>

          {/* Secondary Keywords */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Secondary Keywords</label>
            <input
              type="text"
              value={secondaryKeywords}
              onChange={(e) => setSecondaryKeywords(e.target.value)}
              placeholder="Comma separated..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as SeoPriority)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SeoRecordStatus)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="optimized">Optimized</option>
                <option value="published">Published</option>
                <option value="needs-update">Needs Update</option>
              </select>
            </div>
          </div>

          {/* Issues */}
          {record.issues.length > 0 && (
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Issues ({record.issues.length})</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {record.issues.map((issue) => (
                  <div key={issue.id} className="flex items-start gap-2 p-2 bg-slate-700/50 rounded-lg">
                    <AlertTriangle className={cn(
                      'w-4 h-4 mt-0.5 flex-shrink-0',
                      issue.severity === 'critical' ? 'text-red-400' :
                      issue.severity === 'high' ? 'text-orange-400' :
                      issue.severity === 'medium' ? 'text-amber-400' : 'text-slate-400'
                    )} />
                    <div>
                      <p className="text-sm text-white">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-xs text-slate-400 mt-0.5">{issue.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-slate-700 sticky bottom-0 bg-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BULK GENERATE MODAL
// ============================================

interface BulkGenerateModalProps {
  sourceModules: Record<SeoSourceModule, { label: string; icon: any; color: string; description: string }>;
  getSourceItems: (module: SeoSourceModule) => { id: string; name: string }[];
  existingRecords: SeoRecord[];
  onClose: () => void;
  onGenerate: (records: SeoRecord[]) => void;
}

function BulkGenerateModal({ sourceModules, getSourceItems, existingRecords, onClose, onGenerate }: BulkGenerateModalProps) {
  const [selectedModules, setSelectedModules] = useState<SeoSourceModule[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleModule = (module: SeoSourceModule) => {
    setSelectedModules(prev =>
      prev.includes(module)
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const selectAll = () => {
    setSelectedModules(Object.keys(sourceModules) as SeoSourceModule[]);
  };

  const deselectAll = () => {
    setSelectedModules([]);
  };

  const getPendingItems = () => {
    const items: { module: SeoSourceModule; id: string; name: string }[] = [];
    selectedModules.forEach(module => {
      const sourceItems = getSourceItems(module);
      sourceItems.forEach(item => {
        const hasRecord = existingRecords.some(r => r.sourceModule === module && r.sourceItemId === item.id);
        if (!hasRecord) {
          items.push({ module, ...item });
        }
      });
    });
    return items;
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate generation
    setTimeout(() => {
      const pendingItems = getPendingItems();
      const newRecords: SeoRecord[] = pendingItems.map(item => ({
        id: generateId(),
        companyId: '',
        sourceModule: item.module,
        sourceItemId: item.id,
        sourceItemName: item.name,
        metaTitle: `${item.name} | Your Brand`,
        metaDescription: `Learn more about ${item.name}. Discover features, benefits, and more.`,
        focusKeyword: item.name.toLowerCase().split(' ').slice(0, 3).join(' '),
        secondaryKeywords: [],
        targetKeywords: [],
        ogTitle: `${item.name} | Your Brand`,
        ogDescription: `Learn more about ${item.name}.`,
        twitterCardType: 'summary_large_image' as TwitterCardType,
        robotsDirective: 'index, follow' as RobotsDirective,
        schemaType: 'Article' as SeoSchemaType,
        status: 'draft' as SeoRecordStatus,
        priority: 'medium' as SeoPriority,
        searchIntent: 'informational' as SeoSearchIntent,
        internalLinks: [],
        externalLinks: [],
        images: [],
        brokenLinks: [],
        issues: [],
        recommendations: [],
        altTextsComplete: false,
        aiGenerated: true,
        manualEdits: false,
        version: 1,
        versionHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pageType: 'custom',
      }));

      onGenerate(newRecords);
      setIsGenerating(false);
    }, 1500);
  };

  const pendingCount = getPendingItems().length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h3 className="text-lg font-semibold text-white">Bulk Generate SEO</h3>
            <p className="text-sm text-slate-400">Generate SEO records for items without existing records</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Module Selection */}
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Select Modules</span>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-sm text-primary-400 hover:text-primary-300">
                Select All
              </button>
              <button onClick={deselectAll} className="text-sm text-slate-400 hover:text-slate-300">
                Deselect All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(Object.keys(sourceModules) as SeoSourceModule[]).map((module) => {
              const config = sourceModules[module];
              const isSelected = selectedModules.includes(module);
              const sourceItems = getSourceItems(module);
              const existingCount = existingRecords.filter(r => r.sourceModule === module).length;
              const pendingCount = sourceItems.length - existingCount;

              return (
                <button
                  key={module}
                  onClick={() => toggleModule(module)}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-all',
                    isSelected
                      ? 'bg-primary-500/20 border-primary-500'
                      : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <config.icon className={cn('w-4 h-4', config.color)} />
                    <span className="text-white text-sm font-medium">{config.label}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {pendingCount} pending • {existingCount} existing
                  </p>
                </button>
              );
            })}
          </div>

          {/* Summary */}
          {selectedModules.length > 0 && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Generation Summary</span>
                <span className="text-primary-400">{pendingCount} records</span>
              </div>
              <p className="text-sm text-slate-400">
                Will generate SEO records for {pendingCount} items across {selectedModules.length} modules.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={pendingCount === 0 || isGenerating}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate {pendingCount} Records
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}