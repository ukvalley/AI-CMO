/**
 * Referral Programme Constants
 *
 * Status + reward-type labels and badge colour maps used across the
 * Referral Programme module.
 */

import type { ReferralStatus, ReferralRewardType } from '@/types/entities';

// ============================================
// STATUS
// ============================================

export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  paused: 'Paused',
  ended: 'Ended',
};

export const REFERRAL_STATUS_BADGE: Record<ReferralStatus, string> = {
  draft: 'bg-slate-700/60 text-slate-300 border-slate-600',
  active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  paused: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  ended: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
};

// ============================================
// REWARD TYPE
// ============================================

export const REFERRAL_REWARD_LABELS: Record<ReferralRewardType, string> = {
  cash: 'Cash',
  credit: 'Account Credit',
  discount: 'Discount',
  'free-month': 'Free Month',
  gift: 'Gift',
  points: 'Points',
  tiered: 'Tiered',
  custom: 'Custom',
};

export const REFERRAL_REWARD_BADGE: Record<ReferralRewardType, string> = {
  cash: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  credit: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  discount: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  'free-month': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  gift: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  points: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  tiered: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  custom: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};
