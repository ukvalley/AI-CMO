'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const FoundersPage = dynamic(() => import('@/modules/foundation/founders/page'), {
  loading: () => <PageLoader />,
});

export default function FoundersRoute() {
  return <FoundersPage />;
}