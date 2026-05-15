'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const WebsitePlannerModule = dynamic(() => import('@/modules/content/website-planner/page'), {
  loading: () => <PageLoader />,
});

export default function WebsitePlannerRoute() {
  return <WebsitePlannerModule />;
}