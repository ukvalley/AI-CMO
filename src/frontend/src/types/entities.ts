/**
 * Entity Type Definitions
 *
 * Type definitions for all business entities in the Mengo platform.
 */

// ============================================
// BASE ENTITY
// ============================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
}

// ============================================
// USER & AUTHENTICATION
// ============================================

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyIds: string[];
  activeCompanyId: string | null;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// COMPANY
// ============================================

export interface Company {
  id: string;
  name: string;
  notificationEmail?: string;
  userIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SOCIAL PROFILES (Shared across multiple modules)
// ============================================

export interface SocialProfiles {
  linkedIn?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  tikTok?: string;
  youTube?: string;
  pinterest?: string;
  threads?: string;
  quora?: string;
  medium?: string;
  reddit?: string;
  telegram?: string;
  whatsApp?: string;
  googleBusiness?: string;
  meetup?: string;
  spotifyPodcast?: string;
  applePodcast?: string;
  website?: string;
  github?: string;
}

// ============================================
// BUSINESS PROFILE
// ============================================

export type BusinessStage = 'idea' | 'mvp' | 'early' | 'growth' | 'scale' | 'established';
export type Industry =
  | 'technology'
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'ecommerce'
  | 'saas'
  | 'consulting'
  | 'manufacturing'
  | 'retail'
  | 'real-estate'
  | 'hospitality'
  | 'media'
  | 'non-profit'
  | 'legal'
  | 'marketing'
  | 'design'
  | 'food-beverage'
  | 'sports'
  | 'other';

export interface BusinessProfile extends BaseEntity {
  // A. Basic Info
  name: string;
  startDate?: string;
  stage: BusinessStage;
  teamSize?: number;

  // B. Overview
  description?: string;
  descriptionLong?: string;
  mission?: string;
  vision?: string;
  coreValues?: string;
  usp?: string;

  // C. Market
  primaryIndustry?: string;
  secondaryIndustries?: string;
  targetGeography?: string;
  businessModel?: 'b2b' | 'b2c' | 'b2b2c' | 'saas' | 'marketplace' | 'd2c' | 'freemium' | 'subscription' | 'hybrid';

  // D. Offer Layer
  primaryOffering?: string;
  secondaryOfferings?: string;
  pricingModel?: string;
  averageTicketSize?: string;

  // E. Financial
  funding?: string;
  revenue?: string;
  isRevenuePublic: boolean;

  // F. Contact
  email?: string;
  phone?: string;
  website?: string;

  // G. Location
  address?: string;
  city?: string;
  country?: string;

  // Legacy fields (keep for backwards compatibility)
  industries: Industry[];
  isFounderPublic: boolean;
  socialProfiles: SocialProfiles;
  mapLinks?: {
    googleMaps?: string;
    appleMaps?: string;
    bingMaps?: string;
    hereMaps?: string;
    openStreetMap?: string;
    what3Words?: string;
  };
}

// ============================================
// FOUNDER
// ============================================

export type ResponsibilityArea = 'vision' | 'tech' | 'sales' | 'marketing' | 'operations' | 'finance' | 'product' | 'hr';

export interface Founder extends BaseEntity {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  workAnniversary?: string;
  expertise?: string[];
  responsibilityArea?: ResponsibilityArea;
  bio?: string;
  socialProfiles: SocialProfiles;
  assets: FounderAsset[];
  // Photos & Media
  photos?: string[];
  driveLink?: string;
}

export type AssetType =
  | 'headshot'
  | 'profilePhoto'
  | 'signature'
  | 'businessCard'
  | 'emailSignature'
  | 'bioPdf'
  | 'resume'
  | 'speakerReel'
  | 'custom';

export interface FounderAsset {
  id: string;
  type: AssetType;
  name: string;
  url?: string;
  base64Data?: string;
  createdAt: string;
}

// ============================================
// EMPLOYEE
// ============================================

export type Department =
  | 'engineering'
  | 'marketing'
  | 'sales'
  | 'design'
  | 'operations'
  | 'hr'
  | 'finance'
  | 'customer-success'
  | 'product'
  | 'legal'
  | 'other';

export type EmployeeLevel =
  | 'intern'
  | 'junior'
  | 'mid'
  | 'senior'
  | 'lead'
  | 'manager'
  | 'director'
  | 'vp'
  | 'c-suite';

export interface Employee extends BaseEntity {
  name: string;
  title?: string;
  department?: Department;
  level?: EmployeeLevel;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  workAnniversary?: string;
  expertise?: string[];
  responsibilityArea?: ResponsibilityArea;
  reportsTo?: string; // Employee ID
  bio?: string;
  socialProfiles: SocialProfiles;
  assets: FounderAsset[];
  // Photos & Media
  photos?: string[];
  driveLink?: string;
}

// ============================================
// PRODUCT
// ============================================

export type ProductStatus = 'active' | 'draft' | 'discontinued';
export type AudienceType = 'b2b' | 'b2c' | 'both';

export interface ProductCategory extends BaseEntity {
  name: string;
  description?: string;
}

export interface Product extends BaseEntity {
  name: string;
  categoryId?: string;
  price?: number;
  status: ProductStatus;
  audienceType: AudienceType;
  usp?: string;
  description?: string;
  features?: string[];
  icpIds: string[];
  personaIds: string[];
  marketingCopy?: string;
  // Media & Resources
  images?: string[];           // Array of image URLs
  catalogPdfUrl?: string;      // PDF catalog URL
  videoUrls?: string[];        // YouTube video URLs
}

// ============================================
// ICP & PERSONA
// ============================================

// ============================================
// ICP & PERSONA FRAMEWORK
// ============================================

export interface ICP extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;

