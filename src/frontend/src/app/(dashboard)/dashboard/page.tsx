'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const Dashboard = dynamic(() => import('@/pages/Dashboard'), {
  loading: () => <PageLoader />,
});

export default function DashboardRoute() {
  return <Dashboard />;
}