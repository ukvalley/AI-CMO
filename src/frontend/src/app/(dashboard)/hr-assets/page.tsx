'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const HRAssetsPage = dynamic(() => import('@/modules/operations/hr-assets/page'), {
  loading: () => <PageLoader />,
});

export default function HRAssetsRoute() {
  return <HRAssetsPage />;
}