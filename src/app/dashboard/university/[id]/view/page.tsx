'use client';

import { useRouteId } from '@/hooks/use-route-id';
import ViewUniversityPage from './_components/view-university-page';

const UniversityViewPage = () => {
  const id = useRouteId();
  if (!id) return null;
  return <ViewUniversityPage id={id} />;
};

export default UniversityViewPage;
