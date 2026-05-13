/**
 * FAQ Bank Models
 *
 * FAQCategory — hierarchical categories for organising FAQs
 * FAQ — comprehensive FAQ records with SEO, AI, and relationship fields
 */

import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// FAQ CATEGORY
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

export interface IFAQCategory extends Document {
  companyId: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  icon?: string;
  colour?: string;
  order: number;
  faqCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQCategorySchema = new Schema<IFAQCategory>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    parentId: {
      type: String,
      index: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    colour: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    faqCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

FAQCategorySchema.index({ companyId: 1, parentId: 1 });
FAQCategorySchema.index({ companyId: 1, slug: 1 }, { unique: true });

// Auto-generate slug from name before saving
FAQCategorySchema.pre('save', function (this: IFAQCategory) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

export const FAQCategory = mongoose.model<IFAQCategory>('FAQCategory', FAQCategorySchema);

// ============================================
// FAQ
// ============================================

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

export interface IMediaAttachment extends Document {
  url: string;
  type: string;
  description?: string;
}

const MediaAttachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

export interface IFAQ extends Document {
  companyId: string;

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
  serviceIds: string[];

  // SEO
  seoKeywords: string[];
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
  referenceLinks: string[];
  mediaAttachments: IMediaAttachment[];
  documentUrls: string[];

  // Usage Tracking
  usedIn: string[];
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;

  // Approval & Versioning
  version: number;
  approvedBy?: string;
  approvedAt?: Date;
  reviewNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },

    // Core Content
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    shortAnswer: {
      type: String,
      trim: true,
      maxlength: [300, 'Short answer cannot exceed 300 characters'],
    },
    detailedAnswer: {
      type: String,
      trim: true,
    },

    // Classification
    categoryId: {
      type: String,
      index: true,
    },
    subcategoryId: {
      type: String,
      index: true,
    },
    faqType: {
      type: String,
      enum: [
        'customer', 'sales', 'technical', 'internal', 'ai-training',
        'website', 'blog', 'newsletter', 'support', 'onboarding',
        'legal', 'hr', 'sop',
      ],
      default: 'customer',
    },
    tags: [String],

    // Status & Workflow
    status: {
      type: String,
      enum: ['draft', 'review', 'approved', 'published', 'archived'],
      default: 'draft',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    order: {
      type: Number,
      default: 0,
    },

    // Audience & Funnel
    audienceType: {
      type: String,
      enum: ['public', 'internal', 'team-specific', 'department-specific', 'admin-only'],
      default: 'public',
    },
    funnelStage: {
      type: String,
      enum: ['tofu', 'mofu', 'bofu', 'post-sale', 'general'],
      default: 'general',
    },
    department: {
      type: String,
      trim: true,
    },

    // Product/Service Mapping
    productId: {
      type: String,
      index: true,
    },
    serviceIds: [String],

    // SEO
    seoKeywords: [String],
    searchIntent: {
      type: String,
      enum: ['informational', 'navigational', 'transactional', 'commercial'],
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, 'Meta title cannot exceed 60 characters'],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
    schemaEnabled: {
      type: Boolean,
      default: true,
    },
    voiceSearchOptimised: {
      type: Boolean,
      default: false,
    },

    // AI Readiness
    aiContextWeight: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },
    aiPriority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    aiSuggestedUsage: {
      type: String,
      trim: true,
    },
    searchRelevance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Relationships
    parentFaqId: {
      type: String,
      index: true,
    },
    relatedFaqIds: [String],
    clusterId: {
      type: String,
    },

    // Media & References
    referenceLinks: [String],
    mediaAttachments: [MediaAttachmentSchema],
    documentUrls: [String],

    // Usage Tracking
    usedIn: [String],
    viewCount: {
      type: Number,
      default: 0,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    notHelpfulCount: {
      type: Number,
      default: 0,
    },

    // Approval & Versioning
    version: {
      type: Number,
      default: 1,
    },
    approvedBy: {
      type: String,
    },
    approvedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound indexes for efficient querying
FAQSchema.index({ companyId: 1, status: 1 });
FAQSchema.index({ companyId: 1, categoryId: 1 });
FAQSchema.index({ companyId: 1, faqType: 1 });
FAQSchema.index({ companyId: 1, productId: 1 });
FAQSchema.index({ companyId: 1, tags: 1 });
// Text index for full-text search
FAQSchema.index({
  title: 'text',
  question: 'text',
  answer: 'text',
  shortAnswer: 'text',
});

export const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);