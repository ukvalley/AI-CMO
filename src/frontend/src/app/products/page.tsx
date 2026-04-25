'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProductsPage from '@/modules/foundation/products/page';

export default function ProductsRoute() {
  return (
    <DashboardLayout>
      <ProductsPage />
    </DashboardLayout>
  );
}
