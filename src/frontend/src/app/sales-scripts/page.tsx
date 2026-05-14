'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SalesScriptsModule from '@/modules/sales/sales-scripts/page';

export default function SalesScriptsRoute() {
  return (
    <DashboardLayout>
      <SalesScriptsModule />
    </DashboardLayout>
  );
}