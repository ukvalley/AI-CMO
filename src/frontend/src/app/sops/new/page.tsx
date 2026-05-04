'use client';

import { Suspense } from 'react';
import { SopEditorPage } from '@/components/sop/SopEditorPage';

export default function SopNewRoute() {
  return (
    <Suspense fallback={null}>
      <SopEditorPage />
    </Suspense>
  );
}
