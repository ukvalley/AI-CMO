/**
 * Sales Script Model
 * Comprehensive sales communication management with script types, objection handling, and playbooks
 */

import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// TYPE DEFINITIONS
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

export type FunnelStage =
  | 'awareness'
  | 'interest'
  | 'consideration'
  | 'decision'
  | 'purchase'
  | 'retention'
  | 'advocacy';

export type AudienceType =
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
  lastUsedAt?: Date;
  feedbackScore?: number;
}

export interface ISalesScript extends Document {
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
  funnelStage: FunnelStage;
  audienceType: AudienceType;
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
  reviewedAt?: Date;
  approvedAt?: Date;
  reviewComments?: string;

  // Access Control
  isPublic: boolean;
  allowedRoles?: string[];
  allowedTeams?: string[];

  // AI Generation
  aiGenerated: boolean;
  aiGenerationContext?: {
    brandVoice?: string;
    persona?: string;
    goal?: string;
    objections?: string[];
  };

  // Multi-language
  language: string;
  translations?: {
    language: string;
    title?: string;
    content?: string;
  }[];

  // Tags & Categories
  tags?: string[];
  category?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SUB-SCHEMAS
// ============================================

const QualificationQuestionSchema = new Schema<IQualificationQuestion>({
  id: { type: String, required: true },
  question: { type: String, required: true },
  purpose: String,
  followUpIfYes: String,
  followUpIfNo: String,
  order: { type: Number, default: 0 },
}, { _id: false });

const ObjectionResponseSchema = new Schema<IObjectionResponse>({
  id: { type: String, required: true },
  objection: { type: String, required: true },
  response: { type: String, required: true },
  counterQuestions: [{ type: String }],
  caseStudyReference: String,
  trustBuildingLine: String,
  ctaSuggestion: String,
  emotionalApproach: String,
  order: { type: Number, default: 0 },
}, { _id: false });

const ScriptSectionSchema = new Schema<IScriptSection>({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['opening', 'hook', 'qualification', 'pain-discovery', 'value-position', 'offer', 'objection', 'trust', 'social-proof', 'closing', 'follow-up', 'exit'],
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, default: 0 },
  isRequired: { type: Boolean, default: true },
  tips: [{ type: String }],
}, { _id: false });

const ConversationBranchSchema = new Schema<IConversationBranch>({
  id: { type: String, required: true },
  trigger: { type: String, required: true },
  response: { type: String, required: true },
  nextSection: String,
  order: { type: Number, default: 0 },
}, { _id: false });

const PerformanceMetricsSchema = new Schema<IPerformanceMetrics>({
  usageCount: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  avgConversionTime: { type: Number, default: 0 },
  lastUsedAt: Date,
  feedbackScore: { type: Number, min: 0, max: 5 },
}, { _id: false });

// ============================================
// MAIN SCHEMA
// ============================================

const SalesScriptSchema = new Schema<ISalesScript>({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Script title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: { type: String, trim: true },
  scriptType: {
    type: String,
    enum: ['cold-call', 'warm-call', 'qualification', 'discovery', 'demo', 'sales-pitch', 'follow-up', 'negotiation', 'closing', 'whatsapp', 'email', 'linkedin', 'voice-note', 'appointment', 'reactivation', 'referral', 'upselling', 'cross-selling', 'retention', 'renewal', 'customer-success', 'objection-handling'],
    required: true,
    default: 'cold-call',
  },
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

  // Product/Service Mapping
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true,
  },
  productId: String,
  serviceId: String,
  productIds: [{ type: String }],
  serviceIds: [{ type: String }],

  // Audience & Targeting
  funnelStage: {
    type: String,
    enum: ['awareness', 'interest', 'consideration', 'decision', 'purchase', 'retention', 'advocacy'],
    default: 'awareness',
  },
  audienceType: {
    type: String,
    enum: ['prospect', 'lead', 'opportunity', 'customer', 'partner', 'investor'],
    default: 'prospect',
  },
  targetIndustry: String,
  targetPersona: String,

  // Communication
  channels: [{
    type: String,
    enum: ['phone', 'whatsapp', 'linkedin', 'email', 'zoom', 'google-meet', 'in-person', 'sms', 'voice-note'],
  }],

  // Script Content
  openingLine: { type: String, trim: true },
  hook: { type: String, trim: true },
  valueProposition: { type: String, trim: true },
  offerPresentation: { type: String, trim: true },
  closingCTA: { type: String, trim: true },
  followUpCTA: { type: String, trim: true },
  exitResponse: { type: String, trim: true },

  // Structured Sections
  sections: [ScriptSectionSchema],

  // Qualification Questions
  qualificationQuestions: [QualificationQuestionSchema],

  // Objection Handling
  objectionResponses: [ObjectionResponseSchema],

  // Conversation Flow
  conversationBranches: [ConversationBranchSchema],

  // Brand Integration
  brandTone: String,
  communicationStyle: String,
  messagingGuidelines: String,

  // Playbook
  playbookId: String,
  playbookName: String,

  // Training
  trainingNotes: String,
  bestPractices: [{ type: String }],
  callExamples: [{ type: String }],
  coachingNotes: String,

  // Performance
  performanceMetrics: PerformanceMetricsSchema,

  // Version Control
  version: { type: Number, default: 1 },
  parentScriptId: String,
  revisionNotes: [{ type: String }],

  // Approval Workflow
  createdBy: String,
  reviewedBy: String,
  approvedBy: String,
  reviewedAt: Date,
  approvedAt: Date,
  reviewComments: String,

  // Access Control
  isPublic: { type: Boolean, default: true },
  allowedRoles: [{ type: String }],
  allowedTeams: [{ type: String }],

  // AI Generation
  aiGenerated: { type: Boolean, default: false },
  aiGenerationContext: {
    brandVoice: String,
    persona: String,
    goal: String,
    objections: [{ type: String }],
  },

  // Multi-language
  language: { type: String, default: 'en' },
  translations: [{
    language: String,
    title: String,
    content: String,
  }],

  // Tags & Categories
  tags: [{ type: String }],
  category: String,

}, {
  timestamps: true,
});

// ============================================
// INDEXES
// ============================================

SalesScriptSchema.index({ companyId: 1, status: 1 });
SalesScriptSchema.index({ companyId: 1, scriptType: 1 });
SalesScriptSchema.index({ companyId: 1, funnelStage: 1 });
SalesScriptSchema.index({ companyId: 1, 'productIds': 1 });
SalesScriptSchema.index({ companyId: 1, playbookId: 1 });
SalesScriptSchema.index({ status: 1, isPublic: 1 });
SalesScriptSchema.index({ companyId: 1, tags: 1 });

// ============================================
// EXPORT
// ============================================

export const SalesScript = mongoose.model<ISalesScript>('SalesScript', SalesScriptSchema);