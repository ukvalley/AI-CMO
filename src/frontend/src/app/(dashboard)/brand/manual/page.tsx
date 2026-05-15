'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const BrandManualPage = dynamic(() => import('@/modules/brand/brand-manual/page'), {
  loading: () => <PageLoader />,
});

export default function BrandManualRoute() {
  return <BrandManualPage />;
}