/**
 * Blog System — 20-module config.
 *
 * Reuses FieldDef / SectionDef / FieldKind from website-project so the same
 * generic SectionForm renders both modules.
 */

import {
  Activity,
  BarChart3,
  Bot,
  Calendar,
  ClipboardList,
  Database,
  Edit3,
  GitBranch,
  Image,
  Link as LinkIcon,
  MessageCircle,
  Megaphone,
  RefreshCw,
  Repeat,
  Search,
  Send,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
} from 'lucide-react';
import type { FieldDef, SectionDef } from '@/modules/website/website-project/sections.config';

export const BLOG_SECTIONS: SectionDef[] = [
  // ----- 1. Foundation & CMS Setup -----
  {
    id: 'foundation',
    step: '1',
    group: 'Foundation & Strategy',
    title: 'Blog Foundation & CMS Setup',
    description: 'WordPress / CMS, hosting, theme, plugins, security.',
    icon: Database,
    fields: [
      { key: 'cmsChoice', label: 'CMS', kind: 'text', hint: 'WordPress, Ghost, Webflow, Sanity…' },
      { key: 'hostingProvider', label: 'Hosting provider', kind: 'text' },
      { key: 'domainName', label: 'Domain', kind: 'text' },
      { key: 'theme', label: 'Theme / template', kind: 'text' },
      { key: 'plugins', label: 'Plugins / extensions', kind: 'tags', colSpan: 2 },
      { key: 'seoPlugin', label: 'SEO plugin', kind: 'text' },
      { key: 'securityPlugin', label: 'Security + backup plugin', kind: 'text' },
      { key: 'performancePlugin', label: 'Performance plugin', kind: 'text' },
    ],
    advancedFields: [
      { key: 'userRoles', label: 'User roles configured', kind: 'tags', hint: 'Admin / Editor / Author / Contributor', colSpan: 2 },
      { key: 'authorProfileFields', label: 'Author profile fields (E-E-A-T)', kind: 'tags', hint: 'Bio, headshot, credentials, social links…', colSpan: 2 },
    ],
  },

  // ----- 2. Strategy & Editorial Planning -----
  {
    id: 'strategy',
    step: '2',
    group: 'Foundation & Strategy',
    title: 'Blog Strategy & Editorial Planning',
    description: 'Content pillars, editorial calendar, topic clusters.',
    icon: Calendar,
    fields: [
      { key: 'contentPillars', label: 'Content pillars (3–5)', kind: 'tags', hint: 'Top-level themes', colSpan: 2 },
      { key: 'editorialCadence', label: 'Editorial cadence', kind: 'select', options: [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'monthly', label: 'Monthly' },
      ]},
      { key: 'editorialCalendarUrl', label: 'Editorial calendar URL', kind: 'url' },
      { key: 'topicClusters', label: 'Topic clusters', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'tofuTopics', label: 'TOFU topics', kind: 'tags', hint: 'Top of funnel — awareness', colSpan: 2 },
      { key: 'mofuTopics', label: 'MOFU topics', kind: 'tags', hint: 'Middle of funnel — consideration', colSpan: 2 },
      { key: 'bofuTopics', label: 'BOFU topics', kind: 'tags', hint: 'Bottom of funnel — decision', colSpan: 2 },
      { key: 'authorityPlan', label: 'Authority planning per topic', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 3. Keyword & Intent Engine -----
  {
    id: 'keywords',
    step: '3',
    group: 'Discovery & Planning',
    title: 'Keyword & Intent Engine',
    description: 'Demand-side discovery — what real readers search for.',
    icon: Search,
    fields: [
      { key: 'primaryKeywords', label: 'Primary keywords', kind: 'tags', colSpan: 2 },
      { key: 'secondaryKeywords', label: 'Secondary keywords', kind: 'tags', colSpan: 2 },
      { key: 'longTailKeywords', label: 'Long-tail keywords', kind: 'tags', colSpan: 2 },
      { key: 'intentSplit', label: 'Search intent classification', kind: 'textarea', rows: 3, hint: 'Informational / navigational / transactional / commercial', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'questionKeywords', label: 'Question-based keywords (AEO ready)', kind: 'tags', colSpan: 2 },
      { key: 'keywordClusters', label: 'Keyword clusters', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 4. Brief & Planning -----
  {
    id: 'briefs',
    step: '4',
    group: 'Discovery & Planning',
    title: 'Content Brief & Planning System',
    description: 'How every blog gets briefed before writing starts.',
    icon: ClipboardList,
    fields: [
      { key: 'briefTemplate', label: 'Brief template URL', kind: 'url', colSpan: 2 },
      { key: 'briefRequired', label: 'Topic, keyword, outline (H1/H2/H3) required', kind: 'checks' },
      { key: 'briefNotes', label: 'Brief workflow notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'competitorContent', label: 'Competitor content analysis', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'contentGaps', label: 'Content gap log', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 5. Content Creation -----
  {
    id: 'creation',
    step: '5',
    group: 'Production',
    title: 'Content Creation Engine',
    description: 'Writing rules — length, structure, voice.',
    icon: Edit3,
    fields: [
      { key: 'wordCountTarget', label: 'Word count target', kind: 'text', hint: 'e.g. 1200–3000+' },
      { key: 'structureRules', label: 'Structure', kind: 'textarea', rows: 3, hint: 'Intro → Body → Conclusion rules', colSpan: 2 },
      { key: 'voiceGuidelines', label: 'Voice / tone reference', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiAssistedRules', label: 'AI-assisted writing rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'smeProcess', label: 'SME collaboration process', kind: 'textarea', rows: 3, hint: 'Subject matter expert review flow', colSpan: 2 },
      { key: 'caseStudyIntegration', label: 'Case study integration rules', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
  },

  // ----- 6. Visual Content -----
  {
    id: 'visuals',
    step: '6',
    group: 'Production',
    title: 'Visual Content System',
    description: 'Images, infographics, videos, alt-text.',
    icon: Image,
    fields: [
      { key: 'imageStandards', label: 'Image standards', kind: 'textarea', rows: 3, hint: 'Dimensions, format, weight', colSpan: 2 },
      { key: 'infographicTemplate', label: 'Infographic template URL', kind: 'url' },
      { key: 'screenshotPolicy', label: 'Screenshot policy', kind: 'text' },
      { key: 'altTextRules', label: 'Alt-text optimisation rules', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'videoEmbedStrategy', label: 'Video embed strategy', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'dataVizGuidelines', label: 'Data visualisation guidelines', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
  },

  // ----- 7. Optimization Engine -----
  {
    id: 'optimization',
    step: '7',
    group: 'Optimization',
    title: 'Content Optimization Engine',
    description: 'On-page SEO + readability + E-E-A-T.',
    icon: Tag,
    fields: [
      { key: 'keywordPlacementRules', label: 'Keyword placement rules', kind: 'textarea', rows: 3, hint: 'Title / H2s / Meta', colSpan: 2 },
      { key: 'urlPattern', label: 'URL pattern', kind: 'text', hint: '/blog/{slug}' },
      { key: 'paragraphLengthRule', label: 'Paragraph length rule', kind: 'text' },
      { key: 'headingRules', label: 'Heading hierarchy rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'readabilityTarget', label: 'Readability target', kind: 'text', hint: 'e.g. Flesch 60+' },
    ],
    advancedFields: [
      { key: 'eatGuidelines', label: 'E-E-A-T guidelines', kind: 'textarea', rows: 3, hint: 'Experience, Expertise, Authoritativeness, Trustworthiness', colSpan: 2 },
      { key: 'trustSignals', label: 'Trust signals checklist', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 8. AEO / GEO / AI -----
  {
    id: 'aeo',
    step: '8',
    group: 'Optimization',
    title: 'AEO / GEO / AI Optimization Layer',
    description: 'Answer engines, featured snippets, AI-readable structure.',
    icon: Sparkles,
    fields: [
      { key: 'directAnswerRules', label: 'Direct answer block rules', kind: 'textarea', rows: 3, hint: '40–60 words, plain English', colSpan: 2 },
      { key: 'faqSchemaUsage', label: 'FAQ schema usage policy', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'snippetTargets', label: 'Featured snippet target keywords', kind: 'tags', colSpan: 2 },
      { key: 'aiReadabilityChecklist', label: 'AI-readable structure checklist', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 9. Linking System -----
  {
    id: 'linking',
    step: '9',
    group: 'Optimization',
    title: 'Internal & External Linking System',
    description: 'How blogs connect to each other and to the wider web.',
    icon: LinkIcon,
    fields: [
      { key: 'internalLinkRules', label: 'Internal linking rules', kind: 'textarea', rows: 3, hint: 'Min/max per post, anchors, opportunities', colSpan: 2 },
      { key: 'clusterLinkingRules', label: 'Topic cluster linking rules', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'authorityLinkStrategy', label: 'Authority link strategy', kind: 'textarea', rows: 3, hint: 'Outbound to high-DA sources', colSpan: 2 },
      { key: 'anchorTextRules', label: 'Anchor text rules', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
  },

  // ----- 10. Editorial Workflow -----
  {
    id: 'workflow',
    step: '10',
    group: 'Workflow & Publishing',
    title: 'Editorial Workflow System',
    description: 'Writer → Editor → SEO → Final QA.',
    icon: GitBranch,
    fields: [
      { key: 'workflowStages', label: 'Workflow stages', kind: 'tags', hint: 'e.g. Draft → Edit → SEO → QA → Publish', colSpan: 2 },
      { key: 'approvalLevels', label: 'Approval levels per stage', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'versioningTool', label: 'Version control tool', kind: 'text' },
    ],
    advancedFields: [
      { key: 'stageTimeouts', label: 'Stage timeout rules', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
  },

  // ----- 11. Publishing & CMS Workflow -----
  {
    id: 'publishing',
    step: '11',
    group: 'Workflow & Publishing',
    title: 'Publishing & CMS Workflow',
    description: 'Upload, categorise, validate.',
    icon: Send,
    fields: [
      { key: 'uploadChecklist', label: 'Upload checklist', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'categories', label: 'Category list', kind: 'tags', colSpan: 2 },
      { key: 'tagsConvention', label: 'Tagging convention', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'metaTemplate', label: 'SEO meta template', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'prePublishChecklist', label: 'Pre-publish checklist', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'postPublishValidation', label: 'Post-publish validation', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 12. Off-Page Promotion -----
  {
    id: 'promotion',
    step: '12',
    group: 'Distribution',
    title: 'Off-Page Promotion System',
    description: 'Social, email, communities — and outreach.',
    icon: Megaphone,
    fields: [
      { key: 'socialChannels', label: 'Social channels', kind: 'tags', colSpan: 2 },
      { key: 'emailLists', label: 'Email lists / segments', kind: 'tags', colSpan: 2 },
      { key: 'communities', label: 'Communities to share in', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'backlinkOutreachPlan', label: 'Backlink outreach plan', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'syndicationPartners', label: 'Syndication partners', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 13. Repurposing Engine -----
  {
    id: 'repurposing',
    step: '13',
    group: 'Distribution',
    title: 'Content Repurposing Engine',
    description: 'One blog → many formats.',
    icon: Repeat,
    fields: [
      { key: 'blogToReel', label: 'Blog → Reel / Short rule', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'blogToCarousel', label: 'Blog → Carousel rule', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'blogToEmail', label: 'Blog → Email newsletter rule', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'multiFormatRules', label: 'Multi-format conversion rules', kind: 'textarea', rows: 4, hint: 'PDF, podcast, infographic, thread, etc.', colSpan: 2 },
    ],
  },

  // ----- 14. Performance Analytics -----
  {
    id: 'analytics',
    step: '14',
    group: 'Measurement',
    title: 'Performance Analytics Dashboard',
    description: 'Traffic, engagement, and conversion KPIs.',
    icon: BarChart3,
    fields: [
      { key: 'organicTrafficTarget', label: 'Organic traffic target', kind: 'text' },
      { key: 'pageViewsTarget', label: 'Page views target', kind: 'text' },
      { key: 'timeOnPageTarget', label: 'Time on page target (s)', kind: 'text' },
      { key: 'scrollDepthTarget', label: 'Scroll depth target', kind: 'text', hint: 'e.g. 75%' },
    ],
    advancedFields: [
      { key: 'leadsGoal', label: 'Leads generated goal', kind: 'text' },
      { key: 'ctaClicksGoal', label: 'CTA clicks goal', kind: 'text' },
    ],
  },

  // ----- 15. SEO & Authority -----
  {
    id: 'seo-tracking',
    step: '15',
    group: 'Measurement',
    title: 'SEO & Authority Tracking',
    description: 'Rankings, snippets, backlinks, domain authority.',
    icon: TrendingUp,
    fields: [
      { key: 'rankingTool', label: 'Keyword ranking tool', kind: 'text', hint: 'Ahrefs, SEMrush, Mangools…' },
      { key: 'snippetTrackingTool', label: 'Featured snippet tracking', kind: 'text' },
    ],
    advancedFields: [
      { key: 'backlinkTrackerTool', label: 'Backlink tracker', kind: 'text' },
      { key: 'daGrowthGoal', label: 'Domain Authority growth goal', kind: 'text' },
    ],
  },

  // ----- 16. Lifecycle Management -----
  {
    id: 'lifecycle',
    step: '16',
    group: 'Lifecycle & Engagement',
    title: 'Content Lifecycle Management',
    description: 'Refresh, prune, consolidate.',
    icon: RefreshCw,
    fields: [
      { key: 'refreshCadence', label: 'Refresh cadence', kind: 'select', options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'biannual', label: 'Bi-annual' },
        { value: 'annual', label: 'Annual' },
      ]},
      { key: 'refreshCriteria', label: 'Refresh criteria', kind: 'textarea', rows: 3, hint: 'When does a post qualify?', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'pruningRules', label: 'Pruning rules', kind: 'textarea', rows: 3, hint: 'When to delete or noindex', colSpan: 2 },
      { key: 'consolidationStrategy', label: 'Consolidation strategy', kind: 'textarea', rows: 3, hint: 'Merging similar posts', colSpan: 2 },
    ],
  },

  // ----- 17. AI Visibility Tracking -----
  {
    id: 'ai-visibility',
    step: '17',
    group: 'Measurement',
    title: 'AI Visibility Tracking',
    description: 'Mentions and citations on AI platforms.',
    icon: Bot,
    fields: [
      { key: 'aiVisibilityTool', label: 'AI visibility tool', kind: 'text', hint: 'Profound, Otterly.AI, Peec…' },
      { key: 'citationTracker', label: 'Citation tracking method', kind: 'text' },
      { key: 'platformsTracked', label: 'Platforms tracked', kind: 'tags', hint: 'ChatGPT, Gemini, Perplexity, Copilot…', colSpan: 2 },
    ],
  },

  // ----- 18. Comments & Community -----
  {
    id: 'community',
    step: '18',
    group: 'Lifecycle & Engagement',
    title: 'Comment & Community System',
    description: 'Moderation and engagement.',
    icon: MessageCircle,
    fields: [
      { key: 'moderationPolicy', label: 'Comment moderation policy', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'engagementMetrics', label: 'Engagement metrics tracked', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'communityBuildingPlan', label: 'Community building plan', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
  },

  // ----- 19. Conversion Optimization -----
  {
    id: 'cro',
    step: '19',
    group: 'Conversion & Growth',
    title: 'Conversion Optimization System',
    description: 'CTAs, forms, and the funnel hand-off.',
    icon: Target,
    fields: [
      { key: 'ctaPlacementRules', label: 'CTA placement rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'leadCaptureForms', label: 'Lead capture form types', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'funnelMap', label: 'Funnel map', kind: 'textarea', rows: 3, hint: 'Blog → Landing page → CRM → nurture', colSpan: 2 },
    ],
  },

  // ----- 20. Continuous Optimization -----
  {
    id: 'continuous',
    step: '20',
    group: 'Conversion & Growth',
    title: 'Continuous Optimization Engine',
    description: 'Monthly review + improvements + experiments.',
    icon: Activity,
    fields: [
      { key: 'reviewCadence', label: 'Review cadence', kind: 'select', options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
      ]},
      { key: 'reviewProcess', label: 'Review process notes', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'improvementBacklog', label: 'Improvement backlog', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiRecommendationsTool', label: 'AI recommendations tool', kind: 'text' },
      { key: 'abTestQueue', label: 'A/B test queue', kind: 'tags', colSpan: 2 },
    ],
  },
];

export const BLOG_GROUP_ORDER: string[] = [
  'Foundation & Strategy',
  'Discovery & Planning',
  'Production',
  'Optimization',
  'Workflow & Publishing',
  'Distribution',
  'Measurement',
  'Lifecycle & Engagement',
  'Conversion & Growth',
];

export function blogSectionFilledRatio(
  section: SectionDef,
  data: Record<string, unknown> | undefined
): number {
  const all = [...section.fields, ...(section.advancedFields ?? [])];
  if (all.length === 0) return 0;
  const filled = all.filter((f) => {
    const v = data?.[f.key];
    if (v === undefined || v === null) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (typeof v === 'number') return Number.isFinite(v);
    if (typeof v === 'boolean') return v === true;
    if (Array.isArray(v)) return v.length > 0;
    return !!v;
  }).length;
  return filled / all.length;
}

// Re-export types so downstream files can import from this single module.
export type { FieldDef, SectionDef };
