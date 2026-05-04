/**
 * SOP Constants
 *
 * Categories, statuses, default 20-section structured template, and
 * badge colour maps used across the SOP module.
 */

import type {
  SOPSectionDef,
  SOPStatus,
  SOPPriority,
  SOPAccessLevel,
  SOPCategory,
} from '@/types/entities';

// ============================================
// CATEGORIES
// ============================================

export const SOP_CATEGORIES: SOPCategory[] = [
  'Operations',
  'Sales',
  'HR',
  'IT',
  'Finance',
  'Marketing',
  'Customer Service',
  'Quality',
  'Safety',
  'Compliance',
  'Legal',
  'Healthcare',
  'Hospitality',
  'Manufacturing',
];

// ============================================
// STATUSES
// ============================================

export const SOP_STATUS_LABELS: Record<SOPStatus, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  approved: 'Approved',
  published: 'Published',
  archived: 'Archived',
};

export const SOP_STATUS_BADGE: Record<SOPStatus, string> = {
  draft: 'bg-slate-700/60 text-slate-300 border-slate-600',
  in_review: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  approved: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  published: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  archived: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
};

// ============================================
// PRIORITY
// ============================================

export const SOP_PRIORITY_LABELS: Record<SOPPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const SOP_PRIORITY_BADGE: Record<SOPPriority, string> = {
  low: 'bg-slate-700/60 text-slate-300 border-slate-600',
  medium: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  high: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  critical: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
};

// ============================================
// ACCESS LEVEL
// ============================================

export const SOP_ACCESS_LABELS: Record<SOPAccessLevel, string> = {
  public: 'Public',
  internal: 'Internal',
  confidential: 'Confidential',
  restricted: 'Restricted',
};

// ============================================
// DEFAULT 20-SECTION TEMPLATE
// (Mirrors the structured SOP template used in ProcessPro)
// ============================================

