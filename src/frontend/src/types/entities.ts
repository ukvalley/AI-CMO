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
// FAQ BANK
// ============================================

export type FAQCategoryType =
  | 'general'
  | 'product'
  | 'service'
  | 'pricing'
  | 'technical'
  | 'support'
  | 'billing'
  | 'onboarding'
  | 'legal'
  | 'hr'
  | 'sop'
  | 'custom';

export type FAQType =
  | 'customer'
  | 'sales'
  | 'technical'
  | 'internal'
  | 'ai-training'
  | 'website'
  | 'blog'
  | 'newsletter'
  | 'support'
  | 'onboarding'
  | 'legal'
  | 'hr'
  | 'sop';

export type FAQStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';
export type FAQPriority = 'low' | 'medium' | 'high' | 'critical';
export type FAQAudienceType = 'public' | 'internal' | 'team-specific' | 'department-specific' | 'admin-only';
export type FAQFunnelStage = 'tofu' | 'mofu' | 'bofu' | 'post-sale' | 'general';
export type FAQSearchIntent = 'informational' | 'navigational' | 'transactional' | 'commercial';

export interface FAQCategoryItem extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  icon?: string;
  colour?: string;
  order: number;
  faqCount: number;
  isActive: boolean;
}

export interface FAQMediaAttachment {
  url: string;
  type: string;
  description?: string;
}

export interface FAQ extends BaseEntity {
  // Core Content
  title: string;
  question: string;
  answer: string;
  shortAnswer?: string;
  detailedAnswer?: string;

  // Classification
  categoryId?: string;
  subcategoryId?: string;
  faqType: FAQType;
  tags: string[];

  // Status & Workflow
  status: FAQStatus;
  priority: FAQPriority;
  order: number;

  // Audience & Funnel
  audienceType: FAQAudienceType;
  funnelStage: FAQFunnelStage;
  department?: string;

  // Product/Service Mapping
  productId?: string;
  serviceIds?: string[];

  // SEO
  seoKeywords?: string[];
  searchIntent?: FAQSearchIntent;
  metaTitle?: string;
  metaDescription?: string;
  schemaEnabled: boolean;
  voiceSearchOptimised: boolean;

  // AI Readiness
  aiContextWeight: number;
  aiPriority: FAQPriority;
  aiSuggestedUsage?: string;
  searchRelevance: number;

  // Relationships
  parentFaqId?: string;
  relatedFaqIds: string[];
  clusterId?: string;

  // Media & References
  referenceLinks?: string[];
  mediaAttachments?: FAQMediaAttachment[];
  documentUrls?: string[];

  // Usage Tracking
  usedIn: string[];
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;

