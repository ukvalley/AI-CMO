'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EventsPage = dynamic(
  () => import('@/modules/marketing/events/page').then(m => m.default),
  { loading: () => <PageLoader /> }
);

export default function EventsRoute() {
  return <EventsPage />;
}