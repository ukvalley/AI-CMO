'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const SalesScriptsModule = dynamic(() => import('@/modules/sales/sales-scripts/page'), {
  loading: () => <PageLoader />,
});

export default function SalesScriptsRoute() {
  return <SalesScriptsModule />;
}