'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import FAQBankModule from '@/modules/content/faq-bank/page';

export default function FAQBankRoute() {
  return (
    <DashboardLayout>
      <FAQBankModule />
    </DashboardLayout>
  );
}