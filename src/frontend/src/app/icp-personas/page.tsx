'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import IcpPersonasPage from '@/modules/foundation/icp-personas/page';

export default function IcpPersonasRoute() {
  return (
    <DashboardLayout>
      <IcpPersonasPage />
    </DashboardLayout>
  );
}
