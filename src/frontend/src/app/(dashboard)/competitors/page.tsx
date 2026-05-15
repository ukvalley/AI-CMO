'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const CompetitorsPage = dynamic(() => import('@/modules/foundation/competitors/page'), {
  loading: () => <PageLoader />,
});

export default function CompetitorsRoute() {
  return <CompetitorsPage />;
}