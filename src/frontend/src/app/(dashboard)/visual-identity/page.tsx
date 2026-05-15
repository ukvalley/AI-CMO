'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const VisualIdentityPage = dynamic(() => import('@/modules/brand/visual-identity/page'), {
  loading: () => <PageLoader />,
});

export default function VisualIdentityRoute() {
  return <VisualIdentityPage />;
}