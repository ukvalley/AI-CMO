/**
 * Video Content Management Module
 *
 * Centralized Video Knowledge Repository for storing, organizing,
 * categorizing, and managing all company-related videos.
 * Acts as: Business Video Knowledge Repository + Learning Content Operating System
 */

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Video, Search, Plus, Trash2, ChevronDown, ChevronRight, RefreshCw,
  X, Eye, Star, Download, Filter, Grid, List as ListIcon, Pin,
  ExternalLink, FileText, BookOpen, BarChart3, Package, Users,
  CheckCircle, Clock, Archive, Link, Tag, FolderOpen, Settings,
  TrendingUp, Play, Copy, Upload, Heart, Monitor, Layers,
  PlayCircle, ListVideo, GraduationCap, Lock, MessageSquare,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDataStore, useCompanyStore } from '@/stores';
import {
  videoContentApi, videoCategoryApi, videoPlaylistApi,
  productApi, faqApi, blogPostApi,
} from '@/services/api';
import type {
  VideoContent, VideoType, VideoCategory, VideoStatus,
  VideoSource, VideoAccessLevel, WatchStatus,
  LearningPathStatus, VideoCategoryInfo, VideoPlaylist,
  Product, SOP, SalesScript, FAQ, BlogPost,
} from '@/types/entities';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const VIDEO_TYPE_CONFIG: Record<VideoType, { label: string; group: string; icon: any }> = {
  'educational': { label: 'Educational', group: 'Learning', icon: BookOpen },
  'product-demo': { label: 'Product Demo', group: 'Product', icon: Monitor },
  'service-walkthrough': { label: 'Service Walkthrough', group: 'Product', icon: Play },
  'sop-video': { label: 'SOP Video', group: 'Operations', icon: FileText },
  'company-policy': { label: 'Company Policy', group: 'Operations', icon: FileText },
  'hr-training': { label: 'HR Training', group: 'Learning', icon: GraduationCap },
  'technical-tutorial': { label: 'Technical Tutorial', group: 'Learning', icon: BookOpen },
  'sales-training': { label: 'Sales Training', group: 'Learning', icon: TrendingUp },
  'founder-message': { label: 'Founder Message', group: 'Leadership', icon: Video },
  'customer-onboarding': { label: 'Customer Onboarding', group: 'Customer', icon: Users },
  'webinar-recording': { label: 'Webinar Recording', group: 'Learning', icon: Play },
  'team-training': { label: 'Team Training', group: 'Learning', icon: Users },
  'interview': { label: 'Interview', group: 'Leadership', icon: Video },
  'feature-update': { label: 'Feature Update', group: 'Product', icon: Copy },
  'marketing-strategy': { label: 'Marketing Strategy', group: 'Learning', icon: TrendingUp },
  'internal-communication': { label: 'Internal Comms', group: 'Operations', icon: MessageSquare },
  'compliance-training': { label: 'Compliance Training', group: 'Learning', icon: Lock },
  'support-tutorial': { label: 'Support Tutorial', group: 'Customer', icon: Play },
};

const VIDEO_CATEGORY_CONFIG: Record<VideoCategory, { label: string; color: string; icon: any }> = {
  'product-training': { label: 'Product Training', color: 'text-blue-400', icon: Package },
  'service-training': { label: 'Service Training', color: 'text-cyan-400', icon: Play },
  'educational': { label: 'Educational', color: 'text-purple-400', icon: BookOpen },
  'company-policies': { label: 'Company Policies', color: 'text-slate-400', icon: FileText },
  'hr-training': { label: 'HR Training', color: 'text-pink-400', icon: GraduationCap },
  'sop-videos': { label: 'SOP Videos', color: 'text-amber-400', icon: FileText },
  'sales-training': { label: 'Sales Training', color: 'text-green-400', icon: TrendingUp },
  'technical-tutorials': { label: 'Technical Tutorials', color: 'text-cyan-400', icon: BookOpen },
  'customer-support': { label: 'Customer Support', color: 'text-orange-400', icon: Users },
  'founder-sessions': { label: 'Founder Sessions', color: 'text-yellow-400', icon: Video },
  'team-onboarding': { label: 'Team Onboarding', color: 'text-blue-400', icon: Users },
  'compliance': { label: 'Compliance', color: 'text-red-400', icon: Lock },
  'marketing-training': { label: 'Marketing Training', color: 'text-pink-400', icon: TrendingUp },
  'crm-training': { label: 'CRM Training', color: 'text-purple-400', icon: BarChart3 },
  'software-tutorials': { label: 'Software Tutorials', color: 'text-cyan-400', icon: Monitor },
  'internal-meetings': { label: 'Internal Meetings', color: 'text-slate-400', icon: MessageSquare },
  'webinar-recordings': { label: 'Webinar Recordings', color: 'text-indigo-400', icon: Play },
  'client-training': { label: 'Client Training', color: 'text-green-400', icon: Users },
  'knowledge-sharing': { label: 'Knowledge Sharing', color: 'text-amber-400', icon: BookOpen },
};

const STATUS_CONFIG: Record<VideoStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  draft: { label: 'Draft', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30', icon: FileText },
  approved: { label: 'Approved', color: 'text-green-400', bgColor: 'bg-green-900/30', icon: CheckCircle },
  archived: { label: 'Archived', color: 'text-slate-400', bgColor: 'bg-slate-800', icon: Archive },
};

const SOURCE_CONFIG: Record<VideoSource, { label: string; color: string }> = {
  'youtube': { label: 'YouTube', color: 'text-red-400' },
  'vimeo': { label: 'Vimeo', color: 'text-blue-400' },
  'loom': { label: 'Loom', color: 'text-purple-400' },
  'google-drive': { label: 'Google Drive', color: 'text-green-400' },
  'dropbox': { label: 'Dropbox', color: 'text-blue-400' },
  'wistia': { label: 'Wistia', color: 'text-cyan-400' },
  'internal-cdn': { label: 'Internal CDN', color: 'text-slate-400' },
  'other': { label: 'Other', color: 'text-slate-400' },
};

