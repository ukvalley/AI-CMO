/**
 * Testimonials Management Module
 *
 * Comprehensive social proof management system with:
 * - Multiple testimonial types
 * - Entity mapping (products, founders, employees)
 * - Quality scoring
 * - Approval workflows
 * - Collection frameworks
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessageSquare, Search, Plus, Filter, Download, Upload, Sparkles,
  ChevronDown, ChevronRight, X, Check, AlertCircle, Edit3, Trash2,
  Star, Eye, ThumbsUp, User, Building, Briefcase, Video, Image,
  FileText, Link, Globe, Lock, Users, Bot, Award, TrendingUp,
  Clock, CheckCircle, XCircle, Archive, Play, ExternalLink,
  Mail, Phone, MapPin, Linkedin, Tag, Calendar, MoreVertical,
  FileJson, FileSpreadsheet, Copy, Layers, MessageCircle,
} from 'lucide-react';
import { useAuthStore, useCompanyStore } from '@/stores';
import { testimonialApi, productApi, founderApi, employeeApi } from '@/services/api';
import type {
  Testimonial, TestimonialType, TestimonialStatus,
  CollectionMethod, AuthorityLevel, DetailDepth,
} from '@/types/entities';

// ============================================
// CONSTANTS
// ============================================

const TESTIMONIAL_TYPES: { value: TestimonialType; label: string; icon: React.ReactNode }[] = [
  { value: 'text', label: 'Text', icon: <FileText className="w-4 h-4" /> },
  { value: 'video', label: 'Video', icon: <Video className="w-4 h-4" /> },
  { value: 'audio', label: 'Audio', icon: <Play className="w-4 h-4" /> },
  { value: 'image', label: 'Image', icon: <Image className="w-4 h-4" /> },
  { value: 'screenshot', label: 'Screenshot', icon: <Image className="w-4 h-4" /> },
  { value: 'social-media', label: 'Social Media', icon: <Globe className="w-4 h-4" /> },
  { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" /> },
  { value: 'linkedin-recommendation', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
  { value: 'google-review', label: 'Google Review', icon: <Star className="w-4 h-4" /> },
  { value: 'case-study', label: 'Case Study', icon: <Briefcase className="w-4 h-4" /> },
];

const TESTIMONIAL_STATUSES: { value: TestimonialStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { value: 'approved', label: 'Approved', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { value: 'featured', label: 'Featured', color: 'bg-[#C8FF2E]/20 text-[#C8FF2E] border-[#C8FF2E]/30' },
  { value: 'archived', label: 'Archived', color: 'bg-[#686f7e]/20 text-[#878e9a] border-[#686f7e]/30' },
];

const AUTHORITY_LEVELS: { value: AuthorityLevel; label: string }[] = [
  { value: 'executive', label: 'Executive (C-Level)' },
  { value: 'manager', label: 'Manager' },
  { value: 'specialist', label: 'Specialist' },
  { value: 'individual', label: 'Individual Contributor' },
];

const COLLECTION_METHODS: { value: CollectionMethod; label: string }[] = [
  { value: 'form', label: 'Form Submission' },
  { value: 'email', label: 'Email' },
  { value: 'interview', label: 'Interview' },
  { value: 'imported', label: 'Imported' },
];

const DETAIL_DEPTHS: { value: DetailDepth; label: string }[] = [
  { value: 'brief', label: 'Brief' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'comprehensive', label: 'Comprehensive' },
];

type TabId = 'all' | 'pending' | 'approved' | 'featured' | 'archived' | 'collection' | 'export';

const TABS: { id: TabId; label: string; status?: TestimonialStatus; icon?: React.ReactNode }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending Review', status: 'pending' },
  { id: 'approved', label: 'Approved', status: 'approved' },
  { id: 'featured', label: 'Featured', status: 'featured' },
  { id: 'archived', label: 'Archived', status: 'archived' },
  { id: 'collection', label: 'Collection', icon: <MessageCircle className="w-4 h-4" /> },
  { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" /> },
];

// Collection framework question templates
const COLLECTION_FRAMEWORK_QUESTIONS = [
  { id: 'problem', question: 'What problem or challenge were you facing before?', category: 'before' },
  { id: 'challenges', question: 'What specific challenges did you experience?', category: 'before' },
  { id: 'tried_before', question: 'What solutions had you tried before?', category: 'before' },
  { id: 'why_choose', question: 'Why did you choose our product/service?', category: 'during' },
  { id: 'experience', question: 'What stood out during your experience?', category: 'during' },
  { id: 'support', question: 'How was the support you received?', category: 'during' },
  { id: 'results', question: 'What results did you achieve?', category: 'after' },
  { id: 'metrics', question: 'Can you share any specific metrics or numbers?', category: 'after' },
  { id: 'changed', question: 'What changed after using our solution?', category: 'after' },
  { id: 'recommend', question: 'Would you recommend us? Why?', category: 'after' },
  { id: 'feeling', question: 'How do you feel now compared to before?', category: 'emotional' },
  { id: 'advice', question: 'What would you say to others considering us?', category: 'emotional' },
];

const DEFAULT_TESTIMONIAL: Partial<Testimonial> = {
  customerName: '',
  type: 'text',
  status: 'pending',
  contactPermission: false,
  isPublic: true,
  marketingUsagePermission: false,
  consentVerified: false,
  language: 'en',
  productIds: [],
  serviceIds: [],
  founderIds: [],
  employeeIds: [],
  campaignTags: [],
  audienceTags: [],
  industryTags: [],
  imageUrls: [],
  documentUrls: [],
  keyResults: [],
  revisionNotes: [],
  collectionQuestions: [],
  translations: [],
};

const inputClass = 'w-full bg-[#1a1d21] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50';
const selectClass = 'w-full bg-[#1a1d21] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50';

// ============================================
// HELPER COMPONENTS
// ============================================

function StatusBadge({ status }: { status: TestimonialStatus }) {
  const config = TESTIMONIAL_STATUSES.find((s) => s.value === status) || TESTIMONIAL_STATUSES[0];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
}

function TypeBadge({ type }: { type: TestimonialType }) {
  const config = TESTIMONIAL_TYPES.find((t) => t.value === type);
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#1a1d21] text-[#afb6c4] border border-white/10">
      {config?.icon}
      {config?.label || type}
    </span>
  );
}

function ScoreIndicator({ label, score }: { label: string; score?: number }) {
  const value = score ?? 0;
  const color = value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : value >= 40 ? 'bg-orange-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#878e9a]">{label}</span>
      <div className="flex-1 h-1.5 bg-[#1a1d21] rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-white font-medium w-6 text-right">{value}</span>
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

export default function TestimonialsModule() {
  const user = useAuthStore(s => s.user);
  const storeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [founders, setFounders] = useState<{ id: string; name: string }[]>([]);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TestimonialType | ''>('');
  const [filterAuthority, setFilterAuthority] = useState<AuthorityLevel | ''>('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [viewingItem, setViewingItem] = useState<Testimonial | null>(null);

  // Load data
  const loadData = useCallback(async () => {
    if (!companyId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeTab !== 'all' && TABS.find(t => t.id === activeTab)?.status) {
        params.status = TABS.find(t => t.id === activeTab)?.status || '';
      }
      if (filterType) params.type = filterType;
      if (searchQuery) params.search = searchQuery;

      const [testimonialsRes, productsRes, foundersRes, employeesRes] = await Promise.all([
        testimonialApi.getAll(companyId, Object.keys(params).length > 0 ? params : undefined),
        productApi.getAll(companyId).catch(() => ({ data: [] })),
        founderApi.getAll(companyId).catch(() => ({ data: [] })),
        employeeApi.getAll(companyId).catch(() => ({ data: [] })),
      ]);

      if (testimonialsRes.data) {
        setTestimonials(Array.isArray(testimonialsRes.data) ? testimonialsRes.data : []);
      }
      if (productsRes.data) setProducts((productsRes.data as any[]).map(p => ({ id: p.id, name: p.name || p.productName || 'Unknown' })));
      if (foundersRes.data) setFounders((foundersRes.data as any[]).map(f => ({ id: f.id, name: f.name || 'Unknown' })));
      if (employeesRes.data) setEmployees((employeesRes.data as any[]).map(e => ({ id: e.id, name: e.name || 'Unknown' })));
    } catch (err) {
      console.error('Failed to load data:', err);
    }
    setIsLoading(false);
  }, [companyId, activeTab, filterType, searchQuery]);

  useEffect(() => { loadData(); }, [loadData]);

  // Filtered testimonials
  const filteredTestimonials = useMemo(() => {
    let result = [...testimonials];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) =>
        (t.customerName || '').toLowerCase().includes(q) ||
        (t.customerCompany || '').toLowerCase().includes(q) ||
        (t.headline || '').toLowerCase().includes(q) ||
        (t.shortQuote || '').toLowerCase().includes(q) ||
        (t.fullTestimonial || '').toLowerCase().includes(q)
      );
    }
    if (filterType) {
      result = result.filter((t) => t.type === filterType);
    }
    if (filterAuthority) {
      result = result.filter((t) => t.authorityLevel === filterAuthority);
    }
    return result;
  }, [testimonials, searchQuery, filterType, filterAuthority]);

  // Stats
  const stats = useMemo(() => ({
    total: testimonials.length,
    pending: testimonials.filter((t) => t.status === 'pending').length,
    approved: testimonials.filter((t) => t.status === 'approved').length,
    featured: testimonials.filter((t) => t.status === 'featured').length,
    withConsent: testimonials.filter((t) => t.consentVerified).length,
    avgTrustScore: testimonials.reduce((sum, t) => sum + (t.trustScore || 0), 0) / (testimonials.length || 1),
  }), [testimonials]);

  // CRUD handlers
  const handleCreate = async (data: Partial<Testimonial>) => {
    if (!companyId) return;
    console.log('handleCreate called with:', data);
    try {
      const res = await testimonialApi.create({ ...data, companyId });
      console.log('Create response:', res);
      console.log('res.data:', res.data);
      console.log('res.error:', res.error);
      console.log('res.status:', res.status);

      if (res.data) {
        // Add the new testimonial to the list directly
        const newTestimonial = res.data as Testimonial;
        console.log('Adding testimonial to state:', newTestimonial);
        setTestimonials(prev => [newTestimonial, ...prev]);
        setShowCreateModal(false);
        console.log('State updated, modal closed');
      } else if (res.error) {
        console.error('Create error:', res.error);
        alert('Failed to create testimonial: ' + res.error);
      } else {
        console.error('No data and no error in response');
        alert('Unexpected response from server');
      }
    } catch (err) {
      console.error('Create failed:', err);
      alert('Failed to create testimonial');
    }
  };

  const handleUpdate = async (id: string, data: Partial<Testimonial>) => {
    try {
      const res = await testimonialApi.update(id, data);
      if (res.data) {
        // Update the testimonial in the list directly
        setTestimonials(prev => prev.map(t => t.id === id ? (res.data as Testimonial) : t));
        setEditingItem(null);
      } else if (res.error) {
        console.error('Update error:', res.error);
        alert('Failed to update testimonial: ' + res.error);
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await testimonialApi.delete(id);
      if (!res.error) {
        // Remove the testimonial from the list directly
        setTestimonials(prev => prev.filter(t => t.id !== id));
        setViewingItem(null);
      } else {
        console.error('Delete error:', res.error);
        alert('Failed to delete testimonial: ' + res.error);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete testimonial');
    }
  };

  const handleBulkUpdateStatus = async (status: TestimonialStatus) => {
    if (selectedItems.size === 0) return;
    await testimonialApi.bulkUpdate(Array.from(selectedItems), { status });
    setSelectedItems(new Set());
    await loadData();
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Delete ${selectedItems.size} testimonials?`)) return;
    // Delete one by one since there's no bulk delete endpoint
    for (const id of Array.from(selectedItems)) {
      await testimonialApi.delete(id);
    }
    setSelectedItems(new Set());
    await loadData();
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#878e9a]">Please select a company to view testimonials.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#C8FF2E] to-[#b3e62e] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C8FF2E]/20">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Testimonials</h1>
            <p className="text-sm text-[#878e9a]">Social proof & customer success management</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-[#878e9a]">Total</p>
        </div>
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          <p className="text-xs text-[#878e9a]">Pending</p>
        </div>
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
          <p className="text-xs text-[#878e9a]">Approved</p>
        </div>
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-[#C8FF2E]">{stats.featured}</p>
          <p className="text-xs text-[#878e9a]">Featured</p>
        </div>
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-blue-400">{stats.withConsent}</p>
          <p className="text-xs text-[#878e9a]">With Consent</p>
        </div>
        <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <p className="text-2xl font-bold text-white">{Math.round(stats.avgTrustScore)}</p>
          <p className="text-xs text-[#878e9a]">Avg Trust Score</p>
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
            {tab.label}
            {tab.status && (
              <span className="px-1.5 py-0.5 text-xs bg-[#1a1d21] rounded">
                {testimonials.filter((t) => t.status === tab.status).length}
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
            placeholder="Search by name, company, quote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-10`}
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as TestimonialType | '')} className={selectClass + ' w-40'}>
          <option value="">All Types</option>
          {TESTIMONIAL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select value={filterAuthority} onChange={(e) => setFilterAuthority(e.target.value as AuthorityLevel | '')} className={selectClass + ' w-44'}>
          <option value="">All Levels</option>
          {AUTHORITY_LEVELS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
      </div>

      {/* Bulk Actions Bar */}
      {selectedItems.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 rounded-lg">
          <span className="text-sm text-[#C8FF2E] font-medium">{selectedItems.size} selected</span>
          <button onClick={() => handleBulkUpdateStatus('approved')} className="px-3 py-1 text-xs bg-green-500/20 text-green-300 rounded hover:bg-green-500/30">Approve</button>
          <button onClick={() => handleBulkUpdateStatus('featured')} className="px-3 py-1 text-xs bg-[#C8FF2E]/20 text-[#C8FF2E] rounded hover:bg-[#C8FF2E]/30">Feature</button>
          <button onClick={() => handleBulkUpdateStatus('archived')} className="px-3 py-1 text-xs bg-[#1a1d21] text-[#878e9a] rounded hover:bg-[#21262d]">Archive</button>
          <button onClick={handleBulkDelete} className="px-3 py-1 text-xs bg-red-500/20 text-red-300 rounded hover:bg-red-500/30">Delete</button>
          <button onClick={() => setSelectedItems(new Set())} className="ml-auto text-xs text-[#878e9a] hover:text-white">Clear</button>
        </div>
      )}

      {/* Testimonials List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8FF2E]"></div>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <MessageSquare className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a] mb-2">No testimonials found</p>
          <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm">
            Add Your First Testimonial
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header Row */}
          <div className="flex items-center gap-3 px-4 py-2 text-xs text-[#878e9a]">
            <input type="checkbox" className="rounded border-white/20" />
            <span className="w-20">Type</span>
            <span className="flex-1">Customer / Quote</span>
            <span className="w-28">Company</span>
            <span className="w-24">Status</span>
            <span className="w-16">Score</span>
            <span className="w-28">Actions</span>
          </div>
          {filteredTestimonials.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 px-4 py-3 bg-[#151920] hover:bg-[#1a1d21] rounded-lg border border-white/10/50 hover:border-white/20 transition-colors cursor-pointer"
              onClick={() => setViewingItem(t)}
            >
              <input
                type="checkbox"
                checked={selectedItems.has(t.id)}
                onChange={(e) => { e.stopPropagation(); const next = new Set(selectedItems); if (next.has(t.id)) next.delete(t.id); else next.add(t.id); setSelectedItems(next); }}
                className="rounded border-white/20"
              />
              <TypeBadge type={t.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{t.customerName || 'Unknown'}</p>
                <p className="text-xs text-[#878e9a] truncate">{t.headline || t.shortQuote || 'No quote'}</p>
              </div>
              <span className="w-28 text-xs text-[#878e9a] truncate">{t.customerCompany || '-'}</span>
              <StatusBadge status={t.status} />
              <div className="w-16 text-center">
                <span className="text-xs font-medium text-white">{t.trustScore || 0}</span>
              </div>
              <div className="w-28 flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); setEditingItem(t); }} className="p-1.5 hover:bg-[#1a1d21] rounded text-[#878e9a] hover:text-white">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} className="p-1.5 hover:bg-[#1a1d21] rounded text-[#878e9a] hover:text-red-400">
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

      {/* Collection Framework Tab */}
      {activeTab === 'collection' && (
        <CollectionFrameworkTab
          companyId={companyId}
          onCreateFromFramework={(data) => handleCreate(data)}
        />
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <ExportTab testimonials={testimonials} />
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingItem) && (
        <TestimonialModal
          testimonial={editingItem}
          companyId={companyId}
          products={products}
          founders={founders}
          employees={employees}
          onClose={() => { setShowCreateModal(false); setEditingItem(null); }}
          onSave={editingItem ? ((id: string, data: any) => handleUpdate(id, data)) : ((data: any) => handleCreate(data))}
        />
      )}

      {/* View Detail Modal */}
      {viewingItem && (
        <TestimonialDetailModal
          testimonial={viewingItem}
          onClose={() => setViewingItem(null)}
          onEdit={() => { setEditingItem(viewingItem); setViewingItem(null); }}
          onDelete={() => handleDelete(viewingItem.id)}
        />
      )}
    </div>
  );
}

// ============================================
// TESTIMONIAL CREATE/EDIT MODAL
// ============================================

function TestimonialModal({
  testimonial, companyId, products, founders, employees, onClose, onSave,
}: {
  testimonial: Testimonial | null;
  companyId: string;
  products: { id: string; name: string }[];
  founders: { id: string; name: string }[];
  employees: { id: string; name: string }[];
  onClose: () => void;
  onSave: ((id: string, data: Partial<Testimonial>) => void) | ((data: Partial<Testimonial>) => void);
}) {
  const isEdit = !!testimonial;
  const [form, setForm] = useState<Partial<Testimonial>>(testimonial ? { ...testimonial } : { ...DEFAULT_TESTIMONIAL });
  const [activeSection, setActiveSection] = useState<string>('customer');
  const [tagInput, setTagInput] = useState('');

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = (field: 'campaignTags' | 'audienceTags' | 'industryTags') => {
    if (tagInput.trim()) {
      const tags = [...(form[field] || []), tagInput.trim()];
      updateField(field, tags);
      setTagInput('');
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!form.customerName) {
      alert('Customer name is required');
      return;
    }
    setIsSaving(true);
    try {
      if (isEdit && testimonial) {
        await (onSave as (id: string, data: Partial<Testimonial>) => Promise<void>)(testimonial.id, form);
      } else {
        await (onSave as (data: Partial<Testimonial>) => Promise<void>)({ ...form, companyId });
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'customer', label: 'Customer Info', icon: <User className="w-4 h-4" /> },
    { id: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'transformation', label: 'Transformation', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'mapping', label: 'Entity Mapping', icon: <Tag className="w-4 h-4" /> },
    { id: 'media', label: 'Media', icon: <Video className="w-4 h-4" /> },
    { id: 'scoring', label: 'Quality Score', icon: <Award className="w-4 h-4" /> },
    { id: 'consent', label: 'Consent', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'collection', label: 'Collection', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-10 overflow-y-auto">
      <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-4xl mx-4 mb-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
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
            {activeSection === 'customer' && (
              <div className="space-y-4">
                <SectionHeader title="Customer Information" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Customer Name" required>
                    <input value={form.customerName || ''} onChange={(e) => updateField('customerName', e.target.value)} className={inputClass} placeholder="Full name" />
                  </FormField>
                  <FormField label="Company">
                    <input value={form.customerCompany || ''} onChange={(e) => updateField('customerCompany', e.target.value)} className={inputClass} placeholder="Company name" />
                  </FormField>
                  <FormField label="Designation / Title">
                    <input value={form.customerDesignation || ''} onChange={(e) => updateField('customerDesignation', e.target.value)} className={inputClass} placeholder="e.g., CEO, Marketing Director" />
                  </FormField>
                  <FormField label="Industry">
                    <input value={form.customerIndustry || ''} onChange={(e) => updateField('customerIndustry', e.target.value)} className={inputClass} placeholder="e.g., Technology, Finance" />
                  </FormField>
                  <FormField label="Location">
                    <input value={form.customerLocation || ''} onChange={(e) => updateField('customerLocation', e.target.value)} className={inputClass} placeholder="City, Country" />
                  </FormField>
                  <FormField label="Email">
                    <input type="email" value={form.customerEmail || ''} onChange={(e) => updateField('customerEmail', e.target.value)} className={inputClass} placeholder="email@example.com" />
                  </FormField>
                  <FormField label="Phone">
                    <input type="tel" value={form.customerPhone || ''} onChange={(e) => updateField('customerPhone', e.target.value)} className={inputClass} placeholder="+1 234 567 890" />
                  </FormField>
                  <FormField label="LinkedIn URL">
                    <input type="url" value={form.customerLinkedIn || ''} onChange={(e) => updateField('customerLinkedIn', e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/..." />
                  </FormField>
                  <FormField label="Photo URL" colSpan={2}>
                    <input type="url" value={form.customerPhoto || ''} onChange={(e) => updateField('customerPhoto', e.target.value)} className={inputClass} placeholder="https://..." />
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'content' && (
              <div className="space-y-4">
                <SectionHeader title="Testimonial Content" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Testimonial Type">
                    <select value={form.type || 'text'} onChange={(e) => updateField('type', e.target.value)} className={selectClass}>
                      {TESTIMONIAL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Status">
                    <select value={form.status || 'pending'} onChange={(e) => updateField('status', e.target.value)} className={selectClass}>
                      {TESTIMONIAL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Headline" colSpan={2} helperText="Short attention-grabbing title (max 100 chars)">
                    <input value={form.headline || ''} onChange={(e) => updateField('headline', e.target.value)} className={inputClass} placeholder="e.g., 'Transformed Our Sales Pipeline'" maxLength={100} />
                  </FormField>
                  <FormField label="Short Quote" colSpan={2} helperText="Brief version for social proof (max 300 chars)">
                    <textarea value={form.shortQuote || ''} onChange={(e) => updateField('shortQuote', e.target.value)} className={inputClass + ' min-h-[80px]'} placeholder="Key takeaway in one sentence..." maxLength={300} />
                  </FormField>
                  <FormField label="Full Testimonial" colSpan={2}>
                    <textarea value={form.fullTestimonial || ''} onChange={(e) => updateField('fullTestimonial', e.target.value)} className={inputClass + ' min-h-[150px]'} placeholder="Complete testimonial text..." />
                  </FormField>
                  <FormField label="Story Format" colSpan={2} helperText="Narrative version with emotional arc">
                    <textarea value={form.story || ''} onChange={(e) => updateField('story', e.target.value)} className={inputClass + ' min-h-[120px]'} placeholder="Tell the customer's journey..." />
                  </FormField>
                  <FormField label="Emotional Highlight" colSpan={2}>
                    <input value={form.emotionalHighlight || ''} onChange={(e) => updateField('emotionalHighlight', e.target.value)} className={inputClass} placeholder="Key emotional moment or quote" />
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'transformation' && (
              <div className="space-y-4">
                <SectionHeader title="Before / During / After" />
                <div className="space-y-4">
                  <FormField label="Before - What challenges were they facing?" colSpan={2}>
                    <textarea value={form.beforeState || ''} onChange={(e) => updateField('beforeState', e.target.value)} className={inputClass + ' min-h-[100px]'} placeholder="Describe the problem state..." />
                  </FormField>
                  <FormField label="During - What was their experience?" colSpan={2}>
                    <textarea value={form.duringState || ''} onChange={(e) => updateField('duringState', e.target.value)} className={inputClass + ' min-h-[100px]'} placeholder="Describe the journey..." />
                  </FormField>
                  <FormField label="After - What results did they achieve?" colSpan={2}>
                    <textarea value={form.afterState || ''} onChange={(e) => updateField('afterState', e.target.value)} className={inputClass + ' min-h-[100px]'} placeholder="Describe the outcome..." />
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'mapping' && (
              <div className="space-y-4">
                <SectionHeader title="Entity Mapping" />
                <div className="grid grid-cols-2 gap-4">
                  {/* Products Multi-Select */}
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
                  {/* Founders Multi-Select */}
                  <FormField label="Related Founders">
                    <div className="max-h-32 overflow-y-auto space-y-1 bg-[#1a1d21] rounded-lg p-2">
                      {founders.length === 0 ? (
                        <p className="text-xs text-[#686f7e] p-2">No founders available</p>
                      ) : (
                        founders.map((f) => (
                          <label key={f.id} className="flex items-center gap-2 p-1 hover:bg-[#21262d] rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(form.founderIds || []).includes(f.id)}
                              onChange={(e) => {
                                const ids = e.target.checked
                                  ? [...(form.founderIds || []), f.id]
                                  : (form.founderIds || []).filter(id => id !== f.id);
                                updateField('founderIds', ids);
                              }}
                              className="rounded border-white/20"
                            />
                            <span className="text-sm text-[#afb6c4]">{f.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </FormField>
                  {/* Employees Multi-Select */}
                  <FormField label="Related Employees">
                    <div className="max-h-32 overflow-y-auto space-y-1 bg-[#1a1d21] rounded-lg p-2">
                      {employees.length === 0 ? (
                        <p className="text-xs text-[#686f7e] p-2">No employees available</p>
                      ) : (
                        employees.map((e) => (
                          <label key={e.id} className="flex items-center gap-2 p-1 hover:bg-[#21262d] rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(form.employeeIds || []).includes(e.id)}
                              onChange={(ev) => {
                                const ids = ev.target.checked
                                  ? [...(form.employeeIds || []), e.id]
                                  : (form.employeeIds || []).filter(id => id !== e.id);
                                updateField('employeeIds', ids);
                              }}
                              className="rounded border-white/20"
                            />
                            <span className="text-sm text-[#afb6c4]">{e.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </FormField>
                  {/* Tags */}
                  <FormField label="Campaign Tags">
                    <div className="flex gap-2">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className={inputClass}
                        placeholder="Add tag..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (tagInput.trim()) {
                              updateField('campaignTags', [...(form.campaignTags || []), tagInput.trim()]);
                              setTagInput('');
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (tagInput.trim()) {
                            updateField('campaignTags', [...(form.campaignTags || []), tagInput.trim()]);
                            setTagInput('');
                          }
                        }}
                        className="px-3 py-2 bg-[#1a1d21] hover:bg-[#21262d] text-white rounded-lg text-sm"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(form.campaignTags || []).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/20 rounded text-xs">
                          {tag}
                          <button onClick={() => updateField('campaignTags', (form.campaignTags || []).filter((t) => t !== tag))} className="hover:text-white"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="Industry Tags">
                    <div className="flex gap-2">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className={inputClass}
                        placeholder="Add tag..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (tagInput.trim()) {
                              updateField('industryTags', [...(form.industryTags || []), tagInput.trim()]);
                              setTagInput('');
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (tagInput.trim()) {
                            updateField('industryTags', [...(form.industryTags || []), tagInput.trim()]);
                            setTagInput('');
                          }
                        }}
                        className="px-3 py-2 bg-[#1a1d21] hover:bg-[#21262d] text-white rounded-lg text-sm"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(form.industryTags || []).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                          {tag}
                          <button onClick={() => updateField('industryTags', (form.industryTags || []).filter((t) => t !== tag))} className="hover:text-white"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'media' && (
              <div className="space-y-4">
                <SectionHeader title="Media & Assets" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Video URL">
                    <input type="url" value={form.videoUrl || ''} onChange={(e) => updateField('videoUrl', e.target.value)} className={inputClass} placeholder="https://..." />
                  </FormField>
                  <FormField label="Audio URL">
                    <input type="url" value={form.audioUrl || ''} onChange={(e) => updateField('audioUrl', e.target.value)} className={inputClass} placeholder="https://..." />
                  </FormField>
                  <FormField label="Thumbnail URL">
                    <input type="url" value={form.thumbnailUrl || ''} onChange={(e) => updateField('thumbnailUrl', e.target.value)} className={inputClass} placeholder="https://..." />
                  </FormField>
                  <FormField label="Language">
                    <input value={form.language || 'en'} onChange={(e) => updateField('language', e.target.value)} className={inputClass} placeholder="e.g., en, es, fr" />
                  </FormField>
                  <FormField label="Image URLs" colSpan={2} helperText="Comma-separated URLs">
                    <textarea value={(form.imageUrls || []).join('\n')} onChange={(e) => updateField('imageUrls', e.target.value.split('\n').filter(Boolean))} className={inputClass + ' min-h-[80px]'} placeholder="One URL per line..." />
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'scoring' && (
              <div className="space-y-4">
                <SectionHeader title="Quality Scoring" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Authenticity Score (0-100)">
                    <input type="number" min={0} max={100} value={form.authenticityScore || 0} onChange={(e) => updateField('authenticityScore', parseInt(e.target.value) || 0)} className={inputClass} />
                  </FormField>
                  <FormField label="Emotional Impact (0-100)">
                    <input type="number" min={0} max={100} value={form.emotionalImpactScore || 0} onChange={(e) => updateField('emotionalImpactScore', parseInt(e.target.value) || 0)} className={inputClass} />
                  </FormField>
                  <FormField label="Conversion Potential (0-100)">
                    <input type="number" min={0} max={100} value={form.conversionPotential || 0} onChange={(e) => updateField('conversionPotential', parseInt(e.target.value) || 0)} className={inputClass} />
                  </FormField>
                  <FormField label="Specificity Score (0-100)">
                    <input type="number" min={0} max={100} value={form.specificityScore || 0} onChange={(e) => updateField('specificityScore', parseInt(e.target.value) || 0)} className={inputClass} />
                  </FormField>
                  <FormField label="Trust Score (0-100)">
                    <input type="number" min={0} max={100} value={form.trustScore || 0} onChange={(e) => updateField('trustScore', parseInt(e.target.value) || 0)} className={inputClass} />
                  </FormField>
                  <FormField label="Authority Level">
                    <select value={form.authorityLevel || ''} onChange={(e) => updateField('authorityLevel', e.target.value)} className={selectClass}>
                      <option value="">Not Set</option>
                      {AUTHORITY_LEVELS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Detail Depth">
                    <select value={form.detailDepth || ''} onChange={(e) => updateField('detailDepth', e.target.value)} className={selectClass}>
                      <option value="">Not Set</option>
                      {DETAIL_DEPTHS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'consent' && (
              <div className="space-y-4">
                <SectionHeader title="Consent & Approval" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Consent Verified">
                    <label className="flex items-center gap-2 mt-1">
                      <input type="checkbox" checked={form.consentVerified || false} onChange={(e) => updateField('consentVerified', e.target.checked)} className="rounded border-white/20" />
                      <span className="text-sm text-[#afb6c4]">Customer has given permission</span>
                    </label>
                  </FormField>
                  <FormField label="Consent Document URL">
                    <input type="url" value={form.consentDocumentUrl || ''} onChange={(e) => updateField('consentDocumentUrl', e.target.value)} className={inputClass} placeholder="Link to signed document" />
                  </FormField>
                  <FormField label="Is Public">
                    <label className="flex items-center gap-2 mt-1">
                      <input type="checkbox" checked={form.isPublic !== false} onChange={(e) => updateField('isPublic', e.target.checked)} className="rounded border-white/20" />
                      <span className="text-sm text-[#afb6c4]">Can be displayed publicly</span>
                    </label>
                  </FormField>
                  <FormField label="Marketing Usage Permission">
                    <label className="flex items-center gap-2 mt-1">
                      <input type="checkbox" checked={form.marketingUsagePermission || false} onChange={(e) => updateField('marketingUsagePermission', e.target.checked)} className="rounded border-white/20" />
                      <span className="text-sm text-[#afb6c4]">Can be used in marketing materials</span>
                    </label>
                  </FormField>
                </div>
              </div>
            )}

            {activeSection === 'collection' && (
              <div className="space-y-4">
                <SectionHeader title="Collection Method" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Collection Method">
                    <select value={form.collectionMethod || ''} onChange={(e) => updateField('collectionMethod', e.target.value)} className={selectClass}>
                      <option value="">Not Set</option>
                      {COLLECTION_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Request Sent Date">
                    <input type="date" value={form.requestSentDate ? form.requestSentDate.split('T')[0] : ''} onChange={(e) => updateField('requestSentDate', e.target.value)} className={inputClass} />
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
            {isEdit ? 'Update Testimonial' : 'Create Testimonial'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TESTIMONIAL DETAIL MODAL
// ============================================

function TestimonialDetailModal({
  testimonial, onClose, onEdit, onDelete,
}: {
  testimonial: Testimonial;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-10 overflow-y-auto">
      <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-3xl mx-4 mb-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <TypeBadge type={testimonial.type} />
            <StatusBadge status={testimonial.status} />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1d21] rounded-lg text-[#878e9a] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="flex items-start gap-4">
            {testimonial.customerPhoto ? (
              <img src={testimonial.customerPhoto} alt={testimonial.customerName} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#1a1d21] flex items-center justify-center">
                <User className="w-8 h-8 text-[#686f7e]" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{testimonial.customerName}</h2>
              {testimonial.customerDesignation && (
                <p className="text-sm text-[#878e9a]">{testimonial.customerDesignation}</p>
              )}
              {testimonial.customerCompany && (
                <p className="text-sm text-[#afb6c4]">{testimonial.customerCompany}</p>
              )}
            </div>
          </div>

          {/* Headline */}
          {testimonial.headline && (
            <div className="bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 rounded-lg p-4">
              <p className="text-lg font-semibold text-white">"{testimonial.headline}"</p>
            </div>
          )}

          {/* Quote */}
          {testimonial.shortQuote && (
            <div>
              <p className="text-[#afb6c4] italic">{testimonial.shortQuote}</p>
            </div>
          )}

          {/* Scores */}
          <div className="grid grid-cols-5 gap-3">
            <ScoreIndicator label="Trust" score={testimonial.trustScore} />
            <ScoreIndicator label="Auth" score={testimonial.authenticityScore} />
            <ScoreIndicator label="Impact" score={testimonial.emotionalImpactScore} />
            <ScoreIndicator label="Conv" score={testimonial.conversionPotential} />
            <ScoreIndicator label="Spec" score={testimonial.specificityScore} />
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#151920] rounded-lg p-3">
              <p className="text-xs text-[#878e9a]">Type</p>
              <p className="text-sm text-white">{TESTIMONIAL_TYPES.find(t => t.value === testimonial.type)?.label || testimonial.type}</p>
            </div>
            <div className="bg-[#151920] rounded-lg p-3">
              <p className="text-xs text-[#878e9a]">Authority</p>
              <p className="text-sm text-white">{AUTHORITY_LEVELS.find(a => a.value === testimonial.authorityLevel)?.label || 'Not Set'}</p>
            </div>
            <div className="bg-[#151920] rounded-lg p-3">
              <p className="text-xs text-[#878e9a]">Consent</p>
              <p className="text-sm text-white">{testimonial.consentVerified ? 'Verified' : 'Pending'}</p>
            </div>
          </div>

          {/* Tags */}
          {(testimonial.campaignTags?.length || testimonial.industryTags?.length) ? (
            <div className="flex flex-wrap gap-2">
              {(testimonial.campaignTags || []).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/20 rounded text-xs">{tag}</span>
              ))}
              {(testimonial.industryTags || []).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">{tag}</span>
              ))}
            </div>
          ) : null}
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

// ============================================
// COLLECTION FRAMEWORK TAB
// ============================================

function CollectionFrameworkTab({
  companyId,
  onCreateFromFramework,
}: {
  companyId: string;
  onCreateFromFramework: (data: Partial<Testimonial>) => void;
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerDesignation, setCustomerDesignation] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [testimonialType, setTestimonialType] = useState<TestimonialType>('text');

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const generateTestimonial = () => {
    // Combine answers into a structured testimonial
    const fullTestimonial = Object.entries(answers)
      .filter(([_, answer]) => answer.trim())
      .map(([id, answer]) => {
        const question = COLLECTION_FRAMEWORK_QUESTIONS.find(q => q.id === id);
        return `${question?.question || id}\n${answer}`;
      })
      .join('\n\n');

    const headline = answers.problem
      ? `How ${customerCompany || 'Our Customer'} Overcame ${answers.problem.slice(0, 50)}...`
      : 'Customer Success Story';

    onCreateFromFramework({
      customerName,
      customerEmail,
      customerCompany,
      customerDesignation,
      type: testimonialType,
      headline,
      fullTestimonial,
      beforeState: answers.problem,
      duringState: answers.experience,
      afterState: answers.results,
      status: 'pending',
      consentVerified: false,
      isPublic: true,
      marketingUsagePermission: false,
      contactPermission: true,
    });

    // Reset form
    setCustomerName('');
    setCustomerEmail('');
    setCustomerCompany('');
    setCustomerDesignation('');
    setAnswers({});
  };

  const categories = [
    { id: 'before', label: 'Before', questions: COLLECTION_FRAMEWORK_QUESTIONS.filter(q => q.category === 'before') },
    { id: 'during', label: 'During', questions: COLLECTION_FRAMEWORK_QUESTIONS.filter(q => q.category === 'during') },
    { id: 'after', label: 'After', questions: COLLECTION_FRAMEWORK_QUESTIONS.filter(q => q.category === 'after') },
    { id: 'emotional', label: 'Emotional Impact', questions: COLLECTION_FRAMEWORK_QUESTIONS.filter(q => q.category === 'emotional') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#151920] border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-5 h-5 text-[#C8FF2E]" />
          <h3 className="text-lg font-semibold text-white">Collection Framework</h3>
        </div>
        <p className="text-sm text-[#878e9a] mb-4">
          Use guided questions to collect impactful testimonials. Each section focuses on a different aspect of the customer journey.
        </p>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Customer Name" required>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputClass} placeholder="Full name" />
          </FormField>
          <FormField label="Email">
            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className={inputClass} placeholder="email@example.com" />
          </FormField>
          <FormField label="Company">
            <input value={customerCompany} onChange={(e) => setCustomerCompany(e.target.value)} className={inputClass} placeholder="Company name" />
          </FormField>
          <FormField label="Title/Designation">
            <input value={customerDesignation} onChange={(e) => setCustomerDesignation(e.target.value)} className={inputClass} placeholder="e.g., CEO, Marketing Director" />
          </FormField>
          <FormField label="Testimonial Type">
            <select value={testimonialType} onChange={(e) => setTestimonialType(e.target.value as TestimonialType)} className={selectClass}>
              {TESTIMONIAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </FormField>
        </div>
      </div>

      {/* Question Sections */}
      {categories.map(category => (
        <div key={category.id} className="bg-[#151920] border border-white/10 rounded-xl p-6">
          <h4 className="text-md font-semibold text-white mb-4">{category.label}</h4>
          <div className="space-y-4">
            {category.questions.map(q => (
              <div key={q.id}>
                <label className="block text-sm font-medium text-[#afb6c4] mb-1">{q.question}</label>
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  className={inputClass + ' min-h-[80px]'}
                  placeholder="Customer's response..."
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={generateTestimonial}
          disabled={!customerName}
          className="flex items-center gap-2 px-6 py-3 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-[#0d1117] font-semibold rounded-lg text-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Create Testimonial from Framework
        </button>
        <button
          onClick={() => { setCustomerName(''); setCustomerEmail(''); setCustomerCompany(''); setCustomerDesignation(''); setAnswers({}); }}
          className="px-6 py-3 bg-[#1a1d21] hover:bg-[#21262d] text-white rounded-lg text-sm"
        >
          Clear Form
        </button>
      </div>
    </div>
  );
}

// ============================================
// EXPORT TAB
// ============================================

function ExportTab({ testimonials }: { testimonials: Testimonial[] }) {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'markdown'>('json');

  const handleExport = async (format: 'json' | 'csv' | 'markdown') => {
    setExporting(true);
    try {
      let content: string;
      let mimeType: string;
      let filename: string;

      if (format === 'json') {
        content = JSON.stringify(testimonials, null, 2);
        mimeType = 'application/json';
        filename = 'testimonials.json';
      } else if (format === 'csv') {
        const headers = ['Customer Name', 'Company', 'Type', 'Status', 'Headline', 'Quote', 'Trust Score'];
        const rows = testimonials.map(t => [
          t.customerName || '',
          t.customerCompany || '',
          t.type,
          t.status,
          (t.headline || '').replace(/"/g, '""'),
          (t.shortQuote || '').replace(/"/g, '""'),
          String(t.trustScore || 0),
        ]);
        content = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
        mimeType = 'text/csv';
        filename = 'testimonials.csv';
      } else {
        // Markdown format
        content = testimonials.map(t => {
          const sections = [
            `## ${t.customerName}${t.customerCompany ? ` - ${t.customerCompany}` : ''}`,
            `**Type:** ${TESTIMONIAL_TYPES.find(x => x.value === t.type)?.label || t.type}`,
            `**Status:** ${TESTIMONIAL_STATUSES.find(x => x.value === t.status)?.label || t.status}`,
            t.headline ? `\n> "${t.headline}"\n` : '',
            t.shortQuote ? `\n${t.shortQuote}\n` : '',
            t.fullTestimonial ? `\n${t.fullTestimonial}\n` : '',
            t.trustScore ? `\n**Trust Score:** ${t.trustScore}/100` : '',
            '---',
          ].filter(Boolean).join('\n');
          return sections;
        }).join('\n\n');
        mimeType = 'text/markdown';
        filename = 'testimonials.md';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting(false);
  };

  const exportOptions = [
    { format: 'json' as const, label: 'JSON', icon: <FileJson className="w-8 h-8" />, desc: 'Structured data for APIs and integrations' },
    { format: 'csv' as const, label: 'CSV', icon: <FileSpreadsheet className="w-8 h-8" />, desc: 'Spreadsheet format for analysis' },
    { format: 'markdown' as const, label: 'Markdown', icon: <FileText className="w-8 h-8" />, desc: 'Documentation and website format' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="bg-[#151920] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Export Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{testimonials.length}</p>
            <p className="text-xs text-[#878e9a]">Total Testimonials</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{testimonials.filter(t => t.status === 'approved').length}</p>
            <p className="text-xs text-[#878e9a]">Approved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#C8FF2E]">{testimonials.filter(t => t.status === 'featured').length}</p>
            <p className="text-xs text-[#878e9a]">Featured</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{testimonials.filter(t => t.consentVerified).length}</p>
            <p className="text-xs text-[#878e9a]">With Consent</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-[#151920] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Export Testimonials</h3>
        <p className="text-sm text-[#878e9a] mb-6">Choose a format to export your {testimonials.length} testimonials.</p>
        <div className="grid grid-cols-3 gap-4">
          {exportOptions.map(opt => (
            <button
              key={opt.format}
              onClick={() => handleExport(opt.format)}
              disabled={exporting || testimonials.length === 0}
              className="flex flex-col items-center gap-3 p-6 bg-[#0d1117]/50 border border-white/10 hover:border-[#C8FF2E]/50 rounded-xl transition-colors disabled:opacity-50"
            >
              <div className="text-[#C8FF2E]">{opt.icon}</div>
              <span className="text-white font-medium">{opt.label}</span>
              <span className="text-xs text-[#878e9a] text-center">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Marketing Assets Preview */}
      <div className="bg-[#151920] border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-[#C8FF2E]" />
          <h3 className="text-lg font-semibold text-white">Marketing-Ready Assets</h3>
        </div>
        <p className="text-sm text-[#878e9a] mb-4">
          Featured testimonials ready for marketing use:
        </p>
        <div className="space-y-2">
          {testimonials.filter(t => t.status === 'featured').slice(0, 3).map(t => (
            <div key={t.id} className="bg-[#0d1117]/50 border border-white/10 rounded-lg p-3">
              <p className="text-sm text-white font-medium">{t.customerName}</p>
              <p className="text-xs text-[#afb6c4] truncate">{t.headline || t.shortQuote || 'No headline'}</p>
            </div>
          ))}
          {testimonials.filter(t => t.status === 'featured').length === 0 && (
            <p className="text-sm text-[#686f7e]">No featured testimonials. Mark testimonials as "Featured" to see them here.</p>
          )}
        </div>
      </div>
    </div>
  );
}