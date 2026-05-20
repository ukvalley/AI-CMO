/**
 * Course Management Module
 *
 * Centralised course content management with chapters, lessons,
 * categories, and AI-powered content generation.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap, BookOpen, FolderOpen, Layers, Plus, Edit3,
  Trash2, Search, ChevronDown, ChevronRight, X, Sparkles,
  LayoutGrid, List, FileText, Video, Clock, Eye, Star, Globe,
  Lock, Users, Tag, ArrowUpDown, MoreVertical, Check, AlertCircle,
  Save, Loader2, CheckCircle2,
} from 'lucide-react';
import { useAuthStore, useCompanyStore } from '@/stores';
import { useDataStore } from '@/stores/dataStore';
import { courseApi, courseCategoryApi, courseChapterApi, courseLessonApi } from '@/services/api';
import type {
  Course, CourseCategory, CourseChapter, CourseLesson,
  CourseStatus, CourseVisibility, CourseDifficulty, CourseFormat,
  CourseAudienceType, ChapterStatus, LessonFormat, LessonStatus,
  CourseCategoryStatus, QuizQuestion,
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
// INLINE AI GENERATE BUTTON
// ============================================

const FIELD_AI_PROMPTS: Record<string, { system: string; promptFn: (ctx: string) => string; maxTokens: number }> = {
  shortDescription: { system: 'You are a course content creator. Write concise course descriptions. Use British English. Respond with plain text only, no JSON.', promptFn: (ctx) => `Write a concise course short description (max 200 characters) for: ${ctx}`, maxTokens: 300 },
  detailedDescription: { system: 'You are a course content creator. Write detailed course descriptions. Use British English. Respond with plain text only, no JSON.', promptFn: (ctx) => `Write a detailed course description (2-3 paragraphs) for: ${ctx}`, maxTokens: 1500 },
  summary: { system: 'You are a course content creator. Write concise summaries. Use British English. Respond with plain text only, no JSON.', promptFn: (ctx) => `Write a 1-2 sentence course summary for: ${ctx}`, maxTokens: 300 },
  learningObjectives: { system: 'You are a course content creator. Generate learning objectives. Use British English. Respond with a JSON array of strings only.', promptFn: (ctx) => `Generate 5 learning objectives for the course: ${ctx}`, maxTokens: 800, },
  outcomes: { system: 'You are a course content creator. Generate expected outcomes. Use British English. Respond with a JSON array of strings only.', promptFn: (ctx) => `Generate 5 expected outcomes for the course: ${ctx}`, maxTokens: 800 },
  internalNotes: { system: 'You are a course planner. Write internal planning notes. Use British English. Respond with plain text only, no JSON.', promptFn: (ctx) => `Write internal planning notes for the course: ${ctx}`, maxTokens: 600 },
  metaDescription: { system: 'You are an SEO expert. Write SEO meta descriptions. Use British English. Respond with plain text only, no JSON.', promptFn: (ctx) => `Write an SEO meta description (max 160 characters) for: ${ctx}`, maxTokens: 300 },
  chapterDescription: { system: 'You are a course content creator. Write chapter descriptions. Use British English. Respond with plain text only, no JSON.', promptFn: (ctx) => `Write a chapter description for: ${ctx}`, maxTokens: 800 },
  chapterObjectives: { system: 'You are a course content creator. Generate learning objectives. Use British English. Respond with a JSON array of strings only.', promptFn: (ctx) => `Generate learning objectives for chapter: ${ctx}`, maxTokens: 600 },
  lessonDescription: { system: 'You are a course content creator. Write lesson descriptions. Use British English. Respond with plain text only, no JSON.', promptFn: (ctx) => `Write a lesson description for: ${ctx}`, maxTokens: 800 },
  lessonContent: { system: 'You are a course content creator. Write comprehensive lesson content. Use British English. Respond with plain text only, no JSON.', promptFn: (ctx) => `Write comprehensive lesson content for: ${ctx}`, maxTokens: 2000 },
  lessonObjectives: { system: 'You are a course content creator. Generate learning objectives. Use British English. Respond with a JSON array of strings only.', promptFn: (ctx) => `Generate learning objectives for lesson: ${ctx}`, maxTokens: 600 },
  keyTakeaways: { system: 'You are a course content creator. Generate key takeaways. Use British English. Respond with a JSON array of strings only.', promptFn: (ctx) => `Generate key takeaways for lesson: ${ctx}`, maxTokens: 600 },
  lessonNotes: { system: 'You are a course content creator. Write internal teaching notes. Use British English. Respond with plain text only, no JSON.', promptFn: (ctx) => `Write internal teaching notes for lesson: ${ctx}`, maxTokens: 600 },
};

function InlineAIGenerate({
  fieldType, context, onGenerated, isGeneratingField, setIsGeneratingField,
}: {
  fieldType: string;
  context: string;
  onGenerated: (text: string) => void;
  isGeneratingField: boolean;
  setIsGeneratingField: (v: boolean) => void;
}) {
  const config = FIELD_AI_PROMPTS[fieldType];
  if (!config) return null;

  const handleGenerate = async () => {
    setIsGeneratingField(true);
    try {
      const title = context || 'Untitled';
      const prompt = config.promptFn(title);
      const result = await withRetry(() => callGLM(
        [{ role: 'system', content: config.system }, { role: 'user', content: prompt }],
        { temperature: 0.7, maxTokens: config.maxTokens }
      ));
      if (['learningObjectives', 'outcomes', 'chapterObjectives', 'lessonObjectives', 'keyTakeaways'].includes(fieldType)) {
        const parsed = parseJsonFromAI(result);
        if (Array.isArray(parsed)) {
          onGenerated(parsed.join(', '));
        } else {
          onGenerated(result);
        }
      } else {
        onGenerated(result.trim());
      }
    } catch (err: any) {
      console.error('Inline AI generation failed:', err);
    } finally {
      setIsGeneratingField(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={isGeneratingField || !context}
      title={`AI Generate ${fieldType.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[#C8FF2E]/10 text-[#C8FF2E] hover:bg-[#C8FF2E]/20 rounded border border-[#C8FF2E]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {isGeneratingField ? <div className="w-3 h-3 border-2 border-[#C8FF2E]/30 border-t-[#C8FF2E] rounded-full animate-spin" /> : <Sparkles className="w-3 h-3" />}
      AI
    </button>
  );
}

// ============================================
// CONSTANTS
// ============================================

const COURSE_STATUSES: { value: CourseStatus; label: string; colour: string }[] = [
  { value: 'draft', label: 'Draft', colour: 'bg-[#525662]' },
  { value: 'review', label: 'Review', colour: 'bg-amber-500' },
  { value: 'approved', label: 'Approved', colour: 'bg-blue-500' },
  { value: 'published', label: 'Published', colour: 'bg-green-500' },
  { value: 'archived', label: 'Archived', colour: 'bg-[#686f7e]' },
];

const COURSE_FORMATS: { value: CourseFormat; label: string }[] = [
  { value: 'video', label: 'Video' },
  { value: 'text', label: 'Text' },
  { value: 'live', label: 'Live' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'workshop', label: 'Workshop' },
];

const COURSE_DIFFICULTIES: { value: CourseDifficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const COURSE_VISIBILITIES: { value: CourseVisibility; label: string }[] = [
  { value: 'private', label: 'Private' },
  { value: 'internal', label: 'Internal' },
  { value: 'public', label: 'Public' },
];

const AUDIENCE_TYPES: { value: CourseAudienceType; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'internal', label: 'Internal' },
  { value: 'team-specific', label: 'Team Specific' },
  { value: 'department-specific', label: 'Department Specific' },
  { value: 'admin-only', label: 'Admin Only' },
];

const LESSON_FORMATS: { value: LessonFormat; label: string }[] = [
  { value: 'video', label: 'Video' },
  { value: 'text', label: 'Text' },
  { value: 'audio', label: 'Audio' },
  { value: 'pdf', label: 'PDF' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'interactive', label: 'Interactive' },
  { value: 'quiz', label: 'Quiz' },
];

const CHAPTER_STATUSES: { value: ChapterStatus; label: string; colour: string }[] = [
  { value: 'draft', label: 'Draft', colour: 'bg-[#525662]' },
  { value: 'review', label: 'Review', colour: 'bg-amber-500' },
  { value: 'approved', label: 'Approved', colour: 'bg-blue-500' },
  { value: 'published', label: 'Published', colour: 'bg-green-500' },
];

const LESSON_STATUSES: { value: LessonStatus; label: string; colour: string }[] = [
  { value: 'draft', label: 'Draft', colour: 'bg-[#525662]' },
  { value: 'review', label: 'Review', colour: 'bg-amber-500' },
  { value: 'approved', label: 'Approved', colour: 'bg-blue-500' },
  { value: 'published', label: 'Published', colour: 'bg-green-500' },
];

type TabId = 'courses' | 'categories' | 'chapters' | 'lessons' | 'ai-generate';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'courses', label: 'Courses', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'categories', label: 'Categories', icon: <FolderOpen className="w-4 h-4" /> },
  { id: 'chapters', label: 'Chapters', icon: <Layers className="w-4 h-4" /> },
  { id: 'lessons', label: 'Lessons', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'ai-generate', label: 'AI Generate', icon: <Sparkles className="w-4 h-4" /> },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const getStatusBadge = (status: string, statuses: { value: string; label: string; colour: string }[]) => {
  const s = statuses.find(st => st.value === status);
  if (!s) return <span className="px-2 py-0.5 rounded text-xs bg-[#525662] text-[#afb6c4]">{status}</span>;
  return <span className={`px-2 py-0.5 rounded text-xs ${s.colour} text-white`}>{s.label}</span>;
};

const getFormatIcon = (format: string) => {
  switch (format) {
    case 'video': return <Video className="w-3.5 h-3.5 text-purple-400" />;
    case 'text': return <FileText className="w-3.5 h-3.5 text-blue-400" />;
    default: return <BookOpen className="w-3.5 h-3.5 text-[#878e9a]" />;
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function CoursesPage() {
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

  // Sync data store's activeCompanyId with company store
  useEffect(() => {
    if (companyId) {
      setActiveCompany(companyId);
    }
  }, [companyId]);

  // Derive data from Zustand store
  const courses = useMemo(() => (getItems('courses') as Course[]) || [], [getItems, storeData, storeActiveCompanyId]);
  const categories = useMemo(() => (getItems('courseCategories') as CourseCategory[]) || [], [getItems, storeData, storeActiveCompanyId]);
  const chapters = useMemo(() => (getItems('courseChapters') as CourseChapter[]) || [], [getItems, storeData, storeActiveCompanyId]);
  const lessons = useMemo(() => (getItems('courseLessons') as CourseLesson[]) || [], [getItems, storeData, storeActiveCompanyId]);

  const [activeTab, setActiveTab] = useState<TabId>('courses');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [editingChapter, setEditingChapter] = useState<CourseChapter | null>(null);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);

  // Context selectors
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');

  // Detail view state
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [viewingChapter, setViewingChapter] = useState<CourseChapter | null>(null);
  const [viewingLesson, setViewingLesson] = useState<CourseLesson | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');

  // ============================================
  // HELPERS
  // ============================================

  /** Normalize API responses that may be a raw array or wrapped in { data: [...] } */
  const normalizeResponse = <T,>(res: any): T[] => {
    if (Array.isArray(res)) return res as T[];
    if (res?.data && Array.isArray(res.data)) return res.data as T[];
    return [];
  };

  /** Local-first merge: existing items win on ID collision, new items from remote are added */
  const mergeById = <T extends { id: string }>(local: T[], remote: T[]): T[] => {
    const map = new Map<string, T>();
    local.forEach(item => map.set(item.id, item));
    remote.forEach(item => { if (!map.has(item.id)) map.set(item.id, item); });
    return Array.from(map.values());
  };

  // ============================================
  // BEFOREUNLOAD PROTECTION
  // ============================================

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  // ============================================
  // DATA LOADING (dual-write: API → mergeById → Zustand store)
  // ============================================

  useEffect(() => {
    if (!companyId) return;
    loadData();
  }, [companyId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        courseApi.getAll(companyId),
        courseCategoryApi.getAll(companyId),
      ]);
      const remoteCourses = normalizeResponse<Course>(coursesRes);
      const remoteCategories = normalizeResponse<CourseCategory>(categoriesRes);

      // Merge with any existing local data (local-first)
      const localCourses = (getItems('courses') as Course[]) || [];
      const localCategories = (getItems('courseCategories') as CourseCategory[]) || [];
      setItems('courses', mergeById(localCourses, remoteCourses));
      setItems('courseCategories', mergeById(localCategories, remoteCategories));
    } catch (error) {
      console.error('Failed to load courses data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChapters = async (courseId: string) => {
    try {
      const res = await courseChapterApi.getAll(courseId);
      const remoteChapters = normalizeResponse<CourseChapter>(res);
      const localChapters = (getItems('courseChapters') as CourseChapter[]) || [];
      setItems('courseChapters', mergeById(localChapters, remoteChapters));
    } catch (error) {
      console.error('Failed to load chapters:', error);
    }
  };

  const loadLessons = async (chapterId: string) => {
    try {
      const res = await courseLessonApi.getAll(chapterId);
      const remoteLessons = normalizeResponse<CourseLesson>(res);
      const localLessons = (getItems('courseLessons') as CourseLesson[]) || [];
      setItems('courseLessons', mergeById(localLessons, remoteLessons));
    } catch (error) {
      console.error('Failed to load lessons:', error);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      loadChapters(selectedCourseId);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedChapterId) {
      loadLessons(selectedChapterId);
    }
  }, [selectedChapterId]);

  // Category lookup map
  const categoryMap = useMemo(() => {
    const map: Record<string, CourseCategory> = {};
    categories.forEach(c => { map[c.id] = c; });
    return map;
  }, [categories]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    let filtered = courses;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.shortDescription?.toLowerCase().includes(q) ||
        c.department?.toLowerCase().includes(q) ||
        c.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter) filtered = filtered.filter(c => c.status === statusFilter);
    if (difficultyFilter) filtered = filtered.filter(c => c.difficulty === difficultyFilter);
    return filtered;
  }, [courses, searchQuery, statusFilter, difficultyFilter]);

  // ============================================
  // CRUD HANDLERS (dual-write: Zustand store first, then API)
  // ============================================

  // Course handlers
  const handleCreateCourse = async (data: Partial<Course>) => {
    try {
      const localId = addItem('courses', { ...data, companyId } as any);
      setShowCourseForm(false);
      const res = await courseApi.create({ ...data, companyId } as any);
      const serverData = (res as any)?.data || res;
      if (serverData?.id && serverData.id !== localId) {
        updateItem('courses', localId, { id: serverData.id } as any);
      }
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const handleUpdateCourse = async (data: Partial<Course>) => {
    if (!editingCourse) return;
    const id = editingCourse.id;
    try {
      updateItem('courses', id, data as any);
      setEditingCourse(null);
      setShowCourseForm(false);
      await courseApi.update(id, data);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteCourse = async (course: Course) => {
    if (!confirm('Delete this course and all its chapters/lessons?')) return;
    const id = course.id;
    try {
      deleteItem('courses', id);
      // Also remove related chapters and lessons from store
      const relatedChapters = (getItems('courseChapters') as CourseChapter[]).filter(c => c.courseId === id);
      relatedChapters.forEach(ch => {
        deleteItem('courseChapters', ch.id);
        const relatedLessons = (getItems('courseLessons') as CourseLesson[]).filter(l => l.chapterId === ch.id);
        relatedLessons.forEach(l => deleteItem('courseLessons', l.id));
      });
      await courseApi.delete(id);
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  // Category handlers
  const handleCreateCategory = async (data: Partial<CourseCategory>) => {
    try {
      const localId = addItem('courseCategories', { ...data, companyId } as any);
      setShowCategoryForm(false);
      const res = await courseCategoryApi.create({ ...data, companyId } as any);
      const serverData = (res as any)?.data || res;
      if (serverData?.id && serverData.id !== localId) {
        updateItem('courseCategories', localId, { id: serverData.id } as any);
      }
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleUpdateCategory = async (data: Partial<CourseCategory>) => {
    if (!editingCategory) return;
    const id = editingCategory.id;
    try {
      updateItem('courseCategories', id, data as any);
      setEditingCategory(null);
      setShowCategoryForm(false);
      await courseCategoryApi.update(id, data);
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (category: CourseCategory) => {
    if (!confirm('Delete this category?')) return;
    const id = category.id;
    try {
      deleteItem('courseCategories', id);
      await courseCategoryApi.delete(id);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  // Chapter handlers
  const handleCreateChapter = async (data: Partial<CourseChapter>) => {
    if (!selectedCourseId) return;
    try {
      const localId = addItem('courseChapters', { ...data, courseId: selectedCourseId, companyId } as any);
      setShowChapterForm(false);
      const res = await courseChapterApi.create({ ...data, courseId: selectedCourseId, companyId } as any);
      const serverData = (res as any)?.data || res;
      if (serverData?.id && serverData.id !== localId) {
        updateItem('courseChapters', localId, { id: serverData.id } as any);
      }
    } catch (error) {
      console.error('Failed to create chapter:', error);
    }
  };

  const handleUpdateChapter = async (data: Partial<CourseChapter>) => {
    if (!editingChapter) return;
    const id = editingChapter.id;
    try {
      updateItem('courseChapters', id, data as any);
      setEditingChapter(null);
      setShowChapterForm(false);
      await courseChapterApi.update(id, data);
    } catch (error) {
      console.error('Failed to update chapter:', error);
    }
  };

  const handleDeleteChapter = async (chapter: CourseChapter) => {
    if (!confirm('Delete this chapter and all its lessons?')) return;
    const id = chapter.id;
    try {
      deleteItem('courseChapters', id);
      // Also remove related lessons from store
      const relatedLessons = (getItems('courseLessons') as CourseLesson[]).filter(l => l.chapterId === id);
      relatedLessons.forEach(l => deleteItem('courseLessons', l.id));
      await courseChapterApi.delete(id);
    } catch (error) {
      console.error('Failed to delete chapter:', error);
    }
  };

  // Lesson handlers
  const handleCreateLesson = async (data: Partial<CourseLesson>) => {
    if (!selectedChapterId || !selectedCourseId) return;
    try {
      const localId = addItem('courseLessons', { ...data, chapterId: selectedChapterId, courseId: selectedCourseId, companyId } as any);
      setShowLessonForm(false);
      const res = await courseLessonApi.create({ ...data, chapterId: selectedChapterId, courseId: selectedCourseId, companyId } as any);
      const serverData = (res as any)?.data || res;
      if (serverData?.id && serverData.id !== localId) {
        updateItem('courseLessons', localId, { id: serverData.id } as any);
      }
    } catch (error) {
      console.error('Failed to create lesson:', error);
    }
  };

  const handleUpdateLesson = async (data: Partial<CourseLesson>) => {
    if (!editingLesson) return;
    const id = editingLesson.id;
    try {
      updateItem('courseLessons', id, data as any);
      setEditingLesson(null);
      setShowLessonForm(false);
      await courseLessonApi.update(id, data);
    } catch (error) {
      console.error('Failed to update lesson:', error);
    }
  };

  const handleDeleteLesson = async (lesson: CourseLesson) => {
    if (!confirm('Delete this lesson?')) return;
    const id = lesson.id;
    try {
      deleteItem('courseLessons', id);
      await courseLessonApi.delete(id);
    } catch (error) {
      console.error('Failed to delete lesson:', error);
    }
  };

  if (!companyId) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Courses</h1>
        <p className="text-[#878e9a]">Please select a company to manage courses.</p>
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
            <GraduationCap className="w-8 h-8 text-[#8B5CF6]" />
            <h1 className="text-3xl font-bold text-white">Courses</h1>
          </div>
          {/* Save Status Indicator */}
          <div className="flex items-center gap-2 text-xs">
            {hasUnsavedChanges ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                Unsaved changes
              </span>
            ) : isSaving ? (
              <span className="flex items-center gap-1.5 text-[#878e9a]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1.5 text-green-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All changes saved
              </span>
            ) : null}
          </div>
        </div>
        <p className="text-[#878e9a]">
          Centralised course content management with chapters, lessons, categories, and AI generation.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-[#151920] rounded-lg p-1 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#C8FF2E]/10 text-[#C8FF2E]'
                : 'text-[#878e9a] hover:text-[#afb6c4] hover:bg-[#1a1d21]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'courses' && (
        <CoursesTab
          courses={filteredCourses}
          categories={categories}
          categoryMap={categoryMap}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          onCreate={() => { setEditingCourse(null); setShowCourseForm(true); }}
          onEdit={(course) => { setEditingCourse(course); setShowCourseForm(true); }}
          onDelete={handleDeleteCourse}
          onSelectCourse={(id) => { setSelectedCourseId(id); setActiveTab('chapters'); }}
          onViewCourse={(course) => setViewingCourse(course)}
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

      {activeTab === 'chapters' && (
        <ChaptersTab
          chapters={chapters}
          courses={courses}
          selectedCourseId={selectedCourseId}
          setSelectedCourseId={setSelectedCourseId}
          onCreate={() => { if (!selectedCourseId) return alert('Select a course first'); setEditingChapter(null); setShowChapterForm(true); }}
          onEdit={(chapter) => { setEditingChapter(chapter); setShowChapterForm(true); }}
          onDelete={handleDeleteChapter}
          onSelectChapter={(id) => { setSelectedChapterId(id); setActiveTab('lessons'); }}
          onViewChapter={(chapter) => setViewingChapter(chapter)}
        />
      )}

      {activeTab === 'lessons' && (
        <LessonsTab
          lessons={lessons}
          chapters={chapters}
          courses={courses}
          selectedCourseId={selectedCourseId}
          selectedChapterId={selectedChapterId}
          setSelectedCourseId={(id) => { setSelectedCourseId(id); }}
          setSelectedChapterId={setSelectedChapterId}
          onCreate={() => { if (!selectedChapterId) return alert('Select a chapter first'); setEditingLesson(null); setShowLessonForm(true); }}
          onEdit={(lesson) => { setEditingLesson(lesson); setShowLessonForm(true); }}
          onDelete={handleDeleteLesson}
          onViewLesson={(lesson) => setViewingLesson(lesson)}
        />
      )}

      {activeTab === 'ai-generate' && (
        <AIGenerateTab
          courses={courses}
          companyId={companyId}
          onCourseCreated={loadData}
        />
      )}

      {/* Course Form Modal */}
      {showCourseForm && (
        <CourseForm
          course={editingCourse}
          categories={categories}
          onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
          onCancel={() => { setShowCourseForm(false); setEditingCourse(null); }}
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

      {/* Chapter Form Modal */}
      {showChapterForm && (
        <ChapterForm
          chapter={editingChapter}
          onSubmit={editingChapter ? handleUpdateChapter : handleCreateChapter}
          onCancel={() => { setShowChapterForm(false); setEditingChapter(null); }}
        />
      )}

      {/* Lesson Form Modal */}
      {showLessonForm && (
        <LessonForm
          lesson={editingLesson}
          onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson}
          onCancel={() => { setShowLessonForm(false); setEditingLesson(null); }}
        />
      )}

      {/* Detail View Panels */}
      {viewingCourse && (
        <CourseDetailView
          course={viewingCourse}
          categories={categories}
          chapters={chapters}
          lessons={lessons}
          onClose={() => setViewingCourse(null)}
          onEdit={() => { setEditingCourse(viewingCourse); setShowCourseForm(true); setViewingCourse(null); }}
        />
      )}
      {viewingChapter && (
        <ChapterDetailView
          chapter={viewingChapter}
          lessons={lessons}
          onClose={() => setViewingChapter(null)}
          onEdit={() => { setEditingChapter(viewingChapter); setShowChapterForm(true); setViewingChapter(null); }}
        />
      )}
      {viewingLesson && (
        <LessonDetailView
          lesson={viewingLesson}
          onClose={() => setViewingLesson(null)}
          onEdit={() => { setEditingLesson(viewingLesson); setShowLessonForm(true); setViewingLesson(null); }}
        />
      )}
    </div>
  );
}

// ============================================
// DETAIL VIEW PANELS
// ============================================

function DetailPanel({ title, onClose, onEdit, children }: {
  title: string;
  onClose: () => void;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0d1117] border-l border-white/10 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-[#0d1117] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button onClick={onEdit} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#C8FF2E]/10 text-[#C8FF2E] hover:bg-[#C8FF2E]/20 rounded border border-[#C8FF2E]/30 transition-colors">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
            <button onClick={onClose} className="p-1.5 text-[#686f7e] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">{children}</div>
      </div>
    </div>
  );
}

function CourseDetailView({
  course, categories, chapters, lessons, onClose, onEdit,
}: {
  course: Course;
  categories: CourseCategory[];
  chapters: CourseChapter[];
  lessons: CourseLesson[];
  onClose: () => void;
  onEdit: () => void;
}) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const category = course.categoryId ? categories.find(c => (c.id || (c as any)._id) === course.categoryId) : null;
  const courseChapters = chapters
    .filter(c => c.courseId === (course.id || (course as any)._id))
    .sort((a, b) => a.order - b.order);

  return (
    <DetailPanel title={course.title} onClose={onClose} onEdit={onEdit}>
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {getStatusBadge(course.status, COURSE_STATUSES)}
        <span className="px-2 py-0.5 rounded text-xs bg-[#C8FF2E]/10 text-[#C8FF2E] capitalize">{course.format}</span>
        <span className="px-2 py-0.5 rounded text-xs bg-[#525662] text-[#afb6c4] capitalize">{course.difficulty}</span>
        {course.isFeatured && <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">Featured</span>}
        <span className="px-2 py-0.5 rounded text-xs bg-[#525662] text-[#afb6c4] capitalize">{course.visibility}</span>
      </div>

      {/* Core Info */}
      {course.shortDescription && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Short Description</label>
          <p className="text-white text-sm mt-1">{course.shortDescription}</p>
        </div>
      )}
      {course.detailedDescription && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Detailed Description</label>
          <p className="text-[#afb6c4] text-sm mt-1 whitespace-pre-wrap">{course.detailedDescription}</p>
        </div>
      )}
      {course.summary && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Summary</label>
          <p className="text-[#afb6c4] text-sm mt-1">{course.summary}</p>
        </div>
      )}

      {/* Meta Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {category && (
          <div className="bg-[#151920] rounded-lg p-3">
            <label className="text-xs text-[#878e9a]">Category</label>
            <p className="text-white text-sm">{category.name}</p>
          </div>
        )}
        {course.duration && (
          <div className="bg-[#151920] rounded-lg p-3">
            <label className="text-xs text-[#878e9a]">Duration</label>
            <p className="text-white text-sm">{course.duration}</p>
          </div>
        )}
        {course.instructor && (
          <div className="bg-[#151920] rounded-lg p-3">
            <label className="text-xs text-[#878e9a]">Instructor</label>
            <p className="text-white text-sm">{course.instructor}</p>
          </div>
        )}
        <div className="bg-[#151920] rounded-lg p-3">
          <label className="text-xs text-[#878e9a]">Lessons</label>
          <p className="text-white text-sm">{course.lessonCount ?? 0}</p>
        </div>
        <div className="bg-[#151920] rounded-lg p-3">
          <label className="text-xs text-[#878e9a]">Enrolments</label>
          <p className="text-white text-sm">{course.enrolmentCount ?? 0}</p>
        </div>
        <div className="bg-[#151920] rounded-lg p-3">
          <label className="text-xs text-[#878e9a]">Version</label>
          <p className="text-white text-sm">v{course.version ?? 1}</p>
        </div>
      </div>

      {/* Learning Objectives */}
      {course.learningObjectives?.length > 0 && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Learning Objectives</label>
          <ul className="mt-1 space-y-1">
            {course.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]">
                <Check className="w-4 h-4 text-[#C8FF2E] mt-0.5 flex-shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Outcomes */}
      {course.outcomes?.length > 0 && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Outcomes</label>
          <ul className="mt-1 space-y-1">
            {course.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]">
                <Star className="w-4 h-4 text-[#C8FF2E] mt-0.5 flex-shrink-0" />
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Course Structure */}
      <div>
        <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Course Structure</label>
        {courseChapters.length === 0 ? (
          <p className="text-[#686f7e] text-sm mt-1">No chapters yet.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {courseChapters.map(ch => {
              const chLessons = lessons.filter(l => l.chapterId === (ch.id || (ch as any)._id)).sort((a, b) => a.order - b.order);
              const isExpanded = expandedChapter === (ch.id || (ch as any)._id);
              return (
                <div key={ch.id || (ch as any)._id} className="bg-[#151920] rounded-lg border border-white/5">
                  <div
                    className="flex items-center gap-2 p-3 cursor-pointer hover:bg-[#1a1d21] transition-colors"
                    onClick={() => setExpandedChapter(isExpanded ? null : (ch.id || (ch as any)._id))}
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-[#878e9a]" /> : <ChevronRight className="w-4 h-4 text-[#878e9a]" />}
                    <span className="text-white text-sm font-medium flex-1">Ch {ch.order + 1}: {ch.title}</span>
                    {getStatusBadge(ch.status, CHAPTER_STATUSES)}
                    <span className="text-xs text-[#686f7e]">{ch.lessonCount ?? 0} lessons</span>
                  </div>
                  {isExpanded && chLessons.length > 0 && (
                    <div className="px-3 pb-3 space-y-1">
                      {chLessons.map(les => {
                        const quizCount = les.quizQuestions?.length || 0;
                        return (
                          <div key={les.id || (les as any)._id} className="flex items-center gap-2 text-sm text-[#878e9a] py-1 px-2 rounded hover:bg-[#1a1d21]">
                            {getFormatIcon(les.format)}
                            <span className="flex-1">{les.title}</span>
                            {quizCount > 0 && <span className="text-[#C8FF2E] text-xs">{quizCount} Qs</span>}
                            {getStatusBadge(les.status, LESSON_STATUSES)}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DetailPanel>
  );
}

function ChapterDetailView({
  chapter, lessons, onClose, onEdit,
}: {
  chapter: CourseChapter;
  lessons: CourseLesson[];
  onClose: () => void;
  onEdit: () => void;
}) {
  const chapterLessons = lessons
    .filter(l => l.chapterId === (chapter.id || (chapter as any)._id))
    .sort((a, b) => a.order - b.order);

  return (
    <DetailPanel title={chapter.title} onClose={onClose} onEdit={onEdit}>
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {getStatusBadge(chapter.status, CHAPTER_STATUSES)}
        <span className="px-2 py-0.5 rounded text-xs bg-[#525662] text-[#afb6c4]">Order: {chapter.order + 1}</span>
        {chapter.duration && <span className="px-2 py-0.5 rounded text-xs bg-[#525662] text-[#afb6c4]">{chapter.duration}</span>}
      </div>

      {chapter.description && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Description</label>
          <p className="text-[#afb6c4] text-sm mt-1 whitespace-pre-wrap">{chapter.description}</p>
        </div>
      )}

      {chapter.learningObjectives?.length > 0 && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Learning Objectives</label>
          <ul className="mt-1 space-y-1">
            {chapter.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]">
                <Check className="w-4 h-4 text-[#C8FF2E] mt-0.5 flex-shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lessons List */}
      <div>
        <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Lessons ({chapterLessons.length})</label>
        {chapterLessons.length === 0 ? (
          <p className="text-[#686f7e] text-sm mt-1">No lessons yet.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {chapterLessons.map(les => {
              const quizCount = les.quizQuestions?.length || 0;
              return (
                <div key={les.id || (les as any)._id} className="bg-[#151920] rounded-lg border border-white/5 p-3">
                  <div className="flex items-center gap-2">
                    {getFormatIcon(les.format)}
                    <span className="text-white text-sm font-medium flex-1">{les.title}</span>
                    {getStatusBadge(les.status, LESSON_STATUSES)}
                  </div>
                  {les.description && <p className="text-[#686f7e] text-xs mt-1">{les.description}</p>}
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#686f7e]">
                    <span className="capitalize">{les.format}</span>
                    {les.duration && <span>{les.duration}</span>}
                    {les.isFree && <span className="text-green-400">Free</span>}
                    {quizCount > 0 && <span className="text-[#C8FF2E]">{quizCount} quiz questions</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DetailPanel>
  );
}

function LessonDetailView({
  lesson, onClose, onEdit,
}: {
  lesson: CourseLesson;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <DetailPanel title={lesson.title} onClose={onClose} onEdit={onEdit}>
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {getFormatIcon(lesson.format)}
        {getStatusBadge(lesson.status, LESSON_STATUSES)}
        <span className="px-2 py-0.5 rounded text-xs bg-[#525662] text-[#afb6c4] capitalize">{lesson.format}</span>
        {lesson.duration && <span className="px-2 py-0.5 rounded text-xs bg-[#525662] text-[#afb6c4]">{lesson.duration}</span>}
        {lesson.isFree && <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">Free Preview</span>}
      </div>

      {lesson.description && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Description</label>
          <p className="text-[#afb6c4] text-sm mt-1 whitespace-pre-wrap">{lesson.description}</p>
        </div>
      )}

      {lesson.content && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Content</label>
          <div className="text-[#afb6c4] text-sm mt-1 whitespace-pre-wrap bg-[#151920] rounded-lg p-4 border border-white/5 max-h-[400px] overflow-y-auto">{lesson.content}</div>
        </div>
      )}

      {lesson.learningObjectives?.length > 0 && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Learning Objectives</label>
          <ul className="mt-1 space-y-1">
            {lesson.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]">
                <Check className="w-4 h-4 text-[#C8FF2E] mt-0.5 flex-shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {lesson.keyTakeaways?.length > 0 && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Key Takeaways</label>
          <ul className="mt-1 space-y-1">
            {lesson.keyTakeaways.map((tk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]">
                <Star className="w-4 h-4 text-[#C8FF2E] mt-0.5 flex-shrink-0" />
                {tk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quiz Questions */}
      {lesson.quizQuestions?.length > 0 && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Quiz Questions ({lesson.quizQuestions?.length || 0})</label>
          <div className="mt-2 space-y-3">
            {lesson.quizQuestions.map((q, qi) => (
              <div key={q.id || qi} className="bg-[#151920] rounded-lg border border-white/5 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#C8FF2E] text-xs font-medium">Q{qi + 1}</span>
                  <span className="text-white text-sm">{q.question}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {q.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className={`px-2 py-1.5 rounded text-xs ${oi === q.correctAnswer ? 'bg-[#C8FF2E]/15 text-[#C8FF2E] border border-[#C8FF2E]/30' : 'bg-[#0d1117] text-[#878e9a] border border-white/5'}`}
                    >
                      <span className="font-medium mr-1">{String.fromCharCode(65 + oi)}.</span>{opt}
                    </div>
                  ))}
                </div>
                {q.explanation && <p className="text-[#686f7e] text-xs mt-2 italic">Explanation: {q.explanation}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {lesson.internalNotes && (
        <div>
          <label className="text-xs font-medium text-[#878e9a] uppercase tracking-wider">Internal Notes</label>
          <p className="text-[#686f7e] text-sm mt-1 whitespace-pre-wrap bg-[#151920] rounded-lg p-3 border border-white/5">{lesson.internalNotes}</p>
        </div>
      )}
    </DetailPanel>
  );
}

// ============================================
// COURSES TAB
// ============================================

function CoursesTab({
  courses, categories, categoryMap, searchQuery, setSearchQuery,
  statusFilter, setStatusFilter, difficultyFilter, setDifficultyFilter,
  onCreate, onEdit, onDelete, onSelectCourse, onViewCourse,
}: {
  courses: Course[];
  categories: CourseCategory[];
  categoryMap: Record<string, CourseCategory>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (d: string) => void;
  onCreate: () => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onSelectCourse: (id: string) => void;
  onViewCourse: (course: Course) => void;
}) {
  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#686f7e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50"
        >
          <option value="">All Statuses</option>
          {COURSE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50"
        >
          <option value="">All Levels</option>
          {COURSE_DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>

        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Table */}
      {courses.length === 0 ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <GraduationCap className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">No courses found. Create your first course to get started.</p>
        </div>
      ) : (
        <div className="bg-[#151920] rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Format</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Difficulty</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Lessons</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#878e9a] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const id = course.id || (course as any)._id;
                return (
                  <tr
                    key={id}
                    className="border-b border-white/5 hover:bg-[#1a1d21] cursor-pointer transition-colors"
                    onClick={() => onSelectCourse(id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getFormatIcon(course.format)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-medium">{course.title}</span>
                            {course.isFeatured && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                          </div>
                          {course.shortDescription && (
                            <div className="text-[#686f7e] text-xs truncate max-w-[200px]">{course.shortDescription}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#afb6c4]">
                      {course.categoryId ? (categoryMap[course.categoryId]?.name || course.categoryId) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#afb6c4] capitalize">{course.format}</td>
                    <td className="px-4 py-3 text-sm text-[#afb6c4] capitalize">{course.difficulty}</td>
                    <td className="px-4 py-3">{getStatusBadge(course.status, COURSE_STATUSES)}</td>
                    <td className="px-4 py-3 text-sm text-[#afb6c4]">{course.lessonCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onViewCourse(course)}
                          className="p-1.5 text-[#878e9a] hover:text-blue-400 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(course)}
                          className="p-1.5 text-[#878e9a] hover:text-[#C8FF2E] transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(course)}
                          className="p-1.5 text-[#878e9a] hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

function CategoriesTab({
  categories, onCreate, onEdit, onDelete,
}: {
  categories: CourseCategory[];
  onCreate: () => void;
  onEdit: (cat: CourseCategory) => void;
  onDelete: (cat: CourseCategory) => void;
}) {
  const topLevelCategories = categories.filter(c => !c.parentId);
  const getChildCategories = (parentId: string) => categories.filter(c => c.parentId === parentId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Course Categories</h2>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {topLevelCategories.length === 0 ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <FolderOpen className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">No categories yet. Create your first category.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {topLevelCategories.map(cat => {
            const id = cat.id || (cat as any)._id;
            const children = getChildCategories(id);
            return (
              <div key={id} className="bg-[#151920] rounded-lg border border-white/10">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    {cat.colour && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.colour }} />
                    )}
                    <span className="text-white font-medium">{cat.name}</span>
                    <span className="text-xs text-[#686f7e]">{cat.courseCount} courses</span>
                    {cat.status === 'archived' && (
                      <span className="px-2 py-0.5 rounded text-xs bg-[#686f7e] text-white">Archived</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(cat)} className="p-1.5 text-[#878e9a] hover:text-[#C8FF2E]">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(cat)} className="p-1.5 text-[#878e9a] hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {children.length > 0 && (
                  <div className="pl-8 pb-2 space-y-1">
                    {children.map(child => {
                      const childId = child.id || (child as any)._id;
                      return (
                        <div key={childId} className="flex items-center justify-between px-4 py-2 rounded hover:bg-[#1a1d21]">
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-[#686f7e]" />
                            {child.colour && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: child.colour }} />}
                            <span className="text-[#afb6c4] text-sm">{child.name}</span>
                            <span className="text-xs text-[#686f7e]">{child.courseCount} courses</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => onEdit(child)} className="p-1 text-[#878e9a] hover:text-[#C8FF2E]">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => onDelete(child)} className="p-1 text-[#878e9a] hover:text-red-400">
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
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// CHAPTERS TAB
// ============================================

function ChaptersTab({
  chapters, courses, selectedCourseId, setSelectedCourseId,
  onCreate, onEdit, onDelete, onSelectChapter, onViewChapter,
}: {
  chapters: CourseChapter[];
  courses: Course[];
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  onCreate: () => void;
  onEdit: (chapter: CourseChapter) => void;
  onDelete: (chapter: CourseChapter) => void;
  onSelectChapter: (id: string) => void;
  onViewChapter: (chapter: CourseChapter) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-[#878e9a]">Course:</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50"
          >
            <option value="">Select a course...</option>
            {courses.map(course => {
              const id = course.id || (course as any)._id;
              return <option key={id} value={id}>{course.title}</option>;
            })}
          </select>
        </div>
        {selectedCourseId && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Chapter
          </button>
        )}
      </div>

      {!selectedCourseId ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <Layers className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">Select a course to manage its chapters.</p>
        </div>
      ) : chapters.length === 0 ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <Layers className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">No chapters yet. Add a chapter to start building the course structure.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {chapters.map(chapter => {
            const id = chapter.id || (chapter as any)._id;
            return (
              <div
                key={id}
                className="bg-[#151920] rounded-lg border border-white/10 p-4 hover:border-[#C8FF2E]/30 transition-colors cursor-pointer"
                onClick={() => onSelectChapter(id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[#686f7e] text-sm font-mono">#{chapter.order || 0}</span>
                    <div>
                      <div className="text-white font-medium">{chapter.title}</div>
                      {chapter.description && <div className="text-[#686f7e] text-xs mt-0.5">{chapter.description}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#686f7e]">{chapter.lessonCount ?? 0} lessons</span>
                    {chapter.duration && <span className="text-xs text-[#686f7e]">{chapter.duration}</span>}
                    {getStatusBadge(chapter.status, CHAPTER_STATUSES)}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onViewChapter(chapter)} className="p-1 text-[#878e9a] hover:text-blue-400">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEdit(chapter)} className="p-1 text-[#878e9a] hover:text-[#C8FF2E]">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(chapter)} className="p-1 text-[#878e9a] hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
// LESSONS TAB
// ============================================

function LessonsTab({
  lessons, chapters, courses, selectedCourseId, selectedChapterId,
  setSelectedCourseId, setSelectedChapterId, onCreate, onEdit, onDelete, onViewLesson,
}: {
  lessons: CourseLesson[];
  chapters: CourseChapter[];
  courses: Course[];
  selectedCourseId: string;
  selectedChapterId: string;
  setSelectedCourseId: (id: string) => void;
  setSelectedChapterId: (id: string) => void;
  onCreate: () => void;
  onEdit: (lesson: CourseLesson) => void;
  onDelete: (lesson: CourseLesson) => void;
  onViewLesson: (lesson: CourseLesson) => void;
}) {
  const filteredChapters = chapters.filter(c => {
    const cid = c.courseId;
    return cid === selectedCourseId;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#878e9a]">Course:</label>
          <select
            value={selectedCourseId}
            onChange={(e) => { setSelectedCourseId(e.target.value); setSelectedChapterId(''); }}
            className="px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50"
          >
            <option value="">Select course...</option>
            {courses.map(course => {
              const id = course.id || (course as any)._id;
              return <option key={id} value={id}>{course.title}</option>;
            })}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#878e9a]">Chapter:</label>
          <select
            value={selectedChapterId}
            onChange={(e) => setSelectedChapterId(e.target.value)}
            className="px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50"
          >
            <option value="">Select chapter...</option>
            {filteredChapters.map(chapter => {
              const id = chapter.id || (chapter as any)._id;
              return <option key={id} value={id}>{chapter.title}</option>;
            })}
          </select>
        </div>
        {selectedChapterId && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Lesson
          </button>
        )}
      </div>

      {!selectedChapterId ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <BookOpen className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">Select a course and chapter to manage lessons.</p>
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-12 bg-[#151920] rounded-xl border border-white/10">
          <BookOpen className="w-12 h-12 text-[#686f7e] mx-auto mb-3" />
          <p className="text-[#878e9a]">No lessons yet. Add a lesson to start building chapter content.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map(lesson => {
            const id = lesson.id || (lesson as any)._id;
            return (
              <div
                key={id}
                className="bg-[#151920] rounded-lg border border-white/10 p-4 hover:border-[#C8FF2E]/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[#686f7e] text-sm font-mono">#{lesson.order || 0}</span>
                    {getFormatIcon(lesson.format)}
                    <div>
                      <div className="text-white font-medium">{lesson.title}</div>
                      {lesson.description && <div className="text-[#686f7e] text-xs mt-0.5">{lesson.description}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#686f7e] capitalize">{lesson.format}</span>
                    {lesson.duration && <span className="text-xs text-[#686f7e]">{lesson.duration}</span>}
                    {getStatusBadge(lesson.status, LESSON_STATUSES)}
                    {lesson.isFree && <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">Free</span>}
                    <div className="flex items-center gap-1">
                      <button onClick={() => onViewLesson(lesson)} className="p-1 text-[#878e9a] hover:text-blue-400">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEdit(lesson)} className="p-1 text-[#878e9a] hover:text-[#C8FF2E]">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(lesson)} className="p-1 text-[#878e9a] hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
// FORM MODALS
// ============================================

function CourseForm({
  course, categories, onSubmit, onCancel,
}: {
  course: Course | null;
  categories: CourseCategory[];
  onSubmit: (data: Partial<Course>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Course>>(course || {
    title: '', format: 'text', status: 'draft', visibility: 'internal',
    difficulty: 'beginner', language: 'English', audienceType: 'internal',
    tags: [], learningObjectives: [], outcomes: [], prerequisites: [],
    relatedCourseIds: [], relatedFaqIds: [], relatedSopIds: [],
    videoUrls: [], seoKeywords: [], lessonCount: 0, version: 1,
    viewCount: 0, enrolmentCount: 0, completionCount: 0,
    aiGenerated: false, isFeatured: false,
  });
  const [aiField, setAiField] = useState<string>('');
  const aiContext = form.title || '';

  const categoryOptions = categories.map(c => ({
    value: c.id || (c as any)._id || '',
    label: c.name,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const updateField = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#0d1117] border border-white/10 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#0d1117] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{course ? 'Edit Course' : 'Create Course'}</h2>
          {course && (
            <div className="ml-3">{getStatusBadge(course.status, COURSE_STATUSES)}</div>
          )}
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
                <label className="block text-sm text-[#878e9a] mb-1">Slug</label>
                <input type="text" value={form.slug || ''} onChange={(e) => updateField('slug', e.target.value)} placeholder="Auto-generated from title"
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-[#878e9a]">Short Description</label>
                  <InlineAIGenerate fieldType="shortDescription" context={aiContext} onGenerated={(v) => updateField('shortDescription', v)} isGeneratingField={aiField === 'shortDescription'} setIsGeneratingField={(v) => setAiField(v ? 'shortDescription' : '')} />
                </div>
                <textarea value={form.shortDescription || ''} onChange={(e) => updateField('shortDescription', e.target.value)} rows={2}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-[#878e9a]">Detailed Description</label>
                  <InlineAIGenerate fieldType="detailedDescription" context={aiContext} onGenerated={(v) => updateField('detailedDescription', v)} isGeneratingField={aiField === 'detailedDescription'} setIsGeneratingField={(v) => setAiField(v ? 'detailedDescription' : '')} />
                </div>
                <textarea value={form.detailedDescription || ''} onChange={(e) => updateField('detailedDescription', e.target.value)} rows={4}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
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
                <label className="block text-sm text-[#878e9a] mb-1">Format</label>
                <select value={form.format || 'text'} onChange={(e) => updateField('format', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  {COURSE_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Difficulty</label>
                <select value={form.difficulty || 'beginner'} onChange={(e) => updateField('difficulty', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  {COURSE_DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Language</label>
                <input type="text" value={form.language || 'English'} onChange={(e) => updateField('language', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Tags (comma-separated)</label>
                <input type="text" value={(form.tags || []).join(', ')} onChange={(e) => updateField('tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
            </div>
          </div>

          {/* Duration & Effort */}
          <div className="border-t border-[#C8FF2E]/30 pt-4">
            <h3 className="text-[#C8FF2E] font-semibold mb-4">Duration & Effort</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Duration</label>
                <input type="text" value={form.duration || ''} onChange={(e) => updateField('duration', e.target.value)} placeholder="e.g., 4 hours, 2 weeks"
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Est. Completion Time</label>
                <input type="text" value={form.estimatedCompletionTime || ''} onChange={(e) => updateField('estimatedCompletionTime', e.target.value)} placeholder="e.g., 20 hours total"
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
            </div>
          </div>

          {/* Enterprise Mapping */}
          <div className="border-t border-[#C8FF2E]/30 pt-4">
            <h3 className="text-[#C8FF2E] font-semibold mb-4">Enterprise Mapping</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Department</label>
                <input type="text" value={form.department || ''} onChange={(e) => updateField('department', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Instructor / Creator</label>
                <input type="text" value={form.instructor || ''} onChange={(e) => updateField('instructor', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Audience</label>
                <select value={form.audienceType || 'internal'} onChange={(e) => updateField('audienceType', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  {AUDIENCE_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Learning Design */}
          <div className="border-t border-[#C8FF2E]/30 pt-4">
            <h3 className="text-[#C8FF2E] font-semibold mb-4">Learning Design</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-[#878e9a]">Learning Objectives (comma-separated)</label>
                  <InlineAIGenerate fieldType="learningObjectives" context={aiContext} onGenerated={(v) => updateField('learningObjectives', v.split(',').map((t: string) => t.trim()).filter(Boolean))} isGeneratingField={aiField === 'learningObjectives'} setIsGeneratingField={(v) => setAiField(v ? 'learningObjectives' : '')} />
                </div>
                <textarea value={(form.learningObjectives || []).join(', ')} onChange={(e) => updateField('learningObjectives', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))} rows={2}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-[#878e9a]">Outcomes (comma-separated)</label>
                  <InlineAIGenerate fieldType="outcomes" context={aiContext} onGenerated={(v) => updateField('outcomes', v.split(',').map((t: string) => t.trim()).filter(Boolean))} isGeneratingField={aiField === 'outcomes'} setIsGeneratingField={(v) => setAiField(v ? 'outcomes' : '')} />
                </div>
                <textarea value={(form.outcomes || []).join(', ')} onChange={(e) => updateField('outcomes', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))} rows={2}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Skill Level</label>
                <input type="text" value={form.skillLevel || ''} onChange={(e) => updateField('skillLevel', e.target.value)} placeholder="e.g., Foundational, Proficient"
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="border-t border-[#C8FF2E]/30 pt-4">
            <h3 className="text-[#C8FF2E] font-semibold mb-4">Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Thumbnail URL</label>
                <input type="text" value={form.thumbnail || ''} onChange={(e) => updateField('thumbnail', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Banner URL</label>
                <input type="text" value={form.banner || ''} onChange={(e) => updateField('banner', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
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
                  {COURSE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Visibility</label>
                <select value={form.visibility || 'internal'} onChange={(e) => updateField('visibility', e.target.value)}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                  {COURSE_VISIBILITIES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isFeatured" checked={form.isFeatured || false} onChange={(e) => updateField('isFeatured', e.target.checked)}
                  className="w-4 h-4 bg-[#151920] border-white/10 rounded" />
                <label htmlFor="isFeatured" className="text-sm text-[#afb6c4]">Featured Course</label>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="border-t border-[#C8FF2E]/30 pt-4">
            <h3 className="text-[#C8FF2E] font-semibold mb-4">Internal Notes</h3>
            <textarea value={form.internalNotes || ''} onChange={(e) => updateField('internalNotes', e.target.value)} rows={3}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
          </div>

          {/* SEO */}
          <div className="border-t border-[#C8FF2E]/30 pt-4">
            <h3 className="text-[#C8FF2E] font-semibold mb-4">SEO</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Meta Title</label>
                <input type="text" value={form.metaTitle || ''} onChange={(e) => updateField('metaTitle', e.target.value)} placeholder="SEO title (max 60 chars)"
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">SEO Keywords (comma-separated)</label>
                <input type="text" value={(form.seoKeywords || []).join(', ')} onChange={(e) => updateField('seoKeywords', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#878e9a] mb-1">Meta Description</label>
                <textarea value={form.metaDescription || ''} onChange={(e) => updateField('metaDescription', e.target.value)} rows={2} placeholder="SEO description (max 160 chars)"
                  className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
              </div>
            </div>
          </div>

          {/* Versioning & Approval */}
          {course && (
            <div className="border-t border-[#C8FF2E]/30 pt-4">
              <h3 className="text-[#C8FF2E] font-semibold mb-4">Version & Approval</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Version</label>
                  <input type="number" value={form.version || 1} onChange={(e) => updateField('version', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
                </div>
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Review Notes</label>
                  <input type="text" value={form.reviewNotes || ''} onChange={(e) => updateField('reviewNotes', e.target.value)}
                    className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onCancel}
              className="px-4 py-2 text-[#878e9a] hover:text-white transition-colors">Cancel</button>
            {course && course.status === 'draft' && (
              <button type="button" onClick={(e) => { e.preventDefault(); updateField('status', 'review'); }}
                className="px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg font-medium hover:bg-amber-500/30 transition-colors">
                Submit for Review
              </button>
            )}
            {course && course.status === 'review' && (
              <button type="button" onClick={(e) => { e.preventDefault(); updateField('status', 'approved'); }}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium hover:bg-blue-500/30 transition-colors">
                Approve
              </button>
            )}
            {course && (course.status === 'review' || course.status === 'approved') && (
              <button type="button" onClick={(e) => { e.preventDefault(); updateField('status', 'published'); }}
                className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg font-medium hover:bg-green-500/30 transition-colors">
                Publish
              </button>
            )}
            <button type="submit"
              className="px-6 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg font-medium transition-colors">
              {course ? 'Update Course' : 'Create Course'}
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

function CategoryForm({
  category, categories, onSubmit, onCancel,
}: {
  category: CourseCategory | null;
  categories: CourseCategory[];
  onSubmit: (data: Partial<CourseCategory>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<CourseCategory>>(category || {
    name: '', description: '', status: 'active', order: 0, courseCount: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#0d1117] border border-white/10 rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{category ? 'Edit Category' : 'Create Category'}</h2>
          <button onClick={onCancel} className="text-[#686f7e] hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              {categories.filter(c => !c.parentId).map(c => {
                const id = c.id || (c as any)._id;
                return <option key={id} value={id}>{c.name}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Icon (Lucide icon name)</label>
            <input type="text" value={form.icon || ''} onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Colour</label>
            <input type="color" value={form.colour || '#7C6BF0'} onChange={(e) => setForm(prev => ({ ...prev, colour: e.target.value }))}
              className="w-12 h-10 bg-[#151920] border border-white/10 rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Sort Order</label>
            <input type="number" value={form.order || 0} onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Status</label>
            <select value={form.status || 'active'} onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as CourseCategoryStatus }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
              <option value="active">Active</option>
              <option value="archived">Archived</option>
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
// CHAPTER FORM
// ============================================

function ChapterForm({
  chapter, onSubmit, onCancel,
}: {
  chapter: CourseChapter | null;
  onSubmit: (data: Partial<CourseChapter>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<CourseChapter>>(chapter || {
    title: '', status: 'draft', order: 0, lessonCount: 0,
    learningObjectives: [], aiGenerated: false,
  });
  const [chAiField, setChAiField] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#0d1117] border border-white/10 rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{chapter ? 'Edit Chapter' : 'Create Chapter'}</h2>
          <button onClick={onCancel} className="text-[#686f7e] hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Title *</label>
            <input type="text" value={form.title || ''} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-[#878e9a]">Description</label>
              <InlineAIGenerate fieldType="chapterDescription" context={form.title || ''} onGenerated={(v) => setForm(prev => ({ ...prev, description: v }))} isGeneratingField={chAiField === 'description'} setIsGeneratingField={(v) => setChAiField(v ? 'description' : '')} />
            </div>
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-[#878e9a]">Learning Objectives (comma-separated)</label>
              <InlineAIGenerate fieldType="chapterObjectives" context={form.title || ''} onGenerated={(v) => setForm(prev => ({ ...prev, learningObjectives: v.split(',').map((t: string) => t.trim()).filter(Boolean) }))} isGeneratingField={chAiField === 'objectives'} setIsGeneratingField={(v) => setChAiField(v ? 'objectives' : '')} />
            </div>
            <textarea value={(form.learningObjectives || []).join(', ')} onChange={(e) => setForm(prev => ({ ...prev, learningObjectives: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) }))} rows={2}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Status</label>
            <select value={form.status || 'draft'} onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as ChapterStatus }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
              {CHAPTER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-[#878e9a] hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg font-medium transition-colors">
              {chapter ? 'Update Chapter' : 'Create Chapter'}
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

function AIGenerateTab({
  courses, companyId, onCourseCreated,
}: {
  courses: Course[];
  companyId: string;
  onCourseCreated: () => void;
}) {
  const [aiMode, setAiMode] = useState<'description' | 'structure' | 'quiz' | 'enhance'>('description');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string>('');

  // Description generation state
  const [descTitle, setDescTitle] = useState('');
  const [descBrief, setDescBrief] = useState('');
  const [descFormat, setDescFormat] = useState<string>('text');
  const [descDifficulty, setDescDifficulty] = useState<string>('beginner');

  // Structure generation state
  const [structTitle, setStructTitle] = useState('');
  const [structDesc, setStructDesc] = useState('');
  const [structObjectives, setStructObjectives] = useState('');

  // Quiz generation state
  const [quizLessonTitle, setQuizLessonTitle] = useState('');
  const [quizLessonContent, setQuizLessonContent] = useState('');
  const [quizChapterTitle, setQuizChapterTitle] = useState('');
  const [quizCourseTitle, setQuizCourseTitle] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState<string>('intermediate');
  const [quizCount, setQuizCount] = useState(5);

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
            { role: 'system', content: 'You are an expert course content creator for businesses. Generate professional, SEO-optimised course content. Always respond with valid JSON matching the requested structure. Use British English spelling.' },
            { role: 'user', content: `Generate course marketing content for:\n\nTitle: ${descTitle}\n${descBrief ? `Brief: ${descBrief}` : ''}\n${descFormat ? `Format: ${descFormat}` : ''}\n${descDifficulty ? `Difficulty: ${descDifficulty}` : ''}\n\nGenerate a JSON object with these fields:\n- shortDescription (max 200 characters)\n- detailedDescription (2-3 paragraphs)\n- summary (1-2 sentences)\n- learningObjectives (array of 3-5 learning objectives)\n- outcomes (array of 3-5 expected outcomes)` },
          ];
          result = await withRetry(() => callGLM(messages, { temperature: 0.7, maxTokens: 2000, responseFormat: 'json_object' }));
          const parsed = parseJsonFromAI(result);
          if (parsed) { setParsedResult(parsed); setAiResult(JSON.stringify(parsed, null, 2)); }
          else setAiResult(result);
          break;
        }
        case 'structure': {
          const objectives = structObjectives.split(',').map((s: string) => s.trim()).filter(Boolean);
          const messages: GLMMessage[] = [
            { role: 'system', content: 'You are an expert instructional designer for business courses. Generate comprehensive course structures. Always respond with valid JSON matching the requested structure. Use British English spelling.' },
            { role: 'user', content: `Generate a complete course structure for:\n\nTitle: ${structTitle}\n${structDesc ? `Description: ${structDesc}` : ''}\n${objectives.length ? `Learning Objectives: ${objectives.join(', ')}` : ''}\n${descFormat ? `Format: ${descFormat}` : ''}\n${descDifficulty ? `Difficulty: ${descDifficulty}` : ''}\n\nGenerate a JSON object with a "chapters" array (4-8 chapters), each containing:\n- title\n- description\n- learningObjectives (array)\n- lessons (array of 2-4 lessons each with title, description, format, duration)` },
          ];
          result = await withRetry(() => callGLM(messages, { temperature: 0.7, maxTokens: 4000, responseFormat: 'json_object' }));
          const parsed = parseJsonFromAI(result);
          if (parsed) { setParsedResult(parsed); setAiResult(JSON.stringify(parsed, null, 2)); }
          else setAiResult(result);
          break;
        }
        case 'quiz': {
          const messages: GLMMessage[] = [
            { role: 'system', content: 'You are an expert assessment creator for business courses. Generate multiple-choice quiz questions. Always respond with valid JSON matching the requested structure. Use British English spelling.' },
            { role: 'user', content: `Generate quiz questions for:\n\nLesson: ${quizLessonTitle}\n${quizLessonContent ? `Content: ${quizLessonContent.substring(0, 2000)}` : ''}\n${quizChapterTitle ? `Chapter: ${quizChapterTitle}` : ''}\n${quizCourseTitle ? `Course: ${quizCourseTitle}` : ''}\nDifficulty: ${quizDifficulty}\nNumber of questions: ${quizCount}\n\nGenerate a JSON object with a "questions" array, each question having:\n- question (string)\n- options (array of 4 options)\n- correctAnswer (index 0-3)\n- explanation (string)` },
          ];
          result = await withRetry(() => callGLM(messages, { temperature: 0.7, maxTokens: 3000, responseFormat: 'json_object' }));
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
          };
          const messages: GLMMessage[] = [
            { role: 'system', content: 'You are an expert content editor for business courses. Enhance and improve content professionally. Use British English spelling.' },
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

  // Save AI result to course data
  const handleSaveResult = async () => {
    if (!parsedResult && aiMode !== 'enhance') return;
    setIsSaving(true);
    setSaveSuccess('');

    try {
      const store = useDataStore.getState();
      switch (aiMode) {
        case 'description': {
          if (!selectedCourseId) { setIsSaving(false); return; }
          const updates: Partial<Course> = {};
          if (parsedResult.shortDescription) updates.shortDescription = parsedResult.shortDescription;
          if (parsedResult.detailedDescription) updates.detailedDescription = parsedResult.detailedDescription;
          if (parsedResult.summary) updates.summary = parsedResult.summary;
          if (Array.isArray(parsedResult.learningObjectives)) updates.learningObjectives = parsedResult.learningObjectives;
          if (Array.isArray(parsedResult.outcomes)) updates.outcomes = parsedResult.outcomes;
          updates.aiGenerated = true;
          await courseApi.update(selectedCourseId, updates);
          store.updateItem('courses', selectedCourseId, updates);
          setSaveSuccess('Description saved to course!');
          onCourseCreated();
          break;
        }
        case 'structure': {
          if (!selectedCourseId || !parsedResult?.chapters) { setIsSaving(false); return; }
          const chapters = parsedResult.chapters;
          for (let i = 0; i < chapters.length; i++) {
            const ch = chapters[i];
            const chapterData = { title: ch.title || `Chapter ${i + 1}`, description: ch.description || '', order: i, status: 'draft' as const, learningObjectives: ch.learningObjectives || [], aiGenerated: true, courseId: selectedCourseId, companyId };
            const chapter = await courseChapterApi.create(chapterData);
            store.addItem('courseChapters', (chapter.data || chapter) as any);
            if (Array.isArray(ch.lessons)) {
              for (let j = 0; j < ch.lessons.length; j++) {
                const les = ch.lessons[j];
                const lessonData = { title: les.title || `Lesson ${j + 1}`, description: les.description || '', format: (les.format || 'text') as LessonFormat, duration: les.duration || '', order: j, status: 'draft' as const, learningObjectives: [], keyTakeaways: [], videoUrls: [], documentUrls: [], quizQuestions: [], attachments: [], isFree: false, aiGenerated: true, chapterId: ((chapter.data || chapter) as any).id, courseId: selectedCourseId, companyId };
                const lesson = await courseLessonApi.create(lessonData);
                store.addItem('courseLessons', (lesson.data || lesson) as any);
              }
            }
          }
          setSaveSuccess(`Created ${chapters.length} chapters with lessons!`);
          onCourseCreated();
          break;
        }
        case 'quiz': {
          if (!selectedCourseId || !parsedResult?.questions) { setIsSaving(false); return; }
          const storeData = store.getItems('courseLessons') as CourseLesson[];
          const lesson = storeData.find(l => l.courseId === selectedCourseId);
          if (!lesson) { setSaveSuccess('No lesson found for this course.'); setIsSaving(false); return; }
          const quizQuestions = parsedResult.questions.map((q: any) => ({
            question: q.question || '',
            options: Array.isArray(q.options) ? q.options : [],
            correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
            explanation: q.explanation || '',
          }));
          await courseLessonApi.update(lesson.id, { quizQuestions: [...(lesson.quizQuestions || []), ...quizQuestions] });
          store.updateItem('courseLessons', lesson.id, { quizQuestions: [...(lesson.quizQuestions || []), ...quizQuestions] });
          setSaveSuccess(`Added ${quizQuestions.length} quiz questions!`);
          onCourseCreated();
          break;
        }
        case 'enhance': {
          if (!selectedCourseId) { setIsSaving(false); return; }
          await courseApi.update(selectedCourseId, { detailedDescription: aiResult, aiGenerated: true });
          store.updateItem('courses', selectedCourseId, { detailedDescription: aiResult, aiGenerated: true });
          setSaveSuccess('Enhanced content saved to course!');
          onCourseCreated();
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
          {Array.isArray(data.learningObjectives) && data.learningObjectives.length > 0 && (
            <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Learning Objectives</div>
              <ul className="space-y-1">{data.learningObjectives.map((obj: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]"><span className="text-[#C8FF2E] mt-1">•</span>{obj}</li>
              ))}</ul>
            </div>
          )}
          {Array.isArray(data.outcomes) && data.outcomes.length > 0 && (
            <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="text-xs font-medium text-[#C8FF2E] uppercase tracking-wider mb-2">Expected Outcomes</div>
              <ul className="space-y-1">{data.outcomes.map((out: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#afb6c4]"><span className="text-[#C8FF2E] mt-1">•</span>{out}</li>
              ))}</ul>
            </div>
          )}
        </div>
      );
    }

    if (aiMode === 'structure') {
      const chapters = data.chapters || data;
      if (!Array.isArray(chapters)) return <pre className="whitespace-pre-wrap text-sm text-[#afb6c4] bg-[#0d1117] rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono">{aiResult}</pre>;
      return (
        <div className="space-y-3">
          {chapters.map((ch: any, ci: number) => (
            <div key={ci} className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#C8FF2E]/20 text-[#C8FF2E] text-xs font-bold px-2 py-0.5 rounded">Ch {ci + 1}</span>
                <span className="text-white font-medium text-sm">{ch.title}</span>
              </div>
              {ch.description && <p className="text-sm text-[#878e9a] mb-2">{ch.description}</p>}
              {Array.isArray(ch.learningObjectives) && ch.learningObjectives.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-[#C8FF2E]">Objectives: </span>
                  <span className="text-xs text-[#878e9a]">{ch.learningObjectives.join(', ')}</span>
                </div>
              )}
              {Array.isArray(ch.lessons) && ch.lessons.length > 0 && (
                <div className="ml-4 space-y-1">{ch.lessons.map((les: any, li: number) => (
                  <div key={li} className="flex items-center gap-2 text-sm">
                    <span className="text-[#878e9a]">{li + 1}.</span>
                    <span className="text-[#afb6c4]">{les.title}</span>
                    {les.format && <span className="text-xs text-[#686f7e]">({les.format})</span>}
                    {les.duration && <span className="text-xs text-[#686f7e]">{les.duration}</span>}
                  </div>
                ))}</div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (aiMode === 'quiz') {
      const questions = data.questions || data;
      if (!Array.isArray(questions)) return <pre className="whitespace-pre-wrap text-sm text-[#afb6c4] bg-[#0d1117] rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono">{aiResult}</pre>;
      return (
        <div className="space-y-3">
          {questions.map((q: any, qi: number) => (
            <div key={qi} className="bg-[#0d1117] rounded-lg p-4 border border-white/5">
              <div className="text-sm font-medium text-white mb-2">Q{qi + 1}: {q.question}</div>
              <div className="grid grid-cols-1 gap-1 mb-2">
                {Array.isArray(q.options) && q.options.map((opt: string, oi: number) => (
                  <div key={oi} className={`text-sm px-2 py-1 rounded ${oi === q.correctAnswer ? 'bg-[#C8FF2E]/10 text-[#C8FF2E]' : 'text-[#878e9a]'}`}>
                    {String.fromCharCode(65 + oi)}) {opt}
                  </div>
                ))}
              </div>
              {q.explanation && <div className="text-xs text-[#878e9a] italic">Explanation: {q.explanation}</div>}
            </div>
          ))}
        </div>
      );
    }

    return <pre className="whitespace-pre-wrap text-sm text-[#afb6c4] bg-[#0d1117] rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono">{aiResult}</pre>;
  };

  const aiModes = [
    { id: 'description' as const, label: 'Generate Description', icon: <FileText className="w-5 h-5" />, desc: 'Create course descriptions, summaries, objectives, and outcomes from a title.' },
    { id: 'structure' as const, label: 'Generate Structure', icon: <Layers className="w-5 h-5" />, desc: 'Create a full chapter and lesson outline from a course concept.' },
    { id: 'quiz' as const, label: 'Generate Quiz', icon: <BookOpen className="w-5 h-5" />, desc: 'Create multiple-choice quiz questions for any lesson.' },
    { id: 'enhance' as const, label: 'Enhance Content', icon: <Sparkles className="w-5 h-5" />, desc: 'Improve, expand, simplify, or format your course content.' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">AI-Powered Course Generation</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {aiModes.map(mode => (
          <button
            key={mode.id}
            onClick={() => { setAiMode(mode.id); setAiResult(''); setAiError(''); setParsedResult(null); setSaveSuccess(''); }}
            className={`p-4 rounded-lg border text-left transition-all ${
              aiMode === mode.id
                ? 'bg-[#C8FF2E]/20 border-[#C8FF2E] text-[#C8FF2E]'
                : 'bg-[#151920] border-white/10 text-[#878e9a] hover:border-[#C8FF2E]/30 hover:text-[#afb6c4]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {mode.icon}
              <span className="font-medium text-sm">{mode.label}</span>
            </div>
            <p className="text-xs opacity-70">{mode.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-[#151920] rounded-xl border border-white/10 p-6 space-y-4">
          <h3 className="text-white font-medium">
            {aiModes.find(m => m.id === aiMode)?.label} — Input
          </h3>

          {aiMode === 'description' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Course Title *</label>
                <input type="text" value={descTitle} onChange={(e) => setDescTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" placeholder="e.g., Advanced Sales Training" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Brief Description (optional)</label>
                <textarea value={descBrief} onChange={(e) => setDescBrief(e.target.value)} rows={2}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" placeholder="A brief idea of what the course covers" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Format</label>
                  <select value={descFormat} onChange={(e) => setDescFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                    {COURSE_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Difficulty</label>
                  <select value={descDifficulty} onChange={(e) => setDescDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                    {COURSE_DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {aiMode === 'structure' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Course Title *</label>
                <input type="text" value={structTitle} onChange={(e) => setStructTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" placeholder="e.g., Product Knowledge Mastery" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Description (optional)</label>
                <textarea value={structDesc} onChange={(e) => setStructDesc(e.target.value)} rows={3}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Learning Objectives (comma-separated)</label>
                <textarea value={structObjectives} onChange={(e) => setStructObjectives(e.target.value)} rows={2}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" placeholder="Understand product features, Learn sales techniques" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Format</label>
                  <select value={descFormat} onChange={(e) => setDescFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                    {COURSE_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Difficulty</label>
                  <select value={descDifficulty} onChange={(e) => setDescDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                    {COURSE_DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {aiMode === 'quiz' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Lesson Title *</label>
                <input type="text" value={quizLessonTitle} onChange={(e) => setQuizLessonTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" placeholder="e.g., Understanding Customer Needs" />
              </div>
              <div>
                <label className="block text-sm text-[#878e9a] mb-1">Lesson Content (optional)</label>
                <textarea value={quizLessonContent} onChange={(e) => setQuizLessonContent(e.target.value)} rows={3}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" placeholder="Paste the lesson content to generate questions from" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Chapter Title</label>
                  <input type="text" value={quizChapterTitle} onChange={(e) => setQuizChapterTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
                </div>
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Course Title</label>
                  <input type="text" value={quizCourseTitle} onChange={(e) => setQuizCourseTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Difficulty</label>
                  <select value={quizDifficulty} onChange={(e) => setQuizDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                    {COURSE_DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#878e9a] mb-1">Number of Questions</label>
                  <input type="number" value={quizCount} onChange={(e) => setQuizCount(parseInt(e.target.value) || 5)} min={1} max={20}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
                </div>
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
            disabled={isGenerating || (aiMode === 'description' && !descTitle) || (aiMode === 'structure' && !structTitle) || (aiMode === 'quiz' && !quizLessonTitle) || (aiMode === 'enhance' && !enhanceContent)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#C8FF2E] hover:bg-[#d4ff5c] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate with AI
              </>
            )}
          </button>
        </div>

        {/* Result Panel */}
        <div className="bg-[#151920] rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-medium mb-3">Result</h3>
          {aiError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {aiError}
            </div>
          )}
          {aiResult ? (
            <div className="space-y-3">
              {renderStructuredResult()}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigator.clipboard.writeText(aiResult)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm hover:border-[#C8FF2E]/30 transition-colors"
                >
                  Copy JSON
                </button>
              </div>
              {/* Save to Course Section */}
              {aiMode !== 'enhance' && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50"
                    >
                      <option value="">Select course to save to...</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSaveResult}
                      disabled={!selectedCourseId || isSaving}
                      className="px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                    >
                      {isSaving ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save to Course</>}
                    </button>
                  </div>
                  {saveSuccess && (
                    <div className="mt-2 flex items-center gap-2 text-[#C8FF2E] text-sm">
                      <CheckCircle2 className="w-4 h-4" />{saveSuccess}
                    </div>
                  )}
                </div>
              )}
              {aiMode === 'enhance' && courses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50"
                    >
                      <option value="">Select course to save enhanced content...</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSaveResult}
                      disabled={!selectedCourseId || isSaving}
                      className="px-4 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                    >
                      {isSaving ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save to Course</>}
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
              <p className="text-[#878e9a]">Fill in the input fields and click Generate to create AI-powered course content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// LESSON FORM
// ============================================

function LessonForm({
  lesson, onSubmit, onCancel,
}: {
  lesson: CourseLesson | null;
  onSubmit: (data: Partial<CourseLesson>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<CourseLesson>>(lesson || {
    title: '', format: 'text', status: 'draft', order: 0,
    learningObjectives: [], keyTakeaways: [], videoUrls: [],
    documentUrls: [], quizQuestions: [], attachments: [],
    isFree: false, aiGenerated: false,
  });
  const [lsAiField, setLsAiField] = useState<string>('');
  const [showQuizEditor, setShowQuizEditor] = useState((form.quizQuestions?.length ?? 0) > 0);

  const handleAddQuestion = () => {
    const currentQuestions = form.quizQuestions || [];
    setForm(prev => ({ ...prev, quizQuestions: [...currentQuestions, { id: `q-${Date.now()}`, question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }] }));
  };

  const handleRemoveQuestion = (index: number) => {
    setForm(prev => ({ ...prev, quizQuestions: (prev.quizQuestions || []).filter((_, i) => i !== index) }));
  };

  const handleUpdateQuestion = (index: number, field: string, value: string | number) => {
    setForm(prev => {
      const questions = [...(prev.quizQuestions || [])];
      questions[index] = { ...questions[index], [field]: value };
      return { ...prev, quizQuestions: questions };
    });
  };

  const handleUpdateOption = (qIndex: number, oIndex: number, value: string) => {
    setForm(prev => {
      const questions = [...(prev.quizQuestions || [])];
      const options = [...questions[qIndex].options];
      options[oIndex] = value;
      questions[qIndex] = { ...questions[qIndex], options };
      return { ...prev, quizQuestions: questions };
    });
  };

  const handleGenerateQuiz = async () => {
    const title = form.title || 'Untitled Lesson';
    const context = form.content ? form.content.substring(0, 2000) : '';
    setLsAiField('quiz');
    try {
      const messages: GLMMessage[] = [
        { role: 'system', content: 'You are an expert assessment creator. Generate multiple-choice quiz questions. Always respond with valid JSON. Use British English.' },
        { role: 'user', content: `Generate 3 quiz questions for the lesson: ${title}${context ? `\n\nContent: ${context}` : ''}\n\nGenerate a JSON object with a "questions" array, each having: question (string), options (array of 4 strings), correctAnswer (index 0-3), explanation (string).` },
      ];
      const result = await withRetry(() => callGLM(messages, { temperature: 0.7, maxTokens: 2000, responseFormat: 'json_object' }));
      const parsed = parseJsonFromAI(result);
      if (parsed?.questions && Array.isArray(parsed.questions)) {
        const newQuestions: QuizQuestion[] = parsed.questions.map((q: any, i: number) => ({
          id: `q-${Date.now()}-${i}`,
          question: q.question || '',
          options: Array.isArray(q.options) ? q.options.slice(0, 4).concat(Array(4).fill('')).slice(0, 4) : ['', '', '', ''],
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          explanation: q.explanation || '',
        }));
        setForm(prev => ({ ...prev, quizQuestions: [...(prev.quizQuestions || []), ...newQuestions] }));
        setShowQuizEditor(true);
      }
    } catch (err) {
      console.error('Quiz generation failed:', err);
    } finally {
      setLsAiField('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#0d1117] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#0d1117] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">{lesson ? 'Edit Lesson' : 'Create Lesson'}</h2>
          <button onClick={onCancel} className="text-[#686f7e] hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#878e9a] mb-1">Title *</label>
            <input type="text" value={form.title || ''} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-[#878e9a]">Description</label>
              <InlineAIGenerate fieldType="lessonDescription" context={form.title || ''} onGenerated={(v) => setForm(prev => ({ ...prev, description: v }))} isGeneratingField={lsAiField === 'description'} setIsGeneratingField={(v) => setLsAiField(v ? 'description' : '')} />
            </div>
            <textarea value={form.description || ''} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={2}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-[#878e9a]">Content</label>
              <InlineAIGenerate fieldType="lessonContent" context={`${form.title || ''}${form.learningObjectives?.length ? ' — Objectives: ' + form.learningObjectives.join(', ') : ''}`} onGenerated={(v) => setForm(prev => ({ ...prev, content: v }))} isGeneratingField={lsAiField === 'content'} setIsGeneratingField={(v) => setLsAiField(v ? 'content' : '')} />
            </div>
            <textarea value={form.content || ''} onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))} rows={6}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#878e9a] mb-1">Format</label>
              <select value={form.format || 'text'} onChange={(e) => setForm(prev => ({ ...prev, format: e.target.value as LessonFormat }))}
                className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                {LESSON_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#878e9a] mb-1">Order</label>
              <input type="number" value={form.order || 0} onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
            </div>
            <div>
              <label className="block text-sm text-[#878e9a] mb-1">Duration</label>
              <input type="text" value={form.duration || ''} onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))} placeholder="e.g., 15 min"
                className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white placeholder-[#686f7e] focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50" />
            </div>
            <div>
              <label className="block text-sm text-[#878e9a] mb-1">Status</label>
              <select value={form.status || 'draft'} onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as LessonStatus }))}
                className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-[#afb6c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8FF2E]/20 focus:border-[#C8FF2E]/50">
                {LESSON_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-[#878e9a]">Learning Objectives (comma-separated)</label>
              <InlineAIGenerate fieldType="lessonObjectives" context={form.title || ''} onGenerated={(v) => setForm(prev => ({ ...prev, learningObjectives: v.split(',').map((t: string) => t.trim()).filter(Boolean) }))} isGeneratingField={lsAiField === 'objectives'} setIsGeneratingField={(v) => setLsAiField(v ? 'objectives' : '')} />
            </div>
            <textarea value={(form.learningObjectives || []).join(', ')} onChange={(e) => setForm(prev => ({ ...prev, learningObjectives: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) }))} rows={2}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-[#878e9a]">Key Takeaways (comma-separated)</label>
              <InlineAIGenerate fieldType="keyTakeaways" context={form.title || ''} onGenerated={(v) => setForm(prev => ({ ...prev, keyTakeaways: v.split(',').map((t: string) => t.trim()).filter(Boolean) }))} isGeneratingField={lsAiField === 'takeaways'} setIsGeneratingField={(v) => setLsAiField(v ? 'takeaways' : '')} />
            </div>
            <textarea value={(form.keyTakeaways || []).join(', ')} onChange={(e) => setForm(prev => ({ ...prev, keyTakeaways: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) }))} rows={2}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isFree" checked={form.isFree || false} onChange={(e) => setForm(prev => ({ ...prev, isFree: e.target.checked }))}
              className="w-4 h-4 bg-[#151920] border-white/10 rounded" />
            <label htmlFor="isFree" className="text-sm text-[#afb6c4]">Free Preview Lesson</label>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-[#878e9a]">Internal Notes</label>
              <InlineAIGenerate fieldType="lessonNotes" context={form.title || ''} onGenerated={(v) => setForm(prev => ({ ...prev, internalNotes: v }))} isGeneratingField={lsAiField === 'notes'} setIsGeneratingField={(v) => setLsAiField(v ? 'notes' : '')} />
            </div>
            <textarea value={form.internalNotes || ''} onChange={(e) => setForm(prev => ({ ...prev, internalNotes: e.target.value }))} rows={2}
              className="w-full px-3 py-2 bg-[#151920] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
          </div>

          {/* Quiz Questions Section */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => setShowQuizEditor(!showQuizEditor)} className="flex items-center gap-2 text-white font-medium">
                {showQuizEditor ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                Quiz Questions ({(form.quizQuestions || []).length})
              </button>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleGenerateQuiz} disabled={lsAiField === 'quiz'} className="flex items-center gap-1 px-2 py-1 text-xs bg-[#C8FF2E]/10 text-[#C8FF2E] hover:bg-[#C8FF2E]/20 rounded border border-[#C8FF2E]/30 disabled:opacity-40 transition-colors">
                  {lsAiField === 'quiz' ? <div className="w-3 h-3 border-2 border-[#C8FF2E]/30 border-t-[#C8FF2E] rounded-full animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Generate Quiz
                </button>
                {showQuizEditor && <button type="button" onClick={handleAddQuestion} className="flex items-center gap-1 px-2 py-1 text-xs bg-[#151920] border border-white/10 rounded text-[#afb6c4] hover:border-[#C8FF2E]/30 transition-colors">
                  <Plus className="w-3 h-3" /> Add Question
                </button>}
              </div>
            </div>
            {showQuizEditor && (form.quizQuestions || []).length === 0 && (
              <p className="text-sm text-[#686f7e] text-center py-4">No quiz questions yet. Click "Add Question" or "Generate Quiz" to add some.</p>
            )}
            {showQuizEditor && (form.quizQuestions || []).map((q, qi) => (
              <div key={q.id || qi} className="bg-[#0d1117] rounded-lg p-3 border border-white/5 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#C8FF2E] font-medium">Q{qi + 1}</span>
                  <button type="button" onClick={() => handleRemoveQuestion(qi)} className="text-[#686f7e] hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                </div>
                <input type="text" value={q.question} onChange={(e) => handleUpdateQuestion(qi, 'question', e.target.value)} placeholder="Question text..."
                  className="w-full px-2 py-1.5 bg-[#151920] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C8FF2E]/50 mb-2" />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-1">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer ${oi === q.correctAnswer ? 'bg-[#C8FF2E]/20 text-[#C8FF2E]' : 'bg-[#151920] text-[#686f7e]'}`} onClick={() => handleUpdateQuestion(qi, 'correctAnswer', oi)}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <input type="text" value={opt} onChange={(e) => handleUpdateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`}
                        className="flex-1 px-2 py-1 bg-[#151920] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C8FF2E]/50" />
                    </div>
                  ))}
                </div>
                <textarea value={q.explanation || ''} onChange={(e) => handleUpdateQuestion(qi, 'explanation', e.target.value)} placeholder="Explanation (optional)" rows={1}
                  className="w-full px-2 py-1 bg-[#151920] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#C8FF2E]/50 resize-none" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-[#878e9a] hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#C8FF2E] hover:bg-[#d4ff5c] text-white rounded-lg font-medium transition-colors">
              {lesson ? 'Update Lesson' : 'Create Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}