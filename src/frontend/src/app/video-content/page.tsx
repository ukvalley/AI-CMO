'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import VideoContentModule from '@/modules/sales/video-content/page';

export default function VideoContentRoute() {
  return (
    <DashboardLayout>
      <VideoContentModule />
    </DashboardLayout>
  );
}