  // Approval & Versioning
  version: number;
  approvedBy?: string;
  approvedAt?: string;
  reviewNotes?: string;
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
// LANDING PAGE OPERATING SYSTEM
// ============================================

export type LandingPageFramework = 'brunson' | 'hormozi' | 'ogilvy' | 'storybrand' | 'custom';

export type LandingPageType =
  | 'lead-generation'
  | 'product'
  | 'service'
  | 'saas'
  | 'webinar'
  | 'event'
  | 'app-download'
  | 'sales'
  | 'long-form-sales'
  | 'course'
  | 'founder-brand'
  | 'employee-portfolio'
  | 'consultation-booking'
  | 'demo-booking'
  | 'offer'
  | 'discount-campaign'
  | 'launch'
  | 'waitlist'
  | 'recruitment'
  | 'affiliate'
  | 'referral'
  | 'case-study'
  | 'industry-specific'
  | 'location-based';

export type LandingPageGoal =
  | 'lead-generation'
  | 'demo-booking'
  | 'call-booking'
  | 'product-purchase'
  | 'webinar-registration'
  | 'whatsapp-lead'
  | 'form-submission'
  | 'download'
  | 'consultation-booking'
  | 'email-collection';

export type LandingPageStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

export type LandingPageTrafficSource =
  | 'facebook-ads'
  | 'google-ads'
  | 'seo'
  | 'email'
  | 'social-organic'
  | 'affiliate'
  | 'direct'
  | 'referral';

export type LandingPageSectionType =
  | 'hero'
  | 'sticky-cta'
  | 'floating-cta'
  | 'lead-form'
  | 'multi-step-form'
  | 'exit-intent'
  | 'testimonials'
  | 'video-testimonials'
  | 'case-studies'
  | 'client-logos'
  | 'ratings-reviews'
  | 'certifications'
  | 'media-mentions'
  | 'pain-points'
  | 'problem-amplification'
  | 'solution-explanation'
  | 'before-after'
  | 'transformation-journey'
  | 'pricing'
  | 'offer-breakdown'
  | 'bonuses'
  | 'limited-offer'
  | 'scarcity'
  | 'guarantee'
  | 'risk-reversal'
  | 'features'
  | 'benefits'
  | 'comparison-table'
  | 'how-it-works'
  | 'process-explanation'
  | 'faqs'
  | 'industry-insights'
  | 'founder-story'
  | 'team'
  | 'mission'
  | 'expertise'
  | 'achievements'
  | 'social-proof'
  | 'interactive-faqs'
  | 'timeline'
  | 'statistics'
  | 'video-block'
  | 'demo-video'
  | 'product-walkthrough'
  | 'cta-section'
  | 'custom';

export interface LandingPageSection {
  id: string;
  type: LandingPageSectionType;
  name: string;
  enabled: boolean;
  order: number;
  headline?: string;
  subheadline?: string;
  description?: string;
  cta?: string;
  media?: string[];
  icons?: string[];
  bulletPoints?: string[];
  trustStatements?: string[];
  seoNotes?: string;
  aiPrompt?: string;
  uiNotes?: string;
  conversionNotes?: string;
}

export interface LandingPageComment {
  id: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface LandingPageActivity {
  id: string;
  action: string;
  userName: string;
  createdAt: string;
}

export interface LandingPage extends BaseEntity {
  name: string;
  description?: string;
  pageType: LandingPageType;
  primaryGoal: LandingPageGoal;
  secondaryGoal?: LandingPageGoal;
  conversionGoal?: string;
  funnelStage: FunnelStage;
  ctaGoal?: string;
  framework?: LandingPageFramework;
  trafficSource?: LandingPageTrafficSource;
  linkedData: {
    brandId?: string;
    businessProfileId?: string;
    productIds?: string[];
    serviceIds?: string[];
    founderIds?: string[];
    employeeIds?: string[];
    icpIds?: string[];
    personaIds?: string[];
    competitorIds?: string[];
    campaignIds?: string[];
  };
  headline?: string;
  subHeadline?: string;
  ctaText?: string;
  content?: string;
  sections: LandingPageSection[];
  seoKeywords?: string[];
  searchIntent?: string;
  metaTitle?: string;
  metaDescription?: string;
  imageUrls?: string[];
  videoUrls?: string[];
  figmaLink?: string;
  canvaLink?: string;
  designReferences?: string[];
  competitorReferences?: string[];
  status: LandingPageStatus;
  version: number;
  comments?: LandingPageComment[];
  activityLog?: LandingPageActivity[];
  aiPrompt?: string;
  // Backwards compatibility
  productId?: string;
  icpIdsLegacy?: string[];
  audienceType?: AudienceType;
}

export interface LandingPageTemplate extends BaseEntity {
  name: string;
  description?: string;
  pageType: LandingPageType;
  sections: LandingPageSection[];
  prefillData?: Partial<LandingPage>;
}

export interface LandingPageExport extends BaseEntity {
  landingPageId: string;
  format: ExportFormat;
  content: string;
  fileName: string;
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
  | 'educational'
  | 'product-demo'
  | 'service-walkthrough'
  | 'sop-video'
  | 'company-policy'
  | 'hr-training'
  | 'technical-tutorial'
  | 'sales-training'
  | 'founder-message'
  | 'customer-onboarding'
  | 'webinar-recording'
  | 'team-training'
  | 'interview'
  | 'feature-update'
  | 'marketing-strategy'
  | 'internal-communication'
  | 'compliance-training'
  | 'support-tutorial';

export type VideoCategory =
  | 'product-training'
  | 'service-training'
  | 'educational'
  | 'company-policies'
  | 'hr-training'
  | 'sop-videos'
  | 'sales-training'
  | 'technical-tutorials'
  | 'customer-support'
  | 'founder-sessions'
  | 'team-onboarding'
  | 'compliance'
  | 'marketing-training'
  | 'crm-training'
  | 'software-tutorials'
  | 'internal-meetings'
  | 'webinar-recordings'
  | 'client-training'
  | 'knowledge-sharing';

export type VideoStatus = 'draft' | 'approved' | 'archived';

export type VideoSource = 'youtube' | 'vimeo' | 'loom' | 'google-drive' | 'dropbox' | 'wistia' | 'internal-cdn' | 'other';

export type VideoAccessLevel = 'public' | 'team' | 'department' | 'manager-only' | 'hr-only';

export type WatchStatus = 'unwatched' | 'in-progress' | 'watched' | 'completed';

export type LearningPathStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface VideoContent extends BaseEntity {
  name: string;
  description?: string;
  type: VideoType;
  category?: VideoCategory;
  subcategory?: string;
  tags?: string[];
  language?: string;

  // Source & playback
  source: VideoSource;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  embeddedPlayer?: string;

  // Category & organization
  department?: string;
  productIds?: string[];
  serviceIds?: string[];
  sopIds?: string[];
  teamIds?: string[];

  // Status & access
  status: VideoStatus;
  accessLevel: VideoAccessLevel;
  version?: string;

  // Watch tracking
  watchStatus: WatchStatus;
  watchProgress?: number;
  lastWatchedAt?: string;
  completionCount?: number;

  // Favorites
  isFavorite: boolean;
  isPinned: boolean;
  downloadCount?: number;

  // Transcript & docs
  transcript?: string;
  summary?: string;
  keyNotes?: string[];
  downloadableResources?: string[];
  pdfReferences?: string[];

  // Linked content
  linkedData?: {
    faqIds?: string[];
    salesScriptIds?: string[];
    blogPostIds?: string[];
    documentIds?: string[];
  };

  // Approval
  approvedBy?: string;
  approvedAt?: string;

  // Notes & comments
  notes?: string;
  timestampNotes?: { time: string; note: string }[];

  // Legacy
  script?: string;
  shotList?: string;
}

export interface VideoCategoryInfo extends BaseEntity {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  videoCount?: number;
}

export interface VideoPlaylist extends BaseEntity {
  name: string;
  description?: string;
  type: 'playlist' | 'learning-path' | 'series';
  videoIds: string[];
  status: LearningPathStatus;
  isFavorite: boolean;
  estimatedDuration?: string;
  thumbnailUrl?: string;
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
  | 'proposal'
  | 'product-deck'
  | 'service-deck'
  | 'pricing-sheet'
  | 'pitch-deck'
  | 'demo-video'
  | 'product-demo'
  | 'feature-document'
  | 'technical-specification'
  | 'testimonial-asset'
  | 'roi-document'
  | 'comparison-sheet'
  | 'sales-flyer'
  | 'portfolio'
  | 'client-presentation'
  | 'explainer-video';

export type CollateralStatus = 'draft' | 'approved' | 'archived';

export type CollateralCategory =
  | 'sales-presentation'
  | 'technical-document'
  | 'marketing-material'
  | 'client-proposal'
  | 'pricing'
  | 'product-education'
  | 'demo-material';

export type SalesStage =
  | 'awareness'
  | 'discovery'
  | 'qualification'
  | 'demo'
  | 'proposal'
  | 'negotiation'
  | 'closing'
  | 'retention';

export type CollateralAccessLevel =
  | 'public'
  | 'team'
  | 'department'
  | 'manager-only'
  | 'product-specific';

export interface SalesCollateral extends BaseEntity {
  name: string;
  description?: string;
  type: CollateralType;
  category?: CollateralCategory;
  subcategory?: string;
  tags?: string[];
  industryTags?: string[];

  // Sales stage & department
  funnelStage?: SalesStage;
  department?: string;

  // File & URL storage
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  fileName?: string;
  thumbnailUrl?: string;
  externalLinks?: {
    driveUrl?: string;
    youtubeUrl?: string;
    figmaUrl?: string;
    canvaUrl?: string;
    dropboxUrl?: string;
    websiteUrl?: string;
    repoUrl?: string;
  };

  // Product/service linking
  productIds?: string[];
  serviceIds?: string[];
  packageIds?: string[];
  planIds?: string[];
  featureIds?: string[];
  icpIds: string[];

  // Version & status
  version?: string;
  status: CollateralStatus;
  accessLevel: CollateralAccessLevel;

  // Favorites & tracking
  isFavorite: boolean;
  isPinned: boolean;
  downloadCount?: number;
  usageCount?: number;

  // Linked content
  linkedData?: {
    personaIds?: string[];
    salesScriptIds?: string[];
    faqIds?: string[];
    testimonialIds?: string[];
    blogPostIds?: string[];
  };

  // Approval
  approvedBy?: string;
  approvedAt?: string;

  // Legacy
  productId?: string;
  designBrief?: string;
}

export interface CollateralCategoryInfo extends BaseEntity {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  collateralCount?: number;
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

// --- Course Category (hierarchical) ---
export type CourseCategoryStatus = 'active' | 'archived';

export interface CourseCategory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  icon?: string;
  colour?: string;
  order: number;
  courseCount: number;
  status: CourseCategoryStatus;
}

// --- Course Status & Enums ---
export type CourseStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';
export type CourseVisibility = 'private' | 'internal' | 'public';
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type CourseFormat = 'video' | 'text' | 'live' | 'hybrid' | 'workshop';
export type CourseAudienceType = 'public' | 'internal' | 'team-specific' | 'department-specific' | 'admin-only';

// --- Course ---
export interface Course extends BaseEntity {
  // A. Core
  title: string;
  slug: string;
  shortDescription?: string;
  detailedDescription?: string;
  summary?: string;

  // B. Classification
  categoryId?: string;
  tags: string[];
  format: CourseFormat;
  status: CourseStatus;
  visibility: CourseVisibility;
  difficulty: CourseDifficulty;
  language: string;

