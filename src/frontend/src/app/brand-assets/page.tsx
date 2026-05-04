'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BrandAssetsPage from '@/modules/brand/brand-assets/page';

export default function BrandAssetsRoute() {
  return (
    <DashboardLayout>
      <BrandAssetsPage />
    </DashboardLayout>
  );
}
