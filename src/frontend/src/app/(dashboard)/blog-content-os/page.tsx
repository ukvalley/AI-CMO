'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const BlogContentOSModule = dynamic(() => import('@/modules/content/blog-content-os/page'), {
  loading: () => <PageLoader />,
});

export default function BlogContentOSRoute() {
  return <BlogContentOSModule />;
}