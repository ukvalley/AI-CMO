/**
 * Persona Model - Full Framework
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IPersona extends Document {
  name: string;
  companyId: string;
  icpId: string;
  isActive: boolean;

  // A. Demographics
  ageRange?: string;
  gender?: string;
  jobTitle?: string;
  seniorityLevel?: string;
  department?: string;
  industry?: string;

  // B. Professional Profile
  experience?: string;
  skills?: string[];
  toolsUsed?: string[];
  certifications?: string[];

  // C. Psychographics
  goals?: string[];
  painPoints?: string[];
  motivations?: string[];
  values?: string[];
  fears?: string[];

  // D. Behavioral
  decisionMakingStyle?: string;
  researchHabits?: string;
  contentPreferences?: string[];
  communicationChannel?: string[];

  // E. Day in the Life
  dailyChallenges?: string[];
  successMetrics?: string[];
  kpi?: string[];

  // F. Buying Behavior
  budgetAuthority: boolean;
  influenceLevel?: string;
  buyingRole?: string;

  // G. Bio & Narrative
  bio?: string;
  quote?: string;
  objections?: string[];

  // H. Linked Products
  productIds?: string[];

  createdAt: Date;
  updatedAt: Date;
}

const PersonaSchema = new Schema<IPersona>({
  name: {
    type: String,
    required: [true, 'Persona name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  icpId: {
    type: String,
    required: [true, 'ICP ID is required'],
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // A. Demographics
  ageRange: String,
  gender: String,
  jobTitle: String,
  seniorityLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'c-level', 'founder']
  },
  department: String,
  industry: String,

  // B. Professional Profile
  experience: String,
  skills: [String],
  toolsUsed: [String],
  certifications: [String],

  // C. Psychographics
  goals: [String],
  painPoints: [String],
  motivations: [String],
  values: [String],
  fears: [String],

  // D. Behavioral
  decisionMakingStyle: {
    type: String,
    enum: ['analytical', 'intuitive', 'collaborative', 'authoritative']
  },
  researchHabits: String,
  contentPreferences: [String],
  communicationChannel: [String],

  // E. Day in the Life
  dailyChallenges: [String],
  successMetrics: [String],
  kpi: [String],

  // F. Buying Behavior
  budgetAuthority: {
    type: Boolean,
    default: false
  },
  influenceLevel: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  buyingRole: {
    type: String,
    enum: ['champion', 'decision-maker', 'influencer', 'end-user', 'blocker']
  },

  // G. Bio & Narrative
  bio: String,
  quote: String,
  objections: [String],

  // H. Linked Products
  productIds: [String]
}, {
  timestamps: true
});

PersonaSchema.index({ companyId: 1 });
PersonaSchema.index({ companyId: 1, icpId: 1 });
PersonaSchema.index({ companyId: 1, isActive: 1 });

export const Persona = mongoose.model<IPersona>('Persona', PersonaSchema);
