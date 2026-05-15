'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const TestimonialsModule = dynamic(() => import('@/modules/content/testimonials/page'), {
  loading: () => <PageLoader />,
});

export default function TestimonialsRoute() {
  return <TestimonialsModule />;
}