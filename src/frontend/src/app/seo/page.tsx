'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SeoSystemPage from '@/modules/marketing/seo-system/page';

export default function SeoRoute() {
  return (
    <DashboardLayout>
      <SeoSystemPage />
    </DashboardLayout>
  );
}
