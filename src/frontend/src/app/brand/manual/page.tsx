'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BrandManualPage from '@/modules/brand/brand-manual/page';

export default function BrandManualRoute() {
  return (
    <DashboardLayout>
      <BrandManualPage />
    </DashboardLayout>
  );
}
