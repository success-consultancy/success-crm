'use client';

import React from 'react';
import Container from '@/components/atoms/container';
import { useParams } from 'next/navigation';
import PageLoader from '@/components/molecules/page-loader';
import { useGetTribunalReviewById } from '@/query/get-tribunalreview';
import { FORM_STATE } from '@/types/common';
import { TribunalService } from '../../add/_components/insurance-service';
import { getTribunalDefaultValues } from '@/schema/tribunal-review';

const EditVisaServicePage = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading: visaLoading } = useGetTribunalReviewById(params.id);

  if (visaLoading) {
    return <PageLoader />;
  }

  return (
    <Container className="flex flex-col py-10 gap-8">
      <TribunalService
        userId={data?.userId || 0}
        formState={FORM_STATE.EDIT}
        defaultValues={getTribunalDefaultValues(data)}
      />
    </Container>
  );
};

export default EditVisaServicePage;
