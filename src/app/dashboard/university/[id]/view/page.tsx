'use client';

import { useParams } from 'next/navigation';
import ViewUniversityPage from './_components/view-university-page';

const UniversityViewPage = () => {
  const params = useParams<{ id: string }>();
  return <ViewUniversityPage id={params.id} />;
};

export default UniversityViewPage;