  // A. Firmographics
  industry?: string;
  companySize?: string;
  location?: string;
  revenueRange?: string;
  fundingStage?: 'bootstrapped' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'ipo' | 'enterprise';
  employeeCount?: string;
  yearsInBusiness?: number;

  // B. Technographics
  techStack?: string[];
  toolsUsed?: string[];
  platforms?: string[];

  // C. Behavioral Traits
  buyingProcess?: string;
  decisionTimeframe?: string;
  budgetAuthority?: 'low' | 'medium' | 'high';
  priceSensitivity?: 'low' | 'medium' | 'high';

  // D. Psychographics
  businessGoals?: string[];
  challenges?: string[];
  painPoints?: string[];
  priorities?: string[];

  // E. Activation Criteria
  triggerEvents?: string[];
  fitScore?: number; // 0-100
  priority?: 'low' | 'medium' | 'high';

  // F. Linked Personas
  personaIds?: string[];
}

export interface Persona extends BaseEntity {
  name: string;
  icpId: string;
  isActive?: boolean;

  // A. Demographics
  ageRange?: string;
  gender?: string;
  jobTitle?: string;
  seniorityLevel?: 'entry' | 'mid' | 'senior' | 'c-level' | 'founder';
  department?: string;
  industry?: string;

  // B. Professional Profile
  experience?: string;
  skills?: string[];
  toolsUsed?: string[];
  certifications?: string[];

  // C. Psychographics
  goals?: string[];
  painPoints?: string[];
  motivations?: string[];
  values?: string[];
  fears?: string[];

  // D. Behavioral
  decisionMakingStyle?: 'analytical' | 'intuitive' | 'collaborative' | 'authoritative';
  researchHabits?: string;
  contentPreferences?: string[];
  communicationChannel?: string[];

  // E. Day in the Life
  dailyChallenges?: string[];
  successMetrics?: string[];
  kpi?: string[];

  // F. Buying Behavior
  budgetAuthority?: boolean;
  influenceLevel?: 'low' | 'medium' | 'high';
  buyingRole?: 'champion' | 'decision-maker' | 'influencer' | 'end-user' | 'blocker';

  // G. Bio & Narrative
  bio?: string;
  quote?: string;
  objections?: string[];

  // H. Linked Products
  productIds?: string[];
}

// ============================================
// BRAND
// ============================================

export type FontOption =
  | 'outfit'
  | 'inter'
  | 'roboto'
  | 'poppins'
  | 'montserrat'
  | 'open-sans'
  | 'lato'
  | 'playfair'
  | 'merriweather';

export interface Brand extends BaseEntity {
  // Visual basics
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: FontOption;
  bodyFont: FontOption;
  tagline?: string;
  voice?: string;
  personality?: string;

  // ============================================
  // SOP 1.7 — Brand Identity Direction
  // 13 modules of governance + identity locks
  // ============================================

  // 7.1 Purpose & Meaning
  purposeWhyExists?: string;
  purposeEmotionalProblem?: string;
  purposeForWhom?: string;
  purposeNotForWhom?: string;
  purposeAlignsVision?: boolean;
  purposeAlignsValueProp?: boolean;
  purposeAlignsPositioning?: boolean;
  purposeApprovedByCEO?: boolean;
  purposeApprovedAt?: string;

  // 7.2 Personality
  personalityPrimary?: string[];   // 3 traits
  personalitySecondary?: string[]; // 2 traits
  personalitySpeakStyle?: string;
  personalityUnderPressure?: string;
  personalityApprovedByCEO?: boolean;

  // 7.3 Voice & Tone
  voiceWritingStyle?: string;
  voiceVocabulary?: string;
  voiceSentenceRules?: string;
  voiceWebsiteTone?: string;
  voiceSupportTone?: string;
  voiceSalesTone?: string;
  voiceCrisisTone?: string;
  voiceDos?: string[];
  voiceDonts?: string[];
  voiceExamplePhrases?: string;
  voiceApprovedByCEO?: boolean;
  voiceApprovedByMarketing?: boolean;

