/**
 * Sales Scripts Management Module
 *
 * Comprehensive sales communication operating system with:
 * - Multiple script types (cold-call, email, demo, etc.)
 * - Objection handling
 * - Qualification questions
 * - Performance tracking
 * - AI generation support
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessageSquareText, Search, Plus, Filter, Download, Upload, Sparkles,
  ChevronDown, ChevronRight, X, Check, AlertCircle, Edit3, Trash2,
  Eye, Phone, Mail, Video, Users, Bot, Target, TrendingUp,
  Clock, CheckCircle, XCircle, Archive, Play, Copy, Layers,
  FileText, MessageCircle, Mic, Calendar, RefreshCw, Zap,
  MoreVertical, ArrowRight, Briefcase, Star, Award, Globe,
} from 'lucide-react';
import { useAuthStore, useCompanyStore } from '@/stores';
import { salesScriptApi, productApi } from '@/services/api';
import type {
  SalesScript, ScriptType, ScriptStatus, FunnelStage,
  AudienceType, CommunicationChannel, ScriptPriority,
  IScriptSection, IQualificationQuestion, IObjectionResponse,
  IConversationBranch,
} from '@/types/entities';

// ============================================
// CONSTANTS
// ============================================

const SCRIPT_TYPES: { value: ScriptType; label: string; icon: React.ReactNode }[] = [
  { value: 'cold-call', label: 'Cold Call', icon: <Phone className="w-4 h-4" /> },
  { value: 'warm-call', label: 'Warm Call', icon: <Phone className="w-4 h-4" /> },
  { value: 'qualification', label: 'Qualification', icon: <Target className="w-4 h-4" /> },
  { value: 'discovery', label: 'Discovery', icon: <Search className="w-4 h-4" /> },
  { value: 'demo', label: 'Demo', icon: <Video className="w-4 h-4" /> },
  { value: 'sales-pitch', label: 'Sales Pitch', icon: <MessageSquareText className="w-4 h-4" /> },
  { value: 'follow-up', label: 'Follow-up', icon: <RefreshCw className="w-4 h-4" /> },
  { value: 'negotiation', label: 'Negotiation', icon: <Briefcase className="w-4 h-4" /> },
  { value: 'closing', label: 'Closing', icon: <CheckCircle className="w-4 h-4" /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
  { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <Globe className="w-4 h-4" /> },
  { value: 'voice-note', label: 'Voice Note', icon: <Mic className="w-4 h-4" /> },
  { value: 'appointment', label: 'Appointment', icon: <Calendar className="w-4 h-4" /> },
  { value: 'reactivation', label: 'Reactivation', icon: <RefreshCw className="w-4 h-4" /> },
  { value: 'referral', label: 'Referral', icon: <Users className="w-4 h-4" /> },
  { value: 'upselling', label: 'Upselling', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'cross-selling', label: 'Cross-selling', icon: <Layers className="w-4 h-4" /> },
  { value: 'retention', label: 'Retention', icon: <Star className="w-4 h-4" /> },
  { value: 'renewal', label: 'Renewal', icon: <RefreshCw className="w-4 h-4" /> },
  { value: 'customer-success', label: 'Customer Success', icon: <Award className="w-4 h-4" /> },
  { value: 'objection-handling', label: 'Objection Handling', icon: <AlertCircle className="w-4 h-4" /> },
];

const SCRIPT_STATUSES: { value: ScriptStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: 'bg-[#686f7e]/20 text-[#878e9a] border-[#686f7e]/30' },
  { value: 'review', label: 'In Review', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { value: 'approved', label: 'Approved', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { value: 'published', label: 'Published', color: 'bg-[#C8FF2E]/20 text-[#C8FF2E] border-[#C8FF2E]/30' },
  { value: 'archived', label: 'Archived', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
];

const FUNNEL_STAGES: { value: FunnelStage; label: string }[] = [
  { value: 'awareness', label: 'Awareness' },
  { value: 'interest', label: 'Interest' },
  { value: 'consideration', label: 'Consideration' },
  { value: 'decision', label: 'Decision' },
  { value: 'purchase', label: 'Purchase' },
  { value: 'retention', label: 'Retention' },
  { value: 'advocacy', label: 'Advocacy' },
];

const AUDIENCE_TYPES: { value: AudienceType; label: string }[] = [
  { value: 'prospect', label: 'Prospect' },
  { value: 'lead', label: 'Lead' },
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'customer', label: 'Customer' },
  { value: 'partner', label: 'Partner' },
  { value: 'investor', label: 'Investor' },
];

const CHANNELS: { value: CommunicationChannel; label: string }[] = [
  { value: 'phone', label: 'Phone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'email', label: 'Email' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'google-meet', label: 'Google Meet' },
  { value: 'in-person', label: 'In-Person' },
  { value: 'sms', label: 'SMS' },
  { value: 'voice-note', label: 'Voice Note' },
];

const PRIORITIES: { value: ScriptPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-[#686f7e]' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'high', label: 'High', color: 'text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'text-red-400' },
];

const SECTION_TYPES = [
  { value: 'opening', label: 'Opening' },
  { value: 'hook', label: 'Hook' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'pain-discovery', label: 'Pain Discovery' },
  { value: 'value-position', label: 'Value Proposition' },
  { value: 'offer', label: 'Offer' },
  { value: 'objection', label: 'Objection Handling' },
  { value: 'trust', label: 'Trust Building' },
  { value: 'social-proof', label: 'Social Proof' },
  { value: 'closing', label: 'Closing' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'exit', label: 'Exit' },
];

type TabId = 'all' | 'draft' | 'review' | 'approved' | 'published' | 'playbooks' | 'export';

const TABS: { id: TabId; label: string; status?: ScriptStatus; icon?: React.ReactNode }[] = [
  { id: 'all', label: 'All Scripts' },
  { id: 'draft', label: 'Drafts', status: 'draft' },
  { id: 'review', label: 'In Review', status: 'review' },
  { id: 'approved', label: 'Approved', status: 'approved' },
  { id: 'published', label: 'Published', status: 'published' },
  { id: 'playbooks', label: 'Playbooks', icon: <Layers className="w-4 h-4" /> },
  { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" /> },
];

const DEFAULT_SCRIPT: Partial<SalesScript> = {
  title: '',
  scriptType: 'cold-call',
  status: 'draft',
  priority: 'medium',
  funnelStage: 'awareness',
  audienceType: 'prospect',
  channels: ['phone'],
  isPublic: true,
  aiGenerated: false,
  language: 'en',
  sections: [],
  qualificationQuestions: [],
  objectionResponses: [],
  conversationBranches: [],
  productIds: [],
  serviceIds: [],
  tags: [],
  revisionNotes: [],
};

const inputClass = 'w-full bg-[#1a1d21] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50';
const selectClass = 'w-full bg-[#1a1d21] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50';

// ============================================
// HELPER COMPONENTS
// ============================================

function StatusBadge({ status }: { status: ScriptStatus }) {
  const config = SCRIPT_STATUSES.find((s) => s.value === status) || SCRIPT_STATUSES[0];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
}

function TypeBadge({ type }: { type: ScriptType }) {
  const config = SCRIPT_TYPES.find((t) => t.value === type);
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#1a1d21] text-[#afb6c4] border border-white/10">
      {config?.icon}
      {config?.label || type}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: ScriptPriority }) {
  const config = PRIORITIES.find((p) => p.value === priority) || PRIORITIES[1];
  return (
    <span className={`text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

function PerformanceMetrics({ metrics }: { metrics?: { usageCount: number; successRate: number; avgConversionTime: number; feedbackScore?: number } }) {
  if (!metrics) return null;
  return (
    <div className="flex items-center gap-3 text-xs text-[#878e9a]">
      <span className="flex items-center gap-1">
        <Play className="w-3 h-3" />
        {metrics.usageCount} uses
      </span>
      <span className="flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        {metrics.successRate.toFixed(1)}% success
      </span>
      {metrics.feedbackScore && (
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          {metrics.feedbackScore.toFixed(1)} rating
        </span>
      )}
    </div>
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

// ============================================
// MAIN COMPONENT
// ============================================

export default function SalesScriptsModule() {
  const user = useAuthStore(s => s.user);
  const storeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [scripts, setScripts] = useState<SalesScript[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ScriptType | ''>('');
  const [filterFunnel, setFilterFunnel] = useState<FunnelStage | ''>('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SalesScript | null>(null);
  const [viewingItem, setViewingItem] = useState<SalesScript | null>(null);

  // Load data - always fetch ALL scripts for accurate counts
  const loadData = useCallback(async () => {
    if (!companyId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const [scriptsRes, productsRes] = await Promise.all([
        salesScriptApi.getAll(companyId),
        productApi.getAll(companyId).catch(() => ({ data: [] })),
      ]);

      if (scriptsRes.data) {
        setScripts(Array.isArray(scriptsRes.data) ? scriptsRes.data : []);
      }
      if (productsRes.data) setProducts((productsRes.data as any[]).map(p => ({ id: p.id, name: p.name || p.productName || 'Unknown' })));
    } catch (err) {
      console.error('Failed to load data:', err);
    }
    setIsLoading(false);
  }, [companyId]);

  useEffect(() => { loadData(); }, [loadData]);

  // Filtered scripts
  const filteredScripts = useMemo(() => {
    let result = [...scripts];
    // Filter by tab status
    const tabStatus = TABS.find(t => t.id === activeTab)?.status;
    if (tabStatus) {
      result = result.filter((s) => s.status === tabStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) =>
        (s.title || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (s.openingLine || '').toLowerCase().includes(q) ||
        (s.hook || '').toLowerCase().includes(q)
      );
    }
    if (filterType) {
      result = result.filter((s) => s.scriptType === filterType);
    }
    if (filterFunnel) {
      result = result.filter((s) => s.funnelStage === filterFunnel);
    }
    return result;
  }, [scripts, activeTab, searchQuery, filterType, filterFunnel]);

  // Stats
  const stats = useMemo(() => ({
    total: scripts.length,
    draft: scripts.filter((s) => s.status === 'draft').length,
    review: scripts.filter((s) => s.status === 'review').length,
    approved: scripts.filter((s) => s.status === 'approved').length,
    published: scripts.filter((s) => s.status === 'published').length,
    aiGenerated: scripts.filter((s) => s.aiGenerated).length,
  }), [scripts]);

  // CRUD handlers
  const handleCreate = async (data: Partial<SalesScript>) => {
    if (!companyId) return;
    try {
      const res = await salesScriptApi.create({ ...data, companyId });
      if (res.data) {
        setScripts(prev => [res.data as SalesScript, ...prev]);
        setShowCreateModal(false);
      } else if (res.error) {
        console.error('Create error:', res.error);
        alert('Failed to create script: ' + res.error);
      }
    } catch (err) {
      console.error('Create failed:', err);
      alert('Failed to create script');
    }
  };

  const handleUpdate = async (id: string, data: Partial<SalesScript>) => {
    try {
      const res = await salesScriptApi.update(id, data);
      if (res.data) {
        setScripts(prev => prev.map(s => s.id === id ? (res.data as SalesScript) : s));
        setEditingItem(null);
      } else if (res.error) {
        console.error('Update error:', res.error);
        alert('Failed to update script: ' + res.error);
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update script');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this script?')) return;
    try {
      const res = await salesScriptApi.delete(id);
      if (!res.error) {
        setScripts(prev => prev.filter(s => s.id !== id));
        setViewingItem(null);
      } else {
        console.error('Delete error:', res.error);
        alert('Failed to delete script: ' + res.error);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete script');
    }
  };

  const handleClone = async (id: string) => {
    try {
      const res = await salesScriptApi.clone(id);
      if (res.data) {
        setScripts(prev => [res.data as SalesScript, ...prev]);
      } else if (res.error) {
        alert('Failed to clone script: ' + res.error);
      }
    } catch (err) {
      console.error('Clone failed:', err);
      alert('Failed to clone script');
    }
  };

  const handleBulkUpdateStatus = async (status: ScriptStatus) => {
    if (selectedItems.size === 0) return;
    await salesScriptApi.bulkUpdate(Array.from(selectedItems), { status });
    setSelectedItems(new Set());
    await loadData();
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#878e9a]">Please select a company to view sales scripts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#C8FF2E] to-[#b3e62e] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C8FF2E]/20">
            <MessageSquareText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sales Scripts</h1>
            <p className="text-sm text-[#878e9a]">Sales communication operating system</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Script
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-[#878e9a]">Total</p>
        </div>
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-[#878e9a]">{stats.draft}</p>
          <p className="text-xs text-[#878e9a]">Drafts</p>
        </div>
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-yellow-400">{stats.review}</p>
          <p className="text-xs text-[#878e9a]">In Review</p>
        </div>
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
          <p className="text-xs text-[#878e9a]">Approved</p>
        </div>
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-[#C8FF2E]">{stats.published}</p>
          <p className="text-xs text-[#878e9a]">Published</p>
        </div>
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-purple-400">{stats.aiGenerated}</p>
          <p className="text-xs text-[#878e9a]">AI Generated</p>
        </div>
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
            {tab.status && (
              <span className="px-1.5 py-0.5 text-xs bg-[#1a1d21] rounded">
                {scripts.filter((s) => s.status === tab.status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#878e9a]" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-10`}
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as ScriptType | '')} className={selectClass + ' w-44'}>
          <option value="">All Types</option>
          {SCRIPT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select value={filterFunnel} onChange={(e) => setFilterFunnel(e.target.value as FunnelStage | '')} className={selectClass + ' w-44'}>
          <option value="">All Stages</option>
          {FUNNEL_STAGES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>

      {/* Bulk Actions Bar */}
      {selectedItems.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 rounded-lg">
          <span className="text-sm text-[#C8FF2E] font-medium">{selectedItems.size} selected</span>
          <button onClick={() => handleBulkUpdateStatus('approved')} className="px-3 py-1 text-xs bg-green-500/20 text-green-300 rounded hover:bg-green-500/30">Approve</button>
          <button onClick={() => handleBulkUpdateStatus('published')} className="px-3 py-1 text-xs bg-[#C8FF2E]/20 text-[#C8FF2E] rounded hover:bg-[#C8FF2E]/30">Publish</button>
          <button onClick={() => handleBulkUpdateStatus('archived')} className="px-3 py-1 text-xs bg-[#1a1d21] text-[#878e9a] rounded hover:bg-[#21262d]">Archive</button>
          <button onClick={() => setSelectedItems(new Set())} className="ml-auto text-xs text-[#878e9a] hover:text-white">Clear</button>
        </div>
      )}

      {/* Scripts List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8FF2E]"></div>
        </div>
      ) : filteredScripts.length === 0 ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <MessageSquareText className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a] mb-2">No scripts found</p>
          <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm">
            Create Your First Script
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header Row */}
          <div className="flex items-center gap-3 px-4 py-2 text-xs text-[#878e9a]">
            <input type="checkbox" className="rounded border-white/20" />
            <span className="w-24">Type</span>
            <span className="flex-1">Title / Description</span>
            <span className="w-28">Stage</span>
            <span className="w-24">Status</span>
            <span className="w-16">Priority</span>
            <span className="w-32">Actions</span>
          </div>
          {filteredScripts.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 px-4 py-3 bg-[#151920] hover:bg-[#1a1d21] rounded-lg border border-white/10/50 hover:border-white/20 transition-colors cursor-pointer"
              onClick={() => setViewingItem(s)}
            >
              <input
                type="checkbox"
                checked={selectedItems.has(s.id)}
                onChange={(e) => { e.stopPropagation(); const next = new Set(selectedItems); if (next.has(s.id)) next.delete(s.id); else next.add(s.id); setSelectedItems(next); }}
                className="rounded border-white/20"
              />
              <TypeBadge type={s.scriptType} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{s.title || 'Untitled'}</p>
                <p className="text-xs text-[#878e9a] truncate">{s.description || 'No description'}</p>
              </div>
              <span className="w-28 text-xs text-[#afb6c4]">{FUNNEL_STAGES.find(f => f.value === s.funnelStage)?.label || s.funnelStage}</span>
              <StatusBadge status={s.status} />
              <PriorityBadge priority={s.priority} />
              <div className="w-32 flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); handleClone(s.id); }} className="p-1.5 hover:bg-[#1a1d21] rounded text-[#878e9a] hover:text-white" title="Clone">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setEditingItem(s); }} className="p-1.5 hover:bg-[#1a1d21] rounded text-[#878e9a] hover:text-white">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }} className="p-1.5 hover:bg-[#1a1d21] rounded text-[#878e9a] hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 hover:bg-[#1a1d21] rounded text-[#878e9a] hover:text-white">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingItem) && (
        <ScriptModal
          script={editingItem}
          companyId={companyId}
          products={products}
          onClose={() => { setShowCreateModal(false); setEditingItem(null); }}
          onSave={editingItem ? ((id, data) => handleUpdate(id, data)) : ((data) => handleCreate(data))}
        />
      )}

      {/* View Detail Modal */}
      {viewingItem && (
        <ScriptDetailModal
          script={viewingItem}
          onClose={() => setViewingItem(null)}
          onEdit={() => { setEditingItem(viewingItem); setViewingItem(null); }}
          onDelete={() => handleDelete(viewingItem.id)}
          onClone={() => handleClone(viewingItem.id)}
        />
      )}
    </div>
  );
}

