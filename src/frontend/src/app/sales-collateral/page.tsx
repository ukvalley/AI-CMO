'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SalesCollateralModule from '@/modules/sales/sales-collateral/page';

export default function SalesCollateralRoute() {
  return (
    <DashboardLayout>
      <SalesCollateralModule />
    </DashboardLayout>
  );
}