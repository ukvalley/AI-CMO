'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import WebsiteProjectPage from '@/modules/website/website-project/page';

export default function WebsiteContentRoute() {
  return (
    <DashboardLayout>
      <WebsiteProjectPage />
    </DashboardLayout>
  );
}