  // C. Duration & Effort
  duration?: string;
  estimatedCompletionTime?: string;
  lessonCount: number;

  // D. Media
  thumbnail?: string;
  banner?: string;
  videoUrls: string[];

  // E. Instructor / Creator
  instructor?: string;
  creatorId?: string;

  // F. Enterprise Mapping
  department?: string;
  productId?: string;
  serviceId?: string;
  sopId?: string;
  audienceType: CourseAudienceType;

  // G. Learning Design
  learningObjectives: string[];
  outcomes: string[];
  skillLevel?: string;
  prerequisites: string[];
  relatedCourseIds: string[];
  relatedFaqIds: string[];
  relatedSopIds: string[];

  // H. Internal
  internalNotes?: string;

  // I. SEO
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords: string[];

  // J. Versioning & Approval
  version: number;
  approvedBy?: string;
  approvedAt?: string;
  reviewNotes?: string;

  // K. Stats
  viewCount: number;
  enrolmentCount: number;
  completionCount: number;

  // L. Flags
  aiGenerated: boolean;
  isFeatured: boolean;
}

// --- Chapter ---
export type ChapterStatus = 'draft' | 'review' | 'approved' | 'published';

export interface CourseChapter extends BaseEntity {
  courseId: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
  status: ChapterStatus;
  thumbnail?: string;
  duration?: string;
  lessonCount: number;
  learningObjectives: string[];
  internalNotes?: string;
  aiGenerated: boolean;
}

// --- Lesson ---
export type LessonFormat = 'video' | 'text' | 'audio' | 'pdf' | 'presentation' | 'interactive' | 'quiz';
export type LessonStatus = 'draft' | 'review' | 'approved' | 'published';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface LessonAttachment {
  url: string;
  name: string;
  type: string;
  size?: number;
}

export interface CourseLesson extends BaseEntity {
  chapterId: string;
  courseId: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  format: LessonFormat;
  order: number;
  status: LessonStatus;
  duration?: string;
  videoUrls: string[];
  documentUrls: string[];
  thumbnail?: string;
  learningObjectives: string[];
  keyTakeaways: string[];
  quizQuestions: QuizQuestion[];
  attachments: LessonAttachment[];
  isFree: boolean;
  aiGenerated: boolean;
  internalNotes?: string;
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

export type TestimonialType =
  | 'text'
  | 'video'
  | 'audio'
  | 'image'
  | 'screenshot'
  | 'social-media'
  | 'email'
  | 'whatsapp'
  | 'linkedin-recommendation'
  | 'google-review'
  | 'case-study';

export type TestimonialStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'featured'
  | 'archived';

export type CollectionMethod =
  | 'form'
  | 'email'
  | 'interview'
  | 'imported';

export type AuthorityLevel =
  | 'executive'
  | 'manager'
  | 'specialist'
  | 'individual';

export type DetailDepth =
  | 'brief'
  | 'moderate'
  | 'detailed'
  | 'comprehensive';

export interface TestimonialROIMetric {
  metric: string;
  value: string;
  unit?: string;
}

export interface TestimonialExternalLink {
  type: 'youtube' | 'vimeo' | 'loom' | 'google-drive' | 'other';
  url: string;
  label?: string;
}

export interface TestimonialCollectionQuestion {
  id: string;
  question: string;
  answer?: string;
  order: number;
}

export interface TestimonialTranslation {
  language: string;
  headline?: string;
  shortQuote?: string;
  fullTestimonial?: string;
  story?: string;
}

export interface Testimonial extends BaseEntity {
  // Customer Information
  customerName: string;
  customerCompany?: string;
  customerDesignation?: string;
  customerIndustry?: string;
  customerLocation?: string;
  customerEmail?: string;
  customerPhone?: string;
  contactPermission: boolean;
  customerLinkedIn?: string;
  customerPhoto?: string;

  // Testimonial Content
  type: TestimonialType;
  status: TestimonialStatus;
  headline?: string;
  shortQuote?: string;
  fullTestimonial?: string;
  story?: string;
  keyResults?: string[];
  emotionalHighlight?: string;
  roiMetrics?: TestimonialROIMetric[];

  // Before/During/After
  beforeState?: string;
  duringState?: string;
  afterState?: string;

  // Entity Mapping
  companyId: string;
  businessId?: string;
  brandId?: string;
  productIds?: string[];
  serviceIds?: string[];
  founderIds?: string[];
  employeeIds?: string[];
  featureIds?: string[];
  campaignTags?: string[];
  audienceTags?: string[];
  industryTags?: string[];

  // Media & Assets
  videoUrl?: string;
  audioUrl?: string;
  imageUrls?: string[];
  documentUrls?: string[];
  thumbnailUrl?: string;
  subtitlesUrl?: string;
  language?: string;
  externalLinks?: TestimonialExternalLink[];

  // Quality & Scoring
  authenticityScore?: number;
  emotionalImpactScore?: number;
  conversionPotential?: number;
  authorityLevel?: AuthorityLevel;
  detailDepth?: DetailDepth;
  specificityScore?: number;
  trustScore?: number;

  // Approval & Consent
  consentVerified: boolean;
  consentDate?: string;
  consentDocumentUrl?: string;
  approvedBy?: string;
  approvedAt?: string;
  revisionNotes?: string[];
  isPublic: boolean;
  marketingUsagePermission: boolean;

  // Collection Framework
  collectionMethod?: CollectionMethod;
  collectionQuestions?: TestimonialCollectionQuestion[];
  requestSentDate?: string;
  followUpDates?: string[];

  // Multi-language
  originalLanguage?: string;
  translations?: TestimonialTranslation[];

  // Legacy (backward compatibility)
  productId?: string;
  industry?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  keyQuote?: string;
  caseStudy?: string;