// ============================================
// SCRIPT CREATE/EDIT MODAL
// ============================================

function ScriptModal({
  script, companyId, products, onClose, onSave,
}: {
  script: SalesScript | null;
  companyId: string;
  products: { id: string; name: string }[];
  onClose: () => void;
  onSave: ((id: string, data: Partial<SalesScript>) => void) | ((data: Partial<SalesScript>) => void);
}) {
  const isEdit = !!script;
  const [form, setForm] = useState<Partial<SalesScript>>(script ? { ...script } : { ...DEFAULT_SCRIPT });
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Section management
  const addSection = () => {
    const sections = [...(form.sections || []), {
      id: Date.now().toString(),
      type: 'opening' as const,
      title: '',
      content: '',
      order: (form.sections?.length || 0) + 1,
      isRequired: false,
    }];
    updateField('sections', sections);
  };

  const updateSection = (id: string, updates: Partial<IScriptSection>) => {
    const sections = (form.sections || []).map(s => s.id === id ? { ...s, ...updates } : s);
    updateField('sections', sections);
  };

  const removeSection = (id: string) => {
    const sections = (form.sections || []).filter(s => s.id !== id);
    updateField('sections', sections);
  };

  // Qualification question management
  const addQualificationQuestion = () => {
    const questions = [...(form.qualificationQuestions || []), {
      id: Date.now().toString(),
      question: '',
      order: (form.qualificationQuestions?.length || 0) + 1,
    }];
    updateField('qualificationQuestions', questions);
  };

  const updateQualificationQuestion = (id: string, updates: Partial<IQualificationQuestion>) => {
    const questions = (form.qualificationQuestions || []).map(q => q.id === id ? { ...q, ...updates } : q);
    updateField('qualificationQuestions', questions);
  };

  const removeQualificationQuestion = (id: string) => {
    const questions = (form.qualificationQuestions || []).filter(q => q.id !== id);
    updateField('qualificationQuestions', questions);
  };

  // Objection response management
  const addObjectionResponse = () => {
    const responses = [...(form.objectionResponses || []), {
      id: Date.now().toString(),
      objection: '',
      response: '',
      order: (form.objectionResponses?.length || 0) + 1,
    }];
    updateField('objectionResponses', responses);
  };

  const updateObjectionResponse = (id: string, updates: Partial<IObjectionResponse>) => {
    const responses = (form.objectionResponses || []).map(r => r.id === id ? { ...r, ...updates } : r);
    updateField('objectionResponses', responses);
  };

  const removeObjectionResponse = (id: string) => {
    const responses = (form.objectionResponses || []).filter(r => r.id !== id);
    updateField('objectionResponses', responses);
  };

  const handleSave = async () => {
    if (!form.title) {
      alert('Script title is required');
      return;
    }
    setIsSaving(true);
    try {
      if (isEdit && script) {
        await (onSave as (id: string, data: Partial<SalesScript>) => Promise<void>)(script.id, form);
      } else {
        await (onSave as (data: Partial<SalesScript>) => Promise<void>)({ ...form, companyId });
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: <FileText className="w-4 h-4" /> },
    { id: 'content', label: 'Script Content', icon: <MessageSquareText className="w-4 h-4" /> },
    { id: 'sections', label: 'Structured Sections', icon: <Layers className="w-4 h-4" /> },
    { id: 'questions', label: 'Qualification Questions', icon: <Target className="w-4 h-4" /> },
    { id: 'objections', label: 'Objection Handling', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'mapping', label: 'Entity Mapping', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'training', label: 'Training & Notes', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Copy className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-10 overflow-y-auto">
      <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-5xl mx-4 mb-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Script' : 'Create Script'}</h2>
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
            {activeSection === 'basic' && (
              <div className="space-y-4">
                <SectionHeader title="Basic Information" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Script Title" required colSpan={2}>
                    <input value={form.title || ''} onChange={(e) => updateField('title', e.target.value)} className={inputClass} placeholder="e.g., Cold Call - Enterprise SaaS" />
                  </FormField>
                  <FormField label="Description" colSpan={2}>
                    <textarea value={form.description || ''} onChange={(e) => updateField('description', e.target.value)} className={inputClass + ' min-h-[80px]'} placeholder="Brief description of this script..." />
                  </FormField>
                  <FormField label="Script Type">
                    <select value={form.scriptType || 'cold-call'} onChange={(e) => updateField('scriptType', e.target.value)} className={selectClass}>
                      {SCRIPT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Status">
                    <select value={form.status || 'draft'} onChange={(e) => updateField('status', e.target.value)} className={selectClass}>
                      {SCRIPT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Funnel Stage">
                    <select value={form.funnelStage || 'awareness'} onChange={(e) => updateField('funnelStage', e.target.value)} className={selectClass}>
                      {FUNNEL_STAGES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Audience Type">
                    <select value={form.audienceType || 'prospect'} onChange={(e) => updateField('audienceType', e.target.value)} className={selectClass}>
                      {AUDIENCE_TYPES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Priority">
                    <select value={form.priority || 'medium'} onChange={(e) => updateField('priority', e.target.value)} className={selectClass}>
                      {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Target Industry">
                    <input value={form.targetIndustry || ''} onChange={(e) => updateField('targetIndustry', e.target.value)} className={inputClass} placeholder="e.g., Technology, Healthcare" />
                  </FormField>
                  <FormField label="Target Persona" colSpan={2}>
                    <input value={form.targetPersona || ''} onChange={(e) => updateField('targetPersona', e.target.value)} className={inputClass} placeholder="e.g., CTO, Marketing Director" />
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'content' && (
              <div className="space-y-4">
                <SectionHeader title="Script Content" />
                <div className="space-y-4">
                  <FormField label="Opening Line" helperText="First thing to say when starting the conversation">
                    <textarea value={form.openingLine || ''} onChange={(e) => updateField('openingLine', e.target.value)} className={inputClass + ' min-h-[80px]'} placeholder="Hi [Name], this is [Your Name] from [Company]..." />
                  </FormField>
                  <FormField label="Hook" helperText="Attention-grabbing statement to engage the prospect">
                    <textarea value={form.hook || ''} onChange={(e) => updateField('hook', e.target.value)} className={inputClass + ' min-h-[80px]'} placeholder="I noticed that companies in [industry] are struggling with..." />
                  </FormField>
                  <FormField label="Value Proposition" helperText="Core value you bring to the customer">
                    <textarea value={form.valueProposition || ''} onChange={(e) => updateField('valueProposition', e.target.value)} className={inputClass + ' min-h-[100px]'} placeholder="We help [target audience] achieve [outcome] by..." />
                  </FormField>
                  <FormField label="Offer Presentation" helperText="How to present your offer">
                    <textarea value={form.offerPresentation || ''} onChange={(e) => updateField('offerPresentation', e.target.value)} className={inputClass + ' min-h-[100px]'} placeholder="Based on what you've told me, here's what I recommend..." />
                  </FormField>
                  <FormField label="Closing CTA" helperText="Call-to-action to end the conversation">
                    <input value={form.closingCTA || ''} onChange={(e) => updateField('closingCTA', e.target.value)} className={inputClass} placeholder="Would you be available for a 30-minute demo next Tuesday?" />
                  </FormField>
                  <FormField label="Follow-up CTA" helperText="What to say if they're not ready to commit">
                    <input value={form.followUpCTA || ''} onChange={(e) => updateField('followUpCTA', e.target.value)} className={inputClass} placeholder="I'll send you some resources and follow up next week..." />
                  </FormField>
                  <FormField label="Exit Response" helperText="How to gracefully exit if not interested">
                    <textarea value={form.exitResponse || ''} onChange={(e) => updateField('exitResponse', e.target.value)} className={inputClass + ' min-h-[60px]'} placeholder="I understand. Thank you for your time. Feel free to reach out if..." />
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'sections' && (
              <div className="space-y-4">
                <SectionHeader title="Structured Sections">
                  <button onClick={addSection} className="flex items-center gap-1 px-3 py-1.5 bg-[#C8FF2E]/10 hover:bg-[#C8FF2E]/20 text-[#C8FF2E] rounded-lg text-xs">
                    <Plus className="w-3 h-3" /> Add Section
                  </button>
                </SectionHeader>
                {(form.sections || []).length === 0 ? (
                  <div className="text-center py-8 text-[#686f7e]">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No sections added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(form.sections || []).map((section, index) => (
                      <div key={section.id} className="bg-[#1a1d21] border border-white/10 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <FormField label="Section Type">
                              <select value={section.type} onChange={(e) => updateSection(section.id, { type: e.target.value as IScriptSection['type'] })} className={selectClass}>
                                {SECTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                              </select>
                            </FormField>
                            <FormField label="Title">
                              <input value={section.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} className={inputClass} placeholder="Section title..." />
                            </FormField>
                          </div>
                          <button onClick={() => removeSection(section.id)} className="p-1.5 hover:bg-red-500/20 rounded text-[#878e9a] hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <FormField label="Content">
                          <textarea value={section.content} onChange={(e) => updateSection(section.id, { content: e.target.value })} className={inputClass + ' min-h-[100px]'} placeholder="Script content for this section..." />
                        </FormField>
                        <div className="flex items-center gap-4 mt-2">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={section.isRequired} onChange={(e) => updateSection(section.id, { isRequired: e.target.checked })} className="rounded border-white/20" />
                            <span className="text-xs text-[#878e9a]">Required</span>
                          </label>
                          <span className="text-xs text-[#686f7e]">Order: {section.order}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'questions' && (
              <div className="space-y-4">
                <SectionHeader title="Qualification Questions">
                  <button onClick={addQualificationQuestion} className="flex items-center gap-1 px-3 py-1.5 bg-[#C8FF2E]/10 hover:bg-[#C8FF2E]/20 text-[#C8FF2E] rounded-lg text-xs">
                    <Plus className="w-3 h-3" /> Add Question
                  </button>
                </SectionHeader>
                {(form.qualificationQuestions || []).length === 0 ? (
                  <div className="text-center py-8 text-[#686f7e]">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No questions added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(form.qualificationQuestions || []).map((q, index) => (
                      <div key={q.id} className="bg-[#1a1d21] border border-white/10 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <FormField label={`Question ${index + 1}`}>
                              <input value={q.question} onChange={(e) => updateQualificationQuestion(q.id, { question: e.target.value })} className={inputClass} placeholder="What question do you want to ask?" />
                            </FormField>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <FormField label="Purpose">
                                <input value={q.purpose || ''} onChange={(e) => updateQualificationQuestion(q.id, { purpose: e.target.value })} className={inputClass} placeholder="Why ask this?" />
                              </FormField>
                              <FormField label="Follow-up if Yes">
                                <input value={q.followUpIfYes || ''} onChange={(e) => updateQualificationQuestion(q.id, { followUpIfYes: e.target.value })} className={inputClass} placeholder="What to ask next?" />
                              </FormField>
                            </div>
                          </div>
                          <button onClick={() => removeQualificationQuestion(q.id)} className="p-1.5 hover:bg-red-500/20 rounded text-[#878e9a] hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'objections' && (
              <div className="space-y-4">
                <SectionHeader title="Objection Handling">
                  <button onClick={addObjectionResponse} className="flex items-center gap-1 px-3 py-1.5 bg-[#C8FF2E]/10 hover:bg-[#C8FF2E]/20 text-[#C8FF2E] rounded-lg text-xs">
                    <Plus className="w-3 h-3" /> Add Objection
                  </button>
                </SectionHeader>
                {(form.objectionResponses || []).length === 0 ? (
                  <div className="text-center py-8 text-[#686f7e]">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No objections added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(form.objectionResponses || []).map((obj, index) => (
                      <div key={obj.id} className="bg-[#1a1d21] border border-white/10 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <FormField label={`Objection ${index + 1}`}>
                              <input value={obj.objection} onChange={(e) => updateObjectionResponse(obj.id, { objection: e.target.value })} className={inputClass} placeholder="Common objection: 'It's too expensive'" />
                            </FormField>
                            <FormField label="Response" className="mt-2">
                              <textarea value={obj.response} onChange={(e) => updateObjectionResponse(obj.id, { response: e.target.value })} className={inputClass + ' min-h-[80px]'} placeholder="Recommended response..." />
                            </FormField>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <FormField label="Trust Building Line">
                                <input value={obj.trustBuildingLine || ''} onChange={(e) => updateObjectionResponse(obj.id, { trustBuildingLine: e.target.value })} className={inputClass} placeholder="Build credibility..." />
                              </FormField>
                              <FormField label="CTA Suggestion">
                                <input value={obj.ctaSuggestion || ''} onChange={(e) => updateObjectionResponse(obj.id, { ctaSuggestion: e.target.value })} className={inputClass} placeholder="Move to next step..." />
                              </FormField>
                            </div>
                          </div>
                          <button onClick={() => removeObjectionResponse(obj.id)} className="p-1.5 hover:bg-red-500/20 rounded text-[#878e9a] hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'mapping' && (
              <div className="space-y-4">
                <SectionHeader title="Entity Mapping" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Related Products">
                    <div className="max-h-32 overflow-y-auto space-y-1 bg-[#1a1d21] rounded-lg p-2">
                      {products.length === 0 ? (
                        <p className="text-xs text-[#686f7e] p-2">No products available</p>
                      ) : (
                        products.map((p) => (
                          <label key={p.id} className="flex items-center gap-2 p-1 hover:bg-[#21262d] rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(form.productIds || []).includes(p.id)}
                              onChange={(e) => {
                                const ids = e.target.checked
                                  ? [...(form.productIds || []), p.id]
                                  : (form.productIds || []).filter(id => id !== p.id);
                                updateField('productIds', ids);
                              }}
                              className="rounded border-white/20"
                            />
                            <span className="text-sm text-[#afb6c4]">{p.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </FormField>
                  <FormField label="Tags">
                    <div className="flex gap-2">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tagInput.trim()) {
                            e.preventDefault();
                            if (!(form.tags || []).includes(tagInput.trim())) {
                              updateField('tags', [...(form.tags || []), tagInput.trim()]);
                            }
                            setTagInput('');
                          }
                        }}
                        className={inputClass}
                        placeholder="Add tag and press Enter..."
                      />
                      <button
                        onClick={() => {
                          if (tagInput.trim() && !(form.tags || []).includes(tagInput.trim())) {
                            updateField('tags', [...(form.tags || []), tagInput.trim()]);
                            setTagInput('');
                          }
                        }}
                        className="px-3 py-2 bg-[#C8FF2E]/10 hover:bg-[#C8FF2E]/20 text-[#C8FF2E] rounded-lg text-sm"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(form.tags || []).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/20 rounded text-xs">
                          {tag}
                          <button onClick={() => updateField('tags', (form.tags || []).filter((t) => t !== tag))} className="hover:text-white"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="Brand Tone" colSpan={2}>
                    <textarea value={form.brandTone || ''} onChange={(e) => updateField('brandTone', e.target.value)} className={inputClass + ' min-h-[80px]'} placeholder="Brand voice and tone guidelines..." />
                  </FormField>
                  <FormField label="Communication Style" colSpan={2}>
                    <textarea value={form.communicationStyle || ''} onChange={(e) => updateField('communicationStyle', e.target.value)} className={inputClass + ' min-h-[80px]'} placeholder="How to communicate in this script..." />
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'training' && (
              <div className="space-y-4">
                <SectionHeader title="Training & Notes" />
                <div className="space-y-4">
                  <FormField label="Training Notes" helperText="Key points for sales team training">
                    <textarea value={form.trainingNotes || ''} onChange={(e) => updateField('trainingNotes', e.target.value)} className={inputClass + ' min-h-[100px]'} placeholder="Important notes for sales reps..." />
                  </FormField>
                  <FormField label="Best Practices" colSpan={2}>
                    <textarea value={form.bestPractices?.join('\n') || ''} onChange={(e) => updateField('bestPractices', e.target.value.split('\n').filter(Boolean))} className={inputClass + ' min-h-[100px]'} placeholder="One practice per line..." />
                  </FormField>
                  <FormField label="Coaching Notes" colSpan={2}>
                    <textarea value={form.coachingNotes || ''} onChange={(e) => updateField('coachingNotes', e.target.value)} className={inputClass + ' min-h-[80px]'} placeholder="Notes for managers and coaches..." />
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="space-y-4">
                <SectionHeader title="Settings" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Language">
                    <input value={form.language || 'en'} onChange={(e) => updateField('language', e.target.value)} className={inputClass} placeholder="e.g., en, es, fr" />
                  </FormField>
                  <FormField label="Playbook ID">
                    <input value={form.playbookId || ''} onChange={(e) => updateField('playbookId', e.target.value)} className={inputClass} placeholder="Link to playbook..." />
                  </FormField>
                  <FormField label="Is Public">
                    <label className="flex items-center gap-2 mt-1">
                      <input type="checkbox" checked={form.isPublic !== false} onChange={(e) => updateField('isPublic', e.target.checked)} className="rounded border-white/20" />
                      <span className="text-sm text-[#afb6c4]">Available to all team members</span>
                    </label>
                  </FormField>
                  <FormField label="AI Generated">
                    <label className="flex items-center gap-2 mt-1">
                      <input type="checkbox" checked={form.aiGenerated || false} onChange={(e) => updateField('aiGenerated', e.target.checked)} className="rounded border-white/20" />
                      <span className="text-sm text-[#afb6c4]">This script was generated by AI</span>
                    </label>
                  </FormField>
                  <FormField label="Communication Channels" colSpan={2}>
                    <div className="flex flex-wrap gap-2">
                      {CHANNELS.map((ch) => (
                        <label key={ch.value} className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1d21] rounded-lg cursor-pointer hover:bg-[#21262d]">
                          <input
                            type="checkbox"
                            checked={(form.channels || []).includes(ch.value)}
                            onChange={(e) => {
                              const channels = e.target.checked
                                ? [...(form.channels || []), ch.value]
                                : (form.channels || []).filter(c => c !== ch.value);
                              updateField('channels', channels);
                            }}
                            className="rounded border-white/20"
                          />
                          <span className="text-sm text-[#afb6c4]">{ch.label}</span>
                        </label>
                      ))}
                    </div>
                  </FormField>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-[#1a1d21] hover:bg-[#21262d] text-white rounded-lg text-sm disabled:opacity-50">Cancel</button>
          <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm disabled:opacity-50 flex items-center gap-2">
            {isSaving && <div className="animate-spin h-4 w-4 border-2 border-[#0d1117] border-t-transparent rounded-full" />}
            {isEdit ? 'Update Script' : 'Create Script'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SCRIPT DETAIL MODAL
// ============================================

function ScriptDetailModal({
  script, onClose, onEdit, onDelete, onClone,
}: {
  script: SalesScript;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClone: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-10 overflow-y-auto">
      <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-3xl mx-4 mb-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <TypeBadge type={script.scriptType} />
            <StatusBadge status={script.status} />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1d21] rounded-lg text-[#878e9a] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-bold text-white">{script.title}</h2>
            {script.description && (
              <p className="text-sm text-[#878e9a] mt-1">{script.description}</p>
            )}
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-[#151920] rounded-lg p-3">
              <p className="text-xs text-[#878e9a]">Funnel Stage</p>
              <p className="text-sm text-white font-medium">{FUNNEL_STAGES.find(f => f.value === script.funnelStage)?.label || script.funnelStage}</p>
            </div>
            <div className="bg-[#151920] rounded-lg p-3">
              <p className="text-xs text-[#878e9a]">Audience</p>
              <p className="text-sm text-white font-medium">{AUDIENCE_TYPES.find(a => a.value === script.audienceType)?.label || script.audienceType}</p>
            </div>
            <div className="bg-[#151920] rounded-lg p-3">
              <p className="text-xs text-[#878e9a]">Priority</p>
              <PriorityBadge priority={script.priority} />
            </div>
            <div className="bg-[#151920] rounded-lg p-3">
              <p className="text-xs text-[#878e9a]">Version</p>
              <p className="text-sm text-white font-medium">v{script.version || 1}</p>
            </div>
          </div>

          {/* Performance Metrics */}
          {script.performanceMetrics && (
            <div className="bg-[#151920] rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Performance</h4>
              <PerformanceMetrics metrics={script.performanceMetrics} />
            </div>
          )}

          {/* Script Content Preview */}
          {(script.openingLine || script.hook || script.valueProposition) && (
            <div className="space-y-3">
              {script.openingLine && (
                <div className="bg-[#151920] rounded-lg p-3">
                  <p className="text-xs text-[#878e9a] mb-1">Opening</p>
                  <p className="text-sm text-white">{script.openingLine}</p>
                </div>
              )}
              {script.hook && (
                <div className="bg-[#151920] rounded-lg p-3">
                  <p className="text-xs text-[#878e9a] mb-1">Hook</p>
                  <p className="text-sm text-white">{script.hook}</p>
                </div>
              )}
              {script.valueProposition && (
                <div className="bg-[#151920] rounded-lg p-3">
                  <p className="text-xs text-[#878e9a] mb-1">Value Proposition</p>
                  <p className="text-sm text-white">{script.valueProposition}</p>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {(script.tags?.length || 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {(script.tags || []).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/20 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button onClick={onClone} className="flex items-center gap-2 px-4 py-2 bg-[#1a1d21] hover:bg-[#21262d] text-white rounded-lg text-sm">
            <Copy className="w-4 h-4" /> Clone
          </button>
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