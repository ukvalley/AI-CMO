'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BrandStrategyPage from '@/modules/brand/brand-strategy/page';

export default function BrandStrategyRoute() {
  return (
    <DashboardLayout>
      <BrandStrategyPage />
    </DashboardLayout>
  );
}
