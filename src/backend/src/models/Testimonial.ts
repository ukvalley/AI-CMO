/**
 * Testimonial Model
 * Comprehensive testimonial management with entity mapping, quality scoring, and approval workflows
 */

import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// TYPE DEFINITIONS
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

export interface IROIMetric {
  metric: string;
  value: string;
  unit?: string;
}

export interface IExternalLink {
  type: 'youtube' | 'vimeo' | 'loom' | 'google-drive' | 'other';
  url: string;
  label?: string;
}

export interface ICollectionQuestion {
  id: string;
  question: string;
  answer?: string;
  order: number;
}

export interface ITranslation {
  language: string;
  headline?: string;
  shortQuote?: string;
  fullTestimonial?: string;
  story?: string;
}

export interface ITestimonial extends Document {
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
  roiMetrics?: IROIMetric[];

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
  externalLinks?: IExternalLink[];

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
  consentDate?: Date;
  consentDocumentUrl?: string;
  approvedBy?: string;
  approvedAt?: Date;
  revisionNotes?: string[];
  isPublic: boolean;
  marketingUsagePermission: boolean;

  // Collection Framework
  collectionMethod?: CollectionMethod;
  collectionQuestions?: ICollectionQuestion[];
  requestSentDate?: Date;
  followUpDates?: Date[];

  // Multi-language
  originalLanguage?: string;
  translations?: ITranslation[];

  // Legacy (backward compatibility)
  productId?: string;
  industry?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  keyQuote?: string;
  caseStudy?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SUB-SCHEMAS
// ============================================

const ROIMetricSchema = new Schema<IR>({
  metric: { type: String, required: true },
  value: { type: String, required: true },
  unit: String,
}, { _id: false });

const ExternalLinkSchema = new Schema<IExternalLink>({
  type: {
    type: String,
    enum: ['youtube', 'vimeo', 'loom', 'google-drive', 'other'],
    required: true
  },
  url: { type: String, required: true },
  label: String,
}, { _id: false });

const CollectionQuestionSchema = new Schema<ICollectionQuestion>({
  id: { type: String, required: true },
  question: { type: String, required: true },
  answer: String,
  order: { type: Number, default: 0 },
}, { _id: false });

const TranslationSchema = new Schema<ITranslation>({
  language: { type: String, required: true },
  headline: String,
  shortQuote: String,
  fullTestimonial: String,
  story: String,
}, { _id: false });

// ============================================
// MAIN SCHEMA
// ============================================

const TestimonialSchema = new Schema<ITestimonial>({
  // Customer Information
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [200, 'Customer name cannot exceed 200 characters']
  },
  customerCompany: { type: String, trim: true },
  customerDesignation: { type: String, trim: true },
  customerIndustry: { type: String, trim: true },
  customerLocation: { type: String, trim: true },
  customerEmail: { type: String, trim: true },
  customerPhone: { type: String, trim: true },
  contactPermission: { type: Boolean, default: false },
  customerLinkedIn: { type: String, trim: true },
  customerPhoto: { type: String, trim: true },

  // Testimonial Content
  type: {
    type: String,
    enum: ['text', 'video', 'audio', 'image', 'screenshot',
      'social-media', 'email', 'whatsapp',
      'linkedin-recommendation', 'google-review', 'case-study'],
    required: true,
    default: 'text'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'featured', 'archived'],
    default: 'pending'
  },
  headline: { type: String, trim: true, maxlength: 200 },
  shortQuote: { type: String, trim: true, maxlength: 500 },
  fullTestimonial: { type: String, trim: true },
  story: { type: String, trim: true },
  keyResults: [{ type: String }],
  emotionalHighlight: { type: String, trim: true },
  roiMetrics: [ROIMetricSchema],

  // Before/During/After
  beforeState: { type: String, trim: true },
  duringState: { type: String, trim: true },
  afterState: { type: String, trim: true },

  // Entity Mapping
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  businessId: { type: String },
  brandId: { type: String },
  productIds: [{ type: String }],
  serviceIds: [{ type: String }],
  founderIds: [{ type: String }],
  employeeIds: [{ type: String }],
  featureIds: [{ type: String }],
  campaignTags: [{ type: String }],
  audienceTags: [{ type: String }],
  industryTags: [{ type: String }],

  // Media & Assets
  videoUrl: { type: String, trim: true },
  audioUrl: { type: String, trim: true },
  imageUrls: [{ type: String }],
  documentUrls: [{ type: String }],
  thumbnailUrl: { type: String, trim: true },
  subtitlesUrl: { type: String, trim: true },
  language: { type: String, default: 'en' },
  externalLinks: [ExternalLinkSchema],

  // Quality & Scoring
  authenticityScore: { type: Number, min: 0, max: 100 },
  emotionalImpactScore: { type: Number, min: 0, max: 100 },
  conversionPotential: { type: Number, min: 0, max: 100 },
  authorityLevel: {
    type: String,
    enum: ['executive', 'manager', 'specialist', 'individual']
  },
  detailDepth: {
    type: String,
    enum: ['brief', 'moderate', 'detailed', 'comprehensive']
  },
  specificityScore: { type: Number, min: 0, max: 100 },
  trustScore: { type: Number, min: 0, max: 100 },

  // Approval & Consent
  consentVerified: { type: Boolean, default: false },
  consentDate: Date,
  consentDocumentUrl: { type: String, trim: true },
  approvedBy: { type: String },
  approvedAt: Date,
  revisionNotes: [{ type: String }],
  isPublic: { type: Boolean, default: true },
  marketingUsagePermission: { type: Boolean, default: false },

  // Collection Framework
  collectionMethod: {
    type: String,
    enum: ['form', 'email', 'interview', 'imported']
  },
  collectionQuestions: [CollectionQuestionSchema],
  requestSentDate: Date,
  followUpDates: [Date],

  // Multi-language
  originalLanguage: { type: String },
  translations: [TranslationSchema],

  // Legacy fields (backward compatibility)
  productId: { type: String },
  industry: { type: String },
  challenge: { type: String },
  solution: { type: String },
  results: { type: String },
  keyQuote: { type: String },
  caseStudy: { type: String },

}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

TestimonialSchema.index({ companyId: 1, status: 1 });
TestimonialSchema.index({ companyId: 1, type: 1 });
TestimonialSchema.index({ companyId: 1, 'productIds': 1 });
TestimonialSchema.index({ companyId: 1, 'founderIds': 1 });
TestimonialSchema.index({ companyId: 1, 'employeeIds': 1 });
TestimonialSchema.index({ companyId: 1, 'industryTags': 1 });
TestimonialSchema.index({ status: 1, isPublic: 1 });

// ============================================
// EXPORT
// ============================================

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);