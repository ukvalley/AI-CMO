/**
 * Sales Collateral Management Module
 *
 * Centralized sales asset library for storing, organizing, categorizing,
 * and managing all sales-related materials.
 * Acts as: Centralized Sales Asset Library + Sales Reference System
 */

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FileStack, Search, Plus, Trash2, ChevronDown, ChevronRight, RefreshCw,
  X, Eye, Star, Download, Filter, Grid, List as ListIcon, Pin,
  ExternalLink, FileText, BookOpen, BarChart3, Package, Users,
  CheckCircle, Clock, Archive, Link, Tag, FolderOpen, Settings,
  TrendingUp, Award, Image, Play, Copy, Upload, Heart,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDataStore, useCompanyStore } from '@/stores';
import {
  salesCollateralApi, collateralCategoryApi,
} from '@/services/api';
import type {
  SalesCollateral, CollateralType, CollateralStatus, CollateralCategory,
  SalesStage, CollateralAccessLevel, CollateralCategoryInfo,
  Product, ICP,
} from '@/types/entities';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const COLLATERAL_TYPE_CONFIG: Record<CollateralType, { label: string; group: string; icon: any }> = {
  'one-pager': { label: 'One Pager', group: 'Documents', icon: FileText },
  brochure: { label: 'Brochure', group: 'Documents', icon: FileText },
  'company-profile': { label: 'Company Profile', group: 'Documents', icon: BookOpen },
  'media-kit': { label: 'Media Kit', group: 'Documents', icon: FileText },
  'case-study': { label: 'Case Study', group: 'Documents', icon: FileText },
  whitepaper: { label: 'Whitepaper', group: 'Documents', icon: FileText },
  datasheet: { label: 'Datasheet', group: 'Documents', icon: BarChart3 },
  proposal: { label: 'Proposal', group: 'Documents', icon: FileText },
  'product-deck': { label: 'Product Deck', group: 'Presentations', icon: FileStack },
  'service-deck': { label: 'Service Deck', group: 'Presentations', icon: FileStack },
  'pricing-sheet': { label: 'Pricing Sheet', group: 'Pricing', icon: BarChart3 },
  'pitch-deck': { label: 'Pitch Deck', group: 'Presentations', icon: FileStack },
  'demo-video': { label: 'Demo Video', group: 'Video', icon: Play },
  'product-demo': { label: 'Product Demo', group: 'Video', icon: Play },
  'feature-document': { label: 'Feature Doc', group: 'Documents', icon: FileText },
  'technical-specification': { label: 'Tech Spec', group: 'Documents', icon: FileText },
  'testimonial-asset': { label: 'Testimonial', group: 'Documents', icon: Star },
  'roi-document': { label: 'ROI Document', group: 'Documents', icon: TrendingUp },
  'comparison-sheet': { label: 'Comparison Sheet', group: 'Pricing', icon: BarChart3 },
  'sales-flyer': { label: 'Sales Flyer', group: 'Documents', icon: FileText },
  portfolio: { label: 'Portfolio', group: 'Presentations', icon: FileStack },
  'client-presentation': { label: 'Client Presentation', group: 'Presentations', icon: FileStack },
  'explainer-video': { label: 'Explainer Video', group: 'Video', icon: Play },
};

const COLLATERAL_CATEGORY_CONFIG: Record<CollateralCategory, { label: string; color: string; icon: any }> = {
  'sales-presentation': { label: 'Sales Presentation', color: 'text-blue-400', icon: FileStack },
  'technical-document': { label: 'Technical Document', color: 'text-cyan-400', icon: FileText },
  'marketing-material': { label: 'Marketing Material', color: 'text-pink-400', icon: Image },
  'client-proposal': { label: 'Client Proposal', color: 'text-green-400', icon: Award },
  pricing: { label: 'Pricing', color: 'text-amber-400', icon: BarChart3 },
  'product-education': { label: 'Product Education', color: 'text-purple-400', icon: BookOpen },
  'demo-material': { label: 'Demo Material', color: 'text-orange-400', icon: Play },
};

const STATUS_CONFIG: Record<CollateralStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  draft: { label: 'Draft', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30', icon: FileText },
  approved: { label: 'Approved', color: 'text-green-400', bgColor: 'bg-green-900/30', icon: CheckCircle },
  archived: { label: 'Archived', color: 'text-slate-400', bgColor: 'bg-slate-800', icon: Archive },
};

