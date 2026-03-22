'use client';

import React from 'react';
import Container from '@/components/atoms/container';
import { useParams } from 'next/navigation';
import PageLoader from '@/components/molecules/page-loader';
import { useGetTribunalReviewById } from '@/query/get-tribunalreview';
import { FORM_STATE } from '@/types/common';
import { TribunalService } from '../../add/_components/tribunal-service';
import { getTribunalDefaultValues } from '@/schema/tribunal-review';
import Accounts from '../view/_components/accounts';

const TribunalServicePage = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading: visaLoading } = useGetTribunalReviewById(params.id);

  if (visaLoading) {
    return <PageLoader />;
  }


  return (
    <Container className="flex flex-col py-10 gap-8">
      <TribunalService userId={data?.userId || 0} formState={FORM_STATE.EDIT} defaultValues={getTribunalDefaultValues(data)} />
      <Accounts accounts={(data?.accounts || []) as any} id={data?.id} />
    </Container>
  );
};

export default TribunalServicePage;