  // 7.4 Emotional Positioning & Promise
  emotionalBenefit?: string;
  brandPromise?: string;
  promiseBelievable?: boolean;
  promiseDefensible?: boolean;
  promiseDeliverable?: boolean;
  triggerTrust?: string;
  triggerConfidence?: string;
  triggerRelief?: string;
  triggerEmpowerment?: string;
  emotionalApprovedByCEO?: boolean;

  // 7.5 Visual Direction (Conceptual)
  visualTheme?: 'minimal' | 'bold' | 'elegant' | 'technical';
  visualEra?: 'traditional' | 'modern' | 'hybrid';
  visualColourPsychology?: string;
  visualTypography?: string;
  visualImageryStyle?: string;
  visualInspirationLinks?: string[];
  visualApprovedByCEO?: boolean;

  // 7.6 Differentiation Anchors
  diffCompetitorVisualGap?: string;
  diffCompetitorMessagingGap?: string;
  diffBrandSymbols?: string[];
  diffSignatureExpressions?: string[];
  diffLockedElements?: string[];
  diffApprovedByCEO?: boolean;

  // 7.7 Consistency Guardrails
  guardCannotChange?: string;
  guardCanEvolve?: string;
  guardMisuseExamples?: string;
  guardApprovalWorkflow?: string;
  guardCultureAlignment?: string;
  guardApprovedByCEO?: boolean;

  // 7.8 Internal Brand Alignment
  alignTrainingModules?: string;
  alignOnboardingChecklist?: BrandChecklistItem[];
  alignPerformanceMetrics?: string;
  alignLeadershipChecklist?: BrandChecklistItem[];
  alignApprovedByHR?: boolean;
  alignApprovedByCEO?: boolean;

  // 7.9 Validation & Stress Test
  validCustomerFeedback?: string;
  validInternalFeedback?: string;
  validNeutralFeedback?: string;
  validScalability?: number;        // 1-10
  validCulturalSensitivity?: number; // 1-10
  validLongevity?: number;          // 1-10
  validFinalLockByCEO?: boolean;
  validLockedAt?: string;

  // M11 Rules Enforcement Engine
  rulesVoiceForbiddenWords?: string[];
  rulesDesignForbiddenPatterns?: string[];

  // M12 Approval Workflow log
  approvalLog?: BrandApprovalEntry[];

  // M10 Master Document
  masterDocVersion?: number;
  masterDocLockedAt?: string;
}

export interface BrandChecklistItem {
  id: string;
  item: string;
  done: boolean;
}

export type BrandApproverRole =
  | 'CEO'
  | 'Brand Strategist'
  | 'Marketing Head'
  | 'Product Head'
  | 'HR Lead';

export interface BrandApprovalEntry {
  id: string;
  role: BrandApproverRole;
  approver: string;
  section: string;
  timestamp: string;
  notes?: string;
}

// ============================================
// WEBSITE PROJECT (28-module tracker for /website-content)
// ============================================

/** Generic per-section data — every section uses the same shape so we can render
 *  forms config-driven rather than 28 hand-rolled components. */
export interface WebsiteSectionData {
  /** Map of fieldKey → primitive value (string | string[] | boolean | number) */
  [fieldKey: string]: string | string[] | boolean | number | undefined;
}

export type WebsiteSectionStatus =
  | 'not-started'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'blocked';

export interface WebsiteSectionState {
  /** Form values, indexed by field key (defined in the section config) */
  data?: WebsiteSectionData;
  status?: WebsiteSectionStatus;
  approved?: boolean;
  approvedAt?: string;
  notes?: string;
}

export interface WebsiteProject extends BaseEntity {
  /** Free-text project name */
  name?: string;
  /** Optional client / company hint */
  client?: string;
  /** Map of sectionId → state. We use a plain map so adding new sections
   *  doesn't require updating the type. */
  sections?: Record<string, WebsiteSectionState>;
  /** Reuses the brand approval entry shape */
  approvalLog?: BrandApprovalEntry[];
  /** Master document generation */
  masterDocVersion?: number;
  masterDocLockedAt?: string;
}

// ============================================
// BLOG SYSTEM (20-module tracker for /blogs)
// Reuses the WebsiteSection* shapes — same data primitives.
// ============================================

export interface BlogSystem extends BaseEntity {
  name?: string;
  client?: string;
  sections?: Record<string, WebsiteSectionState>;
  approvalLog?: BrandApprovalEntry[];
  masterDocVersion?: number;
  masterDocLockedAt?: string;
}

// ============================================
// LANDING PAGE SYSTEM (19-module tracker for /landing-pages)
// ============================================

export interface LandingPageSystem extends BaseEntity {
  name?: string;
  client?: string;
  sections?: Record<string, WebsiteSectionState>;
  approvalLog?: BrandApprovalEntry[];
  masterDocVersion?: number;
  masterDocLockedAt?: string;
}

