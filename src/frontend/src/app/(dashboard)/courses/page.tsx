'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const CoursesPage = dynamic(
  () => import('@/modules/programs/courses/page').then(m => m.default),
  { loading: () => <PageLoader /> }
);

export default function CoursesRoute() {
  return <CoursesPage />;
}