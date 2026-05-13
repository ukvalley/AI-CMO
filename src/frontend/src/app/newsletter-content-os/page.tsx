'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import NewsletterContentOSModule from '@/modules/content/newsletter-content-os/page';

export default function NewsletterContentOSRoute() {
  return (
    <DashboardLayout>
      <NewsletterContentOSModule />
    </DashboardLayout>
  );
}
