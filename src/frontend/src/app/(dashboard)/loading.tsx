/**
 * Dashboard Loading Fallback
 *
 * Shown by Next.js during client-side navigation within the (dashboard) route group.
 * Provides immediate visual feedback so users never see a frozen page.
 */

import { PageLoader } from '@/components/ui/PageLoader';

export default function DashboardLoading() {
  return <PageLoader />;
}