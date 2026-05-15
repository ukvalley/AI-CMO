'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const IcpPersonasPage = dynamic(() => import('@/modules/foundation/icp-personas/page'), {
  loading: () => <PageLoader />,
});

export default function IcpPersonasRoute() {
  return <IcpPersonasPage />;
}