'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const SocialMediaOSModule = dynamic(() => import('@/modules/marketing/social-media-os/page'), {
  loading: () => <PageLoader />,
});

export default function SocialMediaOSRoute() {
  return <SocialMediaOSModule />;
}