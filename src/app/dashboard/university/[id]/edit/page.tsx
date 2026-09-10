'use client';

import { useRouteId } from '@/hooks/use-route-id';
import { useGetUniversityById } from '@/query/get-university';
import PageLoader from '@/components/molecules/page-loader';
import { FORM_STATE } from '@/types/common';
import { UniversityForm } from '@/app/dashboard/university/add/_components/add-university-form';
import { getUniversityDefaultValues } from '@/schema/university-schema';

const EditUniversityPage = () => {
  const id = useRouteId();
  const { data: university, isLoading } = useGetUniversityById(id);

  if (!id || isLoading) return <PageLoader />;

  return (
    <UniversityForm
      formState={FORM_STATE.EDIT}
      id={Number(id)}
      defaultValues={getUniversityDefaultValues(university)}
    />
  );
};

export default EditUniversityPage;