const ACCESS_CONFIG: Record<VideoAccessLevel, { label: string; color: string }> = {
  public: { label: 'Public', color: 'text-green-400' },
  team: { label: 'Team Only', color: 'text-blue-400' },
  department: { label: 'Department', color: 'text-purple-400' },
  'manager-only': { label: 'Manager Only', color: 'text-amber-400' },
  'hr-only': { label: 'HR Only', color: 'text-pink-400' },
};

const WATCH_CONFIG: Record<WatchStatus, { label: string; color: string; bgColor: string }> = {
  unwatched: { label: 'Unwatched', color: 'text-slate-400', bgColor: 'bg-slate-800' },
  'in-progress': { label: 'In Progress', color: 'text-blue-400', bgColor: 'bg-blue-900/30' },
  watched: { label: 'Watched', color: 'text-green-400', bgColor: 'bg-green-900/30' },
  completed: { label: 'Completed', color: 'text-primary-400', bgColor: 'bg-primary-900/30' },
};

const PLAYLIST_TYPE_CONFIG: Record<VideoPlaylist['type'], { label: string; icon: any }> = {
  'playlist': { label: 'Playlist', icon: ListVideo },
  'learning-path': { label: 'Learning Path', icon: GraduationCap },
  'series': { label: 'Series', icon: Layers },
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function VideoContentModule() {
  const companyStore = useCompanyStore();
  const dataStore = useDataStore();
  const { getItems, addItem, updateItem, deleteItem, setActiveCompany, activeCompanyId } = dataStore;

  const companyId = companyStore.activeCompanyId;
  useMemo(() => {
    if (companyId && companyId !== activeCompanyId) {
      setActiveCompany(companyId);
    }
  }, [companyId, activeCompanyId, setActiveCompany]);

  // Data from store - using exact same pattern as working Blog Content OS module
  const videos = useMemo(() => (getItems('videoContent') as VideoContent[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const categories = useMemo(() => (getItems('videoCategories') as VideoCategoryInfo[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const playlists = useMemo(() => (getItems('videoPlaylists') as VideoPlaylist[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const products = useMemo(() => (getItems('products') as Product[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const sops = useMemo(() => (getItems('sops') as SOP[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const salesScripts = useMemo(() => (getItems('salesScripts') as SalesScript[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const faqs = useMemo(() => (getItems('faqs') as FAQ[]) || [], [getItems, dataStore.data, activeCompanyId]);
  const blogPosts = useMemo(() => (getItems('blogPosts') as BlogPost[]) || [], [getItems, dataStore.data, activeCompanyId]);

  // Load from API (gracefully handle missing backend endpoints)
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!companyId) { setIsLoading(false); return; }
    const loadFromApi = async () => {
      const [vidRes, catRes, plRes, prodRes, faqRes, blogRes] = await Promise.all([
        videoContentApi.getAll(companyId).catch(() => ({ error: 'Network error', data: null })),
        videoCategoryApi.getAll(companyId).catch(() => ({ error: 'Network error', data: null })),
        videoPlaylistApi.getAll(companyId).catch(() => ({ error: 'Network error', data: null })),
        productApi.getAll(companyId).catch(() => ({ error: 'Network error', data: null })),
        faqApi.getAll(companyId).catch(() => ({ error: 'Network error', data: null })),
        blogPostApi.getAll(companyId).catch(() => ({ error: 'Network error', data: null })),
      ]);

      const mergeById = <T extends { id: string }>(local: T[], remote: T[]): T[] => {
        const map = new Map<string, T>();
        local.forEach((item) => map.set(item.id, item));
        remote.forEach((item) => { if (!map.has(item.id)) map.set(item.id, item); });
        return Array.from(map.values());
      };

      if (vidRes.data && Array.isArray(vidRes.data) && (vidRes.data as any[]).length > 0) {
        const local = (getItems('videoContent') as VideoContent[]) || [];
        dataStore.setItems('videoContent', mergeById(local, vidRes.data as VideoContent[]));
      }
      if (catRes.data && Array.isArray(catRes.data) && (catRes.data as any[]).length > 0) {
        const local = (getItems('videoCategories') as VideoCategoryInfo[]) || [];
        dataStore.setItems('videoCategories', mergeById(local, catRes.data as VideoCategoryInfo[]));
      }
      if (plRes.data && Array.isArray(plRes.data) && (plRes.data as any[]).length > 0) {
        const local = (getItems('videoPlaylists') as VideoPlaylist[]) || [];
        dataStore.setItems('videoPlaylists', mergeById(local, plRes.data as VideoPlaylist[]));
      }
      // Cross-module data: Products
      if (prodRes.data && Array.isArray(prodRes.data) && (prodRes.data as any[]).length > 0) {
        const local = (getItems('products') as Product[]) || [];
        dataStore.setItems('products', mergeById(local, prodRes.data as Product[]));
      }
      // Cross-module data: FAQs
      if (faqRes.data && Array.isArray(faqRes.data) && (faqRes.data as any[]).length > 0) {
        const local = (getItems('faqs') as FAQ[]) || [];
        dataStore.setItems('faqs', mergeById(local, faqRes.data as FAQ[]));
      }
      // Cross-module data: Blog Posts
      if (blogRes.data && Array.isArray(blogRes.data) && (blogRes.data as any[]).length > 0) {
        const local = (getItems('blogPosts') as BlogPost[]) || [];
        dataStore.setItems('blogPosts', mergeById(local, blogRes.data as BlogPost[]));
      }
      setIsLoading(false);
    };
    loadFromApi();
  }, [companyId]);

  // Active state
  const [activeTab, setActiveTab] = useState<'library' | 'categories' | 'playlists' | 'linked' | 'favorites' | 'watch' | 'review' | 'export'>('library');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);

  // CRUD handlers
  const handleCreate = useCallback(async (data: Partial<VideoContent>) => {
    if (!companyId) return;
    const localId = addItem('videoContent', { ...data, companyId } as any);
    const response = await videoContentApi.create({ ...data, companyId, id: localId } as any);
    if (response.data && (response.data as any).id && (response.data as any).id !== localId) {
      updateItem('videoContent', localId, { id: (response.data as any).id });
    }
  }, [companyId, addItem, updateItem]);

  const handleUpdate = useCallback(async (id: string, updates: Partial<VideoContent>) => {
    updateItem('videoContent', id, updates);
    await videoContentApi.update(id, updates);
  }, [updateItem]);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      deleteItem('videoContent', id);
      if (selectedVideo?.id === id) setSelectedVideo(null);
      await videoContentApi.delete(id);
    }
  }, [deleteItem, selectedVideo]);

  const handleCreateCategory = useCallback(async (data: Partial<VideoCategoryInfo>) => {
    if (!companyId) return;
    const localId = addItem('videoCategories', { ...data, companyId } as any);
    const response = await videoCategoryApi.create({ ...data, companyId, id: localId } as any);
    if (response.data && (response.data as any).id && (response.data as any).id !== localId) {
      updateItem('videoCategories', localId, { id: (response.data as any).id });
    }
  }, [companyId, addItem, updateItem]);

  const handleDeleteCategory = useCallback(async (id: string) => {
    if (confirm('Delete this category?')) {
      deleteItem('videoCategories', id);
      await videoCategoryApi.delete(id);
    }
  }, [deleteItem]);

  const handleCreatePlaylist = useCallback(async (data: Partial<VideoPlaylist>) => {
    if (!companyId) return;
    const localId = addItem('videoPlaylists', { ...data, companyId } as any);
    const response = await videoPlaylistApi.create({ ...data, companyId, id: localId } as any);
    if (response.data && (response.data as any).id && (response.data as any).id !== localId) {
      updateItem('videoPlaylists', localId, { id: (response.data as any).id });
    }
  }, [companyId, addItem, updateItem]);

  // Guards
  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Select a Company</h2>
          <p className="text-slate-400">Please select a company to access Video Content.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading video content...</p>
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
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Video Content</h1>
                <p className="text-sm text-slate-400">Centralized Video Knowledge Repository</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">{videos.length} videos</span>
              <button onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" /> Add Video
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 flex gap-1 border-t border-slate-800">
          {[
            { id: 'library', label: 'Library', icon: Video },
            { id: 'categories', label: 'Categories', icon: FolderOpen },
            { id: 'playlists', label: 'Playlists', icon: ListVideo },
            { id: 'linked', label: 'Linked', icon: Link },
            { id: 'favorites', label: 'Favorites', icon: Star },
            { id: 'watch', label: 'Watch Progress', icon: Clock },
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
          {activeTab === 'library' && <LibraryTab videos={videos} products={products} onUpdate={handleUpdate} onDelete={handleDelete} onSelect={setSelectedVideo} selectedVideo={selectedVideo} />}
          {activeTab === 'categories' && <CategoriesTab categories={categories} onCreateCategory={handleCreateCategory} onDeleteCategory={handleDeleteCategory} />}
          {activeTab === 'playlists' && <PlaylistsTab playlists={playlists} videos={videos} onCreatePlaylist={handleCreatePlaylist} />}
          {activeTab === 'linked' && <LinkedTab videos={videos} products={products} sops={sops} salesScripts={salesScripts} faqs={faqs} blogPosts={blogPosts} />}
          {activeTab === 'favorites' && <FavoritesTab videos={videos} onUpdate={handleUpdate} onDelete={handleDelete} />}
          {activeTab === 'watch' && <WatchProgressTab videos={videos} onUpdate={handleUpdate} />}
          {activeTab === 'review' && <ReviewTab videos={videos} onUpdate={handleUpdate} />}
          {activeTab === 'export' && <ExportTab videos={videos} />}
        </div>
      </main>

      {showCreateModal && <CreateVideoModal onClose={() => setShowCreateModal(false)} onCreate={handleCreate} products={products} sops={sops} salesScripts={salesScripts} faqs={faqs} blogPosts={blogPosts} />}
    </div>
  );
}

// ============================================
// LIBRARY TAB
// ============================================

function LibraryTab({ videos, products, onUpdate, onDelete, onSelect, selectedVideo }: {
  videos: VideoContent[];
  products: Product[];
  onUpdate: (id: string, updates: Partial<VideoContent>) => void;
  onDelete: (id: string) => void;
  onSelect: (item: VideoContent | null) => void;
  selectedVideo: VideoContent | null;
}) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<VideoType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<VideoStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<VideoCategory | 'all'>('all');
  const [filterSource, setFilterSource] = useState<VideoSource | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    return videos.filter((item) => {
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !(item.description || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;
      if (filterSource !== 'all' && item.source !== filterSource) return false;
      return true;
    }).sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });
  }, [videos, search, filterType, filterStatus, filterCategory, filterSource]);

  const grouped = useMemo(() => {
    const groups: Record<string, VideoContent[]> = {};
    filtered.forEach((item) => {
      const group = VIDEO_TYPE_CONFIG[item.type]?.group || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  }, [filtered]);

  const getEmbedUrl = (video: VideoContent) => {
    const url = video.videoUrl;
    if (video.source === 'youtube') {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      if (match) return `https://www.youtube.com/embed/${match[1]}`;
    }
    if (video.source === 'vimeo') {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match) return `https://player.vimeo.com/video/${match[1]}`;
    }
    return url;
  };

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Videos Yet</h3>
          <p className="text-slate-400 mb-4">Add your first video to start building your knowledge library.</p>
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
            placeholder="Search videos..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
          <option value="all">All Types</option>
          {Object.entries(VIDEO_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
          <option value="all">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
          <option value="all">All Categories</option>
          {Object.entries(VIDEO_CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterSource} onChange={(e) => setFilterSource(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
          <option value="all">All Sources</option>
          {Object.entries(SOURCE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
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

      <div className="text-sm text-slate-400">{filtered.length} of {videos.length} videos</div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-sm font-medium text-slate-400 mb-3">{group}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => {
                  const typeConf = VIDEO_TYPE_CONFIG[item.type];
                  const statusConf = STATUS_CONFIG[item.status];
                  const sourceConf = SOURCE_CONFIG[item.source];
                  const watchConf = WATCH_CONFIG[item.watchStatus];
                  const Icon = typeConf?.icon || Video;
                  return (
                    <div key={item.id}
                      onClick={() => onSelect(selectedVideo?.id === item.id ? null : item)}
                      className={cn('bg-slate-800/50 border rounded-xl overflow-hidden cursor-pointer transition-all hover:border-primary-500/50',
                        selectedVideo?.id === item.id ? 'border-primary-500' : 'border-slate-700')}>
                      {/* Thumbnail area */}
                      <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
                        {item.source === 'youtube' ? (
                          <iframe src={getEmbedUrl(item)} className="w-full h-full" allowFullScreen title={item.name} />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <PlayCircle className="w-10 h-10 text-slate-600" />
                            <span className={cn('text-xs', sourceConf?.color)}>{sourceConf?.label}</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className={cn('px-1.5 py-0.5 text-xs rounded-full', statusConf?.bgColor, statusConf?.color)}>{statusConf?.label}</span>
                          <span className={cn('px-1.5 py-0.5 text-xs rounded-full bg-slate-800', watchConf?.color)}>{watchConf?.label}</span>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          {item.isPinned && <Pin className="w-3.5 h-3.5 text-primary-400" />}
                          {item.isFavorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Icon className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-slate-500">{typeConf?.label}</span>
                          {item.duration && <><span className="text-xs text-slate-600">·</span><span className="text-xs text-slate-500">{item.duration}</span></>}
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
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Source</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Watch</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const typeConf = VIDEO_TYPE_CONFIG[item.type];
                const statusConf = STATUS_CONFIG[item.status];
                const sourceConf = SOURCE_CONFIG[item.source];
                const watchConf = WATCH_CONFIG[item.watchStatus];
                return (
                  <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-800/80 cursor-pointer"
                    onClick={() => onSelect(selectedVideo?.id === item.id ? null : item)}>
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
                    <td className="px-4 py-3"><span className={sourceConf?.color}>{sourceConf?.label}</span></td>
                    <td className="px-4 py-3"><span className={cn('text-xs', watchConf?.color)}>{watchConf?.label}</span></td>
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

      {/* Selected Video Detail */}
      {selectedVideo && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{selectedVideo.name}</h3>
              {selectedVideo.description && <p className="text-sm text-slate-400 mt-1">{selectedVideo.description}</p>}
            </div>
            <button onClick={() => onSelect(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          {/* Video Player */}
          {(selectedVideo.source === 'youtube' || selectedVideo.source === 'vimeo') && (
            <div className="mb-4 aspect-video bg-slate-900 rounded-lg overflow-hidden">
              <iframe src={getEmbedUrl(selectedVideo)} className="w-full h-full" allowFullScreen title={selectedVideo.name} />
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-slate-500">Type:</span> <span className="text-slate-200">{VIDEO_TYPE_CONFIG[selectedVideo.type]?.label}</span></div>
            <div><span className="text-slate-500">Status:</span> <span className={STATUS_CONFIG[selectedVideo.status]?.color}>{STATUS_CONFIG[selectedVideo.status]?.label}</span></div>
            <div><span className="text-slate-500">Source:</span> <span className={SOURCE_CONFIG[selectedVideo.source]?.color}>{SOURCE_CONFIG[selectedVideo.source]?.label}</span></div>
            <div><span className="text-slate-500">Access:</span> <span className={ACCESS_CONFIG[selectedVideo.accessLevel]?.color}>{ACCESS_CONFIG[selectedVideo.accessLevel]?.label}</span></div>
            {selectedVideo.category && <div><span className="text-slate-500">Category:</span> <span className="text-slate-200">{VIDEO_CATEGORY_CONFIG[selectedVideo.category]?.label}</span></div>}
            {selectedVideo.duration && <div><span className="text-slate-500">Duration:</span> <span className="text-slate-200">{selectedVideo.duration}</span></div>}
            {selectedVideo.language && <div><span className="text-slate-500">Language:</span> <span className="text-slate-200">{selectedVideo.language}</span></div>}
            {selectedVideo.version && <div><span className="text-slate-500">Version:</span> <span className="text-slate-200">{selectedVideo.version}</span></div>}
          </div>
          {selectedVideo.tags && selectedVideo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {selectedVideo.tags.map((tag) => <span key={tag} className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">{tag}</span>)}
            </div>
          )}
          {selectedVideo.videoUrl && (
            <div className="mt-4">
              <a href={selectedVideo.videoUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300">
                <ExternalLink className="w-4 h-4" /> Open Original Source
              </a>
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
  categories: VideoCategoryInfo[];
  onCreateCategory: (data: Partial<VideoCategoryInfo>) => void;
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
            <p className="text-slate-400">Create categories to organize your videos.</p>
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
                  <span className="text-xs text-slate-500 mt-2 block">{cat.videoCount || 0} videos</span>
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
// PLAYLISTS TAB
// ============================================

function PlaylistsTab({ playlists, videos, onCreatePlaylist }: {
  playlists: VideoPlaylist[];
  videos: VideoContent[];
  onCreatePlaylist: (data: Partial<VideoPlaylist>) => void;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<VideoPlaylist['type']>('playlist');

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreatePlaylist({ name: name.trim(), description: desc.trim() || undefined, type, videoIds: [], status: 'draft', isFavorite: false });
    setName('');
    setDesc('');
    setShowCreate(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> New Playlist
        </button>
      </div>

      {showCreate && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <h3 className="text-sm font-medium text-white mb-3">Create Playlist</h3>
          <div className="space-y-3">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Playlist name"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)" rows={2}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            <select value={type} onChange={(e) => setType(e.target.value as VideoPlaylist['type'])}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
              {Object.entries(PLAYLIST_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">Create</button>
            </div>
          </div>
        </div>
      )}

      {playlists.length === 0 && !showCreate ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ListVideo className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Playlists</h3>
            <p className="text-slate-400">Create playlists and learning paths to organize video content.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((pl) => {
            const plType = PLAYLIST_TYPE_CONFIG[pl.type];
            const PlIcon = plType?.icon || ListVideo;
            const plVideos = pl.videoIds.map((vid) => videos.find((v) => v.id === vid)).filter(Boolean) as VideoContent[];
            return (
              <div key={pl.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <PlIcon className="w-5 h-5 text-primary-400" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{pl.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{plType?.label}</span>
                      <span className="text-xs text-slate-500">{pl.videoIds.length} videos</span>
                    </div>
                  </div>
                </div>
                {pl.description && <p className="text-xs text-slate-400 mb-2">{pl.description}</p>}
                {plVideos.length > 0 && (
                  <div className="space-y-1">
                    {plVideos.slice(0, 3).map((v) => (
                      <div key={v.id} className="flex items-center gap-2 text-xs text-slate-400">
                        <Play className="w-3 h-3" /> {v.name}
                      </div>
                    ))}
                    {plVideos.length > 3 && <span className="text-xs text-slate-500">+{plVideos.length - 3} more</span>}
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
// LINKED TAB
// ============================================

function LinkedTab({ videos, products, sops, salesScripts, faqs, blogPosts }: {
  videos: VideoContent[];
  products: Product[];
  sops: SOP[];
  salesScripts: SalesScript[];
  faqs: FAQ[];
  blogPosts: BlogPost[];
}) {
  const [activeSection, setActiveSection] = useState<string>('products');

  // Group videos by each linked entity type
  const sections = useMemo(() => {
    const byProduct: Record<string, VideoContent[]> = {};
    const bySop: Record<string, VideoContent[]> = {};
    const byFaq: Record<string, VideoContent[]> = {};
    const byScript: Record<string, VideoContent[]> = {};
    const byBlog: Record<string, VideoContent[]> = {};
    const byDepartment: Record<string, VideoContent[]> = {};

    videos.forEach((v) => {
      // Products
      (v.productIds || []).forEach((pid) => {
        if (!byProduct[pid]) byProduct[pid] = [];
        byProduct[pid].push(v);
      });
      // Services (same Product list — services are a type of product)
      (v.serviceIds || []).forEach((sid) => {
        if (!byProduct[sid]) byProduct[sid] = [];
        byProduct[sid].push(v);
      });
      // SOPs
      (v.sopIds || []).forEach((sid) => {
        if (!bySop[sid]) bySop[sid] = [];
        bySop[sid].push(v);
      });
      // FAQs
      (v.linkedData?.faqIds || []).forEach((fid) => {
        if (!byFaq[fid]) byFaq[fid] = [];
        byFaq[fid].push(v);
      });
      // Sales Scripts
      (v.linkedData?.salesScriptIds || []).forEach((ssid) => {
        if (!byScript[ssid]) byScript[ssid] = [];
        byScript[ssid].push(v);
      });
      // Blog Posts
      (v.linkedData?.blogPostIds || []).forEach((bid) => {
        if (!byBlog[bid]) byBlog[bid] = [];
        byBlog[bid].push(v);
      });
      // Department
      if (v.department) {
        if (!byDepartment[v.department]) byDepartment[v.department] = [];
        byDepartment[v.department].push(v);
      }
    });

    return { byProduct, bySop, byFaq, byScript, byBlog, byDepartment };
  }, [videos]);

  const totalLinks = useMemo(() => {
    let count = 0;
    Object.values(sections.byProduct).forEach((arr) => count += arr.length);
    Object.values(sections.bySop).forEach((arr) => count += arr.length);
    Object.values(sections.byFaq).forEach((arr) => count += arr.length);
    Object.values(sections.byScript).forEach((arr) => count += arr.length);
    Object.values(sections.byBlog).forEach((arr) => count += arr.length);
    Object.values(sections.byDepartment).forEach((arr) => count += arr.length);
    return count;
  }, [sections]);

  const renderVideoCard = (v: VideoContent) => {
    const typeConf = VIDEO_TYPE_CONFIG[v.type];
    const Icon = typeConf?.icon || Video;
    return (
      <div key={v.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-white truncate">{v.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{typeConf?.label}</span>
          <span className={cn('text-xs', SOURCE_CONFIG[v.source]?.color)}>{SOURCE_CONFIG[v.source]?.label}</span>
        </div>
      </div>
    );
  };

  const navItems = [
    { id: 'products', label: 'Products', icon: Package, count: Object.keys(sections.byProduct).length },
    { id: 'sops', label: 'SOPs', icon: FileText, count: Object.keys(sections.bySop).length },
    { id: 'faqs', label: 'FAQs', icon: MessageSquare, count: Object.keys(sections.byFaq).length },
    { id: 'scripts', label: 'Sales Scripts', icon: TrendingUp, count: Object.keys(sections.byScript).length },
    { id: 'blogs', label: 'Blog Posts', icon: BookOpen, count: Object.keys(sections.byBlog).length },
    { id: 'departments', label: 'Departments', icon: Users, count: Object.keys(sections.byDepartment).length },
  ];

  if (totalLinks === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Link className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Linked Videos</h3>
          <p className="text-slate-400">Link videos to products, SOPs, FAQs, and other entities to see them organized here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {navItems.filter((n) => n.count > 0).map((item) => {
          const NavIcon = item.icon;
          return (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className={cn('flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors',
                activeSection === item.id ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}>
              <NavIcon className="w-4 h-4" /> {item.label}
              <span className="px-1.5 py-0.5 text-xs bg-slate-700 rounded-full">{item.count}</span>
            </button>
          );
        })}
      </div>

      {/* Products & Services Section */}
      {activeSection === 'products' && (
        <div className="space-y-4">
          {Object.keys(sections.byProduct).length === 0 ? (
            <p className="text-slate-400 text-center py-8">No videos linked to products or services.</p>
          ) : (
            Object.entries(sections.byProduct).map(([entityId, items]) => {
              const product = products.find((p) => p.id === entityId);
              return (
                <div key={entityId} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-5 h-5 text-primary-400" />
                    <h3 className="text-sm font-medium text-white">{product?.name || entityId}</h3>
                    <span className="text-xs text-slate-500">{items.length} video{items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map(renderVideoCard)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SOPs Section */}
      {activeSection === 'sops' && (
        <div className="space-y-4">
          {Object.keys(sections.bySop).length === 0 ? (
            <p className="text-slate-400 text-center py-8">No videos linked to SOPs.</p>
          ) : (
            Object.entries(sections.bySop).map(([entityId, items]) => {
              const sop = sops.find((s) => s.id === entityId);
              return (
                <div key={entityId} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-medium text-white">{sop?.name || entityId}</h3>
                    {sop?.department && <span className="text-xs text-slate-500">· {sop.department}</span>}
                    <span className="text-xs text-slate-500">{items.length} video{items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map(renderVideoCard)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* FAQs Section */}
      {activeSection === 'faqs' && (
        <div className="space-y-4">
          {Object.keys(sections.byFaq).length === 0 ? (
            <p className="text-slate-400 text-center py-8">No videos linked to FAQs.</p>
          ) : (
            Object.entries(sections.byFaq).map(([entityId, items]) => {
              const faq = faqs.find((f) => f.id === entityId);
              return (
                <div key={entityId} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-green-400" />
                    <h3 className="text-sm font-medium text-white">{faq?.question || entityId}</h3>
                    <span className="text-xs text-slate-500">{items.length} video{items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map(renderVideoCard)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Sales Scripts Section */}
      {activeSection === 'scripts' && (
        <div className="space-y-4">
          {Object.keys(sections.byScript).length === 0 ? (
            <p className="text-slate-400 text-center py-8">No videos linked to sales scripts.</p>
          ) : (
            Object.entries(sections.byScript).map(([entityId, items]) => {
              const script = salesScripts.find((s) => s.id === entityId);
              return (
                <div key={entityId} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-medium text-white">{script?.name || entityId}</h3>
                    <span className="text-xs text-slate-500">{items.length} video{items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map(renderVideoCard)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Blog Posts Section */}
      {activeSection === 'blogs' && (
        <div className="space-y-4">
          {Object.keys(sections.byBlog).length === 0 ? (
            <p className="text-slate-400 text-center py-8">No videos linked to blog posts.</p>
          ) : (
            Object.entries(sections.byBlog).map(([entityId, items]) => {
              const blog = blogPosts.find((b) => b.id === entityId);
              return (
                <div key={entityId} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-medium text-white">{blog?.title || entityId}</h3>
                    <span className="text-xs text-slate-500">{items.length} video{items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map(renderVideoCard)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Departments Section */}
      {activeSection === 'departments' && (
        <div className="space-y-4">
          {Object.keys(sections.byDepartment).length === 0 ? (
            <p className="text-slate-400 text-center py-8">No videos linked to departments.</p>
          ) : (
            Object.entries(sections.byDepartment).map(([dept, items]) => (
              <div key={dept} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-medium text-white capitalize">{dept}</h3>
                  <span className="text-xs text-slate-500">{items.length} video{items.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map(renderVideoCard)}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// FAVORITES TAB
// ============================================

function FavoritesTab({ videos, onUpdate, onDelete }: {
  videos: VideoContent[];
  onUpdate: (id: string, updates: Partial<VideoContent>) => void;
  onDelete: (id: string) => void;
}) {
  const favorites = useMemo(() => videos.filter((i) => i.isFavorite || i.isPinned)
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    }), [videos]);

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Favorites</h3>
          <p className="text-slate-400">Star or pin videos to see them here for quick access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {favorites.map((item) => {
        const typeConf = VIDEO_TYPE_CONFIG[item.type];
        const statusConf = STATUS_CONFIG[item.status];
        const Icon = typeConf?.icon || Video;
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
                <span className={cn('text-xs', SOURCE_CONFIG[item.source]?.color)}>{SOURCE_CONFIG[item.source]?.label}</span>
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
// WATCH PROGRESS TAB
// ============================================

function WatchProgressTab({ videos, onUpdate }: {
  videos: VideoContent[];
  onUpdate: (id: string, updates: Partial<VideoContent>) => void;
}) {
  const [filter, setFilter] = useState<WatchStatus | 'all'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return videos;
    return videos.filter((v) => v.watchStatus === filter);
  }, [videos, filter]);

  const counts = useMemo(() => ({
    all: videos.length,
    unwatched: videos.filter((v) => v.watchStatus === 'unwatched').length,
    'in-progress': videos.filter((v) => v.watchStatus === 'in-progress').length,
    watched: videos.filter((v) => v.watchStatus === 'watched').length,
    completed: videos.filter((v) => v.watchStatus === 'completed').length,
  }), [videos]);

  const cycleWatchStatus = (id: string, current: WatchStatus) => {
    const next: Record<WatchStatus, WatchStatus> = { unwatched: 'in-progress', 'in-progress': 'watched', watched: 'completed', completed: 'unwatched' };
    onUpdate(id, { watchStatus: next[current] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {(['all', 'unwatched', 'in-progress', 'watched', 'completed'] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn('px-3 py-1.5 text-sm rounded-lg border transition-colors',
              filter === s ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}>
            {s === 'all' ? 'All' : WATCH_CONFIG[s].label} ({counts[s]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Videos Found</h3>
            <p className="text-slate-400">No videos match this watch status filter.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const watchConf = WATCH_CONFIG[item.watchStatus];
            return (
              <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{VIDEO_TYPE_CONFIG[item.type]?.label}</span>
                    <span className="text-xs text-slate-600">·</span>
                    <span className="text-xs text-slate-500">{SOURCE_CONFIG[item.source]?.label}</span>
                  </div>
                </div>
                <button onClick={() => cycleWatchStatus(item.id, item.watchStatus)}
                  className={cn('px-3 py-1.5 text-xs rounded-full transition-colors', watchConf?.bgColor, watchConf?.color)}>
                  {watchConf?.label}
                </button>
                {item.watchProgress !== undefined && item.watchProgress > 0 && (
                  <div className="w-24 bg-slate-700 rounded-full h-1.5">
                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${Math.min(item.watchProgress, 100)}%` }} />
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
// REVIEW TAB
// ============================================

function ReviewTab({ videos, onUpdate }: {
  videos: VideoContent[];
  onUpdate: (id: string, updates: Partial<VideoContent>) => void;
}) {
  const [filter, setFilter] = useState<'all' | VideoStatus>('all');
  const filtered = useMemo(() => {
    if (filter === 'all') return videos;
    return videos.filter((v) => v.status === filter);
  }, [videos, filter]);

  const counts = useMemo(() => ({
    all: videos.length,
    draft: videos.filter((v) => v.status === 'draft').length,
    approved: videos.filter((v) => v.status === 'approved').length,
    archived: videos.filter((v) => v.status === 'archived').length,
  }), [videos]);

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
            {s === 'all' ? 'All' : STATUS_CONFIG[s].label} ({counts[s]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Videos to Review</h3>
            <p className="text-slate-400">Videos awaiting review will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const typeConf = VIDEO_TYPE_CONFIG[item.type];
            const statusConf = STATUS_CONFIG[item.status];
            const Icon = typeConf?.icon || Video;
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
                        <span className={cn('text-xs', SOURCE_CONFIG[item.source]?.color)}>{SOURCE_CONFIG[item.source]?.label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {item.status === 'draft' && (
                      <button onClick={() => handleApprove(item.id)} className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">Approve</button>
                    )}
                    {item.status === 'approved' && (
                      <button onClick={() => handleArchive(item.id)} className="px-3 py-1.5 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">Archive</button>
                    )}
                    {item.status === 'archived' && (
                      <button onClick={() => handleRestore(item.id)} className="px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">Restore</button>
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

function ExportTab({ videos }: { videos: VideoContent[] }) {
  const [format, setFormat] = useState<'csv' | 'markdown' | 'json'>('csv');
  const [statusFilter, setStatusFilter] = useState<VideoStatus | 'all'>('all');

  const exportData = useMemo(() => {
    if (statusFilter === 'all') return videos;
    return videos.filter((v) => v.status === statusFilter);
  }, [videos, statusFilter]);

  const downloadExport = () => {
    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'csv') {
      const headers = ['Title', 'Type', 'Category', 'Status', 'Source', 'Watch Status', 'Duration', 'Tags'];
      const rows = exportData.map((i) => [
        i.name,
        VIDEO_TYPE_CONFIG[i.type]?.label || i.type,
        i.category ? VIDEO_CATEGORY_CONFIG[i.category]?.label || i.category : '',
        STATUS_CONFIG[i.status]?.label || i.status,
        SOURCE_CONFIG[i.source]?.label || i.source,
        WATCH_CONFIG[i.watchStatus]?.label || i.watchStatus,
        i.duration || '',
        (i.tags || []).join('; '),
      ].map((v) => `"${v}"`));
      content = [headers.join(','), ...rows].join('\n');
      filename = 'video-content.csv';
      mimeType = 'text/csv';
    } else if (format === 'markdown') {
      const lines = ['# Video Content Index', '', `Total: ${exportData.length} videos`, ''];
      const grouped: Record<string, VideoContent[]> = {};
      exportData.forEach((i) => {
        const g = VIDEO_TYPE_CONFIG[i.type]?.group || 'Other';
        if (!grouped[g]) grouped[g] = [];
        grouped[g].push(i);
      });
      Object.entries(grouped).forEach(([group, items]) => {
        lines.push(`## ${group}`, '');
        lines.push('| Title | Type | Status | Source |');
        lines.push('|-------|------|--------|--------|');
        items.forEach((i) => {
          lines.push(`| ${i.name} | ${VIDEO_TYPE_CONFIG[i.type]?.label} | ${STATUS_CONFIG[i.status]?.label} | ${SOURCE_CONFIG[i.source]?.label} |`);
        });
        lines.push('');
      });
      content = lines.join('\n');
      filename = 'video-content.md';
      mimeType = 'text/markdown';
    } else {
      content = JSON.stringify(exportData.map((i) => ({
        name: i.name,
        type: VIDEO_TYPE_CONFIG[i.type]?.label || i.type,
        category: i.category ? VIDEO_CATEGORY_CONFIG[i.category]?.label : undefined,
        status: STATUS_CONFIG[i.status]?.label || i.status,
        source: SOURCE_CONFIG[i.source]?.label || i.source,
        watchStatus: WATCH_CONFIG[i.watchStatus]?.label || i.watchStatus,
        duration: i.duration,
        tags: i.tags,
        videoUrl: i.videoUrl,
      })), null, 2);
      filename = 'video-content.json';
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
        <h3 className="text-lg font-semibold text-white mb-4">Export Videos</h3>
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
        <div className="text-sm text-slate-400 mb-4">{exportData.length} videos will be exported</div>
        <button onClick={downloadExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" /> Download {format.toUpperCase()}
        </button>
      </div>
    </div>
  );
}

// ============================================
// CREATE VIDEO MODAL
// ============================================

function CreateVideoModal({ onClose, onCreate, products, sops, salesScripts, faqs, blogPosts }: {
  onClose: () => void;
  onCreate: (data: Partial<VideoContent>) => void;
  products: Product[];
  sops: SOP[];
  salesScripts: SalesScript[];
  faqs: FAQ[];
  blogPosts: BlogPost[];
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'educational' as VideoType,
    category: '' as VideoCategory | '',
    source: 'youtube' as VideoSource,
    videoUrl: '',
    status: 'draft' as VideoStatus,
    accessLevel: 'team' as VideoAccessLevel,
    watchStatus: 'unwatched' as WatchStatus,
    language: '',
    duration: '',
    version: '',
    tags: '',
    department: '',
    productIds: [] as string[],
    sopIds: [] as string[],
    faqIds: [] as string[],
    salesScriptIds: [] as string[],
    blogPostIds: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.videoUrl.trim()) return;
    onCreate({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      type: form.type,
      category: form.category || undefined,
      source: form.source,
      videoUrl: form.videoUrl.trim(),
      status: form.status,
      accessLevel: form.accessLevel,
      watchStatus: form.watchStatus,
      language: form.language.trim() || undefined,
      duration: form.duration.trim() || undefined,
      version: form.version.trim() || undefined,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      department: form.department.trim() || undefined,
      productIds: form.productIds.length > 0 ? form.productIds : undefined,
      sopIds: form.sopIds.length > 0 ? form.sopIds : undefined,
      linkedData: {
        ...(form.faqIds.length > 0 ? { faqIds: form.faqIds } : {}),
        ...(form.salesScriptIds.length > 0 ? { salesScriptIds: form.salesScriptIds } : {}),
        ...(form.blogPostIds.length > 0 ? { blogPostIds: form.blogPostIds } : {}),
      },
      isFavorite: false,
      isPinned: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Add Video</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Title *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Video URL *</label>
            <input type="text" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..." className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as VideoType })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(VIDEO_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as VideoCategory | '' })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">None</option>
                {Object.entries(VIDEO_CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Source</label>
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as VideoSource })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(SOURCE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as VideoStatus })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Access Level</label>
              <select value={form.accessLevel} onChange={(e) => setForm({ ...form, accessLevel: e.target.value as VideoAccessLevel })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                {Object.entries(ACCESS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Duration</label>
              <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 15:30" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Language</label>
              <input type="text" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
                placeholder="e.g. English" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Version</label>
              <input type="text" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="e.g. 1.0" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Products</label>
            {products.length > 0 ? (
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
            ) : (
              <p className="text-xs text-slate-500 italic">No products available. Add products in the Foundation module first.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">SOPs</label>
            {sops.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sops.map((s) => (
                  <button key={s.id} type="button"
                    onClick={() => setForm({ ...form, sopIds: form.sopIds.includes(s.id) ? form.sopIds.filter((id) => id !== s.id) : [...form.sopIds, s.id] })}
                    className={cn('px-3 py-1.5 text-sm rounded-lg border transition-colors',
                      form.sopIds.includes(s.id) ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}>
                    {s.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No SOPs available. Add SOPs in the Programs module first.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">FAQs</label>
            {faqs.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {faqs.map((f) => (
                  <button key={f.id} type="button"
                    onClick={() => setForm({ ...form, faqIds: form.faqIds.includes(f.id) ? form.faqIds.filter((id) => id !== f.id) : [...form.faqIds, f.id] })}
                    className={cn('px-3 py-1.5 text-sm rounded-lg border transition-colors text-left',
                      form.faqIds.includes(f.id) ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}
                    title={f.question}>
                    {f.question?.length > 30 ? f.question.slice(0, 30) + '...' : f.question}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No FAQs available. Add FAQs in the Content module first.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Sales Scripts</label>
            {salesScripts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {salesScripts.map((s) => (
                  <button key={s.id} type="button"
                    onClick={() => setForm({ ...form, salesScriptIds: form.salesScriptIds.includes(s.id) ? form.salesScriptIds.filter((id) => id !== s.id) : [...form.salesScriptIds, s.id] })}
                    className={cn('px-3 py-1.5 text-sm rounded-lg border transition-colors',
                      form.salesScriptIds.includes(s.id) ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}>
                    {s.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No sales scripts available. Add scripts in the Sales Scripts module first.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Blog Posts</label>
            {blogPosts.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {blogPosts.map((b) => (
                  <button key={b.id} type="button"
                    onClick={() => setForm({ ...form, blogPostIds: form.blogPostIds.includes(b.id) ? form.blogPostIds.filter((id) => id !== b.id) : [...form.blogPostIds, b.id] })}
                    className={cn('px-3 py-1.5 text-sm rounded-lg border transition-colors text-left',
                      form.blogPostIds.includes(b.id) ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300')}
                    title={b.title}>
                    {b.title?.length > 30 ? b.title.slice(0, 30) + '...' : b.title}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No blog posts available. Add posts in the Blog Content module first.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g. training, onboarding, product" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">Add Video</button>
          </div>
        </form>
      </div>
    </div>
  );
}