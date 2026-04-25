'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BusinessProfilePage from '@/modules/foundation/business-profile/page';

export default function BusinessProfileRoute() {
  return (
    <DashboardLayout>
      <BusinessProfilePage />
    </DashboardLayout>
  );
}
