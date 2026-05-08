'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import HrSystemPage from '@/modules/operations/hr-system/page';

export default function HrJobsRoute() {
  return (
    <DashboardLayout>
      <HrSystemPage />
    </DashboardLayout>
  );
}
