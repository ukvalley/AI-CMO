/**
 * Landing Page System — 19-module config.
 * Reuses FieldDef / SectionDef from website-project so the same
 * generic SectionForm renders this module too.
 */

import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Code2,
  Crosshair,
  Edit3,
  GitBranch,
  Layers,
  Megaphone,
  Palette,
  Rocket,
  Send,
  Sparkles,
  Split,
  Tag,
  Target,
  TestTube2,
  TrendingUp,
  UserCog,
  Users,
} from 'lucide-react';
import type { SectionDef, FieldDef } from '@/modules/website/website-project/sections.config';

export const LP_SECTIONS: SectionDef[] = [
  // ----- 1. Onboarding -----
  {
    id: 'onboarding',
    step: '1',
    group: 'Foundation',
    title: 'Project Foundation & Onboarding',
    description: 'Business profile, audience, assets, and compliance.',
    icon: Rocket,
    fields: [
      { key: 'productService', label: 'Product / service', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'usp', label: 'Unique selling point', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'pricing', label: 'Pricing model', kind: 'text' },
      { key: 'targetAudience', label: 'Target audience + pain points', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'domainAccess', label: 'Domain / hosting / CMS access notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'brandAssets', label: 'Brand asset library links', kind: 'tags', hint: 'Logo, fonts, image kits…', colSpan: 2 },
      { key: 'testimonialsLibrary', label: 'Testimonials & case studies storage', kind: 'url', colSpan: 2 },
      { key: 'privacyTermsUrl', label: 'Privacy policy / terms URL', kind: 'url' },
      { key: 'cookieConsent', label: 'Cookie consent system', kind: 'text' },
    ],
  },

  // ----- 2. Strategy & Funnel Planning -----
  {
    id: 'strategy',
    step: '2',
    group: 'Foundation',
    title: 'Strategy & Funnel Planning',
    description: 'Page goal, KPIs, funnel flow, offer.',
    icon: Target,
    fields: [
      { key: 'pageGoal', label: 'Primary goal', kind: 'select', options: [
        { value: 'lead-gen', label: 'Lead generation' },
        { value: 'sales', label: 'Sales' },
        { value: 'webinar', label: 'Webinar registration' },
        { value: 'event', label: 'Event signup' },
        { value: 'app-install', label: 'App install' },
      ]},
      { key: 'pageType', label: 'Page type', kind: 'select', options: [
        { value: 'lead', label: 'Lead page' },
        { value: 'sales', label: 'Sales page' },
        { value: 'webinar', label: 'Webinar page' },
        { value: 'squeeze', label: 'Squeeze page' },
        { value: 'thank-you', label: 'Thank-you page' },
      ]},
      { key: 'cplTarget', label: 'CPL target', kind: 'text', hint: 'Cost per lead (₹/$)' },
      { key: 'conversionRateTarget', label: 'Conversion rate target', kind: 'text', hint: 'e.g. 8%' },
      { key: 'bounceRateTarget', label: 'Bounce rate target', kind: 'text' },
    ],
    advancedFields: [
      { key: 'funnelFlow', label: 'Funnel flow', kind: 'textarea', rows: 3, hint: 'Landing → Thank-you → Follow-up sequence', colSpan: 2 },
      { key: 'offerType', label: 'Offer type', kind: 'tags', hint: 'Discounts / free consult / bonus / lead magnet…', colSpan: 2 },
      { key: 'offerCopy', label: 'Offer copy', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 3. Research & Intelligence -----
  {
    id: 'research',
    step: '3',
    group: 'Discovery',
    title: 'Research & Intelligence Engine',
    description: 'Competitor scraping, headline & CTA analysis.',
    icon: Crosshair,
    fields: [
      { key: 'competitorPages', label: 'Competitor landing pages', kind: 'tags', hint: 'URLs of pages to study', colSpan: 2 },
      { key: 'headlinePatterns', label: 'Headline patterns observed', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'ctaPatterns', label: 'CTA patterns observed', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'keywordResearch', label: 'Keyword & messaging research', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'voicOfCustomer', label: 'Voice of customer (VoC) excerpts', kind: 'textarea', rows: 5, hint: 'Direct quotes, support tickets, review snippets', colSpan: 2 },
      { key: 'objections', label: 'Objection mining', kind: 'tags', hint: 'Top 5–10 objections', colSpan: 2 },
      { key: 'gapAnalysis', label: 'Gap analysis', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 4. Structure Builder -----
  {
    id: 'structure',
    step: '4',
    group: 'Build',
    title: 'Landing Page Structure Builder',
    description: 'Section order from Hero → Final CTA.',
    icon: Layers,
    fields: [
      { key: 'sectionsOrder', label: 'Sections in order', kind: 'tags', hint: 'Hero / Problem / Solution / Benefits / Features / Social proof / FAQ / CTA…', colSpan: 2 },
      { key: 'ctaCount', label: 'Number of CTA placements', kind: 'number' },
      { key: 'stickyCta', label: 'Sticky CTA enabled', kind: 'checks' },
    ],
    advancedFields: [
      { key: 'ctaVariants', label: 'CTA variant copy', kind: 'tags', hint: 'Different button labels to rotate / test', colSpan: 2 },
      { key: 'sectionNotes', label: 'Per-section notes', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
  },

  // ----- 5. Content Creation -----
  {
    id: 'content',
    step: '5',
    group: 'Build',
    title: 'Content Creation System',
    description: 'Headlines, copy frameworks, trust elements, FAQ.',
    icon: Edit3,
    fields: [
      { key: 'mainHeadline', label: 'Main headline', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'subHeadlines', label: 'Sub-headline variants', kind: 'tags', colSpan: 2 },
      { key: 'copyFramework', label: 'Copy framework', kind: 'select', options: [
        { value: 'aida', label: 'AIDA' },
        { value: 'pas', label: 'PAS (Problem-Agitate-Solve)' },
        { value: 'storybrand', label: 'StoryBrand' },
        { value: 'hormozi', label: 'Hormozi value-stack' },
      ]},
      { key: 'ctaCopyVariants', label: 'CTA copy variants', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'testimonials', label: 'Testimonial picks for this page', kind: 'tags', colSpan: 2 },
      { key: 'caseStudyBlocks', label: 'Case study blocks', kind: 'tags', colSpan: 2 },
      { key: 'statsAndProof', label: 'Stats & proof points', kind: 'tags', colSpan: 2 },
      { key: 'faqList', label: 'FAQ list', kind: 'tags', hint: 'Questions to handle', colSpan: 2 },
    ],
  },

  // ----- 6. UI/UX Design -----
  {
    id: 'design',
    step: '6',
    group: 'Build',
    title: 'UI/UX Design System',
    description: 'Wireframes, visuals, mobile, accessibility.',
    icon: Palette,
    fields: [
      { key: 'wireframeUrl', label: 'Wireframe URL', kind: 'url', colSpan: 2 },
      { key: 'visualMockupUrl', label: 'Visual mockup URL', kind: 'url', colSpan: 2 },
      { key: 'colourPalette', label: 'Colour palette', kind: 'tags' },
      { key: 'typography', label: 'Typography', kind: 'tags' },
      { key: 'mobileFirst', label: 'Mobile-first layout', kind: 'checks' },
      { key: 'thumbFriendlyCta', label: 'Thumb-friendly CTAs', kind: 'checks' },
    ],
    advancedFields: [
      { key: 'wcagLevel', label: 'WCAG level', kind: 'select', options: [
        { value: 'A', label: 'A' },
        { value: 'AA', label: 'AA (recommended)' },
        { value: 'AAA', label: 'AAA' },
      ]},
      { key: 'accessibilityChecks', label: 'Accessibility checks', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 7. Page Builder & Dev -----
  {
    id: 'page-builder',
    step: '7',
    group: 'Build',
    title: 'Page Builder & Development',
    description: 'How the page is built, forms, and tracking pixels.',
    icon: Code2,
    fields: [
      { key: 'builderTool', label: 'Builder / framework', kind: 'text', hint: 'Webflow, Framer, Next.js, Unbounce…' },
      { key: 'responsiveBreakpoints', label: 'Responsive breakpoints', kind: 'tags' },
      { key: 'imageOptimization', label: 'Image optimisation strategy', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'formType', label: 'Form type', kind: 'select', options: [
        { value: 'single', label: 'Single-step' },
        { value: 'multi', label: 'Multi-step' },
        { value: 'inline', label: 'Inline' },
        { value: 'popup', label: 'Pop-up / modal' },
      ]},
      { key: 'crmIntegration', label: 'CRM integration', kind: 'text' },
    ],
    advancedFields: [
      { key: 'metaPixel', label: 'Meta pixel ID', kind: 'text' },
      { key: 'googleAdsTag', label: 'Google Ads conversion tag', kind: 'text' },
      { key: 'linkedinPixel', label: 'LinkedIn Insight Tag ID', kind: 'text' },
      { key: 'ga4Property', label: 'GA4 measurement ID', kind: 'text' },
      { key: 'conversionEvents', label: 'Conversion events tracked', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 8. SEO & Technical -----
  {
    id: 'seo',
    step: '8',
    group: 'Build',
    title: 'SEO & Technical Optimization',
    description: 'Meta tags, schema, performance.',
    icon: Tag,
    fields: [
      { key: 'metaTitle', label: 'Meta title', kind: 'text', colSpan: 2 },
      { key: 'metaDescription', label: 'Meta description', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'sitemapUrl', label: 'Sitemap URL', kind: 'url' },
      { key: 'robotsTxtNotes', label: 'robots.txt notes', kind: 'textarea', rows: 2 },
      { key: 'schemaTypes', label: 'Schema types used', kind: 'tags', hint: 'FAQ, Product, Review, Organization…', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'lcpTarget', label: 'LCP target (s)', kind: 'text' },
      { key: 'inpTarget', label: 'INP target (ms)', kind: 'text' },
      { key: 'clsTarget', label: 'CLS target', kind: 'text' },
    ],
  },

  // ----- 9. Testing & QA -----
  {
    id: 'qa',
    step: '9',
    group: 'Quality',
    title: 'Testing & QA System',
    description: 'Functional, technical, and conversion checks before launch.',
    icon: TestTube2,
    fields: [
      { key: 'functionalTests', label: 'Functional tests', kind: 'tags', hint: 'Form submission, CTA clicks, link redirects', colSpan: 2 },
      { key: 'browsersTested', label: 'Browsers tested', kind: 'tags' },
      { key: 'devicesTested', label: 'Devices tested', kind: 'tags' },
      { key: 'speedTestResults', label: 'Speed test results', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'ctaVisibilityCheck', label: 'CTA visibility check', kind: 'textarea', rows: 2, colSpan: 2 },
      { key: 'messageClarityCheck', label: 'Message clarity check', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
  },

  // ----- 10. Launch & Deployment -----
  {
    id: 'launch',
    step: '10',
    group: 'Launch',
    title: 'Launch & Deployment',
    description: 'Domain, SSL, publish, first 48h watch.',
    icon: Send,
    fields: [
      { key: 'domain', label: 'Domain', kind: 'text' },
      { key: 'sslConfigured', label: 'SSL configured', kind: 'checks' },
      { key: 'launchDate', label: 'Launch date', kind: 'date' },
      { key: 'launchChecklist', label: 'Launch checklist', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'first48Watch', label: 'First-48h monitoring plan', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'errorDetection', label: 'Error detection setup', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
  },

  // ----- 11. Analytics & Performance -----
  {
    id: 'analytics',
    step: '11',
    group: 'Measurement',
    title: 'Analytics & Performance Dashboard',
    description: 'Conversion rate, CPL, traffic sources.',
    icon: BarChart3,
    fields: [
      { key: 'dashboardUrl', label: 'Dashboard URL', kind: 'url', colSpan: 2 },
      { key: 'conversionRateTracked', label: 'Conversion rate tracked', kind: 'checks' },
      { key: 'cplTracked', label: 'CPL tracked', kind: 'checks' },
      { key: 'bounceRateTracked', label: 'Bounce rate tracked', kind: 'checks' },
      { key: 'trafficSources', label: 'Traffic sources tracked', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'scrollDepthTool', label: 'Scroll depth tool', kind: 'text' },
      { key: 'heatmapTool', label: 'Heatmap tool', kind: 'text', hint: 'Hotjar, Microsoft Clarity, Lucky Orange…' },
      { key: 'sessionRecordingTool', label: 'Session recording tool', kind: 'text' },
    ],
  },

  // ----- 12. A/B Testing & CRO -----
  {
    id: 'cro',
    step: '12',
    group: 'Measurement',
    title: 'A/B Testing & CRO Engine',
    description: 'Test variations, split testing, funnel drop-off analysis.',
    icon: Split,
    fields: [
      { key: 'testQueue', label: 'A/B test queue', kind: 'tags', hint: 'Headline / CTA / form length / hero image…', colSpan: 2 },
      { key: 'splitTool', label: 'Split testing tool', kind: 'text', hint: 'Google Optimize successor, Convert, VWO, Optimizely…' },
      { key: 'currentTestNotes', label: 'Current test notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'funnelDropOffs', label: 'Funnel drop-off points', kind: 'tags', colSpan: 2 },
      { key: 'optimisationSuggestions', label: 'Optimisation suggestions', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
  },

  // ----- 13. Personalization -----
  {
    id: 'personalization',
    step: '13',
    group: 'Distribution & Personalization',
    title: 'Personalization Engine',
    description: 'Source-based, geo-based, returning visitor.',
    icon: UserCog,
    fields: [
      { key: 'sourceVariants', label: 'Source-based variants', kind: 'tags', hint: 'FB / Google / LinkedIn / direct…', colSpan: 2 },
      { key: 'geoVariants', label: 'Geo-targeted variants', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'returningVisitorRules', label: 'Returning visitor personalisation', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'personalizationTool', label: 'Personalisation tool', kind: 'text' },
    ],
  },

  // ----- 14. Lead Capture → Nurture -----
  {
    id: 'nurture',
    step: '14',
    group: 'Distribution & Personalization',
    title: 'Lead Capture → Nurture Integration',
    description: 'Where leads go and what touches them next.',
    icon: Users,
    fields: [
      { key: 'autoResponseEmail', label: 'Auto-response email template', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'whatsappFlow', label: 'WhatsApp follow-up flow', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'crmDestination', label: 'CRM destination', kind: 'text' },
    ],
    advancedFields: [
      { key: 'salesHandoffSla', label: 'Sales hand-off SLA', kind: 'text', hint: 'e.g. follow up within 5 minutes' },
      { key: 'nurtureSequence', label: 'Full nurture sequence', kind: 'textarea', rows: 4, hint: 'Lead → CRM → Email/WhatsApp → Sales call', colSpan: 2 },
    ],
  },

  // ----- 15. Traffic Integration -----
  {
    id: 'traffic',
    step: '15',
    group: 'Distribution & Personalization',
    title: 'Traffic Integration System',
    description: 'Channels, UTM, attribution.',
    icon: Megaphone,
    fields: [
      { key: 'channels', label: 'Active channels', kind: 'tags', hint: 'Meta / Google / LinkedIn / email / organic…', colSpan: 2 },
      { key: 'utmConventions', label: 'UTM naming conventions', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'attributionModel', label: 'Attribution model', kind: 'select', options: [
        { value: 'last-click', label: 'Last-click' },
        { value: 'first-click', label: 'First-click' },
        { value: 'linear', label: 'Linear' },
        { value: 'time-decay', label: 'Time-decay' },
        { value: 'data-driven', label: 'Data-driven' },
      ]},
      { key: 'attributionTool', label: 'Attribution tool', kind: 'text' },
    ],
  },

  // ----- 16. Continuous Optimization -----
  {
    id: 'optimization',
    step: '16',
    group: 'Operate',
    title: 'Continuous Optimization System',
    description: 'Performance reviews + ongoing improvements.',
    icon: Activity,
    fields: [
      { key: 'reviewCadence', label: 'Review cadence', kind: 'select', options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
      ]},
      { key: 'currentBacklog', label: 'Current improvement backlog', kind: 'tags', colSpan: 2 },
      { key: 'speedOptimisationNotes', label: 'Speed optimisation notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'aiSuggestionsTool', label: 'AI suggestions tool', kind: 'text' },
      { key: 'conversionInsights', label: 'Conversion insights log', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 17. Multi-Variant Page System -----
  {
    id: 'multi-variant',
    step: '17',
    group: 'Operate',
    title: 'Multi-Variant Page System',
    description: 'Different pages per audience / source / geo.',
    icon: Layers,
    fields: [
      { key: 'audienceVariants', label: 'Audience variants', kind: 'tags', colSpan: 2 },
      { key: 'sourceVariants', label: 'Source variants', kind: 'tags', colSpan: 2 },
      { key: 'geoVariants', label: 'Geo variants', kind: 'tags', colSpan: 2 },
      { key: 'variantNotes', label: 'Variant rollout notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 18. Crisis & Incident -----
  {
    id: 'crisis',
    step: '18',
    group: 'Operate',
    title: 'Crisis & Incident Management',
    description: 'Detect breakage, recover quickly.',
    icon: AlertTriangle,
    fields: [
      { key: 'errorDetectionPlan', label: 'Error detection plan', kind: 'textarea', rows: 4, hint: 'Broken forms, wrong pricing, missing tracking…', colSpan: 2 },
      { key: 'recoveryRunbook', label: 'Recovery runbook', kind: 'textarea', rows: 5, colSpan: 2 },
      { key: 'oncallContacts', label: 'On-call contacts', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 19. Documentation & Handover -----
  {
    id: 'docs',
    step: '19',
    group: 'Operate',
    title: 'Documentation & Handover',
    description: 'Pass the page off cleanly.',
    icon: BookOpen,
    fields: [
      { key: 'pageDocsUrl', label: 'Page documentation URL', kind: 'url', colSpan: 2 },
      { key: 'accessVault', label: 'Access management / credentials vault', kind: 'text', hint: '1Password / Bitwarden vault location' },
      { key: 'trainingGuidesUrl', label: 'Training guides URL', kind: 'url', colSpan: 2 },
      { key: 'handoverChecklist', label: 'Handover checklist', kind: 'textarea', rows: 5, colSpan: 2 },
    ],
  },
];

export const LP_GROUP_ORDER: string[] = [
  'Foundation',
  'Discovery',
  'Build',
  'Quality',
  'Launch',
  'Measurement',
  'Distribution & Personalization',
  'Operate',
];

export function lpSectionFilledRatio(
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