  // Legacy fields from old interface
  name?: string;
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

// ============================================
// WEBSITE PLANNER MODULE
// ============================================

export type WebsiteType =
  | 'corporate'
  | 'saas'
  | 'ecommerce'
  | 'portfolio'
  | 'marketplace'
  | 'landing-page'
  | 'agency'
  | 'personal-brand';

export type WebsiteStatus =
  | 'planning'
  | 'requirements'
  | 'design'
  | 'development'
  | 'review'
  | 'live'
  | 'maintenance';

export type SectionPriority = 'critical' | 'high' | 'medium' | 'low';

export type FeatureComplexity = 'simple' | 'medium' | 'complex' | 'enterprise';

export interface WebsiteSection {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  purpose?: string;
  contentRequirement?: string;
  uiNotes?: string;
  cta?: string;
  referenceLinks?: string[];
  aiPrompt?: string;
  seoNotes?: string;
  mediaRequirement?: string;
  priority: SectionPriority;
  customFields?: Record<string, string>;
}

export interface WebsitePage {
  id: string;
  name: string;
  url: string;
  pageType: 'main' | 'landing' | 'dynamic' | 'legal' | 'seo';
  goal?: string;
  metaTitle?: string;
  metaDescription?: string;
  schemaRequirement?: string;
  keywords?: string[];
  conversionGoal?: string;
  wireframeNotes?: string;
  internalLinkingNotes?: string;
  sections: string[]; // Section IDs
  isPublished: boolean;
}

export interface WebsiteFeature {
  id: string;
  name: string;
  enabled: boolean;
  priority: SectionPriority;
  notes?: string;
  complexity: FeatureComplexity;
  estimatedTimeline?: string;
  dependencies?: string[];
}

export interface WebsiteContentBlock {
  id: string;
  type: 'headline' | 'subheadline' | 'description' | 'bullet-points' | 'faq' | 'testimonial' | 'cta' | 'stats' | 'comparison' | 'team' | 'product' | 'custom';
  content: string;
  aiGenerated?: boolean;
  aiPrompt?: string;
  sectionId?: string;
  pageId?: string;
}

export interface WebsiteCaseStudy {
  id: string;
  clientName: string;
  industry?: string;
  problem?: string;
  solution?: string;
  technologies?: string[];
  results?: string;
  metrics?: Record<string, string>;
  images?: string[];
  testimonial?: string;
  assignedPages?: string[];
  displayStyle?: 'card' | 'full' | 'minimal';
}

export interface WebsiteFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  relatedPage?: string;
  seoImportance: SectionPriority;
  schemaEnabled: boolean;
  aiGenerated?: boolean;
}

export interface WebsiteSEOCluster {
  id: string;
  topic: string;
  pillarPage?: string;
  clusterPages: string[];
  keywords: string[];
  contentGap?: string;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description?: string;
  websiteType: WebsiteType;
  sections: WebsiteSection[];
  pages: Partial<WebsitePage>[];
  features: Partial<WebsiteFeature>[];
  seoClusters?: Partial<WebsiteSEOCluster>[];
  isDefault: boolean;
  tags: string[];
}

export interface WebsiteAIPrompt {
  id: string;
  name: string;
  targetPlatform: 'chatgpt' | 'claude' | 'cursor' | 'lovable' | 'bolt' | 'v0' | 'replit' | 'framer' | 'webflow' | 'other';
  prompt: string;
  context: {
    brandIncluded: boolean;
    businessIncluded: boolean;
    sectionsIncluded: boolean;
    seoIncluded: boolean;
    featuresIncluded: boolean;
  };
  generatedAt: string;
}

export interface WebsiteRequirementDocument {
  id: string;
  name: string;
  type: 'markdown' | 'pdf' | 'brd' | 'scope' | 'approval' | 'ui-spec';
  content: string;
  generatedAt: string;
  version: number;
  status: 'draft' | 'review' | 'approved';
}

export interface WebsiteComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  section?: string;
  page?: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteApproval {
  id: string;
  approverName: string;
  approverEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedAt?: string;
}

export interface WebsiteVersion {
  id: string;
  version: number;
  name: string;
  description?: string;
  snapshot: Partial<WebsitePlanner>;
  createdAt: string;
  createdBy: string;
}

export interface WebsitePlanner extends BaseEntity {
  // Basic Details
  name: string;
  domain?: string;
  websiteType: WebsiteType;
  websiteGoal?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  targetAudience?: string;
  country?: string;
  language: string;
  seoTargetRegion?: string;
  status: WebsiteStatus;
  owner?: string;
  version: number;

  // Module Integrations (References to other ERP modules)
  linkedData: {
    // Foundation
    businessProfileId?: string;
    founderIds?: string[];
    employeeIds?: string[];

    // ICPs & Personas
    icpIds?: string[];
    personaIds?: string[];

    // Products
    productIds?: string[];
    productCategoryIds?: string[];

    // Competitors
    competitorIds?: string[];

    // Brand
    brandId?: string;
    brandAssetIds?: string[];
    brandStrategyId?: string;

    // Visual Identity
    visualIdentityId?: string;

    // Content & Sales
    faqIds?: string[];
    salesCollateralIds?: string[];
    testimonialIds?: string[];
  };

  // Structure
  sections: WebsiteSection[];
  pages: WebsitePage[];

  // Content
  contentBlocks: WebsiteContentBlock[];

  // Features
  features: WebsiteFeature[];

  // Case Studies & FAQs
  caseStudies: WebsiteCaseStudy[];
  faqs: WebsiteFAQ[];

  // SEO
  seoClusters: WebsiteSEOCluster[];
  targetKeywords: string[];

  // AI & Documents
  aiPrompts: WebsiteAIPrompt[];
  documents: WebsiteRequirementDocument[];

  // Collaboration
  comments: WebsiteComment[];
  approvals: WebsiteApproval[];
  versions: WebsiteVersion[];

  // References
  designReferences?: string[];
  competitorReferences?: string[];
  moodboardUrl?: string;
  uiStyle?: string;
  animationNotes?: string;
  responsiveNotes?: string;
  accessibilityNotes?: string;

  // Assets
  logoIds?: string[];
  imageIds?: string[];
  videoIds?: string[];
  documentIds?: string[];

  // Template
  templateId?: string;

  // Activity
  lastActivityAt?: string;
}

// ============================================
// BLOG CONTENT OPERATING SYSTEM
// ============================================

// Blog Strategy Goals
export type BlogGoal =
  | 'seo'
  | 'brand-awareness'
  | 'lead-generation'
  | 'product-education'
  | 'authority-building'
  | 'traffic-growth'
  | 'conversion'
  | 'community-building';

// Funnel Stage
export type FunnelStage = 'tofu' | 'mofu' | 'bofu';

// Content Depth
export type ContentDepth = 'brief' | 'standard' | 'deep' | 'comprehensive';

// SEO Intent
export type SEOIntent = 'informational' | 'navigational' | 'transactional' | 'commercial';

// Content Type Categories
export type ContentTypeCategory =
  | 'educational'
  | 'how-to-guide'
  | 'industry-trends'
  | 'case-study'
  | 'comparison'
  | 'product-focused'
  | 'listicle'
  | 'problem-solution'
  | 'thought-leadership'
  | 'beginner-guide'
  | 'technical'
  | 'pillar-content'
  | 'cluster-content'
  | 'news-based'
  | 'customer-story'
  | 'faq-based'
  | 'data-driven'
  | 'myth-busting'
  | 'opinion'
  | 'tool-guide'
  | 'tutorial'
  | 'checklist'
  | 'framework'
  | 'research-based';

// Title Generation Styles
export type TitleStyle =
  | 'seo'
  | 'viral'
  | 'authority'
  | 'technical'
  | 'emotional'
  | 'founder'
  | 'linkedin'
  | 'thought-leadership';

// Blogging Frequency
export type BloggingFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly';

// Blog Content Status
export type BlogContentStatus =
  | 'planning'
  | 'outlining'
  | 'generating'
  | 'draft'
  | 'review'
  | 'revisions'
  | 'approved'
  | 'published';

// Content Chunk Types
export type ContentChunkType =
  | 'outline'
  | 'intro'
  | 'section'
  | 'faq'
  | 'conclusion'
  | 'seo-pass'
  | 'humanize-pass';

// Chunk Status
export type ChunkStatus = 'pending' | 'generating' | 'completed' | 'failed';

// Approval Stages
export type ApprovalStage = 'content-review' | 'seo-review' | 'editorial-review' | 'final-approval';

// Approval Status
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

// Asset Suggestion Types
export type AssetSuggestionType =
  | 'featured-image'
  | 'infographic'
  | 'chart'
  | 'social-post'
  | 'linkedin-post'
  | 'twitter-thread'
  | 'cta-banner'
  | 'youtube-video';

// Export Formats
export type ExportFormat = 'markdown' | 'html' | 'docx' | 'wordpress' | 'seo-brief';

// ============================================
// BLOG STRATEGY
// ============================================

export interface BlogStrategy extends BaseEntity {
  name: string;
  goals: BlogGoal[];
  targetAudience: string;
  targetRegion: string;
  language: string;
  funnelStage: FunnelStage;
  competitorBlogs: string[];
  contentDepth: ContentDepth;
  creativityLevel: number; // 1-10
  linkedData: {
    brandId?: string;
    businessProfileId?: string;
    icpIds?: string[];
    personaIds?: string[];
    productIds?: string[];
    competitorIds?: string[];
  };
}

// ============================================
// BLOG SEO CONFIGURATION
// ============================================

export type SearchIntentType = 'informational' | 'commercial' | 'transactional' | 'navigational';
export type SEOGoalType = 'traffic' | 'rankings' | 'leads' | 'authority';
export type SchemaType = 'article' | 'howto' | 'review' | 'faq' | 'product';

export interface BlogSEOConfig extends BaseEntity {
  strategyId: string;

