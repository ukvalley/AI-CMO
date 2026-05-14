/**
 * Social Media Content Operating System
 *
 * AI-powered social media strategy, calendar, content creation,
 * and multi-platform publishing system.
 * Acts as: Social Media Strategist + Content Production Manager + Creative Workflow System
 */

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  CalendarDays, Target, FileText, Layout, Hash, Image, CheckCircle, Download,
  Plus, Trash2, ChevronDown, ChevronRight, RefreshCw, Search,
  X, Clock, BarChart3, Palette, Users, Zap, ArrowRight, Send, Eye,
  MessageSquare, Star, Grid, List as ListIcon,
  TrendingUp, Building2,
  Settings, Copy, PenTool, Layers, Play, Archive,
  Table, AlignLeft, ExternalLink, Lightbulb, Link,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDataStore, useCompanyStore } from '@/stores';
import {
  socialStrategyApi, socialCalendarEntryApi, socialCampaignApi,
  socialTemplateApi, socialHashtagApi, socialCreativeApi, socialExportApi,
} from '@/services/api';
import type {
  SocialMediaCalendar, SocialContentStrategy, SocialCalendarEntry, SocialCampaign,
  SocialContentTemplate, SocialHashtagBank, SocialCreative,
  SocialPlatform, SocialContentType, SocialEntryStatus, ContentPillar,
  SocialFunnelStage, SocialApprovalStatus, HashtagType, CreativeMediaType,
  EntryPriority, SocialExportFormat, SocialCalendarView, SocialTemplateCategory,
  ReviewComment,
  RepurposeType, Brand, BusinessProfile, ICP, Persona, Product, Competitor,
} from '@/types/entities';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const PLATFORM_CONFIG: Record<SocialPlatform, { label: string; color: string; icon: any; charLimit: number }> = {
  instagram: { label: 'Instagram', color: 'text-pink-400', icon: Image, charLimit: 2200 },
  facebook: { label: 'Facebook', color: 'text-blue-400', icon: Users, charLimit: 63206 },
  linkedin: { label: 'LinkedIn', color: 'text-blue-300', icon: Building2, charLimit: 3000 },
  twitter: { label: 'X / Twitter', color: 'text-slate-300', icon: MessageSquare, charLimit: 280 },
  youtube: { label: 'YouTube', color: 'text-red-400', icon: Play, charLimit: 5000 },
  tiktok: { label: 'TikTok', color: 'text-cyan-400', icon: Star, charLimit: 150 },
  pinterest: { label: 'Pinterest', color: 'text-red-300', icon: Palette, charLimit: 500 },
  threads: { label: 'Threads', color: 'text-slate-200', icon: Hash, charLimit: 500 },
  'whatsapp-channels': { label: 'WhatsApp', color: 'text-green-400', icon: MessageSquare, charLimit: 1024 },
  telegram: { label: 'Telegram', color: 'text-blue-400', icon: Send, charLimit: 4096 },
  'google-business': { label: 'Google Business', color: 'text-yellow-400', icon: BarChart3, charLimit: 1500 },
};

const CONTENT_TYPE_OPTIONS: { value: SocialContentType; label: string; group: string }[] = [
  { value: 'reel', label: 'Reel', group: 'Video' },
  { value: 'carousel', label: 'Carousel', group: 'Image' },
  { value: 'static-post', label: 'Static Post', group: 'Image' },
  { value: 'story', label: 'Story', group: 'Video' },
  { value: 'shorts', label: 'Shorts', group: 'Video' },
  { value: 'long-video', label: 'Long Video', group: 'Video' },
  { value: 'tweet', label: 'Tweet', group: 'Text' },
  { value: 'thread', label: 'Thread', group: 'Text' },
  { value: 'poll', label: 'Poll', group: 'Interactive' },
  { value: 'infographic', label: 'Infographic', group: 'Image' },
  { value: 'meme', label: 'Meme', group: 'Image' },
  { value: 'announcement', label: 'Announcement', group: 'Text' },
  { value: 'educational-content', label: 'Educational', group: 'Text' },
  { value: 'testimonial', label: 'Testimonial', group: 'Image' },
  { value: 'case-study', label: 'Case Study', group: 'Text' },
  { value: 'product-showcase', label: 'Product Showcase', group: 'Image' },
  { value: 'founder-content', label: 'Founder Content', group: 'Text' },
  { value: 'trend-based-content', label: 'Trend-Based', group: 'Text' },
  { value: 'promotional-content', label: 'Promotional', group: 'Text' },
  { value: 'event-content', label: 'Event Content', group: 'Text' },
];

const STATUS_CONFIG: Record<SocialEntryStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  planned: { label: 'Planned', color: 'text-slate-400', bgColor: 'bg-slate-800', icon: Lightbulb },
  'content-pending': { label: 'Content Pending', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30', icon: FileText },
  'writing-in-progress': { label: 'Writing', color: 'text-blue-400', bgColor: 'bg-blue-900/30', icon: PenTool },
  'design-pending': { label: 'Design Pending', color: 'text-purple-400', bgColor: 'bg-purple-900/30', icon: Palette },
  'reel-editing': { label: 'Reel Editing', color: 'text-pink-400', bgColor: 'bg-pink-900/30', icon: Settings },
  'under-review': { label: 'Under Review', color: 'text-amber-400', bgColor: 'bg-amber-900/30', icon: Eye },
  approved: { label: 'Approved', color: 'text-green-400', bgColor: 'bg-green-900/30', icon: CheckCircle },
  scheduled: { label: 'Scheduled', color: 'text-blue-300', bgColor: 'bg-blue-900/30', icon: Clock },
  posted: { label: 'Posted', color: 'text-primary-400', bgColor: 'bg-primary-900/30', icon: Send },
  rejected: { label: 'Rejected', color: 'text-red-400', bgColor: 'bg-red-900/30', icon: X },
  delayed: { label: 'Delayed', color: 'text-orange-400', bgColor: 'bg-orange-900/30', icon: Clock },
  archived: { label: 'Archived', color: 'text-slate-500', bgColor: 'bg-slate-800', icon: Archive },
};

const PILLAR_OPTIONS: { value: ContentPillar; label: string; description: string; color: string }[] = [
  { value: 'awareness', label: 'Awareness', description: 'Build brand visibility and reach', color: 'text-blue-400' },
  { value: 'engagement', label: 'Engagement', description: 'Drive likes, comments, shares', color: 'text-pink-400' },
  { value: 'education', label: 'Education', description: 'Teach and inform your audience', color: 'text-cyan-400' },
  { value: 'conversion', label: 'Conversion', description: 'Turn followers into customers', color: 'text-green-400' },
  { value: 'community', label: 'Community', description: 'Build loyal audience relationships', color: 'text-purple-400' },
  { value: 'authority', label: 'Authority', description: 'Establish thought leadership', color: 'text-amber-400' },
  { value: 'entertainment', label: 'Entertainment', description: 'Fun, viral, shareable content', color: 'text-red-400' },
  { value: 'product', label: 'Product', description: 'Showcase products and services', color: 'text-yellow-400' },
  { value: 'culture', label: 'Culture', description: 'Behind-the-scenes, company values', color: 'text-indigo-400' },
  { value: 'news', label: 'News', description: 'Industry news and updates', color: 'text-slate-300' },
];

const FUNNEL_OPTIONS: { value: SocialFunnelStage; label: string; description: string }[] = [
  { value: 'top-of-funnel', label: 'Top of Funnel', description: 'Awareness & discovery' },
  { value: 'middle-of-funnel', label: 'Middle of Funnel', description: 'Consideration & engagement' },
  { value: 'bottom-of-funnel', label: 'Bottom of Funnel', description: 'Decision & conversion' },
  { value: 'retention', label: 'Retention', description: 'Loyalty & advocacy' },
];

