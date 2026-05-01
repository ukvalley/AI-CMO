/**
 * Website Project Tracker — 28 module configs.
 *
 * Each entry defines a section: title, icon, group, and the form fields it
 * collects. Adding a 29th module is a one-liner here — no component changes.
 */

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bug,
  Code2,
  Crosshair,
  Database,
  FileBarChart,
  FileText,
  Gauge,
  Globe,
  Layers,
  LineChart,
  Link as LinkIcon,
  Map,
  Palette,
  PenTool,
  Plug,
  Rocket,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  TestTube2,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'tags'
  | 'checks'
  | 'select'
  | 'url'
  | 'date'
  | 'number';

export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  hint?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  required?: boolean;
  /** Layout — full row (2) or half (1). Default 1. */
  colSpan?: 1 | 2;
}

export interface SectionDef {
  id: string;
  step: string;          // Display number, e.g. "1", "12"
  group: string;         // For grouped left-nav header
  title: string;
  description: string;
  icon: LucideIcon;
  fields: FieldDef[];
  advancedFields?: FieldDef[];
}

// ---------- Reusable field snippets ----------

const STATUS_OPTIONS = [
  { value: 'not-started', label: 'Not started' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'review', label: 'In review' },
  { value: 'completed', label: 'Completed' },
  { value: 'blocked', label: 'Blocked' },
];

// =====================================================================
// 28-MODULE REGISTRY
// =====================================================================