export const DEFAULT_SOP_SECTIONS: SOPSectionDef[] = [
  {
    key: 'versionHistory',
    label: 'Version History',
    type: 'versionHistory',
    systemGenerated: true,
    tableColumns: [
      { key: 'versionNo', label: 'Version No.' },
      { key: 'date', label: 'Date' },
      { key: 'reasonForChanges', label: 'Reason for changes' },
      { key: 'changesMade', label: 'Changes made' },
      { key: 'author', label: 'Author' },
      { key: 'approvedBy', label: 'Approved by' },
    ],
  },
  {
    key: 'reviewProcedure',
    label: 'Review Procedure',
    type: 'richText',
    required: true,
    placeholder:
      'e.g. This SOP shall be reviewed annually or upon any material change to the process. The Process Owner is responsible for initiating reviews.',
  },
  {
    key: 'purpose',
    label: 'Purpose',
    type: 'richText',
    required: true,
    placeholder:
      'Define the purpose and the compliance standards this SOP is aligned with (e.g. ISO 9001 / ISO 27001).',
  },
  {
    key: 'scope',
    label: 'Scope',
    type: 'richText',
    required: true,
    placeholder:
      'These procedures apply to all relevant operations, equipment, systems and departments involved in the execution of the defined process within the organisation.',
  },
  {
    key: 'rolesResponsibilities',
    label: 'Roles and Responsibilities',
    type: 'table',
    required: true,
    tableColumns: [
      { key: 'role', label: 'Role' },
      { key: 'responsibility', label: 'Responsibility' },
    ],
  },
  {
    key: 'keywordsDefinitions',
    label: 'Keywords and Definitions',
    type: 'table',
    tableColumns: [
      { key: 'keyword', label: 'Keyword' },
      { key: 'definition', label: 'Definition' },
    ],
  },
  {
    key: 'riskIdentification',
    label: 'Risk Identification, Analysis and Mitigation',
    type: 'richText',
    placeholder:
      'Operational, process and external risks. Risk mitigation strategies, controls and contingency measures.',
  },
  {
    key: 'procedures',
    label: 'Procedures',
    type: 'table',
    required: true,
    tableColumns: [
      { key: 'procedureName', label: 'Procedure Name' },
      { key: 'task', label: 'Task' },
      { key: 'personResponsible', label: 'Person Responsible' },
    ],
  },
  {
    key: 'flowchart',
    label: 'Flow chart',
    type: 'image',
    placeholder:
      'Upload or link to a flowchart that presents a structured visual overview of the process.',
  },
  {
    key: 'troubleshooting',
    label: 'Troubleshooting Procedures',
    type: 'richText',
    placeholder:
      'Procedures to ensure incidents are properly reported, investigated, escalated and resolved.',
  },
  {
    key: 'checklists',
    label: 'Checklists',
    type: 'richText',
    placeholder: 'Applicable checklists that support process control and compliance.',
  },
  {
    key: 'serviceContinuity',
    label: 'Service Continuity',
    type: 'richText',
    placeholder:
      'Backup and restoration procedures to ensure service availability and continuity during and after incidents.',
  },
  {
    key: 'escalations',
    label: 'Escalations',
    type: 'richText',
    placeholder:
      'Escalation mechanisms to ensure service issues are promptly reported and addressed at the appropriate authority level.',
  },
  {
    key: 'recordManagement',
    label: 'Record Management',
    type: 'richText',
    placeholder:
      'How warranties, checklists and maintenance records are securely stored and retained.',
  },
  {
    key: 'maintenance',
    label: 'Maintenance',
    type: 'richText',
    placeholder:
      'Preventive and corrective maintenance schedules for equipment and maintenance tasks.',
  },
  {
    key: 'equipment',
    label: 'Equipment, Hardware and Software',
    type: 'richText',
    placeholder:
      'All equipment, hardware and software components utilised in the execution of this process.',
  },
  {
    key: 'changeProcess',
    label: 'Change Process',
    type: 'richText',
    placeholder:
      'How proposed changes are assessed, approved, implemented and monitored.',
  },
  {
    key: 'references',
    label: 'References',
    type: 'richText',
    placeholder: 'Applicable external standards, manuals and reference documents.',
  },
  {
    key: 'appendices',
    label: 'Appendices',
    type: 'fileList',
    placeholder: 'Supporting documents, attachments, forms and exhibits.',
  },
  {
    key: 'signatures',
    label: 'Signatures',
    type: 'signatures',
    systemGenerated: true,
    tableColumns: [
      { key: 'employeeName', label: 'Employee Name' },
      { key: 'designation', label: 'Designation' },
      { key: 'signature', label: 'Signature' },
      { key: 'date', label: 'Date' },
    ],
  },
];

// ============================================
// HELPERS
// ============================================

export function todayFormatted(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function generateSopNumber(department?: string): string {
  const prefix = department ? department.substring(0, 3).toUpperCase() : 'GEN';
  const seq = String(Math.floor(100 + Math.random() * 900));
  return `${prefix}_SOP_${seq}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function emptyRowFor(columns?: { key: string }[]): Record<string, string> {
  const row: Record<string, string> = {};
  (columns || []).forEach((c) => {
    row[c.key] = '';
  });
  return row;
}

export function defaultContentForSection(section: SOPSectionDef): unknown {
  switch (section.type) {
    case 'richText':
      return '';
    case 'table':
      return [emptyRowFor(section.tableColumns), emptyRowFor(section.tableColumns)];
    case 'steps':
      return [];
    case 'image':
      return { url: '', caption: '' };
    case 'fileList':
      return [];
    case 'versionHistory':
    case 'signatures':
      return [];
    default:
      return null;
  }
}

export function buildDefaultSections(
  sectionDefs: SOPSectionDef[] = DEFAULT_SOP_SECTIONS
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  sectionDefs.forEach((s) => {
    out[s.key] = defaultContentForSection(s);
  });
  return out;
}

export function buildDefaultHeader(department?: string) {
  return {
    sopNumber: generateSopNumber(department),
    versionLabel: 'R00',
    date: todayFormatted(),
    department: department || '',
  };
}
