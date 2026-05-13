'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BlogsPage from '@/modules/content/blogs/page';

export default function BlogsRoute() {
  return (
    <DashboardLayout>
      <BlogsPage />
    </DashboardLayout>
  );
}
