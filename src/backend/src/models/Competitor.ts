/**
 * Competitor Model - Comprehensive Competitive Intelligence Framework
 */

import mongoose, { Schema, Document } from 'mongoose';

export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';
export type MarketPosition = 'leader' | 'challenger' | 'follower' | 'niche';
export type CompetitorType = 'direct' | 'indirect' | 'potential' | 'replacement';
export type PricingStrategy = 'premium' | 'competitive' | 'economy' | 'freemium' | 'unknown';

export interface ICompetitor extends Document {
  name: string;
  companyId: string;
  isActive: boolean;

  // A. Basic Information
  website?: string;
  logoUrl?: string;
  foundedYear?: number;
  headquarters?: string;
  companySize?: string;
  fundingStage?: string;
  fundingRaised?: string;
  employeeCount?: number;
  revenueEstimate?: string;

  // B. Market Position
  competitorType: CompetitorType;
  threatLevel: ThreatLevel;
  marketPosition: MarketPosition;
  marketShare?: string;
  geographicReach?: string[];
  targetAudience?: string;
  industriesServed?: string[];

  // C. Product Analysis
  primaryProduct?: string;
  productCategories?: string[];
  keyFeatures?: string[];
  pricingStrategy?: PricingStrategy;
  pricingDetails?: string;
  freeTrial?: boolean;
  demoAvailable?: boolean;

  // D. Value Proposition
  valueProposition?: string;
  tagline?: string;
  messaging?: string;
  differentiators?: string[];

  // E. Marketing Intelligence
  marketingChannels?: string[];
  contentStrategy?: string;
  seoKeywords?: string[];
  socialMediaPresence?: Record<string, string>;
  adSpendEstimate?: string;

  // F. Strengths & Weaknesses
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];

  // G. Strategic Analysis
  swotSummary?: string;
  ourAdvantages?: string[];
  ourVulnerabilities?: string[];
  recommendedStrategy?: string;
  battlecards?: string;

  // H. Competitive Intelligence
  recentNews?: string[];
  productUpdates?: string[];
  pricingChanges?: string[];
  screenshots?: string[];
  notes?: string;

  // I. Comparison Data
  featureComparison?: Record<string, boolean>;
  priceComparison?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;
}

const CompetitorSchema = new Schema<ICompetitor>({
  name: {
    type: String,
    required: [true, 'Competitor name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // A. Basic Information
  website: String,
  logoUrl: String,
  foundedYear: Number,
  headquarters: String,
  companySize: String,
  fundingStage: String,
  fundingRaised: String,
  employeeCount: Number,
  revenueEstimate: String,

  // B. Market Position
  competitorType: {
    type: String,
    enum: ['direct', 'indirect', 'potential', 'replacement'],
    default: 'direct'
  },
  threatLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    default: 'medium'
  },
  marketPosition: {
    type: String,
    enum: ['leader', 'challenger', 'follower', 'niche'],
    default: 'follower'
  },
  marketShare: String,
  geographicReach: [String],
  targetAudience: String,
  industriesServed: [String],

  // C. Product Analysis
  primaryProduct: String,
  productCategories: [String],
  keyFeatures: [String],
  pricingStrategy: {
    type: String,
    enum: ['premium', 'competitive', 'economy', 'freemium', 'unknown'],
    default: 'unknown'
  },
  pricingDetails: String,
  freeTrial: Boolean,
  demoAvailable: Boolean,

  // D. Value Proposition
  valueProposition: String,
  tagline: String,
  messaging: String,
  differentiators: [String],

  // E. Marketing Intelligence
  marketingChannels: [String],
  contentStrategy: String,
  seoKeywords: [String],
  socialMediaPresence: {
    type: Object,
    default: {}
  },
  adSpendEstimate: String,

  // F. Strengths & Weaknesses (Structured SWOT)
  strengths: [String],
  weaknesses: [String],
  opportunities: [String],
  threats: [String],

  // G. Strategic Analysis
  swotSummary: String,
  ourAdvantages: [String],
  ourVulnerabilities: [String],
  recommendedStrategy: String,
  battlecards: String,

  // H. Competitive Intelligence
  recentNews: [String],
  productUpdates: [String],
  pricingChanges: [String],
  screenshots: [String],
  notes: String,

  // I. Comparison Data
  featureComparison: {
    type: Object,
    default: {}
  },
  priceComparison: {
    type: Object,
    default: {}
  }

}, {
  timestamps: true
});

// Indexes
CompetitorSchema.index({ companyId: 1 });
CompetitorSchema.index({ companyId: 1, threatLevel: 1 });
CompetitorSchema.index({ companyId: 1, competitorType: 1 });
CompetitorSchema.index({ companyId: 1, marketPosition: 1 });

export const Competitor = mongoose.model<ICompetitor>('Competitor', CompetitorSchema);
