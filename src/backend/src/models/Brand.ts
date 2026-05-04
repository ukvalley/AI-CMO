/**
 * Brand Model
 *
 * Singleton brand identity per company.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IBrandApprovalEntry {
  id: string;
  step: string;
  approvedBy: string;
  timestamp: string;
  notes?: string;
}

export interface IBrand extends Document {
  companyId: string;

  // Visual Identity
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;

  // Brand Purpose
  purposeStatement?: string;
  purposeAlignsVision: boolean;
  purposeAlignsValueProp: boolean;
  purposeAlignsPositioning: boolean;
  purposeApprovedByCEO: boolean;

  // Brand Personality
  personalityPrimary: string[];
  personalitySecondary: string[];
  personalityApprovedByCEO: boolean;

  // Brand Voice
  voiceDescription?: string;
  voiceDos: string[];
  voiceDonts: string[];
  voiceApprovedByCEO: boolean;
  voiceApprovedByMarketing: boolean;

  // Emotional Promise
  promiseStatement?: string;
  promiseBelievable: boolean;
  promiseDefensible: boolean;
  promiseDeliverable: boolean;
  emotionalApprovedByCEO: boolean;

  // Visual Identity
  visualDescription?: string;
  visualInspirationLinks: string[];
  visualApprovedByCEO: boolean;

  // Differentiation
  diffBrandSymbols: string[];
  diffSignatureExpressions: string[];
  diffLockedElements: string[];
  diffApprovedByCEO: boolean;

  // Brand Guardrails
  guardrailsDescription?: string;
  guardApprovedByCEO: boolean;

  // Alignment
  alignOnboardingChecklist: string[];
  alignLeadershipChecklist: string[];
  alignApprovedByHR: boolean;
  alignApprovedByCEO: boolean;

  // Validation
  validScalability: number;
  validCulturalSensitivity: number;
  validLongevity: number;
  validFinalLockByCEO: boolean;

  // Rules
  rulesVoiceForbiddenWords: string[];
  rulesDesignForbiddenPatterns: string[];

  // Approval Log
  approvalLog: IBrandApprovalEntry[];
  masterDocVersion: number;

  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>({
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true,
    unique: true,
  },

  // Visual Identity
  primaryColor: { type: String, default: '#7C6BF0' },
  secondaryColor: { type: String, default: '#1E293B' },
  accentColor: { type: String, default: '#22D3EE' },
  headingFont: { type: String, default: 'inter' },
  bodyFont: { type: String, default: 'inter' },

  // Brand Purpose
  purposeStatement: String,
  purposeAlignsVision: { type: Boolean, default: false },
  purposeAlignsValueProp: { type: Boolean, default: false },
  purposeAlignsPositioning: { type: Boolean, default: false },
  purposeApprovedByCEO: { type: Boolean, default: false },

  // Brand Personality
  personalityPrimary: [String],
  personalitySecondary: [String],
  personalityApprovedByCEO: { type: Boolean, default: false },

  // Brand Voice
  voiceDescription: String,
  voiceDos: [String],
  voiceDonts: [String],
  voiceApprovedByCEO: { type: Boolean, default: false },
  voiceApprovedByMarketing: { type: Boolean, default: false },

  // Emotional Promise
  promiseStatement: String,
  promiseBelievable: { type: Boolean, default: false },
  promiseDefensible: { type: Boolean, default: false },
  promiseDeliverable: { type: Boolean, default: false },
  emotionalApprovedByCEO: { type: Boolean, default: false },

  // Visual Identity
  visualDescription: String,
  visualInspirationLinks: [String],
  visualApprovedByCEO: { type: Boolean, default: false },

  // Differentiation
  diffBrandSymbols: [String],
  diffSignatureExpressions: [String],
  diffLockedElements: [String],
  diffApprovedByCEO: { type: Boolean, default: false },

  // Brand Guardrails
  guardrailsDescription: String,
  guardApprovedByCEO: { type: Boolean, default: false },

  // Alignment
  alignOnboardingChecklist: [String],
  alignLeadershipChecklist: [String],
  alignApprovedByHR: { type: Boolean, default: false },
  alignApprovedByCEO: { type: Boolean, default: false },

  // Validation
  validScalability: { type: Number, default: 5 },
  validCulturalSensitivity: { type: Number, default: 5 },
  validLongevity: { type: Number, default: 5 },
  validFinalLockByCEO: { type: Boolean, default: false },

  // Rules
  rulesVoiceForbiddenWords: [String],
  rulesDesignForbiddenPatterns: [String],

  // Approval Log
  approvalLog: [{
    id: String,
    step: String,
    approvedBy: String,
    timestamp: String,
    notes: String,
  }],
  masterDocVersion: { type: Number, default: 0 },
}, {
  timestamps: true,
});

BrandSchema.index({ companyId: 1 });

export const Brand = mongoose.model<IBrand>('Brand', BrandSchema);
