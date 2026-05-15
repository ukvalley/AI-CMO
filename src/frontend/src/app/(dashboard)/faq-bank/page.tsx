'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const FAQBankModule = dynamic(() => import('@/modules/content/faq-bank/page'), {
  loading: () => <PageLoader />,
});

export default function FAQBankRoute() {
  return <FAQBankModule />;
}