'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SalesScriptEnginePage from '@/modules/sales/sales-script-engine/page';

export default function SalesScriptsRoute() {
  return (
    <DashboardLayout>
      <SalesScriptEnginePage />
    </DashboardLayout>
  );
}
