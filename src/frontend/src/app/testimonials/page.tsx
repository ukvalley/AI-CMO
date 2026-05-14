'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import TestimonialsModule from '@/modules/content/testimonials/page';

export default function TestimonialsRoute() {
  return (
    <DashboardLayout>
      <TestimonialsModule />
    </DashboardLayout>
  );
}