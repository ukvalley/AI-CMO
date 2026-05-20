'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SEOOSPage } from '@/modules/marketing';

export default function SEORoute() {
  return (
    <DashboardLayout>
      <SEOOSPage />
    </DashboardLayout>
  );
}