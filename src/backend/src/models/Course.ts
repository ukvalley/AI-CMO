/**
 * Course Management Models
 *
 * CourseCategory — hierarchical categories for organising courses
 * Course — comprehensive course records with enterprise mapping, SEO, and AI fields
 * CourseChapter — chapter structure within a course
 * CourseLesson — individual lessons within a chapter with quiz questions and attachments
 */

import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// COURSE CATEGORY
// ============================================

export type CourseCategoryStatus = 'active' | 'archived';

export interface ICourseCategory extends Document {
  companyId: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  icon?: string;
  colour?: string;
  order: number;
  courseCount: number;
  status: CourseCategoryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CourseCategorySchema = new Schema<ICourseCategory>(
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
    courseCount: {
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

CourseCategorySchema.index({ companyId: 1, parentId: 1 });
CourseCategorySchema.index({ companyId: 1, slug: 1 }, { unique: true });

CourseCategorySchema.pre('save', function (this: ICourseCategory) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

export const CourseCategory = mongoose.model<ICourseCategory>('CourseCategory', CourseCategorySchema);

// ============================================
// COURSE
// ============================================

export type CourseStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';
export type CourseVisibility = 'private' | 'internal' | 'public';
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type CourseFormat = 'video' | 'text' | 'live' | 'hybrid' | 'workshop';
export type CourseAudienceType = 'public' | 'internal' | 'team-specific' | 'department-specific' | 'admin-only';

export interface ICourse extends Document {
  companyId: string;

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
  approvedAt?: Date;
  reviewNotes?: string;

  // K. Stats
  viewCount: number;
  enrolmentCount: number;
  completionCount: number;

  // L. Flags
  aiGenerated: boolean;
  isFeatured: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },

    // A. Core
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    detailedDescription: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },

    // B. Classification
    categoryId: {
      type: String,
      index: true,
    },
    tags: [String],
    format: {
      type: String,
      enum: ['video', 'text', 'live', 'hybrid', 'workshop'],
      default: 'text',
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'approved', 'published', 'archived'],
      default: 'draft',
    },
    visibility: {
      type: String,
      enum: ['private', 'internal', 'public'],
      default: 'internal',
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner',
    },
    language: {
      type: String,
      default: 'English',
    },

    // C. Duration & Effort
    duration: {
      type: String,
      trim: true,
    },
    estimatedCompletionTime: {
      type: String,
      trim: true,
    },
    lessonCount: {
      type: Number,
      default: 0,
    },

    // D. Media
    thumbnail: {
      type: String,
      trim: true,
    },
    banner: {
      type: String,
      trim: true,
    },
    videoUrls: [String],

    // E. Instructor / Creator
    instructor: {
      type: String,
      trim: true,
    },
    creatorId: {
      type: String,
    },

    // F. Enterprise Mapping
    department: {
      type: String,
      trim: true,
    },
    productId: {
      type: String,
    },
    serviceId: {
      type: String,
    },
    sopId: {
      type: String,
    },
    audienceType: {
      type: String,
      enum: ['public', 'internal', 'team-specific', 'department-specific', 'admin-only'],
      default: 'internal',
    },

    // G. Learning Design
    learningObjectives: [String],
    outcomes: [String],
    skillLevel: {
      type: String,
      trim: true,
    },
    prerequisites: [String],
    relatedCourseIds: [String],
    relatedFaqIds: [String],
    relatedSopIds: [String],

    // H. Internal
    internalNotes: {
      type: String,
      trim: true,
    },

    // I. SEO
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
    seoKeywords: [String],

    // J. Versioning & Approval
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

    // K. Stats
    viewCount: {
      type: Number,
      default: 0,
    },
    enrolmentCount: {
      type: Number,
      default: 0,
    },
    completionCount: {
      type: Number,
      default: 0,
    },

    // L. Flags
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CourseSchema.index({ companyId: 1, status: 1 });
CourseSchema.index({ companyId: 1, categoryId: 1 });
CourseSchema.index({ companyId: 1, slug: 1 }, { unique: true });
CourseSchema.index({ title: 'text', shortDescription: 'text', detailedDescription: 'text' });

CourseSchema.pre('save', function (this: ICourse) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

export const Course = mongoose.model<ICourse>('Course', CourseSchema);

// ============================================
// QUIZ QUESTION (shared by chapters and lessons)
// ============================================

export interface IQuizQuestion extends Document {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const QuizQuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: [String],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

// ============================================
// COURSE CHAPTER
// ============================================

export type ChapterStatus = 'draft' | 'review' | 'approved' | 'published';

export interface ICourseChapter extends Document {
  companyId: string;
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
  quizQuestions: IQuizQuestion[];
  internalNotes?: string;
  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseChapterSchema = new Schema<ICourseChapter>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Chapter title is required'],
      trim: true,
      maxlength: [200, 'Chapter title cannot exceed 200 characters'],
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
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'approved', 'published'],
      default: 'draft',
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    lessonCount: {
      type: Number,
      default: 0,
    },
    learningObjectives: [String],
    quizQuestions: [QuizQuestionSchema],
    internalNotes: {
      type: String,
      trim: true,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CourseChapterSchema.index({ companyId: 1, courseId: 1 });
CourseChapterSchema.index({ courseId: 1, order: 1 });

CourseChapterSchema.pre('save', function (this: ICourseChapter) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

export const CourseChapter = mongoose.model<ICourseChapter>('CourseChapter', CourseChapterSchema);

// ============================================
// COURSE LESSON
// ============================================

export type LessonFormat = 'video' | 'text' | 'audio' | 'pdf' | 'presentation' | 'interactive' | 'quiz';
export type LessonStatus = 'draft' | 'review' | 'approved' | 'published';

export interface ILessonAttachment extends Document {
  url: string;
  name: string;
  type: string;
  size?: number;
}

const LessonAttachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number },
  },
  { _id: false }
);

export interface ICourseLesson extends Document {
  companyId: string;
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
  quizQuestions: IQuizQuestion[];
  attachments: ILessonAttachment[];
  isFree: boolean;
  aiGenerated: boolean;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseLessonSchema = new Schema<ICourseLesson>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },
    chapterId: {
      type: String,
      required: [true, 'Chapter ID is required'],
      index: true,
    },
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
      maxlength: [200, 'Lesson title cannot exceed 200 characters'],
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
    content: {
      type: String,
      trim: true,
    },
    format: {
      type: String,
      enum: ['video', 'text', 'audio', 'pdf', 'presentation', 'interactive', 'quiz'],
      default: 'text',
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'approved', 'published'],
      default: 'draft',
    },
    duration: {
      type: String,
      trim: true,
    },
    videoUrls: [String],
    documentUrls: [String],
    thumbnail: {
      type: String,
      trim: true,
    },
    learningObjectives: [String],
    keyTakeaways: [String],
    quizQuestions: [QuizQuestionSchema],
    attachments: [LessonAttachmentSchema],
    isFree: {
      type: Boolean,
      default: false,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    internalNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

CourseLessonSchema.index({ companyId: 1, courseId: 1 });
CourseLessonSchema.index({ courseId: 1, chapterId: 1 });
CourseLessonSchema.index({ chapterId: 1, order: 1 });

CourseLessonSchema.pre('save', function (this: ICourseLesson) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

export const CourseLesson = mongoose.model<ICourseLesson>('CourseLesson', CourseLessonSchema);