/**
 * ICP (Ideal Customer Profile) Model - Full Framework
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IICP extends Document {
  name: string;
  companyId: string;
  description?: string;
  isActive: boolean;

  // A. Firmographics
  industry?: string;
  companySize?: string;
  location?: string;
  revenueRange?: string;
  fundingStage?: string;
  employeeCount?: string;
  yearsInBusiness?: number;

  // B. Technographics
  techStack?: string[];
  toolsUsed?: string[];
  platforms?: string[];

  // C. Behavioral Traits
  buyingProcess?: string;
  decisionTimeframe?: string;
  budgetAuthority?: string;
  priceSensitivity?: string;

  // D. Psychographics
  businessGoals?: string[];
  challenges?: string[];
  painPoints?: string[];
  priorities?: string[];

  // E. Activation Criteria
  triggerEvents?: string[];
  fitScore?: number;
  priority?: string;

  // F. Linked Personas
  personaIds?: string[];

  createdAt: Date;
  updatedAt: Date;
}

const ICPSchema = new Schema<IICP>({
  name: {
    type: String,
    required: [true, 'ICP name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  },

  // A. Firmographics
  industry: String,
  companySize: String,
  location: String,
  revenueRange: String,
  fundingStage: {
    type: String,
    enum: ['bootstrapped', 'seed', 'series-a', 'series-b', 'series-c', 'ipo', 'enterprise']
  },
  employeeCount: String,
  yearsInBusiness: Number,

  // B. Technographics
  techStack: [String],
  toolsUsed: [String],
  platforms: [String],

  // C. Behavioral Traits
  buyingProcess: String,
  decisionTimeframe: String,
  budgetAuthority: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  priceSensitivity: {
    type: String,
    enum: ['low', 'medium', 'high']
  },

  // D. Psychographics
  businessGoals: [String],
  challenges: [String],
  painPoints: [String],
  priorities: [String],

  // E. Activation Criteria
  triggerEvents: [String],
  fitScore: {
    type: Number,
    min: 0,
    max: 100
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high']
  },

  // F. Linked Personas
  personaIds: [String]
}, {
  timestamps: true
});

ICPSchema.index({ companyId: 1 });
ICPSchema.index({ companyId: 1, isActive: 1 });

export const ICP = mongoose.model<IICP>('ICP', ICPSchema);
