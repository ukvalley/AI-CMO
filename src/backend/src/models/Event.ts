/**
 * Event Management Models
 *
 * EventCategory — hierarchical categories for organising events
 * Event — comprehensive event records with scheduling, classification, and AI fields
 * EventSession — agenda/session structure within an event
 * EventResource — files, links, and materials within an event or session
 */

import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// EVENT CATEGORY
// ============================================

export type EventCategoryStatus = 'active' | 'archived';

export interface IEventCategory extends Document {
  companyId: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  icon?: string;
  colour?: string;
  order: number;
  eventCount: number;
  status: EventCategoryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EventCategorySchema = new Schema<IEventCategory>(
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
    eventCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

EventCategorySchema.index({ companyId: 1, parentId: 1 });
EventCategorySchema.index({ companyId: 1, slug: 1 }, { unique: true });

EventCategorySchema.pre('save', function (this: IEventCategory) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

export const EventCategory = mongoose.model<IEventCategory>('EventCategory', EventCategorySchema);

// ============================================
// SUB-SCHEMAS
// ============================================

const EventAttachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, default: 'file' },
    size: { type: Number },
  },
  { _id: false }
);

const ChecklistItemSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

// ============================================
// EVENT
// ============================================

export type EventStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived' | 'cancelled';
export type EventVisibility = 'private' | 'internal' | 'public';
export type EventPriority = 'low' | 'medium' | 'high' | 'critical';
export type EventMode = 'online' | 'offline' | 'hybrid';
export type EventType = 'meeting' | 'workshop' | 'conference' | 'webinar' | 'training' | 'product_launch' | 'campaign_event' | 'sop_training' | 'team_activity' | 'onboarding' | 'hr_activity' | 'other';
export type EventAudienceType = 'public' | 'internal' | 'team_specific' | 'department_specific' | 'admin_only';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface IEvent extends Document {
  companyId: string;

  // A. Core
  title: string;
  slug: string;
  shortDescription?: string;
  detailedDescription?: string;
  summary?: string;
  eventType: EventType;
  tags: string[];
  status: EventStatus;
  priority: EventPriority;
  visibility: EventVisibility;

  // B. Scheduling
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  timeZone?: string;
  duration?: string;
  eventMode: EventMode;
  location?: string;
  meetingLink?: string;
  organizer?: string;
  coordinator?: string;

  // C. Classification
  categoryId?: string;
  audienceType: EventAudienceType;
  departmentId?: string;
  teamId?: string;
  productId?: string;
  serviceId?: string;
  sopId?: string;
  campaignId?: string;

  // D. Learning & Objectives
  objectives: string[];
  expectedOutcomes: string[];
  prerequisites: string[];
  relatedEventIds: string[];
  relatedCourseIds: string[];
  relatedSopIds: string[];

  // E. Media
  thumbnail?: string;
  banner?: string;
  attachments: typeof EventAttachmentSchema[];
  documentUrls: string[];

  // F. SEO
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords: string[];

  // G. Versioning & Approval
  version: number;
  reviewNotes?: string;
  approvalStatus?: ApprovalStatus;

  // H. Stats
  viewCount: number;
  rsvpCount: number;
  attendanceCount: number;

  // I. Flags
  isFeatured: boolean;
  aiGenerated: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },

    // A. Core
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Event title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    shortDescription: { type: String, trim: true, maxlength: 500 },
    detailedDescription: { type: String, trim: true },
    summary: { type: String, trim: true },
    eventType: {
      type: String,
      enum: ['meeting', 'workshop', 'conference', 'webinar', 'training', 'product_launch', 'campaign_event', 'sop_training', 'team_activity', 'onboarding', 'hr_activity', 'other'],
      default: 'meeting',
    },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['draft', 'review', 'approved', 'published', 'archived', 'cancelled'],
      default: 'draft',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    visibility: {
      type: String,
      enum: ['private', 'internal', 'public'],
      default: 'internal',
    },

    // B. Scheduling
    eventDate: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    timeZone: { type: String, trim: true },
    duration: { type: String, trim: true },
    eventMode: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      default: 'online',
    },
    location: { type: String, trim: true },
    meetingLink: { type: String, trim: true },
    organizer: { type: String, trim: true },
    coordinator: { type: String, trim: true },

    // C. Classification
    categoryId: { type: String, index: true },
    audienceType: {
      type: String,
      enum: ['public', 'internal', 'team_specific', 'department_specific', 'admin_only'],
      default: 'internal',
    },
    departmentId: { type: String },
    teamId: { type: String },
    productId: { type: String },
    serviceId: { type: String },
    sopId: { type: String },
    campaignId: { type: String },

    // D. Learning & Objectives
    objectives: { type: [String], default: [] },
    expectedOutcomes: { type: [String], default: [] },
    prerequisites: { type: [String], default: [] },
    relatedEventIds: { type: [String], default: [] },
    relatedCourseIds: { type: [String], default: [] },
    relatedSopIds: { type: [String], default: [] },

    // E. Media
    thumbnail: { type: String, trim: true },
    banner: { type: String, trim: true },
    attachments: { type: [EventAttachmentSchema], default: [] },
    documentUrls: { type: [String], default: [] },

    // F. SEO
    metaTitle: { type: String, trim: true, maxlength: 60 },
    metaDescription: { type: String, trim: true, maxlength: 160 },
    seoKeywords: { type: [String], default: [] },

    // G. Versioning & Approval
    version: { type: Number, default: 1 },
    reviewNotes: { type: String, trim: true },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
    },

    // H. Stats
    viewCount: { type: Number, default: 0 },
    rsvpCount: { type: Number, default: 0 },
    attendanceCount: { type: Number, default: 0 },

    // I. Flags
    isFeatured: { type: Boolean, default: false },
    aiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EventSchema.index({ companyId: 1, status: 1 });
