'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import EmployeesPage from '@/modules/foundation/employees/page';

export default function EmployeesRoute() {
  return (
    <DashboardLayout>
      <EmployeesPage />
    </DashboardLayout>
  );
}
