'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BrandIdentityPage from '@/modules/brand/brand-identity/page';

export default function BrandRoute() {
  return (
    <DashboardLayout>
      <BrandIdentityPage />
    </DashboardLayout>
  );
}