// ============================================
// HR & JOBS SYSTEM (18-module tracker for /hr-jobs)
// ============================================

export interface HrSystem extends BaseEntity {
  name?: string;
  client?: string;
  sections?: Record<string, WebsiteSectionState>;
  approvalLog?: BrandApprovalEntry[];
  masterDocVersion?: number;
  masterDocLockedAt?: string;
}

// ============================================
// SEO SYSTEM (15-module tracker for /seo)
// ============================================

export interface SeoSystem extends BaseEntity {
  name?: string;
  client?: string;
  sections?: Record<string, WebsiteSectionState>;
  approvalLog?: BrandApprovalEntry[];
  masterDocVersion?: number;
  masterDocLockedAt?: string;
}

// ============================================
// BRAND ASSETS
// ============================================

export type BrandAssetType =
  | 'logo'
  | 'logo-icon'
  | 'favicon'
  | 'logoMarkLight'
  | 'logoMarkDark'
  | 'logoHorizontal'
  | 'logoVertical'
  | 'logoIconOnly'
  | 'social-og'
  | 'social-twitter'
  | 'social-linkedin'
  | 'social-instagram'
  | 'social-facebook'
  | 'social-tiktok'
  | 'social-youtube'
  | 'email-header'
  | 'email-footer'
  | 'presentation'
  | 'document'
  | 'web-banner'
  | 'app-icon'
  | 'brandPattern'
  | 'backgroundImage'
  | 'watermark'
  | 'other'
  | 'custom';

export type AssetStatus = 'pending' | 'uploaded' | 'approved';

export interface BrandAsset extends BaseEntity {
  name: string;
  type: BrandAssetType;
  description?: string;
  url?: string; // CDN/External URL or base64 data URL
  sourceUrl?: string; // Canva, Figma, design file URL
  base64Data?: string; // base64 for uploaded files (matches backend)
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  status: AssetStatus;
  designBrief?: string;
  isPrimary?: boolean;
  source?: 'upload' | 'url';
  tags?: string[];
  dimensions?: {
    width?: number;
    height?: number;
  };
  format?: string;
}

// ============================================
// STATIONERY
// ============================================

// Core Stationery (Must Have)
export type CoreStationeryType =
  | 'business-card'
  | 'letterhead'
  | 'envelope-a4'
  | 'envelope-dl'
  | 'email-signature'
  | 'presentation-template';

// Office Use Assets
export type OfficeAssetsType =
  | 'invoice-template'
  | 'quotation-template'
  | 'receipt-design'
  | 'purchase-order'
  | 'billing-format'
  | 'proposal-template';

// Packaging Stationery
export type PackagingStationeryType =
  | 'thank-you-card'
  | 'warranty-card'
  | 'instruction-manual'
  | 'product-insert-card'
  | 'branded-stickers'
  | 'packaging-tape';

// Print Stationery
export type PrintStationeryType =
  | 'stamps'
  | 'branding-print'
  | 'standees-print'
  | 'booth-designs'
  | 't-shirts';

// Marketing Assets
export type MarketingAssetsType =
  | 'newsletter-template'
  | 'brochure-pdf'
  | 'pitch-deck'
  | 'tagline'
  | 'hook-style'
  | 'standees-marketing'
  | 'marketing-collateral';

// Legacy/Other types
export type OtherStationeryType =
  | 'envelope'
  | 'memo-pad'
  | 'folder'
  | 'compliment-slip'
  | 'other';

// Combined Stationery Type
export type StationeryType =
  | CoreStationeryType
  | OfficeAssetsType
  | PackagingStationeryType
  | PrintStationeryType
  | MarketingAssetsType
  | OtherStationeryType;

export type StationeryStatus = 'draft' | 'approved' | 'archived';

export interface Stationery extends BaseEntity {
  name: string;
  type: StationeryType;
  description?: string;
  templateUrl?: string; // URL to the template file or base64
  previewImageUrl?: string; // URL to preview image or base64
  sourceUrl?: string; // Canva, Figma, design file URL
  base64Data?: string; // Uploaded file as base64
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  dimensions?: {
    width?: number;
    height?: number;
    unit?: 'mm' | 'in' | 'px';
  };
  status: StationeryStatus;
  approvedBy?: string;
  approvedAt?: string;
  tags?: string[];
  designBrief?: string;
}

// ============================================
// HR ASSETS
// ============================================

// Desk & Office Items
export type DeskOfficeAssetType =
  | 'notepad'
  | 'diary-planner'
  | 'file-folder'
  | 'document-folder'
  | 'pen-branding'
  | 'desk-name-plate';

// Legal / Formal Documents
export type LegalDocumentAssetType =
  | 'nda'
  | 'terms-conditions'
  | 'policy-documents'
  | 'employment-contract'
  | 'service-agreement';

