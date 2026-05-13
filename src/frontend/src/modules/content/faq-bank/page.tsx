/**
 * FAQ Bank Module
 *
 * Centralised FAQ repository with categories, AI generation,
 * search/filter, bulk operations, and multi-format export.
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  HelpCircle, Search, Plus, Filter, Download, Upload, Sparkles,
  ChevronDown, ChevronRight, ChevronUp, X, Check, AlertCircle,
  Edit3, Trash2, Copy, ExternalLink, Tag, FolderOpen, FileText,
  Layers, Zap, Eye, ThumbsUp, ThumbsDown, MoreVertical, BookOpen,
  Lightbulb, FileJson, FileSpreadsheet, FileType, ArrowUpDown,
  FolderPlus, LayoutGrid, List, Star, Globe, Lock, Users, Bot,
} from 'lucide-react';
import { useAuthStore, useCompanyStore } from '@/stores';
import { faqBankApi, faqCategoryApi } from '@/services/api';
import type {
  FAQ, FAQCategoryItem, FAQType, FAQStatus, FAQPriority,
  FAQAudienceType, FAQFunnelStage, FAQSearchIntent,
} from '@/types/entities';

// ============================================
// CONSTANTS
// ============================================

const FAQ_TYPES: { value: FAQType; label: string }[] = [
  { value: 'customer', label: 'Customer' },
  { value: 'sales', label: 'Sales' },
  { value: 'technical', label: 'Technical' },
  { value: 'internal', label: 'Internal' },
  { value: 'ai-training', label: 'AI Training' },
  { value: 'website', label: 'Website' },
  { value: 'blog', label: 'Blog' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'support', label: 'Support' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'legal', label: 'Legal' },
  { value: 'hr', label: 'HR' },
  { value: 'sop', label: 'SOP' },
];

const FAQ_STATUSES: { value: FAQStatus; label: string; colour: string }[] = [
  { value: 'draft', label: 'Draft', colour: 'bg-[#525662]' },
  { value: 'review', label: 'Review', colour: 'bg-amber-500' },
  { value: 'approved', label: 'Approved', colour: 'bg-blue-500' },
  { value: 'published', label: 'Published', colour: 'bg-green-500' },
  { value: 'archived', label: 'Archived', colour: 'bg-[#686f7e]' },
];

const FAQ_PRIORITIES: { value: FAQPriority; label: string; colour: string }[] = [
  { value: 'low', label: 'Low', colour: 'text-[#878e9a]' },
  { value: 'medium', label: 'Medium', colour: 'text-blue-400' },
  { value: 'high', label: 'High', colour: 'text-orange-400' },
  { value: 'critical', label: 'Critical', colour: 'text-red-400' },
];

const AUDIENCE_TYPES: { value: FAQAudienceType; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'internal', label: 'Internal' },
  { value: 'team-specific', label: 'Team Specific' },
  { value: 'department-specific', label: 'Department Specific' },
  { value: 'admin-only', label: 'Admin Only' },
];

const FUNNEL_STAGES: { value: FAQFunnelStage; label: string }[] = [
  { value: 'tofu', label: 'Top of Funnel' },
  { value: 'mofu', label: 'Middle of Funnel' },
  { value: 'bofu', label: 'Bottom of Funnel' },
  { value: 'post-sale', label: 'Post-Sale' },
  { value: 'general', label: 'General' },
];

const SEARCH_INTENTS: { value: FAQSearchIntent; label: string }[] = [
  { value: 'informational', label: 'Informational' },
  { value: 'navigational', label: 'Navigational' },
  { value: 'transactional', label: 'Transactional' },
  { value: 'commercial', label: 'Commercial' },
];

type TabId = 'faqs' | 'categories' | 'ai-generate' | 'export';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'faqs', label: 'FAQs', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'categories', label: 'Categories', icon: <FolderOpen className="w-4 h-4" /> },
  { id: 'ai-generate', label: 'AI Generate', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" /> },
];

const DEFAULT_FAQ: Partial<FAQ> = {
  title: '',
  question: '',
  answer: '',
  shortAnswer: '',
  detailedAnswer: '',
  faqType: 'customer',
  tags: [],
  status: 'draft',
  priority: 'medium',
  order: 0,
  audienceType: 'public',
  funnelStage: 'general',
  seoKeywords: [],
  schemaEnabled: true,
  voiceSearchOptimised: false,
  aiContextWeight: 5,
  aiPriority: 'medium',
  searchRelevance: 0,
  relatedFaqIds: [],
  referenceLinks: [],
  mediaAttachments: [],
  documentUrls: [],
  usedIn: [],
  version: 1,
  viewCount: 0,
  helpfulCount: 0,
  notHelpfulCount: 0,
};

// ============================================
// HELPER COMPONENTS
// ============================================

function StatusBadge({ status }: { status: FAQStatus }) {
  const config = FAQ_STATUSES.find((s) => s.value === status) || FAQ_STATUSES[0];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${config.colour}`}>
      {config.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: FAQPriority }) {
  const config = FAQ_PRIORITIES.find((p) => p.value === priority) || FAQ_PRIORITIES[1];
  return <span className={`text-xs font-medium ${config.colour}`}>{config.label}</span>;
}

function TypeBadge({ type }: { type: FAQType }) {
  const config = FAQ_TYPES.find((t) => t.value === type);
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/20">
      {config?.label || type}
    </span>
  );
}

function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3 mt-6 first:mt-0">
      <h3 className="text-sm font-semibold text-[#afb6c4] uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function FormField({
  label, children, required, helperText, colSpan = 1,
}: { label: string; children: React.ReactNode; required?: boolean; helperText?: string; colSpan?: 1 | 2 }) {
  return (
    <div className={colSpan === 2 ? 'col-span-2' : ''}>
      <label className="block text-sm font-medium text-[#afb6c4] mb-1">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {helperText && <p className="mt-1 text-xs text-[#686f7e]">{helperText}</p>}
    </div>
  );
}

const inputClass = 'w-full bg-[#1a1d21] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50';
const selectClass = 'w-full bg-[#1a1d21] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50';

// ============================================
// MAIN COMPONENT
// ============================================

export default function FAQBankModule() {
  const { user } = useAuthStore();
  const { activeCompanyId: storeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [activeTab, setActiveTab] = useState<TabId>('faqs');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<FAQCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FAQStatus | ''>('');
  const [filterType, setFilterType] = useState<FAQType | ''>('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedFaqs, setSelectedFaqs] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [viewingFaq, setViewingFaq] = useState<FAQ | null>(null);

  // Load data
  const loadData = useCallback(async () => {
    if (!companyId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.faqType = filterType;
      if (filterCategory) params.categoryId = filterCategory;
      if (searchQuery) params.search = searchQuery;

      const [faqsRes, catsRes] = await Promise.all([
        faqBankApi.getAll(companyId, Object.keys(params).length > 0 ? params : undefined),
        faqCategoryApi.getAll(companyId),
      ]);
      if (faqsRes.data) setFaqs(Array.isArray(faqsRes.data) ? faqsRes.data : (faqsRes.data as any)?.data || []);
      if (catsRes.data) setCategories(Array.isArray(catsRes.data) ? catsRes.data : []);
    } catch (err) {
      console.error('Failed to load FAQ data:', err);
    }
    setIsLoading(false);
  }, [companyId, filterStatus, filterType, filterCategory, searchQuery]);

  useEffect(() => { loadData(); }, [loadData]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    let result = [...faqs];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          (f.title || '').toLowerCase().includes(q) ||
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          (f.shortAnswer || '').toLowerCase().includes(q) ||
          (f.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filterStatus) result = result.filter((f) => f.status === filterStatus);
    if (filterType) result = result.filter((f) => f.faqType === filterType);
    if (filterCategory) result = result.filter((f) => f.categoryId === filterCategory);
    return result;
  }, [faqs, searchQuery, filterStatus, filterType, filterCategory]);

  // Stats
  const stats = useMemo(() => ({
    total: faqs.length,
    published: faqs.filter((f) => f.status === 'published').length,
    draft: faqs.filter((f) => f.status === 'draft').length,
    review: faqs.filter((f) => f.status === 'review').length,
  }), [faqs]);

  // CRUD handlers
  const handleCreateFaq = async (data: Partial<FAQ>) => {
    if (!companyId) return;
    const res = await faqBankApi.create({ ...data, companyId });
    if (res.data) { await loadData(); setShowCreateModal(false); }
  };

  const handleUpdateFaq = async (id: string, data: Partial<FAQ>) => {
    const res = await faqBankApi.update(id, data);
    if (res.data) { await loadData(); setEditingFaq(null); }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    const res = await faqBankApi.delete(id);
    if (!res.error) { await loadData(); setViewingFaq(null); }
  };

  const handleBulkDelete = async () => {
    if (selectedFaqs.size === 0) return;
    if (!confirm(`Delete ${selectedFaqs.size} FAQs?`)) return;
    await faqBankApi.bulkDelete(Array.from(selectedFaqs));
    setSelectedFaqs(new Set());
    await loadData();
  };

  const handleBulkUpdateStatus = async (status: FAQStatus) => {
    if (selectedFaqs.size === 0) return;
    await faqBankApi.bulkUpdate({ ids: Array.from(selectedFaqs), updates: { status } });
    setSelectedFaqs(new Set());
    await loadData();
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#878e9a]">Please select a company to view FAQs.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#C8FF2E] to-[#b3e62e] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C8FF2E]/20">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">FAQ Bank</h1>
            <p className="text-sm text-[#878e9a]">Centralised knowledge base for business FAQs</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total FAQs', value: stats.total, icon: <HelpCircle className="w-5 h-5 text-[#C8FF2E]" /> },
          { label: 'Published', value: stats.published, icon: <Check className="w-5 h-5 text-green-400" /> },
          { label: 'Draft', value: stats.draft, icon: <Edit3 className="w-5 h-5 text-[#878e9a]" /> },
          { label: 'In Review', value: stats.review, icon: <Eye className="w-5 h-5 text-yellow-400" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4 flex items-center gap-3">
            <div className="p-2 bg-[#1a1d21]/50 rounded-lg">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[#878e9a]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#151920] rounded-xl border border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#C8FF2E]/10 text-[#C8FF2E] border-b-2 border-[#C8FF2E]'
                : 'text-[#878e9a] hover:text-white hover:bg-[#1a1d21]/50'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'ai-generate' && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#C8FF2E]/10 text-[#C8FF2E] rounded">AI</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'faqs' && (
        <FAQListTab
          faqs={filteredFaqs}
          categories={categories}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterType={filterType}
          setFilterType={setFilterType}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          selectedFaqs={selectedFaqs}
          setSelectedFaqs={setSelectedFaqs}
          onEdit={setEditingFaq}
          onView={setViewingFaq}
          onDelete={handleDeleteFaq}
          onBulkDelete={handleBulkDelete}
          onBulkUpdateStatus={handleBulkUpdateStatus}
          onCreate={() => setShowCreateModal(true)}
        />
      )}
      {activeTab === 'categories' && (
        <CategoryManagerTab
          categories={categories}
          companyId={companyId}
          onRefresh={loadData}
        />
      )}
      {activeTab === 'ai-generate' && (
        <AIGenerateTab
          companyId={companyId}
          categories={categories}
          onGenerated={loadData}
        />
      )}
      {activeTab === 'export' && (
        <ExportTab companyId={companyId} faqs={faqs} />
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingFaq) && (
        <FAQCreateEditModal
          faq={editingFaq}
          categories={categories}
          allFaqs={faqs}
          companyId={companyId}
          onClose={() => { setShowCreateModal(false); setEditingFaq(null); }}
          onSave={editingFaq ? ((id: string, data: Partial<FAQ>) => handleUpdateFaq(id, data)) : ((data: Partial<FAQ>) => handleCreateFaq(data))}
        />
      )}

      {/* View Detail Modal */}
      {viewingFaq && (
        <FAQDetailModal
          faq={viewingFaq}
          categories={categories}
          onClose={() => setViewingFaq(null)}
          onEdit={() => { setEditingFaq(viewingFaq); setViewingFaq(null); }}
          onDelete={() => handleDeleteFaq(viewingFaq.id)}
        />
      )}
    </div>
  );
}

