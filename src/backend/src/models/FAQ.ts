/**
 * FAQ Model
 *
 * Frequently asked questions with categories.
 */

import mongoose, { Schema, Document } from 'mongoose';

export type FAQStatus = 'draft' | 'published' | 'archived';

export interface IFAQ extends Document {
  companyId: string;
  question: string;
  answer: string;
  category?: string;
  status: FAQStatus;
  order: number;
  tags: string[];
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
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
    category: String,
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    order: {
      type: Number,
      default: 0,
    },
    tags: [String],
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
  },
  {
    timestamps: true,
  }
);

FAQSchema.index({ companyId: 1, status: 1 });
FAQSchema.index({ companyId: 1, category: 1 });

export const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);
