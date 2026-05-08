/**
 * Product & Product Category Models
 */

import mongoose, { Schema, Document } from 'mongoose';

export type ProductStatus = 'active' | 'draft' | 'discontinued';
export type AudienceType = 'b2b' | 'b2c' | 'both';

export interface IProductCategory extends Document {
  name: string;
  companyId: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  name: string;
  companyId: string;
  categoryId?: string;
  price?: number;
  status: ProductStatus;
  audienceType: AudienceType;
  usp?: string;
  description?: string;
  features?: string[];
  icpIds: string[];
  personaIds: string[];
  marketingCopy?: string;
  // Media & Resources
  images?: string[];           // Array of image URLs
  catalogPdfUrl?: string;      // PDF catalog URL
  videoUrls?: string[];        // YouTube video URLs
  createdAt: Date;
  updatedAt: Date;
}

const ProductCategorySchema = new Schema<IProductCategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  description: String
}, {
  timestamps: true
});

ProductCategorySchema.index({ companyId: 1 });

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  categoryId: {
    type: String,
    index: true
  },
  price: Number,
  status: {
    type: String,
    enum: ['active', 'draft', 'discontinued'],
    default: 'draft'
  },
  audienceType: {
    type: String,
    enum: ['b2b', 'b2c', 'both'],
    required: true
  },
  usp: String,
  description: String,
  features: [String],
  icpIds: [String],
  personaIds: [String],
  marketingCopy: String,
  // Media & Resources
  images: [String],           // Array of image URLs
  catalogPdfUrl: String,      // PDF catalog URL
  videoUrls: [String]         // YouTube video URLs
}, {
  timestamps: true
});

ProductSchema.index({ companyId: 1, categoryId: 1 });
ProductSchema.index({ companyId: 1, status: 1 });

export const ProductCategory = mongoose.model<IProductCategory>('ProductCategory', ProductCategorySchema);
export const Product = mongoose.model<IProduct>('Product', ProductSchema);
