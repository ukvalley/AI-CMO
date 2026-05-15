'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EmployeesPage = dynamic(() => import('@/modules/foundation/employees/page'), {
  loading: () => <PageLoader />,
});

export default function EmployeesRoute() {
  return <EmployeesPage />;
}