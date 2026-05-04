'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import LandingPageSystemPage from '@/modules/sales/landing-page-system/page';

export default function LandingPagesRoute() {
  return (
    <DashboardLayout>
      <LandingPageSystemPage />
    </DashboardLayout>
  );
}
