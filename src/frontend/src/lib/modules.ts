/**
 * Module Registry
 *
 * Central registry for all 60+ modules in the Mengo platform.
 * Each module is organized by group with metadata for navigation and permissions.
 */

import { LucideIcon } from 'lucide-react';

// ============================================
// MODULE GROUPS
// ============================================

export type ModuleGroup =
  | 'foundation'
  | 'brand'
  | 'content'
  | 'sales'
  | 'marketing'
  | 'programs'
  | 'ops'
  | 'system';

// ============================================
// MODULE STATUS
// ============================================

export type ModuleStatus = 'active' | 'beta' | 'coming-soon' | 'deprecated';

// ============================================
// PERMISSION LEVELS
// ============================================

export type PermissionLevel = 'admin' | 'editor' | 'viewer';

// ============================================
// MODULE DEFINITION
// ============================================

export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  group: ModuleGroup;
  icon: string; // Icon name from Lucide
  path: string;
  status: ModuleStatus;
  permissions: PermissionLevel[];
  hasAI: boolean;
  hasBulkGeneration: boolean;
  dependencies?: string[];
  badge?: string;
}

// ============================================
// MODULE REGISTRY
// ============================================

export const MODULES: ModuleDefinition[] = [
  // ==========================================
  // FOUNDATION GROUP (8 modules)
  // ==========================================
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Overview with stats and module grid',
    group: 'foundation',
    icon: 'LayoutDashboard',
    path: '/dashboard',
    status: 'active',
    permissions: ['admin', 'editor', 'viewer'],
    hasAI: false,
    hasBulkGeneration: false,
  },
  {
    id: 'business-profile',
    name: 'Business Profile',
    description: 'Company information, mission, vision, social profiles',
    group: 'foundation',
    icon: 'Building2',
    path: '/business-profile',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'founders',
    name: 'Founders',
    description: 'Founder profiles with assets and social links',
    group: 'foundation',
    icon: 'Users',
    path: '/founders',
    status: 'active',
    permissions: ['admin', 'editor', 'viewer'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'employees',
    name: 'Employees',
    description: 'Team management with departments and levels',
    group: 'foundation',
    icon: 'Users2',
    path: '/employees',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'icp-personas',
    name: 'ICPs & Personas',
    description: 'Ideal Customer Profiles and Buyer Personas',
    group: 'foundation',
    icon: 'Target',
    path: '/icp-personas',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'products',
    name: 'Products',
    description: 'Product catalog with categories and marketing copy',
    group: 'foundation',
    icon: 'Package',
    path: '/products',
    status: 'active',
    permissions: ['admin', 'editor', 'viewer'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'competitors',
    name: 'Competitors',
    description: 'Competitive analysis with SWOT',
    group: 'foundation',
    icon: 'Swords',
    path: '/competitors',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Organization and user settings',
    group: 'foundation',
    icon: 'Settings',
    path: '/settings',
    status: 'active',
    permissions: ['admin'],
    hasAI: false,
    hasBulkGeneration: false,
  },

  // ==========================================
  // BRAND GROUP (4 modules)
  // ==========================================
  {
    id: 'brand',
    name: 'Brand',
    description: 'Central hub for brand strategy, visual identity, assets, and stationery',
    group: 'brand',
    icon: 'Palette',
    path: '/brand',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: false,
    hasBulkGeneration: false,
  },
  {
    id: 'brand-strategy',
    name: 'Brand Strategy',
    description: 'Brand psychology, archetypes, positioning, messaging, and tone of voice frameworks',
    group: 'brand',
    icon: 'Brain',
    path: '/brand/strategy',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'brand-manual',
    name: 'Brand Manual',
    description: 'View and download complete brand guidelines document combining all brand data',
    group: 'brand',
    icon: 'BookOpen',
    path: '/brand/manual',
    status: 'active',
    permissions: ['admin', 'editor', 'viewer'],
    hasAI: false,
    hasBulkGeneration: false,
  },
  {
    id: 'visual-identity',
    name: 'Visual Identity',
    description: 'Complete design system with colors, typography, spacing, and live previews',
    group: 'brand',
    icon: 'Paintbrush',
    path: '/visual-identity',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: false,
    hasBulkGeneration: false,
  },
  {
    id: 'brand-assets',
    name: 'Brand Assets',
    description: 'Logos, favicons, patterns, backgrounds',
    group: 'brand',
    icon: 'Image',
    path: '/brand-assets',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'stationery',
    name: 'Stationery',
    description: 'Business cards, letterheads, templates',
    group: 'brand',
    icon: 'FileText',
    path: '/stationery',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'hr-assets',
    name: 'HR Assets',
    description: 'HR documents, templates, forms, ID cards, letters, certificates, and branding materials',
    group: 'brand',
    icon: 'FolderHeart',
    path: '/hr-assets',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: false,
    hasBulkGeneration: false,
  },

  // ==========================================
  // CONTENT GROUP (6 modules)
  // ==========================================
  {
    id: 'website-planner',
    name: 'Website Planner',
    description: 'Comprehensive website planning, requirements generation, and AI documentation system',
    group: 'content',
    icon: 'Globe',
    path: '/website-planner',
    status: 'active',
    permissions: ['admin', 'editor', 'viewer'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'blogs',
    name: 'Blogs',
    description: 'Blog articles with outlines and full content',
    group: 'content',
    icon: 'FileEdit',
    path: '/blogs',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'blog-content-os',
    name: 'Blog Content OS',
    description: 'AI-powered blog strategy, planning, and content generation system',
    group: 'content',
    icon: 'FileEdit',
    path: '/blog-content-os',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: true,
    badge: 'AI',
  },
  {
    id: 'newsletters',
    name: 'Newsletters',
    description: 'Email newsletters with bulk generation',
    group: 'content',
    icon: 'Mail',
    path: '/newsletters',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: true,
  },
  {
    id: 'faq-bank',
    name: 'FAQ Bank',
    description: 'Frequently asked questions by category',
    group: 'content',
    icon: 'HelpCircle',
    path: '/faq-bank',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'content-library',
    name: 'Content Library',
    description: 'Social media content and hooks',
    group: 'content',
    icon: 'Library',
    path: '/content-library',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'stories-campaigns',
    name: 'Stories & Campaigns',
    description: 'Brand stories and campaign content',
    group: 'content',
    icon: 'BookOpen',
    path: '/stories-campaigns',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    description: 'Customer testimonials and case studies',
    group: 'content',
    icon: 'MessageSquareQuote',
    path: '/testimonials',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },

  // ==========================================
  // SALES GROUP (6 modules)
  // ==========================================
  {
    id: 'landing-pages',
    name: 'Landing Pages',
    description: 'High-converting landing page copy',
    group: 'sales',
    icon: 'FileCode',
    path: '/landing-pages',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'sales-scripts',
    name: 'Sales Scripts',
    description: 'Cold calls, demos, closing scripts',
    group: 'sales',
    icon: 'Phone',
    path: '/sales-scripts',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'sales-collateral',
    name: 'Sales Collateral',
    description: 'One-pagers, brochures, case studies',
    group: 'sales',
    icon: 'FileStack',
    path: '/sales-collateral',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'video-content',
    name: 'Video Content',
    description: 'Video scripts and shot lists',
    group: 'sales',
    icon: 'Video',
    path: '/video-content',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'banners',
    name: 'Banners',
    description: 'Display ad banners and designs',
    group: 'sales',
    icon: 'PanelTop',
    path: '/banners',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Book outlines and full content',
    group: 'sales',
    icon: 'BookMarked',
    path: '/books',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },

  // ==========================================
  // MARKETING GROUP (6 modules)
  // ==========================================
  {
    id: 'seo',
    name: 'SEO',
    description: 'SEO optimization and meta content',
    group: 'marketing',
    icon: 'Search',
    path: '/seo',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'ads',
    name: 'Ads',
    description: 'Ad copy for multiple platforms',
    group: 'marketing',
    icon: 'Megaphone',
    path: '/ads',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'pr',
    name: 'PR',
    description: 'Press releases and media pitches',
    group: 'marketing',
    icon: 'Newspaper',
    path: '/pr',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'email-templates',
    name: 'Email Templates',
    description: 'Transactional and marketing emails',
    group: 'marketing',
    icon: 'MailPlus',
    path: '/email-templates',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: true,
  },
  {
    id: 'courses',
    name: 'Courses',
    description: 'Online course content and curriculum',
    group: 'marketing',
    icon: 'GraduationCap',
    path: '/courses',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'events',
    name: 'Events',
    description: 'Event planning and promotion',
    group: 'marketing',
    icon: 'Calendar',
    path: '/events',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },

  // ==========================================
  // PROGRAMS GROUP (4 modules)
  // ==========================================
  {
    id: 'loyalty-programme',
    name: 'Loyalty Programme',
    description: 'Points-based and tiered loyalty programs',
    group: 'programs',
    icon: 'Gift',
    path: '/loyalty-programme',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'membership-plans',
    name: 'Membership Plans',
    description: 'Subscription and membership tiers',
    group: 'programs',
    icon: 'CreditCard',
    path: '/membership-plans',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'referral-programme',
    name: 'Referral Programme',
    description: 'Referral and affiliate programs',
    group: 'programs',
    icon: 'Share2',
    path: '/referral-programme',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'sops',
    name: 'SOPs',
    description: 'Standard Operating Procedures',
    group: 'programs',
    icon: 'ClipboardList',
    path: '/sops',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: true,
    hasBulkGeneration: false,
  },

  // ==========================================
  // OPS GROUP (2 modules)
  // ==========================================
  {
    id: 'legal-documents',
    name: 'Legal Documents',
    description: 'Terms, privacy, contracts by country',
    group: 'ops',
    icon: 'Scale',
    path: '/legal-documents',
    status: 'active',
    permissions: ['admin'],
    hasAI: true,
    hasBulkGeneration: false,
  },
  {
    id: 'background-tasks',
    name: 'Background Tasks',
    description: 'Bulk generation tasks and progress',
    group: 'ops',
    icon: 'Clock',
    path: '/background-tasks',
    status: 'active',
    permissions: ['admin', 'editor'],
    hasAI: false,
    hasBulkGeneration: true,
    badge: 'tasks',
  },

  // ==========================================
  // SYSTEM GROUP (1 module)
  // ==========================================
  {
    id: 'ai-chat',
    name: 'AI Chat',
    description: 'Persistent AI assistant chat panel',
    group: 'system',
    icon: 'Sparkles',
    path: '/ai-chat',
    status: 'active',
    permissions: ['admin', 'editor', 'viewer'],
    hasAI: true,
    hasBulkGeneration: false,
  },
];

// ============================================
// GROUP CONFIGURATION
// ============================================

export interface GroupConfig {
  id: ModuleGroup;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const GROUPS: GroupConfig[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    description: 'Core business data and settings',
    icon: 'Layers',
    color: '#7C6BF0',
  },
  {
    id: 'brand',
    name: 'Brand',
    description: 'Brand identity and assets',
    icon: 'Palette',
    color: '#EC4899',
  },
  {
    id: 'content',
    name: 'Content',
    description: 'Content creation and management',
    icon: 'FileText',
    color: '#10B981',
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Sales enablement and collateral',
    icon: 'TrendingUp',
    color: '#F59E0B',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing campaigns and assets',
    icon: 'Target',
    color: '#3B82F6',
  },
  {
    id: 'programs',
    name: 'Programs',
    description: 'Loyalty, membership, and SOPs',
    icon: 'Zap',
    color: '#8B5CF6',
  },
  {
    id: 'ops',
    name: 'Ops',
    description: 'Operations and legal',
    icon: 'Settings2',
    color: '#6B7280',
  },
  {
    id: 'system',
    name: 'System',
    description: 'System features and AI chat',
    icon: 'Cpu',
    color: '#14B8A6',
  },
];

// ============================================
// HELPERS
// ============================================

export function getModulesByGroup(groupId: ModuleGroup): ModuleDefinition[] {
  return MODULES.filter((m) => m.group === groupId);
}

export function getModuleById(id: string): ModuleDefinition | undefined {
  return MODULES.find((m) => m.id === id);
}

export function getGroupById(id: ModuleGroup): GroupConfig | undefined {
  return GROUPS.find((g) => g.id === id);
}

export function getActiveModules(): ModuleDefinition[] {
  return MODULES.filter((m) => m.status === 'active');
}

export function getModulesByPermission(level: PermissionLevel): ModuleDefinition[] {
  return MODULES.filter((m) => m.permissions.includes(level));
}
