/**
 * Brand Asset Model
 *
 * Logos, favicons, social media images, and other brand assets.
 */

import mongoose, { Schema, Document } from 'mongoose';

export type AssetType =
  | 'logo'
  | 'logo-icon'
  | 'favicon'
  | 'social-og'
  | 'social-twitter'
  | 'social-linkedin'
  | 'social-instagram'
  | 'social-facebook'
  | 'email-header'
  | 'email-footer'
  | 'presentation'
  | 'document'
  | 'other';

export type AssetFormat = 'svg' | 'png' | 'jpg' | 'pdf' | 'webp' | 'ico';

export interface IBrandAsset extends Document {
  companyId: string;
  name: string;
  type: AssetType;
  description?: string;
  format: AssetFormat;
  url?: string;
  base64Data?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  isPrimary: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BrandAssetSchema = new Schema<IBrandAsset>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Asset type is required'],
      enum: [
        'logo',
        'logo-icon',
        'favicon',
        'social-og',
        'social-twitter',
        'social-linkedin',
        'social-instagram',
        'social-facebook',
        'email-header',
        'email-footer',
        'presentation',
        'document',
        'other',
      ],
    },
    description: String,
    format: {
      type: String,
      required: [true, 'Format is required'],
      enum: ['svg', 'png', 'jpg', 'pdf', 'webp', 'ico'],
    },
    url: String,
    base64Data: String,
    dimensions: {
      width: Number,
      height: Number,
    },
    fileSize: Number,
    isPrimary: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

BrandAssetSchema.index({ companyId: 1, type: 1 });
BrandAssetSchema.index({ companyId: 1, isPrimary: 1 });

export const BrandAsset = mongoose.model<IBrandAsset>('BrandAsset', BrandAssetSchema);
