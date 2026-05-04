'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ReferralProgrammePage from '@/modules/programs/referral-programme/page';

export default function ReferralProgrammeRoute() {
  return (
    <DashboardLayout>
      <ReferralProgrammePage />
    </DashboardLayout>
  );
}
