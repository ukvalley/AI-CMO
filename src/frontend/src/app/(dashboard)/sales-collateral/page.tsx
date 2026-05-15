'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const SalesCollateralModule = dynamic(() => import('@/modules/sales/sales-collateral/page'), {
  loading: () => <PageLoader />,
});

export default function SalesCollateralRoute() {
  return <SalesCollateralModule />;
}