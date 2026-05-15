'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const NewsletterContentOSModule = dynamic(() => import('@/modules/content/newsletter-content-os/page'), {
  loading: () => <PageLoader />,
});

export default function NewsletterContentOSRoute() {
  return <NewsletterContentOSModule />;
}