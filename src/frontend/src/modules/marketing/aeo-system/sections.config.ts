/**
 * AEO (Answer Engine Optimization) System — 17-module config.
 * Sub-menu of /seo. Reuses FieldDef / SectionDef from website-project.
 */

import {
  Award,
  Eye,
  Filter,
  HelpCircle,
  Layout,
  Link as LinkIcon,
  ListTree,
  MessageSquare,
  Mic,
  Quote,
  RefreshCw,
  Search,
  Target,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import type { FieldDef, SectionDef } from '@/modules/website/website-project/sections.config';

export const AEO_SECTIONS: SectionDef[] = [
  // ----- 1. AEO Strategy & Goal Alignment -----
  {
    id: 'strategy',
    step: '1',
    group: 'Strategy',
    title: 'AEO Strategy & Goal Alignment',
    description: 'Anchor every AEO play to a business outcome.',
    icon: Target,
    fields: [
      { key: 'businessGoals', label: 'Business goals', kind: 'tags', hint: 'Leads / Sales / Traffic / Brand…', colSpan: 2 },
      { key: 'revenueModel', label: 'Revenue model', kind: 'select', options: [
        { value: 'service', label: 'Service' },
        { value: 'product', label: 'Product' },
        { value: 'saas', label: 'SaaS' },
        { value: 'marketplace', label: 'Marketplace' },
        { value: 'hybrid', label: 'Hybrid' },
      ]},
      { key: 'macroConversions', label: 'Macro conversions', kind: 'tags', hint: 'Sales, demos booked, contracts signed…', colSpan: 2 },
      { key: 'microConversions', label: 'Micro conversions', kind: 'tags', hint: 'Newsletter, lead magnet, scroll depth…', colSpan: 2 },
      { key: 'ctaAlignment', label: 'CTA alignment with answers', kind: 'textarea', rows: 3, hint: 'How CTAs follow each answer block', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'dashboardUrl', label: 'AEO strategy dashboard URL', kind: 'url', colSpan: 2 },
    ],
  },

  // ----- 2. Audience & Intent Intelligence -----
  {
    id: 'audience',
    step: '2',
    group: 'Strategy',
    title: 'Audience & Intent Intelligence',
    description: 'Know who is asking and how they ask.',
    icon: Users,
    fields: [
      { key: 'demographics', label: 'Demographics', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'psychographics', label: 'Psychographics', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'painPoints', label: 'Pain points', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'searchBehaviour', label: 'Search behaviour notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'deviceMix', label: 'Device mix', kind: 'tags', hint: 'Desktop / mobile / voice / smart speaker…', colSpan: 2 },
      { key: 'voiceShare', label: 'Voice search share (%)', kind: 'text' },
    ],
  },

  // ----- 3. Problem → Query Mapping -----
  {
    id: 'problem-query',
    step: '3',
    group: 'Discovery',
    title: 'Problem → Query Mapping',
    description: 'Turn customer problems into actual search queries.',
    icon: HelpCircle,
    fields: [
      { key: 'problems', label: 'Identified problems', kind: 'tags', colSpan: 2 },
      { key: 'problemQueryMap', label: 'Problem ↔ query mapping', kind: 'textarea', rows: 5, colSpan: 2 },
      { key: 'queryPageMap', label: 'Query → page mapping', kind: 'textarea', rows: 5, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'solutionPages', label: 'Solution pages linked', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 4. Question-Based Keyword Engine -----
  {
    id: 'question-keywords',
    step: '4',
    group: 'Discovery',
    title: 'Question-Based Keyword Engine',
    description: 'What / How / Why queries + long-tail + conversational.',
    icon: Search,
    fields: [
      { key: 'whatQueries', label: 'What queries', kind: 'tags', colSpan: 2 },
      { key: 'howQueries', label: 'How queries', kind: 'tags', colSpan: 2 },
      { key: 'whyQueries', label: 'Why queries', kind: 'tags', colSpan: 2 },
      { key: 'longTailQueries', label: 'Long-tail queries', kind: 'tags', colSpan: 2 },
      { key: 'conversationalQueries', label: 'Conversational queries', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'sources', label: 'Data sources used', kind: 'tags', hint: 'Google autocomplete / People Also Ask / Reddit / Quora…', colSpan: 2 },
    ],
  },

  // ----- 5. Intent Classification -----
  {
    id: 'intent',
    step: '5',
    group: 'Discovery',
    title: 'Intent Classification System',
    description: 'Group queries by what the searcher actually wants.',
    icon: Filter,
    fields: [
      { key: 'informationalQueries', label: 'Informational queries', kind: 'tags', colSpan: 2 },
      { key: 'comparisonQueries', label: 'Comparison queries', kind: 'tags', colSpan: 2 },
      { key: 'transactionalQueries', label: 'Transactional queries', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiIntentTool', label: 'AI intent detection tool', kind: 'text' },
      { key: 'intentScoringRules', label: 'Intent scoring rules', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 6. Content Structure Builder -----
  {
    id: 'structure',
    step: '6',
    group: 'Production',
    title: 'Content Structure Builder (AEO)',
    description: 'Question-first outlines with supporting questions.',
    icon: ListTree,
    fields: [
      { key: 'mainQuestion', label: 'Main question for current piece', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'supportingQuestions', label: 'Supporting questions', kind: 'tags', colSpan: 2 },
      { key: 'outline', label: 'Structured article outline', kind: 'textarea', rows: 8, colSpan: 2 },
    ],
  },

  // ----- 7. Direct Answer Optimization -----
  {
    id: 'direct-answer',
    step: '7',
    group: 'Production',
    title: 'Direct Answer Optimization',
    description: 'Featured snippet block: 40–60 words, above the fold.',
    icon: Zap,
    fields: [
      { key: 'answerBlocks', label: 'Direct answer blocks', kind: 'textarea', rows: 6, hint: '40–60 words each, plain English', colSpan: 2 },
      { key: 'aboveFoldRule', label: 'Above-the-fold placement rule', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'answerClarityScore', label: 'Answer clarity scoring rubric', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'snippetSuggestions', label: 'Snippet optimisation suggestions', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 8. Question-Based Formatting -----
  {
    id: 'q-formatting',
    step: '8',
    group: 'Production',
    title: 'Question-Based Content Formatting',
    description: 'H2/H3 question hierarchy + semantic variations.',
    icon: Layout,
    fields: [
      { key: 'h2H3Rule', label: 'H2/H3 question formatting rule', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'semanticVariations', label: 'Semantic variations to use', kind: 'tags', hint: 'Synonyms, paraphrases, related entities', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiReadabilityChecklist', label: 'AI-readable structure checklist', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
  },

  // ----- 9. Snippet Formatting -----
  {
    id: 'snippet-formatting',
    step: '9',
    group: 'Production',
    title: 'Snippet Formatting System',
    description: 'Numbered steps, bullets, definition boxes.',
    icon: Quote,
    fields: [
      { key: 'numberedStepsRule', label: 'Numbered steps generator rule', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'bulletRule', label: 'Bullet formatting rule', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'definitionBoxRule', label: 'Definition box rule', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'snippetScoringRubric', label: 'Snippet optimisation scoring rubric', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 10. FAQ Optimization -----
  {
    id: 'faq',
    step: '10',
    group: 'Optimization',
    title: 'FAQ Optimization System',
    description: '5–10 FAQs per page, conversational answers, schema.',
    icon: MessageSquare,
    fields: [
      { key: 'faqsPerPage', label: 'FAQs per page (target)', kind: 'text', hint: '5–10 recommended' },
      { key: 'faqList', label: 'FAQ master list', kind: 'tags', colSpan: 2 },
      { key: 'conversationalAnswerStyle', label: 'Conversational answer style', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'faqSchemaUsed', label: 'FAQ schema in use', kind: 'checks' },
      { key: 'howtoSchemaUsed', label: 'HowTo schema in use', kind: 'checks' },
    ],
  },

  // ----- 11. Authority (E-E-A-T) -----
  {
    id: 'eeat',
    step: '11',
    group: 'Optimization',
    title: 'Content Authority Engine (E-E-A-T)',
    description: 'Experience, Expertise, Authoritativeness, Trustworthiness.',
    icon: Award,
    fields: [
      { key: 'authorProfileRule', label: 'Author profile system rule', kind: 'textarea', rows: 3, hint: 'Bio, credentials, headshot, social proof', colSpan: 2 },
      { key: 'experienceSignals', label: 'Experience signals', kind: 'tags', colSpan: 2 },
      { key: 'caseStudyLibrary', label: 'Case study library URL', kind: 'url', colSpan: 2 },
      { key: 'statsLibrary', label: 'Stats library', kind: 'tags', colSpan: 2 },
      { key: 'testimonialsLibrary', label: 'Testimonials library URL', kind: 'url', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'authorityScoringRubric', label: 'Authority scoring rubric', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
  },

  // ----- 12. Technical AEO -----
  {
    id: 'technical',
    step: '12',
    group: 'Optimization',
    title: 'Technical AEO Optimization',
    description: 'Speed, CWV, clean HTML, schema.',
    icon: Wrench,
    fields: [
      { key: 'pageSpeedTarget', label: 'Page speed target', kind: 'text' },
      { key: 'lcpTarget', label: 'LCP target (s)', kind: 'text' },
      { key: 'inpTarget', label: 'INP target (ms)', kind: 'text' },
      { key: 'clsTarget', label: 'CLS target', kind: 'text' },
      { key: 'htmlHierarchyRule', label: 'Clean HTML hierarchy rule', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'schemaTypes', label: 'Schema types implemented', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 13. Internal Linking -----
  {
    id: 'linking',
    step: '13',
    group: 'Distribution',
    title: 'Internal Linking Engine',
    description: 'Topic clusters + funnel-based linking.',
    icon: LinkIcon,
    fields: [
      { key: 'topicClusters', label: 'Topic clusters', kind: 'tags', colSpan: 2 },
      { key: 'funnelLinkingRule', label: 'Funnel-based linking rule', kind: 'textarea', rows: 4, hint: 'Blog → Service → Conversion path', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'anchorTextRules', label: 'Anchor text rules', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 14. Voice Search Optimization -----
  {
    id: 'voice',
    step: '14',
    group: 'Distribution',
    title: 'Voice Search Optimization',
    description: 'Spoken answer style + simulation.',
    icon: Mic,
    fields: [
      { key: 'conversationalToneRule', label: 'Conversational tone rule', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'shortAnswerRule', label: 'Short answer optimisation rule', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'voiceSimulationTool', label: 'Voice query simulation tool', kind: 'text' },
      { key: 'spokenAnswerScoring', label: 'Spoken answer scoring rubric', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 15. AI Visibility Tracking -----
  {
    id: 'visibility',
    step: '15',
    group: 'Measurement',
    title: 'AI Visibility Tracking System',
    description: 'Featured snippets + AI answer presence.',
    icon: Eye,
    fields: [
      { key: 'snippetTrackingTool', label: 'Featured snippet tracking tool', kind: 'text' },
      { key: 'aiAnswerTrackingTool', label: 'AI answer tracking tool', kind: 'text' },
      { key: 'ctrTarget', label: 'CTR target (%)', kind: 'text' },
      { key: 'rankingTarget', label: 'Ranking target', kind: 'text' },
      { key: 'visibilityScoreTarget', label: 'Visibility score target', kind: 'text' },
    ],
    advancedFields: [
      { key: 'dashboardUrl', label: 'Visibility dashboard URL', kind: 'url', colSpan: 2 },
    ],
  },

  // ----- 16. Refresh & Optimization -----
  {
    id: 'refresh',
    step: '16',
    group: 'Operations',
    title: 'Content Refresh & Optimization',
    description: 'Monthly refresh: new FAQs + clarity + AI suggestions.',
    icon: RefreshCw,
    fields: [
      { key: 'refreshCadence', label: 'Refresh cadence', kind: 'select', options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'quarterly', label: 'Quarterly' },
      ]},
      { key: 'refreshChecklist', label: 'Refresh checklist', kind: 'textarea', rows: 4, hint: 'Add new FAQs, improve clarity, update stats…', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiSuggestionsTool', label: 'AI suggestions tool', kind: 'text' },
      { key: 'performanceUpdateRules', label: 'Performance-based update rules', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 17. Conversion Integration Layer -----
  {
    id: 'conversion',
    step: '17',
    group: 'Operations',
    title: 'Conversion Integration Layer',
    description: 'Wire answers → CTAs → leads → CRM.',
    icon: TrendingUp,
    fields: [
      { key: 'ctaPlacementRule', label: 'CTA placement within answers', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'funnelMap', label: 'Funnel map', kind: 'textarea', rows: 3, hint: 'Answer → Click → Lead → Sale', colSpan: 2 },
      { key: 'landingPageDestinations', label: 'Landing page destinations', kind: 'tags', colSpan: 2 },
      { key: 'crmDestination', label: 'CRM destination', kind: 'text' },
      { key: 'emailWhatsappFlow', label: 'Email / WhatsApp follow-up flow', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'attributionNotes', label: 'Attribution notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },
];

export const AEO_GROUP_ORDER: string[] = [
  'Strategy',
  'Discovery',
  'Production',
  'Optimization',
  'Distribution',
  'Measurement',
  'Operations',
];

export function aeoSectionFilledRatio(
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
