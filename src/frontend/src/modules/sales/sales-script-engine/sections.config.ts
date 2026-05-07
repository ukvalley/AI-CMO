/**
 * Sales Script Engine — 7-section config.
 * Sales rep profile + 6 script categories (cold outreach / discovery /
 * demo / objections / closing / relationship). Reuses FieldDef / SectionDef
 * from website-project so the same SectionForm renders this module too.
 */

import {
  Award,
  Heart,
  Megaphone,
  Phone,
  Search,
  ShieldAlert,
  User as UserIcon,
} from 'lucide-react';
import type { FieldDef, SectionDef } from '@/modules/website/website-project/sections.config';

export const SCRIPT_SECTIONS: SectionDef[] = [
  // ----- 1. Sales Rep Profile -----
  {
    id: 'rep-profile',
    step: '1',
    group: 'Rep Profile',
    title: 'Sales Rep Profile',
    description:
      'Capture the rep — role, expertise, communication style — so every script downstream is personalised.',
    icon: UserIcon,
    fields: [
      { key: 'repName', label: 'Rep name', kind: 'text', required: true },
      { key: 'repRole', label: 'Role', kind: 'select', options: [
        { value: 'sdr', label: 'SDR' },
        { value: 'bdm', label: 'BDM' },
        { value: 'ae', label: 'Account Executive' },
        { value: 'closer', label: 'Closer' },
        { value: 'rm', label: 'Relationship Manager' },
        { value: 'cs', label: 'Customer Success' },
      ]},
      { key: 'experienceLevel', label: 'Experience level', kind: 'select', options: [
        { value: 'junior', label: 'Junior — needs structured scripts' },
        { value: 'mid', label: 'Mid — frameworks with examples' },
        { value: 'senior', label: 'Senior — autonomous frameworks' },
      ]},
      { key: 'communicationStyle', label: 'Communication style', kind: 'select', options: [
        { value: 'consultative', label: 'Consultative' },
        { value: 'assertive', label: 'Assertive' },
        { value: 'storytelling', label: 'Storytelling' },
        { value: 'data-driven', label: 'Data-driven' },
        { value: 'relationship-led', label: 'Relationship-led' },
      ]},
      { key: 'tonePreference', label: 'Tone preference', kind: 'select', options: [
        { value: 'formal', label: 'Formal' },
        { value: 'semi-formal', label: 'Semi-formal' },
        { value: 'conversational', label: 'Conversational' },
      ]},
      { key: 'industryExpertise', label: 'Industry expertise', kind: 'tags', hint: 'Verticals / sectors the rep knows best', colSpan: 2 },
      { key: 'strengths', label: 'Strengths', kind: 'tags', hint: 'Technical / empathy / objection handling / demo skills…', colSpan: 2 },
      { key: 'assignedIcps', label: 'Assigned ICPs / personas', kind: 'tags', hint: 'Maps to ICP & Personas module', colSpan: 2 },
      { key: 'productsSold', label: 'Products this rep sells', kind: 'tags', hint: 'Maps to Products module', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'forbiddenWords', label: 'Forbidden words (brand voice)', kind: 'tags', hint: 'Pulled from Brand voice rules — words this rep must avoid', colSpan: 2 },
      { key: 'signaturePhrases', label: 'Signature phrases (brand voice)', kind: 'tags', hint: 'Brand-approved phrases to weave in', colSpan: 2 },
      { key: 'competitorGapNotes', label: 'Competitor gap notes', kind: 'textarea', rows: 4, hint: 'Differentiation talking points from Competitor module', colSpan: 2 },
    ],
  },

  // ----- 2. A. Cold Outreach Scripts -----
  {
    id: 'cold-outreach',
    step: 'A',
    group: 'Outbound',
    title: 'Cold Outreach Scripts',
    description: 'First-touch openers — call, email, LinkedIn, WhatsApp.',
    icon: Phone,
    fields: [
      { key: 'coldCallOpening', label: 'Cold call opening (30-sec hook)', kind: 'textarea', rows: 5, hint: 'Tailored to rep style + ICP pain point', colSpan: 2 },
      { key: 'coldCallVariants', label: 'Cold call variants (3–5)', kind: 'tags', hint: 'Each variant = an alternative opening line. Press Enter after each.', colSpan: 2 },
      { key: 'coldEmailSubject', label: 'Cold email — subject line(s)', kind: 'tags', hint: '3–5 short subject options', colSpan: 2 },
      { key: 'coldEmailBody', label: 'Cold email — 3-line body', kind: 'textarea', rows: 5, hint: 'Personalised to rep voice + ICP', colSpan: 2 },
      { key: 'linkedinConnection', label: 'LinkedIn connection message', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'linkedinFollowUp', label: 'LinkedIn follow-up sequence', kind: 'textarea', rows: 5, hint: 'Day 1, Day 3, Day 7…', colSpan: 2 },
      { key: 'whatsappIntro', label: 'WhatsApp intro pitch', kind: 'textarea', rows: 4, hint: 'Short informal pitch for warm market', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'coldEmailVariants', label: 'Cold email variants (3–5)', kind: 'tags', hint: 'Different angles to A/B test', colSpan: 2 },
      { key: 'linkedinDmVariants', label: 'LinkedIn DM variants', kind: 'tags', colSpan: 2 },
      { key: 'channelPreferenceNotes', label: 'Channel preference notes', kind: 'textarea', rows: 3, hint: 'Which channel works best for which ICP', colSpan: 2 },
    ],
  },

  // ----- 3. B. Discovery & Qualification -----
  {
    id: 'discovery',
    step: 'B',
    group: 'Inbound / Pipeline',
    title: 'Discovery & Qualification Scripts',
    description: 'Frameworks for the first real conversation.',
    icon: Search,
    fields: [
      { key: 'discoveryFramework', label: 'Discovery call framework', kind: 'select', options: [
        { value: 'spin', label: 'SPIN' },
        { value: 'meddic', label: 'MEDDIC' },
        { value: 'meddpicc', label: 'MEDDPICC' },
        { value: 'bant', label: 'BANT' },
        { value: 'champ', label: 'CHAMP' },
        { value: 'gpct', label: 'GPCT' },
        { value: 'custom', label: 'Custom hybrid' },
      ]},
      { key: 'discoveryScript', label: 'Discovery call script', kind: 'textarea', rows: 8, hint: 'Adapted to rep style + chosen framework', colSpan: 2 },
      { key: 'qualificationQuestions', label: 'Qualification questions', kind: 'tags', hint: 'Pain-point questions based on ICP profile', colSpan: 2 },
      { key: 'activeListeningCues', label: 'Active listening cues', kind: 'tags', hint: 'Phrases to use during the call', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'redFlagsToWatch', label: 'Red flags to watch for', kind: 'tags', colSpan: 2 },
      { key: 'discoveryVariants', label: 'Discovery framework variants', kind: 'textarea', rows: 4, hint: 'Alt versions for different deal stages', colSpan: 2 },
    ],
  },

  // ----- 4. C. Demo & Presentation -----
  {
    id: 'demo',
    step: 'C',
    group: 'Inbound / Pipeline',
    title: 'Demo & Presentation Scripts',
    description: 'Feature → Benefit → Story format per assigned product.',
    icon: Megaphone,
    fields: [
      { key: 'productDemoScript', label: 'Product demo script', kind: 'textarea', rows: 8, hint: 'Feature → benefit → story per assigned product', colSpan: 2 },
      { key: 'storyBasedPitch', label: 'Story-based pitch', kind: 'textarea', rows: 6, hint: 'Founder story + customer success story woven in', colSpan: 2 },
      { key: 'slideTalkingPoints', label: 'Slide-by-slide talking points', kind: 'textarea', rows: 8, hint: 'Narration notes per deck slide', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'demoVariants', label: 'Demo variants by ICP', kind: 'textarea', rows: 5, hint: 'Same product, different angles per persona', colSpan: 2 },
      { key: 'liveQaPrompts', label: 'Live Q&A prompts', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 5. D. Objection Handling -----
  {
    id: 'objections',
    step: 'D',
    group: 'Inbound / Pipeline',
    title: 'Objection Handling Scripts',
    description: 'Pre-prepared responses to the most common pushbacks.',
    icon: ShieldAlert,
    fields: [
      { key: 'priceObjection', label: 'Price objection response', kind: 'textarea', rows: 5, hint: 'Anchored to value proposition from Business Profile', colSpan: 2 },
      { key: 'notNowObjection', label: '"Not now" objection response', kind: 'textarea', rows: 5, hint: 'FOMO / urgency using brand positioning', colSpan: 2 },
      { key: 'competitorObjection', label: 'Competitor comparison response', kind: 'textarea', rows: 5, hint: 'Uses competitor gap data from CMO system', colSpan: 2 },
      { key: 'thinkAboutItObjection', label: '"Let me think about it" response', kind: 'textarea', rows: 5, hint: 'Follow-up sequence with nurture touchpoints', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'objectionVariantsByIcp', label: 'Objection variants by ICP', kind: 'textarea', rows: 5, hint: 'Same objection, different rebuttals per persona', colSpan: 2 },
      { key: 'reframeTechniques', label: 'Reframe techniques', kind: 'tags', colSpan: 2 },
    ],
  },

  // ----- 6. E. Closing -----
  {
    id: 'closing',
    step: 'E',
    group: 'Outbound',
    title: 'Closing Scripts',
    description: 'Trial / assumptive / summary closes + cadenced follow-up.',
    icon: Award,
    fields: [
      { key: 'trialClose', label: 'Trial / pilot close', kind: 'textarea', rows: 4, hint: 'Low-risk commitment language', colSpan: 2 },
      { key: 'assumptiveClose', label: 'Assumptive close', kind: 'textarea', rows: 4, hint: 'For experienced / senior reps', colSpan: 2 },
      { key: 'summaryClose', label: 'Summary close', kind: 'textarea', rows: 4, hint: 'Recap value + next step', colSpan: 2 },
      { key: 'followUpDay1', label: 'Follow-up D+1', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'followUpDay3', label: 'Follow-up D+3', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'followUpDay7', label: 'Follow-up D+7', kind: 'textarea', rows: 3, colSpan: 2 },
      { key: 'followUpDay14', label: 'Follow-up D+14', kind: 'textarea', rows: 3, colSpan: 2 },
    ],
    advancedFields: [
      { key: 'closingVariantsByExperience', label: 'Closing variants by rep experience', kind: 'textarea', rows: 5, hint: 'Junior = scripted; Senior = framework only', colSpan: 2 },
      { key: 'urgencyTriggers', label: 'Urgency triggers', kind: 'tags', hint: 'Limited offers / capacity / pricing changes', colSpan: 2 },
    ],
  },

  // ----- 7. F. Relationship & Account -----
  {
    id: 'relationship',
    step: 'F',
    group: 'Post-Sale',
    title: 'Relationship & Account Scripts',
    description: 'Re-engagement, referrals, upsell / cross-sell.',
    icon: Heart,
    fields: [
      { key: 'checkInMessage', label: 'Check-in message', kind: 'textarea', rows: 4, hint: 'Re-engagement for existing accounts', colSpan: 2 },
      { key: 'referralAsk', label: 'Referral ask script', kind: 'textarea', rows: 5, hint: 'Asking happy customers for introductions', colSpan: 2 },
      { key: 'upsellPitch', label: 'Upsell / cross-sell pitch', kind: 'textarea', rows: 5, hint: 'Based on what they already bought', colSpan: 2 },
    ],
    advancedFields: [
      { key: 'qbrTalkTrack', label: 'QBR talk track', kind: 'textarea', rows: 5, hint: 'Quarterly business review structure', colSpan: 2 },
      { key: 'churnSaveScript', label: 'Churn-save script', kind: 'textarea', rows: 5, hint: 'When account shows risk signals', colSpan: 2 },
      { key: 'caseStudyPitch', label: 'Case study request pitch', kind: 'textarea', rows: 4, colSpan: 2 },
    ],
  },
];

export const SCRIPT_GROUP_ORDER: string[] = [
  'Rep Profile',
  'Outbound',
  'Inbound / Pipeline',
  'Post-Sale',
];

export function scriptSectionFilledRatio(
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
