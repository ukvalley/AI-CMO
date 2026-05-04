/**
 * AIO (AI-Optimized) System — 24-module config (sub-menu of /seo).
 * Reuses FieldDef / SectionDef from website-project.
 */

import {
  AlertTriangle,
  Award,
  BarChart3,
  Bot,
  ClipboardList,
  Code,
  Compass,
  Eye,
  FileBox,
  Globe,
  Image as ImageIcon,
  LayoutGrid,
  Link as LinkIcon,
  ListTree,
  MessageCircle,
  MessagesSquare,
  Network,
  Quote,
  RefreshCw,
  Share2,
  ShieldCheck,
  Target,
} from 'lucide-react';
import type { FieldDef, SectionDef } from '@/modules/website/website-project/sections.config';

export const AIO_SECTIONS: SectionDef[] = [
  // ----- 1. Foundation & Onboarding -----
  {
    id: 'foundation',
    step: '1',
    group: 'Foundation & Strategy',
    title: 'AIO Foundation & Onboarding',
    description: 'AI readiness audit, content inventory, technical baseline.',
    icon: Compass,
    fields: [
      { key: 'currentSeoLevel', label: 'Current SEO level', kind: 'select', options: [
        { value: 'foundation', label: 'Foundation' },
        { value: 'emerging', label: 'Emerging' },
        { value: 'authority', label: 'Authority' },
      ]},
      { key: 'currentAiVisibility', label: 'Current AI visibility', kind: 'select', options: [
        { value: 'none', label: 'No mentions' },
        { value: 'low', label: 'Low (occasional)' },
        { value: 'medium', label: 'Medium (regular)' },
        { value: 'high', label: 'High (consistent)' },
      ]},
      { key: 'contentInventoryUrl', label: 'Content inventory URL', kind: 'url', colSpan: 2 },
      { key: 'technicalAuditUrl', label: 'Technical audit dashboard URL', kind: 'url', colSpan: 2 },
      { key: 'gapAnalysis', label: 'Gap analysis notes', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiEnginesTracked', label: 'AI engines tracked', kind: 'tags', hint: 'ChatGPT / Gemini / Perplexity / Copilot / Claude…', colSpan: 2 },
    ],
  },

  // ----- 2. Strategy & KPI -----
  {
    id: 'strategy',
    step: '2',
    group: 'Foundation & Strategy',
    title: 'AI Strategy & KPI System',
    description: 'Revenue alignment + AI KPIs.',
    icon: Target,
    fields: [
      { key: 'revenueModel', label: 'Revenue alignment', kind: 'select', options: [
        { value: 'leads', label: 'Leads-led' },
        { value: 'sales', label: 'Sales-led' },
        { value: 'product-led', label: 'Product-led' },
        { value: 'hybrid', label: 'Hybrid' },
      ]},
      { key: 'citationRateTarget', label: 'Citation rate target', kind: 'text', hint: 'e.g. 15% of relevant queries' },
      { key: 'mentionRateTarget', label: 'Mention rate target', kind: 'text' },
      { key: 'aiVisibilityScoreTarget', label: 'AI visibility score target', kind: 'text' },
    ],
    advancedFields: [
      { key: 'shareOfVoiceTool', label: 'AI share of voice tool', kind: 'text', hint: 'Profound, Otterly.AI, Peec…' },
      { key: 'sourceRankingNotes', label: 'Source ranking (1st vs later mentions)', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 3. Query Universe Mapping -----
  {
    id: 'queries',
    step: '3',
    group: 'Discovery & Mapping',
    title: 'Query Universe Mapping',
    description: 'Every query a real customer asks AI.',
    icon: MessagesSquare,
    fields: [
      { key: 'informationalQueries', label: 'Informational queries', kind: 'tags', colSpan: 2 },
      { key: 'commercialQueries', label: 'Commercial queries', kind: 'tags', colSpan: 2 },
      { key: 'transactionalQueries', label: 'Transactional queries', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'conversationTrees', label: 'Conversation tree mapping', kind: 'textarea', rows: 5, hint: 'Query → follow-up → deep question chains', colSpan: 2 },
    ],
  },

  // ----- 4. Entity & Knowledge Graph -----
  {
    id: 'knowledge-graph',
    step: '4',
    group: 'Discovery & Mapping',
    title: 'Entity & Knowledge Graph',
    description: 'Brand, founders, services, schema.',
    icon: Network,
    fields: [
      { key: 'brandEntity', label: 'Brand entity definition', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'founderEntities', label: 'Founder entities', kind: 'tags', colSpan: 2 },
      { key: 'serviceEntities', label: 'Service / product entities', kind: 'tags', colSpan: 2 },
      { key: 'entityRelationships', label: 'Entity relationships', kind: 'textarea', rows: 4, hint: 'Brand → Services / Founder → Brand…', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'organizationSchema', label: 'Organization schema in use', kind: 'checks' },
      { key: 'personSchema', label: 'Person schema in use', kind: 'checks' },
      { key: 'productServiceSchema', label: 'Product / service schema in use', kind: 'checks' },
    ],
  },

  // ----- 5. Entity Authority Builder -----
  {
    id: 'entity-authority',
    step: '5',
    group: 'Discovery & Mapping',
    title: 'Entity Authority Builder',
    description: 'Wikidata, knowledge panel, founder authority.',
    icon: Award,
    fields: [
      { key: 'wikidataItem', label: 'Wikidata item ID', kind: 'text', hint: 'Q12345…' },
      { key: 'knowledgePanelUrl', label: 'Google knowledge panel URL', kind: 'url', colSpan: 2 },
      { key: 'mediaMentions', label: 'Founder media mentions', kind: 'tags', colSpan: 2 },
      { key: 'certifications', label: 'Certifications / credentials', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'sameAsLinks', label: 'sameAs link network', kind: 'tags', hint: 'LinkedIn / GitHub / Crunchbase / Wikipedia…', colSpan: 2 },
      { key: 'entityConsistencyNotes', label: 'Entity consistency notes', kind: 'textarea', rows: 3, hint: 'Bio / name / title consistent across the web', colSpan: 2 },
    ],
  },

  // ----- 16. Prompt Coverage (placed early in Discovery for narrative flow) -----
  {
    id: 'prompt-coverage',
    step: '16',
    group: 'Discovery & Mapping',
    title: 'Prompt Coverage Engine',
    description: 'Cover every What / Why / How / Best / Alternative.',
    icon: ListTree,
    fields: [
      { key: 'whatCoverage', label: '"What" prompts covered', kind: 'tags', colSpan: 2 },
      { key: 'whyCoverage', label: '"Why" prompts covered', kind: 'tags', colSpan: 2 },
      { key: 'howCoverage', label: '"How" prompts covered', kind: 'tags', colSpan: 2 },
      { key: 'bestCoverage', label: '"Best" prompts covered', kind: 'tags', colSpan: 2 },
      { key: 'alternativesCoverage', label: '"Alternatives" prompts covered', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'awarenessStage', label: 'Awareness-stage prompts', kind: 'tags', colSpan: 2 },
      { key: 'considerationStage', label: 'Consideration-stage prompts', kind: 'tags', colSpan: 2 },
      { key: 'decisionStage', label: 'Decision-stage prompts', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 6. Content Optimization for AI Extraction -----
  {
    id: 'content-optimization',
    step: '6',
    group: 'Content & Authority',
    title: 'Content Optimization for AI Extraction',
    description: 'Answer-first, definition blocks, AI-friendly formats.',
    icon: Quote,
    fields: [
      { key: 'answerFirstRule', label: 'Answer-first content rule', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'definitionBlockRule', label: 'Definition block rule', kind: 'textarea', rows: 2, hint: '40–60 words, plain English', colSpan: 2 },
      { key: 'headingStructureRule', label: 'Structured headings rule', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'aiFriendlyFormats', label: 'AI-friendly formats used', kind: 'tags', hint: 'Bullets / numbered steps / tables / definition lists', colSpan: 2 },
    ],
  },

  // ----- 7. Multi-Format Content Engine -----
  {
    id: 'multi-format',
    step: '7',
    group: 'Content & Authority',
    title: 'Multi-Format Content Engine',
    description: 'Comparison, "best of", pricing, FAQ pages.',
    icon: LayoutGrid,
    fields: [
      { key: 'comparisonPages', label: 'Comparison pages', kind: 'tags', colSpan: 2 },
      { key: 'bestOfPages', label: '"Best of" pages', kind: 'tags', colSpan: 2 },
      { key: 'pricingPages', label: 'Pricing pages', kind: 'tags', colSpan: 2 },
      { key: 'faqPages', label: 'FAQ pages', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'quoteWorthyRule', label: 'Quote-worthy content rule', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'caseStudyIntegration', label: 'Case study integration rules', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 8. E-E-A-T Authority Engine -----
  {
    id: 'eeat',
    step: '8',
    group: 'Content & Authority',
    title: 'E-E-A-T Authority Engine',
    description: 'Experience, Expertise, Authoritativeness, Trust signals.',
    icon: ShieldCheck,
    fields: [
      { key: 'authorProfileRule', label: 'Author profile system rule', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'reviewSources', label: 'Review sources tracked', kind: 'tags', colSpan: 2 },
      { key: 'certificationsListed', label: 'Certifications listed', kind: 'tags', colSpan: 2 },
      { key: 'realExamples', label: 'Real-world examples to cite', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'originalDataAssets', label: 'Original data / research assets', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 11. Internal Linking & Context -----
  {
    id: 'linking',
    step: '11',
    group: 'Content & Authority',
    title: 'Internal Linking & Context Engine',
    description: 'Topic clusters + contextual linking + AI context boosters.',
    icon: LinkIcon,
    fields: [
      { key: 'topicClusters', label: 'Topic clusters', kind: 'tags', colSpan: 2 },
      { key: 'contextualLinkRule', label: 'Contextual linking rule', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiContextBoosters', label: 'AI context strengthening tactics', kind: 'textarea', rows: 4, hint: 'Cross-references, glossary, related-entity blocks', colSpan: 2 },
    ],
  },

  // ----- 9. Technical AI Accessibility -----
  {
    id: 'technical',
    step: '9',
    group: 'Technical',
    title: 'Technical AI Accessibility',
    description: 'AI bots can crawl, render, and parse the site.',
    icon: Code,
    fields: [
      { key: 'aiBotsAllowed', label: 'AI bots allowed in robots.txt', kind: 'tags', hint: 'GPTBot / Google-Extended / PerplexityBot / ClaudeBot…', colSpan: 2 },
      { key: 'sitemapXmlUrl', label: 'XML sitemap URL', kind: 'url', colSpan: 2 },
      { key: 'crawlabilityNotes', label: 'Crawlability notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'renderStrategy', label: 'Rendering strategy', kind: 'select', options: [
        { value: 'ssr', label: 'SSR' },
        { value: 'ssg', label: 'SSG' },
        { value: 'isr', label: 'ISR' },
        { value: 'csr', label: 'CSR (avoid)' },
        { value: 'hybrid', label: 'Hybrid' },
      ]},
      { key: 'semanticHtmlNotes', label: 'Clean semantic HTML notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 10. AI-Specific File System -----
  {
    id: 'ai-files',
    step: '10',
    group: 'Technical',
    title: 'AI-Specific File System',
    description: 'llms.txt, instruction files, AI-readable summaries.',
    icon: FileBox,
    fields: [
      { key: 'llmsTxtUrl', label: 'llms.txt URL', kind: 'url', colSpan: 2 },
      { key: 'aiInstructionFiles', label: 'AI instruction files', kind: 'tags', hint: 'llms-full.txt / robots.txt overrides…', colSpan: 2 },
      { key: 'aiReadableSummaries', label: 'AI-readable summary policy', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
  },

  // ----- 12. Distribution & Signal Building -----
  {
    id: 'distribution',
    step: '12',
    group: 'Distribution & Signals',
    title: 'Distribution & Signal Building',
    description: 'LinkedIn, Reddit, Quora, forums, YouTube.',
    icon: Share2,
    fields: [
      { key: 'platforms', label: 'Active distribution platforms', kind: 'tags', colSpan: 2 },
      { key: 'authorityContentNotes', label: 'Authority content publishing notes', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'backlinkTracker', label: 'Backlink tracker', kind: 'text' },
      { key: 'citationTracker', label: 'Citation tracker', kind: 'text' },
    ],
  },

  // ----- 13. Citation & Reputation -----
  {
    id: 'citations',
    step: '13',
    group: 'Distribution & Signals',
    title: 'Citation & Reputation Engine',
    description: 'Track citations, mentions, and co-citation strategy.',
    icon: Quote,
    fields: [
      { key: 'citationTrackingTool', label: 'Citation tracking tool', kind: 'text' },
      { key: 'mentionTrackingTool', label: 'Mention tracking tool', kind: 'text' },
      { key: 'priorityQueriesTracked', label: 'Priority queries tracked', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'coCitationStrategy', label: 'Co-citation strategy', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'prSignalTracking', label: 'PR signal tracking notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 14. Conversational Presence -----
  {
    id: 'conversational',
    step: '14',
    group: 'Distribution & Signals',
    title: 'Conversational Presence System',
    description: 'AI query testing across multiple engines.',
    icon: MessageCircle,
    fields: [
      { key: 'brandQueries', label: 'Brand queries to test', kind: 'tags', colSpan: 2 },
      { key: 'comparisonQueries', label: 'Comparison queries to test', kind: 'tags', colSpan: 2 },
      { key: 'enginesTested', label: 'Engines tested', kind: 'tags', hint: 'ChatGPT / Gemini / Perplexity / Copilot / Claude…', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'testCadence', label: 'Test cadence', kind: 'select', options: [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
      ]},
    ],
  },

  // ----- 17. Community Authority -----
  {
    id: 'community',
    step: '17',
    group: 'Distribution & Signals',
    title: 'Community Authority System',
    description: 'Reddit, forums, expert contributions.',
    icon: Globe,
    fields: [
      { key: 'redditCommunities', label: 'Active Reddit communities', kind: 'tags', colSpan: 2 },
      { key: 'forumsTracked', label: 'Forums / Q&A sites tracked', kind: 'tags', colSpan: 2 },
      { key: 'expertContributors', label: 'Expert contributors', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'contributionCadence', label: 'Contribution cadence', kind: 'text', hint: 'e.g. 3 posts/week per platform' },
    ],
  },

  // ----- 18. Multimedia AIO -----
  {
    id: 'multimedia',
    step: '18',
    group: 'Distribution & Signals',
    title: 'Multimedia AIO System',
    description: 'Images, video, podcast — AI-readable.',
    icon: ImageIcon,
    fields: [
      { key: 'imageOptimisationRule', label: 'Image optimisation rule', kind: 'textarea', rows: 3, hint: 'Alt text + ImageObject schema', colSpan: 2 },
      { key: 'videoOptimisationRule', label: 'Video optimisation rule', kind: 'textarea', rows: 3, hint: 'Transcripts + VideoObject schema', colSpan: 2 },
      { key: 'podcastOptimisationRule', label: 'Podcast optimisation rule', kind: 'textarea', rows: 3, hint: 'Episode transcripts + PodcastEpisode schema', colSpan: 2 },
    ],
  },

  // ----- 15. Hallucination & Misinformation -----
  {
    id: 'hallucination',
    step: '15',
    group: 'Operations',
    title: 'Hallucination & Misinformation System',
    description: 'Detect wrong info about you in AI answers, then correct.',
    icon: AlertTriangle,
    fields: [
      { key: 'detectionPlan', label: 'Wrong-info detection plan', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'claimsTracked', label: 'Claims tracked', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'correctionWorkflow', label: 'Correction workflow', kind: 'textarea', rows: 5, hint: 'Publish correct data + knowledge graph correction', colSpan: 2 },
    ],
  },

  // ----- 21. Content Operations -----
  {
    id: 'operations',
    step: '21',
    group: 'Operations',
    title: 'Content Operations System',
    description: 'AIO templates + editorial workflow + checklist.',
    icon: ClipboardList,
    fields: [
      { key: 'aioTemplates', label: 'AIO content templates', kind: 'tags', hint: 'Pillar / comparison / FAQ / definition / how-to…', colSpan: 2 },
      { key: 'editorialWorkflow', label: 'Editorial workflow', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'qualityChecklist', label: 'Quality checklist', kind: 'textarea', rows: 5, colSpan: 2 },
    ],
  },

  // ----- 19. Monitoring & Tracking -----
  {
    id: 'monitoring',
    step: '19',
    group: 'Measurement',
    title: 'Monitoring & Tracking Dashboard',
    description: 'AI mentions, citation rate, visibility trends.',
    icon: Eye,
    fields: [
      { key: 'mentionsTrackingTool', label: 'AI mentions tracking tool', kind: 'text' },
      { key: 'citationRateTool', label: 'Citation rate tool', kind: 'text' },
      { key: 'visibilityTrendsTool', label: 'Visibility trends tool', kind: 'text' },
    ],
    advancedFields: [
      { key: 'competitorComparison', label: 'Competitor comparison setup', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'sentimentTracking', label: 'Sentiment tracking', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 23. Reporting & ROI -----
  {
    id: 'reporting',
    step: '23',
    group: 'Measurement',
    title: 'Reporting & ROI System',
    description: 'AI traffic + AI-driven conversions + attribution.',
    icon: BarChart3,
    fields: [
      { key: 'aiTrafficTrackingTool', label: 'AI traffic tracking tool', kind: 'text' },
      { key: 'aiConversionTrackingTool', label: 'AI conversion tracking tool', kind: 'text' },
    ],
    advancedFields: [
      { key: 'roiDashboardUrl', label: 'ROI dashboard URL', kind: 'url', colSpan: 2 },
      { key: 'growthAttributionNotes', label: 'Growth attribution notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 20. AI Update & Adaptation -----
  {
    id: 'adaptation',
    step: '20',
    group: 'Future & Adaptation',
    title: 'AI Update & Adaptation Engine',
    description: 'Track model + algorithm changes and respond.',
    icon: RefreshCw,
    fields: [
      { key: 'modelUpdateSources', label: 'Model update sources tracked', kind: 'tags', hint: 'OpenAI release notes / Google AI updates / Anthropic changelog…', colSpan: 2 },
      { key: 'algoChangeAlertsTool', label: 'Algorithm change alerts tool', kind: 'text' },
    ],
    advancedFields: [
      { key: 'strategyUpdateProcess', label: 'Strategy update process', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
  },

  // ----- 22. AI Agent Optimization -----
  {
    id: 'agent-optimization',
    step: '22',
    group: 'Future & Adaptation',
    title: 'AI Agent Optimization (Future Layer)',
    description: 'Agent-readable content + API access.',
    icon: Bot,
    fields: [
      { key: 'agentReadableContentRule', label: 'Agent-readable content rule', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'apiAccessUrl', label: 'API access URL / spec', kind: 'url', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'mcpEnabled', label: 'MCP server exposed', kind: 'checks' },
      { key: 'agentSandboxNotes', label: 'Agent sandbox notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 24. Crisis Management -----
  {
    id: 'crisis',
    step: '24',
    group: 'Future & Adaptation',
    title: 'Crisis Management System',
    description: 'Detect and rapidly correct negative AI mentions.',
    icon: AlertTriangle,
    fields: [
      { key: 'negativeMentionsAlert', label: 'Negative mentions alert tool', kind: 'text' },
      { key: 'rapidCorrectionWorkflow', label: 'Rapid correction workflow', kind: 'textarea', rows: 5, colSpan: 2 },
      { key: 'oncallContacts', label: 'On-call contacts', kind: 'tags', colSpan: 2 },
    ],
  },
];

export const AIO_GROUP_ORDER: string[] = [
  'Foundation & Strategy',
  'Discovery & Mapping',
  'Content & Authority',
  'Technical',
  'Distribution & Signals',
  'Operations',
  'Measurement',
  'Future & Adaptation',
];

export function aioSectionFilledRatio(
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