export const SECTIONS: SectionDef[] = [
  // ---------------- 1. Onboarding ----------------
  {
    id: 'onboarding',
    step: '1',
    group: 'Onboarding & Setup',
    title: 'Client Onboarding & Project Setup',
    description: 'Discovery, scope, and commercials before the build starts.',
    icon: Rocket,
    fields: [
      { key: 'businessGoals', label: 'Business goals', kind: 'textarea', rows: 3, required: true, colSpan: 2 },
      { key: 'targetAudience', label: 'Target audience', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'existingAudit', label: 'Existing website audit notes', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'sowItems', label: 'Scope of Work items', kind: 'tags', hint: 'Press Enter after each deliverable', colSpan: 2 },
      { key: 'pricingModel', label: 'Pricing model', kind: 'text' },
      { key: 'milestones', label: 'Milestones', kind: 'tags' },
    ],
    advancedFields: [
      { key: 'msaSigned', label: 'MSA signed', kind: 'checks' },
      { key: 'ndaSigned', label: 'NDA signed', kind: 'checks' },
      { key: 'sowSigned', label: 'SOW signed', kind: 'checks' },
      { key: 'accessControl', label: 'Ownership & access control', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 2. Strategy & KPI ----------------
  {
    id: 'strategy',
    step: '2',
    group: 'Onboarding & Setup',
    title: 'Strategy, Goals & KPI Engine',
    description: 'What success looks like in numbers.',
    icon: Target,
    fields: [
      { key: 'primaryGoal', label: 'Primary goal', kind: 'select', options: [
        { value: 'leads', label: 'Leads' },
        { value: 'sales', label: 'Sales' },
        { value: 'brand', label: 'Brand awareness' },
      ]},
      { key: 'secondaryGoals', label: 'Secondary goals', kind: 'tags' },
      { key: 'targetConversionRate', label: 'Target conversion rate', kind: 'text', hint: 'e.g. 3.5%' },
      { key: 'targetMonthlyTraffic', label: 'Target monthly traffic', kind: 'text' },
      { key: 'cwvBudget', label: 'Core Web Vitals budget', kind: 'textarea', rows: 2, hint: 'LCP / INP / CLS targets', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'funnelStages', label: 'Funnel stages', kind: 'tags', colSpan: 2 },
      { key: 'revenueAlignment', label: 'Revenue alignment notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 3. User Research & Personas ----------------
  {
    id: 'research',
    step: '3',
    group: 'Discovery & Research',
    title: 'User Research & Persona System',
    description: 'Who are we building for and why?',
    icon: Users,
    fields: [
      { key: 'primaryPersona', label: 'Primary persona', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'secondaryPersonas', label: 'Secondary personas', kind: 'tags', colSpan: 2 },
      { key: 'customerJourney', label: 'Customer journey notes', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'jobsToBeDone', label: 'Jobs-to-be-done', kind: 'tags', colSpan: 2 },
      { key: 'behaviourSignals', label: 'Behaviour analysis signals', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 4. Competitor Intelligence ----------------
  {
    id: 'competitors',
    step: '4',
    group: 'Discovery & Research',
    title: 'Competitor & Market Intelligence',
    description: 'Where the competition is strong, where they have gaps.',
    icon: Crosshair,
    fields: [
      { key: 'topCompetitors', label: 'Top competitors', kind: 'tags', colSpan: 2 },
      { key: 'seoBenchmark', label: 'SEO benchmarking notes', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'uxComparison', label: 'UX comparison', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'conversionPaths', label: 'Conversion path analysis', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 5. IA ----------------
  {
    id: 'ia',
    step: '5',
    group: 'Planning',
    title: 'Information Architecture (IA)',
    description: 'Sitemap, page hierarchy, navigation rules.',
    icon: Map,
    fields: [
      { key: 'sitemapPages', label: 'Sitemap pages', kind: 'tags', colSpan: 2 },
      { key: 'navigationItems', label: 'Primary navigation', kind: 'tags' },
      { key: 'footerItems', label: 'Footer navigation', kind: 'tags' },
      { key: 'pageHierarchy', label: 'Page hierarchy notes', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'userFlows', label: 'User flow notes', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'conversionPathDesign', label: 'Conversion path design', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 6. Keyword & Search Intent ----------------
  {
    id: 'keywords',
    step: '6',
    group: 'Planning',
    title: 'Keyword & Search Intent Engine',
    description: 'Demand-side discovery — what real users type.',
    icon: Search,
    fields: [
      { key: 'primaryKeywords', label: 'Primary keywords', kind: 'tags', colSpan: 2 },
      { key: 'longTailKeywords', label: 'Long-tail keywords', kind: 'tags', colSpan: 2 },
      { key: 'intentMix', label: 'Intent classification notes', kind: 'textarea', rows: 3, hint: 'Informational / navigational / transactional / commercial', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'keywordClusters', label: 'Keyword clusters', kind: 'tags', colSpan: 2 },
      { key: 'topicAuthority', label: 'Topic authority plan', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 7. Content Strategy ----------------
  {
    id: 'content',
    step: '7',
    group: 'Planning',
    title: 'Content Strategy & Production',
    description: 'Who writes what, by when.',
    icon: FileText,
    fields: [
      { key: 'pageContentPlan', label: 'Page-wise content plan', kind: 'textarea', rows: 5, colSpan: 2 },
      { key: 'seoContentItems', label: 'SEO content items', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'microcopySystem', label: 'Microcopy system', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'contentWorkflow', label: 'Workflow', kind: 'textarea', rows: 3, hint: 'Writer → editor → approval → publish', colSpan: 2 },
    ],
  },

  // ---------------- 8. Domain / Hosting / Infra ----------------
  {
    id: 'infrastructure',
    step: '8',
    group: 'Build',
    title: 'Domain, Hosting & Infrastructure',
    description: 'The platform the site lives on.',
    icon: Globe,
    fields: [
      { key: 'domainName', label: 'Domain', kind: 'text' },
      { key: 'registrar', label: 'Registrar', kind: 'text' },
      { key: 'hostingProvider', label: 'Hosting provider', kind: 'text' },
      { key: 'dnsConfig', label: 'DNS configuration notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'cdnProvider', label: 'CDN provider', kind: 'text' },
      { key: 'backupSchedule', label: 'Backup schedule', kind: 'text' },
      { key: 'stagingUrl', label: 'Staging environment URL', kind: 'url', colSpan: 2 },
    ],
  },

  // ---------------- 9. Wireframes ----------------
  {
    id: 'wireframes',
    step: '9',
    group: 'Build',
    title: 'Wireframing & UX Planning',
    description: 'Layout decisions before any pixel work.',
    icon: PenTool,
    fields: [
      { key: 'lowFiLinks', label: 'Low-fidelity wireframe links', kind: 'tags', colSpan: 2 },
      { key: 'midFiLinks', label: 'Mid-fidelity wireframe links', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'conversionLayoutNotes', label: 'Conversion-focused layout notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'uxValidationFindings', label: 'UX validation findings', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 10. UI/UX Design ----------------
  {
    id: 'design',
    step: '10',
    group: 'Build',
    title: 'UI/UX Design System',
    description: 'Visual language and component library.',
    icon: Palette,
    fields: [
      { key: 'colourPalette', label: 'Colour palette', kind: 'tags', hint: 'Hex values' },
      { key: 'typography', label: 'Typography', kind: 'tags' },
      { key: 'componentLibraryUrl', label: 'Component library link', kind: 'url', colSpan: 2 },
      { key: 'responsiveBreakpoints', label: 'Responsive breakpoints', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'wcagLevel', label: 'Accessibility (WCAG) level', kind: 'select', options: [
        { value: 'A', label: 'A' },
        { value: 'AA', label: 'AA (recommended)' },
        { value: 'AAA', label: 'AAA' },
      ]},
      { key: 'interactionNotes', label: 'Interaction design notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 11. Frontend ----------------
  {
    id: 'frontend',
    step: '11',
    group: 'Build',
    title: 'Frontend Development Engine',
    description: 'How the UI gets built and shipped.',
    icon: Code2,
    fields: [
      { key: 'frameworkStack', label: 'Framework / stack', kind: 'tags', colSpan: 2 },
      { key: 'browsersSupported', label: 'Browsers supported', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'perfBudget', label: 'Performance budget', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'codeSplittingPlan', label: 'Code-splitting plan', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
  },

  // ---------------- 12. Backend / CMS ----------------
  {
    id: 'backend',
    step: '12',
    group: 'Build',
    title: 'Backend & CMS System',
    description: 'Data, content management, and APIs.',
    icon: Database,
    fields: [
      { key: 'cmsChoice', label: 'CMS', kind: 'text' },
      { key: 'databaseChoice', label: 'Database', kind: 'text' },
    ],
    advancedFields: [
      { key: 'apisPlanned', label: 'APIs / integrations planned', kind: 'tags', colSpan: 2 },
      { key: 'rolesPermissions', label: 'User roles & permissions', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 13. Integrations ----------------
  {
    id: 'integrations',
    step: '13',
    group: 'Build',
    title: 'Integrations System',
    description: 'External tools wired into the site.',
    icon: Plug,
    fields: [
      { key: 'forms', label: 'Forms', kind: 'text' },
      { key: 'crm', label: 'CRM', kind: 'text' },
      { key: 'emailProvider', label: 'Email service', kind: 'text' },
      { key: 'mapsProvider', label: 'Maps', kind: 'text' },
    ],
    advancedFields: [
      { key: 'paymentGateway', label: 'Payment gateway', kind: 'text' },
      { key: 'chatSystem', label: 'Chat / support', kind: 'text' },
      { key: 'analyticsTools', label: 'Analytics tools', kind: 'tags', colSpan: 2 },
    ],
  },

  // ---------------- 14. Security ----------------
  {
    id: 'security',
    step: '14',
    group: 'Build',
    title: 'Security System',
    description: 'Hardening — SSL, auth, validation.',
    icon: Shield,
    fields: [
      { key: 'sslConfigured', label: 'SSL configured', kind: 'checks' },
      { key: 'authMethod', label: 'Authentication method', kind: 'text' },
      { key: 'inputValidation', label: 'Input validation strategy', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'firewallProvider', label: 'Firewall / WAF', kind: 'text' },
      { key: 'backupAutomation', label: 'Backup automation', kind: 'text' },
      { key: 'malwareProtection', label: 'Malware protection', kind: 'text' },
    ],
  },

  // ---------------- 15. Performance ----------------
  {
    id: 'performance',
    step: '15',
    group: 'Build',
    title: 'Performance Optimization',
    description: 'Speed and Core Web Vitals.',
    icon: Gauge,
    fields: [
      { key: 'lcpTarget', label: 'LCP target (s)', kind: 'text', hint: 'e.g. 2.5' },
      { key: 'inpTarget', label: 'INP target (ms)', kind: 'text' },
      { key: 'clsTarget', label: 'CLS target', kind: 'text' },
      { key: 'speedTools', label: 'Speed test tools', kind: 'tags' },
    ],
    advancedFields: [
      { key: 'cdnEnabled', label: 'CDN enabled', kind: 'checks' },
      { key: 'lazyLoadingStrategy', label: 'Lazy-loading strategy', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'compressionStrategy', label: 'Compression', kind: 'text' },
    ],
  },

  // ---------------- 16. On-Page SEO ----------------
  {
    id: 'on-page-seo',
    step: '16',
    group: 'SEO',
    title: 'On-Page SEO Engine',
    description: 'Per-page meta, structure, and internal links.',
    icon: Tag,
    fields: [
      { key: 'metaPlan', label: 'Meta tag plan', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'headingStrategy', label: 'Heading structure rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'internalLinkStrategy', label: 'Internal linking strategy', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'schemaTypes', label: 'Schema markup types', kind: 'tags', colSpan: 2 },
      { key: 'ogImageStrategy', label: 'Open Graph image strategy', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'canonicalStrategy', label: 'Canonical tag strategy', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
  },

  // ---------------- 17. Technical SEO ----------------
  {
    id: 'technical-seo',
    step: '17',
    group: 'SEO',
    title: 'Technical SEO Engine',
    description: 'Crawl, index, and infrastructure-level SEO.',
    icon: Wrench,
    fields: [
      { key: 'sitemapXmlUrl', label: 'sitemap.xml URL', kind: 'url', colSpan: 2 },
      { key: 'robotsTxtNotes', label: 'robots.txt rules', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'crawlabilityNotes', label: 'Crawlability checks', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'jsSeoNotes', label: 'JavaScript SEO notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'crawlBudgetPlan', label: 'Crawl budget optimisation', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 18. AI Search ----------------
  {
    id: 'ai-search',
    step: '18',
    group: 'SEO',
    title: 'AI Search Optimization',
    description: 'AEO / GEO / AIO surfaces — answer engines & LLMs.',
    icon: Sparkles,
    fields: [
      { key: 'aeoStrategy', label: 'AEO / answer engine strategy', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'answerBlocks', label: 'Answer blocks planned', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiVisibilityTools', label: 'AI visibility tracking tools', kind: 'tags', colSpan: 2 },
    ],
  },

  // ---------------- 19. Testing & QA ----------------
  {
    id: 'qa',
    step: '19',
    group: 'Quality',
    title: 'Testing & QA System',
    description: 'Functional, cross-device, and pre-launch checks.',
    icon: TestTube2,
    fields: [
      { key: 'functionalChecklist', label: 'Functional test checklist', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'devicesTested', label: 'Devices tested', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'perfTestSuite', label: 'Performance test suite', kind: 'text' },
      { key: 'securityTestSuite', label: 'Security test suite', kind: 'text' },
      { key: 'seoTestSuite', label: 'SEO test suite', kind: 'text' },
    ],
  },

  // ---------------- 20. Bug Tracking ----------------
  {
    id: 'bugs',
    step: '20',
    group: 'Quality',
    title: 'Bug Tracking System',
    description: 'Where bugs live and how they get killed.',
    icon: Bug,
    fields: [
      { key: 'bugTrackerUrl', label: 'Bug tracker URL', kind: 'url', colSpan: 2 },
      { key: 'priorityScale', label: 'Priority scale', kind: 'tags', hint: 'P0 / P1 / P2 / P3' },
      { key: 'resolutionWorkflow', label: 'Resolution workflow', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 21. Analytics ----------------
  {
    id: 'analytics',
    step: '21',
    group: 'Launch',
    title: 'Analytics & Tracking',
    description: 'Measurement plan — GA4, GSC, GTM.',
    icon: BarChart3,
    fields: [
      { key: 'ga4Property', label: 'GA4 property ID', kind: 'text' },
      { key: 'gscProperty', label: 'GSC property URL', kind: 'url' },
      { key: 'gtmContainer', label: 'GTM container ID', kind: 'text' },
    ],
    advancedFields: [
      { key: 'eventList', label: 'Event tracking list', kind: 'tags', colSpan: 2 },
      { key: 'conversions', label: 'Conversion goals', kind: 'tags', colSpan: 2 },
      { key: 'utmConventions', label: 'UTM naming conventions', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 22. Go Live ----------------
  {
    id: 'launch',
    step: '22',
    group: 'Launch',
    title: 'Go Live & Deployment',
    description: 'Launch day — checklist and contingency.',
    icon: Send,
    fields: [
      { key: 'launchDate', label: 'Launch date', kind: 'date' },
      { key: 'launchChecklist', label: 'Launch checklist', kind: 'textarea', rows: 5, colSpan: 2 },
      { key: 'monitoringTools', label: 'Launch monitoring tools', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'migrationStrategy', label: 'Migration strategy', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'rollbackPlan', label: 'Rollback plan', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 23. Off-Page SEO ----------------
  {
    id: 'off-page-seo',
    step: '23',
    group: 'Growth',
    title: 'Off-Page SEO',
    description: 'Backlinks, mentions, and authority.',
    icon: LinkIcon,
    fields: [
      { key: 'linkBuildingPlan', label: 'Link building plan', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'directorySubmissions', label: 'Directory submissions', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'prOutreachList', label: 'PR & outreach targets', kind: 'tags', colSpan: 2 },
      { key: 'authorityPlan', label: 'Authority building plan', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 24. CRO ----------------
  {
    id: 'cro',
    step: '24',
    group: 'Growth',
    title: 'CRO Engine',
    description: 'Conversion rate optimisation.',
    icon: TrendingUp,
    fields: [
      { key: 'ctaInventory', label: 'CTA inventory', kind: 'tags', colSpan: 2 },
      { key: 'formImprovements', label: 'Form optimisation notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'abTests', label: 'A/B tests planned', kind: 'tags', colSpan: 2 },
      { key: 'funnelImprovements', label: 'Funnel improvements', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ---------------- 25. Reporting ----------------
  {
    id: 'reporting',
    step: '25',
    group: 'Growth',
    title: 'Reporting System',
    description: 'How we share results.',
    icon: FileBarChart,
    fields: [
      { key: 'seoReportCadence', label: 'SEO report cadence', kind: 'select', options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
      ]},
      { key: 'trafficReportCadence', label: 'Traffic report cadence', kind: 'select', options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
      ]},
      { key: 'recipients', label: 'Report recipients', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'roiDashboardUrl', label: 'ROI dashboard URL', kind: 'url', colSpan: 2 },
      { key: 'funnelTrackingDashboard', label: 'Funnel tracking dashboard URL', kind: 'url', colSpan: 2 },
    ],
  },

  // ---------------- 26. Maintenance ----------------
  {
    id: 'maintenance',
    step: '26',
    group: 'Operate',
    title: 'Maintenance & Support',
    description: 'Keep the site healthy after launch.',
    icon: Settings,
    fields: [
      { key: 'updateCadence', label: 'Update cadence', kind: 'text' },
      { key: 'backupCadence', label: 'Backup cadence', kind: 'text' },
      { key: 'monitoringTools', label: 'Monitoring tools', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'uptimeTrackerUrl', label: 'Uptime tracker URL', kind: 'url', colSpan: 2 },
      { key: 'securityAuditCadence', label: 'Security audit cadence', kind: 'text' },
    ],
  },

  // ---------------- 27. Crisis & Recovery ----------------
  {
    id: 'crisis',
    step: '27',
    group: 'Operate',
    title: 'Crisis & Recovery',
    description: 'When things break — what we do.',
    icon: AlertTriangle,
    fields: [
      { key: 'downtimeDetection', label: 'Downtime detection plan', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'recoveryRunbook', label: 'Recovery runbook', kind: 'textarea', rows: 5, colSpan: 2 },
      { key: 'oncallContacts', label: 'On-call contacts', kind: 'tags', colSpan: 2 },
    ],
  },

  // ---------------- 28. Documentation & Handover ----------------
  {
    id: 'docs',
    step: '28',
    group: 'Operate',
    title: 'Documentation & Handover',
    description: 'Knowledge transfer to the client.',
    icon: Layers,
    fields: [
      { key: 'techDocsUrl', label: 'Technical documentation URL', kind: 'url', colSpan: 2 },
      { key: 'trainingMaterialsUrl', label: 'Training materials URL', kind: 'url', colSpan: 2 },
      { key: 'credentialVault', label: 'Credential vault location', kind: 'text', hint: '1Password vault, Bitwarden collection, etc.' },
      { key: 'handoverChecklist', label: 'Handover checklist', kind: 'textarea', rows: 5, colSpan: 2 },
    ],
  },
];

// =====================================================================
// GROUPED ORDER (used for nav rendering)
// =====================================================================

export const GROUP_ORDER: string[] = [
  'Onboarding & Setup',
  'Discovery & Research',
  'Planning',
  'Build',
  'SEO',
  'Quality',
  'Launch',
  'Growth',
  'Operate',
];

export function getSection(id: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.id === id);
}

// =====================================================================
// COMPLETION HELPERS
// =====================================================================

export function sectionFilledRatio(
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

// Decorative icons re-exported so the page file can use them in the dashboard
export { Activity, LineChart, ShieldCheck };
