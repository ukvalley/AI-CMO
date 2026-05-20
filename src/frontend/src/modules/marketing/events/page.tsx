/**
 * Event Management Module
 *
 * Centralised event management with sessions, resources,
 * categories, and AI-powered content generation.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, FolderOpen, Layers, FileText, Plus, Edit3,
  Trash2, Search, ChevronRight, X, Sparkles, Clock, MapPin,
  Users, Video, CheckCircle2, AlertCircle, Globe, Lock,
  ArrowUpDown, Star, Tag, Loader2, Save,
} from 'lucide-react';
import { useAuthStore, useCompanyStore } from '@/stores';
import { useDataStore } from '@/stores/dataStore';
import { eventApi, eventCategoryApi, eventSessionApi, eventResourceApi } from '@/services/api';
import type {
  Event as EventType, EventCategory, EventSession, EventResource,
  EventStatus, EventVisibility, EventPriority, EventMode,
  EventType as EventTypeEnum, EventAudienceType, EventCategoryStatus,
  SessionStatus, ResourceType, ResourceStatus, ApprovalStatus,
} from '@/types/entities';

// ============================================
// AI HELPER FUNCTIONS (direct Ollama GLM call)
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
    headers: { 'Content-Type': 'application/json' },
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
    throw new Error(`AI API error (${response.status}): ${errText}`);
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
// CONSTANTS
// ============================================

const EVENT_STATUSES: { value: EventStatus; label: string; colour: string }[] = [
  { value: 'draft', label: 'Draft', colour: 'bg-[#525662]' },
  { value: 'review', label: 'Review', colour: 'bg-amber-500' },
  { value: 'approved', label: 'Approved', colour: 'bg-blue-500' },
  { value: 'published', label: 'Published', colour: 'bg-green-500' },
  { value: 'archived', label: 'Archived', colour: 'bg-[#686f7e]' },
  { value: 'cancelled', label: 'Cancelled', colour: 'bg-red-500' },
];

const EVENT_TYPES: { value: EventTypeEnum; label: string }[] = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'training', label: 'Training' },
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'campaign_event', label: 'Campaign Event' },
  { value: 'sop_training', label: 'SOP Training' },
  { value: 'team_activity', label: 'Team Activity' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'hr_activity', label: 'HR Activity' },
  { value: 'other', label: 'Other' },
];

const EVENT_MODES: { value: EventMode; label: string }[] = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'hybrid', label: 'Hybrid' },
];

const EVENT_PRIORITIES: { value: EventPriority; label: string; colour: string }[] = [
  { value: 'low', label: 'Low', colour: 'bg-[#525662]' },
  { value: 'medium', label: 'Medium', colour: 'bg-blue-500' },
  { value: 'high', label: 'High', colour: 'bg-amber-500' },
  { value: 'critical', label: 'Critical', colour: 'bg-red-500' },
];

const EVENT_VISIBILITIES: { value: EventVisibility; label: string }[] = [
  { value: 'private', label: 'Private' },
  { value: 'internal', label: 'Internal' },
  { value: 'public', label: 'Public' },
];

const EVENT_AUDIENCES: { value: EventAudienceType; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'internal', label: 'Internal' },
  { value: 'team_specific', label: 'Team Specific' },
  { value: 'department_specific', label: 'Department Specific' },
  { value: 'admin_only', label: 'Admin Only' },
];

const SESSION_STATUSES: { value: SessionStatus; label: string; colour: string }[] = [
  { value: 'draft', label: 'Draft', colour: 'bg-[#525662]' },
  { value: 'review', label: 'Review', colour: 'bg-amber-500' },
  { value: 'approved', label: 'Approved', colour: 'bg-blue-500' },
  { value: 'published', label: 'Published', colour: 'bg-green-500' },
  { value: 'cancelled', label: 'Cancelled', colour: 'bg-red-500' },
];

const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
  { value: 'presentation', label: 'Presentation' },
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'Document' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
  { value: 'image', label: 'Image' },
  { value: 'url', label: 'URL' },
  { value: 'other', label: 'Other' },
];

const CATEGORY_STATUSES: { value: EventCategoryStatus; label: string; colour: string }[] = [
  { value: 'active', label: 'Active', colour: 'bg-green-500' },
  { value: 'archived', label: 'Archived', colour: 'bg-[#686f7e]' },
];

const RESOURCE_STATUSES: { value: ResourceStatus; label: string; colour: string }[] = [
  { value: 'draft', label: 'Draft', colour: 'bg-[#525662]' },
  { value: 'active', label: 'Active', colour: 'bg-green-500' },
  { value: 'archived', label: 'Archived', colour: 'bg-[#686f7e]' },
];

type TabId = 'events' | 'categories' | 'sessions' | 'resources' | 'ai-generate';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
  { id: 'categories', label: 'Categories', icon: <FolderOpen className="w-4 h-4" /> },
  { id: 'sessions', label: 'Sessions', icon: <Layers className="w-4 h-4" /> },
  { id: 'resources', label: 'Resources', icon: <FileText className="w-4 h-4" /> },
  { id: 'ai-generate', label: 'AI Generate', icon: <Sparkles className="w-4 h-4" /> },
];

// ============================================
// HELPERS
// ============================================

const getStatusBadge = (status: string, statuses: { value: string; label: string; colour: string }[]) => {
  const s = statuses.find(st => st.value === status);
  if (!s) return <span className="px-2 py-0.5 rounded text-xs bg-[#525662] text-[#afb6c4]">{status}</span>;
  return <span className={`px-2 py-0.5 rounded text-xs ${s.colour} text-white`}>{s.label}</span>;
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'meeting': return <Users className="w-3.5 h-3.5 text-blue-400" />;
    case 'webinar': return <Video className="w-3.5 h-3.5 text-purple-400" />;
    case 'workshop': return <FileText className="w-3.5 h-3.5 text-green-400" />;
    case 'conference': return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
    case 'training': return <Calendar className="w-3.5 h-3.5 text-amber-400" />;
    default: return <Calendar className="w-3.5 h-3.5 text-[#878e9a]" />;
  }
};

const normalizeResponse = <T,>(res: any): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (res?.data && Array.isArray(res.data)) return res.data as T[];
  return [];
};

const mergeById = <T extends { id: string }>(local: T[], remote: T[]): T[] => {
  const map = new Map<string, T>();
  local.forEach(item => map.set(item.id, item));
  remote.forEach(item => { if (!map.has(item.id)) map.set(item.id, item); });
  return Array.from(map.values());
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function EventsPage() {
  const { user } = useAuthStore();
  const { companies, activeCompanyId } = useCompanyStore();
  const companyId = activeCompanyId || companies[0]?.id || '';

  // Zustand data store
  const getItems = useDataStore(s => s.getItems);
  const addItem = useDataStore(s => s.addItem);
  const updateItem = useDataStore(s => s.updateItem);
  const deleteItem = useDataStore(s => s.deleteItem);
  const setItems = useDataStore(s => s.setItems);
  const setActiveCompany = useDataStore(s => s.setActiveCompany);
  const storeData = useDataStore(s => s.data);
  const storeActiveCompanyId = useDataStore(s => s.activeCompanyId);
  const isSaving = useDataStore(s => s.isSaving);
  const hasUnsavedChanges = useDataStore(s => s.hasUnsavedChanges);
  const lastSaved = useDataStore(s => s.lastSaved);

  // Derive data from Zustand store
  const events = useMemo(() => (getItems('events') as EventType[]) || [], [getItems, storeData, storeActiveCompanyId]);
  const categories = useMemo(() => (getItems('eventCategories') as EventCategory[]) || [], [getItems, storeData, storeActiveCompanyId]);
  const sessions = useMemo(() => (getItems('eventSessions') as EventSession[]) || [], [getItems, storeData, storeActiveCompanyId]);
  const resources = useMemo(() => (getItems('eventResources') as EventResource[]) || [], [getItems, storeData, storeActiveCompanyId]);

  const [activeTab, setActiveTab] = useState<TabId>('events');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null);
  const [editingSession, setEditingSession] = useState<EventSession | null>(null);
  const [editingResource, setEditingResource] = useState<EventResource | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);

  // Context selectors
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  // Sync data store activeCompanyId
  useEffect(() => {
    if (companyId) setActiveCompany(companyId);
  }, [companyId]);

  // Beforeunload protection
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (hasUnsavedChanges) e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  // Data loading (dual-write)
  useEffect(() => {
    if (!companyId) return;
    loadData();
  }, [companyId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [eventsRes, categoriesRes] = await Promise.all([
        eventApi.getAll(companyId),
        eventCategoryApi.getAll(companyId),
      ]);
      const remoteEvents = normalizeResponse<EventType>(eventsRes);
      const remoteCategories = normalizeResponse<EventCategory>(categoriesRes);
      const localEvents = (getItems('events') as EventType[]) || [];
      const localCategories = (getItems('eventCategories') as EventCategory[]) || [];
      setItems('events', mergeById(localEvents, remoteEvents));
      setItems('eventCategories', mergeById(localCategories, remoteCategories));
    } catch (error) {
      console.error('Failed to load events data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessions = async (eventId: string) => {
    try {
      const res = await eventSessionApi.getAll(eventId);
      const remote = normalizeResponse<EventSession>(res);
      const local = (getItems('eventSessions') as EventSession[]) || [];
      setItems('eventSessions', mergeById(local, remote));
    } catch (error) { console.error('Failed to load sessions:', error); }
  };

  const loadResources = async (eventId: string) => {
    try {
      const res = await eventResourceApi.getAll(eventId);
      const remote = normalizeResponse<EventResource>(res);
      const local = (getItems('eventResources') as EventResource[]) || [];
      setItems('eventResources', mergeById(local, remote));
    } catch (error) { console.error('Failed to load resources:', error); }
  };

  useEffect(() => { if (selectedEventId) loadSessions(selectedEventId); }, [selectedEventId]);
  useEffect(() => { if (selectedEventId) loadResources(selectedEventId); }, [selectedEventId]);

  const categoryMap = useMemo(() => {
    const map: Record<string, EventCategory> = {};
    categories.forEach(c => { map[c.id] = c; });
    return map;
  }, [categories]);

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.shortDescription?.toLowerCase().includes(q) ||
        e.organizer?.toLowerCase().includes(q) ||
        e.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter) filtered = filtered.filter(e => e.status === statusFilter);
    if (typeFilter) filtered = filtered.filter(e => e.eventType === typeFilter);
    if (priorityFilter) filtered = filtered.filter(e => e.priority === priorityFilter);
    return filtered;
  }, [events, searchQuery, statusFilter, typeFilter, priorityFilter]);

  // ============================================
  // CRUD HANDLERS (dual-write)
  // ============================================

  const handleCreateEvent = async (data: Partial<EventType>) => {
    try {
      const localId = addItem('events', { ...data, companyId } as any);
      setShowEventForm(false);
      const res = await eventApi.create({ ...data, companyId } as any);
      const serverData = (res as any)?.data || res;
      if (serverData?.id && serverData.id !== localId) updateItem('events', localId, { id: serverData.id } as any);
    } catch (error) { console.error('Failed to create event:', error); }
  };

  const handleUpdateEvent = async (data: Partial<EventType>) => {
    if (!editingEvent) return;
    const id = editingEvent.id;
    try {
      updateItem('events', id, data as any);
      setEditingEvent(null); setShowEventForm(false);
      await eventApi.update(id, data);
    } catch (error) { console.error('Failed to update event:', error); }
  };

  const handleDeleteEvent = async (event: EventType) => {
    if (!confirm('Delete this event and all its sessions and resources?')) return;
    const id = event.id;
    try {
      deleteItem('events', id);
      const relatedSessions = (getItems('eventSessions') as EventSession[]).filter(s => s.eventId === id);
      relatedSessions.forEach(s => {
        deleteItem('eventSessions', s.id);
        const relatedResources = (getItems('eventResources') as EventResource[]).filter(r => r.sessionId === s.id);
        relatedResources.forEach(r => deleteItem('eventResources', r.id));
      });
      await eventApi.delete(id);
    } catch (error) { console.error('Failed to delete event:', error); }
  };

  const handleCreateCategory = async (data: Partial<EventCategory>) => {
    try {
      const localId = addItem('eventCategories', { ...data, companyId } as any);
      setShowCategoryForm(false);
      const res = await eventCategoryApi.create({ ...data, companyId } as any);
      const serverData = (res as any)?.data || res;
      if (serverData?.id && serverData.id !== localId) updateItem('eventCategories', localId, { id: serverData.id } as any);
    } catch (error) { console.error('Failed to create category:', error); }
  };

  const handleUpdateCategory = async (data: Partial<EventCategory>) => {
    if (!editingCategory) return;
    try {
      updateItem('eventCategories', editingCategory.id, data as any);
      setEditingCategory(null); setShowCategoryForm(false);
      await eventCategoryApi.update(editingCategory.id, data);
    } catch (error) { console.error('Failed to update category:', error); }
  };

  const handleDeleteCategory = async (category: EventCategory) => {
    if (!confirm('Delete this category?')) return;
    try { deleteItem('eventCategories', category.id); await eventCategoryApi.delete(category.id); }
    catch (error) { console.error('Failed to delete category:', error); }
  };

  const handleCreateSession = async (data: Partial<EventSession>) => {
    if (!selectedEventId) return;
    try {
      const localId = addItem('eventSessions', { ...data, eventId: selectedEventId, companyId } as any);
      setShowSessionForm(false);
      const res = await eventSessionApi.create({ ...data, eventId: selectedEventId, companyId } as any);
      const serverData = (res as any)?.data || res;
      if (serverData?.id && serverData.id !== localId) updateItem('eventSessions', localId, { id: serverData.id } as any);
    } catch (error) { console.error('Failed to create session:', error); }
  };

  const handleUpdateSession = async (data: Partial<EventSession>) => {
    if (!editingSession) return;
    try {
      updateItem('eventSessions', editingSession.id, data as any);
      setEditingSession(null); setShowSessionForm(false);
      await eventSessionApi.update(editingSession.id, data);
    } catch (error) { console.error('Failed to update session:', error); }
  };

  const handleDeleteSession = async (session: EventSession) => {
    if (!confirm('Delete this session and all its resources?')) return;
    try {
      deleteItem('eventSessions', session.id);
      const related = (getItems('eventResources') as EventResource[]).filter(r => r.sessionId === session.id);
      related.forEach(r => deleteItem('eventResources', r.id));
      await eventSessionApi.delete(session.id);
    } catch (error) { console.error('Failed to delete session:', error); }
  };

  const handleCreateResource = async (data: Partial<EventResource>) => {
    if (!selectedEventId) return;
    try {
      const localId = addItem('eventResources', { ...data, eventId: selectedEventId, companyId } as any);
      setShowResourceForm(false);
      const res = await eventResourceApi.create({ ...data, eventId: selectedEventId, companyId } as any);
      const serverData = (res as any)?.data || res;
      if (serverData?.id && serverData.id !== localId) updateItem('eventResources', localId, { id: serverData.id } as any);
    } catch (error) { console.error('Failed to create resource:', error); }
  };

  const handleUpdateResource = async (data: Partial<EventResource>) => {
    if (!editingResource) return;
    try {
      updateItem('eventResources', editingResource.id, data as any);
      setEditingResource(null); setShowResourceForm(false);
      await eventResourceApi.update(editingResource.id, data);
    } catch (error) { console.error('Failed to update resource:', error); }
  };

  const handleDeleteResource = async (resource: EventResource) => {
    if (!confirm('Delete this resource?')) return;
    try { deleteItem('eventResources', resource.id); await eventResourceApi.delete(resource.id); }
    catch (error) { console.error('Failed to delete resource:', error); }
  };

  if (!companyId) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Events</h1>
        <p className="text-[#878e9a]">Please select a company to manage events.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[#151920] rounded w-1/3" />
          <div className="h-64 bg-[#151920] rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-[#C8FF2E]" />
            <h1 className="text-3xl font-bold text-white">Events</h1>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {hasUnsavedChanges ? (
              <span className="flex items-center gap-1.5 text-amber-400"><AlertCircle className="w-3.5 h-3.5" />Unsaved changes</span>
            ) : isSaving ? (
              <span className="flex items-center gap-1.5 text-[#878e9a]"><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1.5 text-green-400"><CheckCircle2 className="w-3.5 h-3.5" />All changes saved</span>
            ) : null}
          </div>
        </div>
        <p className="text-[#878e9a]">
          Centralised event management with sessions, resources, categories, and AI generation.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-[#151920] rounded-lg p-1 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-[#C8FF2E]/10 text-[#C8FF2E]' : 'text-[#878e9a] hover:text-[#afb6c4] hover:bg-[#1a1d21]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'events' && (
        <EventsTab
          events={filteredEvents}
          categories={categories}
          categoryMap={categoryMap}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          onCreate={() => { setEditingEvent(null); setShowEventForm(true); }}
          onEdit={(event) => { setEditingEvent(event); setShowEventForm(true); }}
          onDelete={handleDeleteEvent}
          onSelectEvent={(id) => { setSelectedEventId(id); setActiveTab('sessions'); }}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesTab
          categories={categories}
          onCreate={() => { setEditingCategory(null); setShowCategoryForm(true); }}
          onEdit={(cat) => { setEditingCategory(cat); setShowCategoryForm(true); }}
          onDelete={handleDeleteCategory}
        />
      )}

      {activeTab === 'sessions' && (
        <SessionsTab
          sessions={sessions}
          events={events}
          selectedEventId={selectedEventId}
          setSelectedEventId={setSelectedEventId}
          onCreate={() => { if (!selectedEventId) return alert('Select an event first'); setEditingSession(null); setShowSessionForm(true); }}
          onEdit={(session) => { setEditingSession(session); setShowSessionForm(true); }}
          onDelete={handleDeleteSession}
          onSelectSession={(id) => { setSelectedSessionId(id); setActiveTab('resources'); }}
        />
      )}

      {activeTab === 'resources' && (
        <ResourcesTab
          resources={resources}
          sessions={sessions}
          events={events}
          selectedEventId={selectedEventId}
          selectedSessionId={selectedSessionId}
          setSelectedEventId={(id) => { setSelectedEventId(id); }}
          setSelectedSessionId={setSelectedSessionId}
          onCreate={() => { if (!selectedEventId) return alert('Select an event first'); setEditingResource(null); setShowResourceForm(true); }}
          onEdit={(resource) => { setEditingResource(resource); setShowResourceForm(true); }}
          onDelete={handleDeleteResource}
        />
      )}

      {activeTab === 'ai-generate' && (
        <AIGenerateTab events={events} companyId={companyId} onEventCreated={loadData} />
      )}

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          event={editingEvent}
          categories={categories}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={() => { setShowEventForm(false); setEditingEvent(null); }}
        />
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          categories={categories}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          onCancel={() => { setShowCategoryForm(false); setEditingCategory(null); }}
        />
      )}

      {/* Session Form Modal */}
      {showSessionForm && (
        <SessionForm
          session={editingSession}
          onSubmit={editingSession ? handleUpdateSession : handleCreateSession}
          onCancel={() => { setShowSessionForm(false); setEditingSession(null); }}
        />
      )}

      {/* Resource Form Modal */}
      {showResourceForm && (
        <ResourceForm
          resource={editingResource}
          sessions={sessions.filter(s => s.eventId === selectedEventId)}
          onSubmit={editingResource ? handleUpdateResource : handleCreateResource}
          onCancel={() => { setShowResourceForm(false); setEditingResource(null); }}
        />
      )}
    </div>
  );
}

