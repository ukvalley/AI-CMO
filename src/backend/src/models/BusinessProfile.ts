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
  // A. Basic Info
  name: string;
  companyId: string;
  startDate?: string;
  stage: BusinessStage;
  teamSize?: number;

  // B. Overview
  description?: string;
  descriptionLong?: string;
  mission?: string;
  vision?: string;
  coreValues?: string;
  usp?: string;

  // C. Market
  primaryIndustry?: string;
  secondaryIndustries?: string;
  targetGeography?: string;
  businessModel?: string;

  // D. Offer Layer
  primaryOffering?: string;
  secondaryOfferings?: string;
  pricingModel?: string;
  averageTicketSize?: string;

  // E. Financial
  funding?: string;
  revenue?: string;
  isRevenuePublic: boolean;

  // F. Contact
  email?: string;
  phone?: string;
  website?: string;

  // G. Location
  address?: string;
  city?: string;
  country?: string;

  // Legacy fields
  industries: Industry[];
  isFounderPublic: boolean;
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
  // B. Overview
  description: String,
  descriptionLong: String,
  mission: String,
  vision: String,
  coreValues: String,
  usp: String,

  // C. Market
  primaryIndustry: String,
  secondaryIndustries: String,
  targetGeography: String,
  businessModel: {
    type: String,
    enum: ['b2b', 'b2c', 'b2b2c', 'saas', 'marketplace', 'd2c', 'freemium', 'subscription', 'hybrid']
  },

  // D. Offer Layer
  primaryOffering: String,
  secondaryOfferings: String,
  pricingModel: String,
  averageTicketSize: String,

  // E. Financial
  funding: String,
  revenue: String,
  isRevenuePublic: {
    type: Boolean,
    default: false
  },

  // Legacy fields
  teamSize: Number,
  isFounderPublic: {
    type: Boolean,
    default: true
  },

  // G. Location
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
