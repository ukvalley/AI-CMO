// ============================================================================
// Newsletter Template Engine — Structured Newsletter Architecture
// ============================================================================
// Two-layer type system:
//   Template Layer (rich) → guides AI prompt generation with visual hierarchy,
//     layout directives, CTA positioning, flow rules, and design metadata.
//   Output Layer (stable) → NewsletterSection.type in entities.ts stays unchanged.
//     The AI always outputs one of the 7 original types.
//     Template section types map to output types via the `outputType` field.
// ============================================================================

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

/** Template ID — matches each newsletter template type */
export type NewsletterTemplateId =
  | 'promotional'
  | 'educational'
  | 'engagement'
  | 'company-update'
  | 'ai'
  | 'founder-story'
  | 'sales'
  | 'weekly-insight'
  | 'carousel'
  | 'problem-solution'
  | 'authority'
  | 'storytelling'
  | 'personal-branding'
  | 'high-engagement';

/** Expanded template section types — used in the template layer only */
export type TemplateSectionType =
  | 'hero'
  | 'highlight-card'
  | 'metrics'
  | 'feature-grid'
  | 'event-card'
  | 'resource-list'
  | 'team-spotlight'
  | 'announcement'
  | 'social-proof'
  | 'divider'
  | 'footer'
  // Original types (also valid in template layer for backward compat)
  | 'heading'
  | 'subheading'
  | 'paragraph'
  | 'list'
  | 'quote'
  | 'cta'
  | 'image';

/** Output types — must match NewsletterSection.type in entities.ts exactly */
export type NewsletterSectionOutputType =
  | 'heading'
  | 'subheading'
  | 'paragraph'
  | 'list'
  | 'quote'
  | 'cta'
  | 'image';

/** Maps each template section type to the NewsletterSection.type it produces */
export const TEMPLATE_TO_OUTPUT: Record<TemplateSectionType, NewsletterSectionOutputType> = {
  'hero':             'heading',
  'highlight-card':   'paragraph',
  'metrics':          'list',
  'feature-grid':     'list',
  'event-card':       'paragraph',
  'resource-list':    'list',
  'team-spotlight':   'paragraph',
  'announcement':     'paragraph',
  'social-proof':     'quote',
  'divider':          'paragraph',
  'footer':           'paragraph',
  'heading':           'heading',
  'subheading':       'subheading',
  'paragraph':        'paragraph',
  'list':             'list',
  'quote':            'quote',
  'cta':              'cta',
  'image':            'image',
};

// Visual metadata types
export type VisualPriority = 'high' | 'medium' | 'low';
export type LayoutStyle = 'card' | 'banner' | 'split' | 'list' | 'grid';
export type EmphasisLevel = 'bold' | 'moderate' | 'subtle';
export type CTAPosition = 'inline' | 'end-of-section' | 'primary' | 'secondary' | 'sticky';

// Image metadata types
export type TemplateImageType = 'hero' | 'feature' | 'product' | 'team' | 'event' | 'banner';
export type TemplateImageLayout = 'full-width' | 'card' | 'inline';
export type TemplateImagePosition = 'top' | 'middle' | 'bottom';

// Design metadata types
export type ToneStyle = 'professional' | 'casual' | 'authoritative' | 'friendly' | 'urgent' | 'inspirational';
export type SpacingDensity = 'compact' | 'comfortable' | 'spacious';
export type VisualStyle = 'minimal' | 'bold' | 'elegant' | 'corporate' | 'playful';
export type BrandingMood = 'confident' | 'warm' | 'innovative' | 'trustworthy' | 'dynamic';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type InteractivityHint = 'clickable' | 'hoverable' | 'scrollable' | 'static';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface TemplateBacklink {
  label: string;
  url: string;
  type: 'internal' | 'external';
  icon?: string;
}

export interface TemplateSection {
  type: TemplateSectionType;
  label: string;
  description: string;
  required: boolean;
  order: number;

  /** Which NewsletterSection.type this section maps to in the output */
  outputType: NewsletterSectionOutputType;

  /** Visual priority within the newsletter layout */
  visualPriority: VisualPriority;

  /** Layout style hint for rendering */
  layoutStyle: LayoutStyle;

  /** How prominently this section should be emphasized */
  emphasisLevel: EmphasisLevel;

  /** Optional content directives — word limits, formatting instructions for AI */
  contentDirectives?: string;

  /** CTA positioning (only relevant when outputType is 'cta') */
  ctaPosition?: CTAPosition;

  /** Image fields — only used when outputType is 'image'. All optional for backward compat. */
  imageType?: TemplateImageType;
  imageLayout?: TemplateImageLayout;
  imagePosition?: TemplateImagePosition;
  imagePriority?: VisualPriority;

  /** Backlinks — optional navigation links for sections. */
  backlinks?: TemplateBacklink[];

  /** Edit metadata — enables inline editing. Defaults to false. */
  editable?: boolean;
}

export interface NewsletterFlowRules {
  /** Recommended order of template section types for this newsletter type */
  recommendedSectionOrder: TemplateSectionType[];
  /** Maximum paragraph length in words */
  maxParagraphLength: number;
  /** Ideal number of highlight/card blocks */
  idealHighlightBlocks: number;
  /** How dense the card layout should be */
  cardDensity: 'sparse' | 'balanced' | 'dense';
  /** How readers typically scan this newsletter type */
  scanningBehavior: 'linear' | 'scannable' | 'mixed';
  /** Maximum number of sections */
  maxSections: number;
  /** Minimum number of sections — AI MUST produce at least this many */
  minSections: number;
}

export interface TemplateDesignMetadata {
  tone: ToneStyle;
  spacingDensity: SpacingDensity;
  visualStyle: VisualStyle;
  brandingMood: BrandingMood;
  urgencyLevel: UrgencyLevel;
  interactivityHints: InteractivityHint[];
}

export interface NewsletterTemplate {
  id: NewsletterTemplateId;
  name: string;
  description: string;
  contentTypes: string[];
  subjectPatterns: string[];
  sections: TemplateSection[];
  ctaStyle: string;
  urgencyBonus?: string;

  /** Header logo — optional, falls back to text title if missing */
  logoUrl?: string;
  logoPosition?: 'left' | 'center' | 'right';

  /** Newsletter flow and structural rules */
  flowRules: NewsletterFlowRules;
  /** Design and visual metadata */
  design: TemplateDesignMetadata;
}

// ---------------------------------------------------------------------------
// Template Definitions
// ---------------------------------------------------------------------------

