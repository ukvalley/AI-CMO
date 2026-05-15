'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const StationeryPage = dynamic(() => import('@/modules/brand/stationery/page'), {
  loading: () => <PageLoader />,
});

export default function StationeryRoute() {
  return <StationeryPage />;
}