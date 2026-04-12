'use client';

import { useParams } from 'next/navigation';
import { useGetUniversityById } from '@/query/get-university';
import PageLoader from '@/components/molecules/page-loader';
import { FORM_STATE } from '@/types/common';
import { UniversityForm } from '@/app/dashboard/university/add/_components/add-university-form';
import { getUniversityDefaultValues } from '@/schema/university-schema';

const EditUniversityPage = () => {
  const params = useParams<{ id: string }>();
  const { data: university, isLoading } = useGetUniversityById(params.id);

  if (isLoading) return <PageLoader />;

  return (
    <UniversityForm
      formState={FORM_STATE.EDIT}
      id={Number(params.id)}
      defaultValues={getUniversityDefaultValues(university)}
    />
  );
};

export default EditUniversityPage;
