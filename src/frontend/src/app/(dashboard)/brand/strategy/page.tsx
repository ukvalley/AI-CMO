'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const BrandStrategyPage = dynamic(() => import('@/modules/brand/brand-strategy/page'), {
  loading: () => <PageLoader />,
});

export default function BrandStrategyRoute() {
  return <BrandStrategyPage />;
}