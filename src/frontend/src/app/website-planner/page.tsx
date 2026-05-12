'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import WebsitePlannerModule from '@/modules/content/website-planner/page';

export default function WebsitePlannerRoute() {
  return (
    <DashboardLayout>
      <WebsitePlannerModule />
    </DashboardLayout>
  );
}
