'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const BrandPage = dynamic(() => import('@/modules/brand/brand/page'), {
  loading: () => <PageLoader />,
});

export default function BrandRoute() {
  return <BrandPage />;
}