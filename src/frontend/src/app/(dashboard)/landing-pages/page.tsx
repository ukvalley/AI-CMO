'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const LandingPagesModule = dynamic(() => import('@/modules/sales/landing-pages/page'), {
  loading: () => <PageLoader />,
});

export default function LandingPagesRoute() {
  return <LandingPagesModule />;
}