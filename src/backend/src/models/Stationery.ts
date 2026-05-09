/**
 * Stationery Model
 *
 * Business cards, letterheads, email signatures, and other stationery items.
 */

import mongoose, { Schema, Document } from 'mongoose';

// Core Stationery (Must Have)
export type CoreStationery =
  | 'business-card'
  | 'letterhead'
  | 'envelope-a4'
  | 'envelope-dl'
  | 'email-signature'
  | 'presentation-template';

// Office Use Assets
export type OfficeAssets =
  | 'invoice-template'
  | 'quotation-template'
  | 'receipt-design'
  | 'purchase-order'
  | 'billing-format'
  | 'proposal-template';

// Packaging Stationery
export type PackagingStationery =
  | 'thank-you-card'
  | 'warranty-card'
  | 'instruction-manual'
  | 'product-insert-card'
  | 'branded-stickers'
  | 'packaging-tape';

// Print Stationery
export type PrintStationery =
  | 'stamps'
  | 'branding-print'
  | 'standees-print'
  | 'booth-designs'
  | 't-shirts';

// Marketing Assets
export type MarketingAssets =
  | 'newsletter-template'
  | 'brochure-pdf'
  | 'pitch-deck'
  | 'tagline'
  | 'hook-style'
  | 'standees-marketing'
  | 'marketing-collateral';

// Legacy/Other types
export type OtherStationery =
  | 'envelope'
  | 'memo-pad'
  | 'folder'
  | 'compliment-slip'
  | 'other';

// Combined Stationery Type
export type StationeryType =
  | CoreStationery
  | OfficeAssets
  | PackagingStationery
  | PrintStationery
  | MarketingAssets
  | OtherStationery;

export type StationeryStatus = 'draft' | 'approved' | 'archived';

export interface IStationery extends Document {
  companyId: string;
  name: string;
  type: StationeryType;
  description?: string;
  templateUrl?: string; // URL to the template file or base64
  previewImageUrl?: string; // URL to preview image or base64
  sourceUrl?: string; // Canva, Figma, design file URL
  base64Data?: string; // Uploaded file as base64
  fileName?: string;
  fileSize?: number;
  fileType?: string;
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
        // Core Stationery (Must Have)
        'business-card',
        'letterhead',
        'envelope-a4',
        'envelope-dl',
        'email-signature',
        'presentation-template',
        // Office Use Assets
        'invoice-template',
        'quotation-template',
        'receipt-design',
        'purchase-order',
        'billing-format',
        'proposal-template',
        // Packaging Stationery
        'thank-you-card',
        'warranty-card',
        'instruction-manual',
        'product-insert-card',
        'branded-stickers',
        'packaging-tape',
        // Print Stationery
        'stamps',
        'branding-print',
        'standees-print',
        'booth-designs',
        't-shirts',
        // Marketing Assets
        'newsletter-template',
        'brochure-pdf',
        'pitch-deck',
        'tagline',
        'hook-style',
        'standees-marketing',
        'marketing-collateral',
        // Legacy/Other
        'envelope',
        'memo-pad',
        'folder',
        'compliment-slip',
        'other',
      ],
    },
    description: String,
    templateUrl: String,
    previewImageUrl: String,
    sourceUrl: String, // Canva, Figma design file URL
    base64Data: String, // For uploaded files
    fileName: String,
    fileSize: Number,
    fileType: String,
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
