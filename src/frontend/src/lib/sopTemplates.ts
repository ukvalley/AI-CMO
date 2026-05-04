/**
 * SOP Starter Templates
 *
 * Pre-built SOP outlines a founder can use as a starting point. Each
 * template fills the structured 20-section schema with content tuned to
 * a common founder scenario.
 */

import type { SOPCategory, SOPSectionContent } from '@/types/entities';

export interface SopTemplate {
  id: string;
  title: string;
  description: string;
  category: SOPCategory;
  department?: string;
  icon: string;
  sections: Record<string, SOPSectionContent>;
}

const t = (s: string): SOPSectionContent => s;

export const SOP_TEMPLATES: SopTemplate[] = [
  {
    id: 'employee-onboarding',
    title: 'Employee Onboarding',
    description: 'Welcome a new hire from offer accept to end of week one.',
    category: 'HR',
    department: 'hr',
    icon: 'UserPlus',
    sections: {
      purpose: t(
        'Provide every new joiner with a consistent, structured first-week experience covering paperwork, tools, training and team introductions so they reach productivity faster.'
      ),
      scope: t(
        'Applies to all full-time, part-time and contract joiners across departments from the date of offer acceptance through completion of their first 30 days.'
      ),
      reviewProcedure: t(
        'Reviewed every 6 months by the HR Lead, or after any major change to tooling, payroll or compliance requirements.'
      ),
      rolesResponsibilities: [
        { role: 'HR Lead', responsibility: 'Owns the onboarding plan, sends welcome email, collects documents.' },
        { role: 'Hiring Manager', responsibility: 'Defines first-week goals, assigns buddy, runs 1:1.' },
        { role: 'IT/Ops', responsibility: 'Provisions laptop, accounts, access tokens before Day 1.' },
        { role: 'Buddy', responsibility: 'Guides the new joiner socially and helps with day-to-day questions.' },
      ],
      procedures: [
        { procedureName: 'Pre-Day 1', task: 'Send welcome pack, collect documents, request laptop', personResponsible: 'HR Lead' },
        { procedureName: 'Day 1', task: 'Welcome call, tools setup, intro to team', personResponsible: 'HR + Hiring Manager' },
        { procedureName: 'Week 1', task: '1:1s with key stakeholders, role-specific training', personResponsible: 'Hiring Manager' },
        { procedureName: 'Day 30', task: '30-day check-in, feedback survey, goal review', personResponsible: 'Hiring Manager' },
      ],
    },
  },
  {
    id: 'hiring-process',
    title: 'Hiring Process',
    description: 'Standard pipeline from job opening to signed offer.',
    category: 'HR',
    department: 'hr',
    icon: 'Users',
    sections: {
      purpose: t(
        'Establish a consistent, fair and quick hiring process that gives candidates a great experience while keeping the bar high.'
      ),
      scope: t('Covers all open roles across the organisation from job spec sign-off through offer acceptance.'),
      rolesResponsibilities: [
        { role: 'Founder/Hiring Manager', responsibility: 'Owns the role spec and final hiring decision.' },
        { role: 'Recruiter', responsibility: 'Sources candidates, screens CVs, schedules interviews.' },
        { role: 'Interview Panel', responsibility: 'Runs structured interviews, submits scorecards within 24h.' },
      ],
      procedures: [
        { procedureName: 'Open role', task: 'Approve role spec, post on job boards', personResponsible: 'Hiring Manager' },
        { procedureName: 'Screen', task: 'Phone screen + take-home if applicable', personResponsible: 'Recruiter' },
        { procedureName: 'Interview', task: '3 rounds: technical, values, founder', personResponsible: 'Panel' },
        { procedureName: 'Offer', task: 'Reference check, offer letter, negotiation', personResponsible: 'Hiring Manager' },
      ],
    },
  },
  {
    id: 'customer-support',
    title: 'Customer Support',
    description: 'Triage, resolution and escalation for inbound support.',
    category: 'Customer Service',
    department: 'customer-success',
    icon: 'Headphones',
    sections: {
      purpose: t(
        'Resolve customer issues fast with empathy, capture insights into product, and ensure no ticket falls through the cracks.'
      ),
      scope: t('Applies to all inbound queries received via email, chat, or in-app from any customer tier.'),
      rolesResponsibilities: [
        { role: 'Support Agent', responsibility: 'First response within 4h, resolves Tier 1 queries.' },
        { role: 'Support Lead', responsibility: 'Owns Tier 2 escalations, weekly insights report.' },
        { role: 'Engineering on-call', responsibility: 'Resolves Tier 3 (bug or incident) within SLA.' },
      ],
      procedures: [
        { procedureName: 'Triage', task: 'Tag, prioritise, assign within 1h', personResponsible: 'Support Agent' },
        { procedureName: 'Resolve', task: 'Reply with solution or workaround', personResponsible: 'Support Agent' },
        { procedureName: 'Escalate', task: 'Tier 2/3 with full context', personResponsible: 'Support Lead' },
        { procedureName: 'Follow-up', task: 'CSAT survey + close ticket', personResponsible: 'Support Agent' },
      ],
    },
  },
  {
    id: 'refund-policy',
    title: 'Refund & Returns',
    description: 'How refund requests are evaluated, approved and processed.',
    category: 'Customer Service',
    department: 'finance',
    icon: 'RefreshCw',
    sections: {
      purpose: t(
        'Handle refunds and returns fairly and quickly while protecting against abuse and capturing reasons for product improvement.'
      ),
      scope: t('All paid customers within the refund window stated in our Terms of Service.'),
      rolesResponsibilities: [
        { role: 'Support Agent', responsibility: 'Receives request, validates eligibility, processes if within policy.' },
        { role: 'Finance', responsibility: 'Issues the refund and updates accounting.' },
        { role: 'Founder', responsibility: 'Approves edge-case / out-of-policy requests.' },
      ],
      procedures: [
        { procedureName: 'Validate', task: 'Confirm purchase + window + reason', personResponsible: 'Support Agent' },
        { procedureName: 'Approve', task: 'Standard refund within 24h, edge cases to Founder', personResponsible: 'Support Agent / Founder' },
        { procedureName: 'Process', task: 'Refund via original payment method, send confirmation', personResponsible: 'Finance' },
        { procedureName: 'Log', task: 'Reason category logged for monthly review', personResponsible: 'Support Agent' },
      ],
    },
  },
  {
    id: 'product-launch',
    title: 'Product Launch',
    description: 'Cross-functional launch checklist from RC to GA.',
    category: 'Marketing',
    department: 'product',
    icon: 'Rocket',
    sections: {
      purpose: t(
        'Coordinate engineering, marketing, sales and support around a product launch so customers have a great Day-1 experience and pipeline picks up.'
      ),
      scope: t('Applies to any feature or product going to general availability with external messaging.'),
      rolesResponsibilities: [
        { role: 'Product Manager', responsibility: 'Launch plan, feature freeze, GA criteria.' },
        { role: 'Marketing', responsibility: 'Messaging, landing page, launch campaign.' },
        { role: 'Sales', responsibility: 'Enablement deck, demo script, pricing collateral.' },
        { role: 'Support', responsibility: 'Help docs, tier-1 training, FAQ.' },
      ],
      procedures: [
        { procedureName: 'T-4 weeks', task: 'Lock scope + brief all functions', personResponsible: 'PM' },
        { procedureName: 'T-2 weeks', task: 'Beta with 5 friendly customers', personResponsible: 'PM + Support' },
        { procedureName: 'T-1 week', task: 'Internal demo + GA readiness review', personResponsible: 'PM' },
        { procedureName: 'Launch day', task: 'Go-live + announcement + monitoring', personResponsible: 'All' },
        { procedureName: 'T+1 week', task: 'Retro + KPI review', personResponsible: 'PM' },
      ],
    },
  },
  {
    id: 'incident-response',
    title: 'Incident Response',
    description: 'Detect, mitigate, communicate and post-mortem for outages.',
    category: 'IT',
    department: 'engineering',
    icon: 'AlertTriangle',
    sections: {
      purpose: t(
        'Restore service as fast as possible during outages, communicate clearly with customers, and learn systematically through post-mortems.'
      ),
      scope: t('Applies to any production incident affecting customer-facing functionality.'),
      rolesResponsibilities: [
        { role: 'Incident Commander', responsibility: 'Owns the response, runs the war-room, makes the call.' },
        { role: 'Engineering on-call', responsibility: 'Diagnoses + fixes the issue.' },
        { role: 'Comms Lead', responsibility: 'Updates status page + customer comms every 30 min.' },
      ],
      procedures: [
        { procedureName: 'Detect', task: 'Alert fires or report received → page on-call', personResponsible: 'On-call' },
        { procedureName: 'Triage', task: 'Severity assigned, IC named, war-room opened', personResponsible: 'IC' },
        { procedureName: 'Mitigate', task: 'Rollback / hotfix / failover', personResponsible: 'Engineering' },
        { procedureName: 'Comms', task: 'Status page + email if > 30 min', personResponsible: 'Comms Lead' },
        { procedureName: 'Post-mortem', task: 'Blameless write-up within 5 working days', personResponsible: 'IC' },
      ],
    },
  },
  {
    id: 'sales-process',
    title: 'Sales Process',
    description: 'Outbound to closed-won pipeline stages and exit criteria.',
    category: 'Sales',
    department: 'sales',
    icon: 'TrendingUp',
    sections: {
      purpose: t(
        'A repeatable sales motion with clear stages and exit criteria so reps and founders can forecast accurately and remove friction.'
      ),
      scope: t('All outbound + inbound deals from new lead through closed-won (or lost).'),
      rolesResponsibilities: [
        { role: 'SDR', responsibility: 'Prospects + qualifies leads.' },
        { role: 'AE', responsibility: 'Discovery, demo, proposal, negotiation.' },
        { role: 'Founder', responsibility: 'Closes strategic / >$50k deals.' },
      ],
      procedures: [
        { procedureName: 'Prospect', task: '20 outbound touches per day per SDR', personResponsible: 'SDR' },
        { procedureName: 'Qualify', task: 'BANT + champion identified', personResponsible: 'SDR / AE' },
        { procedureName: 'Demo', task: 'Tailored demo + recap email same day', personResponsible: 'AE' },
        { procedureName: 'Propose', task: 'Pricing + scope + ROI doc', personResponsible: 'AE' },
        { procedureName: 'Close', task: 'Order form signed + handoff to onboarding', personResponsible: 'AE / Founder' },
      ],
    },
  },
  {
    id: 'vendor-procurement',
    title: 'Vendor Procurement',
    description: 'Evaluate, approve and onboard a new SaaS vendor or supplier.',
    category: 'Operations',
    department: 'finance',
    icon: 'ShoppingCart',
    sections: {
      purpose: t(
        'Make sure spend on tools and suppliers is intentional, security-reviewed, and within budget — without slowing teams down.'
      ),
      scope: t('Any new recurring spend > $50/month or one-off purchase > $500.'),
      rolesResponsibilities: [
        { role: 'Requesting Team Lead', responsibility: 'Justifies need, evaluates 2-3 options.' },
        { role: 'Finance', responsibility: 'Approves budget, signs contract.' },
        { role: 'Security', responsibility: 'Reviews data handling + DPA for any vendor that touches customer data.' },
      ],
      procedures: [
        { procedureName: 'Request', task: 'Submit need + business case', personResponsible: 'Team Lead' },
        { procedureName: 'Evaluate', task: 'Compare 2-3 vendors on price + fit', personResponsible: 'Team Lead' },
        { procedureName: 'Review', task: 'Security + DPA + contract terms', personResponsible: 'Security + Finance' },
        { procedureName: 'Approve', task: 'PO raised, contract signed', personResponsible: 'Finance' },
        { procedureName: 'Onboard', task: 'Provision access, document in tools registry', personResponsible: 'IT' },
      ],
    },
  },
];

export function getTemplateById(id: string): SopTemplate | undefined {
  return SOP_TEMPLATES.find((t) => t.id === id);
}