// Internal Office Branding
export type InternalBrandingAssetType =
  | 'id-card-front'
  | 'id-card-back'
  | 'lanyard-design'
  | 'employee-badge'
  | 'attendance-sheet'
  | 'internal-memo'
  | 'visiting-card';

// Letters
export type LetterAssetType =
  | 'offer-letter'
  | 'relieving-letter'
  | 'increment-letter'
  | 'termination-letter'
  | 'experience-letter'
  | 'appointment-letter'
  | 'promotion-letter'
  | 'warning-letter';

// Leave Forms
export type LeaveFormAssetType =
  | 'full-day-leave'
  | 'short-leave'
  | 'half-day-leave'
  | 'maternity-leave'
  | 'paternity-leave'
  | 'medical-leave'
  | 'annual-leave';

// Certifications
export type CertificationAssetType =
  | 'experience-certificate'
  | 'training-certificate'
  | 'appreciation-certificate'
  | 'completion-certificate'
  | 'internship-certificate';

// Folders
export type FolderAssetType =
  | 'employee-document-folder'
  | 'onboarding-folder'
  | 'exit-folder'
  | 'performance-folder';

// Recruitment
export type RecruitmentAssetType =
  | 'job-description'
  | 'job-posting-template'
  | 'interview-evaluation-form'
  | 'candidate-scorecard'
  | 'offer-letter-template'
  | 'rejection-letter';

// Onboarding
export type OnboardingAssetType =
  | 'welcome-kit'
  | 'onboarding-checklist'
  | 'orientation-presentation'
  | 'handbook'
  | 'code-of-conduct';

// Performance Management
export type PerformanceAssetType =
  | 'appraisal-form'
  | 'kpi-template'
  | 'goal-setting-form'
  | 'feedback-form'
  | 'pip-template';

// Exit / Offboarding
export type ExitAssetType =
  | 'exit-checklist'
  | 'handover-form'
  | 'exit-interview-form'
  | 'clearance-certificate';

// Combined HR Asset Type
export type HRAssetType =
  | DeskOfficeAssetType
  | LegalDocumentAssetType
  | InternalBrandingAssetType
  | LetterAssetType
  | LeaveFormAssetType
  | CertificationAssetType
  | FolderAssetType
  | RecruitmentAssetType
  | OnboardingAssetType
  | PerformanceAssetType
  | ExitAssetType
  | 'other';

export type HRAssetCategory =
  | 'desk-office'
  | 'legal-documents'
  | 'internal-branding'
  | 'letters'
  | 'leave-forms'
  | 'certifications'
  | 'folders'
  | 'recruitment'
  | 'onboarding'
  | 'performance'
  | 'exit'
  | 'other';

export type HRAssetStatus = 'draft' | 'approved' | 'archived';

export interface HRAsset extends BaseEntity {
  name: string;
  type: HRAssetType;
  category: HRAssetCategory;
  description?: string;
  templateUrl?: string;
  previewImageUrl?: string;
  sourceUrl?: string;
  base64Data?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  dimensions?: {
    width?: number;
    height?: number;
    unit?: 'mm' | 'in' | 'px';
  };
  status: HRAssetStatus;
  approvedBy?: string;
  approvedAt?: string;
  tags?: string[];
  // HR-specific fields
  department?: string;
  applicableFor?: string[];
  validFrom?: string;
  validUntil?: string;
  version?: string;
}

// ============================================
// WEBSITE CONTENT
// ============================================

export type PageType =
  | 'home'
  | 'about'
  | 'features'
  | 'solutions'
  | 'how-it-works'
  | 'pricing'
  | 'contact'
  | 'blog'
  | 'footer'
  | 'terms'
  | 'privacy'
  | 'careers'
  | 'team'
  | 'partners'
  | 'custom';

export type PageStatus = 'draft' | 'writing' | 'review' | 'proofread' | 'seo-check' | 'published';

export interface WebsitePage extends BaseEntity {
  name: string;
  type: PageType;
  seoTitle?: string;
  metaDescription?: string;
  h1?: string;
  mainHeadline?: string;
  subHeadline?: string;
  content?: string;
  ctaText?: string;
  status: PageStatus;
}

// ============================================
// BLOG
// ============================================

export type BlogCategory =
  | 'industry-insights'
  | 'how-to'
  | 'case-study'
  | 'thought-leadership'
  | 'product-updates'
  | 'company-news'
  | 'tutorials'
  | 'opinion'
  | 'research'
  | 'interview';

export type BlogStatus = 'idea' | 'outline' | 'draft' | 'review' | 'proofread' | 'published';

export interface Blog extends BaseEntity {
  title: string;
  category: BlogCategory;
  authorId?: string; // Founder or Employee ID
  authorType?: 'founder' | 'employee';
  productId?: string;
  seoKeyword?: string;
  wordCount: number;
  outline?: string;
  content?: string;
  status: BlogStatus;
}

// ============================================
// NEWSLETTER
// ============================================

