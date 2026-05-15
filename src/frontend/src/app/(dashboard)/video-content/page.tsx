'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const VideoContentModule = dynamic(() => import('@/modules/sales/video-content/page'), {
  loading: () => <PageLoader />,
});

export default function VideoContentRoute() {
  return <VideoContentModule />;
}