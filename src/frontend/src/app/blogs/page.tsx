'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BlogSystemPage from '@/modules/content/blog-system/page';

export default function BlogsRoute() {
  return (
    <DashboardLayout>
      <BlogSystemPage />
    </DashboardLayout>
  );
}
