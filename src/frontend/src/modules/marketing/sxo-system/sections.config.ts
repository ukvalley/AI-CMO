/**
 * SXO (Search Experience Optimization) System — 20-module config.
 * Sub-menu of /seo. SEO + UX + CRO unified.
 */

import {
  Accessibility,
  Activity,
  BarChart3,
  ClipboardCheck,
  Coins,
  Compass,
  FileBarChart,
  Layout,
  Link as LinkIcon,
  ListTree,
  MousePointerClick,
  Network,
  RefreshCw,
  Repeat,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import type { FieldDef, SectionDef } from '@/modules/website/website-project/sections.config';

export const SXO_SECTIONS: SectionDef[] = [
  // ----- 1. Foundation & Audit -----
  {
    id: 'foundation',
    step: '1',
    group: 'Foundation',
    title: 'SXO Foundation & Audit',
    description: 'SEO + UX + CRO baseline + maturity scoring.',
    icon: Compass,
    fields: [
      { key: 'seoBaseline', label: 'SEO baseline notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'uxBaseline', label: 'UX baseline notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'croBaseline', label: 'CRO baseline notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'techStack', label: 'Tech stack', kind: 'tags', colSpan: 2 },
      { key: 'brandAssetsUrl', label: 'Brand asset library URL', kind: 'url', colSpan: 2 },
      { key: 'maturityLevel', label: 'SXO maturity level', kind: 'select', options: [
        { value: 'basic', label: 'Basic' },
        { value: 'emerging', label: 'Emerging' },
        { value: 'advanced', label: 'Advanced' },
      ]},
    ],
    advancedFields: [
      { key: 'gapAnalysis', label: 'Gap analysis report', kind: 'textarea', rows: 5, colSpan: 2 },
    ],
  },

  // ----- 2. Revenue Alignment -----
  {
    id: 'revenue',
    step: '2',
    group: 'Foundation',
    title: 'Business & Revenue Alignment',
    description: 'Annual revenue → monthly leads → conversion model.',
    icon: Coins,
    fields: [
      { key: 'annualRevenueTarget', label: 'Annual revenue target', kind: 'text' },
      { key: 'monthlyRevenueTarget', label: 'Monthly revenue target', kind: 'text' },
      { key: 'leadsToCloseRatio', label: 'Leads → close ratio', kind: 'text', hint: 'e.g. 10:1' },
      { key: 'avgDealSize', label: 'Average deal size', kind: 'text' },
      { key: 'trafficTarget', label: 'Traffic target / month', kind: 'text' },
      { key: 'conversionRateTarget', label: 'Conversion rate target', kind: 'text' },
      { key: 'bounceRateTarget', label: 'Bounce rate target', kind: 'text' },
      { key: 'ctrTarget', label: 'CTR target', kind: 'text' },
    ],
    advancedFields: [
      { key: 'cacTarget', label: 'CAC target', kind: 'text' },
      { key: 'ltvTarget', label: 'LTV target', kind: 'text' },
      { key: 'funnelVelocity', label: 'Funnel velocity notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 3. Audience & Behaviour -----
  {
    id: 'audience',
    step: '3',
    group: 'Discovery',
    title: 'Audience & Behaviour Intelligence',
    description: 'Intent + device + voice of customer.',
    icon: Users,
    fields: [
      { key: 'intentSplit', label: 'Search intent split', kind: 'textarea', rows: 3, hint: 'Informational / commercial / transactional %', colSpan: 2 },
      { key: 'deviceMix', label: 'Device mix', kind: 'tags', hint: 'Desktop / mobile / tablet / voice…', colSpan: 2 },
      { key: 'queryJourneyNotes', label: 'Query journey mapping', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'reviewSources', label: 'Voice of customer — review sources', kind: 'tags', colSpan: 2 },
      { key: 'supportTicketsTheme', label: 'Voice of customer — support themes', kind: 'tags', colSpan: 2 },
      { key: 'salesCallInsights', label: 'Voice of customer — sales call insights', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 4. Keyword + Intent + Journey -----
  {
    id: 'keywords-journey',
    step: '4',
    group: 'Discovery',
    title: 'Keyword + Intent + Journey Engine',
    description: 'Cluster, map intent, track multi-step journeys.',
    icon: Network,
    fields: [
      { key: 'keywordClusters', label: 'Keyword clusters', kind: 'tags', colSpan: 2 },
      { key: 'intentMap', label: 'Intent mapping notes', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'journeyTracking', label: 'Query journey tracking notes', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'multiStepJourneys', label: 'Multi-step journeys', kind: 'textarea', rows: 4, hint: 'Query A → Query B → Conversion', colSpan: 2 },
    ],
  },

  // ----- 5. SERP & Competitor Experience -----
  {
    id: 'serp-competitor',
    step: '5',
    group: 'Discovery',
    title: 'SERP & Competitor Experience',
    description: 'Reverse-engineer what wins in your SERPs.',
    icon: Search,
    fields: [
      { key: 'topResults', label: 'Top SERP results to study', kind: 'tags', hint: 'URLs of pages dominating your terms', colSpan: 2 },
      { key: 'contentTypeBreakdown', label: 'Content type breakdown', kind: 'textarea', rows: 3, hint: 'Blog / video / product / comparison %', colSpan: 2 },
      { key: 'competitorUxNotes', label: 'Competitor UX notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'competitorCtaNotes', label: 'Competitor CTA notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'contentDepthNotes', label: 'Content depth notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'snippetReverseEngineering', label: 'Snippet reverse-engineering log', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'paaExtraction', label: 'People Also Ask extraction', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 6. Technical Experience -----
  {
    id: 'technical',
    step: '6',
    group: 'Technical & Accessibility',
    title: 'Technical Experience Optimization',
    description: 'CWV, page speed, crawl health.',
    icon: Wrench,
    fields: [
      { key: 'lcpTarget', label: 'LCP target (s)', kind: 'text' },
      { key: 'inpTarget', label: 'INP target (ms)', kind: 'text' },
      { key: 'clsTarget', label: 'CLS target', kind: 'text' },
      { key: 'pageSpeedTool', label: 'Page speed tool', kind: 'text' },
      { key: 'crawlErrorsTool', label: 'Crawl errors tool', kind: 'text' },
      { key: 'indexationIssuesNotes', label: 'Indexation issues', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'redirectIssuesNotes', label: 'Redirect issues', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'jsRenderingNotes', label: 'JS rendering optimisation', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'cdnCachingPlan', label: 'CDN + caching plan', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 7. Accessibility -----
  {
    id: 'accessibility',
    step: '7',
    group: 'Technical & Accessibility',
    title: 'Accessibility & Inclusive Design',
    description: 'WCAG, contrast, screen reader, keyboard.',
    icon: Accessibility,
    fields: [
      { key: 'wcagLevel', label: 'WCAG level target', kind: 'select', options: [
        { value: 'A', label: 'A' },
        { value: 'AA', label: 'AA (recommended)' },
        { value: 'AAA', label: 'AAA' },
      ]},
      { key: 'contrastChecks', label: 'Colour contrast checks', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'screenReaderChecks', label: 'Screen reader compatibility checks', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'keyboardNavTesting', label: 'Keyboard navigation testing notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'auditReportUrl', label: 'Accessibility audit report URL', kind: 'url', colSpan: 2 },
    ],
  },

  // ----- 8. Content Experience -----
  {
    id: 'content-experience',
    step: '8',
    group: 'Experience',
    title: 'Content Experience Optimization',
    description: 'Layout per intent + value prop + content quality.',
    icon: Layout,
    fields: [
      { key: 'blogLayoutRule', label: 'Blog layout rule', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'comparisonLayoutRule', label: 'Comparison page layout rule', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'landingLayoutRule', label: 'Landing page layout rule', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'valuePropFormula', label: 'Value proposition formula', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'depthAnalyzerTool', label: 'Content depth analyser', kind: 'text' },
      { key: 'readabilityTarget', label: 'Readability target', kind: 'text', hint: 'e.g. Flesch 60+' },
    ],
  },

  // ----- 9. UX & Trust -----
  {
    id: 'ux-trust',
    step: '9',
    group: 'Experience',
    title: 'UX & Trust Optimization',
    description: 'Trust signals + visual hierarchy + personalisation.',
    icon: ShieldCheck,
    fields: [
      { key: 'testimonialsLibrary', label: 'Testimonials library URL', kind: 'url', colSpan: 2 },
      { key: 'certificationsListed', label: 'Certifications shown', kind: 'tags', colSpan: 2 },
      { key: 'visualHierarchyRules', label: 'Visual hierarchy rules', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'geoPersonalization', label: 'Geo-based personalisation', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'behaviourPersonalization', label: 'Behaviour-based personalisation', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'sourcePersonalization', label: 'Source-based personalisation', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 10. Internal Linking & Authority -----
  {
    id: 'linking',
    step: '10',
    group: 'Experience',
    title: 'Internal Linking & Authority',
    description: 'Topic clusters, pillar pages, link depth.',
    icon: LinkIcon,
    fields: [
      { key: 'topicClusters', label: 'Topic clusters', kind: 'tags', colSpan: 2 },
      { key: 'pillarPages', label: 'Pillar pages', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'linkDepthRule', label: 'Link depth optimisation rule', kind: 'textarea', rows: 3, hint: 'Max clicks from home / pillar to leaf', colSpan: 2 },
      { key: 'contextualLinkRule', label: 'Contextual linking rule', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 11. CRO Engine -----
  {
    id: 'cro',
    step: '11',
    group: 'Conversion',
    title: 'Conversion Rate Optimization (CRO)',
    description: 'CTAs, forms, multi-step funnels, exit intent.',
    icon: MousePointerClick,
    fields: [
      { key: 'ctaPlacementRules', label: 'CTA placement rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'ctaCopyVariants', label: 'CTA copy variants', kind: 'tags', colSpan: 2 },
      { key: 'formFieldRules', label: 'Form field reduction rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'autofillEnabled', label: 'Autofill enabled', kind: 'checks' },
    ],
    advancedFields: [
      { key: 'multiStepFunnelTool', label: 'Multi-step funnel builder', kind: 'text' },
      { key: 'exitIntentTool', label: 'Exit intent tool', kind: 'text' },
    ],
  },

  // ----- 12. User Journey -----
  {
    id: 'user-journey',
    step: '12',
    group: 'Conversion',
    title: 'User Journey Optimization',
    description: 'Entry → action → conversion + cross-session tracking.',
    icon: ListTree,
    fields: [
      { key: 'funnelStages', label: 'Funnel stages', kind: 'tags', hint: 'Entry → Action → Conversion', colSpan: 2 },
      { key: 'multiSessionTrackingTool', label: 'Multi-session tracking tool', kind: 'text' },
    ],
    advancedFields: [
      { key: 'crossDeviceTrackingTool', label: 'Cross-device journey tracking', kind: 'text' },
    ],
  },

  // ----- 13. Personalization -----
  {
    id: 'personalization',
    step: '13',
    group: 'Conversion',
    title: 'Personalization & Dynamic Content',
    description: 'Dynamic blocks + returning user + AI recs.',
    icon: Sparkles,
    fields: [
      { key: 'dynamicBlocks', label: 'Dynamic content blocks', kind: 'tags', colSpan: 2 },
      { key: 'returningUserRules', label: 'Returning user personalisation rules', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'recommendationEngine', label: 'AI recommendation engine', kind: 'text' },
    ],
  },

  // ----- 14. Analytics -----
  {
    id: 'analytics',
    step: '14',
    group: 'Measurement',
    title: 'Analytics & Tracking Dashboard',
    description: 'SEO + UX + conversion metrics.',
    icon: BarChart3,
    fields: [
      { key: 'seoMetricsTracked', label: 'SEO metrics tracked', kind: 'tags', hint: 'Traffic / rankings / CTR…', colSpan: 2 },
      { key: 'uxMetricsTracked', label: 'UX metrics tracked', kind: 'tags', hint: 'Time on page / scroll depth / engagement…', colSpan: 2 },
      { key: 'conversionMetricsTracked', label: 'Conversion metrics tracked', kind: 'tags', hint: 'Conversion rate / funnel drop-off…', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'dashboardUrl', label: 'Combined dashboard URL', kind: 'url', colSpan: 2 },
    ],
  },

  // ----- 15. Attribution -----
  {
    id: 'attribution',
    step: '15',
    group: 'Measurement',
    title: 'Attribution & Revenue Tracking',
    description: 'Multi-touch + channel + revenue attribution.',
    icon: TrendingUp,
    fields: [
      { key: 'attributionModel', label: 'Attribution model', kind: 'select', options: [
        { value: 'last-click', label: 'Last-click' },
        { value: 'first-click', label: 'First-click' },
        { value: 'linear', label: 'Linear' },
        { value: 'time-decay', label: 'Time-decay' },
        { value: 'data-driven', label: 'Data-driven' },
        { value: 'multi-touch', label: 'Multi-touch (custom)' },
      ]},
      { key: 'channelsTracked', label: 'Channels tracked', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'revenueAttributionDashboard', label: 'Revenue attribution dashboard URL', kind: 'url', colSpan: 2 },
    ],
  },

  // ----- 16. A/B Testing -----
  {
    id: 'ab-testing',
    step: '16',
    group: 'Measurement',
    title: 'A/B Testing & Experimentation',
    description: 'A/B + multivariate + winner selection.',
    icon: Repeat,
    fields: [
      { key: 'testingTool', label: 'A/B testing tool', kind: 'text', hint: 'VWO, Optimizely, Convert, GrowthBook…' },
      { key: 'testAreas', label: 'Test areas', kind: 'tags', hint: 'Headlines / CTA / layout / pricing…', colSpan: 2 },
      { key: 'currentTests', label: 'Current tests running', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'winnerSelectionRule', label: 'Winner selection rule', kind: 'textarea', rows: 3, hint: 'Min sample / confidence threshold', colSpan: 2 },
      { key: 'experimentLogUrl', label: 'Experiment log URL', kind: 'url', colSpan: 2 },
    ],
  },

  // ----- 17. Search Behaviour Optimization -----
  {
    id: 'search-behaviour',
    step: '17',
    group: 'Measurement',
    title: 'Search Behaviour Optimization',
    description: 'CTR + dwell time + pogo-sticking reduction.',
    icon: Activity,
    fields: [
      { key: 'titleMetaRules', label: 'Title / meta optimisation rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'serpBehaviourTool', label: 'SERP behaviour tracking tool', kind: 'text' },
    ],
    advancedFields: [
      { key: 'dwellTimeOptimisation', label: 'Dwell time optimisation tactics', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'pogoStickingNotes', label: 'Pogo-sticking reduction notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 18. Content Lifecycle -----
  {
    id: 'lifecycle',
    step: '18',
    group: 'Operations',
    title: 'Content Lifecycle Management',
    description: 'Audit, refresh, prune.',
    icon: RefreshCw,
    fields: [
      { key: 'auditCadence', label: 'Audit cadence', kind: 'select', options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'biannual', label: 'Bi-annual' },
        { value: 'annual', label: 'Annual' },
      ]},
      { key: 'refreshCriteria', label: 'Refresh criteria', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'pruningCriteria', label: 'Pruning criteria', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 19. Continuous Optimization -----
  {
    id: 'continuous',
    step: '19',
    group: 'Operations',
    title: 'Continuous Optimization Engine',
    description: 'Weekly tests, monthly improvements, learning loop.',
    icon: ClipboardCheck,
    fields: [
      { key: 'weeklyTestingPlan', label: 'Weekly testing plan', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'monthlyImprovementGoals', label: 'Monthly improvement goals', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'learningLoopProcess', label: 'Learning loop process', kind: 'textarea', rows: 4, hint: 'Test → Learn → Improve cycle', colSpan: 2 },
    ],
  },

  // ----- 20. Reporting & ROI -----
  {
    id: 'reporting',
    step: '20',
    group: 'Operations',
    title: 'Reporting & ROI Dashboard',
    description: 'Revenue + funnel + cadenced reports.',
    icon: FileBarChart,
    fields: [
      { key: 'revenueTrackingTool', label: 'Revenue tracking tool', kind: 'text' },
      { key: 'funnelPerformanceTool', label: 'Funnel performance tool', kind: 'text' },
      { key: 'reportRecipients', label: 'Report recipients', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'weeklyReportUrl', label: 'Weekly report URL', kind: 'url', colSpan: 2 },
      { key: 'monthlyReportUrl', label: 'Monthly report URL', kind: 'url', colSpan: 2 },
      { key: 'quarterlyReviewUrl', label: 'Quarterly review URL', kind: 'url', colSpan: 2 },
    ],
  },
];

export const SXO_GROUP_ORDER: string[] = [
  'Foundation',
  'Discovery',
  'Technical & Accessibility',
  'Experience',
  'Conversion',
  'Measurement',
  'Operations',
];

export function sxoSectionFilledRatio(
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
