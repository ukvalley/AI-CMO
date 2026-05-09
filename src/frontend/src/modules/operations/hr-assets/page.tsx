/**
 * HR Assets Module
 *
 * Comprehensive HR asset management including:
 * - Desk & Office Items: Notepad, Diary/Planner, File folder, Document folder, Pen branding, Desk name plate
 * - Legal / Formal Documents: NDA, Terms & Conditions, Policy documents, Employment contracts
 * - Internal Office Branding: ID Card (front/back), Lanyard design, Employee badge, Attendance sheet, Internal memo
 * - Letters: Offer letter, Relieving letter, Increment letter, Termination letter, Experience letter, Appointment letter
 * - Leave Forms: Full day, Short leave, Half day, Maternity/Paternity leave
 * - Certifications: Experience, Training, Appreciation, Completion, Internship certificates
 * - Folders: Employee document folder, Onboarding folder, Exit folder, Performance folder
 * - Recruitment: Job descriptions, Interview forms, Scorecards, Offer/Rejection letters
 * - Onboarding: Welcome kit, Handbook, Code of conduct, Orientation materials
 * - Performance: Appraisal forms, KPI templates, Goal setting, Feedback forms
 * - Exit: Exit checklists, Handover forms, Clearance certificates
 *
 * Supports file upload, dimension presets, and URL for templates and previews.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Link, X, Check, Trash2, Edit, Plus, Eye, Copy, Download, Clock, Archive, Briefcase, Users, Award, FileCheck, FolderOpen } from 'lucide-react';
import { hrAssetApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import { cn } from '@/utils/cn';
import type { HRAsset } from '@/types/entities';

// ============================================
// HR ASSET TYPES & TAGS
// ============================================

interface AssetTypeOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DimensionPreset {
  label: string;
  width: number;
  height: number;
  unit: 'mm' | 'in' | 'px';
}

// Desk & Office Items
const DESK_OFFICE_ITEMS: AssetTypeOption[] = [
  { value: 'notepad', label: 'Notepad' },
  { value: 'diary-planner', label: 'Diary / Planner' },
  { value: 'file-folder', label: 'File Folder' },
  { value: 'document-folder', label: 'Document Folder' },
  { value: 'pen-branding', label: 'Pen Branding' },
  { value: 'desk-name-plate', label: 'Desk Name Plate' },
];

// Legal / Formal Documents
const LEGAL_DOCUMENTS: AssetTypeOption[] = [
  { value: 'nda', label: 'NDA (Non-disclosure Agreement)' },
  { value: 'terms-conditions', label: 'Terms & Conditions Format' },
  { value: 'policy-documents', label: 'Policy Documents' },
  { value: 'employment-contract', label: 'Employment Contract' },
  { value: 'service-agreement', label: 'Service Agreement' },
];

// Internal Office Branding
const INTERNAL_BRANDING: AssetTypeOption[] = [
  { value: 'id-card-front', label: 'ID Card (Front)' },
  { value: 'id-card-back', label: 'ID Card (Back)' },
  { value: 'lanyard-design', label: 'Lanyard Design' },
  { value: 'employee-badge', label: 'Employee Badge' },
  { value: 'attendance-sheet', label: 'Attendance Sheet Format' },
  { value: 'internal-memo', label: 'Internal Memo Template' },
  { value: 'visiting-card', label: 'Visiting Card' },
];

// Letters
const LETTERS: AssetTypeOption[] = [
  { value: 'offer-letter', label: 'Offer Letter' },
  { value: 'relieving-letter', label: 'Relieving Letter' },
  { value: 'increment-letter', label: 'Increment Letter' },
  { value: 'termination-letter', label: 'Termination Letter' },
  { value: 'experience-letter', label: 'Experience Letter' },
  { value: 'appointment-letter', label: 'Appointment Letter' },
  { value: 'promotion-letter', label: 'Promotion Letter' },
  { value: 'warning-letter', label: 'Warning Letter' },
];

// Leave Forms
const LEAVE_FORMS: AssetTypeOption[] = [
  { value: 'full-day-leave', label: 'Full Day Leave Form' },
  { value: 'short-leave', label: 'Short Leave Form' },
  { value: 'half-day-leave', label: 'Half Day Leave Form' },
  { value: 'maternity-leave', label: 'Maternity Leave Form' },
  { value: 'paternity-leave', label: 'Paternity Leave Form' },
  { value: 'medical-leave', label: 'Medical Leave Form' },
  { value: 'annual-leave', label: 'Annual Leave Form' },
];

// Certifications
const CERTIFICATIONS: AssetTypeOption[] = [
  { value: 'experience-certificate', label: 'Experience Certificate' },
  { value: 'training-certificate', label: 'Training Certificate' },
  { value: 'appreciation-certificate', label: 'Appreciation Certificate' },
  { value: 'completion-certificate', label: 'Completion Certificate' },
  { value: 'internship-certificate', label: 'Internship Certificate' },
];

// Folders
const FOLDERS: AssetTypeOption[] = [
  { value: 'employee-document-folder', label: 'Employee Document Folder' },
  { value: 'onboarding-folder', label: 'Onboarding Folder' },
  { value: 'exit-folder', label: 'Exit Folder' },
  { value: 'performance-folder', label: 'Performance Folder' },
];

// Recruitment
const RECRUITMENT: AssetTypeOption[] = [
  { value: 'job-description', label: 'Job Description (JD)' },
  { value: 'job-posting-template', label: 'Job Posting Template' },
  { value: 'interview-evaluation-form', label: 'Interview Evaluation Form' },
  { value: 'candidate-scorecard', label: 'Candidate Scorecard' },
  { value: 'offer-letter-template', label: 'Offer Letter Template' },
  { value: 'rejection-letter', label: 'Rejection Letter' },
];

// Onboarding
const ONBOARDING: AssetTypeOption[] = [
  { value: 'welcome-kit', label: 'Welcome Kit' },
  { value: 'onboarding-checklist', label: 'Onboarding Checklist' },
  { value: 'orientation-presentation', label: 'Orientation Presentation' },
  { value: 'handbook', label: 'Employee Handbook' },
  { value: 'code-of-conduct', label: 'Code of Conduct' },
];

// Performance Management
const PERFORMANCE: AssetTypeOption[] = [
  { value: 'appraisal-form', label: 'Appraisal Form' },
  { value: 'kpi-template', label: 'KPI Template' },
  { value: 'goal-setting-form', label: 'Goal Setting Form' },
  { value: 'feedback-form', label: 'Feedback Form' },
  { value: 'pip-template', label: 'Performance Improvement Plan (PIP)' },
];

// Exit / Offboarding
const EXIT: AssetTypeOption[] = [
  { value: 'exit-checklist', label: 'Exit Checklist' },
  { value: 'handover-form', label: 'Handover Form' },
  { value: 'exit-interview-form', label: 'Exit Interview Form' },
  { value: 'clearance-certificate', label: 'Clearance Certificate' },
];

// Other
const OTHER_ASSETS: AssetTypeOption[] = [
  { value: 'other', label: 'Other HR Asset' },
];

// Combined list for select dropdown (grouped by category)
const HR_ASSET_TYPES: AssetTypeOption[] = [
  { value: '_header_desk', label: '━━ Desk & Office Items ━━', disabled: true },
  ...DESK_OFFICE_ITEMS,
  { value: '_header_legal', label: '━━ Legal / Formal Documents ━━', disabled: true },
  ...LEGAL_DOCUMENTS,
  { value: '_header_branding', label: '━━ Internal Office Branding ━━', disabled: true },
  ...INTERNAL_BRANDING,
  { value: '_header_letters', label: '━━ Letters ━━', disabled: true },
  ...LETTERS,
  { value: '_header_leave', label: '━━ Leave Forms ━━', disabled: true },
  ...LEAVE_FORMS,
  { value: '_header_certifications', label: '━━ Certifications ━━', disabled: true },
  ...CERTIFICATIONS,
  { value: '_header_folders', label: '━━ Employee Folders ━━', disabled: true },
  ...FOLDERS,
  { value: '_header_recruitment', label: '━━ Recruitment ━━', disabled: true },
  ...RECRUITMENT,
  { value: '_header_onboarding', label: '━━ Onboarding ━━', disabled: true },
  ...ONBOARDING,
  { value: '_header_performance', label: '━━ Performance Management ━━', disabled: true },
  ...PERFORMANCE,
  { value: '_header_exit', label: '━━ Exit / Offboarding ━━', disabled: true },
  ...EXIT,
  { value: '_header_other', label: '━━ Other ━━', disabled: true },
  ...OTHER_ASSETS,
];

// Categories for filtering
const HR_ASSET_CATEGORIES: Record<string, string> = {
  'desk-office': 'Desk & Office Items',
  'legal-documents': 'Legal / Formal Documents',
  'internal-branding': 'Internal Office Branding',
  'letters': 'Letters',
  'leave-forms': 'Leave Forms',
  'certifications': 'Certifications',
  'folders': 'Employee Folders',
  'recruitment': 'Recruitment',
  'onboarding': 'Onboarding',
  'performance': 'Performance Management',
  'exit': 'Exit / Offboarding',
  'other': 'Other',
};

// Map types to categories
const TYPE_TO_CATEGORY: Record<string, string> = {
  // Desk & Office
  'notepad': 'desk-office',
  'diary-planner': 'desk-office',
  'file-folder': 'desk-office',
  'document-folder': 'desk-office',
  'pen-branding': 'desk-office',
  'desk-name-plate': 'desk-office',
  // Legal
  'nda': 'legal-documents',
  'terms-conditions': 'legal-documents',
  'policy-documents': 'legal-documents',
  'employment-contract': 'legal-documents',
  'service-agreement': 'legal-documents',
  // Branding
  'id-card-front': 'internal-branding',
  'id-card-back': 'internal-branding',
  'lanyard-design': 'internal-branding',
  'employee-badge': 'internal-branding',
  'attendance-sheet': 'internal-branding',
  'internal-memo': 'internal-branding',
  'visiting-card': 'internal-branding',
  // Letters
  'offer-letter': 'letters',
  'relieving-letter': 'letters',
  'increment-letter': 'letters',
  'termination-letter': 'letters',
  'experience-letter': 'letters',
  'appointment-letter': 'letters',
  'promotion-letter': 'letters',
  'warning-letter': 'letters',
  // Leave
  'full-day-leave': 'leave-forms',
  'short-leave': 'leave-forms',
  'half-day-leave': 'leave-forms',
  'maternity-leave': 'leave-forms',
  'paternity-leave': 'leave-forms',
  'medical-leave': 'leave-forms',
  'annual-leave': 'leave-forms',
  // Certifications
  'experience-certificate': 'certifications',
  'training-certificate': 'certifications',
  'appreciation-certificate': 'certifications',
  'completion-certificate': 'certifications',
  'internship-certificate': 'certifications',
  // Folders
  'employee-document-folder': 'folders',
  'onboarding-folder': 'folders',
  'exit-folder': 'folders',
  'performance-folder': 'folders',
  // Recruitment
  'job-description': 'recruitment',
  'job-posting-template': 'recruitment',
  'interview-evaluation-form': 'recruitment',
  'candidate-scorecard': 'recruitment',
  'offer-letter-template': 'recruitment',
  'rejection-letter': 'recruitment',
  // Onboarding
  'welcome-kit': 'onboarding',
  'onboarding-checklist': 'onboarding',
  'orientation-presentation': 'onboarding',
  'handbook': 'onboarding',
  'code-of-conduct': 'onboarding',
  // Performance
  'appraisal-form': 'performance',
  'kpi-template': 'performance',
  'goal-setting-form': 'performance',
  'feedback-form': 'performance',
  'pip-template': 'performance',
  // Exit
  'exit-checklist': 'exit',
  'handover-form': 'exit',
  'exit-interview-form': 'exit',
  'clearance-certificate': 'exit',
  // Other
  'other': 'other',
};

// Dimension presets by type
const DIMENSION_PRESETS: Record<string, DimensionPreset[]> = {
  'id-card-front': [
    { label: 'Standard CR80 - 85.6 × 54 mm', width: 85.6, height: 54, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'id-card-back': [
    { label: 'Standard CR80 - 85.6 × 54 mm', width: 85.6, height: 54, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'lanyard-design': [
    { label: 'Standard Width - 20 mm', width: 20, height: 900, unit: 'mm' },
    { label: 'Wide - 25 mm', width: 25, height: 900, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'visiting-card': [
    { label: 'Standard (US) - 89 × 51 mm', width: 89, height: 51, unit: 'mm' },
    { label: 'Standard (EU) - 85 × 55 mm', width: 85, height: 55, unit: 'mm' },
    { label: 'Square - 65 × 65 mm', width: 65, height: 65, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'letterhead': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'US Letter - 8.5 × 11 in', width: 8.5, height: 11, unit: 'in' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'notepad': [
    { label: 'A5 - 148 × 210 mm', width: 148, height: 210, unit: 'mm' },
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'Pocket - 90 × 140 mm', width: 90, height: 140, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'diary-planner': [
    { label: 'A5 - 148 × 210 mm', width: 148, height: 210, unit: 'mm' },
    { label: 'B5 - 176 × 250 mm', width: 176, height: 250, unit: 'mm' },
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'file-folder': [
    { label: 'A4 - 220 × 310 mm', width: 220, height: 310, unit: 'mm' },
    { label: 'Letter - 9.5 × 12.5 in', width: 9.5, height: 12.5, unit: 'in' },
    { label: 'Legal - 10 × 15 in', width: 10, height: 15, unit: 'in' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'document-folder': [
    { label: 'A4 - 220 × 310 mm', width: 220, height: 310, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'pen-branding': [
    { label: 'Standard Pen - 140 × 10 mm', width: 140, height: 10, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'desk-name-plate': [
    { label: 'Small - 200 × 50 mm', width: 200, height: 50, unit: 'mm' },
    { label: 'Medium - 250 × 60 mm', width: 250, height: 60, unit: 'mm' },
    { label: 'Large - 300 × 70 mm', width: 300, height: 70, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'employee-badge': [
    { label: 'Standard - 65 × 100 mm', width: 65, height: 100, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'attendance-sheet': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'A3 - 297 × 420 mm', width: 297, height: 420, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'internal-memo': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'Half A4 - 210 × 148 mm', width: 210, height: 148, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'offer-letter': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'US Letter - 8.5 × 11 in', width: 8.5, height: 11, unit: 'in' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'relieving-letter': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'US Letter - 8.5 × 11 in', width: 8.5, height: 11, unit: 'in' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'increment-letter': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'experience-letter': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'US Letter - 8.5 × 11 in', width: 8.5, height: 11, unit: 'in' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'experience-certificate': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'Certificate - 8.5 × 11 in', width: 8.5, height: 11, unit: 'in' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'training-certificate': [
    { label: 'A4 Landscape - 297 × 210 mm', width: 297, height: 210, unit: 'mm' },
    { label: 'A4 Portrait - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'certificate': [
    { label: 'A4 Landscape - 297 × 210 mm', width: 297, height: 210, unit: 'mm' },
    { label: 'A4 Portrait - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
  'presentation-template': [
    { label: 'Standard (16:9) - 1920 × 1080 px', width: 1920, height: 1080, unit: 'px' },
    { label: 'Standard (4:3) - 1024 × 768 px', width: 1024, height: 768, unit: 'px' },
    { label: 'Custom', width: 0, height: 0, unit: 'px' },
  ],
  'default': [
    { label: 'A4 - 210 × 297 mm', width: 210, height: 297, unit: 'mm' },
    { label: 'A5 - 148 × 210 mm', width: 148, height: 210, unit: 'mm' },
    { label: 'US Letter - 8.5 × 11 in', width: 8.5, height: 11, unit: 'in' },
    { label: 'Custom', width: 0, height: 0, unit: 'mm' },
  ],
};

// Tags
const HR_ASSET_TAGS = [
  // Usage
  { value: 'print', label: 'Print Ready' },
  { value: 'digital', label: 'Digital' },
  { value: 'print-digital', label: 'Print + Digital' },
  // Category
  { value: 'desk-office', label: 'Desk & Office' },
  { value: 'legal', label: 'Legal' },
  { value: 'branding', label: 'Branding' },
  { value: 'letters', label: 'Letters' },
  { value: 'leave', label: 'Leave' },
  { value: 'certificates', label: 'Certificates' },
  { value: 'folders', label: 'Folders' },
  { value: 'recruitment', label: 'Recruitment' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'performance', label: 'Performance' },
  { value: 'exit', label: 'Exit' },
  // Lifecycle
  { value: 'pre-employment', label: 'Pre-employment' },
  { value: 'employment', label: 'Employment' },
  { value: 'post-employment', label: 'Post-employment' },
  // Confidentiality
  { value: 'confidential', label: 'Confidential' },
  { value: 'internal-only', label: 'Internal Only' },
  { value: 'public', label: 'Public' },
  // Status
  { value: 'approved', label: 'Approved' },
  { value: 'draft', label: 'Draft' },
  { value: 'needs-review', label: 'Needs Review' },
  // Required
  { value: 'mandatory', label: 'Mandatory' },
  { value: 'optional', label: 'Optional' },
];

// ============================================
// COMPONENT: HR Asset Card
// ============================================

function HRAssetCard({
  item,
  onEdit,
  onDelete,
}: {
  item: HRAsset;
  onEdit: (item: HRAsset) => void;
  onDelete: (id: string) => void;
}) {
  const [imageError, setImageError] = useState(false);

  const getStatusIcon = () => {
    switch (item.status) {
      case 'approved':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-slate-400" />;
      default:
        return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusLabel = () => {
    switch (item.status) {
      case 'approved':
        return 'Approved';
      case 'archived':
        return 'Archived';
      default:
        return 'Draft';
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'approved':
        return 'text-green-400';
      case 'archived':
        return 'text-slate-400';
      default:
        return 'text-amber-400';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const previewUrl = item.previewImageUrl || item.base64Data;
  const category = TYPE_TO_CATEGORY[item.type] || 'other';
  const categoryLabel = HR_ASSET_CATEGORIES[category] || category;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-colors">
      {/* Preview */}
      <div className="aspect-video bg-slate-800/50 relative group">
        {previewUrl && !imageError ? (
          <img
            src={previewUrl}
            alt={item.name}
            className="w-full h-full object-contain p-4"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">📄</div>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {(item.templateUrl || item.base64Data) && (
            <>
              <a
                href={item.templateUrl || item.base64Data || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                title="View Template"
              >
                <Eye className="w-5 h-5" />
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(item.templateUrl || '')}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                title="Copy Template URL"
              >
                <Copy className="w-5 h-5" />
              </button>
            </>
          )}
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-purple-500 hover:bg-purple-400 rounded-lg text-white"
              title="Open Design File (Canva/Figma)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </a>
          )}
          <button
            onClick={() => onEdit(item)}
            className="p-2 bg-primary-500 hover:bg-primary-400 rounded-lg text-slate-900"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 bg-red-500 hover:bg-red-400 rounded-lg text-white"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-200 truncate">{item.name}</h3>
            <p className="text-xs text-slate-500">
              {HR_ASSET_TYPES.find(t => t.value === item.type)?.label || item.type}
            </p>
            <p className="text-xs text-primary-400 mt-0.5">{categoryLabel}</p>
          </div>
          <span className={`flex items-center gap-1 text-xs ${getStatusColor()}`}>
            {getStatusIcon()}
            {getStatusLabel()}
          </span>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded"
              >
                {HR_ASSET_TAGS.find(t => t.value === tag)?.label || tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-slate-500">+{item.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
          <span>{formatFileSize(item.fileSize)}</span>
          {item.dimensions?.width && item.dimensions?.height && (
            <span>{item.dimensions.width}×{item.dimensions.height} {item.dimensions.unit}</span>
          )}
        </div>

        {/* Source Links */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {(item.base64Data || item.templateUrl) && (
            <span className="flex items-center gap-1">
              <Upload className="w-3 h-3" />
              <span>Template</span>
            </span>
          )}
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-primary-400 hover:text-primary-300"
            >
              <span>Design File</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENT: HR Asset Form Modal
// ============================================

function HRAssetFormModal({
  isOpen,
  onClose,
  onSave,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  item?: HRAsset | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    description: '',
    templateUrl: '',
    previewImageUrl: '',
    sourceUrl: '',
    status: 'draft' as 'draft' | 'approved' | 'archived',
    tags: [] as string[],
    dimensions: { width: '', height: '', unit: 'mm' as 'mm' | 'in' | 'px' },
    department: '',
    version: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        type: item.type || '',
        category: item.category || '',
        description: item.description || '',
        templateUrl: item.templateUrl || '',
        previewImageUrl: item.previewImageUrl || '',
        sourceUrl: item.sourceUrl || '',
        status: item.status || 'draft',
        tags: item.tags || [],
        dimensions: {
          width: item.dimensions?.width?.toString() || '',
          height: item.dimensions?.height?.toString() || '',
          unit: item.dimensions?.unit || 'mm',
        },
        department: item.department || '',
        version: item.version || '',
      });
      if (item.base64Data) {
        setPreviewUrl(item.base64Data);
      }
    } else {
      setFormData({
        name: '',
        type: '',
        category: '',
        description: '',
        templateUrl: '',
        previewImageUrl: '',
        sourceUrl: '',
        status: 'draft',
        tags: [],
        dimensions: { width: '', height: '', unit: 'mm' },
        department: '',
        version: '',
      });
      setSelectedFile(null);
      setPreviewUrl('');
    }
  }, [item, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.type) return;

    setIsUploading(true);

    const data: any = {
      ...formData,
      category: TYPE_TO_CATEGORY[formData.type] || 'other',
      dimensions: formData.dimensions.width && formData.dimensions.height
        ? {
            width: parseInt(formData.dimensions.width),
            height: parseInt(formData.dimensions.height),
            unit: formData.dimensions.unit,
          }
        : undefined,
    };

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        data.base64Data = reader.result;
        data.fileName = selectedFile.name;
        data.fileSize = selectedFile.size;
        data.fileType = selectedFile.type;
        data.templateUrl = reader.result;
        onSave(data);
        setIsUploading(false);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      onSave(data);
      setIsUploading(false);
    }
  };

  const toggleTag = (tagValue: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagValue)
        ? prev.tags.filter(t => t !== tagValue)
        : [...prev.tags, tagValue],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-200">
            {item ? 'Edit HR Asset' : 'Add HR Asset'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Upload Asset File
              <span className="text-slate-500 font-normal ml-2">- or use URL below</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors',
                selectedFile
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.ai,.psd,.sketch,.fig,.svg,.png,.jpg,.webp,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="text-center">
                  {previewUrl && selectedFile.type.startsWith('image/') ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-24 object-contain mx-auto mb-3 rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-primary-400" />
                    </div>
                  )}
                  <p className="text-slate-200 font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="mt-2 text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-300 font-medium text-sm">Click to upload file</p>
                  <p className="text-xs text-slate-500 mt-1">
                    PDF, DOC, PPT, Excel, Images, Design files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-slate-900 text-xs text-slate-500 uppercase">Or</span>
            </div>
          </div>

          {/* Template URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Template URL
              <span className="text-slate-500 font-normal"> - Link to download the template</span>
            </label>
            <input
              type="url"
              value={formData.templateUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, templateUrl: e.target.value }))}
              placeholder="https://drive.google.com/... or https://cdn.example.com/template.pdf"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Preview Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Preview Image URL
              <span className="text-slate-500 font-normal"> - Thumbnail preview</span>
            </label>
            <input
              type="url"
              value={formData.previewImageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, previewImageUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Source Design URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Source Design URL
              <span className="text-slate-500 font-normal"> - Canva, Figma, Google Drive, etc.</span>
            </label>
            <input
              type="url"
              value={formData.sourceUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
              placeholder="https://www.figma.com/file/... or https://www.canva.com/design/..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Link to the editable design file for future updates
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Asset Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Employee ID Card Template"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Asset Type <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => {
                const newType = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  type: newType,
                  category: TYPE_TO_CATEGORY[newType] || 'other',
                  dimensions: { width: '', height: '', unit: 'mm' }
                }));
              }}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            >
              <option value="">Select type...</option>
              {HR_ASSET_TYPES.map(type => (
                <option
                  key={type.value}
                  value={type.value}
                  disabled={type.disabled}
                  className={type.disabled ? 'text-slate-500 font-semibold bg-slate-800' : ''}
                >
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            >
              <option value="">All Departments</option>
              <option value="hr">HR</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="operations">Operations</option>
              <option value="finance">Finance</option>
              <option value="legal">Legal</option>
              <option value="customer-success">Customer Success</option>
              <option value="product">Product</option>
              <option value="design">Design</option>
            </select>
          </div>

          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Version
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
              placeholder="e.g., v1.0"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            >
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Dimensions Preset */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dimensions Preset
            </label>
            <select
              value={formData.type && DIMENSION_PRESETS[formData.type]
                ? `${formData.dimensions.width}x${formData.dimensions.height}_${formData.dimensions.unit}`
                : 'custom'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'custom') {
                  setFormData(prev => ({
                    ...prev,
                    dimensions: { width: '', height: '', unit: 'mm' }
                  }));
                } else {
                  const presets = DIMENSION_PRESETS[formData.type] || DIMENSION_PRESETS['default'];
                  const preset = presets.find(p => `${p.width}x${p.height}_${p.unit}` === value);
                  if (preset) {
                    setFormData(prev => ({
                      ...prev,
                      dimensions: {
                        width: preset.width.toString(),
                        height: preset.height.toString(),
                        unit: preset.unit
                      }
                    }));
                  }
                }
              }}
              disabled={!formData.type}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!formData.type ? 'Select asset type first...' : 'Select preset...'}
              </option>
              {(formData.type && DIMENSION_PRESETS[formData.type]
                ? DIMENSION_PRESETS[formData.type]
                : DIMENSION_PRESETS['default']
              ).map((preset) => (
                <option key={`${preset.width}x${preset.height}_${preset.unit}`} value={`${preset.width}x${preset.height}_${preset.unit}`}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Dimensions */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Custom Dimensions
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={formData.dimensions.width}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dimensions: { ...prev.dimensions, width: e.target.value }
                }))}
                placeholder="Width"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
              />
              <input
                type="number"
                value={formData.dimensions.height}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dimensions: { ...prev.dimensions, height: e.target.value }
                }))}
                placeholder="Height"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
              />
              <select
                value={formData.dimensions.unit}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dimensions: { ...prev.dimensions, unit: e.target.value as any }
                }))}
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
              >
                <option value="mm">mm</option>
                <option value="in">in</option>
                <option value="px">px</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this asset..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {HR_ASSET_TAGS.map(tag => {
                const isSelected = formData.tags.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    onClick={() => toggleTag(tag.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm transition-colors',
                      isSelected
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-slate-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.name || !formData.type || (!selectedFile && !formData.templateUrl && !item) || isUploading}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-medium rounded-lg flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {item ? 'Save Changes' : 'Add HR Asset'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function HRAssetsPage() {
  const { user } = useAuthStore();
  const { activeCompanyId: storeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [items, setItems] = useState<HRAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HRAsset | null>(null);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Load HR assets
  useEffect(() => {
    if (!companyId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const loadItems = async () => {
      setIsLoading(true);
      try {
        const response = await hrAssetApi.getAll(companyId);
        if (response.data) {
          setItems(response.data as HRAsset[]);
        }
      } catch (error) {
        console.error('Failed to load HR assets:', error);
      }
      setIsLoading(false);
    };

    loadItems();
  }, [companyId]);

  const handleCreate = async (data: any) => {
    if (!companyId) return;

    try {
      const response = await hrAssetApi.create({
        ...data,
        companyId,
      });

      if (response.data) {
        setItems(prev => [...prev, response.data as HRAsset]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to create HR asset:', error);
    }
  };

  const handleUpdate = async (id: string, data: Partial<HRAsset>) => {
    try {
      const response = await hrAssetApi.update(id, data);
      if (response.data) {
        setItems(prev =>
          prev.map(item => (item.id === id ? (response.data as HRAsset) : item))
        );
        setIsModalOpen(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Failed to update HR asset:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this HR asset?')) return;
    try {
      const response = await hrAssetApi.delete(id);
      if (!response.error) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete HR asset:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
    const matchesType = !typeFilter || item.type === typeFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category || 'other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {} as Record<string, HRAsset[]>);

  // Category display order
  const categoryOrder = [
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
    'other'
  ];

  // Stats
  const stats = {
    total: items.length,
    approved: items.filter(i => i.status === 'approved').length,
    draft: items.filter(i => i.status === 'draft').length,
    archived: items.filter(i => i.status === 'archived').length,
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Please select a company to manage HR assets.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-200">HR Assets</h1>
            <p className="text-slate-400 text-sm">
              Documents, templates, forms, and branding materials for HR
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-slate-900 font-medium rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Add HR Asset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-200">{stats.total}</p>
          <p className="text-sm text-slate-500">Total Assets</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
          <p className="text-sm text-slate-500">Approved</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-amber-400">{stats.draft}</p>
          <p className="text-sm text-slate-500">Draft</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-400">{stats.archived}</p>
          <p className="text-sm text-slate-500">Archived</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search HR assets..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setTypeFilter('');
          }}
          className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
        >
          <option value="">All Categories</option>
          <option value="desk-office">Desk & Office Items</option>
          <option value="legal-documents">Legal Documents</option>
          <option value="internal-branding">Internal Branding</option>
          <option value="letters">Letters</option>
          <option value="leave-forms">Leave Forms</option>
          <option value="certifications">Certifications</option>
          <option value="folders">Employee Folders</option>
          <option value="recruitment">Recruitment</option>
          <option value="onboarding">Onboarding</option>
          <option value="performance">Performance</option>
          <option value="exit">Exit / Offboarding</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
        >
          <option value="">All Types</option>
          {HR_ASSET_TYPES
            .filter(type => !type.disabled && (!categoryFilter || TYPE_TO_CATEGORY[type.value] === categoryFilter))
            .map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-primary-500 outline-none"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="approved">Approved</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-xl">
          <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">No HR assets yet</h3>
          <p className="text-slate-500 mb-4">Upload your first HR asset to get started</p>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-400 text-slate-900 font-medium rounded-lg"
          >
            Add HR Asset
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {categoryOrder
            .filter(category => groupedItems[category]?.length > 0)
            .map((category) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                {HR_ASSET_CATEGORIES[category] || category}
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full">
                  {groupedItems[category].length}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupedItems[category].map(item => (
                  <HRAssetCard
                    key={item.id}
                    item={item}
                    onEdit={(i) => {
                      setEditingItem(i);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <HRAssetFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={(data) => {
          if (editingItem) {
            handleUpdate(editingItem.id, data);
          } else {
            handleCreate(data);
          }
        }}
        item={editingItem}
      />
    </div>
  );
}