export const NEWSLETTER_TEMPLATES: Record<NewsletterTemplateId, NewsletterTemplate> = {

  // =========================================================================
  // PROMOTIONAL NEWSLETTER
  // Sales-focused, urgency-driven, offer-heavy, CTA-dense
  // =========================================================================
  promotional: {
    id: 'promotional',
    name: 'Promotional Newsletter',
    description: 'Sales-focused newsletter with offers, featured products, urgency CTAs, and limited-time deals.',
    contentTypes: ['promotional'],
    subjectPatterns: [
      '🎉 Limited Time Offer — Save Big Today!',
      '🚀 Exclusive Deal Just for You',
      'Don\'t Miss Our Biggest Sale of the Month',
      'Special Discount Inside 🎁',
    ],
    ctaStyle: 'Bold, action-oriented, urgency-driven (e.g. "Claim Offer", "Shop Now — Ends Friday", "Get Discount")',
    urgencyBonus: 'Include a sense of urgency: mention offer expiration date, limited availability, or exclusive member-only access.',
    flowRules: {
      recommendedSectionOrder: ['hero', 'announcement', 'highlight-card', 'feature-grid', 'cta', 'social-proof', 'feature-grid', 'cta', 'footer'],
      maxParagraphLength: 50,
      idealHighlightBlocks: 3,
      cardDensity: 'balanced',
      scanningBehavior: 'scannable',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'urgent',
      spacingDensity: 'compact',
      visualStyle: 'bold',
      brandingMood: 'dynamic',
      urgencyLevel: 'high',
      interactivityHints: ['clickable', 'static'],
    },
    sections: [
      {
        type: 'hero',
        label: 'Hero — Main Offer Headline',
        description: 'A bold, punchy hero headline capturing the core offer.',
        required: true,
        order: 1,
        outputType: 'heading',
        visualPriority: 'high',
        layoutStyle: 'banner',
        emphasisLevel: 'bold',
        contentDirectives: 'Max 6 words. Punchy, benefit-first. No filler words.',
      },
      {
        type: 'announcement',
        label: 'Urgency Announcement',
        description: 'Short announcement creating immediate urgency — sale dates, limited stock, exclusive access.',
        required: true,
        order: 2,
        outputType: 'paragraph',
        visualPriority: 'high',
        layoutStyle: 'banner',
        emphasisLevel: 'bold',
        contentDirectives: '2-3 sentences. Lead with the deadline or scarcity. Why act now.',
      },
      {
        type: 'highlight-card',
        label: 'Featured Offer Card',
        description: 'A single featured product or offer with a compelling one-liner and benefit.',
        required: true,
        order: 3,
        outputType: 'paragraph',
        visualPriority: 'high',
        layoutStyle: 'card',
        emphasisLevel: 'bold',
        contentDirectives: 'One product/offer. Name + one benefit + one differentiator. 30 words max.',
      },
      {
        type: 'feature-grid',
        label: 'Product / Deal Grid',
        description: '3-4 products, deals, or features presented as a scannable grid.',
        required: true,
        order: 4,
        outputType: 'list',
        visualPriority: 'medium',
        layoutStyle: 'grid',
        emphasisLevel: 'moderate',
        contentDirectives: '3-4 items. Each: **Product name** — one benefit. Short and punchy.',
      },
      {
        type: 'cta',
        label: 'Primary CTA — Claim Offer',
        description: 'Bold, urgency-driven CTA.',
        required: true,
        order: 5,
        outputType: 'cta',
        visualPriority: 'high',
        layoutStyle: 'banner',
        emphasisLevel: 'bold',
        ctaPosition: 'primary',
        contentDirectives: 'Action verb + benefit. No passive language.',
      },
      {
        type: 'social-proof',
        label: 'Customer Testimonial',
        description: 'One customer quote or review that validates the offer.',
        required: true,
        order: 6,
        outputType: 'quote',
        visualPriority: 'medium',
        layoutStyle: 'card',
        emphasisLevel: 'subtle',
        contentDirectives: 'Real customer quote with attribution. Reinforces the deal value.',
      },
      {
        type: 'feature-grid',
        label: 'More Deals / Benefits',
        description: '2-3 additional benefits, use cases, or deal details.',
        required: true,
        order: 7,
        outputType: 'list',
        visualPriority: 'medium',
        layoutStyle: 'grid',
        emphasisLevel: 'moderate',
        contentDirectives: '2-3 items. Each: **Benefit** — one-line detail. Shows breadth of value.',
      },
      {
        type: 'image',
        label: 'Hero Offer Banner',
        description: 'Full-width banner image showcasing the main offer or product.',
        required: false,
        order: 4,
        outputType: 'image',
        visualPriority: 'high',
        layoutStyle: 'banner',
        emphasisLevel: 'bold',
        imageType: 'banner',
        imageLayout: 'full-width',
        imagePosition: 'top',
        imagePriority: 'high',
        contentDirectives: 'Hero banner image for the main offer. Use placeholder description if no URL.',
      },
      {
        type: 'image',
        label: 'Product Visual',
        description: 'Product or feature image for the highlighted offer.',
        required: false,
        order: 6,
        outputType: 'image',
        visualPriority: 'medium',
        layoutStyle: 'card',
        emphasisLevel: 'moderate',
        imageType: 'product',
        imageLayout: 'card',
        imagePosition: 'middle',
        imagePriority: 'medium',
        contentDirectives: 'Product screenshot or feature image. Card-style layout.',
      },
      {
        type: 'cta',
        label: 'Secondary CTA — Last Chance',
        description: 'A second CTA reinforcing urgency.',
        required: false,
        order: 8,
        outputType: 'cta',
        visualPriority: 'medium',
        layoutStyle: 'split',
        emphasisLevel: 'moderate',
        ctaPosition: 'secondary',
        contentDirectives: 'Reiterate the deadline. Softer than primary CTA but still urgent.',
      },
      {
        type: 'footer',
        label: 'Closing & Offer Deadline',
        description: 'Thank the reader, restate the offer deadline, sign off.',
        required: true,
        order: 9,
        outputType: 'paragraph',
        visualPriority: 'low',
        layoutStyle: 'list',
        emphasisLevel: 'subtle',
        contentDirectives: '2-3 sentences. Restate deadline. Warm close.',
      },
    ],
  },

  // =========================================================================
  // EDUCATIONAL NEWSLETTER
  // Knowledge-rich, scannable, insight-focused with tips and resources
  // =========================================================================
  educational: {
    id: 'educational',
    name: 'Educational Newsletter',
    description: 'Knowledge-focused newsletter with structured learning, tips, examples, resources, and how-to content.',
    contentTypes: ['educational', 'case-study'],
    subjectPatterns: [
      '📚 Learn Something New This Week',
      '5 Tips to Improve Your Skills',
      'Beginner\'s Guide to [Topic]',
      'Weekly Learning Digest 💡',
    ],
    ctaStyle: 'Value-driven, learning-focused (e.g. "Read Full Guide", "Watch Now", "Start Learning Today")',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'subheading', 'feature-grid', 'highlight-card', 'quote', 'resource-list', 'cta', 'footer'],
      maxParagraphLength: 80,
      idealHighlightBlocks: 3,
      cardDensity: 'balanced',
      scanningBehavior: 'scannable',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'professional',
      spacingDensity: 'comfortable',
      visualStyle: 'minimal',
      brandingMood: 'trustworthy',
      urgencyLevel: 'low',
      interactivityHints: ['clickable', 'scrollable'],
    },
    sections: [
      {
        type: 'hero',
        label: 'Header — Newsletter Title & Issue',
        description: 'Newsletter title with issue number. Clean, Notion-style.',
        required: true,
        order: 1,
        outputType: 'heading',
        visualPriority: 'high',
        layoutStyle: 'banner',
        emphasisLevel: 'bold',
        contentDirectives: 'Format: "[Newsletter Name] — Issue #[N]" or "[Topic] Deep Dive". Max 8 words.',
      },
      {
        type: 'highlight-card',
        label: 'Topic Introduction',
        description: 'A concise card-style intro — what the topic is and why it matters right now.',
        required: true,
        order: 2,
        outputType: 'paragraph',
        visualPriority: 'high',
        layoutStyle: 'card',
        emphasisLevel: 'moderate',
        contentDirectives: '2-3 sentences. Hook with a question or surprising stat. Why this matters today.',
      },
      {
        type: 'subheading',
        label: 'Core Concept Heading',
        description: 'Clear heading naming the key concept being taught.',
        required: true,
        order: 3,
        outputType: 'subheading',
        visualPriority: 'medium',
        layoutStyle: 'list',
        emphasisLevel: 'moderate',
        contentDirectives: 'One clear concept label. e.g. "Understanding [Topic]". No jargon.',
      },
      {
        type: 'feature-grid',
        label: 'Key Takeaways',
        description: '3-5 numbered takeaways — each one actionable and concise.',
        required: true,
        order: 4,
        outputType: 'list',
        visualPriority: 'high',
        layoutStyle: 'grid',
        emphasisLevel: 'moderate',
        contentDirectives: '3-5 items. Each: **bolded keyword** — 1-sentence explanation. Scannable.',
      },
      {
        type: 'highlight-card',
        label: 'Real-World Example',
        description: 'A concrete example, case study, or scenario that illustrates the concept in practice.',
        required: true,
        order: 5,
        outputType: 'paragraph',
        visualPriority: 'medium',
        layoutStyle: 'card',
        emphasisLevel: 'moderate',
        contentDirectives: '2-3 sentences. Specific example with a tangible result. Makes the concept real.',
      },
      {
        type: 'quote',
        label: 'Expert Insight',
        description: 'A memorable quote or learning tip the reader can apply immediately.',
        required: true,
        order: 6,
        outputType: 'quote',
        visualPriority: 'medium',
        layoutStyle: 'card',
        emphasisLevel: 'subtle',
        contentDirectives: 'Attributed expert quote or concise insight. Reinforces the lesson.',
      },
      {
        type: 'resource-list',
        label: 'Recommended Resources',
        description: '3-4 curated resources: articles, videos, tools, courses.',
        required: true,
        order: 7,
        outputType: 'list',
        visualPriority: 'medium',
        layoutStyle: 'list',
        emphasisLevel: 'subtle',
        contentDirectives: '3-4 items. Each: **Resource name** — one-line description + type (article/video/tool).',
      },
      {
        type: 'image',
        label: 'Concept Diagram',
        description: 'Optional illustration or diagram that visualizes the key concept being taught.',
        required: false,
        order: 7,
        outputType: 'image',
        visualPriority: 'low',
        layoutStyle: 'card',
        emphasisLevel: 'subtle',
        imageType: 'feature',
        imageLayout: 'card',
        imagePosition: 'middle',
        imagePriority: 'low',
        contentDirectives: 'Diagram or illustration explaining the concept. Use placeholder if no URL.',
      },
      {
        type: 'cta',
        label: 'CTA — Deepen Learning',
        description: 'Encourage deeper engagement with a learning CTA.',
        required: true,
        order: 8,
        outputType: 'cta',
        visualPriority: 'high',
        layoutStyle: 'card',
        emphasisLevel: 'bold',
        ctaPosition: 'primary',
        contentDirectives: 'Action verb + learning benefit. e.g. "Read the Full Guide".',
      },
      {
        type: 'footer',
        label: 'Closing & Encouragement',
        description: 'Encourage continued learning. Sign off with brand/team name.',
        required: true,
        order: 9,
        outputType: 'paragraph',
        visualPriority: 'low',
        layoutStyle: 'list',
        emphasisLevel: 'subtle',
        contentDirectives: 'Warm close. Reinforce next step. 2-3 sentences.',
      },
    ],
  },

  // =========================================================================
  // ENGAGEMENT NEWSLETTER
  // Conversational, community-driven, participation-focused, discussion-rich
  // =========================================================================
  engagement: {
    id: 'engagement',
    name: 'Engagement Newsletter',
    description: 'Community-focused newsletter with discussions, polls, member spotlights, examples, and feedback requests.',
    contentTypes: ['community', 'curated'],
    subjectPatterns: [
      'We Want to Hear From You ❤️',
      'Tell Us Your Thoughts',
      'Your Feedback Matters',
      'Join the Conversation Today',
    ],
    ctaStyle: 'Conversational, community-driven (e.g. "Reply Now", "Take Survey", "Join the Discussion")',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'subheading', 'feature-grid', 'social-proof', 'highlight-card', 'feature-grid', 'cta', 'footer'],
      maxParagraphLength: 60,
      idealHighlightBlocks: 3,
      cardDensity: 'balanced',
      scanningBehavior: 'mixed',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'friendly',
      spacingDensity: 'comfortable',
      visualStyle: 'playful',
      brandingMood: 'warm',
      urgencyLevel: 'low',
      interactivityHints: ['clickable', 'hoverable'],
    },
    sections: [
      {
        type: 'hero',
        label: 'Header — Community Title',
        description: 'Warm community newsletter title with issue number.',
        required: true,
        order: 1,
        outputType: 'heading',
        visualPriority: 'high',
        layoutStyle: 'banner',
        emphasisLevel: 'bold',
        contentDirectives: 'Warm and inviting. Format: "[Community Name] — Issue #[N]" or question format.',
      },
      {
        type: 'highlight-card',
        label: 'Community Connection Intro',
        description: 'Warm opening explaining what the community is about and why this issue matters.',
        required: true,
        order: 2,
        outputType: 'paragraph',
        visualPriority: 'high',
        layoutStyle: 'card',
        emphasisLevel: 'moderate',
        contentDirectives: '2-3 sentences. Reference the community. Make it personal. Why this topic now.',
      },
      {
        type: 'subheading',
        label: 'Discussion Question',
        description: 'An engaging question to spark conversation with context.',
        required: true,
        order: 3,
        outputType: 'subheading',
        visualPriority: 'high',
        layoutStyle: 'split',
        emphasisLevel: 'bold',
        contentDirectives: 'One compelling question. End with "?". Make it specific, not generic.',
      },
      {
        type: 'feature-grid',
        label: 'Discussion Points & Examples',
        description: '3-4 discussion prompts with example responses and context.',
        required: true,
        order: 4,
        outputType: 'list',
        visualPriority: 'medium',
        layoutStyle: 'grid',
        emphasisLevel: 'moderate',
        contentDirectives: '3-4 items. Each: **Topic/prompt** — brief example response or context. Makes discussion tangible.',
      },
      {
        type: 'social-proof',
        label: 'Community Spotlight',
        description: 'Feature a member story, user feedback highlight, or community achievement.',
        required: true,
        order: 5,
        outputType: 'quote',
        visualPriority: 'medium',
        layoutStyle: 'card',
        emphasisLevel: 'moderate',
        contentDirectives: 'Real member quote or achievement story. Attribute by name or username. Why it matters.',
      },
      {
        type: 'highlight-card',
        label: 'Why This Matters',
        description: 'Explain the significance of the discussion topic and what the community gains.',
        required: true,
        order: 6,
        outputType: 'paragraph',
        visualPriority: 'medium',
        layoutStyle: 'card',
        emphasisLevel: 'moderate',
        contentDirectives: '2-3 sentences. Connect the topic to real impact. What changes if we act on this.',
      },
      {
        type: 'feature-grid',
        label: 'Ways to Participate',
        description: '3-4 specific ways readers can engage — reply, vote, share, attend.',
        required: true,
        order: 7,
        outputType: 'list',
        visualPriority: 'medium',
        layoutStyle: 'grid',
        emphasisLevel: 'moderate',
        contentDirectives: '3-4 items. Each: **Action** — one-line description of how to participate.',
      },
      {
        type: 'image',
        label: 'Community Banner',
        description: 'Optional community-themed banner or event image.',
        required: false,
        order: 5,
        outputType: 'image',
        visualPriority: 'medium',
        layoutStyle: 'banner',
        emphasisLevel: 'moderate',
        imageType: 'banner',
        imageLayout: 'full-width',
        imagePosition: 'middle',
        imagePriority: 'medium',
        contentDirectives: 'Community event or engagement banner image. Use placeholder if no URL.',
      },
      {
        type: 'image',
        label: 'Spotlight Avatar',
        description: 'Optional team or member photo for the community spotlight section.',
        required: false,
        order: 7,
        outputType: 'image',
        visualPriority: 'low',
        layoutStyle: 'card',
        emphasisLevel: 'subtle',
        imageType: 'team',
        imageLayout: 'card',
        imagePosition: 'middle',
        imagePriority: 'low',
        contentDirectives: 'Team or member photo for spotlight. Card layout.',
      },
      {
        type: 'cta',
        label: 'CTA — Share Your Feedback',
        description: 'Encourage participation with a conversational CTA.',
        required: true,
        order: 8,
        outputType: 'cta',
        visualPriority: 'high',
        layoutStyle: 'card',
        emphasisLevel: 'bold',
        ctaPosition: 'primary',
        contentDirectives: 'Conversational, community-oriented CTA. Not salesy.',
      },
      {
        type: 'footer',
        label: 'Closing & Thank You',
        description: 'Warm community close. Thank readers for being part of it.',
        required: true,
        order: 9,
        outputType: 'paragraph',
        visualPriority: 'low',
        layoutStyle: 'list',
        emphasisLevel: 'subtle',
        contentDirectives: '2-3 sentences. Gratitude + preview of next issue + forward-looking.',
      },
    ],
  },

  // =========================================================================
  // COMPANY UPDATE NEWSLETTER
  // Premium SaaS style, milestone-driven, executive-update oriented
  // =========================================================================
  'company-update': {
    id: 'company-update',
    name: 'Company Update Newsletter',
    description: 'Professional newsletter sharing company news, team achievements, milestones, product updates, partnerships, and upcoming events.',
    contentTypes: ['product-update', 'founder-letter', 'industry-news'],
    subjectPatterns: [
      '🚀 Company Updates You Should Know',
      'This Month\'s Business Highlights',
      'Exciting News from Our Team',
      'New Features & Announcements',
    ],
    ctaStyle: 'Professional, informative (e.g. "Visit Website", "Learn More", "Contact Us")',
    flowRules: {
      recommendedSectionOrder: ['hero', 'announcement', 'feature-grid', 'highlight-card', 'team-spotlight', 'event-card', 'feature-grid', 'cta', 'footer'],
      maxParagraphLength: 70,
      idealHighlightBlocks: 2,
      cardDensity: 'balanced',
      scanningBehavior: 'linear',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'authoritative',
      spacingDensity: 'comfortable',
      visualStyle: 'corporate',
      brandingMood: 'confident',
      urgencyLevel: 'low',
      interactivityHints: ['clickable', 'static'],
    },
    sections: [
      {
        type: 'hero',
        label: 'Header — Company Update Title',
        description: 'Company newsletter title with issue number and month/year.',
        required: true,
        order: 1,
        outputType: 'heading',
        visualPriority: 'high',
        layoutStyle: 'banner',
        emphasisLevel: 'bold',
        contentDirectives: 'Format: "[Company] Updates — [Month] [Year]". Clean and authoritative.',
      },
      {
        type: 'announcement',
        label: 'Month Overview',
        description: 'Short summary of what\'s new this month.',
        required: true,
        order: 2,
        outputType: 'paragraph',
        visualPriority: 'high',
        layoutStyle: 'card',
        emphasisLevel: 'bold',
        contentDirectives: '2-3 sentences. Highlight the single most important update. Why it matters.',
      },
      {
        type: 'feature-grid',
        label: 'Business Updates',
        description: '3-5 key business updates: product launches, team achievements, milestones, partnerships.',
        required: true,
        order: 3,
        outputType: 'list',
        visualPriority: 'high',
        layoutStyle: 'grid',
        emphasisLevel: 'moderate',
        contentDirectives: '3-5 items. Each: **Update name** — one-sentence summary. Scannable.',
      },
      {
        type: 'highlight-card',
        label: 'Major Announcement Detail',
        description: 'An expanded paragraph about the most important company achievement.',
        required: true,
        order: 4,
        outputType: 'paragraph',
        visualPriority: 'medium',
        layoutStyle: 'card',
        emphasisLevel: 'moderate',
        contentDirectives: 'One key achievement expanded with context. What happened + why it matters + what\'s next.',
      },
      {
        type: 'team-spotlight',
        label: 'Team Spotlight',
        description: 'Highlight a team member, success story, or behind-the-scenes look.',
        required: true,
        order: 5,
        outputType: 'paragraph',
        visualPriority: 'medium',
        layoutStyle: 'split',
        emphasisLevel: 'subtle',
        contentDirectives: 'Brief story or intro. Human and relatable. Name + role + achievement.',
      },
      {
        type: 'event-card',
        label: 'Upcoming Events',
        description: 'List upcoming events, webinars, or workshops.',
        required: false,
        order: 6,
        outputType: 'list',
        visualPriority: 'low',
        layoutStyle: 'list',
        emphasisLevel: 'subtle',
        contentDirectives: 'Each: **Event name** — date + format (online/offline). Max 3 events.',
      },
      {
        type: 'feature-grid',
        label: 'By the Numbers',
        description: '2-3 key metrics or stats showing progress this month.',
        required: true,
        order: 7,
        outputType: 'list',
        visualPriority: 'medium',
        layoutStyle: 'grid',
        emphasisLevel: 'moderate',
        contentDirectives: '2-3 items. Each: **Metric** — result + context. e.g. "**1,000+ users** — grew 40% this month"',
      },
      {
        type: 'image',
        label: 'Company Hero Banner',
        description: 'Hero banner image for the company update — office, product, or milestone visual.',
        required: false,
        order: 2,
        outputType: 'image',
        visualPriority: 'high',
        layoutStyle: 'banner',
        emphasisLevel: 'bold',
        imageType: 'hero',
        imageLayout: 'full-width',
        imagePosition: 'top',
        imagePriority: 'high',
        contentDirectives: 'Hero banner for company update. Office, product launch, or milestone visual.',
      },
      {
        type: 'image',
        label: 'Product Screenshot',
        description: 'Product or feature screenshot for the highlights section.',
        required: false,
        order: 5,
        outputType: 'image',
        visualPriority: 'medium',
        layoutStyle: 'card',
        emphasisLevel: 'moderate',
        imageType: 'product',
        imageLayout: 'card',
        imagePosition: 'middle',
        imagePriority: 'medium',
        contentDirectives: 'Product or feature screenshot. Card layout.',
      },
      {
        type: 'image',
        label: 'Team Photo',
        description: 'Team or member photo for the spotlight section.',
        required: false,
        order: 7,
        outputType: 'image',
        visualPriority: 'low',
        layoutStyle: 'card',
        emphasisLevel: 'subtle',
        imageType: 'team',
        imageLayout: 'card',
        imagePosition: 'middle',
        imagePriority: 'low',
        contentDirectives: 'Team member or group photo. Card layout.',
      },
      {
        type: 'cta',
        label: 'CTA — Explore Updates',
        description: 'Encourage exploration with a professional CTA.',
        required: true,
        order: 8,
        outputType: 'cta',
        visualPriority: 'high',
        layoutStyle: 'card',
        emphasisLevel: 'bold',
        ctaPosition: 'primary',
        contentDirectives: 'Professional, informational CTA. e.g. "Explore What\'s New".',
      },
      {
        type: 'footer',
        label: 'Closing & Thank You',
        description: 'Thank readers. Sign off with company name.',
        required: true,
        order: 9,
        outputType: 'paragraph',
        visualPriority: 'low',
        layoutStyle: 'list',
        emphasisLevel: 'subtle',
        contentDirectives: '2-3 sentences. Gratitude + next edition preview.',
      },
    ],
  },

  // =========================================================================
  // AI NEWSLETTER
  // Futuristic, trend-focused, discovery-oriented, tool-rich
  // =========================================================================
  ai: {
    id: 'ai',
    name: 'AI Newsletter',
    description: 'AI-focused newsletter covering the latest AI trends, tools, productivity tips, industry innovations, and insights.',
    contentTypes: ['ai'],
    subjectPatterns: [
      '🚀 Latest AI Trends & Tools This Week',
      'AI Innovations You Need to Know',
      'Future of AI — Weekly Insights',
      'Boost Productivity with AI Tools',
    ],
    ctaStyle: 'Tech-forward, discovery-driven (e.g. "Explore AI Tools", "Try It Now", "Join the AI Community")',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'subheading', 'feature-grid', 'highlight-card', 'social-proof', 'resource-list', 'cta', 'footer'],
      maxParagraphLength: 60,
      idealHighlightBlocks: 3,
      cardDensity: 'balanced',
      scanningBehavior: 'scannable',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'professional',
      spacingDensity: 'compact',
      visualStyle: 'minimal',
      brandingMood: 'innovative',
      urgencyLevel: 'medium',
      interactivityHints: ['clickable', 'hoverable'],
    },
    sections: [
      {
        type: 'hero',
        label: 'Header — AI Newsletter Title',
        description: 'AI newsletter title with issue number. Linear-style: clean, confident.',
        required: true,
        order: 1,
        outputType: 'heading',
        visualPriority: 'high',
        layoutStyle: 'banner',
        emphasisLevel: 'bold',
        contentDirectives: 'Format: "AI Weekly — Issue #[N]" or "[Topic] in AI". Short and confident.',
      },
      {
        type: 'highlight-card',
        label: 'AI Landscape Intro',
        description: 'Opening paragraph about the AI landscape — what\'s trending this week.',
        required: true,
        order: 2,
        outputType: 'paragraph',
        visualPriority: 'high',
        layoutStyle: 'card',
        emphasisLevel: 'moderate',
        contentDirectives: '2-3 sentences. One hook + what this issue covers. Why it matters now.',
      },
      {
        type: 'subheading',
        label: 'Featured AI Story',
        description: 'Bold heading for the main AI trend or innovation story.',
        required: true,
        order: 3,
        outputType: 'subheading',
        visualPriority: 'high',
        layoutStyle: 'split',
        emphasisLevel: 'bold',
        contentDirectives: 'One clear heading. e.g. "This Week in AI: [Topic]"',
      },
      {
        type: 'feature-grid',
        label: 'AI Tips & Insights',
        description: '3-5 AI tips: best tools, productivity hacks, automation ideas.',
        required: true,
        order: 4,
        outputType: 'list',
        visualPriority: 'high',
        layoutStyle: 'grid',
        emphasisLevel: 'moderate',
        contentDirectives: '3-5 items. Each: **Tool/concept name** — one practical takeaway. Scannable.',
      },
      {
        type: 'highlight-card',
        label: 'Deep Dive: Why This Matters',
        description: 'A brief explanation of the significance of this week\'s AI development.',
        required: true,
        order: 5,
        outputType: 'paragraph',
        visualPriority: 'medium',
        layoutStyle: 'card',
        emphasisLevel: 'moderate',
        contentDirectives: '2-3 sentences. Context + implications. What changes for the reader.',
      },
      {
        type: 'social-proof',
        label: 'Tool of the Week Spotlight',
        description: 'Feature one AI tool with description and why it matters.',
        required: true,
        order: 6,
        outputType: 'quote',
        visualPriority: 'medium',
        layoutStyle: 'card',
        emphasisLevel: 'subtle',
        contentDirectives: 'Tool name + one-line value prop + "Why it matters" sentence.',
      },
      {
        type: 'resource-list',
        label: 'Industry Updates',
        description: 'Brief list of AI startup news, new apps, market trends.',
        required: true,
        order: 7,
        outputType: 'list',
        visualPriority: 'medium',
        layoutStyle: 'list',
        emphasisLevel: 'subtle',
        contentDirectives: '3-4 items. Each: **News headline** — one-line context.',
      },
      {
        type: 'image',
        label: 'AI Visual Banner',
        description: 'AI-themed banner or trend illustration image.',
        required: false,
        order: 3,
        outputType: 'image',
        visualPriority: 'medium',
        layoutStyle: 'banner',
        emphasisLevel: 'moderate',
        imageType: 'banner',
        imageLayout: 'full-width',
        imagePosition: 'middle',
        imagePriority: 'medium',
        contentDirectives: 'AI-themed visual banner or trend illustration. Use placeholder if no URL.',
      },
      {
        type: 'image',
        label: 'Tool Screenshot',
        description: 'Screenshot or visual of the featured AI tool.',
        required: false,
        order: 6,
        outputType: 'image',
        visualPriority: 'low',
        layoutStyle: 'card',
        emphasisLevel: 'subtle',
        imageType: 'product',
        imageLayout: 'card',
        imagePosition: 'middle',
        imagePriority: 'low',
        contentDirectives: 'AI tool screenshot or interface. Card layout.',
      },
      {
        type: 'cta',
        label: 'CTA — Explore AI Tools',
        description: 'Encourage action with a discovery-oriented CTA.',
        required: true,
        order: 8,
        outputType: 'cta',
        visualPriority: 'high',
        layoutStyle: 'card',
        emphasisLevel: 'bold',
        ctaPosition: 'primary',
        contentDirectives: 'Discovery-oriented CTA. Action verb + exploration benefit.',
      },
      {
        type: 'footer',
        label: 'Closing & Thank You',
        description: 'Thank readers and sign off. Encourage continued AI exploration.',
        required: true,
        order: 9,
        outputType: 'paragraph',
        visualPriority: 'low',
        layoutStyle: 'list',
        emphasisLevel: 'subtle',
        contentDirectives: '2-3 sentences. Forward-looking close.',
      },
    ],
  },

  // =========================================================================
  // FOUNDER STORY NEWSLETTER
  // Personal narrative, turning point, lesson-driven, authentic voice
  // =========================================================================
  'founder-story': {
    id: 'founder-story',
    name: 'Founder Story Newsletter',
    description: 'Personal founder narrative with authentic storytelling, turning points, lessons learned, and relationship-building CTAs.',
    contentTypes: ['founder-story'],
    subjectPatterns: [
      'From My Desk — A Lesson I Learned the Hard Way',
      'Our Journey: What Changed Last Month',
      'Why We Pivoted — A Personal Update',
      'An Honest Look at Where We\'re Headed',
    ],
    ctaStyle: 'Personal, relationship-driven (e.g. "Reply to This", "Share Your Story", "Let\'s Talk")',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'subheading', 'feature-grid', 'highlight-card', 'quote', 'cta', 'footer'],
      maxParagraphLength: 80,
      idealHighlightBlocks: 2,
      cardDensity: 'balanced',
      scanningBehavior: 'linear',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'casual',
      spacingDensity: 'comfortable',
      visualStyle: 'minimal',
      brandingMood: 'warm',
      urgencyLevel: 'low',
      interactivityHints: ['clickable', 'scrollable'],
    },
    sections: [
      { type: 'hero', label: 'Header — Founder Greeting', description: 'Personal greeting from the founder.', required: true, order: 1, outputType: 'heading', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', contentDirectives: 'Personal tone. "From [Founder Name]" or "A note from [Name]".' },
      { type: 'highlight-card', label: 'The Story Opening', description: 'Set the scene — what happened, what prompted this letter.', required: true, order: 2, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: '2-3 sentences. Personal, authentic. Set the context.' },
      { type: 'subheading', label: 'The Turning Point', description: 'The moment everything changed — decision, failure, or insight.', required: true, order: 3, outputType: 'subheading', visualPriority: 'high', layoutStyle: 'split', emphasisLevel: 'bold', contentDirectives: 'One clear turning point label. e.g. "The Day We Almost Shut Down".' },
      { type: 'feature-grid', label: 'What I Learned', description: '3-4 key lessons or takeaways from the experience.', required: true, order: 4, outputType: 'list', visualPriority: 'high', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '3-4 items. Each: **Lesson** — one-line explanation. Honest and specific.' },
      { type: 'highlight-card', label: 'What Changed', description: 'The concrete result — what happened after the turning point.', required: true, order: 5, outputType: 'paragraph', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: '2-3 sentences. Show the outcome. Make it tangible.' },
      { type: 'quote', label: 'Personal Reflection', description: 'A personal quote or guiding principle that emerged.', required: true, order: 6, outputType: 'quote', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'subtle', contentDirectives: 'Personal quote or principle. Attributed to the founder.' },
      { type: 'cta', label: 'CTA — Join the Conversation', description: 'Invite readers to share their own story or respond.', required: true, order: 7, outputType: 'cta', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'bold', ctaPosition: 'primary', contentDirectives: 'Personal, relationship-building CTA. e.g. "Reply and Share Your Story".' },
      { type: 'footer', label: 'Warm Close', description: 'Personal sign-off with forward-looking note.', required: true, order: 8, outputType: 'paragraph', visualPriority: 'low', layoutStyle: 'list', emphasisLevel: 'subtle', contentDirectives: '2-3 sentences. Gratitude + what\'s coming next. Sign off personally.' },
    ],
  },

  // =========================================================================
  // SALES NEWSLETTER
  // Problem → agitation → solution → proof → CTA
  // =========================================================================
  sales: {
    id: 'sales',
    name: 'Sales Newsletter',
    description: 'Conversion-focused newsletter using problem-agitation-solution framework with social proof and urgency CTAs.',
    contentTypes: ['sales'],
    subjectPatterns: [
      'Struggling with [Problem]? Here\'s the Fix',
      'Stop Losing [Metric] — Start Doing This',
      'The [Problem] Solution That Actually Works',
      'How [Company] Solved [Problem] in 30 Days',
    ],
    ctaStyle: 'Action-oriented, conversion-driven (e.g. "Book a Call", "Start Free Trial", "See the Demo")',
    urgencyBonus: 'Emphasize the cost of inaction — what they lose by not acting now.',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'feature-grid', 'highlight-card', 'social-proof', 'feature-grid', 'cta', 'footer'],
      maxParagraphLength: 50,
      idealHighlightBlocks: 3,
      cardDensity: 'balanced',
      scanningBehavior: 'scannable',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'urgent',
      spacingDensity: 'compact',
      visualStyle: 'bold',
      brandingMood: 'dynamic',
      urgencyLevel: 'high',
      interactivityHints: ['clickable', 'static'],
    },
    sections: [
      { type: 'hero', label: 'Problem Statement Headline', description: 'Bold headline naming the problem the reader faces.', required: true, order: 1, outputType: 'heading', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', contentDirectives: 'Max 6 words. Name the problem. e.g. "Stop Wasting Hours on Manual Work".' },
      { type: 'highlight-card', label: 'Agitate the Problem', description: 'Make the reader feel the pain of the current situation.', required: true, order: 2, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'bold', contentDirectives: '2-3 sentences. Quantify the pain. Time lost, money wasted, opportunities missed.' },
      { type: 'feature-grid', label: 'The Cost of Inaction', description: '3-4 specific consequences of not solving the problem.', required: true, order: 3, outputType: 'list', visualPriority: 'high', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '3-4 items. Each: **Consequence** — one-line impact. Make it real.' },
      { type: 'highlight-card', label: 'The Solution', description: 'Introduce your product/approach as the answer.', required: true, order: 4, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'bold', contentDirectives: '2-3 sentences. Present the solution. Show how it eliminates the problem.' },
      { type: 'social-proof', label: 'Customer Proof', description: 'A customer quote or result proving the solution works.', required: true, order: 5, outputType: 'quote', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'subtle', contentDirectives: 'Real customer result. Include metric. e.g. "Cut onboarding time by 60%".' },
      { type: 'feature-grid', label: 'How It Works', description: '3-4 steps or features showing the solution in action.', required: true, order: 6, outputType: 'list', visualPriority: 'medium', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '3-4 items. Each: **Step/Feature** — one-line benefit. Simple and clear.' },
      { type: 'cta', label: 'CTA — Take Action Now', description: 'Strong conversion CTA with urgency.', required: true, order: 7, outputType: 'cta', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', ctaPosition: 'primary', contentDirectives: 'Action verb + benefit. e.g. "Start Free Trial Today".' },
      { type: 'footer', label: 'Final Push & Deadline', description: 'Restate urgency and close.', required: true, order: 8, outputType: 'paragraph', visualPriority: 'low', layoutStyle: 'list', emphasisLevel: 'subtle', contentDirectives: '2 sentences. Restate what they gain. Warm but urgent close.' },
    ],
  },

  // =========================================================================
  // WEEKLY INSIGHT NEWSLETTER
  // Structured weekly breakdown, data-driven, trend-focused
  // =========================================================================
  'weekly-insight': {
    id: 'weekly-insight',
    name: 'Weekly Insight Newsletter',
    description: 'Structured weekly breakdown format with data points, trends, and actionable takeaways for decision-makers.',
    contentTypes: ['weekly-insight'],
    subjectPatterns: [
      '📊 This Week in [Industry] — Key Takeaways',
      'Weekly Brief: What You Missed',
      '5 Things That Mattered This Week',
      'Your Weekly Edge — [Date]',
    ],
    ctaStyle: 'Data-driven, insight-focused (e.g. "Read Full Analysis", "Get the Report", "Subscribe for Weekly Insights")',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'feature-grid', 'subheading', 'feature-grid', 'quote', 'cta', 'footer'],
      maxParagraphLength: 60,
      idealHighlightBlocks: 2,
      cardDensity: 'dense',
      scanningBehavior: 'scannable',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'authoritative',
      spacingDensity: 'compact',
      visualStyle: 'minimal',
      brandingMood: 'confident',
      urgencyLevel: 'low',
      interactivityHints: ['clickable', 'scrollable'],
    },
    sections: [
      { type: 'hero', label: 'Weekly Issue Header', description: 'Issue number and week identifier.', required: true, order: 1, outputType: 'heading', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', contentDirectives: 'Format: "[Brand] Weekly — Issue #[N]" or "Week [N] Brief".' },
      { type: 'highlight-card', label: 'Week Summary', description: 'One-paragraph summary of the week\'s most important developments.', required: true, order: 2, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: '2-3 sentences. The most important thing this week + why it matters.' },
      { type: 'feature-grid', label: 'Top Stories', description: '3-5 key stories or data points from the week.', required: true, order: 3, outputType: 'list', visualPriority: 'high', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '3-5 items. Each: **Headline** — one-line significance. Numbered.' },
      { type: 'subheading', label: 'Deep Dive Heading', description: 'Heading for the main analysis section.', required: true, order: 4, outputType: 'subheading', visualPriority: 'medium', layoutStyle: 'split', emphasisLevel: 'bold', contentDirectives: 'One clear topic label. e.g. "The Big Picture: [Topic]".' },
      { type: 'feature-grid', label: 'Analysis & Takeaways', description: '3-4 analytical points with actionable takeaways.', required: true, order: 5, outputType: 'list', visualPriority: 'medium', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '3-4 items. Each: **Insight** — one actionable takeaway.' },
      { type: 'quote', label: 'Expert Perspective', description: 'An expert quote or data point that frames the week.', required: true, order: 6, outputType: 'quote', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'subtle', contentDirectives: 'Attributed expert opinion or notable data point.' },
      { type: 'cta', label: 'CTA — Go Deeper', description: 'Encourage deeper engagement with the analysis.', required: true, order: 7, outputType: 'cta', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'bold', ctaPosition: 'primary', contentDirectives: 'Insight-driven CTA. e.g. "Read the Full Report".' },
      { type: 'footer', label: 'See You Next Week', description: 'Preview of next week and sign-off.', required: true, order: 8, outputType: 'paragraph', visualPriority: 'low', layoutStyle: 'list', emphasisLevel: 'subtle', contentDirectives: '2 sentences. Preview next week + subscribe reminder.' },
    ],
  },

  // =========================================================================
  // CAROUSEL-TO-NEWSLETTER FORMAT
  // Swipeable card format adapted for email, visual-first
  // =========================================================================
  carousel: {
    id: 'carousel',
    name: 'Carousel Newsletter',
    description: 'Visual-first swipeable card format adapted for email — each section is a self-contained card with one idea.',
    contentTypes: ['carousel'],
    subjectPatterns: [
      '📱 Swipe Through This Week\'s Best',
      '5 Cards That Will Change Your Perspective',
      'The Carousel Edition — [Topic]',
      'Slide by Slide: [Topic] Explained',
    ],
    ctaStyle: 'Swipe/scroll-oriented (e.g. "See the Next Card", "Explore the Full Deck", "Save This")',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'highlight-card', 'highlight-card', 'feature-grid', 'highlight-card', 'cta', 'footer'],
      maxParagraphLength: 40,
      idealHighlightBlocks: 4,
      cardDensity: 'dense',
      scanningBehavior: 'scannable',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'casual',
      spacingDensity: 'compact',
      visualStyle: 'bold',
      brandingMood: 'dynamic',
      urgencyLevel: 'low',
      interactivityHints: ['clickable', 'scrollable'],
    },
    sections: [
      { type: 'hero', label: 'Carousel Title Card', description: 'Eye-catching title card — the first "slide".', required: true, order: 1, outputType: 'heading', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', contentDirectives: 'Max 6 words. Bold, visual, thumb-stopping.' },
      { type: 'highlight-card', label: 'Card 1 — Hook', description: 'First content card with the hook or surprising fact.', required: true, order: 2, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'bold', contentDirectives: 'ONE sentence. The hook. Make them want the next card.' },
      { type: 'highlight-card', label: 'Card 2 — Key Insight', description: 'Second content card with the main point.', required: true, order: 3, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: 'ONE sentence. The core message. Bold and clear.' },
      { type: 'highlight-card', label: 'Card 3 — Data Point', description: 'Third content card with supporting data or proof.', required: true, order: 4, outputType: 'paragraph', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: 'ONE sentence. A stat, fact, or proof point.' },
      { type: 'feature-grid', label: 'Card 4 — Quick Takeaways', description: 'Fourth card as a list of 3 quick takeaways.', required: true, order: 5, outputType: 'list', visualPriority: 'medium', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '3 items. Each: **Takeaway** — one-line detail. Bullet-style.' },
      { type: 'highlight-card', label: 'Card 5 — The So What', description: 'Final content card with implications or next steps.', required: true, order: 6, outputType: 'paragraph', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: 'ONE sentence. Why this matters for the reader.' },
      { type: 'cta', label: 'CTA — See More', description: 'CTA card to continue exploring.', required: true, order: 7, outputType: 'cta', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'bold', ctaPosition: 'primary', contentDirectives: 'Swipe-oriented CTA. e.g. "See the Full Deck".' },
      { type: 'footer', label: 'End of Carousel', description: 'Brief close encouraging sharing.', required: true, order: 8, outputType: 'paragraph', visualPriority: 'low', layoutStyle: 'list', emphasisLevel: 'subtle', contentDirectives: '2 sentences. Share prompt + next carousel preview.' },
    ],
  },

  // =========================================================================
  // PROBLEM → SOLUTION → CTA FORMAT
  // Direct, no-fluff, conversion-oriented
  // =========================================================================
  'problem-solution': {
    id: 'problem-solution',
    name: 'Problem-Solution Newsletter',
    description: 'Direct format: identify the problem, present the solution, prove it works, drive to CTA. No fluff.',
    contentTypes: ['problem-solution'],
    subjectPatterns: [
      'The Fix for [Problem]',
      'Solve [Problem] in 3 Steps',
      '[Problem]? Here\'s What Works',
      'Stop [Problem] — Start [Solution]',
    ],
    ctaStyle: 'Direct, action-driven (e.g. "Fix It Now", "Get the Solution", "Start Solving")',
    urgencyBonus: 'Highlight the cost of the problem continuing unsolved.',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'feature-grid', 'highlight-card', 'social-proof', 'cta', 'footer'],
      maxParagraphLength: 50,
      idealHighlightBlocks: 2,
      cardDensity: 'balanced',
      scanningBehavior: 'scannable',
      maxSections: 9,
      minSections: 6,
    },
    design: {
      tone: 'authoritative',
      spacingDensity: 'compact',
      visualStyle: 'bold',
      brandingMood: 'confident',
      urgencyLevel: 'medium',
      interactivityHints: ['clickable', 'static'],
    },
    sections: [
      { type: 'hero', label: 'Problem Headline', description: 'Name the problem directly.', required: true, order: 1, outputType: 'heading', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', contentDirectives: 'Max 6 words. Name the problem. Direct and clear.' },
      { type: 'highlight-card', label: 'Why It\'s a Problem', description: 'Explain the pain — brief, sharp, relatable.', required: true, order: 2, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'bold', contentDirectives: '2 sentences. Make the reader nod. Quantify the pain.' },
      { type: 'feature-grid', label: 'What Most People Try (And Why It Fails)', description: '3-4 common but ineffective approaches.', required: true, order: 3, outputType: 'list', visualPriority: 'medium', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '3-4 items. Each: **Approach** — why it fails.' },
      { type: 'highlight-card', label: 'The Real Solution', description: 'Your solution — clear, specific, different.', required: true, order: 4, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'bold', contentDirectives: '2-3 sentences. What it is + how it\'s different. Concrete.' },
      { type: 'social-proof', label: 'Proof It Works', description: 'Customer result or data proving the solution.', required: true, order: 5, outputType: 'quote', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'subtle', contentDirectives: 'Real result with metric. Attributed.' },
      { type: 'cta', label: 'CTA — Fix It Now', description: 'Direct action CTA.', required: true, order: 6, outputType: 'cta', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', ctaPosition: 'primary', contentDirectives: 'Action verb + solution. e.g. "Start Solving Today".' },
      { type: 'footer', label: 'Closing', description: 'Brief close reinforcing the solution.', required: true, order: 7, outputType: 'paragraph', visualPriority: 'low', layoutStyle: 'list', emphasisLevel: 'subtle', contentDirectives: '2 sentences. Reinforce benefit + next step.' },
    ],
  },

  // =========================================================================
  // AUTHORITY BUILDING NEWSLETTER
  // Opinion → breakdown → case study → CTA
  // =========================================================================
  authority: {
    id: 'authority',
    name: 'Authority Building Newsletter',
    description: 'Thought leadership format: strong opinion, structured breakdown, case study proof, authority-building CTA.',
    contentTypes: ['authority'],
    subjectPatterns: [
      'Why [Conventional Wisdom] Is Wrong',
      'The Unpopular Truth About [Topic]',
      'Here\'s What the Data Actually Shows',
      'My Take: [Opinion on Topic]',
    ],
    ctaStyle: 'Thought leadership, expertise-driven (e.g. "Read My Full Analysis", "Subscribe for More Insights", "Join the Discussion")',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'subheading', 'feature-grid', 'highlight-card', 'quote', 'feature-grid', 'cta', 'footer'],
      maxParagraphLength: 70,
      idealHighlightBlocks: 3,
      cardDensity: 'balanced',
      scanningBehavior: 'linear',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'authoritative',
      spacingDensity: 'comfortable',
      visualStyle: 'elegant',
      brandingMood: 'confident',
      urgencyLevel: 'low',
      interactivityHints: ['clickable', 'scrollable'],
    },
    sections: [
      { type: 'hero', label: 'Opinion Headline', description: 'A bold, opinionated headline that challenges conventional thinking.', required: true, order: 1, outputType: 'heading', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', contentDirectives: 'Max 6 words. Strong opinion. Provocative but defensible.' },
      { type: 'highlight-card', label: 'The Unpopular Take', description: 'Your core opinion — clearly stated with conviction.', required: true, order: 2, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'bold', contentDirectives: '2-3 sentences. State your position. No hedging. Be specific.' },
      { type: 'subheading', label: 'Why I Believe This', description: 'Heading for the supporting evidence section.', required: true, order: 3, outputType: 'subheading', visualPriority: 'medium', layoutStyle: 'split', emphasisLevel: 'bold', contentDirectives: 'Clear analytical heading. e.g. "3 Reasons the Data Disagrees".' },
      { type: 'feature-grid', label: 'Evidence Breakdown', description: '3-4 data points or logical arguments supporting the opinion.', required: true, order: 4, outputType: 'list', visualPriority: 'high', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '3-4 items. Each: **Point** — evidence or logic. Cite data when possible.' },
      { type: 'highlight-card', label: 'Case Study', description: 'A specific example proving the opinion in practice.', required: true, order: 5, outputType: 'paragraph', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: '2-3 sentences. Name a real company, person, or scenario.' },
      { type: 'quote', label: 'Supporting Authority', description: 'An expert or data point that validates the opinion.', required: false, order: 6, outputType: 'quote', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'subtle', contentDirectives: 'Attributed expert or research backing the opinion.' },
      { type: 'feature-grid', label: 'What This Means for You', description: '2-3 implications the reader should act on.', required: true, order: 7, outputType: 'list', visualPriority: 'medium', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '2-3 items. Each: **Implication** — one actionable step.' },
      { type: 'cta', label: 'CTA — Join the Conversation', description: 'Invite debate or deeper engagement.', required: true, order: 8, outputType: 'cta', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'bold', ctaPosition: 'primary', contentDirectives: 'Debate-oriented CTA. e.g. "Agree or Disagree? Reply Now".' },
      { type: 'footer', label: 'Authoritative Close', description: 'Confident sign-off reinforcing the position.', required: true, order: 9, outputType: 'paragraph', visualPriority: 'low', layoutStyle: 'list', emphasisLevel: 'subtle', contentDirectives: '2-3 sentences. Stand by the opinion. Preview next topic.' },
    ],
  },

  // =========================================================================
  // STORYTELLING + SOFT SELL FORMAT
  // Narrative-driven, soft CTA, relationship-building
  // =========================================================================
  storytelling: {
    id: 'storytelling',
    name: 'Storytelling Newsletter',
    description: 'Narrative-first newsletter with a soft sell approach — story leads, value follows, CTA is a natural next step.',
    contentTypes: ['storytelling'],
    subjectPatterns: [
      'A Story About [Topic]',
      'What [Experience] Taught Me',
      'The Day Everything Changed',
      'Behind the Scenes: [Story Topic]',
    ],
    ctaStyle: 'Soft, relationship-driven (e.g. "See How It Works", "Try It Free", "Watch the Story")',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'subheading', 'highlight-card', 'feature-grid', 'quote', 'cta', 'footer'],
      maxParagraphLength: 80,
      idealHighlightBlocks: 2,
      cardDensity: 'balanced',
      scanningBehavior: 'linear',
      maxSections: 9,
      minSections: 7,
    },
    design: {
      tone: 'casual',
      spacingDensity: 'comfortable',
      visualStyle: 'elegant',
      brandingMood: 'warm',
      urgencyLevel: 'low',
      interactivityHints: ['clickable', 'scrollable'],
    },
    sections: [
      { type: 'hero', label: 'Story Title', description: 'Narrative hook — the opening of the story.', required: true, order: 1, outputType: 'heading', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', contentDirectives: 'Max 8 words. Story-style title. Curious and inviting.' },
      { type: 'highlight-card', label: 'Setting the Scene', description: 'Where and when the story takes place.', required: true, order: 2, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: '2-3 sentences. Set the scene. Who, where, when. Make it vivid.' },
      { type: 'subheading', label: 'The Conflict', description: 'The challenge or tension in the story.', required: true, order: 3, outputType: 'subheading', visualPriority: 'high', layoutStyle: 'split', emphasisLevel: 'bold', contentDirectives: 'The tension point. e.g. "The Problem Nobody Saw Coming".' },
      { type: 'highlight-card', label: 'The Resolution', description: 'How the challenge was overcome.', required: true, order: 4, outputType: 'paragraph', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: '2-3 sentences. The turning point or solution. Satisfying and real.' },
      { type: 'feature-grid', label: 'Lessons from the Story', description: '2-3 practical takeaways the reader can apply.', required: true, order: 5, outputType: 'list', visualPriority: 'medium', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '2-3 items. Each: **Lesson** — how to apply it. Bridge story to reader\'s world.' },
      { type: 'quote', label: 'Memorable Line', description: 'A quotable moment from the story.', required: true, order: 6, outputType: 'quote', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'subtle', contentDirectives: 'A memorable line from the narrative. Attributed to a character or the author.' },
      { type: 'cta', label: 'CTA — Gentle Next Step', description: 'Soft CTA that feels like a natural story continuation.', required: true, order: 7, outputType: 'cta', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'moderate', ctaPosition: 'primary', contentDirectives: 'Soft, story-connected CTA. e.g. "See the Full Story".' },
      { type: 'footer', label: 'Warm Close', description: 'Personal sign-off inviting the reader back.', required: true, order: 8, outputType: 'paragraph', visualPriority: 'low', layoutStyle: 'list', emphasisLevel: 'subtle', contentDirectives: '2-3 sentences. Warm, personal. Preview next story.' },
    ],
  },

  // =========================================================================
  // PERSONAL BRANDING NEWSLETTER
  // Individual-focused, portfolio of expertise, reputation-building
  // =========================================================================
  'personal-branding': {
    id: 'personal-branding',
    name: 'Personal Branding Newsletter',
    description: 'Individual-focused newsletter for building personal brand — expertise showcase, achievements, and professional positioning.',
    contentTypes: ['personal-branding'],
    subjectPatterns: [
      'What I\'m Working On — [Update]',
      'My Take on [Topic] This Week',
      'Behind My Work: [Project/Topic]',
      'Building in Public — Issue #[N]',
    ],
    ctaStyle: 'Portfolio/engagement-oriented (e.g. "Follow My Journey", "Connect With Me", "Check Out My Work")',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'subheading', 'feature-grid', 'social-proof', 'highlight-card', 'cta', 'footer'],
      maxParagraphLength: 60,
      idealHighlightBlocks: 3,
      cardDensity: 'balanced',
      scanningBehavior: 'scannable',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'friendly',
      spacingDensity: 'comfortable',
      visualStyle: 'minimal',
      brandingMood: 'confident',
      urgencyLevel: 'low',
      interactivityHints: ['clickable', 'hoverable'],
    },
    sections: [
      { type: 'hero', label: 'Personal Brand Header', description: 'Your name and newsletter identity.', required: true, order: 1, outputType: 'heading', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', contentDirectives: 'Format: "[Your Name] — Issue #[N]" or "Building in Public: [Topic]".' },
      { type: 'highlight-card', label: 'What I\'m Focused On', description: 'Current focus area or theme for this issue.', required: true, order: 2, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: '2-3 sentences. What you\'re working on and why it matters.' },
      { type: 'subheading', label: 'Key Achievement / Update', description: 'Heading for a recent win or milestone.', required: true, order: 3, outputType: 'subheading', visualPriority: 'high', layoutStyle: 'split', emphasisLevel: 'bold', contentDirectives: 'One clear achievement label. e.g. "Shipped: [Feature]" or "Hit: [Metric]".' },
      { type: 'feature-grid', label: 'Wins & Progress This Week', description: '3-4 specific achievements, shipped items, or milestones.', required: true, order: 4, outputType: 'list', visualPriority: 'high', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '3-4 items. Each: **Achievement** — one-line result. Concrete and measurable.' },
      { type: 'social-proof', label: 'Recognition or Testimonial', description: 'A shoutout, testimonial, or recognition received.', required: true, order: 5, outputType: 'quote', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'subtle', contentDirectives: 'Real recognition or testimonial. Attribute properly.' },
      { type: 'highlight-card', label: 'What I Learned', description: 'A lesson or insight from this week\'s work.', required: true, order: 6, outputType: 'paragraph', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: '2-3 sentences. Honest lesson. Vulnerability builds trust.' },
      { type: 'cta', label: 'CTA — Follow / Connect', description: 'Invite readers to follow your journey.', required: true, order: 7, outputType: 'cta', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'bold', ctaPosition: 'primary', contentDirectives: 'Engagement CTA. e.g. "Follow My Journey" or "Let\'s Connect".' },
      { type: 'footer', label: 'Building in Public Sign-off', description: 'Personal close with what\'s coming next.', required: true, order: 8, outputType: 'paragraph', visualPriority: 'low', layoutStyle: 'list', emphasisLevel: 'subtle', contentDirectives: '2-3 sentences. Next week preview + personal note.' },
    ],
  },

  // =========================================================================
  // HIGH ENGAGEMENT NEWSLETTER
  // Maximum participation, polls, discussion, community-driven
  // =========================================================================
  'high-engagement': {
    id: 'high-engagement',
    name: 'High Engagement Newsletter',
    description: 'Maximum participation format — polls, discussions, reactions, challenges — designed to generate the highest reply and click rates.',
    contentTypes: ['high-engagement'],
    subjectPatterns: [
      '❓ Quick Question for You',
      'Vote Now: [Poll Topic]',
      'I Need Your Input on [Topic]',
      'Challenge of the Week: [Topic]',
    ],
    ctaStyle: 'Participation-maximizing (e.g. "Vote Now", "Reply With Your Take", "Take the Challenge")',
    flowRules: {
      recommendedSectionOrder: ['hero', 'highlight-card', 'subheading', 'feature-grid', 'social-proof', 'feature-grid', 'highlight-card', 'cta', 'footer'],
      maxParagraphLength: 50,
      idealHighlightBlocks: 3,
      cardDensity: 'balanced',
      scanningBehavior: 'mixed',
      maxSections: 10,
      minSections: 7,
    },
    design: {
      tone: 'friendly',
      spacingDensity: 'comfortable',
      visualStyle: 'playful',
      brandingMood: 'warm',
      urgencyLevel: 'medium',
      interactivityHints: ['clickable', 'hoverable'],
    },
    sections: [
      { type: 'hero', label: 'Engagement Hook Title', description: 'A title that demands a response — question or challenge.', required: true, order: 1, outputType: 'heading', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', contentDirectives: 'Max 6 words. Question or challenge. Impossible to ignore.' },
      { type: 'highlight-card', label: 'Why This Matters to You', description: 'Personal connection — why the reader should care.', required: true, order: 2, outputType: 'paragraph', visualPriority: 'high', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: '2-3 sentences. Direct "you" language. Make it personal and urgent.' },
      { type: 'subheading', label: 'The Big Question', description: 'The main discussion question or poll topic.', required: true, order: 3, outputType: 'subheading', visualPriority: 'high', layoutStyle: 'split', emphasisLevel: 'bold', contentDirectives: 'One compelling question. Must end with "?". Specific, not generic.' },
      { type: 'feature-grid', label: 'Poll Options / Perspectives', description: '3-4 options or perspectives to vote on or discuss.', required: true, order: 4, outputType: 'list', visualPriority: 'high', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '3-4 items. Each: **Option** — one-line reasoning. Make each defensible.' },
      { type: 'social-proof', label: 'Community Voice', description: 'A member\'s take or previous discussion highlight.', required: true, order: 5, outputType: 'quote', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: 'Real community member quote or previous discussion highlight.' },
      { type: 'feature-grid', label: 'Ways to Engage', description: '3 specific ways to participate right now.', required: true, order: 6, outputType: 'list', visualPriority: 'medium', layoutStyle: 'grid', emphasisLevel: 'moderate', contentDirectives: '3 items. Each: **Action** — exactly how to participate. Make it frictionless.' },
      { type: 'highlight-card', label: 'The Challenge', description: 'A mini-challenge or task for readers this week.', required: true, order: 7, outputType: 'paragraph', visualPriority: 'medium', layoutStyle: 'card', emphasisLevel: 'moderate', contentDirectives: '2-3 sentences. Specific, achievable challenge. Reply with results.' },
      { type: 'cta', label: 'CTA — Participate Now', description: 'Maximum-frictionless participation CTA.', required: true, order: 8, outputType: 'cta', visualPriority: 'high', layoutStyle: 'banner', emphasisLevel: 'bold', ctaPosition: 'primary', contentDirectives: 'Direct action CTA. e.g. "Reply With Your Vote" or "Take the Challenge".' },
      { type: 'footer', label: 'Community Close', description: 'Warm close with results preview.', required: true, order: 9, outputType: 'paragraph', visualPriority: 'low', layoutStyle: 'list', emphasisLevel: 'subtle', contentDirectives: '2-3 sentences. Thank participants + preview results next issue.' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Lookup Functions
// ---------------------------------------------------------------------------

export function getTemplateForContentType(contentType: string): NewsletterTemplate {
  for (const template of Object.values(NEWSLETTER_TEMPLATES)) {
    if (template.contentTypes.includes(contentType)) {
      return template;
    }
  }
  return NEWSLETTER_TEMPLATES.educational;
}

// ---------------------------------------------------------------------------
// Prompt Guidance Builder
// ---------------------------------------------------------------------------

export function buildTemplatePromptGuidance(template: NewsletterTemplate): string {
  const flowRules = template.flowRules;
  const design = template.design;

  const requiredSections = template.sections
    .filter(s => s.required)
    .map((s, i) => {
      if (s.outputType === 'image') {
        let line = `${i + 1}. type: "image" | role: ${s.label}${s.imageType ? ' | imageType: ' + s.imageType : ''}${s.imageLayout ? ' | layout: ' + s.imageLayout : ''}`;
        if (s.contentDirectives) line += ` | hint: ${s.contentDirectives}`;
        return line;
      }
      const wordLimit = s.outputType === 'heading' ? '6'
        : s.outputType === 'subheading' ? '8'
        : s.outputType === 'cta' ? '6'
        : s.outputType === 'quote' ? '20'
        : s.outputType === 'list' ? '50'
        : String(flowRules.maxParagraphLength);
      const format = s.outputType === 'list'
        ? ' 2-4 items, each: **KeyTerm** — one-line detail, max 10 words/item'
        : s.outputType === 'quote'
        ? ' "Quote text." — Attribution'
        : s.outputType === 'cta'
        ? ' action verb + benefit'
        : s.outputType === 'paragraph'
        ? ' ONE sentence only'
        : '';
      let line = `${i + 1}. type: "${s.outputType}" | max ${wordLimit} words | role: ${s.label}${format ? ' | format: ' + format : ''}`;
      if (s.contentDirectives) {
        line += ` | hint: ${s.contentDirectives}`;
      }
      return line;
    })
    .join('\n');

  const optionalSections = template.sections
    .filter(s => !s.required)
    .map((s, i) => {
      if (s.outputType === 'image') {
        let line = `${template.sections.filter(s2 => s2.required).length + i + 1}. type: "image" | role: ${s.label} (optional)${s.imageType ? ' | imageType: ' + s.imageType : ''}${s.imageLayout ? ' | layout: ' + s.imageLayout : ''}`;
        if (s.contentDirectives) line += ` | hint: ${s.contentDirectives}`;
        return line;
      }
      const wordLimit = s.outputType === 'heading' ? '6'
        : s.outputType === 'subheading' ? '8'
        : s.outputType === 'cta' ? '6'
        : s.outputType === 'quote' ? '20'
        : s.outputType === 'list' ? '50'
        : String(flowRules.maxParagraphLength);
      const format = s.outputType === 'list'
        ? ' 2-4 items, each: **KeyTerm** — one-line detail, max 10 words/item'
        : s.outputType === 'quote'
        ? ' "Quote text." — Attribution'
        : s.outputType === 'cta'
        ? ' action verb + benefit'
        : s.outputType === 'paragraph'
        ? ' ONE sentence only'
        : '';
      let line = `${template.sections.filter(s2 => s2.required).length + i + 1}. type: "${s.outputType}" | max ${wordLimit} words | role: ${s.label} (optional)${format ? ' | format: ' + format : ''}`;
      if (s.contentDirectives) {
        line += ` | hint: ${s.contentDirectives}`;
      }
      return line;
    })
    .join('\n');

  let guidance = `Newsletter type: ${template.name}
Tone: ${design.tone} | Style: ${design.visualStyle} | Mood: ${design.brandingMood}
Min sections: ${flowRules.minSections} | Max sections: ${flowRules.maxSections}
Max words per paragraph: ${flowRules.maxParagraphLength}
CTA style: ${template.ctaStyle}
${template.urgencyBonus ? `Urgency: ${template.urgencyBonus}` : ''}

REQUIRED sections (generate ALL of these — at least ${flowRules.minSections} total):
${requiredSections}`;

  if (optionalSections) {
    guidance += `

RECOMMENDED sections (include ALL to reach ${flowRules.minSections}+ total):
${optionalSections}`;
  }

  guidance += `

RULES:
- ABSOLUTE MINIMUM ${flowRules.minSections} sections. Never output fewer.
- Max ${flowRules.maxParagraphLength} words per paragraph (ONE sentence only), 6 words per heading, 10 words per list item
- Use **bold** for key terms in lists
- Each section = one card. Self-contained. Scannable in 2 seconds.
- Prefer LIST sections over PARAGRAPH sections. At least 2-3 list sections.
- NEVER write long paragraphs. If a thought exceeds ${flowRules.maxParagraphLength} words, split it into a list.
- Every newsletter MUST end with a CTA section.
- If output is too short, ADD more sections to reach ${flowRules.minSections} minimum.
- NEVER output bare questions or one-line sections. Every section must have substance.`;

  return guidance;
}