  // Basic SEO Info
  seoName: string;
  searchIntent: SearchIntentType;
  targetAudience: string;
  primaryGoal: SEOGoalType;

  // Keywords
  primaryKeywords: string[];
  secondaryKeywords: string[];
  longTailKeywords: string[];
  negativeKeywords: string[];

  // AI SEO Settings
  aiSeoSettings: {
    autoGenerateMetaTitle: boolean;
    autoGenerateMetaDescription: boolean;
    autoGenerateSlug: boolean;
    autoGenerateTOC: boolean;
    autoGenerateAltText: boolean;
    autoGenerateInternalLinks: boolean;
  };

  // Meta Templates
  metaSettings: {
    metaTitleTemplate: string;
    metaDescriptionTemplate: string;
    titleMaxLength: number;
    descriptionMaxLength: number;
  };

  // SEO Rules
  seoRules: {
    minWordCount: number;
    maxWordCount: number;
    keywordDensityTarget: number;
    includeTOC: boolean;
    includeConclusion: boolean;
    includeCTA: boolean;
  };

  // Internal Linking
  internalLinking: {
    enabled: boolean;
    maxLinksPerPost: number;
    pillarPages: string[];
  };

  // Schema Settings
  schemaSettings: {
    enabled: boolean;
    schemaTypes: SchemaType[];
  };

  // Competitor SEO
  seoCompetitors: {
    competitorDomains: string[];
    competitorKeywords: string[];
  };

  // Analysis (computed/cached)
  seoAnalysis?: {
    seoScore: number;
    readabilityScore: number;
    keywordCoverage: number;
    intentMatchScore: number;
    lastAnalyzed: string;
  };
}

// ============================================
// BLOG CONTENT TYPE
// ============================================

export interface BlogContentTypeConfig extends BaseEntity {
  strategyId: string;
  name: string;
  type: ContentTypeCategory;
  enabled: boolean;
  percentageAllocation: number; // 0-100
  priority: number;
  seoIntent: SEOIntent;
  recommendedLength: number; // word count
  funnelPosition: FunnelStage;
  ctaStrategy: string;
  conversionGoal: string;
}

// ============================================
// SEASONAL CAMPAIGNS
// ============================================

export interface SeasonalCampaign {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  theme: string;
  priority: 'high' | 'medium' | 'low';
}

// ============================================
// BLOG CALENDAR
// ============================================

export interface BlogCalendarItem {
  id: string;
  scheduledDate: string;
  contentTypeId?: string;
  status: 'empty' | 'planned' | 'title-generated' | 'assigned' | 'in-progress' | 'ready';
  titleId?: string;
  postId?: string;
}

export interface BlogCalendar extends BaseEntity {
  name: string;
  strategyId: string;
  frequency: BloggingFrequency;
  postsPerCycle: number;
  publishingDays: string[]; // e.g., ['monday', 'wednesday', 'friday']
  priorityTopics: string[];
  seasonalCampaigns: SeasonalCampaign[];
  startDate: string;
  endDate?: string;
  timeline: BlogCalendarItem[];
}

// ============================================
// BLOG TITLE (AI Generated)
// ============================================

export interface BlogTitle extends BaseEntity {
  strategyId: string;
  calendarId?: string;
  contentTypeId?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  contentType: ContentTypeCategory;
  style: TitleStyle;
  seoScore: number; // 0-100
  searchIntent: SEOIntent;
  funnelStage: FunnelStage;
  suggestedKeywords: string[];
  suggestedCTA: string;
  metaDescription?: string; // SEO meta description
  trendingKeywords?: string[]; // Trending keywords from SEO analysis
  // Image SEO
  imagePrompt?: string; // AI-generated image prompt for featured image
  imageAlt?: string; // Alt text for featured image
  ogImageDescription?: string; // Open Graph image description
  status: 'generated' | 'selected' | 'rejected' | 'edited';
  order: number;
  aiPrompt?: string;
  aiModel?: string;
  scheduledDate?: string;
}

// ============================================
// BLOG SECTION
// ============================================

export interface BlogSection {
  id: string;
  type: 'heading' | 'subheading' | 'paragraph' | 'list' | 'quote' | 'table' | 'image' | 'cta';
  content: string;
  order: number;
  level?: number; // for headings (1-3)
}

// ============================================
// BLOG FAQ
// ============================================

export interface BlogFAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

// ============================================
// BLOG LINKS
// ============================================

export interface BlogInternalLink {
  id: string;
  text: string;
  targetPostId?: string;
  url?: string;
  placement: string; // context of link
}

export interface BlogExternalLink {
  id: string;
  text: string;
  url: string;
  domain: string;
  isNofollow: boolean;
}

// ============================================
// CONTENT CHUNKS
// ============================================

export interface BlogContentChunk extends BaseEntity {
  postId: string;
  type: ContentChunkType;
  order: number;
  content?: string;
  status: ChunkStatus;
  generationTaskId?: string;
  errorMessage?: string;
  tokensUsed?: number;
}

// ============================================
// BLOG VERSIONING
// ============================================

export interface BlogVersion {
  version: number;
  title: string;
  content: string;
  excerpt: string;
  createdAt: string;
  createdBy?: string;
  changeSummary?: string;
}

// ============================================
// BLOG COMMENTS
// ============================================

export interface BlogComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  resolved: boolean;
  sectionId?: string; // optional reference to specific section
}

// ============================================
// BLOG APPROVALS
// ============================================

export interface BlogApproval {
  stage: ApprovalStage;
  status: ApprovalStatus;
  userId?: string;
  userName?: string;
  comment?: string;
  completedAt?: string;
}

// ============================================
// ASSET SUGGESTIONS
// ============================================

export interface BlogAssetSuggestion {
  id: string;
  type: AssetSuggestionType;
  description: string;
  prompt?: string;
  dimensions?: string;
}

// ============================================
// SEO ANALYSIS
// ============================================

export interface BlogSEOAnalysis {
  readabilityScore: number;
  readingTime: number; // minutes
  keywordDensity: Record<string, number>;
  headingStructureValid: boolean;
  internalLinkCount: number;
  externalLinkCount: number;
  suggestedSchema: string[];
  snippetOptimization?: string;
  wordCount: number;
  paragraphCount: number;
  avgSentenceLength: number;
  passiveVoicePercentage: number;
}

// ============================================
// BLOG POST (Enhanced)
// ============================================

export interface BlogPost extends BaseEntity {
  strategyId: string;
  calendarId?: string;
  titleId?: string;

