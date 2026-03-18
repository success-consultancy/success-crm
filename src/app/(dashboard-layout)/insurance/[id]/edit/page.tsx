'use client';

import React from 'react';
import Container from '@/components/atoms/container';
import { useParams } from 'next/navigation';
import PageLoader from '@/components/molecules/page-loader';
import { FORM_STATE } from '@/types/common';
import { InsuranceService } from '../../add/_components/insurance-service';
import { getInsuranceDefaultValues } from '@/schema/insurance';
import { useGetInsuranceById } from '@/query/get-insurance';

const EditInsuranceServicePage = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading: insuranceLoading } = useGetInsuranceById(params.id);

  if (insuranceLoading) {
    return <PageLoader />;
  }

  return (
    <Container className="flex flex-col py-10 gap-8">
      <InsuranceService
        userId={data?.userId || 0}
        formState={FORM_STATE.EDIT}
        defaultValues={getInsuranceDefaultValues(data)}
      />
    </Container>
  );
};

export default EditInsuranceServicePage;
