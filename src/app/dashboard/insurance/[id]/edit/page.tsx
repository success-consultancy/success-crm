'use client';

import React from 'react';
import Container from '@/components/atoms/container';
import { useRouteId } from '@/hooks/use-route-id';
import PageLoader from '@/components/molecules/page-loader';
import { FORM_STATE } from '@/types/common';
import { InsuranceService } from '../../add/_components/insurance-service';
import { getInsuranceDefaultValues } from '@/schema/insurance';
import { useGetInsuranceById } from '@/query/get-insurance';
import Accounts from '../view/_components/accounts';

const EditInsuranceServicePage = () => {
  const id = useRouteId();
  const { data, isLoading: insuranceLoading } = useGetInsuranceById(id);

  if (!id || insuranceLoading) {
    return <PageLoader />;
  }

  return (
    <Container className="flex flex-col py-10 gap-8">
      <InsuranceService
        userId={data?.userId || 0}
        formState={FORM_STATE.EDIT}
        defaultValues={getInsuranceDefaultValues(data)}
      />
      <Accounts accounts={data?.accounts || []} id={data?.id} />
    </Container>
  );
};

export default EditInsuranceServicePage;
