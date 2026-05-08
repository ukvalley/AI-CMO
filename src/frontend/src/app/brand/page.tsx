'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BrandPage from '@/modules/brand/brand/page';

export default function BrandRoute() {
  return (
    <DashboardLayout>
      <BrandPage />
    </DashboardLayout>
  );
}
