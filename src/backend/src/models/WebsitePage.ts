/**
 * Website Page Model
 *
 * Landing pages, home, about, contact, and other website pages.
 */

import mongoose, { Schema, Document } from 'mongoose';

export type PageType = 'home' | 'about' | 'contact' | 'landing' | 'product' | 'service' | 'blog' | 'custom';

export type PageStatus = 'draft' | 'published' | 'archived';

export interface IWebsitePage extends Document {
  companyId: string;
  title: string;
  slug: string;
  type: PageType;
  status: PageStatus;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  featuredImage?: string;
  template?: string;
  isHomepage: boolean;
  order: number;
  parentId?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WebsitePageSchema = new Schema<IWebsitePage>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      required: [true, 'Page type is required'],
      enum: ['home', 'about', 'contact', 'landing', 'product', 'service', 'blog', 'custom'],
      default: 'custom',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    content: String,
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    featuredImage: String,
    template: String,
    isHomepage: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    parentId: String,
    publishedAt: Date,
  },
  {
    timestamps: true,
  }
);

WebsitePageSchema.index({ companyId: 1, slug: 1 }, { unique: true });
WebsitePageSchema.index({ companyId: 1, type: 1 });
WebsitePageSchema.index({ companyId: 1, status: 1 });

export const WebsitePage = mongoose.model<IWebsitePage>('WebsitePage', WebsitePageSchema);
