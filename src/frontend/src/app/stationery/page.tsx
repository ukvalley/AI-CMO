'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import StationeryPage from '@/modules/brand/stationery/page';

export default function StationeryRoute() {
  return (
    <DashboardLayout>
      <StationeryPage />
    </DashboardLayout>
  );
}
