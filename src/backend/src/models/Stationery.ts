/**
 * Stationery Model
 *
 * Business cards, letterheads, email signatures, and other stationery items.
 */

import mongoose, { Schema, Document } from 'mongoose';

export type StationeryType =
  | 'business-card'
  | 'letterhead'
  | 'email-signature'
  | 'envelope'
  | 'memo-pad'
  | 'folder'
  | 'compliment-slip'
  | 'invoice-template'
  | 'proposal-template'
  | 'other';

export type StationeryStatus = 'draft' | 'approved' | 'archived';

export interface IStationery extends Document {
  companyId: string;
  name: string;
  type: StationeryType;
  description?: string;
  templateUrl?: string;
  previewImageUrl?: string;
  dimensions?: {
    width: number;
    height: number;
    unit: 'mm' | 'in' | 'px';
  };
  status: StationeryStatus;
  approvedBy?: string;
  approvedAt?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StationerySchema = new Schema<IStationery>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Stationery name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Stationery type is required'],
      enum: [
        'business-card',
        'letterhead',
        'email-signature',
        'envelope',
        'memo-pad',
        'folder',
        'compliment-slip',
        'invoice-template',
        'proposal-template',
        'other',
      ],
    },
    description: String,
    templateUrl: String,
    previewImageUrl: String,
    dimensions: {
      width: Number,
      height: Number,
      unit: { type: String, enum: ['mm', 'in', 'px'] },
    },
    status: {
      type: String,
      enum: ['draft', 'approved', 'archived'],
      default: 'draft',
    },
    approvedBy: String,
    approvedAt: Date,
    tags: [String],
  },
  {
    timestamps: true,
  }
);

StationerySchema.index({ companyId: 1, type: 1 });
StationerySchema.index({ companyId: 1, status: 1 });

export const Stationery = mongoose.model<IStationery>('Stationery', StationerySchema);
