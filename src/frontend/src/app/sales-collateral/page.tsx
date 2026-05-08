'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function SalesCollateralRoute() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Sales Collateral</h1>
        <p className="text-[#878e9a]">One-pagers, brochures, case studies.</p>
        <div className="mt-8 p-8 bg-[#151920] rounded-xl border border-white/10 text-center">
          <p className="text-[#686f7e]">Module under development. Check CLAUDE.md for implementation guide.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
