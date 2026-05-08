/**
 * SEO System — 15-module config.
 * Reuses FieldDef / SectionDef from website-project.
 */

import {
  Activity,
  BarChart3,
  Bot,
  ClipboardCheck,
  FileBarChart,
  FileText,
  Layers,
  Link as LinkIcon,
  LineChart,
  MapPin,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  Split,
  Tag,
} from 'lucide-react';
import type { FieldDef, SectionDef } from '@/modules/website/website-project/sections.config';

export const SEO_SECTIONS: SectionDef[] = [
  // ----- 1. Discovery & Onboarding -----
  {
    id: 'onboarding',
    step: '1',
    group: 'Foundation',
    title: 'Discovery & Onboarding',
    description: 'Business profile, targeting, KPIs, access, and compliance.',
    icon: Rocket,
    fields: [
      { key: 'industry', label: 'Industry', kind: 'text' },
      { key: 'usp', label: 'Unique selling point', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'productsServices', label: 'Products / services', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'geography', label: 'Geography targeted', kind: 'tags', colSpan: 2 },
      { key: 'languages', label: 'Languages targeted', kind: 'tags' },
      { key: 'competitors', label: 'Competitor identification', kind: 'tags', colSpan: 2 },
      { key: 'brandVoice', label: 'Brand voice notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'goal', label: 'Primary goal', kind: 'select', options: [
        { value: 'traffic', label: 'Traffic' },
        { value: 'leads', label: 'Leads' },
        { value: 'sales', label: 'Sales' },
        { value: 'brand', label: 'Brand awareness' },
      ]},
      { key: 'reportingFrequency', label: 'Reporting frequency', kind: 'select', options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
      ]},
    ],
    advancedFields: [
      { key: 'cmsAccess', label: 'CMS access notes', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'hostingAccess', label: 'Hosting / domain access', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'gscConnected', label: 'GSC connected', kind: 'checks' },
      { key: 'ga4Connected', label: 'GA4 connected', kind: 'checks' },
      { key: 'gtmConnected', label: 'GTM connected', kind: 'checks' },
      { key: 'ndaSigned', label: 'NDA signed', kind: 'checks' },
      { key: 'slaSigned', label: 'SLA signed', kind: 'checks' },
      { key: 'approvalWorkflow', label: 'Approval workflow', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 2. Audit & Baseline -----
  {
    id: 'audit',
    step: '2',
    group: 'Foundation',
    title: 'SEO Audit & Baseline System',
    description: 'Where we start — historical performance, crawl issues.',
    icon: ClipboardCheck,
    fields: [
      { key: 'historicalPerformance', label: 'Historical performance summary', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'rankingSnapshot', label: 'Ranking snapshot URL', kind: 'url', colSpan: 2 },
      { key: 'backlinkProfile', label: 'Backlink profile summary', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'indexedPagesCount', label: 'Indexed pages count', kind: 'number' },
      { key: 'crawlTool', label: 'Site crawl tool', kind: 'text', hint: 'Screaming Frog, Sitebulb, Ahrefs Site Audit…' },
    ],
    advancedFields: [
      { key: 'criticalIssues', label: 'Critical issues', kind: 'tags', colSpan: 2 },
      { key: 'highIssues', label: 'High priority issues', kind: 'tags', colSpan: 2 },
      { key: 'mediumIssues', label: 'Medium priority issues', kind: 'tags', colSpan: 2 },
      { key: 'lowIssues', label: 'Low priority issues', kind: 'tags', colSpan: 2 },
      { key: 'penaltySigns', label: 'Penalty / manual action notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'quickWins', label: 'Quick win suggestions', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 3. Keyword Research & Intent -----
  {
    id: 'keywords',
    step: '3',
    group: 'Discovery',
    title: 'Keyword Research & Intent Engine',
    description: 'Seed → expansion → intent → clusters → page mapping.',
    icon: Search,
    fields: [
      { key: 'seedKeywords', label: 'Seed keywords', kind: 'tags', colSpan: 2 },
      { key: 'longTail', label: 'Long-tail keywords', kind: 'tags', colSpan: 2 },
      { key: 'questions', label: 'Question keywords', kind: 'tags', colSpan: 2 },
      { key: 'comparisons', label: 'Comparison keywords', kind: 'tags', hint: 'X vs Y, alternatives to X', colSpan: 2 },
      { key: 'intentNotes', label: 'Search intent classification notes', kind: 'textarea', rows: 3, hint: 'Informational / navigational / transactional / commercial split', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'clusters', label: 'Keyword clusters', kind: 'tags', colSpan: 2 },
      { key: 'primaryMapping', label: 'Primary keyword → page map', kind: 'textarea', rows: 4, hint: 'Each line: "/page-url → primary keyword"', colSpan: 2 },
      { key: 'secondaryMapping', label: 'Secondary keywords per page', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
  },

  // ----- 4. Content Strategy & Production -----
  {
    id: 'content',
    step: '4',
    group: 'Discovery',
    title: 'Content Strategy & Production System',
    description: 'Editorial calendar, brief workflow, quality control.',
    icon: FileText,
    fields: [
      { key: 'editorialCalendarUrl', label: 'Editorial calendar URL', kind: 'url', colSpan: 2 },
      { key: 'briefTemplate', label: 'Content brief template URL', kind: 'url', colSpan: 2 },
      { key: 'contentTypes', label: 'Content types in scope', kind: 'tags', hint: 'Blogs / pillar pages / case studies / comparison / glossary…', colSpan: 2 },
      { key: 'workflowStages', label: 'Workflow stages', kind: 'tags', hint: 'Writer → Editor → SEO → Approval', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'plagiarismCheckTool', label: 'Plagiarism check tool', kind: 'text' },
      { key: 'seoChecklistUrl', label: 'SEO checklist URL', kind: 'url' },
      { key: 'refreshCadence', label: 'Content refresh cadence', kind: 'select', options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'biannual', label: 'Bi-annual' },
        { value: 'annual', label: 'Annual' },
      ]},
    ],
  },

  // ----- 5. On-Page SEO -----
  {
    id: 'on-page',
    step: '5',
    group: 'Optimization',
    title: 'On-Page SEO Optimization Engine',
    description: 'Title, meta, headings, internal links, E-E-A-T.',
    icon: Tag,
    fields: [
      { key: 'titleRules', label: 'Title rules', kind: 'textarea', rows: 3, hint: 'Length, keyword position, brand handling', colSpan: 2 },
      { key: 'metaRules', label: 'Meta description rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'headingRules', label: 'Heading hierarchy rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'internalLinkRules', label: 'Internal linking rules', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'serpFeatureTargets', label: 'SERP feature targets', kind: 'tags', hint: 'Featured snippet / PAA / image pack…', colSpan: 2 },
      { key: 'snippetOptimisation', label: 'Featured snippet optimisation rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'eatChecklist', label: 'E-E-A-T checklist', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'ctaRules', label: 'CTA optimisation rules', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'thankYouPagePolicy', label: 'Thank-you page policy', kind: 'text' },
      { key: 'page404Policy', label: '404 page optimisation', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
  },

  // ----- 6. Technical SEO -----
  {
    id: 'technical',
    step: '6',
    group: 'Optimization',
    title: 'Technical SEO Engine',
    description: 'Crawl, index, schema, performance, JS SEO.',
    icon: Settings,
    fields: [
      { key: 'crawlabilityNotes', label: 'Crawlability notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'indexingControl', label: 'Indexing control rules', kind: 'textarea', rows: 3, hint: 'noindex policy, robots, meta robots', colSpan: 2 },
      { key: 'canonicalStrategy', label: 'Canonical management', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'sitemapUrl', label: 'sitemap.xml URL', kind: 'url', colSpan: 2 },
      { key: 'lcpTarget', label: 'LCP target (s)', kind: 'text' },
      { key: 'inpTarget', label: 'INP target (ms)', kind: 'text' },
      { key: 'clsTarget', label: 'CLS target', kind: 'text' },
      { key: 'mobileChecks', label: 'Mobile optimisation checks', kind: 'tags' },
    ],
    advancedFields: [
      { key: 'schemaTypes', label: 'Schema types deployed', kind: 'tags', colSpan: 2 },
      { key: 'logFileAnalysis', label: 'Log file analysis notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'jsSeoNotes', label: 'JavaScript SEO notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'crawlBudgetPlan', label: 'Crawl budget optimisation', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 7. Off-Page SEO & Authority -----
  {
    id: 'off-page',
    step: '7',
    group: 'Optimization',
    title: 'Off-Page SEO & Authority',
    description: 'Backlinks, outreach, digital PR, brand mentions.',
    icon: LinkIcon,
    fields: [
      { key: 'backlinkTracker', label: 'Backlink tracker tool', kind: 'text' },
      { key: 'linkBuildingCampaigns', label: 'Active link-building campaigns', kind: 'tags', colSpan: 2 },
      { key: 'outreachTool', label: 'Outreach management tool', kind: 'text' },
    ],
    advancedFields: [
      { key: 'digitalPRPlan', label: 'Digital PR plan', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'brandMentionTool', label: 'Brand mention tracker', kind: 'text' },
      { key: 'influencerOutreachList', label: 'Influencer outreach list', kind: 'tags', colSpan: 2 },
      { key: 'reviewManagementPlan', label: 'Review management plan', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 8. Local SEO -----
  {
    id: 'local',
    step: '8',
    group: 'Optimization',
    title: 'Local SEO Module',
    description: 'GBP, citations, NAP, local landing pages.',
    icon: MapPin,
    fields: [
      { key: 'gbpUrl', label: 'Google Business Profile URL', kind: 'url', colSpan: 2 },
      { key: 'gbpCategories', label: 'GBP categories', kind: 'tags', colSpan: 2 },
      { key: 'citationsList', label: 'Local citations tracked', kind: 'tags', colSpan: 2 },
      { key: 'napConsistencyCheck', label: 'NAP consistency check notes', kind: 'textarea', rows: 3, hint: 'Name, Address, Phone consistency across listings', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'localLandingPages', label: 'Local landing pages list', kind: 'tags', colSpan: 2 },
      { key: 'reviewGenSystem', label: 'Review generation system', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 9. SaaS SEO -----
  {
    id: 'saas',
    step: '9',
    group: 'Optimization',
    title: 'SaaS SEO System',
    description: 'Programmatic SEO + comparison/alternatives + free tools.',
    icon: Layers,
    fields: [
      { key: 'pSeoTemplates', label: 'Programmatic SEO templates', kind: 'tags', hint: 'e.g. /[city]/[service]', colSpan: 2 },
      { key: 'comparisonPages', label: 'Comparison pages list', kind: 'tags', colSpan: 2 },
      { key: 'alternativesPages', label: '"Alternatives to X" pages', kind: 'tags', colSpan: 2 },
      { key: 'useCasePages', label: 'Use-case pages', kind: 'tags', colSpan: 2 },
      { key: 'integrationPages', label: 'Integration pages', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'freeToolsPlan', label: 'Free tools / calculators planned', kind: 'tags', colSpan: 2 },
      { key: 'templatesLibraryUrl', label: 'Templates library URL', kind: 'url', colSpan: 2 },
      { key: 'docsSeoPlan', label: 'Documentation SEO plan', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 10. GEO / AEO / AI Search -----
  {
    id: 'geo-aeo',
    step: '10',
    group: 'Optimization',
    title: 'GEO / AEO / AI Search Optimization',
    description: 'Answer engines, entities, LLM citations.',
    icon: Bot,
    fields: [
      { key: 'aiAnswerRules', label: 'AI answer optimisation rules', kind: 'textarea', rows: 3, hint: '40–60 word direct-answer blocks', colSpan: 2 },
      { key: 'faqStructure', label: 'FAQ structuring rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'entitiesMap', label: 'Entity mapping', kind: 'tags', hint: 'Topics + canonical entity URLs', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'llmCitationTracker', label: 'LLM citation tracker', kind: 'text' },
      { key: 'aiVisibilityPlatforms', label: 'Platforms tracked', kind: 'tags', hint: 'ChatGPT, Gemini, Perplexity, Copilot…', colSpan: 2 },
      { key: 'factBlocks', label: 'Structured fact blocks', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 11. Rank & SERP Monitoring -----
  {
    id: 'rank-tracking',
    step: '11',
    group: 'Measurement',
    title: 'Rank Tracking & SERP Monitoring',
    description: 'Keyword rank, mobile vs desktop, share of voice.',
    icon: LineChart,
    fields: [
      { key: 'rankingTool', label: 'Ranking tool', kind: 'text', hint: 'Ahrefs, SEMrush, Mangools, AccuRanker…' },
      { key: 'desktopMobileSplit', label: 'Tracking desktop vs mobile', kind: 'checks' },
      { key: 'competitorTracking', label: 'Competitors tracked', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'serpFeaturesTracked', label: 'SERP features tracked', kind: 'tags', colSpan: 2 },
      { key: 'visibilityScoreTarget', label: 'Visibility score target', kind: 'text' },
      { key: 'shareOfVoiceTarget', label: 'Share-of-voice target', kind: 'text' },
    ],
  },

  // ----- 12. CRO -----
  {
    id: 'cro',
    step: '12',
    group: 'Measurement',
    title: 'Conversion Rate Optimization',
    description: 'Heatmaps, recordings, funnels, A/B tests.',
    icon: Split,
    fields: [
      { key: 'heatmapTool', label: 'Heatmap tool', kind: 'text', hint: 'Hotjar, Clarity, Lucky Orange…' },
      { key: 'sessionRecordingTool', label: 'Session recording tool', kind: 'text' },
      { key: 'funnelAnalysisTool', label: 'Funnel analysis tool', kind: 'text' },
    ],
    advancedFields: [
      { key: 'abTestQueue', label: 'A/B test queue', kind: 'tags', colSpan: 2 },
      { key: 'formAnalyticsTool', label: 'Form analytics tool', kind: 'text' },
      { key: 'lpOptimisationNotes', label: 'Landing page optimisation notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 13. Tracking & Analytics -----
  {
    id: 'tracking',
    step: '13',
    group: 'Measurement',
    title: 'Tracking & Analytics Setup',
    description: 'GA4, GSC, GTM, UTM, conversion events.',
    icon: BarChart3,
    fields: [
      { key: 'ga4PropertyId', label: 'GA4 property ID', kind: 'text' },
      { key: 'gscProperty', label: 'GSC property URL', kind: 'url' },
      { key: 'gtmContainerId', label: 'GTM container ID', kind: 'text' },
    ],
    advancedFields: [
      { key: 'utmConventions', label: 'UTM naming conventions', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'serverSideTracking', label: 'Server-side tracking enabled', kind: 'checks' },
      { key: 'conversionEvents', label: 'Conversion events', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 14. Reporting -----
  {
    id: 'reporting',
    step: '14',
    group: 'Measurement',
    title: 'Reporting System',
    description: 'Traffic, ranking, and conversion reports.',
    icon: FileBarChart,
    fields: [
      { key: 'weeklyReportTemplate', label: 'Weekly report template URL', kind: 'url', colSpan: 2 },
      { key: 'monthlyReportTemplate', label: 'Monthly report template URL', kind: 'url', colSpan: 2 },
      { key: 'quarterlyReviewTemplate', label: 'Quarterly review template URL', kind: 'url', colSpan: 2 },
      { key: 'recipients', label: 'Report recipients', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'roiDashboardUrl', label: 'ROI dashboard URL', kind: 'url', colSpan: 2 },
      { key: 'kpiTargets', label: 'KPI targets', kind: 'textarea', rows: 4, hint: 'Per-month traffic, leads, sales targets', colSpan: 2 },
    ],
  },

  // ----- 15. Ongoing Maintenance -----
  {
    id: 'maintenance',
    step: '15',
    group: 'Operate',
    title: 'Ongoing Maintenance System',
    description: 'Algorithm updates, audits, refreshes, strategy revision.',
    icon: RefreshCw,
    fields: [
      { key: 'algorithmUpdateTracker', label: 'Algorithm update tracker', kind: 'text', hint: 'Search Engine Land, Sistrix Visibility Index…' },
      { key: 'monthlyAuditCadence', label: 'Monthly audit cadence', kind: 'select', options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'quarterly', label: 'Quarterly' },
      ]},
      { key: 'backlinkAuditCadence', label: 'Backlink audit cadence', kind: 'select', options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'biannual', label: 'Bi-annual' },
      ]},
      { key: 'refreshBacklog', label: 'Content refresh backlog', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'competitiveIntelligence', label: 'Competitive intelligence notes', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'strategyRevision', label: 'Strategy revision cadence', kind: 'text' },
    ],
  },
];

export const SEO_GROUP_ORDER: string[] = [
  'Foundation',
  'Discovery',
  'Optimization',
  'Measurement',
  'Operate',
];

export function seoSectionFilledRatio(
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
