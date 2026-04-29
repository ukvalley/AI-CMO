'use client';

import CompaniesPage from '@/modules/foundation/companies/page';

export default function CompaniesRoute() {
  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <CompaniesPage />
      </div>
    </div>
  );
}
