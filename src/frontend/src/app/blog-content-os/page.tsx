'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BlogContentOSModule from '@/modules/content/blog-content-os/page';

export default function BlogContentOSRoute() {
  return (
    <DashboardLayout>
      <BlogContentOSModule />
    </DashboardLayout>
  );
}