// ============================================
// FAQ LIST TAB
// ============================================

function FAQListTab({
  faqs, categories, isLoading, searchQuery, setSearchQuery,
  filterStatus, setFilterStatus, filterType, setFilterType,
  filterCategory, setFilterCategory, selectedFaqs, setSelectedFaqs,
  onEdit, onView, onDelete, onBulkDelete, onBulkUpdateStatus, onCreate,
}: {
  faqs: FAQ[];
  categories: FAQCategoryItem[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterStatus: FAQStatus | '';
  setFilterStatus: (s: FAQStatus | '') => void;
  filterType: FAQType | '';
  setFilterType: (t: FAQType | '') => void;
  filterCategory: string;
  setFilterCategory: (c: string) => void;
  selectedFaqs: Set<string>;
  setSelectedFaqs: (s: Set<string>) => void;
  onEdit: (faq: FAQ) => void;
  onView: (faq: FAQ) => void;
  onDelete: (id: string) => void;
  onBulkDelete: () => void;
  onBulkUpdateStatus: (status: FAQStatus) => void;
  onCreate: () => void;
}) {
  const toggleSelect = (id: string) => {
    const next = new Set(selectedFaqs);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedFaqs(next);
  };
  const toggleAll = () => {
    if (selectedFaqs.size === faqs.length) {
      setSelectedFaqs(new Set());
    } else {
      setSelectedFaqs(new Set(faqs.map((f) => f.id)));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8FF2E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#878e9a]" />
          <input
            type="text"
            placeholder="Search FAQs by question, answer, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-10`}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FAQStatus | '')} className={selectClass + ' w-36'}>
          <option value="">All Status</option>
          {FAQ_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as FAQType | '')} className={selectClass + ' w-36'}>
          <option value="">All Types</option>
          {FAQ_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={selectClass + ' w-40'}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Bulk Actions Bar */}
      {selectedFaqs.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 rounded-lg">
          <span className="text-sm text-[#C8FF2E] font-medium">{selectedFaqs.size} selected</span>
          <button onClick={() => onBulkUpdateStatus('published')} className="px-3 py-1 text-xs bg-green-500/20 text-green-300 rounded hover:bg-green-500/30">Publish</button>
          <button onClick={() => onBulkUpdateStatus('draft')} className="px-3 py-1 text-xs bg-[#1a1d21] text-[#afb6c4] rounded hover:bg-[#21262d]">Set Draft</button>
          <button onClick={() => onBulkUpdateStatus('archived')} className="px-3 py-1 text-xs bg-[#1a1d21] text-[#878e9a] rounded hover:bg-[#21262d]">Archive</button>
          <button onClick={onBulkDelete} className="px-3 py-1 text-xs bg-red-500/20 text-red-300 rounded hover:bg-red-500/30">Delete</button>
          <button onClick={() => setSelectedFaqs(new Set())} className="ml-auto text-xs text-[#878e9a] hover:text-white">Clear Selection</button>
        </div>
      )}

      {/* FAQ List */}
      {faqs.length === 0 ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <HelpCircle className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a] mb-2">No FAQs found</p>
          <button onClick={onCreate} className="px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm">Create Your First FAQ</button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Select all header */}
          <div className="flex items-center gap-3 px-4 py-2 text-xs text-[#878e9a]">
            <input
              type="checkbox"
              checked={selectedFaqs.size === faqs.length && faqs.length > 0}
              onChange={toggleAll}
              className="rounded border-white/20"
            />
            <span className="w-8">Type</span>
            <span className="flex-1">Question</span>
            <span className="w-24">Category</span>
            <span className="w-20">Status</span>
            <span className="w-16">Priority</span>
            <span className="w-16">Views</span>
            <span className="w-24">Actions</span>
          </div>
          {faqs.map((faq) => {
            const cat = categories.find((c) => c.id === faq.categoryId);
            return (
              <div
                key={faq.id}
                className="flex items-center gap-3 px-4 py-3 bg-[#151920] hover:bg-[#1a1d21] rounded-lg border border-white/10/50 hover:border-white/20 transition-colors cursor-pointer"
                onClick={() => onView(faq)}
              >
                <input
                  type="checkbox"
                  checked={selectedFaqs.has(faq.id)}
                  onChange={(e) => { e.stopPropagation(); toggleSelect(faq.id); }}
                  className="rounded border-white/20"
                />
                <TypeBadge type={faq.faqType} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{faq.title || faq.question}</p>
                  <p className="text-xs text-[#878e9a] truncate">{faq.question}</p>
                </div>
                <span className="w-24 text-xs text-[#878e9a] truncate">{cat?.name || 'Uncategorised'}</span>
                <StatusBadge status={faq.status} />
                <PriorityBadge priority={faq.priority} />
                <span className="w-16 text-xs text-[#878e9a] text-center">{faq.viewCount || 0}</span>
                <div className="w-24 flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(faq); }}
                    className="p-1 hover:bg-[#1a1d21] rounded text-[#878e9a] hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(faq.id); }}
                    className="p-1 hover:bg-[#1a1d21] rounded text-[#878e9a] hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
// CATEGORY MANAGER TAB
// ============================================

function CategoryManagerTab({
  categories, companyId, onRefresh,
}: { categories: FAQCategoryItem[]; companyId: string; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<FAQCategoryItem | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [icon, setIcon] = useState('HelpCircle');
  const [colour, setColour] = useState('#C8FF2E');

  const resetForm = () => {
    setName(''); setDescription(''); setParentId(''); setIcon('HelpCircle'); setColour('#C8FF2E');
    setEditingCat(null); setShowForm(false);
  };

  const handleSave = async () => {
    const data = { companyId, name, description, parentId: parentId || undefined, icon, colour };
    if (editingCat) {
      await faqCategoryApi.update(editingCat.id, data);
    } else {
      await faqCategoryApi.create(data);
    }
    resetForm();
    onRefresh();
  };

  const handleEdit = (cat: FAQCategoryItem) => {
    setEditingCat(cat); setName(cat.name); setDescription(cat.description || '');
    setParentId(cat.parentId || ''); setIcon(cat.icon || 'HelpCircle'); setColour(cat.colour || '#C8FF2E');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? FAQs in it will become uncategorised.')) return;
    await faqCategoryApi.delete(id);
    onRefresh();
  };

  const topLevel = categories.filter((c) => !c.parentId);
  const getChildren = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#878e9a]">{categories.length} categories</p>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm">
          <FolderPlus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-[#151920] border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">{editingCat ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Name" required>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g., Product FAQs" />
            </FormField>
            <FormField label="Parent Category">
              <select value={parentId} onChange={(e) => setParentId(e.target.value)} className={selectClass}>
                <option value="">None (Top Level)</option>
                {topLevel.filter((c) => c.id !== editingCat?.id).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Description" colSpan={2}>
              <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="Optional description" />
            </FormField>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm">Save</button>
            <button onClick={resetForm} className="px-4 py-2 bg-[#1a1d21] hover:bg-[#21262d] text-white rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {topLevel.length === 0 ? (
          <div className="text-center py-8 text-[#878e9a]">
            <FolderOpen className="w-10 h-10 mx-auto mb-2 text-[#686f7e]" />
            <p>No categories yet. Create one to organise your FAQs.</p>
          </div>
        ) : topLevel.map((cat) => (
          <CategoryItem key={cat.id} category={cat} children={getChildren(cat.id)} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

function CategoryItem({
  category, children, onEdit, onDelete, depth = 0,
}: { category: FAQCategoryItem; children: FAQCategoryItem[]; onEdit: (c: FAQCategoryItem) => void; onDelete: (id: string) => void; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div>
      <div
        className="flex items-center gap-2 px-4 py-2 bg-[#151920] hover:bg-[#1a1d21] rounded-lg border border-white/10/50 cursor-pointer"
        style={{ marginLeft: depth * 24 }}
      >
        {children.length > 0 ? (
          <button onClick={() => setExpanded(!expanded)} className="text-[#878e9a]">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        ) : <span className="w-4" />}
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.colour || '#C8FF2E' }} />
        <span className="flex-1 text-sm text-white">{category.name}</span>
        <span className="text-xs text-[#878e9a]">{category.faqCount || 0} FAQs</span>
        <button onClick={() => onEdit(category)} className="p-1 hover:bg-[#1a1d21] rounded text-[#878e9a] hover:text-white">
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(category.id)} className="p-1 hover:bg-[#1a1d21] rounded text-[#878e9a] hover:text-red-400">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {expanded && children.map((child) => (
        <CategoryItem key={child.id} category={child} children={[]} onEdit={onEdit} onDelete={onDelete} depth={depth + 1} />
      ))}
    </div>
  );
}

// ============================================
// AI GENERATE TAB
// ============================================

function AIGenerateTab({
  companyId, categories, onGenerated,
}: { companyId: string; categories: FAQCategoryItem[]; onRefresh?: () => void; onGenerated: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [faqType, setFaqType] = useState<FAQType>('customer');
  const [category, setCategory] = useState('');
  const [count, setCount] = useState(5);
  const [context, setContext] = useState('');
  const [generatedFaqs, setGeneratedFaqs] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await faqBankApi.generate({ companyId, category, faqType, count, context: { topic: context } });
      if (res.data) {
        const d = res.data as any;
        setGeneratedFaqs(d.data || d || []);
      }
    } catch (err) {
      console.error('Failed to generate FAQs:', err);
    }
    setGenerating(false);
  };

  const handleSuggest = async () => {
    setSuggesting(true);
    try {
      const res = await faqBankApi.suggestMissing({ companyId, context });
      if (res.data) {
        setSuggestions((res.data as any).suggestions || []);
      }
    } catch (err) {
      console.error('Failed to suggest FAQs:', err);
    }
    setSuggesting(false);
  };

  const handleDetectDuplicates = async () => {
    setDetecting(true);
    try {
      const res = await faqBankApi.detectDuplicates({ companyId });
      if (res.data) {
        setDuplicates((res.data as any).duplicates || []);
      }
    } catch (err) {
      console.error('Failed to detect duplicates:', err);
    }
    setDetecting(false);
  };

  const handleSaveGenerated = async (faq: any) => {
    await faqBankApi.create({ ...faq, companyId, categoryId: category || undefined, faqType });
    onGenerated();
  };

  return (
    <div className="space-y-6">
      {/* Generate FAQs */}
      <div className="bg-[#151920] border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-[#C8FF2E]" />
          <h3 className="text-lg font-semibold text-white">Generate FAQs with AI</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <FormField label="FAQ Type">
            <select value={faqType} onChange={(e) => setFaqType(e.target.value as FAQType)} className={selectClass}>
              {FAQ_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </FormField>
          <FormField label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
              <option value="">No Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>
          <FormField label="Number of FAQs">
            <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(parseInt(e.target.value) || 5)} className={inputClass} />
          </FormField>
        </div>
        <FormField label="Context / Topic" colSpan={2}>
          <input value={context} onChange={(e) => setContext(e.target.value)} className={inputClass} placeholder="e.g., Pricing and billing for SaaS product" />
        </FormField>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold disabled:opacity-50 text-white rounded-lg text-sm"
        >
          <Sparkles className="w-4 h-4" />
          {generating ? 'Generating...' : 'Generate FAQs'}
        </button>

        {generatedFaqs.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="text-sm font-semibold text-[#afb6c4]">Generated FAQs ({generatedFaqs.length})</h4>
            {generatedFaqs.map((faq, i) => (
              <div key={i} className="bg-[#0d1117]/50 border border-white/10 rounded-lg p-4">
                <p className="text-white font-medium text-sm">{faq.question}</p>
                <p className="text-[#878e9a] text-xs mt-1 line-clamp-2">{faq.answer}</p>
                <button onClick={() => handleSaveGenerated(faq)} className="mt-2 px-3 py-1 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded text-xs">
                  Save to FAQ Bank
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggest Missing */}
      <div className="bg-[#151920] border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Suggest Missing FAQs</h3>
        </div>
        <p className="text-sm text-[#878e9a] mb-4">AI will analyse your existing FAQs and suggest topics that might be missing.</p>
        <button
          onClick={handleSuggest}
          disabled={suggesting}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white rounded-lg text-sm"
        >
          <Lightbulb className="w-4 h-4" />
          {suggesting ? 'Analysing...' : 'Get Suggestions'}
        </button>
        {suggestions.length > 0 && (
          <div className="mt-4 space-y-2">
            {suggestions.map((s, i) => (
              <div key={i} className="bg-[#0d1117]/50 border border-white/10 rounded-lg p-3">
                <p className="text-white text-sm font-medium">{s.question}</p>
                <p className="text-[#878e9a] text-xs">{s.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detect Duplicates */}
      <div className="bg-[#151920] border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Copy className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Detect Duplicates</h3>
        </div>
        <p className="text-sm text-[#878e9a] mb-4">Find potential duplicate FAQs in your bank.</p>
        <button
          onClick={handleDetectDuplicates}
          disabled={detecting}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg text-sm"
        >
          <Copy className="w-4 h-4" />
          {detecting ? 'Detecting...' : 'Find Duplicates'}
        </button>
        {duplicates.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-yellow-400">{duplicates.length} potential duplicate(s) found</p>
            {duplicates.map((d, i) => (
              <div key={i} className="bg-[#0d1117]/50 border border-orange-500/30 rounded-lg p-3">
                <p className="text-white text-sm font-medium">"{d.faq1?.question}" — "{d.faq2?.question}"</p>
                <p className="text-orange-400 text-xs">{d.similarity} match</p>
              </div>
            ))}
          </div>
        )}
        {duplicates.length === 0 && detecting === false && (
          <p className="mt-2 text-sm text-green-400">No duplicates detected.</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// EXPORT TAB
// ============================================

function ExportTab({ companyId, faqs }: { companyId: string; faqs: FAQ[] }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: string) => {
    setExporting(true);
    try {
      const res = await faqBankApi.exportFaqs(companyId, format);
      if (res.data) {
        const exportData = format === 'json' ? JSON.stringify(res.data, null, 2) : String(res.data);
        const blob = new Blob(
          [exportData],
          { type: format === 'json' ? 'application/json' : format === 'csv' ? 'text/csv' : 'text/markdown' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `faqs.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting(false);
  };

  const exportOptions = [
    { format: 'json', label: 'JSON', icon: <FileJson className="w-8 h-8" />, desc: 'Structured data for APIs and integrations' },
    { format: 'csv', label: 'CSV', icon: <FileSpreadsheet className="w-8 h-8" />, desc: 'Spreadsheet format for analysis' },
    { format: 'markdown', label: 'Markdown', icon: <FileText className="w-8 h-8" />, desc: 'Documentation and website format' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#151920] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Export FAQs</h3>
        <p className="text-sm text-[#878e9a] mb-6">Export your {faqs.length} FAQs in different formats.</p>
        <div className="grid grid-cols-3 gap-4">
          {exportOptions.map((opt) => (
            <button
              key={opt.format}
              onClick={() => handleExport(opt.format)}
              disabled={exporting || faqs.length === 0}
              className="flex flex-col items-center gap-3 p-6 bg-[#0d1117]/50 border border-white/10 hover:border-[#C8FF2E]/50 rounded-xl transition-colors disabled:opacity-50"
            >
              <div className="text-[#C8FF2E]">{opt.icon}</div>
              <span className="text-white font-medium">{opt.label}</span>
              <span className="text-xs text-[#878e9a] text-center">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// FAQ CREATE/EDIT MODAL
// ============================================

function FAQCreateEditModal({
  faq, categories, allFaqs, companyId, onClose, onSave,
}: {
  faq: FAQ | null;
  categories: FAQCategoryItem[];
  allFaqs: FAQ[];
  companyId: string;
  onClose: () => void;
  onSave: ((id: string, data: Partial<FAQ>) => void) | ((data: Partial<FAQ>) => void);
}) {
  const isEdit = !!faq;
  const [form, setForm] = useState<Partial<FAQ>>(faq ? { ...faq } : { ...DEFAULT_FAQ });
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [activeSection, setActiveSection] = useState<string>('core');

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const tags = [...(form.tags || []), tagInput.trim()];
      updateField('tags', tags);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    updateField('tags', (form.tags || []).filter((t) => t !== tag));
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      const keywords = [...(form.seoKeywords || []), keywordInput.trim()];
      updateField('seoKeywords', keywords);
      setKeywordInput('');
    }
  };

  const addLink = () => {
    if (linkInput.trim()) {
      const links = [...(form.referenceLinks || []), linkInput.trim()];
      updateField('referenceLinks', links);
      setLinkInput('');
    }
  };

  const handleSave = () => {
    if (!form.question || !form.answer) return;
    if (isEdit && faq) {
      (onSave as (id: string, data: Partial<FAQ>) => void)(faq.id, form);
    } else {
      (onSave as (data: Partial<FAQ>) => void)(form);
    }
  };

  const sections = [
    { id: 'core', label: 'Core Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'classification', label: 'Classification', icon: <Tag className="w-4 h-4" /> },
    { id: 'audience', label: 'Audience & Funnel', icon: <Users className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO', icon: <Globe className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Readiness', icon: <Bot className="w-4 h-4" /> },
    { id: 'relationships', label: 'Relationships', icon: <Layers className="w-4 h-4" /> },
    { id: 'media', label: 'Media & Links', icon: <ExternalLink className="w-4 h-4" /> },
    { id: 'status', label: 'Status & Publishing', icon: <Star className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-10 overflow-y-auto">
      <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-4xl mx-4 mb-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit FAQ' : 'Create FAQ'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1d21] rounded-lg text-[#878e9a] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex">
          {/* Section Nav */}
          <div className="w-48 border-r border-white/10 p-2 space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === sec.id ? 'bg-[#C8FF2E]/10 text-[#C8FF2E]' : 'text-[#878e9a] hover:text-white hover:bg-[#1a1d21]'
                }`}
              >
                {sec.icon}
                {sec.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6 max-h-[60vh] overflow-y-auto">
            {activeSection === 'core' && (
              <div className="space-y-4">
                <SectionHeader title="Core Content" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Title" required>
                    <input value={form.title || ''} onChange={(e) => updateField('title', e.target.value)} className={inputClass} placeholder="Short descriptive title" />
                  </FormField>
                  <FormField label="Question" required>
                    <input value={form.question || ''} onChange={(e) => updateField('question', e.target.value)} className={inputClass} placeholder="The FAQ question" />
                  </FormField>
                  <FormField label="Answer" required colSpan={2}>
                    <textarea value={form.answer || ''} onChange={(e) => updateField('answer', e.target.value)} className={inputClass + ' min-h-[120px]'} placeholder="The main answer" />
                  </FormField>
                  <FormField label="Short Answer" colSpan={2}>
                    <input value={form.shortAnswer || ''} onChange={(e) => updateField('shortAnswer', e.target.value)} className={inputClass} placeholder="TL;DR version (max 300 chars)" />
                  </FormField>
                  <FormField label="Detailed Answer" colSpan={2}>
                    <textarea value={form.detailedAnswer || ''} onChange={(e) => updateField('detailedAnswer', e.target.value)} className={inputClass + ' min-h-[100px]'} placeholder="Extended explanation" />
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'classification' && (
              <div className="space-y-4">
                <SectionHeader title="Classification" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Category">
                    <select value={form.categoryId || ''} onChange={(e) => updateField('categoryId', e.target.value)} className={selectClass}>
                      <option value="">Uncategorised</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Subcategory">
                    <select value={form.subcategoryId || ''} onChange={(e) => updateField('subcategoryId', e.target.value)} className={selectClass}>
                      <option value="">None</option>
                      {categories.filter((c) => c.parentId === form.categoryId).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </FormField>
                  <FormField label="FAQ Type">
                    <select value={form.faqType || 'customer'} onChange={(e) => updateField('faqType', e.target.value)} className={selectClass}>
                      {FAQ_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Priority">
                    <select value={form.priority || 'medium'} onChange={(e) => updateField('priority', e.target.value)} className={selectClass}>
                      {FAQ_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Tags" colSpan={2}>
                    <div className="flex gap-2">
                      <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className={inputClass} placeholder="Add tag and press Enter" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                      <button onClick={addTag} className="px-3 py-2 bg-[#1a1d21] hover:bg-[#21262d] text-white rounded-lg text-sm">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(form.tags || []).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/20 rounded text-xs">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-white"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'audience' && (
              <div className="space-y-4">
                <SectionHeader title="Audience & Funnel" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Audience Type">
                    <select value={form.audienceType || 'public'} onChange={(e) => updateField('audienceType', e.target.value)} className={selectClass}>
                      {AUDIENCE_TYPES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Funnel Stage">
                    <select value={form.funnelStage || 'general'} onChange={(e) => updateField('funnelStage', e.target.value)} className={selectClass}>
                      {FUNNEL_STAGES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Department">
                    <input value={form.department || ''} onChange={(e) => updateField('department', e.target.value)} className={inputClass} placeholder="e.g., Sales, Support" />
                  </FormField>
                  <FormField label="Product ID">
                    <input value={form.productId || ''} onChange={(e) => updateField('productId', e.target.value)} className={inputClass} placeholder="Link to a product" />
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'seo' && (
              <div className="space-y-4">
                <SectionHeader title="SEO" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Search Intent">
                    <select value={form.searchIntent || ''} onChange={(e) => updateField('searchIntent', e.target.value)} className={selectClass}>
                      <option value="">None</option>
                      {SEARCH_INTENTS.map((si) => <option key={si.value} value={si.value}>{si.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Meta Title" helperText="Max 60 characters">
                    <input value={form.metaTitle || ''} onChange={(e) => updateField('metaTitle', e.target.value)} className={inputClass} placeholder="SEO title" maxLength={60} />
                  </FormField>
                  <FormField label="Meta Description" helperText="Max 160 characters" colSpan={2}>
                    <textarea value={form.metaDescription || ''} onChange={(e) => updateField('metaDescription', e.target.value)} className={inputClass} placeholder="SEO description" maxLength={160} />
                  </FormField>
                  <FormField label="SEO Keywords" colSpan={2}>
                    <div className="flex gap-2">
                      <input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} className={inputClass} placeholder="Add keyword" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())} />
                      <button onClick={addKeyword} className="px-3 py-2 bg-[#1a1d21] hover:bg-[#21262d] text-white rounded-lg text-sm">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(form.seoKeywords || []).map((kw) => (
                        <span key={kw} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {kw}
                          <button onClick={() => updateField('seoKeywords', (form.seoKeywords || []).filter((k) => k !== kw))} className="hover:text-white"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="FAQ Schema Enabled">
                    <label className="flex items-center gap-2 mt-1">
                      <input type="checkbox" checked={form.schemaEnabled !== false} onChange={(e) => updateField('schemaEnabled', e.target.checked)} className="rounded border-white/20" />
                      <span className="text-sm text-[#afb6c4]">Enable FAQ Schema markup</span>
                    </label>
                  </FormField>
                  <FormField label="Voice Search Optimised">
                    <label className="flex items-center gap-2 mt-1">
                      <input type="checkbox" checked={form.voiceSearchOptimised || false} onChange={(e) => updateField('voiceSearchOptimised', e.target.checked)} className="rounded border-white/20" />
                      <span className="text-sm text-[#afb6c4]">Optimise for voice search</span>
                    </label>
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'ai' && (
              <div className="space-y-4">
                <SectionHeader title="AI Readiness" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="AI Context Weight" helperText="1-10, how important for AI context">
                    <input type="range" min={1} max={10} value={form.aiContextWeight || 5} onChange={(e) => updateField('aiContextWeight', parseInt(e.target.value))} className="w-full accent-[#C8FF2E]" />
                    <span className="text-sm text-[#afb6c4] ml-2">{form.aiContextWeight || 5}</span>
                  </FormField>
                  <FormField label="AI Priority">
                    <select value={form.aiPriority || 'medium'} onChange={(e) => updateField('aiPriority', e.target.value)} className={selectClass}>
                      {FAQ_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="AI Suggested Usage" colSpan={2}>
                    <input value={form.aiSuggestedUsage || ''} onChange={(e) => updateField('aiSuggestedUsage', e.target.value)} className={inputClass} placeholder="e.g., Chatbot, Website FAQ page, Support email" />
                  </FormField>
                  <FormField label="Search Relevance" helperText="0-100">
                    <input type="number" min={0} max={100} value={form.searchRelevance || 0} onChange={(e) => updateField('searchRelevance', parseInt(e.target.value) || 0)} className={inputClass} />
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'relationships' && (
              <div className="space-y-4">
                <SectionHeader title="Relationships" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Parent FAQ">
                    <select value={form.parentFaqId || ''} onChange={(e) => updateField('parentFaqId', e.target.value)} className={selectClass}>
                      <option value="">None</option>
                      {allFaqs.filter((f) => f.id !== faq?.id).map((f) => <option key={f.id} value={f.id}>{f.title || f.question}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Cluster ID">
                    <input value={form.clusterId || ''} onChange={(e) => updateField('clusterId', e.target.value)} className={inputClass} placeholder="Group related FAQs" />
                  </FormField>
                  <FormField label="Related FAQs" colSpan={2}>
                    <p className="text-xs text-[#878e9a] mb-2">Select related FAQs</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {allFaqs.filter((f) => f.id !== faq?.id).map((f) => (
                        <label key={f.id} className="flex items-center gap-2 p-1 hover:bg-[#1a1d21] rounded">
                          <input
                            type="checkbox"
                            checked={(form.relatedFaqIds || []).includes(f.id)}
                            onChange={(e) => {
                              const ids = e.target.checked
                                ? [...(form.relatedFaqIds || []), f.id]
                                : (form.relatedFaqIds || []).filter((id) => id !== f.id);
                              updateField('relatedFaqIds', ids);
                            }}
                            className="rounded border-white/20"
                          />
                          <span className="text-sm text-[#afb6c4] truncate">{f.title || f.question}</span>
                        </label>
                      ))}
                    </div>
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'media' && (
              <div className="space-y-4">
                <SectionHeader title="Media & References" />
                <div className="space-y-4">
                  <FormField label="Reference Links" colSpan={2}>
                    <div className="flex gap-2">
                      <input value={linkInput} onChange={(e) => setLinkInput(e.target.value)} className={inputClass} placeholder="Add a URL" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())} />
                      <button onClick={addLink} className="px-3 py-2 bg-[#1a1d21] hover:bg-[#21262d] text-white rounded-lg text-sm">Add</button>
                    </div>
                    <div className="space-y-1 mt-2">
                      {(form.referenceLinks || []).map((link, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-[#1a1d21] rounded">
                          <ExternalLink className="w-3 h-3 text-[#878e9a]" />
                          <span className="text-sm text-[#afb6c4] flex-1 truncate">{link}</span>
                          <button onClick={() => updateField('referenceLinks', (form.referenceLinks || []).filter((_, idx) => idx !== i))} className="text-[#878e9a] hover:text-red-400"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="Used In" colSpan={2}>
                    <div className="flex flex-wrap gap-2">
                      {['website', 'blog', 'newsletter', 'ai-chatbot', 'crm', 'support-desk'].map((channel) => (
                        <label key={channel} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1d21] border border-white/10 rounded-lg cursor-pointer hover:border-[#C8FF2E]/50">
                          <input
                            type="checkbox"
                            checked={(form.usedIn || []).includes(channel)}
                            onChange={(e) => {
                              const usedIn = e.target.checked
                                ? [...(form.usedIn || []), channel]
                                : (form.usedIn || []).filter((c) => c !== channel);
                              updateField('usedIn', usedIn);
                            }}
                            className="rounded border-white/20"
                          />
                          <span className="text-sm text-[#afb6c4] capitalize">{channel.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'status' && (
              <div className="space-y-4">
                <SectionHeader title="Status & Publishing" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Status">
                    <select value={form.status || 'draft'} onChange={(e) => updateField('status', e.target.value)} className={selectClass}>
                      {FAQ_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Version">
                    <input type="number" value={form.version || 1} onChange={(e) => updateField('version', parseInt(e.target.value) || 1)} className={inputClass} />
                  </FormField>
                  <FormField label="Review Notes" colSpan={2}>
                    <textarea value={form.reviewNotes || ''} onChange={(e) => updateField('reviewNotes', e.target.value)} className={inputClass} placeholder="Internal notes for reviewers" />
                  </FormField>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button onClick={onClose} className="px-4 py-2 bg-[#1a1d21] hover:bg-[#21262d] text-white rounded-lg text-sm">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm">
            {isEdit ? 'Update FAQ' : 'Create FAQ'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// FAQ DETAIL MODAL
// ============================================

function FAQDetailModal({
  faq, categories, onClose, onEdit, onDelete,
}: {
  faq: FAQ; categories: FAQCategoryItem[]; onClose: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const cat = categories.find((c) => c.id === faq.categoryId);
  const subcat = categories.find((c) => c.id === faq.subcategoryId);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-10 overflow-y-auto">
      <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-3xl mx-4 mb-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={faq.status} />
              <PriorityBadge priority={faq.priority} />
              <TypeBadge type={faq.faqType} />
            </div>
            <h2 className="text-xl font-bold text-white">{faq.title || faq.question}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1d21] rounded-lg text-[#878e9a] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[#878e9a] uppercase mb-1">Question</h3>
            <p className="text-white">{faq.question}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#878e9a] uppercase mb-1">Answer</h3>
            <p className="text-[#afb6c4] whitespace-pre-wrap">{faq.answer}</p>
          </div>
          {faq.shortAnswer && (
            <div>
              <h3 className="text-sm font-semibold text-[#878e9a] uppercase mb-1">Short Answer</h3>
              <p className="text-[#afb6c4]">{faq.shortAnswer}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#151920] rounded-lg p-3">
              <p className="text-xs text-[#878e9a]">Category</p>
              <p className="text-white text-sm">{cat?.name || 'Uncategorised'}</p>
            </div>
            <div className="bg-[#151920] rounded-lg p-3">
              <p className="text-xs text-[#878e9a]">Subcategory</p>
              <p className="text-white text-sm">{subcat?.name || 'None'}</p>
            </div>
            <div className="bg-[#151920] rounded-lg p-3">
              <p className="text-xs text-[#878e9a]">Audience</p>
              <p className="text-white text-sm capitalize">{(faq.audienceType || 'public').replace('-', ' ')}</p>
            </div>
          </div>

          {(faq.tags || []).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[#878e9a] uppercase mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {faq.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/20 rounded text-xs">{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#151920] rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-white">{faq.viewCount || 0}</p>
              <p className="text-xs text-[#878e9a]">Views</p>
            </div>
            <div className="bg-[#151920] rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-green-400">{faq.helpfulCount || 0}</p>
              <p className="text-xs text-[#878e9a]">Helpful</p>
            </div>
            <div className="bg-[#151920] rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-red-400">{faq.notHelpfulCount || 0}</p>
              <p className="text-xs text-[#878e9a]">Not Helpful</p>
            </div>
            <div className="bg-[#151920] rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-[#C8FF2E]">{faq.aiContextWeight || 5}</p>
              <p className="text-xs text-[#878e9a]">AI Weight</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm">
            <Edit3 className="w-4 h-4" /> Edit
          </button>
          <button onClick={onDelete} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}