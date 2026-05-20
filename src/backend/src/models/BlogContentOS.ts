/**
 * Blog Content OS Model
 *
 * Stores blog content operating system data per company.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogContentOS extends Document {
  companyId: string;
  strategies: any[];
  contentTypes: any[];
  calendars: any[];
  seoConfigs: any[];
  titles: any[];
  posts: any[];
  chunks: any[];
  exports: any[];
  structures: any[];
  contentSections: any[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogContentOSSchema = new Schema<IBlogContentOS>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
      unique: true,
    },
    strategies: { type: [Schema.Types.Mixed] as any, default: [] },
    contentTypes: { type: [Schema.Types.Mixed] as any, default: [] },
    calendars: { type: [Schema.Types.Mixed] as any, default: [] },
    seoConfigs: { type: [Schema.Types.Mixed] as any, default: [] },
    titles: { type: [Schema.Types.Mixed] as any, default: [] },
    posts: { type: [Schema.Types.Mixed] as any, default: [] },
    chunks: { type: [Schema.Types.Mixed] as any, default: [] },
    exports: { type: [Schema.Types.Mixed] as any, default: [] },
    structures: { type: [Schema.Types.Mixed] as any, default: [] },
    contentSections: { type: [Schema.Types.Mixed] as any, default: [] },
  },
  {
    timestamps: true,
  }
);

export const BlogContentOS = mongoose.model<IBlogContentOS>('BlogContentOS', BlogContentOSSchema);