export type NewsletterCategory =
  | 'welcome'
  | 'engagement'
  | 'content-promotion'
  | 'offers-promos'
  | 'product-updates'
  | 'company-news'
  | 'industry-insights'
  | 'seasonal'
  | 'custom';

export type NewsletterType = 'common' | 'unique';
export type NewsletterFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';

export interface Newsletter extends BaseEntity {
  name: string;
  category: NewsletterCategory;
  type: NewsletterType;
  frequency: NewsletterFrequency;
  audience?: string;
  productId?: string;
  subjectLine?: string;
  previewText?: string;
  content?: string;
  recipientCount?: number;
  openCount?: number;
  clickCount?: number;
}

// ============================================
// FAQ
// ============================================

export type FAQCategory =
  | 'general'
  | 'product-specific'
  | 'billing-subscription'
  | 'technical-troubleshooting'
  | 'security-privacy'
  | 'feature-based'
  | 'competitor-comparison'
  | 'custom';

export interface FAQ extends BaseEntity {
  question: string;
  answer?: string;
  category: FAQCategory;
  productId?: string;
  order: number;
}

// ============================================
// CONTENT LIBRARY
// ============================================

export type ContentProfileType = 'business' | 'founder' | 'employee';

export type ContentPlatform =
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'pinterest'
  | 'threads'
  | 'quora'
  | 'medium'
  | 'reddit'
  | 'telegram'
  | 'whatsapp'
  | 'newsletter'
  | 'podcast'
  | 'blog'
  | 'website'
  | 'email'
  | 'sms'
  | 'push'
  | 'custom';

export type ContentStatus = 'draft' | 'approved' | 'published' | 'scheduled';

export interface ContentItem extends BaseEntity {
  profileType: ContentProfileType;
  profileId?: string;
  platform: ContentPlatform;
  scheduledDate?: string;
  title?: string;
  hook?: string;
  content: string;
  hashtags?: string[];
  cta?: string;
  status: ContentStatus;
}

// ============================================
// LANDING PAGE
// ============================================

export type LandingPageFramework = 'brunson' | 'hormozi' | 'ogilvy' | 'storybrand';

export interface LandingPage extends BaseEntity {
  name: string;
  framework: LandingPageFramework;
  productId?: string;
  icpIds: string[];
  audienceType: AudienceType;
  headline?: string;
  subHeadline?: string;
  ctaText?: string;
  content?: string;
}

// ============================================
// BANNER
// ============================================

export type BannerType =
  | 'promotional'
  | 'discount'
  | 'limited-time'
  | 'seasonal'
  | 'product'
  | 'event'
  | 'brand'
  | 'custom';

export type BannerPlatform =
  | 'website'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'google-display'
  | 'youtube'
  | 'twitter'
  | 'email';

export type BannerDimension = '1200x628' | '1080x1080' | '1920x1080' | '728x90' | '300x250' | 'custom';

export interface Banner extends BaseEntity {
  name: string;
  type: BannerType;
  platform: BannerPlatform;
  dimension: BannerDimension;
  headline?: string;
  subtext?: string;
  cta?: string;
  designBrief?: string;
}

// ============================================
// VIDEO CONTENT
// ============================================

export type VideoType =
  | 'explainer'
  | 'demo'
  | 'testimonial'
  | 'bts'
  | 'webinar'
  | 'qa'
  | 'reel'
  | 'tutorial'
  | 'announcement'
  | 'podcast'
  | 'audiobook';

export type VideoPlatform =
  | 'youtube'
  | 'instagram-reels'
  | 'tiktok'
  | 'linkedin'
  | 'facebook'
  | 'website';

export type VideoDuration = '15s' | '30s' | '60s' | '3min' | '5min' | '10min' | '30min' | '60min' | '60min+';

export interface VideoContent extends BaseEntity {
  name: string;
  type: VideoType;
  platform: VideoPlatform;
  duration: VideoDuration;
  script?: string;
  shotList?: string;
}

// ============================================
// STORIES & CAMPAIGNS
// ============================================

export type StoryType =
  | 'brand-story'
  | 'customer-success'
  | 'product-story'
  | 'employee-culture'
  | 'campaign'
  | 'ugc'
  | 'founder-story'
  | 'impact-csr';

export type StoryStatus = 'draft' | 'review' | 'approved' | 'live';

export interface StoryCampaign extends BaseEntity {
  name: string;
  type: StoryType;
  platforms: ContentPlatform[];
  content?: string;
  status: StoryStatus;
}

// ============================================
// SALES SCRIPTS
// ============================================

export type SalesScriptType =
  | 'sales'
  | 'cold-call'
  | 'follow-up'
  | 'objection-handling'
  | 'demo'
  | 'upsell'
  | 'closing';

export interface SalesScript extends BaseEntity {
  name: string;
  type: SalesScriptType;
  productId?: string;
  icpIds: string[];
  script?: string;
}

// ============================================
// SALES COLLATERAL
// ============================================

