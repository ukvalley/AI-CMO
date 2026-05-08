/**
 * Blog Model
 *
 * Blog posts with categories, tags, and publishing workflow.
 */

import mongoose, { Schema, Document } from 'mongoose';

export type BlogStatus = 'draft' | 'review' | 'published' | 'archived';

export interface IBlog extends Document {
  companyId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author?: string;
  authorId?: string;
  status: BlogStatus;
  featuredImage?: string;
  category?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  readingTime?: number;
  viewCount: number;
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      lowercase: true,
    },
    excerpt: String,
    content: String,
    author: String,
    authorId: String,
    status: {
      type: String,
      enum: ['draft', 'review', 'published', 'archived'],
      default: 'draft',
    },
    featuredImage: String,
    category: String,
    tags: [String],
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    readingTime: Number,
    viewCount: {
      type: Number,
      default: 0,
    },
    publishedAt: Date,
    scheduledAt: Date,
  },
  {
    timestamps: true,
  }
);

BlogSchema.index({ companyId: 1, slug: 1 }, { unique: true });
BlogSchema.index({ companyId: 1, status: 1 });
BlogSchema.index({ companyId: 1, category: 1 });
BlogSchema.index({ companyId: 1, tags: 1 });

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);