EventSchema.index({ companyId: 1, categoryId: 1 });
EventSchema.index({ companyId: 1, slug: 1 }, { unique: true });
EventSchema.index({ title: 'text', shortDescription: 'text', detailedDescription: 'text' });

EventSchema.pre('save', function (this: IEvent) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);

// ============================================
// EVENT SESSION
// ============================================

export type SessionStatus = 'draft' | 'review' | 'approved' | 'published' | 'cancelled';

export interface IEventSession extends Document {
  companyId: string;
  eventId: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
  status: SessionStatus;
  duration?: string;
  speakerInfo?: string;
  objectives: string[];
  attachments: typeof EventAttachmentSchema[];
  checklistItems: typeof ChecklistItemSchema[];
  aiNotes?: string;
  aiSummary?: string;
  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSessionSchema = new Schema<IEventSession>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },
    eventId: {
      type: String,
      required: [true, 'Event ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: [200, 'Session title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'review', 'approved', 'published', 'cancelled'],
      default: 'draft',
    },
    duration: { type: String, trim: true },
    speakerInfo: { type: String, trim: true },
    objectives: { type: [String], default: [] },
    attachments: { type: [EventAttachmentSchema], default: [] },
    checklistItems: { type: [ChecklistItemSchema], default: [] },
    aiNotes: { type: String, trim: true },
    aiSummary: { type: String, trim: true },
    aiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EventSessionSchema.index({ companyId: 1, eventId: 1 });
EventSessionSchema.index({ eventId: 1, order: 1 });

EventSessionSchema.pre('save', function (this: IEventSession) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

export const EventSession = mongoose.model<IEventSession>('EventSession', EventSessionSchema);

// ============================================
// EVENT RESOURCE
// ============================================

export type ResourceType = 'presentation' | 'pdf' | 'docx' | 'video' | 'audio' | 'image' | 'url' | 'other';
export type ResourceStatus = 'draft' | 'active' | 'archived';

export interface IEventResource extends Document {
  companyId: string;
  eventId: string;
  sessionId?: string;
  title: string;
  type: ResourceType;
  url?: string;
  description?: string;
  order: number;
  status: ResourceStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EventResourceSchema = new Schema<IEventResource>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },
    eventId: {
      type: String,
      required: [true, 'Event ID is required'],
      index: true,
    },
    sessionId: {
      type: String,
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      maxlength: [200, 'Resource title cannot exceed 200 characters'],
    },
    type: {
      type: String,
      enum: ['presentation', 'pdf', 'docx', 'video', 'audio', 'image', 'url', 'other'],
      default: 'url',
    },
    url: { type: String, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

EventResourceSchema.index({ companyId: 1, eventId: 1 });
EventResourceSchema.index({ eventId: 1, sessionId: 1 });
EventResourceSchema.index({ sessionId: 1, order: 1 });

export const EventResource = mongoose.model<IEventResource>('EventResource', EventResourceSchema);