// ============================================
// EVENTS TAB
// ============================================

function EventsTab({
  events, categories, categoryMap, searchQuery, setSearchQuery,
  statusFilter, setStatusFilter, typeFilter, setTypeFilter,
  priorityFilter, setPriorityFilter, onCreate, onEdit, onDelete, onSelectEvent,
}: {
  events: EventType[];
  categories: EventCategory[];
  categoryMap: Record<string, EventCategory>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  priorityFilter: string;
  setPriorityFilter: (p: string) => void;
  onCreate: () => void;
  onEdit: (event: EventType) => void;
  onDelete: (event: EventType) => void;
  onSelectEvent: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#686f7e]" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
          <option value="">All Statuses</option>
          {EVENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
          <option value="">All Types</option>
          {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
          <option value="">All Priorities</option>
          {EVENT_PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <button onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />Add Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <Calendar className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">No events found. Create your first event to get started.</p>
        </div>
      ) : (
        <div className="bg-[#151920] rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-white/5 hover:bg-[#1a1d21] cursor-pointer transition-colors"
                  onClick={() => onSelectEvent(event.id)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.eventType)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{event.title}</span>
                          {event.isFeatured && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                        </div>
                        {event.shortDescription && (
                          <div className="text-[#686f7e] text-xs truncate max-w-[200px]">{event.shortDescription}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#afb6c4] capitalize">{EVENT_TYPES.find(t => t.value === event.eventType)?.label || event.eventType}</td>
                  <td className="px-4 py-3 text-sm text-[#afb6c4]">{event.eventDate || '—'}</td>
                  <td className="px-4 py-3">{getStatusBadge(event.status, EVENT_STATUSES)}</td>
                  <td className="px-4 py-3">{getStatusBadge(event.priority, EVENT_PRIORITIES)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onEdit(event)} className="p-1.5 text-[#878e9a] hover:text-[#C8FF2E] transition-colors" title="Edit"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(event)} className="p-1.5 text-[#878e9a] hover:text-red-400 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================
// CATEGORIES TAB
// ============================================

function CategoriesTab({ categories, onCreate, onEdit, onDelete }: {
  categories: EventCategory[];
  onCreate: () => void;
  onEdit: (cat: EventCategory) => void;
  onDelete: (cat: EventCategory) => void;
}) {
  const topLevel = categories.filter(c => !c.parentId);
  const getChildren = (parentId: string) => categories.filter(c => c.parentId === parentId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Event Categories</h2>
        <button onClick={onCreate} className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />Add Category
        </button>
      </div>
      {topLevel.length === 0 ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <FolderOpen className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">No categories yet. Create your first category.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {topLevel.map(cat => {
            const children = getChildren(cat.id);
            return (
              <div key={cat.id} className="bg-[#151920] rounded-lg border border-white/10">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    {cat.colour && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.colour }} />}
                    <span className="text-white font-medium">{cat.name}</span>
                    <span className="text-xs text-[#686f7e]">{cat.eventCount} events</span>
                    {cat.status === 'archived' && <span className="px-2 py-0.5 rounded text-xs bg-[#686f7e] text-white">Archived</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(cat)} className="p-1.5 text-[#878e9a] hover:text-[#C8FF2E]"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(cat)} className="p-1.5 text-[#878e9a] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {children.length > 0 && (
                  <div className="pl-8 pb-2 space-y-1">
                    {children.map(child => (
                      <div key={child.id} className="flex items-center justify-between px-4 py-2 rounded hover:bg-[#1a1d21]">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-[#686f7e]" />
                          {child.colour && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: child.colour }} />}
                          <span className="text-[#afb6c4] text-sm">{child.name}</span>
                          <span className="text-xs text-[#686f7e]">{child.eventCount} events</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => onEdit(child)} className="p-1 text-[#878e9a] hover:text-[#C8FF2E]"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => onDelete(child)} className="p-1 text-[#878e9a] hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
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
// SESSIONS TAB
// ============================================

function SessionsTab({ sessions, events, selectedEventId, setSelectedEventId, onCreate, onEdit, onDelete, onSelectSession }: {
  sessions: EventSession[];
  events: EventType[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  onCreate: () => void;
  onEdit: (session: EventSession) => void;
  onDelete: (session: EventSession) => void;
  onSelectSession: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-[#878e9a]">Event:</label>
          <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
            <option value="">Select an event...</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        {selectedEventId && (
          <button onClick={onCreate} className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />Add Session
          </button>
        )}
      </div>
      {!selectedEventId ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <Layers className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">Select an event to manage its sessions.</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <Layers className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">No sessions yet. Add a session to start building the event agenda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map(session => (
            <div key={session.id} className="bg-[#151920] rounded-lg border border-white/10 p-4 hover:border-[#C8FF2E]/30 transition-colors cursor-pointer"
              onClick={() => onSelectSession(session.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[#686f7e] text-sm font-mono">#{session.order || 0}</span>
                  <div>
                    <div className="text-white font-medium">{session.title}</div>
                    {session.speakerInfo && <div className="text-[#686f7e] text-xs mt-0.5">Speaker: {session.speakerInfo}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {session.duration && <span className="text-xs text-[#686f7e]">{session.duration}</span>}
                  {getStatusBadge(session.status, SESSION_STATUSES)}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(session)} className="p-1 text-[#878e9a] hover:text-[#C8FF2E]"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(session)} className="p-1 text-[#878e9a] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// RESOURCES TAB
// ============================================

function ResourcesTab({ resources, sessions, events, selectedEventId, selectedSessionId, setSelectedEventId, setSelectedSessionId, onCreate, onEdit, onDelete }: {
  resources: EventResource[];
  sessions: EventSession[];
  events: EventType[];
  selectedEventId: string;
  selectedSessionId: string;
  setSelectedEventId: (id: string) => void;
  setSelectedSessionId: (id: string) => void;
  onCreate: () => void;
  onEdit: (resource: EventResource) => void;
  onDelete: (resource: EventResource) => void;
}) {
  const filteredSessions = sessions.filter(s => s.eventId === selectedEventId);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#878e9a]">Event:</label>
          <select value={selectedEventId} onChange={(e) => { setSelectedEventId(e.target.value); setSelectedSessionId(''); }}
            className="px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
            <option value="">Select event...</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        {selectedEventId && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#878e9a]">Session:</label>
            <select value={selectedSessionId} onChange={(e) => setSelectedSessionId(e.target.value)}
              className="px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
              <option value="">All sessions</option>
              {filteredSessions.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
        )}
        {selectedEventId && (
          <button onClick={onCreate} className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />Add Resource
          </button>
        )}
      </div>
      {!selectedEventId ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <FileText className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">Select an event to manage its resources.</p>
        </div>
      ) : resources.filter(r => selectedSessionId ? r.sessionId === selectedSessionId : true).length === 0 ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <FileText className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">No resources yet. Add a resource to this event.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {resources.filter(r => selectedSessionId ? r.sessionId === selectedSessionId : true).map(resource => (
            <div key={resource.id} className="bg-[#151920] rounded-lg border border-white/10 p-4 hover:border-[#C8FF2E]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[#686f7e] text-sm font-mono">#{resource.order || 0}</span>
                  <div>
                    <div className="text-white font-medium">{resource.title}</div>
                    {resource.description && <div className="text-[#686f7e] text-xs mt-0.5">{resource.description}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#878e9a] capitalize">{resource.type}</span>
                  {getStatusBadge(resource.status, RESOURCE_STATUSES)}
                  <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(resource)} className="p-1 text-[#878e9a] hover:text-[#C8FF2E]"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(resource)} className="p-1 text-[#878e9a] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// EVENT FORM
// ============================================

function EventForm({ event, categories, onSubmit, onCancel }: {
  event: EventType | null;
  categories: EventCategory[];
  onSubmit: (data: Partial<EventType>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<EventType>>(event || {
    title: '', eventType: 'meeting', status: 'draft', visibility: 'internal',
    priority: 'medium', eventMode: 'online', audienceType: 'internal',
    tags: [], objectives: [], expectedOutcomes: [], prerequisites: [],
    relatedEventIds: [], relatedCourseIds: [], relatedSopIds: [],
    attachments: [], documentUrls: [], seoKeywords: [],
    viewCount: 0, rsvpCount: 0, attendanceCount: 0,
    version: 1, isFeatured: false, aiGenerated: false,
  });

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(form); };
  const updateField = (field: string, value: unknown) => { setForm(prev => ({ ...prev, [field]: value })); };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#0d1117] border border-white/10 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#0d1117] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{event ? 'Edit Event' : 'Create Event'}</h2>
          {event && <div className="ml-3">{getStatusBadge(event.status, EVENT_STATUSES)}</div>}
          <button onClick={onCancel} className="text-[#686f7e] hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Core Information */}
          <div className="border-t border-[#C8FF2E]/30 pt-4">
            <h3 className="text-[#C8FF2E] font-semibold mb-4">Core Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Title *</label>
                <input type="text" value={form.title || ''} onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" required />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Event Type</label>
                <select value={form.eventType || 'meeting'} onChange={(e) => updateField('eventType', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#878e9a] mb-1">Short Description</label>
                <textarea value={form.shortDescription || ''} onChange={(e) => updateField('shortDescription', e.target.value)} rows={2}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#878e9a] mb-1">Detailed Description</label>
                <textarea value={form.detailedDescription || ''} onChange={(e) => updateField('detailedDescription', e.target.value)} rows={4}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="border-t border-[#C8FF2E]/30 pt-4">
            <h3 className="text-[#C8FF2E] font-semibold mb-4">Scheduling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Event Date</label>
                <input type="date" value={form.eventDate || ''} onChange={(e) => updateField('eventDate', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Start Time</label>
                <input type="time" value={form.startTime || ''} onChange={(e) => updateField('startTime', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">End Time</label>
                <input type="time" value={form.endTime || ''} onChange={(e) => updateField('endTime', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Duration</label>
                <input type="text" value={form.duration || ''} onChange={(e) => updateField('duration', e.target.value)} placeholder="e.g., 2 hours"
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Event Mode</label>
                <select value={form.eventMode || 'online'} onChange={(e) => updateField('eventMode', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  {EVENT_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Location</label>
                <input type="text" value={form.location || ''} onChange={(e) => updateField('location', e.target.value)} placeholder="Physical location or venue"
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Meeting Link</label>
                <input type="text" value={form.meetingLink || ''} onChange={(e) => updateField('meetingLink', e.target.value)} placeholder="Zoom, Teams, etc."
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Organiser</label>
                <input type="text" value={form.organizer || ''} onChange={(e) => updateField('organizer', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="border-t border-[#C8FF2E]/30 pt-4">
            <h3 className="text-[#C8FF2E] font-semibold mb-4">Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Category</label>
                <select value={form.categoryId || ''} onChange={(e) => updateField('categoryId', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  <option value="">No Category</option>
                  {categoryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Priority</label>
                <select value={form.priority || 'medium'} onChange={(e) => updateField('priority', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  {EVENT_PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Audience</label>
                <select value={form.audienceType || 'internal'} onChange={(e) => updateField('audienceType', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  {EVENT_AUDIENCES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Tags (comma-separated)</label>
                <input type="text" value={(form.tags || []).join(', ')} onChange={(e) => updateField('tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="border-t border-[#C8FF2E]/30 pt-4">
            <h3 className="text-[#C8FF2E] font-semibold mb-4">Objectives & Outcomes</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Objectives (comma-separated)</label>
                <textarea value={(form.objectives || []).join(', ')} onChange={(e) => updateField('objectives', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))} rows={2}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Expected Outcomes (comma-separated)</label>
                <textarea value={(form.expectedOutcomes || []).join(', ')} onChange={(e) => updateField('expectedOutcomes', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))} rows={2}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
              </div>
            </div>
          </div>

          {/* Status & Visibility */}
          <div className="border-t border-[#C8FF2E]/30 pt-4">
            <h3 className="text-[#C8FF2E] font-semibold mb-4">Status & Visibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Status</label>
                <select value={form.status || 'draft'} onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  {EVENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Visibility</label>
                <select value={form.visibility || 'internal'} onChange={(e) => updateField('visibility', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  {EVENT_VISIBILITIES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isFeatured" checked={form.isFeatured || false} onChange={(e) => updateField('isFeatured', e.target.checked)}
                  className="w-4 h-4 bg-[#151920] border-white/10 rounded" />
                <label htmlFor="isFeatured" className="text-sm text-[#afb6c4]">Featured Event</label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-[#878e9a] hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg font-medium transition-colors">
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// CATEGORY FORM
// ============================================

function CategoryForm({ category, categories, onSubmit, onCancel }: {
  category: EventCategory | null;
  categories: EventCategory[];
  onSubmit: (data: Partial<EventCategory>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<EventCategory>>(category || { name: '', description: '', status: 'active', order: 0, eventCount: 0 });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#0d1117] border border-white/10 rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{category ? 'Edit Category' : 'Create Category'}</h2>
          <button onClick={onCancel} className="text-[#686f7e] hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Name *</label>
            <input type="text" value={form.name || ''} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" required />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Description</label>
            <textarea value={form.description || ''} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={2}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Parent Category</label>
            <select value={form.parentId || ''} onChange={(e) => setForm(prev => ({ ...prev, parentId: e.target.value || undefined }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
              <option value="">No Parent (Top Level)</option>
              {categories.filter(c => !c.parentId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Colour</label>
            <input type="color" value={form.colour || '#C8FF2E'} onChange={(e) => setForm(prev => ({ ...prev, colour: e.target.value }))}
              className="w-12 h-10 bg-[#151920] border border-white/10 rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Sort Order</label>
            <input type="number" value={form.order || 0} onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Status</label>
            <select value={form.status || 'active'} onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as EventCategoryStatus }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
              {CATEGORY_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-[#878e9a] hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg font-medium transition-colors">
              {category ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// SESSION FORM
// ============================================

function SessionForm({ session, onSubmit, onCancel }: {
  session: EventSession | null;
  onSubmit: (data: Partial<EventSession>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<EventSession>>(session || {
    title: '', status: 'draft', order: 0, objectives: [], aiGenerated: false,
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#0d1117] border border-white/10 rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{session ? 'Edit Session' : 'Create Session'}</h2>
          <button onClick={onCancel} className="text-[#686f7e] hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Title *</label>
            <input type="text" value={form.title || ''} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" required />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Description</label>
            <textarea value={form.description || ''} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={2}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#878e9a] mb-1">Order</label>
              <input type="number" value={form.order || 0} onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
            </div>
            <div>
              <label className="block text-sm text-[#878e9a] mb-1">Duration</label>
              <input type="text" value={form.duration || ''} onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))} placeholder="e.g., 30 min"
                className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Speaker Info</label>
            <input type="text" value={form.speakerInfo || ''} onChange={(e) => setForm(prev => ({ ...prev, speakerInfo: e.target.value }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Objectives (comma-separated)</label>
            <textarea value={(form.objectives || []).join(', ')} onChange={(e) => setForm(prev => ({ ...prev, objectives: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) }))} rows={2}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Status</label>
            <select value={form.status || 'draft'} onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as SessionStatus }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
              {SESSION_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-[#878e9a] hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg font-medium transition-colors">
              {session ? 'Update Session' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// RESOURCE FORM
// ============================================

function ResourceForm({ resource, sessions, onSubmit, onCancel }: {
  resource: EventResource | null;
  sessions: EventSession[];
  onSubmit: (data: Partial<EventResource>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<EventResource>>(resource || {
    title: '', type: 'url', status: 'active', order: 0,
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#0d1117] border border-white/10 rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{resource ? 'Edit Resource' : 'Create Resource'}</h2>
          <button onClick={onCancel} className="text-[#686f7e] hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Title *</label>
            <input type="text" value={form.title || ''} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#878e9a] mb-1">Type</label>
              <select value={form.type || 'url'} onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as ResourceType }))}
                className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#878e9a] mb-1">Session</label>
              <select value={form.sessionId || ''} onChange={(e) => setForm(prev => ({ ...prev, sessionId: e.target.value || undefined }))}
                className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                <option value="">No session</option>
                {sessions.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">URL</label>
            <input type="text" value={form.url || ''} onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Description</label>
            <textarea value={form.description || ''} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={2}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#878e9a] mb-1">Order</label>
              <input type="number" value={form.order || 0} onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
            </div>
            <div>
              <label className="block text-sm text-[#878e9a] mb-1">Status</label>
              <select value={form.status || 'active'} onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as ResourceStatus }))}
                className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                {RESOURCE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-[#878e9a] hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg font-medium transition-colors">
              {resource ? 'Update Resource' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// AI GENERATE TAB
// ============================================

function AIGenerateTab({ events, companyId, onEventCreated }: {
  events: EventType[];
  companyId: string;
  onEventCreated: () => void;
}) {
  const [aiMode, setAiMode] = useState<'description' | 'agenda' | 'checklist' | 'mom' | 'enhance'>('description');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string>('');

  // Description generation state
  const [descTitle, setDescTitle] = useState('');
  const [descBrief, setDescBrief] = useState('');
  const [descEventType, setDescEventType] = useState<string>('meeting');
  const [descEventMode, setDescEventMode] = useState<string>('online');

  // Agenda generation state
  const [agendaTitle, setAgendaTitle] = useState('');
  const [agendaDesc, setAgendaDesc] = useState('');
  const [agendaObjectives, setAgendaObjectives] = useState('');

  // Checklist generation state
  const [checkTitle, setCheckTitle] = useState('');
  const [checkEventType, setCheckEventType] = useState<string>('meeting');
  const [checkEventMode, setCheckEventMode] = useState<string>('online');

  // MOM generation state
  const [momTitle, setMomTitle] = useState('');
  const [momDate, setMomDate] = useState('');
  const [momAttendees, setMomAttendees] = useState('');
  const [momNotes, setMomNotes] = useState('');

  // Content enhancement state
  const [enhanceContent, setEnhanceContent] = useState('');
  const [enhanceType, setEnhanceType] = useState<string>('grammar');
  const [enhanceTitle, setEnhanceTitle] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setAiError('');
    setAiResult('');
    setParsedResult(null);
    setSaveSuccess('');

    try {
      let result = '';
      switch (aiMode) {
        case 'description': {
          const messages: GLMMessage[] = [
            { role: 'system', content: 'You are an expert event planner and business coordinator. Generate professional event content for enterprise use. Always respond with valid JSON when structured data is requested. Use British English spelling. Be concise and professional.' },
            { role: 'user', content: `Generate a professional event description for a business event with the following details:\n\nTitle: ${descTitle}\n${descBrief ? `Brief: ${descBrief}` : ''}\n${descEventType ? `Event Type: ${descEventType}` : ''}\n${descEventMode ? `Event Mode: ${descEventMode}` : ''}\n\nGenerate a JSON object with these fields:\n- shortDescription (max 200 characters)\n- detailedDescription (2-3 paragraphs)\n- summary (1-2 sentences)\n- objectives (array of 3-5 business objectives)\n- expectedOutcomes (array of 3-5 expected outcomes)` },
          ];
          result = await withRetry(() => callGLM(messages, { temperature: 0.7, maxTokens: 2000, responseFormat: 'json_object' }));
          const parsed = parseJsonFromAI(result);
          if (parsed) { setParsedResult(parsed); setAiResult(JSON.stringify(parsed, null, 2)); }
          else setAiResult(result);
          break;
        }
        case 'agenda': {
          const objectives = agendaObjectives.split(',').map((s: string) => s.trim()).filter(Boolean);
          const messages: GLMMessage[] = [
            { role: 'system', content: 'You are an expert event agenda designer for business events. Create structured, professional agendas. Always respond with valid JSON. Use British English spelling.' },
            { role: 'user', content: `Generate an event agenda with sessions for:\n\nTitle: ${agendaTitle}\n${agendaDesc ? `Description: ${agendaDesc}` : ''}\n${objectives.length ? `Objectives: ${objectives.join(', ')}` : ''}\n\nGenerate a JSON array of sessions, each with:\n- title\n- description\n- duration (e.g. "30 minutes")\n- speakerInfo (speaker name and role, or "TBD")\n- objectives (array of session objectives)\n- checklistItems (array of {text, order} items for this session)` },
          ];
          result = await withRetry(() => callGLM(messages, { temperature: 0.7, maxTokens: 3000, responseFormat: 'json_object' }));
          const parsed = parseJsonFromAI(result);
          if (parsed) { setParsedResult(parsed); setAiResult(JSON.stringify(parsed, null, 2)); }
          else setAiResult(result);
          break;
        }
        case 'checklist': {
          const messages: GLMMessage[] = [
            { role: 'system', content: 'You are an expert event coordinator. Create practical pre-event planning checklists. Always respond with valid JSON. Use British English spelling.' },
            { role: 'user', content: `Generate a pre-event planning checklist for:\n\nTitle: ${checkTitle}\n${checkEventType ? `Event Type: ${checkEventType}` : ''}\n${checkEventMode ? `Event Mode: ${checkEventMode}` : ''}\n\nGenerate a JSON array of checklist items, each with:\n- text (clear action item)\n- order (chronological number starting from 1)\n\nInclude 10-15 items covering venue, logistics, communications, technology, and follow-up.` },
          ];
          result = await withRetry(() => callGLM(messages, { temperature: 0.7, maxTokens: 2000, responseFormat: 'json_object' }));
          const parsed = parseJsonFromAI(result);
          if (parsed) { setParsedResult(parsed); setAiResult(JSON.stringify(parsed, null, 2)); }
          else setAiResult(result);
          break;
        }
        case 'mom': {
          const messages: GLMMessage[] = [
            { role: 'system', content: 'You are an expert meeting secretary. Generate professional Minutes of Meeting documents. Always respond with valid JSON. Use British English spelling.' },
            { role: 'user', content: `Generate Minutes of Meeting for:\n\nTitle: ${momTitle}\n${momDate ? `Date: ${momDate}` : ''}\n${momAttendees ? `Attendees: ${momAttendees}` : ''}\n${momNotes ? `Notes: ${momNotes}` : ''}\n\nGenerate a JSON object with:\n- summary (2-3 sentence meeting summary)\n- keyDecisions (array of key decisions made)\n- actionItems (array of {task, assignee, deadline})\n- followUps (array of follow-up items)\n- nextSteps (array of next steps)` },
          ];
          result = await withRetry(() => callGLM(messages, { temperature: 0.7, maxTokens: 2000, responseFormat: 'json_object' }));
          const parsed = parseJsonFromAI(result);
          if (parsed) { setParsedResult(parsed); setAiResult(JSON.stringify(parsed, null, 2)); }
          else setAiResult(result);
          break;
        }
        case 'enhance': {
          const enhanceInstructions: Record<string, string> = {
            grammar: 'Fix grammar, spelling, and punctuation errors.',
            tone: 'Adjust the tone to be more professional and engaging.',
            expand: 'Expand the content with more detail and examples.',
            simplify: 'Simplify the content to be clearer and more concise.',
            format: 'Improve the formatting and structure of the content.',
            keypoints: 'Extract and summarise the key points from the content.',
            mom: 'Convert the content into structured Minutes of Meeting format.',
          };
          const messages: GLMMessage[] = [
            { role: 'system', content: 'You are an expert content editor for business events. Enhance and improve content professionally. Use British English spelling.' },
            { role: 'user', content: `${enhanceInstructions[enhanceType] || 'Improve the following content.'}\n\n${enhanceTitle ? `Title: ${enhanceTitle}\n\n` : ''}Content:\n${enhanceContent}` },
          ];
          result = await withRetry(() => callGLM(messages, { temperature: 0.7, maxTokens: 3000 }));
          setAiResult(result);
          break;
        }
      }
    } catch (error: any) {
      setAiError(error.message || 'AI generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save AI result to event data
  const handleSaveResult = async () => {
    if (!parsedResult && aiMode !== 'enhance') return;
    setIsSaving(true);
    setSaveSuccess('');

    try {
      const store = useDataStore.getState();
      switch (aiMode) {
        case 'description': {
          if (!selectedEventId) { setIsSaving(false); return; }
          const updates: Partial<EventType> = {};
          if (parsedResult.shortDescription) updates.shortDescription = parsedResult.shortDescription;
          if (parsedResult.detailedDescription) updates.detailedDescription = parsedResult.detailedDescription;
          if (parsedResult.summary) updates.summary = parsedResult.summary;
          if (Array.isArray(parsedResult.objectives)) updates.objectives = parsedResult.objectives;
          if (Array.isArray(parsedResult.expectedOutcomes)) updates.expectedOutcomes = parsedResult.expectedOutcomes;
          updates.aiGenerated = true;
          await eventApi.update(selectedEventId, updates);
          store.updateItem('events', selectedEventId, updates);
          setSaveSuccess('Description saved to event!');
          onEventCreated();
          break;
        }
        case 'agenda': {
          if (!selectedEventId) { setIsSaving(false); return; }
          const sessions = Array.isArray(parsedResult) ? parsedResult : (parsedResult.sessions || parsedResult.agenda || []);
          if (!Array.isArray(sessions) || sessions.length === 0) { setSaveSuccess('No sessions found in result.'); setIsSaving(false); return; }
          for (let i = 0; i < sessions.length; i++) {
            const s = sessions[i];
            const sessionData = { title: s.title || `Session ${i + 1}`, description: s.description || '', order: i, status: 'draft' as const, duration: s.duration || '', speakerInfo: s.speakerInfo || '', objectives: Array.isArray(s.objectives) ? s.objectives : [], attachments: [], checklistItems: Array.isArray(s.checklistItems) ? s.checklistItems.map((c: any, ci: number) => ({ id: `cl-${Date.now()}-${ci}`, text: c.text || '', done: false, order: c.order || ci + 1 })) : [], aiGenerated: true, eventId: selectedEventId, companyId };
            const session = await eventSessionApi.create(sessionData);
            store.addItem('eventSessions', (session.data || session) as any);
          }
          setSaveSuccess(`Created ${sessions.length} sessions!`);
          onEventCreated();
          break;
        }
        case 'checklist': {
          if (!selectedEventId) { setIsSaving(false); return; }
          const items = Array.isArray(parsedResult) ? parsedResult : (parsedResult.checklistItems || parsedResult.items || []);
          if (!Array.isArray(items) || items.length === 0) { setSaveSuccess('No checklist items found.'); setIsSaving(false); return; }
          const checklistItems = items.map((item: any, i: number) => ({ id: `cl-${Date.now()}-${i}`, text: item.text || '', done: false, order: item.order || i + 1 }));
          const existingSessions = store.getItems('eventSessions') as EventSession[];
          const session = existingSessions.find(s => s.eventId === selectedEventId);
          if (session) {
            const updated = [...(session.checklistItems || []), ...checklistItems];
            await eventSessionApi.update(session.id, { checklistItems: updated });
            store.updateItem('eventSessions', session.id, { checklistItems: updated });
            setSaveSuccess(`Added ${checklistItems.length} checklist items to session!`);
          } else {
            const sessionData = { title: 'Event Checklist', description: 'Pre-event planning checklist', order: 0, status: 'draft' as const, objectives: [], attachments: [], checklistItems, aiGenerated: true, eventId: selectedEventId, companyId };
            const newSession = await eventSessionApi.create(sessionData);
            store.addItem('eventSessions', (newSession.data || newSession) as any);
            setSaveSuccess(`Created session with ${checklistItems.length} checklist items!`);
          }
          onEventCreated();
          break;
        }
        case 'mom': {
          if (!selectedEventId) { setIsSaving(false); return; }
          const momNotes = `## Meeting Summary\n${parsedResult.summary || ''}\n\n## Key Decisions\n${Array.isArray(parsedResult.keyDecisions) ? parsedResult.keyDecisions.map((d: string) => `- ${d}`).join('\n') : ''}\n\n## Action Items\n${Array.isArray(parsedResult.actionItems) ? parsedResult.actionItems.map((a: any) => `- ${a.task || ''}${a.assignee ? ` (${a.assignee})` : ''}${a.deadline ? ` — Due: ${a.deadline}` : ''}`).join('\n') : ''}\n\n## Follow-ups\n${Array.isArray(parsedResult.followUps) ? parsedResult.followUps.map((f: string) => `- ${f}`).join('\n') : ''}\n\n## Next Steps\n${Array.isArray(parsedResult.nextSteps) ? parsedResult.nextSteps.map((n: string) => `- ${n}`).join('\n') : ''}`;
          const existingSessions = store.getItems('eventSessions') as EventSession[];
          const session = existingSessions.find(s => s.eventId === selectedEventId);
          if (session) {
            await eventSessionApi.update(session.id, { aiNotes: momNotes, aiSummary: parsedResult.summary || '', aiGenerated: true });
            store.updateItem('eventSessions', session.id, { aiNotes: momNotes, aiSummary: parsedResult.summary || '', aiGenerated: true });
            setSaveSuccess('MoM saved to session!');
          } else {
            const sessionData = { title: `MoM: ${momTitle || 'Meeting'}`, description: parsedResult.summary || '', order: 0, status: 'draft' as const, objectives: [], attachments: [], checklistItems: [], aiNotes: momNotes, aiSummary: parsedResult.summary || '', aiGenerated: true, eventId: selectedEventId, companyId };
            const newSession = await eventSessionApi.create(sessionData);
            store.addItem('eventSessions', (newSession.data || newSession) as any);
            setSaveSuccess('MoM saved as new session!');
          }
          onEventCreated();
          break;
        }
        case 'enhance': {
          if (!selectedEventId) { setIsSaving(false); return; }
          await eventApi.update(selectedEventId, { detailedDescription: aiResult, aiGenerated: true });
          store.updateItem('events', selectedEventId, { detailedDescription: aiResult, aiGenerated: true });
          setSaveSuccess('Enhanced content saved to event!');
          onEventCreated();
          break;
        }
      }
    } catch (error: any) {
      setAiError(error.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Render structured AI result based on mode
  const renderStructuredResult = () => {
    if (!parsedResult && aiMode !== 'enhance') {
      if (aiResult) {
        return <pre className="whitespace-pre-wrap text-sm text-[#afb6c4] bg-[#0d1117] rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono">{aiResult}</pre>;
      }
      return null;
    }

    if (aiMode === 'enhance') {
      return (
        <div className="space-y-4">
          <div className="text-sm text-[#878e9a] mb-1">Enhanced Content</div>
          <div className="text-[#afb6c4] whitespace-pre-wrap leading-relaxed bg-[#0d1117] rounded-lg p-4 max-h-[400px] overflow-y-auto">{aiResult}</div>
        </div>
      );
    }

    const data = parsedResult;

    if (aiMode === 'description') {
      return (
        <div className="space-y-4">
          {data.shortDescription && (
            <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Short Description</div>
              <div className="text-sm text-[#afb6c4]">{data.shortDescription}</div>
            </div>
          )}
          {data.detailedDescription && (
            <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Detailed Description</div>
              <div className="text-sm text-[#afb6c4] whitespace-pre-wrap leading-relaxed">{data.detailedDescription}</div>
            </div>
          )}
          {data.summary && (
            <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Summary</div>
              <div className="text-sm text-[#afb6c4]">{data.summary}</div>
            </div>
          )}
          {Array.isArray(data.objectives) && data.objectives.length > 0 && (
            <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Objectives</div>
              <ul className="space-y-1">{data.objectives.map((obj: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]"><span className="text-[#C8FF2E] mt-1">•</span>{obj}</li>
              ))}</ul>
            </div>
          )}
          {Array.isArray(data.expectedOutcomes) && data.expectedOutcomes.length > 0 && (
            <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Expected Outcomes</div>
              <ul className="space-y-1">{data.expectedOutcomes.map((out: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]"><span className="text-[#C8FF2E] mt-1">•</span>{out}</li>
              ))}</ul>
            </div>
          )}
        </div>
      );
    }

    if (aiMode === 'agenda') {
      const sessions = Array.isArray(data) ? data : (data.sessions || data.agenda || []);
      if (!Array.isArray(sessions) || sessions.length === 0) {
        return <pre className="whitespace-pre-wrap text-sm text-[#afb6c4] bg-[#0d1117] rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono">{aiResult}</pre>;
      }
      return (
        <div className="space-y-3">
          {sessions.map((s: any, i: number) => (
            <div key={i} className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#C8FF2E]/20 text-[#C8FF2E] text-xs font-bold px-2 py-0.5 rounded">S{i + 1}</span>
                <span className="text-white font-medium text-sm">{s.title}</span>
                {s.duration && <span className="text-xs text-[#686f7e] ml-auto">{s.duration}</span>}
              </div>
              {s.description && <p className="text-sm text-[#878e9a] mb-2">{s.description}</p>}
              {s.speakerInfo && <div className="text-xs text-[#878e9a] mb-1">Speaker: <span className="text-[#afb6c4]">{s.speakerInfo}</span></div>}
              {Array.isArray(s.objectives) && s.objectives.length > 0 && (
                <div className="text-xs text-[#878e9a] mb-1">Objectives: {s.objectives.join(', ')}</div>
              )}
              {Array.isArray(s.checklistItems) && s.checklistItems.length > 0 && (
                <div className="mt-2 space-y-1">{s.checklistItems.map((c: any, ci: number) => (
                  <div key={ci} className="flex items-center gap-2 text-xs text-[#878e9a]">
                    <span className="text-[#C8FF2E]">☐</span>{c.text || c}
                  </div>
                ))}</div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (aiMode === 'checklist') {
      const items = Array.isArray(data) ? data : (data.checklistItems || data.items || []);
      if (!Array.isArray(items) || items.length === 0) {
        return <pre className="whitespace-pre-wrap text-sm text-[#afb6c4] bg-[#0d1117] rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono">{aiResult}</pre>;
      }
      return (
        <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
          <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-3">Pre-Event Checklist</div>
          <div className="space-y-2">{items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-[#C8FF2E]">{typeof item === 'object' ? item.order || i + 1 : i + 1}.</span>
              <span className="text-[#afb6c4]">{typeof item === 'object' ? item.text : item}</span>
            </div>
          ))}</div>
        </div>
      );
    }

    if (aiMode === 'mom') {
      return (
        <div className="space-y-4">
          {data.summary && (
            <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Summary</div>
              <div className="text-sm text-[#afb6c4]">{data.summary}</div>
            </div>
          )}
          {Array.isArray(data.keyDecisions) && data.keyDecisions.length > 0 && (
            <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Key Decisions</div>
              <ul className="space-y-1">{data.keyDecisions.map((d: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]"><span className="text-[#C8FF2E] mt-1">•</span>{d}</li>
              ))}</ul>
            </div>
          )}
          {Array.isArray(data.actionItems) && data.actionItems.length > 0 && (
            <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Action Items</div>
              <div className="space-y-2">{data.actionItems.map((a: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-[#C8FF2E]">→</span>
                  <span className="text-[#afb6c4]">{a.task || a}</span>
                  {a.assignee && <span className="text-xs text-[#878e9a]">({a.assignee})</span>}
                  {a.deadline && <span className="text-xs text-[#686f7e]">— Due: {a.deadline}</span>}
                </div>
              ))}</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {Array.isArray(data.followUps) && data.followUps.length > 0 && (
              <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
                <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Follow-ups</div>
                <ul className="space-y-1">{data.followUps.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]"><span className="text-[#C8FF2E] mt-1">•</span>{f}</li>
                ))}</ul>
              </div>
            )}
            {Array.isArray(data.nextSteps) && data.nextSteps.length > 0 && (
              <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
                <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Next Steps</div>
                <ul className="space-y-1">{data.nextSteps.map((n: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]"><span className="text-[#C8FF2E] mt-1">•</span>{n}</li>
                ))}</ul>
              </div>
            )}
          </div>
        </div>
      );
    }

    return <pre className="whitespace-pre-wrap text-sm text-[#afb6c4] bg-[#0d1117] rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono">{aiResult}</pre>;
  };

  const aiModes = [
    { id: 'description' as const, label: 'Generate Description', icon: <FileText className="w-5 h-5" />, desc: 'Create event descriptions, summaries, and objectives.' },
    { id: 'agenda' as const, label: 'Generate Agenda', icon: <Layers className="w-5 h-5" />, desc: 'Create a structured event agenda with sessions.' },
    { id: 'checklist' as const, label: 'Generate Checklist', icon: <CheckCircle2 className="w-5 h-5" />, desc: 'Create pre-event planning checklists.' },
    { id: 'mom' as const, label: 'Generate MoM', icon: <FileText className="w-5 h-5" />, desc: 'Generate Minutes of Meeting summaries.' },
    { id: 'enhance' as const, label: 'Enhance Content', icon: <Sparkles className="w-5 h-5" />, desc: 'Improve, expand, simplify, or format event content.' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">AI-Powered Event Generation</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {aiModes.map(mode => (
          <button
            key={mode.id}
            onClick={() => { setAiMode(mode.id); setAiResult(''); setAiError(''); }}
            className={`p-4 rounded-lg border text-left transition-all ${
              aiMode === mode.id ? 'bg-[#C8FF2E]/20 border-[#C8FF2E] text-[#C8FF2E]' : 'bg-[#151920] border-white/10 text-[#878e9a] hover:border-[#C8FF2E]/30 hover:text-[#afb6c4]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">{mode.icon}<span className="font-medium text-sm">{mode.label}</span></div>
            <p className="text-xs opacity-70">{mode.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-[#151920] rounded-xl border border-white/10 p-6 space-y-4">
          <h3 className="text-white font-medium">{aiModes.find(m => m.id === aiMode)?.label} — Input</h3>

          {aiMode === 'description' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Event Title *</label>
                <input type="text" value={descTitle} onChange={(e) => setDescTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" placeholder="e.g., Q3 Sales Kickoff" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Brief Description</label>
                <textarea value={descBrief} onChange={(e) => setDescBrief(e.target.value)} rows={2}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" placeholder="A brief idea of what the event covers" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Event Type</label>
                  <select value={descEventType} onChange={(e) => setDescEventType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                    {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Event Mode</label>
                  <select value={descEventMode} onChange={(e) => setDescEventMode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                    {EVENT_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {aiMode === 'agenda' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Event Title *</label>
                <input type="text" value={agendaTitle} onChange={(e) => setAgendaTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" placeholder="e.g., Annual Strategy Meeting" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Description</label>
                <textarea value={agendaDesc} onChange={(e) => setAgendaDesc(e.target.value)} rows={3}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Objectives (comma-separated)</label>
                <textarea value={agendaObjectives} onChange={(e) => setAgendaObjectives(e.target.value)} rows={2}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" placeholder="Align team goals, Review Q2 results" />
              </div>
            </div>
          )}

          {aiMode === 'checklist' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Event Title *</label>
                <input type="text" value={checkTitle} onChange={(e) => setCheckTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" placeholder="e.g., Product Launch Event" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Event Type</label>
                  <select value={checkEventType} onChange={(e) => setCheckEventType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                    {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Event Mode</label>
                  <select value={checkEventMode} onChange={(e) => setCheckEventMode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                    {EVENT_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {aiMode === 'mom' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Event/Meeting Title *</label>
                <input type="text" value={momTitle} onChange={(e) => setMomTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" placeholder="e.g., Weekly Team Sync" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Date</label>
                  <input type="text" value={momDate} onChange={(e) => setMomDate(e.target.value)} placeholder="e.g., 2024-01-15"
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
                </div>
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Attendees</label>
                  <input type="text" value={momAttendees} onChange={(e) => setMomAttendees(e.target.value)} placeholder="Comma-separated names"
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Raw Meeting Notes *</label>
                <textarea value={momNotes} onChange={(e) => setMomNotes(e.target.value)} rows={4}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" placeholder="Paste your raw meeting notes here" />
              </div>
            </div>
          )}

          {aiMode === 'enhance' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Enhancement Type</label>
                <select value={enhanceType} onChange={(e) => setEnhanceType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  <option value="grammar">Grammar Improvements</option>
                  <option value="tone">Professional Tone</option>
                  <option value="expand">Expand Content</option>
                  <option value="simplify">Simplify Content</option>
                  <option value="format">Professional Formatting</option>
                  <option value="keypoints">Extract Key Points</option>
                  <option value="mom">Convert to MoM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Title (optional)</label>
                <input type="text" value={enhanceTitle} onChange={(e) => setEnhanceTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Content to Enhance *</label>
                <textarea value={enhanceContent} onChange={(e) => setEnhanceContent(e.target.value)} rows={6}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" placeholder="Paste the content you want to enhance" />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || (aiMode === 'description' && !descTitle) || (aiMode === 'agenda' && !agendaTitle) || (aiMode === 'checklist' && !checkTitle) || (aiMode === 'mom' && !momTitle) || (aiMode === 'enhance' && !enhanceContent)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#C8FF2E] hover:bg-[#d4ff5c] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isGenerating ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4" />Generate with AI</>
            )}
          </button>
        </div>

        {/* Result Panel */}
        <div className="bg-[#151920] rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-medium mb-3">Result</h3>
          {aiError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />{aiError}
            </div>
          )}
          {aiResult ? (
            <div className="space-y-3">
              {renderStructuredResult()}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigator.clipboard.writeText(aiResult)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm hover:border-[#C8FF2E]/30 transition-colors"
                >Copy JSON</button>
              </div>
              {/* Save to Event Section */}
              {aiMode !== 'enhance' && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50"
                    >
                      <option value="">Select event to save to...</option>
                      {events.map(e => (
                        <option key={e.id} value={e.id}>{e.title}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSaveResult}
                      disabled={!selectedEventId || isSaving}
                      className="px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                    >
                      {isSaving ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save to Event</>}
                    </button>
                  </div>
                  {saveSuccess && (
                    <div className="mt-2 flex items-center gap-2 text-[#C8FF2E] text-sm">
                      <CheckCircle2 className="w-4 h-4" />{saveSuccess}
                    </div>
                  )}
                </div>
              )}
              {aiMode === 'enhance' && events.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50"
                    >
                      <option value="">Select event to save enhanced content...</option>
                      {events.map(e => (
                        <option key={e.id} value={e.id}>{e.title}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSaveResult}
                      disabled={!selectedEventId || isSaving}
                      className="px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                    >
                      {isSaving ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save to Event</>}
                    </button>
                  </div>
                  {saveSuccess && (
                    <div className="mt-2 flex items-center gap-2 text-[#C8FF2E] text-sm">
                      <CheckCircle2 className="w-4 h-4" />{saveSuccess}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
              <p className="text-[#878e9a]">Fill in the input fields and click Generate to create AI-powered event content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}