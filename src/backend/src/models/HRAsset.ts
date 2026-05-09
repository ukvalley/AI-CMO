/**
 * HR Asset Model
 *
 * HR documents, templates, forms, and branding assets.
 */

import mongoose, { Schema, Document } from 'mongoose';

// Desk & Office Items
export type DeskOfficeType =
  | 'notepad'
  | 'diary-planner'
  | 'file-folder'
  | 'document-folder'
  | 'pen-branding'
  | 'desk-name-plate';

// Legal / Formal Documents
export type LegalDocumentType =
  | 'nda'
  | 'terms-conditions'
  | 'policy-documents'
  | 'employment-contract'
  | 'service-agreement';

// Internal Office Branding
export type InternalBrandingType =
  | 'id-card-front'
  | 'id-card-back'
  | 'lanyard-design'
  | 'employee-badge'
  | 'attendance-sheet'
  | 'internal-memo'
  | 'visiting-card';

// Letters
export type LetterType =
  | 'offer-letter'
  | 'relieving-letter'
  | 'increment-letter'
  | 'termination-letter'
  | 'experience-letter'
  | 'appointment-letter'
  | 'promotion-letter'
  | 'warning-letter';

// Leave Forms
export type LeaveFormType =
  | 'full-day-leave'
  | 'short-leave'
  | 'half-day-leave'
  | 'maternity-leave'
  | 'paternity-leave'
  | 'medical-leave'
  | 'annual-leave';

// Certifications
export type CertificationType =
  | 'experience-certificate'
  | 'training-certificate'
  | 'appreciation-certificate'
  | 'completion-certificate'
  | 'internship-certificate';

// Employee Folders
export type FolderType =
  | 'employee-document-folder'
  | 'onboarding-folder'
  | 'exit-folder'
  | 'performance-folder';

// Recruitment
export type RecruitmentType =
  | 'job-description'
  | 'job-posting-template'
  | 'interview-evaluation-form'
  | 'candidate-scorecard'
  | 'offer-letter-template'
  | 'rejection-letter';

// Onboarding
export type OnboardingType =
  | 'welcome-kit'
  | 'onboarding-checklist'
  | 'orientation-presentation'
  | 'handbook'
  | 'code-of-conduct';

// Performance Management
export type PerformanceType =
  | 'appraisal-form'
  | 'kpi-template'
  | 'goal-setting-form'
  | 'feedback-form'
  | 'pip-template'; // Performance Improvement Plan

// Exit/Offboarding
export type ExitType =
  | 'exit-checklist'
  | 'handover-form'
  | 'exit-interview-form'
  | 'clearance-certificate';

// Combined HR Asset Type
export type HRAssetType =
  | DeskOfficeType
  | LegalDocumentType
  | InternalBrandingType
  | LetterType
  | LeaveFormType
  | CertificationType
  | FolderType
  | RecruitmentType
  | OnboardingType
  | PerformanceType
  | ExitType
  | 'other';

export type HRAssetStatus = 'draft' | 'approved' | 'archived';

export interface IHRAsset extends Document {
  companyId: string;
  name: string;
  type: HRAssetType;
  category: string;
  description?: string;
  templateUrl?: string;
  previewImageUrl?: string;
  sourceUrl?: string;
  base64Data?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  dimensions?: {
    width: number;
    height: number;
    unit: 'mm' | 'in' | 'px';
  };
  status: HRAssetStatus;
  approvedBy?: string;
  approvedAt?: Date;
  tags: string[];
  // Additional HR-specific fields
  department?: string;
  applicableFor?: string[];
  validFrom?: Date;
  validUntil?: Date;
  version?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HRAssetSchema = new Schema<IHRAsset>(
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
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    type: {
      type: String,
      required: [true, 'Asset type is required'],
      enum: [
        // Desk & Office Items
        'notepad',
        'diary-planner',
        'file-folder',
        'document-folder',
        'pen-branding',
        'desk-name-plate',
        // Legal / Formal Documents
        'nda',
        'terms-conditions',
        'policy-documents',
        'employment-contract',
        'service-agreement',
        // Internal Office Branding
        'id-card-front',
        'id-card-back',
        'lanyard-design',
        'employee-badge',
        'attendance-sheet',
        'internal-memo',
        'visiting-card',
        // Letters
        'offer-letter',
        'relieving-letter',
        'increment-letter',
        'termination-letter',
        'experience-letter',
        'appointment-letter',
        'promotion-letter',
        'warning-letter',
        // Leave Forms
        'full-day-leave',
        'short-leave',
        'half-day-leave',
        'maternity-leave',
        'paternity-leave',
        'medical-leave',
        'annual-leave',
        // Certifications
        'experience-certificate',
        'training-certificate',
        'appreciation-certificate',
        'completion-certificate',
        'internship-certificate',
        // Folders
        'employee-document-folder',
        'onboarding-folder',
        'exit-folder',
        'performance-folder',
        // Recruitment
        'job-description',
        'job-posting-template',
        'interview-evaluation-form',
        'candidate-scorecard',
        'offer-letter-template',
        'rejection-letter',
        // Onboarding
        'welcome-kit',
        'onboarding-checklist',
        'orientation-presentation',
        'handbook',
        'code-of-conduct',
        // Performance
        'appraisal-form',
        'kpi-template',
        'goal-setting-form',
        'feedback-form',
        'pip-template',
        // Exit
        'exit-checklist',
        'handover-form',
        'exit-interview-form',
        'clearance-certificate',
        // Other
        'other',
      ],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'desk-office',
        'legal-documents',
        'internal-branding',
        'letters',
        'leave-forms',
        'certifications',
        'folders',
        'recruitment',
        'onboarding',
        'performance',
        'exit',
        'other',
      ],
    },
    description: String,
    templateUrl: String,
    previewImageUrl: String,
    sourceUrl: String,
    base64Data: String,
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
    // HR-specific fields
    department: String,
    applicableFor: [String],
    validFrom: Date,
    validUntil: Date,
    version: String,
  },
  {
    timestamps: true,
  }
);

HRAssetSchema.index({ companyId: 1, type: 1 });
HRAssetSchema.index({ companyId: 1, category: 1 });
HRAssetSchema.index({ companyId: 1, status: 1 });

export const HRAsset = mongoose.model<IHRAsset>('HRAsset', HRAssetSchema);
