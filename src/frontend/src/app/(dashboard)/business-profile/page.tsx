'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const BusinessProfilePage = dynamic(() => import('@/modules/foundation/business-profile/page'), {
  loading: () => <PageLoader />,
});

export default function BusinessProfileRoute() {
  return <BusinessProfilePage />;
}