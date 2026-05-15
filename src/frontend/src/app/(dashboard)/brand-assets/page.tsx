'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const BrandAssetsPage = dynamic(() => import('@/modules/brand/brand-assets/page'), {
  loading: () => <PageLoader />,
});

export default function BrandAssetsRoute() {
  return <BrandAssetsPage />;
}