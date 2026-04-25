'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import FoundersPage from '@/modules/foundation/founders/page';

export default function FoundersRoute() {
  return (
    <DashboardLayout>
      <FoundersPage />
    </DashboardLayout>
  );
}
