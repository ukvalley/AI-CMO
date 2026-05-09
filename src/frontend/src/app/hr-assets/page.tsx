'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import HRAssetsPage from '@/modules/operations/hr-assets/page';

export default function HRAssetsRoute() {
  return (
    <DashboardLayout>
      <HRAssetsPage />
    </DashboardLayout>
  );
}