  // Basic Info
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;

  // Content Type
  contentType: ContentTypeCategory;
  contentTypeId?: string;

  // Content
  outline?: string;
  content?: string;
  contentChunks: BlogContentChunk[];
  sections: BlogSection[];

  // SEO
  primaryKeyword?: string;
  secondaryKeywords: string[];
  nlpKeywords: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;

  // Structure
  faqs: BlogFAQ[];
  internalLinks: BlogInternalLink[];
  externalLinks: BlogExternalLink[];

  // Status & Workflow
  status: BlogContentStatus;
  version: number;
  versions: BlogVersion[];
  comments: BlogComment[];
  approvals: BlogApproval[];

  // Assets
  suggestedAssets: BlogAssetSuggestion[];

  // Analytics Prep
  seoAnalysis?: BlogSEOAnalysis;

  // Publishing
  publishedAt?: string;
  scheduledPublishAt?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

// ============================================
// BLOG EXPORT
// ============================================

export interface BlogExport extends BaseEntity {
  postId: string;
  format: ExportFormat;
  fileUrl?: string;
  content: string;
  fileName: string;
  fileSize?: number;
}

// ============================================
// BLOG SYSTEM
// ============================================

export interface BlogContentSystem extends BaseEntity {
  name: string;
  activeStrategyId?: string;
  activeCalendarId?: string;
  settings: {
    defaultLanguage: string;
    defaultRegion: string;
    aiModel: string;
    autoGenerateOutline: boolean;
    autoGenerateMeta: boolean;
    enableChunking: boolean;
    qualityThreshold: number;
  };
}

// ============================================
// NEWSLETTER CONTENT OS
// ============================================

export type NewsletterGoal =
  | 'education'
  | 'product-awareness'
  | 'community-building'
  | 'brand-awareness'
  | 'customer-engagement'
  | 'retention'
  | 'updates'
  | 'founder-communication'
  | 'thought-leadership';

export type NewsletterFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';

export type NewsletterContentStatus = 'planning' | 'draft' | 'review' | 'approved' | 'published' | 'archived';

export type SubjectLineStyle = 'educational' | 'conversational' | 'founder-style' | 'authority' | 'emotional' | 'insight' | 'minimal';

export interface NewsletterStrategy extends BaseEntity {
  name: string;
  description?: string;
  objective: NewsletterGoal;
  audience: string;
  industry: string;
  funnelStage: FunnelStage;
  communicationTone: string;
  contentDepth: ContentDepth;
  ctaGoal: string;
  linkedData: {
    brandId?: string;
    businessProfileId?: string;
    founderIds?: string[];
    icpIds?: string[];
    personaIds?: string[];
    productIds?: string[];
    productCategoryIds?: string[];
    competitorIds?: string[];
    brandAssetIds?: string[];
    brandStrategyId?: string;
    visualIdentityId?: string;
    salesCollateralIds?: string[];
  };
}

export interface NewsletterContentTypeConfig extends BaseEntity {
  strategyId: string;
  name: string;
  type: string;
  enabled: boolean;
  percentageAllocation: number;
  priority: number;
  recommendedLength: number;
  funnelPosition: FunnelStage;
  ctaStrategy: string;
  conversionGoal: string;
}

export interface NewsletterCalendarItem {
  id: string;
  scheduledDate: string;
  contentTypeId?: string;
  status: 'empty' | 'planned' | 'title-generated' | 'assigned' | 'in-progress' | 'ready';
  titleId?: string;
  postId?: string;
}

export interface NewsletterCalendar extends BaseEntity {
  name: string;
  strategyId: string;
  frequency: NewsletterFrequency;
  newslettersPerCycle: number;
  publishingDays: string[];
  priorityTopics: string[];
  seasonalCampaigns: SeasonalCampaign[];
  startDate: string;
  endDate?: string;
  timeline: NewsletterCalendarItem[];
}

export interface NewsletterTitle extends BaseEntity {
  strategyId: string;
  calendarId?: string;
  contentTypeId?: string;
  title: string;
  subjectLine: string;
  previewText: string;
  contentType: string;
  style: SubjectLineStyle;
  engagementScore: number;
  funnelStage: FunnelStage;
  suggestedKeywords: string[];
  suggestedCTA: string;
  status: 'generated' | 'selected' | 'rejected' | 'edited';
  order: number;
  aiPrompt?: string;
  aiModel?: string;
}

export type NewsletterImageType = 'hero' | 'feature' | 'product' | 'team' | 'event' | 'banner';
export type NewsletterImageLayout = 'full-width' | 'card' | 'inline';
export type NewsletterImagePosition = 'top' | 'middle' | 'bottom';
export type NewsletterImagePriority = 'high' | 'medium' | 'low';

export type BacklinkType = 'internal' | 'external';

export interface NewsletterBacklink {
  label: string;
  url: string;
  type: BacklinkType;
  icon?: string;
}

export interface NewsletterSection {
  id: string;
  type: 'heading' | 'subheading' | 'paragraph' | 'list' | 'quote' | 'cta' | 'image';
  content: string;
  order: number;
  /** Image fields — only used when type is 'image'. All optional for backward compat. */
  imageType?: NewsletterImageType;
  src?: string;
  alt?: string;
  caption?: string;
  imageLayout?: NewsletterImageLayout;
  imagePosition?: NewsletterImagePosition;
  imagePriority?: NewsletterImagePriority;
  /** Backlinks — optional navigation links for sections. */
  backlinks?: NewsletterBacklink[];
  /** Edit metadata — enables inline editing UI and versioning. Defaults to false. */
  editable?: boolean;
  version?: number;
}

export interface NewsletterAssetSuggestion {
  id: string;
  type: AssetSuggestionType;
  description: string;
  prompt?: string;
  dimensions?: string;
}

export interface NewsletterPost extends BaseEntity {
  strategyId: string;
  calendarId?: string;
  titleId?: string;
  title: string;
  subjectLine: string;
  previewText: string;
  contentType: string;
  content?: string;
  sections: NewsletterSection[];
  suggestedCTA: string;
  status: NewsletterContentStatus;
  version: number;
  suggestedAssets: NewsletterAssetSuggestion[];
  publishedAt?: string;
  scheduledPublishAt?: string;
  logoUrl?: string;
}

export interface NewsletterExport extends BaseEntity {
  postId: string;
  format: ExportFormat;
  fileUrl?: string;
  content: string;
  fileName: string;
  fileSize?: number;
}

export interface NewsletterContentSystem extends BaseEntity {
  name: string;
  activeStrategyId?: string;
  activeCalendarId?: string;
  settings: {
    defaultLanguage: string;
    aiModel: string;
    autoGenerateSubject: boolean;
    enableChunking: boolean;
    qualityThreshold: number;
  };
}

// ============================================
// SOCIAL MEDIA CONTENT OS
// ============================================

// Social Media Platforms
export type SocialPlatform =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'youtube'
  | 'tiktok'
  | 'pinterest'
  | 'threads'
  | 'whatsapp-channels'
  | 'telegram'
  | 'google-business';

// Social Content Types
export type SocialContentType =
  | 'reel'
  | 'carousel'
  | 'static-post'
  | 'story'
  | 'shorts'
  | 'long-video'
  | 'tweet'
  | 'thread'
  | 'poll'
  | 'infographic'
  | 'meme'
  | 'announcement'
  | 'educational-content'
  | 'testimonial'
  | 'case-study'
  | 'product-showcase'
  | 'founder-content'
  | 'trend-based-content'
  | 'promotional-content'
  | 'event-content';

// Calendar Entry Status
export type SocialEntryStatus =
  | 'planned'
  | 'content-pending'
  | 'writing-in-progress'
  | 'design-pending'
  | 'reel-editing'
  | 'under-review'
  | 'approved'
  | 'scheduled'
  | 'posted'
  | 'rejected'
  | 'delayed'
  | 'archived';

// Content Pillar
export type ContentPillar =
  | 'awareness'
  | 'engagement'
  | 'education'
  | 'conversion'
  | 'community'
  | 'authority'
  | 'entertainment'
  | 'product'
  | 'culture'
  | 'news';

// Social Funnel Stage
export type SocialFunnelStage = 'top-of-funnel' | 'middle-of-funnel' | 'bottom-of-funnel' | 'retention';

// Approval Status
export type SocialApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes-requested';

// Hashtag Type
export type HashtagType = 'trending' | 'branded' | 'evergreen' | 'niche' | 'campaign' | 'community';

// Repurpose Type
export type RepurposeType =
  | 'reel-to-carousel'
  | 'reel-to-story'
  | 'blog-to-linkedin'
  | 'blog-to-twitter-thread'
  | 'carousel-to-reel'
  | 'testimonial-to-quote'
  | 'video-to-short'
  | 'long-to-short'
  | 'cross-platform';

// Creative Media Type
export type CreativeMediaType =
  | 'image'
  | 'video'
  | 'reel'
  | 'carousel'
  | 'story'
  | 'thumbnail'
  | 'graphic'
  | 'infographic'
  | 'gif'
  | 'audio';

// Calendar View
export type SocialCalendarView = 'monthly' | 'weekly' | 'daily' | 'campaign' | 'platform';

// Entry Priority
export type EntryPriority = 'low' | 'medium' | 'high' | 'urgent';

// Social Export Format
export type SocialExportFormat = 'markdown' | 'csv' | 'calendar' | 'content-brief' | 'design-brief' | 'caption-sheet';

// Template Category
export type SocialTemplateCategory =
  | 'caption'
  | 'hook'
  | 'cta'
  | 'hashtag-set'
  | 'reel-script'
  | 'carousel-framework'
  | 'campaign'
  | 'story-framework';

// Campaign Status
export type SocialCampaignStatus = 'planning' | 'active' | 'completed' | 'paused';

// Supporting Sub-Interfaces
export interface PlatformVariation {
  platform: SocialPlatform;
  caption?: string;
  hook?: string;
  cta?: string;
  hashtags?: string[];
  publishTime?: string;
  notes?: string;
}

export interface ApprovalEntry {
  id: string;
  stage: string;
  status: SocialApprovalStatus;
  reviewerId?: string;
  reviewerName?: string;
  comment?: string;
  timestamp: string;
}

export interface ReviewComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  resolved: boolean;
}

// Social Media Calendar (singleton per company)
export interface SocialMediaCalendar extends BaseEntity {
  name: string;
  description?: string;
  activeStrategyId?: string;
  settings: {
    defaultPlatforms: SocialPlatform[];
    defaultTimezone: string;
    defaultPublishingTimes: Record<string, string[]>;
    aiModel: string;
    autoGenerateCaptions: boolean;
    autoGenerateHashtags: boolean;
    contentMixTargets: Record<string, number>;
  };
}

// Social Content Strategy
export interface SocialContentStrategy extends BaseEntity {
  calendarId: string;
  name: string;
  description?: string;
  contentPillars: ContentPillar[];
  objectives: string[];
  targetAudience: string;
  toneAndVoice: string;
  postingFrequencyGoal: Record<string, number>;
  linkedData: {
    brandId?: string;
    businessProfileId?: string;
    icpIds?: string[];
    personaIds?: string[];
    productIds?: string[];
    competitorIds?: string[];
  };
}

// Social Calendar Entry (main workhorse entity)
export interface SocialCalendarEntry extends BaseEntity {
  calendarId: string;
  strategyId?: string;

