/**
 * Founder Model
 */

import mongoose, { Schema, Document } from 'mongoose';

export type AssetType =
  | 'headshot' | 'profilePhoto' | 'signature' | 'businessCard'
  | 'emailSignature' | 'bioPdf' | 'resume' | 'speakerReel' | 'custom';

export type ResponsibilityArea =
  | 'vision' | 'tech' | 'sales' | 'marketing' | 'operations' | 'finance' | 'product' | 'hr';

export interface IFounderAsset {
  id: string;
  type: AssetType;
  name: string;
  url?: string;
  base64Data?: string;
  createdAt: string;
}

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

export interface IFounder extends Document {
  name: string;
  companyId: string;
  title?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  workAnniversary?: string;
  expertise?: string[];
  responsibilityArea?: ResponsibilityArea;
  bio?: string;
  socialProfiles: ISocialProfiles;
  assets: IFounderAsset[];
  createdAt: Date;
  updatedAt: Date;
}

const FounderSchema = new Schema<IFounder>({
  name: {
    type: String,
    required: [true, 'Founder name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  title: String,
  email: String,
  phone: String,
  city: String,
  country: String,
  dateOfBirth: String,
  workAnniversary: String,
  expertise: [String],
  responsibilityArea: {
    type: String,
    enum: ['vision', 'tech', 'sales', 'marketing', 'operations', 'finance', 'product', 'hr']
  },
  bio: String,
  socialProfiles: {
    type: Object,
    default: {}
  },
  assets: {
    type: [{
      id: String,
      type: {
        type: String,
        enum: ['headshot', 'profilePhoto', 'signature', 'businessCard', 'emailSignature', 'bioPdf', 'resume', 'speakerReel', 'custom']
      },
      name: String,
      url: String,
      base64Data: String,
      createdAt: String
    }],
    default: []
  }
}, {
  timestamps: true
});

FounderSchema.index({ companyId: 1 });

export const Founder = mongoose.model<IFounder>('Founder', FounderSchema);
