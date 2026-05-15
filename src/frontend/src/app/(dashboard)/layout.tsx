'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDataStore, useAuthStore } from '@/stores';

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = React.useState(false);

  // Manually rehydrate stores after mount (skipHydration prevents render blocking)
  useEffect(() => {
    useDataStore.persist.rehydrate();
    useAuthStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  // Redirect to login if not authenticated (after hydration resolves)
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  // Don't render dashboard content until we know auth state
  if (!hydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}