export type CollateralType =
  | 'one-pager'
  | 'brochure'
  | 'company-profile'
  | 'media-kit'
  | 'case-study'
  | 'whitepaper'
  | 'datasheet'
  | 'proposal';

export interface SalesCollateral extends BaseEntity {
  name: string;
  type: CollateralType;
  productId?: string;
  icpIds: string[];
  designBrief?: string;
}

// ============================================
// BOOKS
// ============================================

export type BookFormat = 'print' | 'ebook' | 'audiobook' | 'both';
export type BookStatus = 'outline' | 'approved' | 'writing' | 'review' | 'published';

export interface Book extends BaseEntity {
  title: string;
  topic?: string;
  audience?: string;
  chaptersCount: number;
  isbn?: string;
  format: BookFormat;
  preface?: string;
  authorBio?: string;
  coverBrief?: string;
  outline?: string;
  content?: string;
  audiobookScript?: string;
  status: BookStatus;
}

// ============================================
// COURSES
// ============================================

export type CourseFormat = 'video' | 'text' | 'live' | 'hybrid' | 'workshop';
export type CourseStatus = 'outline' | 'approved' | 'writing' | 'review' | 'published';

export interface Course extends BaseEntity {
  name: string;
  format: CourseFormat;
  modulesCount: number;
  price?: number;
  curriculum?: string;
  content?: string;
  status: CourseStatus;
}

// ============================================
// SEO
// ============================================

export type SEOStatus = 'draft' | 'optimized' | 'published';

export interface SEOPage extends BaseEntity {
  pageName: string;
  url?: string;
  primaryKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  h1?: string;
  checklist?: string;
  status: SEOStatus;
}

// ============================================
// ADS
// ============================================

export type AdPlatform =
  | 'google'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'youtube';

export type AdObjective = 'awareness' | 'traffic' | 'leads' | 'conversions';

export interface Ad extends BaseEntity {
  name: string;
  platform: AdPlatform;
  objective: AdObjective;
  budget?: number;
  copyBrief?: string;
}

// ============================================
// PR
// ============================================

export type PRType =
  | 'press-release'
  | 'media-pitch'
  | 'influencer-brief'
  | 'podcast-guest-pitch'
  | 'award-application';

export type PRStatus = 'draft' | 'generated' | 'sent' | 'published';

export interface PRItem extends BaseEntity {
  name: string;
  type: PRType;
  targetMedia?: string;
  content?: string;
  status: PRStatus;
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export type EmailTemplateType = 'transactional' | 'marketing' | 'sequence' | 'lifecycle';

export type EmailCategory =
  | 'welcome'
  | 'password-reset'
  | 'invoice'
  | 'order-updates'
  | 're-engagement'
  | 'win-back'
  | 'referral'
  | 'seasonal'
  | 'offer-promo'
  | 'cross-marketing'
  | 'onboarding'
  | 'feedback-request'
  | 'cancellation'
  | 'renewal'
  | 'upgrade'
  | 'announcement'
  | 'newsletter'
  | 'event'
  | 'thank-you'
  | 'custom';

export interface EmailTemplate extends BaseEntity {
  name: string;
  type: EmailTemplateType;
  category: EmailCategory;
  subjectLine?: string;
  previewText?: string;
  body?: string;
}

// ============================================
// LOYALTY PROGRAMME
// ============================================

export type LoyaltyType = 'points-based' | 'tiered' | 'cashback' | 'punch-card' | 'coalition' | 'hybrid' | 'custom';

export interface LoyaltyProgramme extends BaseEntity {
  name: string;
  type: LoyaltyType;
  tiers?: string;
  earnRules?: string;
  redeemRules?: string;
  benefitsPerTier?: string;
  termsConditions?: string;
  fullDocument?: string;
}

// ============================================
// MEMBERSHIP PLANS
// ============================================

export type MembershipType = 'free' | 'basic' | 'standard' | 'premium' | 'enterprise' | 'vip' | 'lifetime' | 'custom';
export type BillingCycle = 'monthly' | 'quarterly' | 'annual' | 'one-time';

export interface MembershipPlan extends BaseEntity {
  name: string;
  type: MembershipType;
  price?: number;
  billingCycle: BillingCycle;
  benefits?: string;
  limitations?: string;
  onboardingFlow?: string;
  terms?: string;
  fullDocument?: string;
}

// ============================================
// REFERRAL PROGRAMME
// ============================================

export type ReferralRewardType = 'cash' | 'credit' | 'discount' | 'free-month' | 'gift' | 'points' | 'tiered' | 'custom';

export interface ReferralProgramme extends BaseEntity {
  name: string;
  rewardType: ReferralRewardType;
  referrerReward?: string;
  refereeReward?: string;
  mechanics?: string;
  fullDocument?: string;
}

// ============================================
// TESTIMONIALS
// ============================================

export type TestimonialType = 'written' | 'video' | 'case-study' | 'success-story' | 'review' | 'quote';
export type TestimonialStatus = 'draft' | 'approved' | 'published';

export interface Testimonial extends BaseEntity {
  name: string;
  type: TestimonialType;
  productId?: string;
  industry?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  keyQuote?: string;
  caseStudy?: string;
  status: TestimonialStatus;
}

// ============================================
// HR/JOBS
// ============================================

export interface JobPosting extends BaseEntity {
  title: string;
  department?: Department;
  level?: EmployeeLevel;
  salary?: string;
  skills?: string[];
  description?: string;
}

// ============================================
// COMPETITORS
// ============================================

export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';
export type MarketPosition = 'leader' | 'challenger' | 'follower' | 'niche';
export type CompetitorType = 'direct' | 'indirect' | 'potential' | 'replacement';
export type PricingStrategy = 'premium' | 'competitive' | 'economy' | 'freemium' | 'unknown';

export interface Competitor extends BaseEntity {
  name: string;
  isActive: boolean;

