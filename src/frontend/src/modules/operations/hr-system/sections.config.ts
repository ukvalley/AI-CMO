/**
 * HR & Jobs System — 18-module config.
 * Reuses FieldDef / SectionDef from website-project so the same generic
 * SectionForm renders this module too.
 */

import {
  Award,
  BarChart3,
  Briefcase,
  ClipboardCheck,
  DollarSign,
  Files,
  Filter,
  GitFork,
  Globe,
  KanbanSquare,
  KeyRound,
  Mic,
  Phone,
  ThumbsUp,
  TrendingUp,
  UserPlus,
  Workflow,
} from 'lucide-react';
import type { FieldDef, SectionDef } from '@/modules/website/website-project/sections.config';

export const HR_SECTIONS: SectionDef[] = [
  // ----- 1. Job Requirement -----
  {
    id: 'job-requirement',
    step: '1',
    group: 'Job Setup',
    title: 'Job Requirement Management',
    description: 'Capture every detail of a new opening before it goes live.',
    icon: Briefcase,
    fields: [
      { key: 'rolePosition', label: 'Role / position', kind: 'text', required: true, colSpan: 2 },
      { key: 'numberOfOpenings', label: 'Number of openings', kind: 'number' },
      { key: 'experienceLevel', label: 'Experience level', kind: 'select', options: [
        { value: 'fresher', label: 'Fresher' },
        { value: 'experienced', label: 'Experienced' },
        { value: 'mid-senior', label: 'Mid–Senior' },
        { value: 'senior', label: 'Senior / Lead' },
      ]},
      { key: 'workType', label: 'Work type', kind: 'select', options: [
        { value: 'office', label: 'Office' },
        { value: 'field', label: 'Field' },
        { value: 'hybrid', label: 'Hybrid' },
      ]},
      { key: 'workMode', label: 'Work mode', kind: 'select', options: [
        { value: 'wfo', label: 'Work from office' },
        { value: 'wfh', label: 'Work from home' },
        { value: 'hybrid', label: 'Hybrid' },
      ]},
      { key: 'genderPreference', label: 'Gender preference', kind: 'select', options: [
        { value: 'any', label: 'Any (recommended)' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'non-binary-friendly', label: 'Non-binary friendly' },
      ]},
      { key: 'technicalSkills', label: 'Technical skills', kind: 'tags', colSpan: 2 },
      { key: 'softSkills', label: 'Soft skills', kind: 'tags', colSpan: 2 },
      { key: 'salaryRange', label: 'Salary / stipend range', kind: 'text' },
      { key: 'licenseRequired', label: 'License / certification required', kind: 'text' },
      { key: 'expectedJoiningDate', label: 'Expected joining date', kind: 'date' },
    ],
    advancedFields: [
      { key: 'jdTemplate', label: 'Editable JD template', kind: 'textarea', rows: 8, hint: 'Auto-generated JD that recruiters can edit', colSpan: 2 },
      { key: 'jdNotes', label: 'JD review notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 2. JD Approval Workflow -----
  {
    id: 'jd-approval',
    step: '2',
    group: 'Job Setup',
    title: 'JD Approval Workflow',
    description: 'HR → Manager → Founder approval chain.',
    icon: ClipboardCheck,
    fields: [
      { key: 'jdStatus', label: 'JD status', kind: 'select', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'pending', label: 'Pending review' },
        { value: 'approved', label: 'Approved' },
        { value: 'rework', label: 'Rework needed' },
      ]},
      { key: 'hrReviewer', label: 'HR reviewer', kind: 'text' },
      { key: 'managerReviewer', label: 'Manager reviewer', kind: 'text' },
      { key: 'founderReviewer', label: 'Founder / final reviewer', kind: 'text' },
    ],
    advancedFields: [
      { key: 'feedbackThread', label: 'Feedback & comments thread', kind: 'textarea', rows: 5, colSpan: 2 },
      { key: 'reworkLog', label: 'Rework history', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 3. Candidate Sourcing -----
  {
    id: 'sourcing',
    step: '3',
    group: 'Sourcing',
    title: 'Candidate Sourcing Management',
    description: 'Where candidates come from and how those channels perform.',
    icon: Globe,
    fields: [
      { key: 'jobPortals', label: 'Job portals used', kind: 'tags', hint: 'Naukri, Internshala, Indeed, AngelList…', colSpan: 2 },
      { key: 'socialChannels', label: 'Social channels', kind: 'tags', hint: 'LinkedIn, WhatsApp, Instagram, X…', colSpan: 2 },
      { key: 'referralProgramme', label: 'Referral programme details', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'walkInsAllowed', label: 'Walk-ins allowed', kind: 'checks' },
    ],
    advancedFields: [
      { key: 'campaignTracking', label: 'Hiring campaigns running', kind: 'tags', colSpan: 2 },
      { key: 'sourcePerformanceNotes', label: 'Source performance notes', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'costPerHireTarget', label: 'Cost per hire target', kind: 'text' },
    ],
  },

  // ----- 4. Resume Database -----
  {
    id: 'resume-db',
    step: '4',
    group: 'Sourcing',
    title: 'Resume Database System',
    description: 'Where every resume lives + structured candidate data.',
    icon: Files,
    fields: [
      { key: 'resumeStorageUrl', label: 'Resume storage URL', kind: 'url', hint: 'Drive folder, S3 bucket, ATS link…', colSpan: 2 },
      { key: 'requiredFields', label: 'Required candidate fields', kind: 'tags', hint: 'Name, Phone, Email, Location, Experience…', colSpan: 2 },
      { key: 'duplicateRule', label: 'Duplicate detection rule', kind: 'text', hint: 'Match on email, phone, or both' },
    ],
    advancedFields: [
      { key: 'parserTool', label: 'Resume parser tool', kind: 'text', hint: 'Affinda, RChilli, Sovren…' },
      { key: 'autoExtractFields', label: 'Auto-extracted fields', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 5. Resume Screening Engine -----
  {
    id: 'screening',
    step: '5',
    group: 'Sourcing',
    title: 'Resume Screening Engine',
    description: 'Filter resumes — manually and with rules / AI.',
    icon: Filter,
    fields: [
      { key: 'mustHaveSkills', label: 'Must-have skills', kind: 'tags', colSpan: 2 },
      { key: 'minExperience', label: 'Minimum experience (years)', kind: 'number' },
      { key: 'locationFilter', label: 'Location filter', kind: 'tags' },
      { key: 'screeningOwner', label: 'Manual screener', kind: 'text' },
    ],
    advancedFields: [
      { key: 'aiScoringEnabled', label: 'AI resume scoring enabled', kind: 'checks' },
      { key: 'matchThreshold', label: 'Match percentage threshold', kind: 'text', hint: 'e.g. 70%' },
      { key: 'aiTool', label: 'AI screening tool', kind: 'text' },
    ],
  },

  // ----- 6. Pipeline Management -----
  {
    id: 'pipeline',
    step: '6',
    group: 'Pipeline & Communications',
    title: 'Candidate Pipeline Management',
    description: 'Kanban view from Applied to Selected/Rejected.',
    icon: KanbanSquare,
    fields: [
      { key: 'pipelineStages', label: 'Pipeline stages', kind: 'tags', hint: 'Applied → Screening → Shortlisted → Contacted → Interview → Selected / Rejected / Hold', colSpan: 2 },
      { key: 'stageOwners', label: 'Stage owners', kind: 'textarea', rows: 3, hint: 'Who moves candidates between stages', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'slaPerStage', label: 'SLA per stage', kind: 'textarea', rows: 3, hint: 'Max time a candidate sits in each stage', colSpan: 2 },
      { key: 'autoStageRules', label: 'Auto-advancement rules', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 7. Communication System -----
  {
    id: 'communication',
    step: '7',
    group: 'Pipeline & Communications',
    title: 'Candidate Communication System',
    description: 'Calls, email, WhatsApp + interview scheduling and reminders.',
    icon: Phone,
    fields: [
      { key: 'callLoggingTool', label: 'Call logging tool', kind: 'text' },
      { key: 'emailTemplate', label: 'Outreach email template', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'whatsappTemplate', label: 'WhatsApp template', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'interviewMode', label: 'Interview mode', kind: 'select', options: [
        { value: 'online', label: 'Online' },
        { value: 'offline', label: 'Offline' },
        { value: 'hybrid', label: 'Hybrid' },
      ]},
      { key: 'meetingPlatform', label: 'Meeting platform', kind: 'select', options: [
        { value: 'google-meet', label: 'Google Meet' },
        { value: 'zoom', label: 'Zoom' },
        { value: 'teams', label: 'Microsoft Teams' },
        { value: 'in-person', label: 'In person' },
      ]},
    ],
    advancedFields: [
      { key: 'reminderRules', label: 'Reminder rules', kind: 'tags', hint: '1 day before / 1 hour before / 10 minutes before…', colSpan: 2 },
      { key: 'autoSchedulerTool', label: 'Auto-scheduler tool', kind: 'text', hint: 'Calendly, Cal.com, Chili Piper…' },
    ],
  },

  // ----- 8. Interview Management -----
  {
    id: 'interviews',
    step: '8',
    group: 'Interview & Decision',
    title: 'Interview Management System',
    description: 'Rounds, panels, question banks, evaluations.',
    icon: Mic,
    fields: [
      { key: 'rounds', label: 'Interview rounds', kind: 'tags', hint: 'Technical / HR / Discussion / Salary / Culture-fit…', colSpan: 2 },
      { key: 'questionBankUrl', label: 'Question bank URL', kind: 'url', colSpan: 2 },
      { key: 'evaluationFormUrl', label: 'Evaluation form URL', kind: 'url', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'scoringRubric', label: 'Score-based rubric', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'panelMembers', label: 'Default interview panel', kind: 'tags', colSpan: 2 },
      { key: 'panelFeedbackProcess', label: 'Panel feedback process', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 9. Feedback & Decision -----
  {
    id: 'decision',
    step: '9',
    group: 'Interview & Decision',
    title: 'Feedback & Decision Engine',
    description: 'Capture interviewer feedback, decide quickly, automate the rest.',
    icon: ThumbsUp,
    fields: [
      { key: 'feedbackTemplate', label: 'Feedback submission template', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'decisionStatuses', label: 'Decision statuses', kind: 'tags', hint: 'Selected / Rejected / On Hold', colSpan: 2 },
      { key: 'rejectionEmailTemplate', label: 'Rejection email template', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'autoRejectAfterDays', label: 'Auto-reject after N days of inactivity', kind: 'number' },
      { key: 'forwardSelectedTo', label: 'Move "Selected" candidates to', kind: 'text', hint: 'e.g. Offer & Selection module' },
    ],
  },

  // ----- 10. Offer & Selection -----
  {
    id: 'offer',
    step: '10',
    group: 'Offer & Onboarding',
    title: 'Offer & Selection System',
    description: 'Generate, send, and track offers / internship letters.',
    icon: Award,
    fields: [
      { key: 'offerLetterTemplate', label: 'Offer letter template', kind: 'textarea', rows: 6, colSpan: 2 },
      { key: 'internshipLetterTemplate', label: 'Internship letter template', kind: 'textarea', rows: 6, colSpan: 2 },
      { key: 'welcomeEmailTemplate', label: 'Welcome email template', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'eSignTool', label: 'E-sign tool', kind: 'text', hint: 'DocuSign, Dropbox Sign, Zoho Sign…' },
      { key: 'acceptanceTrackingNotes', label: 'Acceptance tracking notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 11. Document Management -----
  {
    id: 'documents',
    step: '11',
    group: 'Offer & Onboarding',
    title: 'Document Management System',
    description: 'Collect IDs, certificates, bank details, declarations.',
    icon: Files,
    fields: [
      { key: 'requiredDocuments', label: 'Required documents', kind: 'tags', hint: 'ID proof / Education docs / Photo / Bank details…', colSpan: 2 },
      { key: 'requiredForms', label: 'Required forms', kind: 'tags', hint: 'Employment declaration / Family contact / NDA…', colSpan: 2 },
      { key: 'documentVaultUrl', label: 'Document vault URL', kind: 'url', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'verificationProcess', label: 'Verification process', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'missingDocAlerts', label: 'Missing document alert rules', kind: 'textarea', rows: 2, colSpan: 2 },
    ],
  },

  // ----- 12. Onboarding -----
  {
    id: 'onboarding',
    step: '12',
    group: 'Offer & Onboarding',
    title: 'Employee Onboarding System',
    description: 'First-week checklist, accounts, policies.',
    icon: UserPlus,
    fields: [
      { key: 'onboardingChecklist', label: 'Onboarding checklist', kind: 'textarea', rows: 6, colSpan: 2 },
      { key: 'emailIdCreated', label: 'Email ID created', kind: 'checks' },
      { key: 'attendanceSystemAccess', label: 'Attendance system access', kind: 'text' },
    ],
    advancedFields: [
      { key: 'autoEmails', label: 'Auto emails sent', kind: 'tags', hint: 'HR policies / Email etiquette / Code of conduct…', colSpan: 2 },
      { key: 'buddyAssigned', label: 'Buddy / mentor assigned', kind: 'text' },
    ],
  },

  // ----- 13. Post-Joining Management -----
  {
    id: 'post-joining',
    step: '13',
    group: 'Offer & Onboarding',
    title: 'Post-Joining Management',
    description: 'Asset allocation, training, performance tracking.',
    icon: TrendingUp,
    fields: [
      { key: 'assetsAllocated', label: 'Assets allocated', kind: 'tags', hint: 'Laptop / mouse / monitor / ID card…', colSpan: 2 },
      { key: 'idCardGenerated', label: 'ID card generated', kind: 'checks' },
      { key: 'teamIntroDone', label: 'Team introduction done', kind: 'checks' },
      { key: 'sopsDelivered', label: 'SOPs delivered', kind: 'tags', colSpan: 2 },
      { key: 'trainingSessions', label: 'Training sessions planned', kind: 'tags', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'performanceCadence', label: 'Performance review cadence', kind: 'select', options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
      ]},
      { key: 'warningSystem', label: 'Warning / penalty system', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 14. Payroll -----
  {
    id: 'payroll',
    step: '14',
    group: 'Operations',
    title: 'Payroll & Salary Tracking',
    description: 'Salary records, stipends, payslips.',
    icon: DollarSign,
    fields: [
      { key: 'payrollProvider', label: 'Payroll provider', kind: 'text', hint: 'RazorpayX, Zoho Payroll, Gusto…' },
      { key: 'payCycle', label: 'Pay cycle', kind: 'select', options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'weekly', label: 'Weekly' },
      ]},
      { key: 'stipendTrackingNotes', label: 'Stipend tracking notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'payslipTemplate', label: 'Payslip template URL', kind: 'url', colSpan: 2 },
      { key: 'taxDeductions', label: 'Tax / statutory deductions handled', kind: 'tags', hint: 'PF / ESI / TDS…', colSpan: 2 },
    ],
  },

  // ----- 15. Lifecycle -----
  {
    id: 'lifecycle',
    step: '15',
    group: 'Operations',
    title: 'Employee Lifecycle Management',
    description: 'Probation → confirmation → exit → settlement.',
    icon: GitFork,
    fields: [
      { key: 'probationDuration', label: 'Probation duration', kind: 'text', hint: 'e.g. 3 months / 6 months' },
      { key: 'confirmationLetterTemplate', label: 'Confirmation letter template', kind: 'textarea', rows: 5, colSpan: 2 },
      { key: 'experienceLetterTemplate', label: 'Experience letter template', kind: 'textarea', rows: 5, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'exitProcess', label: 'Exit / offboarding process', kind: 'textarea', rows: 4, colSpan: 2 },
      { key: 'finalSettlementChecklist', label: 'Final settlement checklist', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
  },

  // ----- 16. HR Analytics -----
  {
    id: 'analytics',
    step: '16',
    group: 'Analytics & Automation',
    title: 'HR Analytics Dashboard',
    description: 'Hiring funnel metrics + source performance.',
    icon: BarChart3,
    fields: [
      { key: 'applicantsTarget', label: 'Applicants target / month', kind: 'text' },
      { key: 'shortlistRateTarget', label: 'Shortlist rate target (%)', kind: 'text' },
      { key: 'interviewToHireTarget', label: 'Interview-to-hire ratio target', kind: 'text', hint: 'e.g. 5:1' },
      { key: 'timeToHireTarget', label: 'Time-to-hire target (days)', kind: 'text' },
    ],
    advancedFields: [
      { key: 'dashboardUrl', label: 'Dashboard URL', kind: 'url', colSpan: 2 },
      { key: 'sourcePerformanceTracking', label: 'Source performance tracking notes', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 17. Workflow Automation -----
  {
    id: 'workflow',
    step: '17',
    group: 'Analytics & Automation',
    title: 'Workflow Automation',
    description: 'End-to-end automation: resume → screen → interview → offer.',
    icon: Workflow,
    fields: [
      { key: 'workflowTool', label: 'Automation tool', kind: 'text', hint: 'n8n, Zapier, Make, custom…' },
      { key: 'currentWorkflows', label: 'Active workflows', kind: 'tags', colSpan: 2 },
      { key: 'workflowDiagram', label: 'Workflow diagram URL', kind: 'url', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'automationFlow', label: 'Full automation flow', kind: 'textarea', rows: 6, hint: 'Resume → Screen → Shortlist → Interview → Reminder → Feedback → Offer', colSpan: 2 },
      { key: 'errorHandlingNotes', label: 'Error handling / fallback rules', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
  },

  // ----- 18. Role-Based Access -----
  {
    id: 'rbac',
    step: '18',
    group: 'Analytics & Automation',
    title: 'Role-Based Access Control',
    description: 'Who can see and do what across the HR system.',
    icon: KeyRound,
    fields: [
      { key: 'rolesDefined', label: 'Roles defined', kind: 'tags', hint: 'HR / Manager / Admin / Interviewer / Recruiter…', colSpan: 2 },
      { key: 'permissionMatrix', label: 'Permission matrix notes', kind: 'textarea', rows: 5, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'auditLogTool', label: 'Audit log tool', kind: 'text' },
      { key: 'mfaRequired', label: 'MFA required', kind: 'checks' },
    ],
  },
];

export const HR_GROUP_ORDER: string[] = [
  'Job Setup',
  'Sourcing',
  'Pipeline & Communications',
  'Interview & Decision',
  'Offer & Onboarding',
  'Operations',
  'Analytics & Automation',
];

export function hrSectionFilledRatio(
  section: SectionDef,
  data: Record<string, unknown> | undefined
): number {
  const all = [...section.fields, ...(section.advancedFields ?? [])];
  if (all.length === 0) return 0;
  const filled = all.filter((f) => {
    const v = data?.[f.key];
    if (v === undefined || v === null) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (typeof v === 'number') return Number.isFinite(v);
    if (typeof v === 'boolean') return v === true;
    if (Array.isArray(v)) return v.length > 0;
    return !!v;
  }).length;
  return filled / all.length;
}

export type { FieldDef, SectionDef };
