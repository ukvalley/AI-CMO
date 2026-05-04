'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { SopEditorPage } from '@/components/sop/SopEditorPage';

export default function SopEditRoute() {
  const params = useParams();
  const id = (params?.id as string) || '';

  return (
    <Suspense fallback={null}>
      <SopEditorPage sopId={id} />
    </Suspense>
  );
}
