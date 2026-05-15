'use client';

import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDataStore, useAuthStore } from '@/stores';

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Manually rehydrate stores after mount (skipHydration prevents render blocking)
  useEffect(() => {
    useDataStore.persist.rehydrate();
    useAuthStore.persist.rehydrate();
  }, []);

  return <DashboardLayout>{children}</DashboardLayout>;
}