  // Basic
  title: string;
  platform: SocialPlatform;
  contentType: SocialContentType;
  publishDate: string;
  publishTime?: string;
  campaignId?: string;
  priority: EntryPriority;
  status: SocialEntryStatus;
  assignedTeamMemberIds?: string[];

  // Content Writing
  caption?: string;
  hook?: string;
  cta?: string;
  hashtags?: string[];
  platformVariations?: PlatformVariation[];

  // Graphics / Reel
  graphicUrl?: string;
  reelUrl?: string;
  thumbnailUrl?: string;
  designFileUrl?: string;
  driveLink?: string;
  figmaLink?: string;
  canvaLink?: string;

  // Approval
  approvalStatus: SocialApprovalStatus;
  approvalHistory?: ApprovalEntry[];
  reviewer?: string;
  reviewComments?: ReviewComment[];

  // Content Strategy
  pillar?: ContentPillar;
  funnelStage?: SocialFunnelStage;
  objective?: string;

  // Repurposing
  sourceContentId?: string;
  repurposeType?: RepurposeType;

  // Performance Prep (future analytics)
  expectedReach?: number;
  expectedEngagement?: number;
  actualReach?: number;
  actualEngagement?: number;
  performanceNotes?: string;
}

// Social Campaign
export interface SocialCampaign extends BaseEntity {
  calendarId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  objectives?: string[];
  platforms: SocialPlatform[];
  status: SocialCampaignStatus;
  color?: string;
}

// Social Content Template
export interface SocialContentTemplate extends BaseEntity {
  calendarId: string;
  name: string;
  description?: string;
  category: SocialTemplateCategory;
  platform?: SocialPlatform;
  contentType?: SocialContentType;
  pillar?: ContentPillar;
  funnelStage?: SocialFunnelStage;
  content: string;
  structure?: string;
  tags?: string[];
  isDefault: boolean;
}

// Social Hashtag Bank
export interface SocialHashtagBank extends BaseEntity {
  calendarId: string;
  name: string;
  platform?: SocialPlatform;
  type: HashtagType;
  campaign?: string;
  hashtags: string[];
  avgReach?: number;
  avgEngagement?: number;
  isActive: boolean;
}

// Social Creative (Media Library Item)
export interface SocialCreative extends BaseEntity {
  calendarId: string;
  name: string;
  description?: string;
  mediaType: CreativeMediaType;
  url: string;
  thumbnailUrl?: string;
  tags?: string[];
  category?: string;
  platform?: SocialPlatform;
  dimensions?: { width?: number; height?: number };
  fileSize?: number;
  fileType?: string;
  sourceUrl?: string;
  isFavorite: boolean;
}

// Social Export
export interface SocialExport extends BaseEntity {
  calendarId: string;
  entryIds: string[];
  format: SocialExportFormat;
  content: string;
  fileName: string;
}

// ============================================
// SALES SCRIPTS
// ============================================

export type ScriptType =
  | 'cold-call'
  | 'warm-call'
  | 'qualification'
  | 'discovery'
  | 'demo'
  | 'sales-pitch'
  | 'follow-up'
  | 'negotiation'
  | 'closing'
  | 'whatsapp'
  | 'email'
  | 'linkedin'
  | 'voice-note'
  | 'appointment'
  | 'reactivation'
  | 'referral'
  | 'upselling'
  | 'cross-selling'
  | 'retention'
  | 'renewal'
  | 'customer-success'
  | 'objection-handling';

export type ScriptStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'archived';

export type SalesFunnelStage =
  | 'awareness'
  | 'interest'
  | 'consideration'
  | 'decision'
  | 'purchase'
  | 'retention'
  | 'advocacy';

export type SalesAudienceType =
  | 'prospect'
  | 'lead'
  | 'opportunity'
  | 'customer'
  | 'partner'
  | 'investor';

export type CommunicationChannel =
  | 'phone'
  | 'whatsapp'
  | 'linkedin'
  | 'email'
  | 'zoom'
  | 'google-meet'
  | 'in-person'
  | 'sms'
  | 'voice-note';

export type ScriptPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface IQualificationQuestion {
  id: string;
  question: string;
  purpose?: string;
  followUpIfYes?: string;
  followUpIfNo?: string;
  order: number;
}

export interface IObjectionResponse {
  id: string;
  objection: string;
  response: string;
  counterQuestions?: string[];
  caseStudyReference?: string;
  trustBuildingLine?: string;
  ctaSuggestion?: string;
  emotionalApproach?: string;
  order: number;
}

export interface IScriptSection {
  id: string;
  type: 'opening' | 'hook' | 'qualification' | 'pain-discovery' | 'value-position' | 'offer' | 'objection' | 'trust' | 'social-proof' | 'closing' | 'follow-up' | 'exit';
  title: string;
  content: string;
  order: number;
  isRequired: boolean;
  tips?: string[];
}

export interface IConversationBranch {
  id: string;
  trigger: string;
  response: string;
  nextSection?: string;
  order: number;
}

export interface IPerformanceMetrics {
  usageCount: number;
  successRate: number;
  avgConversionTime: number;
  lastUsedAt?: string;
  feedbackScore?: number;
}

export interface IScriptAIGenerationContext {
  brandVoice?: string;
  persona?: string;
  goal?: string;
  objections?: string[];
}

export interface IScriptTranslation {
  language: string;
  title?: string;
  content?: string;
}

export interface SalesScript extends BaseEntity {
  // Basic Information
  title: string;
  description?: string;
  scriptType: ScriptType;
  status: ScriptStatus;
  priority: ScriptPriority;