const PRIORITY_CONFIG: Record<EntryPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-slate-400' },
  medium: { label: 'Medium', color: 'text-blue-400' },
  high: { label: 'High', color: 'text-amber-400' },
  urgent: { label: 'Urgent', color: 'text-red-400' },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function SocialMediaOSModule() {
  const companyStore = useCompanyStore();
  const dataStore = useDataStore();
  const { getItems, addItem, updateItem, deleteItem, setActiveCompany, activeCompanyId } = dataStore;

  const companyId = companyStore.activeCompanyId;
  useMemo(() => {
    if (companyId && companyId !== activeCompanyId) {
      setActiveCompany(companyId);
    }
  }, [companyId, activeCompanyId, setActiveCompany]);

  // Data from store
  const calendar = useMemo(() => getItems('socialMediaCalendar') as SocialMediaCalendar | null, [getItems, dataStore.data, activeCompanyId]);
  const strategies = useMemo(() => (getItems('socialContentStrategies') as SocialContentStrategy[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const entries = useMemo(() => (getItems('socialCalendarEntries') as SocialCalendarEntry[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const campaigns = useMemo(() => (getItems('socialCampaigns') as SocialCampaign[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const templates = useMemo(() => (getItems('socialContentTemplates') as SocialContentTemplate[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const hashtagBanks = useMemo(() => (getItems('socialHashtagBanks') as SocialHashtagBank[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const creatives = useMemo(() => (getItems('socialCreatives') as SocialCreative[]) || [], [getItems, dataStore.data, activeCompanyId]);

  // Linked data
  const brand = useMemo(() => getItems('brand') as Brand | null, [getItems, dataStore.data, activeCompanyId]);
  const businessProfile = useMemo(() => (getItems('businessProfiles') as BusinessProfile[])[0], [getItems, dataStore.data, activeCompanyId]);
  const icps = useMemo(() => (getItems('icps') as ICP[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const personas = useMemo(() => (getItems('personas') as Persona[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const products = useMemo(() => (getItems('products') as Product[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const competitors = useMemo(() => (getItems('competitors') as Competitor[]) || [], [getItems, dataStore.data, activeCompanyId]);

  // Load from API
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!companyId) { setIsLoading(false); return; }
    const loadFromApi = async () => {
      setIsLoading(true);
      const [stratRes, entRes, campRes, tmpRes, hashRes, creRes, expRes] = await Promise.all([
        socialStrategyApi.getAll(companyId), socialCalendarEntryApi.getAll(companyId),
        socialCampaignApi.getAll(companyId), socialTemplateApi.getAll(companyId),
        socialHashtagApi.getAll(companyId), socialCreativeApi.getAll(companyId),
        socialExportApi.getAll(companyId),
      ]);
      const responses = [
        { name: 'strategies', res: stratRes }, { name: 'entries', res: entRes },
        { name: 'campaigns', res: campRes }, { name: 'templates', res: tmpRes },
        { name: 'hashtags', res: hashRes }, { name: 'creatives', res: creRes },
        { name: 'exports', res: expRes },
      ];
      responses.forEach(({ name, res }) => {
        if (res.error) console.error(`[SocialMediaOS] API load failed for ${name}:`, res.error);
      });
      const mergeById = <T extends { id: string }>(local: T[], remote: T[]): T[] => {
        const map = new Map<string, T>();
        local.forEach((item) => map.set(item.id, item));
        remote.forEach((item) => { if (!map.has(item.id)) map.set(item.id, item); });
        return Array.from(map.values());
      };
      if (stratRes.data && Array.isArray(stratRes.data) && (stratRes.data as any[]).length > 0) {
        const local = (getItems('socialContentStrategies') as SocialContentStrategy[]) || [];
        dataStore.setItems('socialContentStrategies', mergeById(local, stratRes.data as SocialContentStrategy[]));
      }
      if (entRes.data && Array.isArray(entRes.data) && (entRes.data as any[]).length > 0) {
        const local = (getItems('socialCalendarEntries') as SocialCalendarEntry[]) || [];
        dataStore.setItems('socialCalendarEntries', mergeById(local, entRes.data as SocialCalendarEntry[]));
      }
      if (campRes.data && Array.isArray(campRes.data) && (campRes.data as any[]).length > 0) {
        const local = (getItems('socialCampaigns') as SocialCampaign[]) || [];
        dataStore.setItems('socialCampaigns', mergeById(local, campRes.data as SocialCampaign[]));
      }
      if (tmpRes.data && Array.isArray(tmpRes.data) && (tmpRes.data as any[]).length > 0) {
        const local = (getItems('socialContentTemplates') as SocialContentTemplate[]) || [];
        dataStore.setItems('socialContentTemplates', mergeById(local, tmpRes.data as SocialContentTemplate[]));
      }
      if (hashRes.data && Array.isArray(hashRes.data) && (hashRes.data as any[]).length > 0) {
        const local = (getItems('socialHashtagBanks') as SocialHashtagBank[]) || [];
        dataStore.setItems('socialHashtagBanks', mergeById(local, hashRes.data as SocialHashtagBank[]));
      }
      if (creRes.data && Array.isArray(creRes.data) && (creRes.data as any[]).length > 0) {
        const local = (getItems('socialCreatives') as SocialCreative[]) || [];
        dataStore.setItems('socialCreatives', mergeById(local, creRes.data as SocialCreative[]));
      }
      setIsLoading(false);
    };
    loadFromApi();
  }, [companyId]);

  // Active state
  const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'strategy' | 'content' | 'templates' | 'hashtags' | 'creatives' | 'review' | 'export'>('calendar');
  const [showCreateStrategyModal, setShowCreateStrategyModal] = useState(false);
  const [showCreateEntryModal, setShowCreateEntryModal] = useState(false);
  const [showUploadCreativeModal, setShowUploadCreativeModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalEntryId, setApprovalEntryId] = useState<string | null>(null);
  const [showRepurposeModal, setShowRepurposeModal] = useState(false);
  const [repurposeEntry, setRepurposeEntry] = useState<SocialCalendarEntry | null>(null);

  const activeStrategy = useMemo(() => strategies.find((s) => s.id === activeStrategyId), [strategies, activeStrategyId]);
  const filteredEntries = useMemo(() => entries.filter((e) => !activeStrategyId || e.strategyId === activeStrategyId), [entries, activeStrategyId]);
  const filteredCampaigns = useMemo(() => campaigns, [campaigns]);

  // CRUD handlers
  const handleCreateStrategy = useCallback(async (data: Partial<SocialContentStrategy>) => {
    if (!companyId) return;
    const localId = addItem('socialContentStrategies', { ...data, companyId } as any);
    setActiveStrategyId(localId);
    if (!calendar) {
      dataStore.setItems('socialMediaCalendar', { name: 'Social Media Calendar', companyId, settings: { defaultPlatforms: ['instagram'], defaultTimezone: 'UTC', defaultPublishingTimes: {}, aiModel: 'glm-5.1', autoGenerateCaptions: false, autoGenerateHashtags: false, contentMixTargets: {} } } as any);
    }
    const response = await socialStrategyApi.create({ ...data, companyId, id: localId });
    if (response.data && (response.data as any).id && (response.data as any).id !== localId) {
      updateItem('socialContentStrategies', localId, { id: (response.data as any).id });
      setActiveStrategyId((response.data as any).id);
    }
  }, [companyId, addItem, updateItem, calendar]);

  const handleUpdateStrategy = useCallback(async (id: string, updates: Partial<SocialContentStrategy>) => {
    updateItem('socialContentStrategies', id, updates);
    await socialStrategyApi.update(id, updates);
  }, [updateItem]);

  const handleDeleteStrategy = useCallback(async (id: string) => {
    if (confirm('Delete this strategy and all associated content?')) {
      deleteItem('socialContentStrategies', id);
      if (activeStrategyId === id) setActiveStrategyId(null);
      await socialStrategyApi.delete(id);
    }
  }, [deleteItem, activeStrategyId]);

  const handleCreateEntry = useCallback(async (data: Partial<SocialCalendarEntry>) => {
    if (!companyId) return;
    const localId = addItem('socialCalendarEntries', { ...data, companyId } as any);
    const response = await socialCalendarEntryApi.create({ ...data, companyId, id: localId } as any);
    if (response.data && (response.data as any).id && (response.data as any).id !== localId) {
      updateItem('socialCalendarEntries', localId, { id: (response.data as any).id });
    }
  }, [companyId, addItem, updateItem]);

  const handleUpdateEntry = useCallback(async (id: string, updates: Partial<SocialCalendarEntry>) => {
    updateItem('socialCalendarEntries', id, updates);
    await socialCalendarEntryApi.update(id, updates);
  }, [updateItem]);

  const handleDeleteEntry = useCallback(async (id: string) => {
    deleteItem('socialCalendarEntries', id);
    await socialCalendarEntryApi.delete(id);
  }, [deleteItem]);

  // Guards
  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <CalendarDays className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Select a Company</h2>
          <p className="text-slate-400">Please select a company to access the Social Media OS.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading social media data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Social Media OS</h1>
                <p className="text-sm text-slate-400">AI-Powered Content Strategy & Production</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeStrategy && (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <Target className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-slate-200">{activeStrategy.name}</span>
                </div>
              )}
              <select value={activeStrategyId || ''} onChange={(e) => setActiveStrategyId(e.target.value || null)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">Select Strategy...</option>
                {strategies.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button onClick={() => setShowCreateStrategyModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" /> New Strategy
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 flex gap-1 border-t border-slate-800">
          {[
            { id: 'calendar', label: 'Calendar', icon: CalendarDays },
            { id: 'strategy', label: 'Strategy', icon: Target },
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'templates', label: 'Templates', icon: Layout },
            { id: 'hashtags', label: 'Hashtags', icon: Hash },
            { id: 'creatives', label: 'Creatives', icon: Image },
            { id: 'review', label: 'Review', icon: CheckCircle },
            { id: 'export', label: 'Export', icon: Download },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-400 hover:text-slate-300')}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </header>
      <main className="p-6">
        {!activeStrategyId ? (
          <EmptyState onCreate={() => setShowCreateStrategyModal(true)} />
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'calendar' && <CalendarTab entries={filteredEntries} campaigns={filteredCampaigns} strategy={activeStrategy!} onCreateEntry={() => setShowCreateEntryModal(true)} onUpdateEntry={handleUpdateEntry} onDeleteEntry={handleDeleteEntry} />}
            {activeTab === 'strategy' && <StrategyTab strategy={activeStrategy!} brand={brand} businessProfile={businessProfile} icps={icps} personas={personas} products={products} competitors={competitors} onUpdate={(updates) => handleUpdateStrategy(activeStrategy!.id, updates)} />}
            {activeTab === 'content' && <ContentTab entries={filteredEntries} campaigns={filteredCampaigns} strategy={activeStrategy!} onUpdateEntry={handleUpdateEntry} onDeleteEntry={handleDeleteEntry} onCreateEntry={handleCreateEntry} />}
            {activeTab === 'templates' && <TemplatesTab templates={templates} onCreateTemplate={async (data) => { const localId = addItem('socialContentTemplates', { ...data, companyId } as any); const res = await socialTemplateApi.create({ ...data, companyId, id: localId }); if (res.data && (res.data as any).id && (res.data as any).id !== localId) updateItem('socialContentTemplates', localId, { id: (res.data as any).id }); }} onUpdateTemplate={async (id, updates) => { updateItem('socialContentTemplates', id, updates); await socialTemplateApi.update(id, updates); }} onDeleteTemplate={async (id) => { deleteItem('socialContentTemplates', id); await socialTemplateApi.delete(id); }} />}
            {activeTab === 'hashtags' && <HashtagsTab hashtagBanks={hashtagBanks} onCreateHashtagBank={async (data) => { const localId = addItem('socialHashtagBanks', { ...data, companyId } as any); const res = await socialHashtagApi.create({ ...data, companyId, id: localId }); if (res.data && (res.data as any).id && (res.data as any).id !== localId) updateItem('socialHashtagBanks', localId, { id: (res.data as any).id }); }} onUpdateHashtagBank={async (id, updates) => { updateItem('socialHashtagBanks', id, updates); await socialHashtagApi.update(id, updates); }} onDeleteHashtagBank={async (id) => { deleteItem('socialHashtagBanks', id); await socialHashtagApi.delete(id); }} />}
            {activeTab === 'creatives' && <CreativesTab creatives={creatives} onUpdateCreative={async (id, updates) => { updateItem('socialCreatives', id, updates); await socialCreativeApi.update(id, updates); }} onDeleteCreative={async (id) => { deleteItem('socialCreatives', id); await socialCreativeApi.delete(id); }} onCreateCreative={async (data) => { const localId = addItem('socialCreatives', { ...data, companyId } as any); const res = await socialCreativeApi.create({ ...data, companyId, id: localId } as any); if (res.data && (res.data as any).id && (res.data as any).id !== localId) updateItem('socialCreatives', localId, { id: (res.data as any).id }); }} />}
            {activeTab === 'review' && <ReviewTab entries={filteredEntries} onUpdateEntry={handleUpdateEntry} />}
            {activeTab === 'export' && <ExportTab entries={filteredEntries} strategies={strategies} campaigns={filteredCampaigns} templates={templates} hashtagBanks={hashtagBanks} />}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateStrategyModal && <CreateStrategyModal onClose={() => setShowCreateStrategyModal(false)} onCreate={handleCreateStrategy} brand={brand} businessProfile={businessProfile} />}
      {showCreateEntryModal && <CreateEntryModal onClose={() => setShowCreateEntryModal(false)} onCreate={handleCreateEntry} strategyId={activeStrategyId} campaigns={filteredCampaigns} />}
      {showUploadCreativeModal && <UploadCreativeModal onClose={() => setShowUploadCreativeModal(false)} onCreate={(data) => { handleCreateEntry(data as any); }} />}
      {showApprovalModal && approvalEntryId && <ApprovalModal entry={filteredEntries.find((e) => e.id === approvalEntryId)!} onClose={() => { setShowApprovalModal(false); setApprovalEntryId(null); }} onUpdate={(updates) => { handleUpdateEntry(approvalEntryId, updates); setShowApprovalModal(false); setApprovalEntryId(null); }} />}
      {showRepurposeModal && repurposeEntry && <RepurposeContentModal entry={repurposeEntry} onClose={() => { setShowRepurposeModal(false); setRepurposeEntry(null); }} onCreate={(data) => { handleCreateEntry(data); setShowRepurposeModal(false); setRepurposeEntry(null); }} />}
    </div>
  );
}

// ============================================
// CALENDAR TAB
// ============================================

function CalendarTab({ entries, campaigns, strategy, onCreateEntry, onUpdateEntry, onDeleteEntry }: {
  entries: SocialCalendarEntry[]; campaigns: SocialCampaign[]; strategy: SocialContentStrategy;
  onCreateEntry: () => void; onUpdateEntry: (id: string, updates: Partial<SocialCalendarEntry>) => void;
  onDeleteEntry: (id: string) => void;
}) {
  const [calendarView, setCalendarView] = useState<SocialCalendarView>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<SocialCalendarEntry | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<SocialPlatform | 'all'>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const filtered = filterPlatform === 'all' ? entries : entries.filter((e) => e.platform === filterPlatform);

  const navigateMonth = (delta: number) => setCurrentDate(new Date(year, month + delta, 1));

  const getEntriesForDay = (day: number) => {
    const dateStr = formatDate(new Date(year, month, day));
    return filtered.filter((e) => e.publishDate === dateStr);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-slate-800 rounded-lg"><ChevronRight className="w-4 h-4 text-slate-400 rotate-180" /></button>
          <h2 className="text-xl font-semibold text-white">{MONTHS[month]} {year}</h2>
          <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-slate-800 rounded-lg"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg">Today</button>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
            <option value="all">All Platforms</option>
            {Object.entries(PLATFORM_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <div className="flex bg-slate-800 rounded-lg border border-slate-700">
            {([['monthly', 'Month'], ['weekly', 'Week'], ['daily', 'Day']] as const).map(([v, l]) => (
              <button key={v} onClick={() => setCalendarView(v as any)} className={cn('px-3 py-1.5 text-sm rounded-lg', calendarView === v ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-200')}>{l}</button>
            ))}
          </div>
          <button onClick={onCreateEntry} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </div>

      {/* Campaign colors legend */}
      {campaigns.length > 0 && (
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs text-slate-500">Campaigns:</span>
          {campaigns.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color || '#7C6BF0' }} /><span className="text-xs text-slate-400">{c.name}</span></div>
          ))}
        </div>
      )}

      {/* Monthly calendar grid */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-800/50">
          {DAYS.map((d) => <div key={d} className="px-2 py-3 text-center text-xs font-medium text-slate-400 border-b border-slate-800">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-slate-800 bg-slate-900/30" />)}
          {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
            const day = dayIdx + 1;
            const dayEntries = getEntriesForDay(day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            return (
              <div key={day} className="min-h-[100px] border-b border-r border-slate-800 p-1.5 hover:bg-slate-800/30 transition-colors">
                <div className={cn('text-sm mb-1', isToday ? 'w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center' : 'text-slate-400')}>{day}</div>
                <div className="space-y-1">
                  {dayEntries.slice(0, 3).map((entry) => {
                    const sConfig = STATUS_CONFIG[entry.status] || STATUS_CONFIG.planned;
                    const pConfig = PLATFORM_CONFIG[entry.platform] || PLATFORM_CONFIG.instagram;
                    return (
                      <button key={entry.id} onClick={() => setSelectedEntry(entry)}
                        className={cn('w-full text-left px-2 py-1 rounded text-xs truncate', sConfig.bgColor, sConfig.color)}>
                        <span className="font-medium">{pConfig.label}:</span> {entry.title}
                      </button>
                    );
                  })}
                  {dayEntries.length > 3 && <div className="text-xs text-slate-500 text-center">+{dayEntries.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Entry detail panel */}
      {selectedEntry && (
        <EntryDetailPanel entry={selectedEntry} onClose={() => setSelectedEntry(null)} onUpdate={onUpdateEntry} onDelete={onDeleteEntry} />
      )}
    </div>
  );
}

// ============================================
// ENTRY DETAIL PANEL
// ============================================

function EntryDetailPanel({ entry, onClose, onUpdate, onDelete }: {
  entry: SocialCalendarEntry; onClose: () => void;
  onUpdate: (id: string, updates: Partial<SocialCalendarEntry>) => void; onDelete: (id: string) => void;
}) {
  const sConfig = STATUS_CONFIG[entry.status] || STATUS_CONFIG.planned;
  const pConfig = PLATFORM_CONFIG[entry.platform] || PLATFORM_CONFIG.instagram;
  const priorityConfig = PRIORITY_CONFIG[entry.priority] || PRIORITY_CONFIG.medium;
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1"><span className={cn('text-xs px-2 py-0.5 rounded-full', sConfig.bgColor, sConfig.color)}>{sConfig.label}</span><span className={cn('text-xs font-medium', priorityConfig.color)}>{priorityConfig.label}</span></div>
          <h3 className="text-lg font-semibold text-slate-200">{entry.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
            <span className={cn('flex items-center gap-1', pConfig.color)}><pConfig.icon className="w-3.5 h-3.5" />{pConfig.label}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{entry.publishDate}{entry.publishTime && ` at ${entry.publishTime}`}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded"><X className="w-5 h-5 text-slate-400" /></button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          {entry.contentType && <div className="text-sm"><span className="text-slate-500">Type:</span> <span className="text-slate-200 ml-1">{CONTENT_TYPE_OPTIONS.find((t) => t.value === entry.contentType)?.label || entry.contentType}</span></div>}
          {entry.pillar && <div className="text-sm"><span className="text-slate-500">Pillar:</span> <span className="text-slate-200 ml-1">{PILLAR_OPTIONS.find((p) => p.value === entry.pillar)?.label || entry.pillar}</span></div>}
          {entry.funnelStage && <div className="text-sm"><span className="text-slate-500">Funnel:</span> <span className="text-slate-200 ml-1">{FUNNEL_OPTIONS.find((f) => f.value === entry.funnelStage)?.label || entry.funnelStage}</span></div>}
        </div>
        <div className="space-y-2">
          {entry.caption && <div className="text-sm"><span className="text-slate-500">Caption:</span> <span className="text-slate-300 ml-1 line-clamp-2">{entry.caption}</span></div>}
          {entry.hook && <div className="text-sm"><span className="text-slate-500">Hook:</span> <span className="text-slate-300 ml-1">{entry.hook}</span></div>}
          {entry.hashtags && entry.hashtags.length > 0 && <div className="text-sm"><span className="text-slate-500">Hashtags:</span> <span className="text-primary-400 ml-1">{entry.hashtags.join(' ')}</span></div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {(['planned', 'content-pending', 'writing-in-progress', 'design-pending', 'reel-editing', 'under-review'] as SocialEntryStatus[]).filter((s) => STATUS_CONFIG[s]).slice(STATUS_CONFIG[entry.status] ? (Object.keys(STATUS_CONFIG).indexOf(entry.status) + 1) : 0, 2).map((nextStatus) => (
          <button key={nextStatus} onClick={() => onUpdate(entry.id, { status: nextStatus })} className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors">
            Mark {STATUS_CONFIG[nextStatus].label}
          </button>
        ))}
        <button onClick={() => { if (confirm('Delete this entry?')) { onDelete(entry.id); onClose(); } }} className="px-3 py-1.5 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors ml-auto">Delete</button>
      </div>
    </div>
  );
}

// ============================================
// STRATEGY TAB
// ============================================

function StrategyTab({ strategy, brand, businessProfile, icps, personas, products, competitors, onUpdate }: {
  strategy: SocialContentStrategy; brand: Brand | null; businessProfile: BusinessProfile | undefined;
  icps: ICP[]; personas: Persona[]; products: Product[]; competitors: Competitor[];
  onUpdate: (updates: Partial<SocialContentStrategy>) => void;
}) {
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (field: string, value: string) => { setEditField(field); setEditValue(value); };
  const saveEdit = (field: string) => {
    if (field === 'name' || field === 'description' || field === 'targetAudience' || field === 'toneAndVoice') {
      onUpdate({ [field]: editValue });
    }
    setEditField(null);
  };
  const togglePillar = (pillar: ContentPillar) => {
    const current = strategy.contentPillars || [];
    onUpdate({ contentPillars: current.includes(pillar) ? current.filter((p) => p !== pillar) : [...current, pillar] });
  };
  const toggleObjective = (obj: string) => {
    const current = strategy.objectives || [];
    onUpdate({ objectives: current.includes(obj) ? current.filter((o) => o !== obj) : [...current, obj] });
  };

  const linkedData = strategy.linkedData || {};

  return (
    <div className="space-y-6">
      {/* Strategy Header */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {editField === 'name' ? (
              <input value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => saveEdit('name')}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit('name')}
                className="text-2xl font-bold text-white bg-slate-800 border border-primary-500 rounded-lg px-3 py-1 w-full focus:outline-none" autoFocus />
            ) : (
              <h2 className="text-2xl font-bold text-white cursor-pointer hover:text-primary-400 transition-colors" onClick={() => startEdit('name', strategy.name)}>{strategy.name}</h2>
            )}
            {editField === 'description' ? (
              <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => saveEdit('description')}
                className="w-full mt-2 bg-slate-800 border border-primary-500 rounded-lg px-3 py-2 text-slate-200 focus:outline-none resize-none" rows={3} autoFocus />
            ) : (
              <p className="text-slate-400 mt-1 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => startEdit('description', strategy.description || '')}>
                {strategy.description || 'Click to add a description...'}
              </p>
            )}
          </div>
          <button onClick={() => onUpdate({})} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
        </div>

        {/* Brand context summary */}
        {brand && (
          <div className="flex items-center gap-3 mt-3 px-4 py-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
            <Palette className="w-5 h-5 text-purple-400" />
            <div className="flex-1">
              <span className="text-sm text-purple-300 font-medium">Brand: {brand.voice || 'No brand voice set'}</span>
              <span className="text-sm text-slate-400 ml-3">Personality: {brand.personality || 'Not set'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Pillars */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary-400" /> Content Pillars</h3>
        <p className="text-sm text-slate-400 mb-4">Select the content pillars that define your social media strategy.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {PILLAR_OPTIONS.map((pillar) => {
            const isActive = (strategy.contentPillars || []).includes(pillar.value);
            return (
              <button key={pillar.value} onClick={() => togglePillar(pillar.value)}
                className={cn('p-3 rounded-lg border text-left transition-all', isActive ? 'border-primary-500 bg-primary-900/20' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600')}>
                <div className={cn('text-sm font-medium', isActive ? 'text-primary-400' : 'text-slate-300')}>{pillar.label}</div>
                <div className="text-xs text-slate-500 mt-1">{pillar.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Objectives */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary-400" /> Objectives</h3>
        <div className="flex flex-wrap gap-2">
          {(['Brand Awareness', 'Lead Generation', 'Community Building', 'Thought Leadership', 'Product Launch', 'Engagement Growth', 'Website Traffic', 'Customer Retention', 'Event Promotion', 'Sales Conversion'] as const).map((obj) => {
            const isActive = (strategy.objectives || []).includes(obj);
            return (
              <button key={obj} onClick={() => toggleObjective(obj)}
                className={cn('px-3 py-1.5 rounded-full text-sm border transition-all', isActive ? 'border-primary-500 bg-primary-900/20 text-primary-400' : 'border-slate-700 text-slate-400 hover:border-slate-600')}>
                {obj}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Audience & Voice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary-400" /> Target Audience</h3>
          {editField === 'targetAudience' ? (
            <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => saveEdit('targetAudience')}
              className="w-full bg-slate-800 border border-primary-500 rounded-lg px-3 py-2 text-slate-200 focus:outline-none resize-none" rows={4} autoFocus />
          ) : (
            <p className="text-slate-300 cursor-pointer hover:text-primary-400 transition-colors" onClick={() => startEdit('targetAudience', strategy.targetAudience || '')}>
              {strategy.targetAudience || 'Click to define your target audience...'}
            </p>
          )}
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary-400" /> Tone & Voice</h3>
          {editField === 'toneAndVoice' ? (
            <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => saveEdit('toneAndVoice')}
              className="w-full bg-slate-800 border border-primary-500 rounded-lg px-3 py-2 text-slate-200 focus:outline-none resize-none" rows={4} autoFocus />
          ) : (
            <p className="text-slate-300 cursor-pointer hover:text-primary-400 transition-colors" onClick={() => startEdit('toneAndVoice', strategy.toneAndVoice || '')}>
              {strategy.toneAndVoice || 'Click to define your brand tone and voice...'}
            </p>
          )}
        </div>
      </div>

      {/* Posting Frequency */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-primary-400" /> Posting Frequency Goals</h3>
        <p className="text-sm text-slate-400 mb-4">Set weekly posting targets for each platform.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(PLATFORM_CONFIG).slice(0, 8).map(([platform, config]) => {
            const currentFreq = (strategy.postingFrequencyGoal || {})[platform] || 0;
            return (
              <div key={platform} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2"><config.icon className={cn('w-4 h-4', config.color)} /><span className="text-sm text-slate-200">{config.label}</span></div>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" max="14" value={currentFreq}
                    onChange={(e) => onUpdate({ postingFrequencyGoal: { ...(strategy.postingFrequencyGoal || {}), [platform]: parseInt(e.target.value) || 0 } })}
                    className="w-16 px-2 py-1 bg-slate-900 border border-slate-600 rounded text-slate-200 text-sm focus:outline-none focus:border-primary-500" />
                  <span className="text-xs text-slate-500">posts/week</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Linked Data */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2"><Link className="w-5 h-5 text-primary-400" /> Linked Data</h3>
        <p className="text-sm text-slate-400 mb-4">Connect your social media strategy to brand and business data for AI context.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-1">Brand</div>
            <div className="text-sm text-slate-200">{brand?.voice || 'Not linked'}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-1">Business Profile</div>
            <div className="text-sm text-slate-200">{businessProfile?.name || 'Not linked'}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-1">ICPs</div>
            <div className="text-sm text-slate-200">{(linkedData.icpIds || []).length > 0 ? `${(linkedData.icpIds || []).length} linked` : 'None linked'}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-1">Products</div>
            <div className="text-sm text-slate-200">{(linkedData.productIds || []).length > 0 ? `${(linkedData.productIds || []).length} linked` : 'None linked'}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-1">Competitors</div>
            <div className="text-sm text-slate-200">{(linkedData.competitorIds || []).length > 0 ? `${(linkedData.competitorIds || []).length} linked` : 'None linked'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CREATE STRATEGY MODAL
// ============================================

function CreateStrategyModal({ onClose, onCreate, brand, businessProfile }: {
  onClose: () => void; onCreate: (data: Partial<SocialContentStrategy>) => void;
  brand: Brand | null; businessProfile: BusinessProfile | undefined;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [toneAndVoice, setToneAndVoice] = useState(brand?.voice || '');
  const [selectedPillars, setSelectedPillars] = useState<ContentPillar[]>(['awareness', 'engagement', 'education']);

  const togglePillar = (p: ContentPillar) => {
    setSelectedPillars((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      description: description.trim(),
      targetAudience: targetAudience.trim(),
      toneAndVoice: toneAndVoice.trim() || brand?.voice || '',
      contentPillars: selectedPillars,
      objectives: [],
      postingFrequencyGoal: { instagram: 5, linkedin: 3, twitter: 7 },
      linkedData: {
        brandId: brand?.id,
        businessProfileId: businessProfile?.id,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Create Social Media Strategy</h2>
          <p className="text-sm text-slate-400 mt-1">Define your content strategy foundation</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Strategy Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Q2 2026 Growth Strategy"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the strategy goals and approach..." rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Target Audience</label>
            <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g., SaaS founders, 25-45, tech-savvy"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Tone & Voice</label>
            <input value={toneAndVoice} onChange={(e) => setToneAndVoice(e.target.value)} placeholder={brand?.voice || "e.g., Professional yet approachable"}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Content Pillars</label>
            <div className="flex flex-wrap gap-2">
              {PILLAR_OPTIONS.map((p) => (
                <button key={p.value} onClick={() => togglePillar(p.value)}
                  className={cn('px-3 py-1.5 rounded-full text-xs border transition-all',
                    selectedPillars.includes(p.value) ? 'border-primary-500 bg-primary-900/20 text-primary-400' : 'border-slate-700 text-slate-400 hover:border-slate-600')}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!name.trim()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors">Create Strategy</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CREATE ENTRY MODAL
// ============================================

function CreateEntryModal({ onClose, onCreate, strategyId, campaigns }: {
  onClose: () => void; onCreate: (data: Partial<SocialCalendarEntry>) => void;
  strategyId: string | null; campaigns: SocialCampaign[];
}) {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [contentType, setContentType] = useState<SocialContentType>('static-post');
  const [publishDate, setPublishDate] = useState(formatDate(new Date()));
  const [publishTime, setPublishTime] = useState('12:00');
  const [priority, setPriority] = useState<EntryPriority>('medium');
  const [campaignId, setCampaignId] = useState('');
  const [pillar, setPillar] = useState<ContentPillar>('awareness');
  const [funnelStage, setFunnelStage] = useState<SocialFunnelStage>('top-of-funnel');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({
      calendarId: '',
      strategyId: strategyId || undefined,
      title: title.trim(),
      platform,
      contentType,
      publishDate,
      publishTime,
      priority,
      campaignId: campaignId || undefined,
      pillar,
      funnelStage,
      status: 'planned',
      approvalStatus: 'pending',
      companyId: '',
    } as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Create Calendar Entry</h2>
          <p className="text-sm text-slate-400 mt-1">Plan a new social media content piece</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Product Launch Announcement"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(PLATFORM_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Content Type</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value as SocialContentType)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {CONTENT_TYPE_OPTIONS.map((ct) => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Publish Date</label>
              <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Publish Time</label>
              <input type="time" value={publishTime} onChange={(e) => setPublishTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as EntryPriority)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Campaign</label>
              <select value={campaignId} onChange={(e) => setCampaignId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">No Campaign</option>
                {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Content Pillar</label>
              <select value={pillar} onChange={(e) => setPillar(e.target.value as ContentPillar)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {PILLAR_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Funnel Stage</label>
              <select value={funnelStage} onChange={(e) => setFunnelStage(e.target.value as SocialFunnelStage)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {FUNNEL_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!title.trim()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors">Create Entry</button>
        </div>
      </div>
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
          <CalendarDays className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Social Media Strategy Yet</h2>
        <p className="text-slate-400 mb-6">Create your first social media strategy to start planning content, managing workflows, and coordinating your social media production.</p>
        <button onClick={onCreate} className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium mx-auto transition-colors">
          <Plus className="w-5 h-5" /> Create Strategy
        </button>
      </div>
    </div>
  );
}

// ============================================
// CONTENT TAB
// ============================================

function ContentTab({ entries, campaigns, strategy, onUpdateEntry, onDeleteEntry, onCreateEntry }: {
  entries: SocialCalendarEntry[]; campaigns: SocialCampaign[]; strategy: SocialContentStrategy;
  onUpdateEntry: (id: string, updates: Partial<SocialCalendarEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onCreateEntry: (data: Partial<SocialCalendarEntry>) => void;
}) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<SocialEntryStatus | 'all'>('all');
  const [filterPlatform, setFilterPlatform] = useState<SocialPlatform | 'all'>('all');
  const [filterPillar, setFilterPillar] = useState<ContentPillar | 'all'>('all');
  const [sortField, setSortField] = useState<'publishDate' | 'priority' | 'status'>('publishDate');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');

  const filtered = useMemo(() => {
    let result = [...entries];
    if (search) result = result.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()) || e.caption?.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus !== 'all') result = result.filter((e) => e.status === filterStatus);
    if (filterPlatform !== 'all') result = result.filter((e) => e.platform === filterPlatform);
    if (filterPillar !== 'all') result = result.filter((e) => e.pillar === filterPillar);
    result.sort((a, b) => {
      if (sortField === 'publishDate') return a.publishDate.localeCompare(b.publishDate);
      if (sortField === 'priority') { const order: Record<EntryPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 }; return (order[a.priority] ?? 2) - (order[b.priority] ?? 2); }
      return 0;
    });
    return result;
  }, [entries, search, filterStatus, filterPlatform, filterPillar, sortField]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e) => { counts[e.status] = (counts[e.status] || 0) + 1; });
    return counts;
  }, [entries]);

  const startEditCaption = (entry: SocialCalendarEntry) => { setEditingId(entry.id); setEditCaption(entry.caption || ''); };
  const saveCaption = (id: string) => { onUpdateEntry(id, { caption: editCaption }); setEditingId(null); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(STATUS_CONFIG).filter(([k]) => statusCounts[k]).slice(0, 6).map(([key, cfg]) => (
          <div key={key} className={cn('px-3 py-2 rounded-lg border', cfg.bgColor, 'border-slate-700')}>
            <div className={cn('text-lg font-semibold', cfg.color)}>{statusCounts[key]}</div>
            <div className="text-xs text-slate-400">{cfg.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search entries..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500 text-sm" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
          <option value="all">All Platforms</option>
          {Object.entries(PLATFORM_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterPillar} onChange={(e) => setFilterPillar(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
          <option value="all">All Pillars</option>
          {PILLAR_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <select value={sortField} onChange={(e) => setSortField(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
          <option value="publishDate">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Platform</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Caption</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-500">No entries found</td></tr>
            ) : filtered.map((entry) => {
              const sCfg = STATUS_CONFIG[entry.status] || STATUS_CONFIG.planned;
              const pCfg = PLATFORM_CONFIG[entry.platform] || PLATFORM_CONFIG.instagram;
              const prCfg = PRIORITY_CONFIG[entry.priority] || PRIORITY_CONFIG.medium;
              const ctLabel = CONTENT_TYPE_OPTIONS.find((c) => c.value === entry.contentType)?.label || entry.contentType;
              return (
                <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3"><div className="text-sm font-medium text-slate-200">{entry.title}</div></td>
                  <td className="px-4 py-3"><span className={cn('flex items-center gap-1.5 text-sm', pCfg.color)}><pCfg.icon className="w-3.5 h-3.5" />{pCfg.label}</span></td>
                  <td className="px-4 py-3 text-sm text-slate-300">{ctLabel}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{entry.publishDate}{entry.publishTime ? ` ${entry.publishTime}` : ''}</td>
                  <td className="px-4 py-3"><span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full', sCfg.bgColor, sCfg.color)}><sCfg.icon className="w-3 h-3" />{sCfg.label}</span></td>
                  <td className="px-4 py-3"><span className={cn('text-xs font-medium', prCfg.color)}>{prCfg.label}</span></td>
                  <td className="px-4 py-3 max-w-[200px]">
                    {editingId === entry.id ? (
                      <div className="flex items-center gap-1">
                        <input value={editCaption} onChange={(e) => setEditCaption(e.target.value)}
                          className="w-full px-2 py-1 bg-slate-800 border border-primary-500 rounded text-sm text-slate-200 focus:outline-none" autoFocus />
                        <button onClick={() => saveCaption(entry.id)} className="p-1 text-green-400 hover:text-green-300"><CheckCircle className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 truncate block cursor-pointer hover:text-slate-200" onClick={() => startEditCaption(entry)}>
                        {entry.caption || <span className="text-slate-600 italic">Add caption...</span>}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {entry.status !== 'posted' && (() => {
                        const nextMap: Record<string, SocialEntryStatus> = { planned: 'content-pending', 'content-pending': 'writing-in-progress', 'writing-in-progress': 'under-review', 'under-review': 'approved', approved: 'scheduled', scheduled: 'posted' };
                        const next = nextMap[entry.status];
                        return next ? <button onClick={() => onUpdateEntry(entry.id, { status: next })} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-primary-400" title="Advance"><ArrowRight className="w-3.5 h-3.5" /></button> : null;
                      })()}
                      <button onClick={() => { if (confirm('Delete?')) onDeleteEntry(entry.id); }} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// TEMPLATES TAB
// ============================================

const TEMPLATE_CATEGORY_CONFIG: Record<SocialTemplateCategory, { label: string; icon: any; description: string }> = {
  caption: { label: 'Caption', icon: FileText, description: 'Pre-written caption frameworks' },
  hook: { label: 'Hook', icon: Zap, description: 'Attention-grabbing openers' },
  cta: { label: 'CTA', icon: ArrowRight, description: 'Call-to-action templates' },
  'hashtag-set': { label: 'Hashtag Set', icon: Hash, description: 'Curated hashtag collections' },
  'reel-script': { label: 'Reel Script', icon: Play, description: 'Reel/video script templates' },
  'carousel-framework': { label: 'Carousel', icon: Layers, description: 'Carousel slide frameworks' },
  campaign: { label: 'Campaign', icon: Target, description: 'Full campaign templates' },
  'story-framework': { label: 'Story', icon: Star, description: 'Story sequence templates' },
};

function TemplatesTab({ templates, onCreateTemplate, onUpdateTemplate, onDeleteTemplate }: {
  templates: SocialContentTemplate[];
  onCreateTemplate: (data: Partial<SocialContentTemplate>) => void;
  onUpdateTemplate: (id: string, updates: Partial<SocialContentTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<SocialTemplateCategory | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<SocialContentTemplate | null>(null);

  const filtered = useMemo(() => {
    let result = [...templates];
    if (filterCategory !== 'all') result = result.filter((t) => t.category === filterCategory);
    return result;
  }, [templates, filterCategory]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
            <option value="all">All Categories</option>
            {Object.entries(TEMPLATE_CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <span className="text-sm text-slate-400">{filtered.length} template{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <button onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm">
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            <Layout className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p>No templates yet. Create your first template to standardize content production.</p>
          </div>
        ) : filtered.map((template) => {
          const catCfg = TEMPLATE_CATEGORY_CONFIG[template.category] || TEMPLATE_CATEGORY_CONFIG.caption;
          const CatIcon = catCfg.icon;
          return (
            <div key={template.id} onClick={() => setSelectedTemplate(selectedTemplate?.id === template.id ? null : template)}
              className={cn('bg-slate-900/50 border rounded-xl p-4 cursor-pointer transition-all hover:border-primary-500/50',
                selectedTemplate?.id === template.id ? 'border-primary-500' : 'border-slate-800')}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', template.isDefault ? 'bg-primary-900/30' : 'bg-slate-800')}>
                    <CatIcon className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">{template.name}</h4>
                    <span className="text-xs text-slate-500">{catCfg.label}</span>
                  </div>
                </div>
                {template.isDefault && <span className="text-xs px-2 py-0.5 bg-primary-900/30 text-primary-400 rounded-full">Default</span>}
              </div>
              {template.description && <p className="text-xs text-slate-400 mb-3 line-clamp-2">{template.description}</p>}
              <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300 line-clamp-3 mb-3">{template.content}</div>
              <div className="flex items-center gap-2 flex-wrap">
                {template.platform && <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">{(PLATFORM_CONFIG[template.platform] || { label: template.platform }).label}</span>}
                {template.pillar && <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">{(PILLAR_OPTIONS.find((p) => p.value === template.pillar) || { label: template.pillar }).label}</span>}
                {template.tags?.map((tag) => <span key={tag} className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">{tag}</span>)}
              </div>
              <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-slate-800">
                <button onClick={(e) => { e.stopPropagation(); onDeleteTemplate(template.id); if (selectedTemplate?.id === template.id) setSelectedTemplate(null); }}
                  className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );
        })}
      </div>
      {showCreateModal && <CreateTemplateModal onClose={() => setShowCreateModal(false)} onCreate={onCreateTemplate} />}
    </div>
  );
}

// ============================================
// CREATE TEMPLATE MODAL
// ============================================

function CreateTemplateModal({ onClose, onCreate }: {
  onClose: () => void; onCreate: (data: Partial<SocialContentTemplate>) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SocialTemplateCategory>('caption');
  const [platform, setPlatform] = useState<SocialPlatform | ''>('');
  const [pillar, setPillar] = useState<ContentPillar | ''>('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !content.trim()) return;
    onCreate({
      calendarId: '', name: name.trim(), description: description.trim(), category,
      platform: platform || undefined, contentType: undefined,
      pillar: pillar || undefined, content: content.trim(),
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      isDefault,
    } as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Create Content Template</h2>
          <p className="text-sm text-slate-400 mt-1">Build a reusable template for social media content</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Template Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Product Launch Caption"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as SocialTemplateCategory)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
              {Object.entries(TEMPLATE_CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label} — {v.description}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value as SocialPlatform | '')}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">All Platforms</option>
                {Object.entries(PLATFORM_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Content Pillar</label>
              <select value={pillar} onChange={(e) => setPillar(e.target.value as ContentPillar | '')}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">Any Pillar</option>
                {PILLAR_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Template Content *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your template content here. Use [PLACEHOLDER] for variable parts..."
              rows={5} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Tags (comma-separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., product-launch, instagram, reel"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm text-slate-300">Set as default template</span>
          </label>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!name.trim() || !content.trim()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors">Create Template</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HASHTAGS TAB
// ============================================

const HASHTAG_TYPE_CONFIG: Record<HashtagType, { label: string; color: string; description: string }> = {
  trending: { label: 'Trending', color: 'text-red-400', description: 'Currently popular hashtags' },
  branded: { label: 'Branded', color: 'text-purple-400', description: 'Brand-specific hashtags' },
  evergreen: { label: 'Evergreen', color: 'text-green-400', description: 'Always-relevant hashtags' },
  niche: { label: 'Niche', color: 'text-blue-400', description: 'Industry-specific hashtags' },
  campaign: { label: 'Campaign', color: 'text-amber-400', description: 'Campaign-specific hashtags' },
  community: { label: 'Community', color: 'text-pink-400', description: 'Community-building hashtags' },
};

function HashtagsTab({ hashtagBanks, onCreateHashtagBank, onUpdateHashtagBank, onDeleteHashtagBank }: {
  hashtagBanks: SocialHashtagBank[];
  onCreateHashtagBank: (data: Partial<SocialHashtagBank>) => void;
  onUpdateHashtagBank: (id: string, updates: Partial<SocialHashtagBank>) => void;
  onDeleteHashtagBank: (id: string) => void;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState<HashtagType | 'all'>('all');
  const [filterPlatform, setFilterPlatform] = useState<SocialPlatform | 'all'>('all');
  const [expandedBank, setExpandedBank] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...hashtagBanks];
    if (filterType !== 'all') result = result.filter((b) => b.type === filterType);
    if (filterPlatform !== 'all') result = result.filter((b) => b.platform === filterPlatform);
    return result;
  }, [hashtagBanks, filterType, filterPlatform]);

  const totalHashtags = useMemo(() => filtered.reduce((sum, b) => sum + (b.hashtags?.length || 0), 0), [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
            <option value="all">All Types</option>
            {Object.entries(HASHTAG_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
            <option value="all">All Platforms</option>
            {Object.entries(PLATFORM_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <span className="text-sm text-slate-400">{filtered.length} banks | {totalHashtags} hashtags</span>
        </div>
        <button onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm">
          <Plus className="w-4 h-4" /> Create Hashtag Bank
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Hash className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <p>No hashtag banks yet. Create one to organize your hashtags by type and platform.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((bank) => {
            const typeCfg = HASHTAG_TYPE_CONFIG[bank.type] || HASHTAG_TYPE_CONFIG.evergreen;
            const isExpanded = expandedBank === bank.id;
            return (
              <div key={bank.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-800/30" onClick={() => setExpandedBank(isExpanded ? null : bank.id)}>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); }} className="p-1 text-slate-400 hover:text-slate-200">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-slate-200">{bank.name}</h4>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', typeCfg.color)}>{typeCfg.label}</span>
                        {bank.platform && <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">{(PLATFORM_CONFIG[bank.platform] || { label: bank.platform }).label}</span>}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{bank.hashtags?.length || 0} hashtags {bank.campaign ? `| Campaign: ${bank.campaign}` : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bank.avgReach && <span className="text-xs text-slate-400">Reach: {bank.avgReach.toLocaleString()}</span>}
                    {bank.avgEngagement && <span className="text-xs text-slate-400">Eng: {bank.avgEngagement.toLocaleString()}</span>}
                    <button onClick={(e) => { e.stopPropagation(); onDeleteHashtagBank(bank.id); }}
                      className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-5 pb-4 pt-2 border-t border-slate-800">
                    <div className="flex flex-wrap gap-2">
                      {bank.hashtags?.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary-900/20 text-primary-300 rounded-full text-sm cursor-pointer hover:bg-primary-900/40 transition-colors"
                          onClick={() => { navigator.clipboard.writeText(`#${tag.startsWith('#') ? tag.slice(1) : tag}`); }}>
                          #{tag.startsWith('#') ? tag.slice(1) : tag}
                        </span>
                      ))}
                    </div>
                    {bank.hashtags && bank.hashtags.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={() => { navigator.clipboard.writeText(bank.hashtags!.map((t) => `#${t.startsWith('#') ? t.slice(1) : t}`).join(' ')); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors">
                          <Copy className="w-3.5 h-3.5" /> Copy All Hashtags
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && <CreateHashtagBankModal onClose={() => setShowCreateModal(false)} onCreate={onCreateHashtagBank} />}
    </div>
  );
}

// ============================================
// CREATE HASHTAG BANK MODAL
// ============================================

function CreateHashtagBankModal({ onClose, onCreate }: {
  onClose: () => void; onCreate: (data: Partial<SocialHashtagBank>) => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<HashtagType>('evergreen');
  const [platform, setPlatform] = useState<SocialPlatform | ''>('');
  const [campaign, setCampaign] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, '');
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => { setHashtags(hashtags.filter((t) => t !== tag)); };

  const handleSubmit = () => {
    if (!name.trim() || hashtags.length === 0) return;
    onCreate({
      calendarId: '', name: name.trim(), type, platform: platform || undefined,
      campaign: campaign.trim() || undefined, hashtags, isActive: true,
    } as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Create Hashtag Bank</h2>
          <p className="text-sm text-slate-400 mt-1">Organize hashtags by type, platform, and campaign</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Bank Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Instagram Product Launch Hashtags"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Type *</label>
              <select value={type} onChange={(e) => setType(e.target.value as HashtagType)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(HASHTAG_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value as SocialPlatform | '')}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">All Platforms</option>
                {Object.entries(PLATFORM_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Campaign</label>
            <input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="e.g., Summer 2026 Launch"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Hashtags *</label>
            <div className="flex gap-2">
              <input value={hashtagInput} onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHashtag(); } }}
                placeholder="Type a hashtag and press Enter"
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
              <button onClick={addHashtag} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {hashtags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary-900/20 text-primary-300 rounded-full text-sm">
                  #{tag}
                  <button onClick={() => removeHashtag(tag)} className="text-primary-400 hover:text-primary-200"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!name.trim() || hashtags.length === 0}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors">Create Hashtag Bank</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CREATIVES TAB
// ============================================

const MEDIA_TYPE_CONFIG: Record<CreativeMediaType, { label: string; icon: any; color: string }> = {
  image: { label: 'Image', icon: Image, color: 'text-blue-400' },
  video: { label: 'Video', icon: Play, color: 'text-red-400' },
  reel: { label: 'Reel', icon: Play, color: 'text-pink-400' },
  carousel: { label: 'Carousel', icon: Layers, color: 'text-purple-400' },
  story: { label: 'Story', icon: Star, color: 'text-amber-400' },
  thumbnail: { label: 'Thumbnail', icon: Image, color: 'text-green-400' },
  graphic: { label: 'Graphic', icon: Palette, color: 'text-cyan-400' },
  infographic: { label: 'Infographic', icon: BarChart3, color: 'text-teal-400' },
  gif: { label: 'GIF', icon: Play, color: 'text-yellow-400' },
  audio: { label: 'Audio', icon: MessageSquare, color: 'text-indigo-400' },
};

function CreativesTab({ creatives, onUpdateCreative, onDeleteCreative, onCreateCreative }: {
  creatives: SocialCreative[];
  onUpdateCreative: (id: string, updates: Partial<SocialCreative>) => void;
  onDeleteCreative: (id: string) => void;
  onCreateCreative: (data: Partial<SocialCreative>) => void;
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filterType, setFilterType] = useState<CreativeMediaType | 'all'>('all');
  const [filterPlatform, setFilterPlatform] = useState<SocialPlatform | 'all'>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    let result = [...creatives];
    if (filterType !== 'all') result = result.filter((c) => c.mediaType === filterType);
    if (filterPlatform !== 'all') result = result.filter((c) => c.platform === filterPlatform);
    if (search) result = result.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())));
    return result;
  }, [creatives, filterType, filterPlatform, search]);

  const toggleFavorite = (id: string, current: boolean) => { onUpdateCreative(id, { isFavorite: !current }); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search creatives..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500 text-sm" />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
            <option value="all">All Types</option>
            {Object.entries(MEDIA_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
            <option value="all">All Platforms</option>
            {Object.entries(PLATFORM_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <div className="flex bg-slate-800 rounded-lg border border-slate-700">
            <button onClick={() => setViewMode('grid')} className={cn('p-2 rounded-lg', viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-slate-400')}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={cn('p-2 rounded-lg', viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-slate-400')}><ListIcon className="w-4 h-4" /></button>
          </div>
        </div>
        <button onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm">
          <Plus className="w-4 h-4" /> Upload Creative
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Image className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <p>No creatives yet. Upload images, videos, and design assets.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((creative) => {
            const mtCfg = MEDIA_TYPE_CONFIG[creative.mediaType] || MEDIA_TYPE_CONFIG.image;
            const MtIcon = mtCfg.icon;
            return (
              <div key={creative.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden group hover:border-primary-500/50 transition-all">
                <div className="aspect-square bg-slate-800 flex items-center justify-center relative">
                  {creative.url ? <img src={creative.url} alt={creative.name} className="w-full h-full object-cover" /> : <MtIcon className={cn('w-12 h-12', mtCfg.color)} />}
                  <button onClick={() => toggleFavorite(creative.id, creative.isFavorite)}
                    className={cn('absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-black/60', creative.isFavorite ? 'text-yellow-400' : 'text-white/60')}>
                    <Star className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full bg-black/60', mtCfg.color)}>{mtCfg.label}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-slate-200 truncate">{creative.name}</h4>
                  {creative.description && <p className="text-xs text-slate-400 truncate mt-0.5">{creative.description}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1 flex-wrap">
                      {creative.platform && <span className="text-xs px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">{(PLATFORM_CONFIG[creative.platform] || { label: creative.platform }).label}</span>}
                      {creative.category && <span className="text-xs px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">{creative.category}</span>}
                    </div>
                    <button onClick={() => { if (confirm('Delete this creative?')) onDeleteCreative(creative.id); }}
                      className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  {creative.sourceUrl && (
                    <div className="flex gap-2 mt-2 pt-2 border-t border-slate-800">
                      <a href={creative.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:underline"><ExternalLink className="w-3 h-3" />Source</a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-slate-800 bg-slate-800/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Platform</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Tags</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((creative) => {
                const mtCfg = MEDIA_TYPE_CONFIG[creative.mediaType] || MEDIA_TYPE_CONFIG.image;
                return (
                  <tr key={creative.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleFavorite(creative.id, creative.isFavorite)} className={creative.isFavorite ? 'text-yellow-400' : 'text-slate-500'}><Star className="w-4 h-4" /></button>
                        <span className="text-sm text-slate-200">{creative.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={cn('text-sm', mtCfg.color)}>{mtCfg.label}</span></td>
                    <td className="px-4 py-3 text-sm text-slate-300">{creative.platform ? (PLATFORM_CONFIG[creative.platform] || { label: creative.platform }).label : '—'}</td>
                    <td className="px-4 py-3"><div className="flex gap-1 flex-wrap">{creative.tags?.map((t) => <span key={t} className="text-xs px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">{t}</span>)}</div></td>
                    <td className="px-4 py-3 text-right"><button onClick={() => { if (confirm('Delete?')) onDeleteCreative(creative.id); }} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {showUploadModal && <UploadCreativeModal onClose={() => setShowUploadModal(false)} onCreate={onCreateCreative} />}
    </div>
  );
}

// ============================================
// UPLOAD CREATIVE MODAL
// ============================================

function UploadCreativeModal({ onClose, onCreate }: {
  onClose: () => void; onCreate: (data: Partial<SocialCreative>) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<CreativeMediaType>('image');
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform | ''>('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate({
      calendarId: '', name: name.trim(), description: description.trim() || undefined,
      mediaType, url: url.trim() || undefined, platform: platform || undefined,
      category: category.trim() || undefined, tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      isFavorite: false,
    } as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Upload Creative Asset</h2>
          <p className="text-sm text-slate-400 mt-1">Add images, videos, and design assets to your media library</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Product Hero Banner"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Media Type</label>
              <select value={mediaType} onChange={(e) => setMediaType(e.target.value as CreativeMediaType)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(MEDIA_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value as SocialPlatform | '')}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">All Platforms</option>
                {Object.entries(PLATFORM_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Asset URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the creative asset..." rows={2}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Product, Brand, Campaign"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Tags (comma-separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., launch, hero, banner"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Source URL</label>
            <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="Drive, Figma, or Canva link"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!name.trim()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors">Upload Creative</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// REVIEW TAB
// ============================================

const REVIEW_STAGES: { key: SocialEntryStatus; label: string; description: string }[] = [
  { key: 'planned', label: 'Planned', description: 'Entries awaiting content creation' },
  { key: 'content-pending', label: 'Content Pending', description: 'Ready for writing' },
  { key: 'writing-in-progress', label: 'Writing', description: 'Content being written' },
  { key: 'design-pending', label: 'Design Pending', description: 'Awaiting graphic/reel creation' },
  { key: 'reel-editing', label: 'Reel Editing', description: 'Video/reel in production' },
  { key: 'under-review', label: 'Under Review', description: 'Awaiting approval' },
  { key: 'approved', label: 'Approved', description: 'Ready to schedule' },
  { key: 'scheduled', label: 'Scheduled', description: 'Queued for publishing' },
];

function ReviewTab({ entries, onUpdateEntry }: {
  entries: SocialCalendarEntry[];
  onUpdateEntry: (id: string, updates: Partial<SocialCalendarEntry>) => void;
}) {
  const [activeStage, setActiveStage] = useState<SocialEntryStatus>('under-review');
  const stageEntries = useMemo(() => entries.filter((e) => e.status === activeStage), [entries, activeStage]);
  const stageCounts = useMemo(() => {
    const counts: Partial<Record<SocialEntryStatus, number>> = {};
    REVIEW_STAGES.forEach((s) => { counts[s.key] = entries.filter((e) => e.status === s.key).length; });
    return counts;
  }, [entries]);

  return (
    <div className="space-y-4">
      {/* Stage pipeline */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {REVIEW_STAGES.map((stage) => {
          const cfg = STATUS_CONFIG[stage.key];
          const count = stageCounts[stage.key] || 0;
          const isActive = activeStage === stage.key;
          return (
            <button key={stage.key} onClick={() => setActiveStage(stage.key)}
              className={cn('flex-shrink-0 px-4 py-3 rounded-lg border text-left transition-all min-w-[140px]',
                isActive ? 'border-primary-500 bg-primary-900/20' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600')}>
              <div className="flex items-center justify-between mb-1">
                <span className={cn('text-xs font-medium', cfg.color)}>{stage.label}</span>
                <span className={cn('text-sm font-bold', count > 0 ? cfg.color : 'text-slate-600')}>{count}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{stage.description}</p>
            </button>
          );
        })}
      </div>

      {/* Entries in selected stage */}
      {stageEntries.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <p>No entries in "{STATUS_CONFIG[activeStage]?.label}" stage.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stageEntries.map((entry) => {
            const pCfg = PLATFORM_CONFIG[entry.platform] || PLATFORM_CONFIG.instagram;
            const prCfg = PRIORITY_CONFIG[entry.priority] || PRIORITY_CONFIG.medium;
            const ctLabel = CONTENT_TYPE_OPTIONS.find((c) => c.value === entry.contentType)?.label || entry.contentType;
            return (
              <div key={entry.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-slate-200">{entry.title}</h4>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', prCfg.color)}>{prCfg.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className={cn('flex items-center gap-1', pCfg.color)}><pCfg.icon className="w-3 h-3" />{pCfg.label}</span>
                      <span>{ctLabel}</span>
                      <span>{entry.publishDate}{entry.publishTime ? ` at ${entry.publishTime}` : ''}</span>
                      {entry.pillar && <span className="text-primary-400">{PILLAR_OPTIONS.find((p) => p.value === entry.pillar)?.label}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeStage === 'under-review' && (
                      <>
                        <button onClick={() => onUpdateEntry(entry.id, { status: 'approved', approvalStatus: 'approved' })}
                          className="px-3 py-1.5 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded-lg text-xs transition-colors">Approve</button>
                        <button onClick={() => onUpdateEntry(entry.id, { status: 'rejected', approvalStatus: 'rejected' })}
                          className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-xs transition-colors">Reject</button>
                        <button onClick={() => onUpdateEntry(entry.id, { approvalStatus: 'changes-requested' })}
                          className="px-3 py-1.5 bg-amber-900/30 hover:bg-amber-900/50 text-amber-400 rounded-lg text-xs transition-colors">Request Changes</button>
                      </>
                    )}
                    {activeStage === 'approved' && (
                      <button onClick={() => onUpdateEntry(entry.id, { status: 'scheduled' })}
                        className="px-3 py-1.5 bg-primary-900/30 hover:bg-primary-900/50 text-primary-400 rounded-lg text-xs transition-colors">Mark Scheduled</button>
                    )}
                  </div>
                </div>
                {(entry.caption || entry.hook || entry.cta) && (
                  <div className="bg-slate-800/50 rounded-lg p-3 mb-3 space-y-1">
                    {entry.hook && <p className="text-sm text-slate-300"><span className="text-slate-500">Hook:</span> {entry.hook}</p>}
                    {entry.caption && <p className="text-sm text-slate-300"><span className="text-slate-500">Caption:</span> {entry.caption}</p>}
                    {entry.cta && <p className="text-sm text-slate-300"><span className="text-slate-500">CTA:</span> {entry.cta}</p>}
                  </div>
                )}
                {entry.hashtags && entry.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">{entry.hashtags.map((tag, i) => <span key={i} className="text-xs px-2 py-0.5 bg-primary-900/20 text-primary-300 rounded-full">#{tag}</span>)}</div>
                )}
                {entry.reviewComments && entry.reviewComments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                    <h5 className="text-xs font-medium text-slate-400">Comments</h5>
                    {entry.reviewComments.map((comment) => (
                      <div key={comment.id} className="flex gap-2 text-sm">
                        <span className="text-slate-400">{comment.userName}:</span>
                        <span className="text-slate-300">{comment.content}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// APPROVAL MODAL
// ============================================

function ApprovalModal({ entry, onClose, onUpdate }: {
  entry: SocialCalendarEntry; onClose: () => void;
  onUpdate: (updates: Partial<SocialCalendarEntry>) => void;
}) {
  const [status, setStatus] = useState<SocialApprovalStatus>(entry.approvalStatus || 'pending');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    const updates: Partial<SocialCalendarEntry> = { approvalStatus: status };
    if (status === 'approved') updates.status = 'approved';
    if (status === 'rejected') updates.status = 'rejected';
    if (status === 'changes-requested') updates.status = 'writing-in-progress';
    if (comment.trim()) {
      const newComment: ReviewComment = { id: Date.now().toString(), userId: 'current-user', userName: 'You', content: comment.trim(), timestamp: new Date().toISOString(), resolved: false };
      updates.reviewComments = [...(entry.reviewComments || []), newComment];
    }
    onUpdate(updates);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Review: {entry.title}</h2>
          <p className="text-sm text-slate-400 mt-1">Set approval status and add comments</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Approval Status</label>
            <div className="space-y-2">
              {([
                { value: 'approved' as SocialApprovalStatus, label: 'Approved', color: 'text-green-400', bg: 'bg-green-900/30' },
                { value: 'changes-requested' as SocialApprovalStatus, label: 'Changes Requested', color: 'text-amber-400', bg: 'bg-amber-900/30' },
                { value: 'rejected' as SocialApprovalStatus, label: 'Rejected', color: 'text-red-400', bg: 'bg-red-900/30' },
                { value: 'pending' as SocialApprovalStatus, label: 'Pending', color: 'text-slate-400', bg: 'bg-slate-800' },
              ]).map((opt) => (
                <button key={opt.value} onClick={() => setStatus(opt.value)}
                  className={cn('w-full px-4 py-2.5 rounded-lg border text-left text-sm transition-all flex items-center justify-between',
                    status === opt.value ? `${opt.bg} border-primary-500` : 'border-slate-700 bg-slate-800/50')}>
                  <span className={opt.color}>{opt.label}</span>
                  {status === opt.value && <CheckCircle className="w-4 h-4 text-primary-400" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a review comment..." rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500 resize-none" />
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">Submit Review</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// REPURPOSE CONTENT MODAL
// ============================================

const REPURPOSE_OPTIONS: { value: RepurposeType; label: string; description: string }[] = [
  { value: 'reel-to-carousel', label: 'Reel to Carousel', description: 'Convert a reel into a carousel post' },
  { value: 'reel-to-story', label: 'Reel to Story', description: 'Adapt a reel as a story' },
  { value: 'blog-to-linkedin', label: 'Blog to LinkedIn', description: 'Turn a blog post into a LinkedIn article' },
  { value: 'blog-to-twitter-thread', label: 'Blog to Twitter Thread', description: 'Create a thread from blog content' },
  { value: 'carousel-to-reel', label: 'Carousel to Reel', description: 'Turn a carousel into a reel script' },
  { value: 'testimonial-to-quote', label: 'Testimonial to Quote', description: 'Extract a quote graphic from a testimonial' },
  { value: 'video-to-short', label: 'Video to Short', description: 'Clip a long video into a short' },
  { value: 'long-to-short', label: 'Long to Short', description: 'Shorten long-form content' },
  { value: 'cross-platform', label: 'Cross-Platform', description: 'Adapt for a different platform' },
];

function RepurposeContentModal({ entry, onClose, onCreate }: {
  entry: SocialCalendarEntry; onClose: () => void;
  onCreate: (data: Partial<SocialCalendarEntry>) => void;
}) {
  const [repurposeType, setRepurposeType] = useState<RepurposeType>('cross-platform');
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>(entry.platform === 'instagram' ? 'linkedin' : 'instagram');

  const handleSubmit = () => {
    onCreate({
      calendarId: entry.calendarId,
      strategyId: entry.strategyId,
      title: `[Repurposed] ${entry.title}`,
      platform: newPlatform,
      contentType: entry.contentType,
      publishDate: '',
      priority: entry.priority,
      status: 'planned',
      approvalStatus: 'pending',
      pillar: entry.pillar,
      funnelStage: entry.funnelStage,
      sourceContentId: entry.id,
      repurposeType,
      caption: entry.caption,
      hook: entry.hook,
      hashtags: entry.hashtags,
    } as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Repurpose Content</h2>
          <p className="text-sm text-slate-400 mt-1">Create a new entry from "{entry.title}"</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Repurpose Type</label>
            <select value={repurposeType} onChange={(e) => setRepurposeType(e.target.value as RepurposeType)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
              {REPURPOSE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Target Platform</label>
            <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value as SocialPlatform)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
              {Object.entries(PLATFORM_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-400">
            Source: {(PLATFORM_CONFIG[entry.platform] || { label: entry.platform }).label} | {(CONTENT_TYPE_OPTIONS.find((c) => c.value === entry.contentType) || { label: entry.contentType }).label}
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">Create Repurposed Entry</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXPORT TAB
// ============================================

const EXPORT_FORMATS: { value: SocialExportFormat; label: string; description: string; icon: any }[] = [
  { value: 'markdown', label: 'Markdown', description: 'Content calendar in .md format', icon: FileText },
  { value: 'csv', label: 'CSV', description: 'Spreadsheet-compatible data export', icon: Table },
  { value: 'calendar', label: 'Calendar', description: 'ICS calendar file for import', icon: CalendarDays },
  { value: 'content-brief', label: 'Content Brief', description: 'Detailed brief per entry', icon: AlignLeft },
  { value: 'design-brief', label: 'Design Brief', description: 'Brief for creative team', icon: Palette },
  { value: 'caption-sheet', label: 'Caption Sheet', description: 'All captions in one document', icon: Hash },
];

function ExportTab({ entries, strategies, campaigns, templates, hashtagBanks }: {
  entries: SocialCalendarEntry[]; strategies: SocialContentStrategy[]; campaigns: SocialCampaign[];
  templates: SocialContentTemplate[]; hashtagBanks: SocialHashtagBank[];
}) {
  const [format, setFormat] = useState<SocialExportFormat>('markdown');
  const [filterPlatform, setFilterPlatform] = useState<SocialPlatform | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<SocialEntryStatus | 'all'>('all');
  const [preview, setPreview] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...entries];
    if (filterPlatform !== 'all') result = result.filter((e) => e.platform === filterPlatform);
    if (filterStatus !== 'all') result = result.filter((e) => e.status === filterStatus);
    return result;
  }, [entries, filterPlatform, filterStatus]);

  const generateExport = () => {
    if (filtered.length === 0) return;
    let output = '';
    const strategy = strategies[0];
    const hdr = `# Social Media Content Export\nGenerated: ${new Date().toLocaleDateString()}\nStrategy: ${strategy?.name || 'N/A'}\nTotal Entries: ${filtered.length}\n`;

    if (format === 'markdown') {
      output = hdr + '\n---\n\n';
      filtered.forEach((e) => {
        const pCfg = PLATFORM_CONFIG[e.platform] || { label: e.platform };
        const sCfg = STATUS_CONFIG[e.status] || STATUS_CONFIG.planned;
        const ctLabel = CONTENT_TYPE_OPTIONS.find((c) => c.value === e.contentType)?.label || e.contentType;
        output += `## ${e.title}\n`;
        output += `- **Platform:** ${pCfg.label}\n- **Type:** ${ctLabel}\n- **Date:** ${e.publishDate}${e.publishTime ? ` at ${e.publishTime}` : ''}\n- **Status:** ${sCfg.label}\n- **Pillar:** ${PILLAR_OPTIONS.find((p) => p.value === e.pillar)?.label || 'N/A'}\n`;
        if (e.hook) output += `- **Hook:** ${e.hook}\n`;
        if (e.caption) output += `\n> ${e.caption}\n\n`;
        if (e.cta) output += `- **CTA:** ${e.cta}\n`;
        if (e.hashtags?.length) output += `- **Hashtags:** ${e.hashtags.map((h) => `#${h}`).join(' ')}\n`;
        output += '\n---\n\n';
      });
    } else if (format === 'csv') {
      output = 'Title,Platform,Type,Date,Time,Status,Pillar,Hook,Caption,CTA,Hashtags\n';
      filtered.forEach((e) => {
        const pCfg = PLATFORM_CONFIG[e.platform] || { label: e.platform };
        const sCfg = STATUS_CONFIG[e.status] || STATUS_CONFIG.planned;
        output += `"${e.title}","${pCfg.label}","${e.contentType}","${e.publishDate}","${e.publishTime || ''}","${sCfg.label}","${e.pillar || ''}","${(e.hook || '').replace(/"/g, '""')}","${(e.caption || '').replace(/"/g, '""')}","${(e.cta || '').replace(/"/g, '""')}","${(e.hashtags || []).join(' ')}"\n`;
      });
    } else if (format === 'content-brief') {
      output = hdr + '\n---\n\n';
      filtered.forEach((e) => {
        const pCfg = PLATFORM_CONFIG[e.platform] || { label: e.platform };
        output += `# Content Brief: ${e.title}\n\n`;
        output += `**Platform:** ${pCfg.label}  \n**Type:** ${CONTENT_TYPE_OPTIONS.find((c) => c.value === e.contentType)?.label || e.contentType}  \n`;
        output += `**Publish:** ${e.publishDate}${e.publishTime ? ` at ${e.publishTime}` : ''}  \n`;
        output += `**Pillar:** ${PILLAR_OPTIONS.find((p) => p.value === e.pillar)?.label || 'N/A'}  \n`;
        output += `**Funnel:** ${FUNNEL_OPTIONS.find((f) => f.value === e.funnelStage)?.label || 'N/A'}  \n\n`;
        if (e.hook) output += `## Hook\n${e.hook}\n\n`;
        if (e.caption) output += `## Caption\n${e.caption}\n\n`;
        if (e.cta) output += `## CTA\n${e.cta}\n\n`;
        if (e.hashtags?.length) output += `## Hashtags\n${e.hashtags.map((h) => `#${h}`).join(' ')}\n\n`;
        output += '---\n\n';
      });
    } else if (format === 'caption-sheet') {
      output = hdr + '\n---\n\n';
      filtered.forEach((e) => {
        const pCfg = PLATFORM_CONFIG[e.platform] || { label: e.platform };
        output += `## ${e.title} (${pCfg.label})\n\n`;
        if (e.hook) output += `**Hook:** ${e.hook}\n\n`;
        if (e.caption) output += `${e.caption}\n\n`;
        if (e.cta) output += `**CTA:** ${e.cta}\n\n`;
        if (e.hashtags?.length) output += `${e.hashtags.map((h) => `#${h}`).join(' ')}\n\n`;
        output += '---\n\n';
      });
    } else {
      output = hdr + '\n(Format not yet implemented for this export type)\n';
    }
    setPreview(output);
  };

  const downloadExport = () => {
    if (!preview) return;
    const ext = format === 'csv' ? 'csv' : 'md';
    const blob = new Blob([preview], { type: format === 'csv' ? 'text/csv' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `social-media-export.${ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-medium text-white mb-3">Export Format</h3>
            <div className="space-y-2">
              {EXPORT_FORMATS.map((f) => (
                <button key={f.value} onClick={() => { setFormat(f.value); setPreview(null); }}
                  className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all',
                    format === f.value ? 'border-primary-500 bg-primary-900/20' : 'border-slate-700 hover:border-slate-600')}>
                  <f.icon className={cn('w-4 h-4', format === f.value ? 'text-primary-400' : 'text-slate-400')} />
                  <div><div className="text-sm text-slate-200">{f.label}</div><div className="text-xs text-slate-500">{f.description}</div></div>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-medium text-white">Filters</h3>
            <select value={filterPlatform} onChange={(e) => { setFilterPlatform(e.target.value as any); setPreview(null); }}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
              <option value="all">All Platforms</option>
              {Object.entries(PLATFORM_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value as any); setPreview(null); }}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <div className="text-xs text-slate-400">{filtered.length} entries will be exported</div>
            <button onClick={generateExport} disabled={filtered.length === 0}
              className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm">
              Generate Preview
            </button>
          </div>
        </div>
        <div className="md:col-span-2">
          {preview ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">Preview</h3>
                <button onClick={downloadExport} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
              <pre className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300 overflow-auto max-h-[600px] whitespace-pre-wrap">{preview}</pre>
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center text-slate-500">
              <Download className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p>Select a format and click "Generate Preview" to see the export.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}