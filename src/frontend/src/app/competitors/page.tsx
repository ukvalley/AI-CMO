'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import CompetitorsPage from '@/modules/foundation/competitors/page';

export default function CompetitorsRoute() {
  return (
    <DashboardLayout>
      <CompetitorsPage />
    </DashboardLayout>
  );
}
