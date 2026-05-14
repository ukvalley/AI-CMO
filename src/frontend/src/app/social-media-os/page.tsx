'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SocialMediaOSModule from '@/modules/marketing/social-media-os/page';

export default function SocialMediaOSRoute() {
  return (
    <DashboardLayout>
      <SocialMediaOSModule />
    </DashboardLayout>
  );
}