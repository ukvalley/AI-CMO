'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import LandingPagesModule from '@/modules/sales/landing-pages/page';

export default function LandingPagesRoute() {
  return (
    <DashboardLayout>
      <LandingPagesModule />
    </DashboardLayout>
  );
}
