'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import VisualIdentityPage from '@/modules/brand/visual-identity/page';

export default function VisualIdentityRoute() {
  return (
    <DashboardLayout>
      <VisualIdentityPage />
    </DashboardLayout>
  );
}
