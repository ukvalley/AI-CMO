'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const ProductsPage = dynamic(() => import('@/modules/foundation/products/page'), {
  loading: () => <PageLoader />,
});

export default function ProductsRoute() {
  return <ProductsPage />;
}