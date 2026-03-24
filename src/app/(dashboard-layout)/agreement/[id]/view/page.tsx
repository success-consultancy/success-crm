'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ViewAgreementPage from './_components/view-agreement-page';

const AgreementViewPage = () => {
  const params = useParams<{ id: string }>();
  return <ViewAgreementPage id={params.id} />;
};

export default AgreementViewPage;
