/**
 * Newsletter Content OS Model
 *
 * Stores newsletter content operating system data per company.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletterContentOS extends Document {
  companyId: string;
  strategies: any[];
  contentTypes: any[];
  calendars: any[];
  titles: any[];
  posts: any[];
  chunks: any[];
  exports: any[];
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterContentOSSchema = new Schema<INewsletterContentOS>(
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
    titles: { type: [Schema.Types.Mixed] as any, default: [] },
    posts: { type: [Schema.Types.Mixed] as any, default: [] },
    chunks: { type: [Schema.Types.Mixed] as any, default: [] },
    exports: { type: [Schema.Types.Mixed] as any, default: [] },
  },
  {
    timestamps: true,
  }
);

export const NewsletterContentOS = mongoose.model<INewsletterContentOS>('NewsletterContentOS', NewsletterContentOSSchema);
