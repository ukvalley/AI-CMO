'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const CompaniesPage = dynamic(() => import('@/modules/foundation/companies/page'), {
  loading: () => <PageLoader />,
});

export default function CompaniesRoute() {
  return (
    <div className="min-h-screen bg-[#0d1117] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <CompaniesPage />
      </div>
    </div>
  );
}