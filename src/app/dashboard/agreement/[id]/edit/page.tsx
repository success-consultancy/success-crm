'use client';

import React from 'react';
import Container from '@/components/atoms/container';
import { useParams } from 'next/navigation';
import { useGetAgreementById } from '@/query/get-agreements';
import PageLoader from '@/components/molecules/page-loader';
import { useGetMe } from '@/query/get-me';
import { FORM_STATE } from '@/types/common';
import { AgreementForm } from '@/app/dashboard/agreement/add/_components/add-agreement-form';
import { getAgreementDefaultValues } from '@/schema/agreement-schema';

const EditAgreementPage = () => {
  const params = useParams<{ id: string }>();
  const { data: agreement, isLoading: agreementLoading } = useGetAgreementById(params.id);
  const { data: me, isLoading: meLoading } = useGetMe();

  if (agreementLoading || meLoading) {
    return <PageLoader />;
  }

  return (
    <Container className="flex flex-col py-10 gap-8">
      <AgreementForm
        userId={me?.data?.id}
        formState={FORM_STATE.EDIT}
        id={Number(params.id)}
        defaultValues={getAgreementDefaultValues(agreement)}
      />
    </Container>
  );
};

export default EditAgreementPage;
