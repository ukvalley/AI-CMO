/**
 * GEO / AI Search System — 13-module config (sub-menu of /seo).
 * Reuses FieldDef / SectionDef from website-project so the same generic
 * SectionForm renders this module too.
 */

import {
  Award,
  BarChart3,
  Brain,
  Calendar,
  ClipboardCheck,
  Code,
  Edit3,
  Eye,
  GitBranch,
  Plug,
  RefreshCw,
  Send,
  Target,
} from 'lucide-react';
import type { FieldDef, SectionDef } from '@/modules/website/website-project/sections.config';

export const GEO_SECTIONS: SectionDef[] = [
  // ----- 1. GEO Strategy & Planning -----
  {
    id: 'strategy',
    step: '1',
    group: 'Strategy',
    title: 'GEO Strategy & Planning',
    description: 'Business profile, GEO goals, personas, competitors.',
    icon: Target,
    fields: [
      { key: 'businessModel', label: 'Business model', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'productsServices', label: 'Products / services', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'usp', label: 'Unique selling point', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'geoGoals', label: 'GEO goals', kind: 'tags', hint: 'Brand visibility / Leads / Authority / Mentions', colSpan: 2 },
      { key: 'buyerPersonas', label: 'Buyer personas', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'painPoints', label: 'Persona pain points', kind: 'tags', colSpan: 2 },
      { key: 'intentMap', label: 'Intent mapping notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiCompetitors', label: 'Competitors appearing in AI results', kind: 'tags', colSpan: 2 },
      { key: 'competitorContentNotes', label: 'Competitor content analysis', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'approvalStage', label: 'Approval stage', kind: 'select', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'review', label: 'Review' },
        { value: 'approved', label: 'Approved' },
        { value: 'rework', label: 'Rework' },
      ]},
    ],
  },

  // ----- 2. AI Search Behaviour Research -----
  {
    id: 'research',
    step: '2',
    group: 'Strategy',
    title: 'AI Search Behaviour Research',
    description: 'Understand how AI engines answer queries in your niche.',
    icon: Brain,
    fields: [
      { key: 'informationalQueries', label: 'Informational queries', kind: 'tags', colSpan: 2 },
      { key: 'comparisonQueries', label: 'Comparison queries', kind: 'tags', colSpan: 2 },
      { key: 'decisionQueries', label: 'Decision queries', kind: 'tags', colSpan: 2 },
      { key: 'aiResponsePatterns', label: 'AI response structure patterns', kind: 'textarea', rows: 4, hint: 'How ChatGPT / Gemini / Perplexity answer your queries today', colSpan: 2 },
      { key: 'intentClusters', label: 'Intent clusters', kind: 'tags', colSpan: 2 },
      { key: 'faqPatterns', label: 'FAQ patterns extracted', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'conversationalQueries', label: 'Conversational long-tail queries', kind: 'tags', colSpan: 2 },
      { key: 'citationSources', label: 'AI citation sources tracked', kind: 'tags', hint: 'Domains AI engines cite for your queries', colSpan: 2 },
    ],
  },

  // ----- 3. Entity & Topical Authority -----
  {
    id: 'authority',
    step: '3',
    group: 'Strategy',
    title: 'Entity & Topical Authority',
    description: 'Map entities, pillars, and topic clusters.',
    icon: GitBranch,
    fields: [
      { key: 'primaryEntity', label: 'Primary entity (brand / service)', kind: 'text', colSpan: 2 },
      { key: 'supportingEntities', label: 'Supporting entities', kind: 'tags', hint: 'Tools / frameworks / concepts you own', colSpan: 2 },
      { key: 'pillarPages', label: 'Pillar pages', kind: 'tags', colSpan: 2 },
      { key: 'supportingArticles', label: 'Supporting articles', kind: 'tags', colSpan: 2 },
      { key: 'semanticMap', label: 'Semantic relationship map', kind: 'textarea', rows: 4, hint: 'How entities connect to each other', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'authorityScores', label: 'Authority score per topic', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'contentGaps', label: 'Content gaps detected', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 4. GEO Content Planning -----
  {
    id: 'planning',
    step: '4',
    group: 'Production',
    title: 'GEO Content Planning',
    description: 'Calendar, content types, publishing timeline.',
    icon: Calendar,
    fields: [
      { key: 'calendarUrl', label: 'Content calendar URL', kind: 'url', colSpan: 2 },
      { key: 'contentTypes', label: 'Content types planned', kind: 'tags', hint: 'Pillar / Blog / Case study / FAQ / Comparison page…', colSpan: 2 },
      { key: 'publishingTimeline', label: 'Publishing timeline', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'priorityScoringRules', label: 'Priority scoring rules', kind: 'textarea', rows: 3, hint: 'How impact is scored for each piece', colSpan: 2 },
      { key: 'campaignAlignment', label: 'Campaign alignment notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 5. AI-Optimized Content Creation -----
  {
    id: 'creation',
    step: '5',
    group: 'Production',
    title: 'AI-Optimized Content Creation',
    description: 'Answer-first writing, definitions, FAQs, authority enhancers.',
    icon: Edit3,
    fields: [
      { key: 'answerFirstStructure', label: 'Answer-first structure rules', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'definitionBlocksRule', label: 'Definition block standards', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'faqBuilderRules', label: 'FAQ builder rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'headingRules', label: 'Heading structure rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'paragraphLengthRule', label: 'Paragraph length / bullet clarity rule', kind: 'text' },
      { key: 'authorityEnhancers', label: 'Authority enhancers required', kind: 'tags', hint: 'Stats / references / examples / quotes…', colSpan: 2 },
      { key: 'qualityChecklist', label: 'Quality checklist', kind: 'textarea', rows: 5, hint: 'Answer-focused validation, entity clarity, fact-check reminders', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiRewriteRules', label: 'AI rewrite suggestion rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'authorityScoreRubric', label: 'Per-article authority score rubric', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 6. Technical SEO & Schema -----
  {
    id: 'technical',
    step: '6',
    group: 'Technical',
    title: 'Technical SEO & Schema Engine',
    description: 'Structured data, internal links, performance.',
    icon: Code,
    fields: [
      { key: 'schemaTypes', label: 'Schema types in use', kind: 'tags', hint: 'FAQ / Article / Organization / Author / HowTo…', colSpan: 2 },
      { key: 'internalLinkingRules', label: 'Internal linking engine rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'crawlOptimisation', label: 'Crawl optimisation notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'pageSpeedTarget', label: 'Page speed target', kind: 'text', hint: 'Lighthouse score / LCP target' },
      { key: 'mobileOptimisation', label: 'Mobile optimisation notes', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'schemaValidationTool', label: 'Schema validation automation', kind: 'text', hint: 'Schema.org validator, Rich Results Test…' },
      { key: 'errorDetectionTool', label: 'SEO error detection tool', kind: 'text' },
    ],
  },

  // ----- 7. Authority Building & PR -----
  {
    id: 'authority-pr',
    step: '7',
    group: 'Distribution & Authority',
    title: 'Authority Building & PR',
    description: 'Backlinks, mentions, outreach across high-trust platforms.',
    icon: Award,
    fields: [
      { key: 'backlinkTracker', label: 'Backlink tracker tool', kind: 'text' },
      { key: 'mentionTracker', label: 'Mention tracking tool', kind: 'text', hint: 'Brand24, Mention, Google Alerts…' },
      { key: 'outreachCrm', label: 'Outreach CRM', kind: 'text', hint: 'Pitchbox, BuzzStream, Respona…' },
      { key: 'distributionPlatforms', label: 'Distribution platforms', kind: 'tags', hint: 'LinkedIn / Reddit / Quora / Hacker News…', colSpan: 2 },
      { key: 'outreachTargets', label: 'Outreach target categories', kind: 'tags', hint: 'Guest blogs / podcasts / interviews', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'domainAuthorityTool', label: 'Domain authority scoring tool', kind: 'text' },
      { key: 'outreachSuccessNotes', label: 'Outreach success tracking notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 8. Content Distribution -----
  {
    id: 'distribution',
    step: '8',
    group: 'Distribution & Authority',
    title: 'Content Distribution Engine',
    description: 'Repurpose, schedule, and amplify.',
    icon: Send,
    fields: [
      { key: 'repurposingRules', label: 'Repurposing rules', kind: 'textarea', rows: 4, hint: 'Blog → social posts / reels / email…', colSpan: 2 },
      { key: 'distributionScheduler', label: 'Distribution scheduler tool', kind: 'text', hint: 'Buffer, Later, Hypefury, custom…' },
      { key: 'communitySharing', label: 'Community sharing notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'engagementTracking', label: 'Engagement analytics setup', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'ctaPerformanceTracking', label: 'CTA performance tracking', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 9. AI Visibility Tracking -----
  {
    id: 'visibility',
    step: '9',
    group: 'Measurement',
    title: 'AI Visibility Tracking',
    description: 'Are we showing up in AI answers, snippets, and summaries?',
    icon: Eye,
    fields: [
      { key: 'aiAnswerPresence', label: 'AI answer presence checks', kind: 'tags', hint: 'Queries you check weekly', colSpan: 2 },
      { key: 'snippetPresence', label: 'Featured snippet presence', kind: 'tags', colSpan: 2 },
      { key: 'aiSummaryPresence', label: 'AI summary presence', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'mentionsCount', label: 'Mentions count target / month', kind: 'text' },
      { key: 'citationsCount', label: 'Citations count target / month', kind: 'text' },
      { key: 'trafficGrowthTarget', label: 'Traffic growth target', kind: 'text' },
      { key: 'engagementTarget', label: 'Engagement target', kind: 'text' },
    ],
    advancedFields: [
      { key: 'keywordMovementTool', label: 'Keyword movement tool', kind: 'text' },
      { key: 'visibilityScoreTool', label: 'Visibility score tool', kind: 'text', hint: 'Profound, Otterly.AI, Peec, Athena HQ…' },
    ],
  },

  // ----- 10. GEO Performance Analytics -----
  {
    id: 'analytics',
    step: '10',
    group: 'Measurement',
    title: 'GEO Performance Analytics',
    description: 'Funnel from query → content → engagement → lead.',
    icon: BarChart3,
    fields: [
      { key: 'contentPerformanceMetrics', label: 'Content performance metrics', kind: 'tags', colSpan: 2 },
      { key: 'queryPerformanceMetrics', label: 'Query performance metrics', kind: 'tags', colSpan: 2 },
      { key: 'conversionTrackingNotes', label: 'Conversion tracking notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'funnelStages', label: 'Funnel stages tracked', kind: 'tags', hint: 'Query → Content → Engagement → Lead', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'dashboardUrl', label: 'Dashboard URL', kind: 'url', colSpan: 2 },
    ],
  },

  // ----- 11. Optimization & Rework -----
  {
    id: 'rework',
    step: '11',
    group: 'Operations',
    title: 'Optimization & Rework Engine',
    description: 'Refresh, version, and prevent content decay.',
    icon: RefreshCw,
    fields: [
      { key: 'refreshCadence', label: 'Refresh cadence', kind: 'select', options: [
        { value: '60d', label: 'Every 60 days' },
        { value: '90d', label: 'Every 90 days' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'biannual', label: 'Bi-annual' },
      ]},
      { key: 'versionControlTool', label: 'Version history tool', kind: 'text' },
      { key: 'updateRecommendations', label: 'Standard update recommendations', kind: 'tags', hint: 'Add FAQs / improve clarity / add stats…', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiSuggestionsTool', label: 'AI-driven improvement tool', kind: 'text' },
      { key: 'decayAlertsTool', label: 'Content decay alerts tool', kind: 'text' },
    ],
  },

  // ----- 12. Quality Control & Approval -----
  {
    id: 'qa',
    step: '12',
    group: 'Operations',
    title: 'Quality Control & Approval',
    description: 'Pre-publish checklist + multi-level approvals.',
    icon: ClipboardCheck,
    fields: [
      { key: 'prePublishChecklist', label: 'Pre-publish checklist', kind: 'textarea', rows: 5, hint: 'Answer-first / entities defined / schema added / internal linking…', colSpan: 2 },
      { key: 'contentApprover', label: 'Content approver', kind: 'text' },
      { key: 'seoApprover', label: 'SEO approver', kind: 'text' },
      { key: 'marketingApprover', label: 'Marketing approver', kind: 'text' },
    ],
    advancedFields: [
      { key: 'feedbackThread', label: 'Feedback thread / notes', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
  },

  // ----- 13. Cross-System Integrations -----
  {
    id: 'integrations',
    step: '13',
    group: 'Operations',
    title: 'Cross-System Integrations',
    description: 'Wire GEO into Lead Magnets, Outreach, and CRM.',
    icon: Plug,
    fields: [
      { key: 'leadMagnetFunnel', label: 'GEO content → Lead magnet funnel', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'popupCaptureRules', label: 'Blog → popup → lead capture rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'outreachRetargeting', label: 'GEO traffic → outreach retargeting', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'crmDestination', label: 'CRM destination for GEO leads', kind: 'text' },
      { key: 'attributionNotes', label: 'Attribution / handoff notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },
];

export const GEO_GROUP_ORDER: string[] = [
  'Strategy',
  'Production',
  'Technical',
  'Distribution & Authority',
  'Measurement',
  'Operations',
];

export function geoSectionFilledRatio(
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

export type { FieldDef, SectionDef };