const SALES_STAGE_CONFIG: Record<SalesStage, { label: string; description: string }> = {
  awareness: { label: 'Awareness', description: 'Top of funnel — prospect discovers the problem' },
  discovery: { label: 'Discovery', description: 'Prospect explores solutions' },
  qualification: { label: 'Qualification', description: 'Confirm fit and interest' },
  demo: { label: 'Demo', description: 'Product demonstration' },
  proposal: { label: 'Proposal', description: 'Present solution and pricing' },
  negotiation: { label: 'Negotiation', description: 'Terms and objections' },
  closing: { label: 'Closing', description: 'Final decision' },
  retention: { label: 'Retention', description: 'Post-sale relationship' },
};

const ACCESS_CONFIG: Record<CollateralAccessLevel, { label: string; color: string }> = {
  public: { label: 'Public', color: 'text-green-400' },
  team: { label: 'Team Only', color: 'text-blue-400' },
  department: { label: 'Department', color: 'text-purple-400' },
  'manager-only': { label: 'Manager Only', color: 'text-amber-400' },
  'product-specific': { label: 'Product Specific', color: 'text-pink-400' },
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function SalesCollateralModule() {
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
  const collateral = useMemo(() => (getItems('salesCollateral') as SalesCollateral[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const categories = useMemo(() => (getItems('collateralCategories') as CollateralCategoryInfo[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const products = useMemo(() => (getItems('products') as Product[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const icps = useMemo(() => (getItems('icps') as ICP[]) || [], [getItems, dataStore.data, activeCompanyId]);

  // Load from API
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!companyId) { setIsLoading(false); return; }
    const loadFromApi = async () => {
      setIsLoading(true);
      const [collRes, catRes] = await Promise.all([
        salesCollateralApi.getAll(companyId),
        collateralCategoryApi.getAll(companyId),
      ]);
      if (collRes.error) console.error('[SalesCollateral] API load failed for collateral:', collRes.error);
      if (catRes.error) console.error('[SalesCollateral] API load failed for categories:', catRes.error);

      const mergeById = <T extends { id: string }>(local: T[], remote: T[]): T[] => {
        const map = new Map<string, T>();
        local.forEach((item) => map.set(item.id, item));
        remote.forEach((item) => { if (!map.has(item.id)) map.set(item.id, item); });
        return Array.from(map.values());
      };

      if (collRes.data && Array.isArray(collRes.data) && (collRes.data as any[]).length > 0) {
        const local = (getItems('salesCollateral') as SalesCollateral[]) || [];
        dataStore.setItems('salesCollateral', mergeById(local, collRes.data as SalesCollateral[]));
      }
      if (catRes.data && Array.isArray(catRes.data) && (catRes.data as any[]).length > 0) {
        const local = (getItems('collateralCategories') as CollateralCategoryInfo[]) || [];
        dataStore.setItems('collateralCategories', mergeById(local, catRes.data as CollateralCategoryInfo[]));
      }
      setIsLoading(false);
    };
    loadFromApi();
  }, [companyId]);

  // Active state
  const [activeTab, setActiveTab] = useState<'library' | 'categories' | 'upload' | 'linked' | 'favorites' | 'review' | 'export'>('library');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SalesCollateral | null>(null);

  // CRUD handlers
  const handleCreate = useCallback(async (data: Partial<SalesCollateral>) => {
    if (!companyId) return;
    const localId = addItem('salesCollateral', { ...data, companyId } as any);
    const response = await salesCollateralApi.create({ ...data, companyId, id: localId } as any);
    if (response.data && (response.data as any).id && (response.data as any).id !== localId) {
      updateItem('salesCollateral', localId, { id: (response.data as any).id });
    }
  }, [companyId, addItem, updateItem]);

  const handleUpdate = useCallback(async (id: string, updates: Partial<SalesCollateral>) => {
    updateItem('salesCollateral', id, updates);
    await salesCollateralApi.update(id, updates);
  }, [updateItem]);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this collateral?')) {
      deleteItem('salesCollateral', id);
      if (selectedItem?.id === id) setSelectedItem(null);
      await salesCollateralApi.delete(id);
    }
  }, [deleteItem, selectedItem]);

  const handleCreateCategory = useCallback(async (data: Partial<CollateralCategoryInfo>) => {
    if (!companyId) return;
    const localId = addItem('collateralCategories', { ...data, companyId } as any);
    const response = await collateralCategoryApi.create({ ...data, companyId, id: localId } as any);
    if (response.data && (response.data as any).id && (response.data as any).id !== localId) {
      updateItem('collateralCategories', localId, { id: (response.data as any).id });
    }
  }, [companyId, addItem, updateItem]);

  const handleDeleteCategory = useCallback(async (id: string) => {
    if (confirm('Delete this category?')) {
      deleteItem('collateralCategories', id);
      await collateralCategoryApi.delete(id);
    }
  }, [deleteItem]);

  // Guards
  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileStack className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Select a Company</h2>
          <p className="text-slate-400">Please select a company to access Sales Collateral.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading sales collateral...</p>
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
                <FileStack className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Sales Collateral</h1>
                <p className="text-sm text-slate-400">Centralized Sales Asset Library</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">{collateral.length} items</span>
              <button onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" /> Add Collateral
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 flex gap-1 border-t border-slate-800">
          {[
            { id: 'library', label: 'Library', icon: FileStack },
            { id: 'categories', label: 'Categories', icon: FolderOpen },
            { id: 'upload', label: 'Upload', icon: Upload },
            { id: 'linked', label: 'Linked', icon: Link },
            { id: 'favorites', label: 'Favorites', icon: Star },
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
        <div className="max-w-7xl mx-auto">
          {activeTab === 'library' && <LibraryTab collateral={collateral} products={products} onUpdate={handleUpdate} onDelete={handleDelete} onSelect={setSelectedItem} selectedItem={selectedItem} />}
          {activeTab === 'categories' && <CategoriesTab categories={categories} onCreateCategory={handleCreateCategory} onDeleteCategory={handleDeleteCategory} />}
          {activeTab === 'upload' && <UploadTab onCreate={handleCreate} products={products} />}
          {activeTab === 'linked' && <LinkedTab collateral={collateral} products={products} />}
          {activeTab === 'favorites' && <FavoritesTab collateral={collateral} onUpdate={handleUpdate} onDelete={handleDelete} />}
          {activeTab === 'review' && <ReviewTab collateral={collateral} onUpdate={handleUpdate} />}
          {activeTab === 'export' && <ExportTab collateral={collateral} />}
        </div>
      </main>

      {showCreateModal && <CreateCollateralModal onClose={() => setShowCreateModal(false)} onCreate={handleCreate} products={products} />}
    </div>
  );
}

// ============================================
// LIBRARY TAB
// ============================================

function LibraryTab({ collateral, products, onUpdate, onDelete, onSelect, selectedItem }: {
  collateral: SalesCollateral[];
  products: Product[];
  onUpdate: (id: string, updates: Partial<SalesCollateral>) => void;
  onDelete: (id: string) => void;
  onSelect: (item: SalesCollateral | null) => void;
  selectedItem: SalesCollateral | null;
}) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<CollateralType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<CollateralStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<CollateralCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    return collateral.filter((item) => {
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !(item.description || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;
      return true;
    }).sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });
  }, [collateral, search, filterType, filterStatus, filterCategory]);

  const grouped = useMemo(() => {
    const groups: Record<string, SalesCollateral[]> = {};
    filtered.forEach((item) => {
      const group = COLLATERAL_TYPE_CONFIG[item.type]?.group || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  }, [filtered]);

  if (collateral.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileStack className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Collateral Yet</h3>
          <p className="text-slate-400 mb-4">Add your first sales collateral to start building your library.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collateral..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
          <option value="all">All Types</option>
          {Object.entries(COLLATERAL_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
          <option value="all">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
          <option value="all">All Categories</option>
          {Object.entries(COLLATERAL_CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
          <button onClick={() => setViewMode('grid')} className={cn('p-1.5 rounded', viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-300')}>
            <Grid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={cn('p-1.5 rounded', viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-300')}>
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-slate-400">{filtered.length} of {collateral.length} items</div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-sm font-medium text-slate-400 mb-3">{group}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => {
                  const typeConf = COLLATERAL_TYPE_CONFIG[item.type];
                  const statusConf = STATUS_CONFIG[item.status];
                  const Icon = typeConf?.icon || FileText;
                  return (
                    <div key={item.id}
                      onClick={() => onSelect(selectedItem?.id === item.id ? null : item)}
                      className={cn('bg-slate-800/50 border rounded-xl p-4 cursor-pointer transition-all hover:border-primary-500/50',
                        selectedItem?.id === item.id ? 'border-primary-500' : 'border-slate-700')}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-slate-400" />
                          <span className={cn('px-2 py-0.5 text-xs rounded-full', statusConf?.bgColor, statusConf?.color)}>{statusConf?.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.isPinned && <Pin className="w-3.5 h-3.5 text-primary-400" />}
                          {item.isFavorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        </div>
                      </div>
                      <h4 className="text-sm font-medium text-white mb-1 truncate">{item.name}</h4>
                      {item.description && <p className="text-xs text-slate-400 mb-3 line-clamp-2">{item.description}</p>}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500">{typeConf?.label}</span>
                        {item.funnelStage && <span className="text-xs text-slate-500">·</span>}
                        {item.funnelStage && <span className="text-xs text-primary-400">{SALES_STAGE_CONFIG[item.funnelStage]?.label}</span>}
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">{tag}</span>
                          ))}
                          {item.tags.length > 3 && <span className="text-xs text-slate-500">+{item.tags.length - 3}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Stage</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const typeConf = COLLATERAL_TYPE_CONFIG[item.type];
                const statusConf = STATUS_CONFIG[item.status];
                return (
                  <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-800/80 cursor-pointer"
                    onClick={() => onSelect(selectedItem?.id === item.id ? null : item)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.isPinned && <Pin className="w-3.5 h-3.5 text-primary-400" />}
                        {item.isFavorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        <span className="text-sm text-white">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">{typeConf?.label}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 text-xs rounded-full', statusConf?.bgColor, statusConf?.color)}>{statusConf?.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-primary-400">{item.funnelStage ? SALES_STAGE_CONFIG[item.funnelStage]?.label : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onUpdate(item.id, { isFavorite: !item.isFavorite }); }}
                          className="text-slate-400 hover:text-amber-400"><Star className={cn('w-4 h-4', item.isFavorite && 'fill-amber-400 text-amber-400')} /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                          className="text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Item Detail */}
      {selectedItem && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{selectedItem.name}</h3>
              {selectedItem.description && <p className="text-sm text-slate-400 mt-1">{selectedItem.description}</p>}
            </div>
            <button onClick={() => onSelect(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-slate-500">Type:</span> <span className="text-slate-200">{COLLATERAL_TYPE_CONFIG[selectedItem.type]?.label}</span></div>
            <div><span className="text-slate-500">Status:</span> <span className={STATUS_CONFIG[selectedItem.status]?.color}>{STATUS_CONFIG[selectedItem.status]?.label}</span></div>
            <div><span className="text-slate-500">Stage:</span> <span className="text-primary-400">{selectedItem.funnelStage ? SALES_STAGE_CONFIG[selectedItem.funnelStage]?.label : '—'}</span></div>
            <div><span className="text-slate-500">Access:</span> <span className={ACCESS_CONFIG[selectedItem.accessLevel]?.color}>{ACCESS_CONFIG[selectedItem.accessLevel]?.label}</span></div>
            {selectedItem.version && <div><span className="text-slate-500">Version:</span> <span className="text-slate-200">{selectedItem.version}</span></div>}
            {selectedItem.category && <div><span className="text-slate-500">Category:</span> <span className="text-slate-200">{COLLATERAL_CATEGORY_CONFIG[selectedItem.category]?.label}</span></div>}
            {selectedItem.fileName && <div><span className="text-slate-500">File:</span> <span className="text-slate-200">{selectedItem.fileName}</span></div>}
            {(selectedItem.downloadCount ?? 0) > 0 && <div><span className="text-slate-500">Downloads:</span> <span className="text-slate-200">{selectedItem.downloadCount}</span></div>}
          </div>
          {selectedItem.tags && selectedItem.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {selectedItem.tags.map((tag) => <span key={tag} className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">{tag}</span>)}
            </div>
          )}
          {selectedItem.externalLinks && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(selectedItem.externalLinks).filter(([, v]) => v).map(([key, val]) => (
                <a key={key} href={val} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-700 text-primary-400 rounded hover:bg-slate-600">
                  <ExternalLink className="w-3 h-3" />{key.replace('Url', '')}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// CATEGORIES TAB
// ============================================

function CategoriesTab({ categories, onCreateCategory, onDeleteCategory }: {
  categories: CollateralCategoryInfo[];
  onCreateCategory: (data: Partial<CollateralCategoryInfo>) => void;
  onDeleteCategory: (id: string) => void;
}) {
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    onCreateCategory({ name: newName.trim(), description: newDesc.trim() || undefined });
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-medium text-white mb-3">Add Category</h3>
        <div className="flex gap-3">
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name" className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)" className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Categories</h3>
            <p className="text-slate-400">Create categories to organize your collateral.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">{cat.name}</h4>
                  {cat.description && <p className="text-xs text-slate-400 mt-1">{cat.description}</p>}
                  <span className="text-xs text-slate-500 mt-2 block">{cat.collateralCount || 0} items</span>
                </div>
                <button onClick={() => onDeleteCategory(cat.id)} className="text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// LINKED TAB
// ============================================

function LinkedTab({ collateral, products }: { collateral: SalesCollateral[]; products: Product[] }) {
  const linked = useMemo(() => {
    const byProduct: Record<string, SalesCollateral[]> = {};
    const unlinked: SalesCollateral[] = [];
    collateral.forEach((item) => {
      if (item.productIds && item.productIds.length > 0) {
        item.productIds.forEach((pid) => {
          if (!byProduct[pid]) byProduct[pid] = [];
          byProduct[pid].push(item);
        });
      } else {
        unlinked.push(item);
      }
    });
    return { byProduct, unlinked };
  }, [collateral]);

  return (
    <div className="space-y-6">
      {Object.keys(linked.byProduct).length === 0 && linked.unlinked.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Link className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Linked Collateral</h3>
            <p className="text-slate-400">Link collateral to products to see them organized here.</p>
          </div>
        </div>
      ) : (
        <>
          {Object.entries(linked.byProduct).map(([productId, items]) => {
            const product = products.find((p) => p.id === productId);
            return (
              <div key={productId}>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-primary-400" />
                  <h3 className="text-sm font-medium text-white">{product?.name || productId}</h3>
                  <span className="text-xs text-slate-500">{items.length} items</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((item) => {
                    const typeConf = COLLATERAL_TYPE_CONFIG[item.type];
                    const statusConf = STATUS_CONFIG[item.status];
                    const Icon = typeConf?.icon || FileText;
                    return (
                      <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-white truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn('px-1.5 py-0.5 text-xs rounded-full', statusConf?.bgColor, statusConf?.color)}>{statusConf?.label}</span>
                          <span className="text-xs text-slate-500">{typeConf?.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {linked.unlinked.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-medium text-slate-400">Unlinked</h3>
                <span className="text-xs text-slate-500">{linked.unlinked.length} items</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {linked.unlinked.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
                    <span className="text-sm text-slate-300">{item.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{COLLATERAL_TYPE_CONFIG[item.type]?.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// FAVORITES TAB
// ============================================

function FavoritesTab({ collateral, onUpdate, onDelete }: {
  collateral: SalesCollateral[];
  onUpdate: (id: string, updates: Partial<SalesCollateral>) => void;
  onDelete: (id: string) => void;
}) {
  const favorites = useMemo(() => collateral.filter((i) => i.isFavorite || i.isPinned)
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    }), [collateral]);

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Favorites</h3>
          <p className="text-slate-400">Star or pin collateral to see it here for quick access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {favorites.map((item) => {
        const typeConf = COLLATERAL_TYPE_CONFIG[item.type];
        const statusConf = STATUS_CONFIG[item.status];
        const Icon = typeConf?.icon || FileText;
        return (
          <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                {item.isPinned && <Pin className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500">{typeConf?.label}</span>
                <span className={cn('px-2 py-0.5 text-xs rounded-full', statusConf?.bgColor, statusConf?.color)}>{statusConf?.label}</span>
                {item.funnelStage && <span className="text-xs text-primary-400">{SALES_STAGE_CONFIG[item.funnelStage]?.label}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => onUpdate(item.id, { isFavorite: !item.isFavorite })}
                className="text-amber-400 hover:text-amber-300"><Star className={cn('w-4 h-4', item.isFavorite && 'fill-amber-400')} /></button>
              <button onClick={() => onUpdate(item.id, { isPinned: !item.isPinned })}
                className="text-primary-400 hover:text-primary-300"><Pin className={cn('w-4 h-4', item.isPinned && 'fill-primary-400')} /></button>
              <button onClick={() => onDelete(item.id)} className="text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// CREATE COLLATERAL MODAL
// ============================================

function CreateCollateralModal({ onClose, onCreate, products }: {
  onClose: () => void;
  onCreate: (data: Partial<SalesCollateral>) => void;
  products: Product[];
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'one-pager' as CollateralType,
    category: '' as CollateralCategory | '',
    funnelStage: '' as SalesStage | '',
    status: 'draft' as CollateralStatus,
    accessLevel: 'team' as CollateralAccessLevel,
    tags: '',
    industryTags: '',
    fileUrl: '',
    version: '',
    productIds: [] as string[],
    icpIds: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onCreate({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      type: form.type,
      category: form.category || undefined,
      funnelStage: form.funnelStage || undefined,
      status: form.status,
      accessLevel: form.accessLevel,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      industryTags: form.industryTags ? form.industryTags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      fileUrl: form.fileUrl.trim() || undefined,
      version: form.version.trim() || undefined,
      productIds: form.productIds.length > 0 ? form.productIds : undefined,
      icpIds: form.icpIds,
      isFavorite: false,
      isPinned: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Add Collateral</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CollateralType })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(COLLATERAL_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as CollateralCategory | '' })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">None</option>
                {Object.entries(COLLATERAL_CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Sales Stage</label>
              <select value={form.funnelStage} onChange={(e) => setForm({ ...form, funnelStage: e.target.value as SalesStage | '' })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">None</option>
                {Object.entries(SALES_STAGE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CollateralStatus })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Access Level</label>
              <select value={form.accessLevel} onChange={(e) => setForm({ ...form, accessLevel: e.target.value as CollateralAccessLevel })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(ACCESS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Version</label>
              <input type="text" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="e.g. 1.0" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          {products.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Products</label>
              <div className="flex flex-wrap gap-2">
                {products.map((p) => (
                  <button key={p.id} type="button"
                    onClick={() => setForm({ ...form, productIds: form.productIds.includes(p.id) ? form.productIds.filter((id) => id !== p.id) : [...form.productIds, p.id] })}
                    className={cn('px-3 py-1.5 text-sm rounded-lg border transition-colors',
                      form.productIds.includes(p.id) ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g. enterprise, saas, b2b" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">File URL</label>
            <input type="text" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              placeholder="https://..." className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// UPLOAD TAB
// ============================================

function UploadTab({ onCreate, products }: {
  onCreate: (data: Partial<SalesCollateral>) => void;
  products: Product[];
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'one-pager' as CollateralType,
    category: '' as CollateralCategory | '',
    funnelStage: '' as SalesStage | '',
    status: 'draft' as CollateralStatus,
    accessLevel: 'team' as CollateralAccessLevel,
    tags: '',
    industryTags: '',
    fileUrl: '',
    fileName: '',
    version: '',
    productIds: [] as string[],
    icpIds: [] as string[],
    driveUrl: '',
    websiteUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const externalLinks: Record<string, string> = {};
    if (form.driveUrl) externalLinks.driveUrl = form.driveUrl;
    if (form.websiteUrl) externalLinks.websiteUrl = form.websiteUrl;
    onCreate({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      type: form.type,
      category: form.category || undefined,
      funnelStage: form.funnelStage || undefined,
      status: form.status,
      accessLevel: form.accessLevel,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      industryTags: form.industryTags ? form.industryTags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      fileUrl: form.fileUrl.trim() || undefined,
      fileName: form.fileName.trim() || undefined,
      version: form.version.trim() || undefined,
      productIds: form.productIds.length > 0 ? form.productIds : undefined,
      icpIds: form.icpIds,
      externalLinks: Object.keys(externalLinks).length > 0 ? externalLinks as any : undefined,
      isFavorite: false,
      isPinned: false,
    });
    setForm({ name: '', description: '', type: 'one-pager', category: '' as CollateralCategory | '', funnelStage: '' as SalesStage | '', status: 'draft', accessLevel: 'team', tags: '', industryTags: '', fileUrl: '', fileName: '', version: '', productIds: [], icpIds: [], driveUrl: '', websiteUrl: '' });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-white mb-6">Upload New Collateral</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-white">Basic Information</h3>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CollateralType })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(COLLATERAL_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as CollateralCategory | '' })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">None</option>
                {Object.entries(COLLATERAL_CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Sales Stage</label>
              <select value={form.funnelStage} onChange={(e) => setForm({ ...form, funnelStage: e.target.value as SalesStage | '' })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">None</option>
                {Object.entries(SALES_STAGE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CollateralStatus })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Access</label>
              <select value={form.accessLevel} onChange={(e) => setForm({ ...form, accessLevel: e.target.value as CollateralAccessLevel })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(ACCESS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-white">File & Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">File URL</label>
              <input type="text" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                placeholder="https://..." className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">File Name</label>
              <input type="text" value={form.fileName} onChange={(e) => setForm({ ...form, fileName: e.target.value })}
                placeholder="document.pdf" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Drive URL</label>
              <input type="text" value={form.driveUrl} onChange={(e) => setForm({ ...form, driveUrl: e.target.value })}
                placeholder="Google Drive link" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Website URL</label>
              <input type="text" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                placeholder="https://..." className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Version</label>
            <input type="text" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })}
              placeholder="e.g. 1.0" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
        </div>

        {products.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-medium text-white">Product Linking</h3>
            <div className="flex flex-wrap gap-2">
              {products.map((p) => (
                <button key={p.id} type="button"
                  onClick={() => setForm({ ...form, productIds: form.productIds.includes(p.id) ? form.productIds.filter((id) => id !== p.id) : [...form.productIds, p.id] })}
                  className={cn('px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    form.productIds.includes(p.id) ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-white">Tags</h3>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="enterprise, saas, b2b" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Industry Tags (comma-separated)</label>
            <input type="text" value={form.industryTags} onChange={(e) => setForm({ ...form, industryTags: e.target.value })}
              placeholder="healthcare, fintech, education" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
            Upload Collateral
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================
// REVIEW TAB
// ============================================

function ReviewTab({ collateral, onUpdate }: {
  collateral: SalesCollateral[];
  onUpdate: (id: string, updates: Partial<SalesCollateral>) => void;
}) {
  const [filter, setFilter] = useState<'all' | CollateralStatus>('all');
  const draftItems = useMemo(() => collateral.filter((i) => i.status === 'draft'), [collateral]);
  const approvedItems = useMemo(() => collateral.filter((i) => i.status === 'approved'), [collateral]);
  const archivedItems = useMemo(() => collateral.filter((i) => i.status === 'archived'), [collateral]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return collateral;
    return collateral.filter((i) => i.status === filter);
  }, [collateral, filter]);

  const statusCounts = useMemo(() => ({
    all: collateral.length,
    draft: draftItems.length,
    approved: approvedItems.length,
    archived: archivedItems.length,
  }), [collateral, draftItems, approvedItems, archivedItems]);

  const handleApprove = (id: string) => onUpdate(id, { status: 'approved' });
  const handleArchive = (id: string) => onUpdate(id, { status: 'archived' });
  const handleRestore = (id: string) => onUpdate(id, { status: 'draft' });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {(['all', 'draft', 'approved', 'archived'] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn('px-3 py-1.5 text-sm rounded-lg border transition-colors',
              filter === s ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}>
            {s === 'all' ? 'All' : STATUS_CONFIG[s].label} ({statusCounts[s]})
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Items to Review</h3>
            <p className="text-slate-400">Collateral awaiting review will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const typeConf = COLLATERAL_TYPE_CONFIG[item.type];
            const statusConf = STATUS_CONFIG[item.status];
            const Icon = typeConf?.icon || FileText;
            return (
              <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">{typeConf?.label}</span>
                        <span className={cn('px-2 py-0.5 text-xs rounded-full', statusConf?.bgColor, statusConf?.color)}>{statusConf?.label}</span>
                        {item.funnelStage && <span className="text-xs text-primary-400">{SALES_STAGE_CONFIG[item.funnelStage]?.label}</span>}
                        {item.version && <span className="text-xs text-slate-500">v{item.version}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {item.status === 'draft' && (
                      <button onClick={() => handleApprove(item.id)} className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        Approve
                      </button>
                    )}
                    {item.status === 'approved' && (
                      <button onClick={() => handleArchive(item.id)} className="px-3 py-1.5 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">
                        Archive
                      </button>
                    )}
                    {item.status === 'archived' && (
                      <button onClick={() => handleRestore(item.id)} className="px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                        Restore
                      </button>
                    )}
                  </div>
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
// EXPORT TAB
// ============================================

function ExportTab({ collateral }: { collateral: SalesCollateral[] }) {
  const [format, setFormat] = useState<'csv' | 'markdown' | 'json'>('csv');
  const [statusFilter, setStatusFilter] = useState<CollateralStatus | 'all'>('all');

  const exportData = useMemo(() => {
    let items = collateral;
    if (statusFilter !== 'all') items = items.filter((i) => i.status === statusFilter);
    return items;
  }, [collateral, statusFilter]);

  const downloadExport = () => {
    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'csv') {
      const headers = ['Name', 'Type', 'Category', 'Status', 'Stage', 'Access Level', 'Version', 'Tags'];
      const rows = exportData.map((i) => [
        i.name,
        COLLATERAL_TYPE_CONFIG[i.type]?.label || i.type,
        i.category ? COLLATERAL_CATEGORY_CONFIG[i.category]?.label || i.category : '',
        STATUS_CONFIG[i.status]?.label || i.status,
        i.funnelStage ? SALES_STAGE_CONFIG[i.funnelStage]?.label || i.funnelStage : '',
        ACCESS_CONFIG[i.accessLevel]?.label || i.accessLevel,
        i.version || '',
        (i.tags || []).join('; '),
      ].map((v) => `"${v}"`));
      content = [headers.join(','), ...rows].join('\n');
      filename = 'sales-collateral.csv';
      mimeType = 'text/csv';
    } else if (format === 'markdown') {
      const lines = ['# Sales Collateral Index', '', `Total: ${exportData.length} items`, ''];
      const grouped: Record<string, SalesCollateral[]> = {};
      exportData.forEach((i) => {
        const g = COLLATERAL_TYPE_CONFIG[i.type]?.group || 'Other';
        if (!grouped[g]) grouped[g] = [];
        grouped[g].push(i);
      });
      Object.entries(grouped).forEach(([group, items]) => {
        lines.push(`## ${group}`, '');
        lines.push('| Name | Type | Status | Stage | Access |');
        lines.push('|------|------|--------|-------|--------|');
        items.forEach((i) => {
          lines.push(`| ${i.name} | ${COLLATERAL_TYPE_CONFIG[i.type]?.label} | ${STATUS_CONFIG[i.status]?.label} | ${i.funnelStage ? SALES_STAGE_CONFIG[i.funnelStage]?.label : '—'} | ${ACCESS_CONFIG[i.accessLevel]?.label} |`);
        });
        lines.push('');
      });
      content = lines.join('\n');
      filename = 'sales-collateral.md';
      mimeType = 'text/markdown';
    } else {
      content = JSON.stringify(exportData.map((i) => ({
        name: i.name,
        type: COLLATERAL_TYPE_CONFIG[i.type]?.label || i.type,
        category: i.category ? COLLATERAL_CATEGORY_CONFIG[i.category]?.label : undefined,
        status: STATUS_CONFIG[i.status]?.label || i.status,
        stage: i.funnelStage ? SALES_STAGE_CONFIG[i.funnelStage]?.label : undefined,
        accessLevel: ACCESS_CONFIG[i.accessLevel]?.label || i.accessLevel,
        version: i.version,
        tags: i.tags,
        fileUrl: i.fileUrl,
      })), null, 2);
      filename = 'sales-collateral.json';
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Export Collateral</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Format</label>
            <div className="flex gap-2">
              {(['csv', 'markdown', 'json'] as const).map((f) => (
                <button key={f} onClick={() => setFormat(f)}
                  className={cn('px-4 py-2 text-sm rounded-lg border transition-colors',
                    format === f ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Status Filter</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <div className="text-sm text-slate-400 mb-4">
          {exportData.length} items will be exported
        </div>
        <button onClick={downloadExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" /> Download {format.toUpperCase()}
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-sm font-medium text-white mb-3">Preview</h3>
        <div className="max-h-64 overflow-y-auto text-xs text-slate-400 bg-slate-900 rounded-lg p-3 font-mono">
          {format === 'csv' && (
            <table className="w-full">
              <thead><tr className="border-b border-slate-700">
                {['Name', 'Type', 'Status', 'Stage'].map((h) => <th key={h} className="text-left px-2 py-1">{h}</th>)}
              </tr></thead>
              <tbody>
                {exportData.slice(0, 5).map((i) => (
                  <tr key={i.id} className="border-b border-slate-800">
                    <td className="px-2 py-1">{i.name}</td>
                    <td className="px-2 py-1">{COLLATERAL_TYPE_CONFIG[i.type]?.label}</td>
                    <td className="px-2 py-1">{STATUS_CONFIG[i.status]?.label}</td>
                    <td className="px-2 py-1">{i.funnelStage ? SALES_STAGE_CONFIG[i.funnelStage]?.label : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {format === 'markdown' && (
            <pre>{`# Sales Collateral Index\n\nTotal: ${exportData.length} items\n\n| Name | Type | Status |\n|------|------|--------|\n${exportData.slice(0, 3).map((i) => `| ${i.name} | ${COLLATERAL_TYPE_CONFIG[i.type]?.label} | ${STATUS_CONFIG[i.status]?.label} |`).join('\n')}${exportData.length > 3 ? '\n...' : ''}`}</pre>
          )}
          {format === 'json' && (
            <pre>{JSON.stringify(exportData.slice(0, 2).map((i) => ({ name: i.name, type: i.type, status: i.status })), null, 2)}{exportData.length > 2 ? '\n...' : ''}</pre>
          )}
        </div>
      </div>
    </div>
  );
}