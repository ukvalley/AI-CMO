/**
 * Newsletter Model
 *
 * Email campaigns with templates and scheduling.
 */

import mongoose, { Schema, Document } from 'mongoose';

export type NewsletterStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'archived';

export type NewsletterType = 'regular' | 'automation' | 'template';

export interface INewsletter extends Document {
  companyId: string;
  name: string;
  subject: string;
  preheader?: string;
  type: NewsletterType;
  status: NewsletterStatus;
  template?: string;
  content?: string;
  htmlContent?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  recipientList?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  openCount: number;
  clickCount: number;
  recipientCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Newsletter name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject line is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    preheader: String,
    type: {
      type: String,
      enum: ['regular', 'automation', 'template'],
      default: 'regular',
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sending', 'sent', 'archived'],
      default: 'draft',
    },
    template: String,
    content: String,
    htmlContent: String,
    fromName: String,
    fromEmail: String,
    replyTo: String,
    recipientList: String,
    scheduledAt: Date,
    sentAt: Date,
    openCount: {
      type: Number,
      default: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

NewsletterSchema.index({ companyId: 1, status: 1 });
NewsletterSchema.index({ companyId: 1, type: 1 });

export const Newsletter = mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
