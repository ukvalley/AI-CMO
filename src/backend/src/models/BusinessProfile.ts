/**
 * Business Profile Model
 */

import mongoose, { Schema, Document } from 'mongoose';

export type BusinessStage = 'idea' | 'mvp' | 'early' | 'growth' | 'scale' | 'established';
export type Industry =
  | 'technology' | 'healthcare' | 'finance' | 'education' | 'ecommerce'
  | 'saas' | 'consulting' | 'manufacturing' | 'retail' | 'real-estate'
  | 'hospitality' | 'media' | 'non-profit' | 'legal' | 'marketing'
  | 'design' | 'food-beverage' | 'sports' | 'other';

export interface ISocialProfiles {
  linkedIn?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  tikTok?: string;
  youTube?: string;
  pinterest?: string;
  threads?: string;
  quora?: string;
  medium?: string;
  reddit?: string;
  telegram?: string;
  whatsApp?: string;
  googleBusiness?: string;
  meetup?: string;
  spotifyPodcast?: string;
  applePodcast?: string;
  website?: string;
  github?: string;
}

export interface IMapLinks {
  googleMaps?: string;
  appleMaps?: string;
  bingMaps?: string;
  hereMaps?: string;
  openStreetMap?: string;
  what3Words?: string;
}

export interface IBusinessProfile extends Document {
  name: string;
  companyId: string;
  startDate?: string;
  stage: BusinessStage;
  industries: Industry[];
  description?: string;
  mission?: string;
  vision?: string;
  coreValues?: string;
  usp?: string;
  funding?: string;
  revenue?: string;
  teamSize?: number;
  isRevenuePublic: boolean;
  isFounderPublic: boolean;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialProfiles: ISocialProfiles;
  mapLinks: IMapLinks;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessProfileSchema = new Schema<IBusinessProfile>({
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [200, 'Business name cannot exceed 200 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true,
    unique: true
  },
  startDate: String,
  stage: {
    type: String,
    enum: ['idea', 'mvp', 'early', 'growth', 'scale', 'established'],
    required: true
  },
  industries: [{
    type: String,
    enum: ['technology', 'healthcare', 'finance', 'education', 'ecommerce',
           'saas', 'consulting', 'manufacturing', 'retail', 'real-estate',
           'hospitality', 'media', 'non-profit', 'legal', 'marketing',
           'design', 'food-beverage', 'sports', 'other']
  }],
  description: String,
  mission: String,
  vision: String,
  coreValues: String,
  usp: String,
  funding: String,
  revenue: String,
  teamSize: Number,
  isRevenuePublic: {
    type: Boolean,
    default: false
  },
  isFounderPublic: {
    type: Boolean,
    default: true
  },
  address: String,
  city: String,
  country: String,
  phone: String,
  email: String,
  website: String,
  socialProfiles: {
    type: Object,
    default: {}
  },
  mapLinks: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
BusinessProfileSchema.index({ companyId: 1 }, { unique: true });

export const BusinessProfile = mongoose.model<IBusinessProfile>('BusinessProfile', BusinessProfileSchema);