  // A. Basic Information
  website?: string;
  logoUrl?: string;
  foundedYear?: number;
  headquarters?: string;
  companySize?: string;
  fundingStage?: string;
  fundingRaised?: string;
  employeeCount?: number;
  revenueEstimate?: string;

  // B. Market Position
  competitorType: CompetitorType;
  threatLevel: ThreatLevel;
  marketPosition: MarketPosition;
  marketShare?: string;
  geographicReach?: string[];
  targetAudience?: string;
  industriesServed?: string[];

  // C. Product Analysis
  primaryProduct?: string;
  productCategories?: string[];
  keyFeatures?: string[];
  pricingStrategy?: PricingStrategy;
  pricingDetails?: string;
  freeTrial?: boolean;
  demoAvailable?: boolean;

  // D. Value Proposition
  valueProposition?: string;
  tagline?: string;
  messaging?: string;
  differentiators?: string[];

  // E. Marketing Intelligence
  marketingChannels?: string[];
  contentStrategy?: string;
  seoKeywords?: string[];
  socialMediaPresence?: Record<string, string>;
  adSpendEstimate?: string;

  // F. Strengths & Weaknesses
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];

  // G. Strategic Analysis
  swotSummary?: string;
  ourAdvantages?: string[];
  ourVulnerabilities?: string[];
  recommendedStrategy?: string;
  battlecards?: string;

  // H. Competitive Intelligence
  recentNews?: string[];
  productUpdates?: string[];
  pricingChanges?: string[];
  screenshots?: string[];
  notes?: string;

  // I. Comparison Data
  featureComparison?: Record<string, boolean>;
  priceComparison?: Record<string, unknown>;
}

// ============================================
// SOPs
// ============================================

export interface SOP extends BaseEntity {
  name: string;
  department?: Department;
  procedure?: string;
}

// ============================================
// EVENTS
// ============================================

export type EventType = 'webinar' | 'workshop' | 'conference' | 'meetup' | 'demo-day';

export interface Event extends BaseEntity {
  name: string;
  type: EventType;
  date?: string;
  goals?: string;
  eventPlan?: string;
}

// ============================================
// LEGAL DOCUMENTS
// ============================================

export type LegalDocType =
  | 'terms-of-service'
  | 'privacy-policy'
  | 'cookie-policy'
  | 'nda'
  | 'refund-policy'
  | 'shipping-policy'
  | 'employment-contract'
  | 'gdpr'
  | 'compliance';

export type LegalCountry =
  | 'india'
  | 'uae'
  | 'us'
  | 'uk'
  | 'eu'
  | 'singapore'
  | 'australia'
  | 'canada'
  | 'global';

export type LegalDocStatus = 'draft' | 'generated' | 'approved' | 'active';

export interface LegalDocument extends BaseEntity {
  name: string;
  type: LegalDocType;
  country: LegalCountry;
  content?: string;
  status: LegalDocStatus;
}

// ============================================
// AI GENERATED CONTENT
// ============================================

export interface GeneratedContent extends BaseEntity {
  moduleId: string;
  itemId: string;
  fieldName: string;
  content: string;
  prompt: string;
  model: string;
  tokensUsed?: number;
}

// ============================================
// BACKGROUND TASKS
// ============================================

export type TaskStatus = 'running' | 'completed' | 'failed' | 'cancelled';

export interface BackgroundTask extends BaseEntity {
  name: string;
  moduleId: string;
  totalItems: number;
  completedItems: number;
  status: TaskStatus;
  results: TaskResult[];
  error?: string;
}

export interface TaskResult {
  batchIndex: number;
  items: string[];
  status: TaskStatus;
  error?: string;
  completedAt?: string;
}

// ============================================
// AI CHAT
// ============================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  moduleId?: string;
  context?: Record<string, unknown>;
}

export interface ChatSession {
  id: string;
  companyId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}