  // Product/Service Mapping
  companyId: string;
  productId?: string;
  serviceId?: string;
  productIds?: string[];
  serviceIds?: string[];

  // Audience & Targeting
  funnelStage: SalesFunnelStage;
  audienceType: SalesAudienceType;
  targetIndustry?: string;
  targetPersona?: string;

  // Communication
  channels: CommunicationChannel[];

  // Script Content
  openingLine?: string;
  hook?: string;
  valueProposition?: string;
  offerPresentation?: string;
  closingCTA?: string;
  followUpCTA?: string;
  exitResponse?: string;

  // Structured Sections
  sections: IScriptSection[];

  // Qualification Questions
  qualificationQuestions: IQualificationQuestion[];

  // Objection Handling
  objectionResponses: IObjectionResponse[];

  // Conversation Flow
  conversationBranches: IConversationBranch[];

  // Brand Integration
  brandTone?: string;
  communicationStyle?: string;
  messagingGuidelines?: string;

  // Playbook
  playbookId?: string;
  playbookName?: string;

  // Training
  trainingNotes?: string;
  bestPractices?: string[];
  callExamples?: string[];
  coachingNotes?: string;

  // Performance
  performanceMetrics?: IPerformanceMetrics;

  // Version Control
  version: number;
  parentScriptId?: string;
  revisionNotes?: string[];

  // Approval Workflow
  createdBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  reviewedAt?: string;
  approvedAt?: string;
  reviewComments?: string;

  // Access Control
  isPublic: boolean;
  allowedRoles?: string[];
  allowedTeams?: string[];

  // AI Generation
  aiGenerated: boolean;
  aiGenerationContext?: IScriptAIGenerationContext;

  // Multi-language
  language: string;
  translations?: IScriptTranslation[];

  // Tags & Categories
  tags?: string[];
  category?: string;
}

// ============================================
// BLOG STRUCTURE
// ============================================

export type StructureType =
  | 'seo'
  | 'technical'
  | 'thought-leadership'
  | 'comparison'
  | 'listicle'
  | 'case-study'
  | 'product-focused';

export type StructureSectionType =
  | 'intro'
  | 'problem'
  | 'explanation'
  | 'benefits'
  | 'steps'
  | 'examples'
  | 'conclusion'
  | 'cta'
  | 'custom';

export type StructureStatus = 'draft' | 'generated' | 'edited' | 'approved';

export interface StructureSection {
  id: string;
  order: number;
  type: StructureSectionType;
  title: string;
  description?: string;
  headingLevel?: 1 | 2 | 3 | 4;
  targetWordCount?: number;
  keywords?: string[];
  aiInstructions?: string;
  generateContent: boolean;
  required: boolean;
  contentGenerated?: boolean;
  contentId?: string;
}

export interface BlogStructure extends BaseEntity {
  strategyId: string;
  postId?: string;
  titleId?: string;
  calendarItemId?: string;
  scheduledDate?: string;
  name: string;
  type: StructureType;
  aiGenerated: boolean;
  editable: boolean;
  totalWordCount: number;
  status: StructureStatus;
  sections: StructureSection[];
}

// ============================================
// BLOG CONTENT SECTION
// ============================================

export interface BlogContentSection extends BaseEntity {
  structureId: string;
  structureSectionId: string;
  title: string;
  order: number;
  type: string;
  content: string;
  generated: boolean;
  aiGenerated: boolean;
  manuallyEdited: boolean;
  lastGeneratedAt?: string;
}
