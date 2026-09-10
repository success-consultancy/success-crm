'use client';

import React from 'react';
import { useRouteId } from '@/hooks/use-route-id';
import ViewAgreementPage from './_components/view-agreement-page';

const AgreementViewPage = () => {
  const id = useRouteId();
  if (!id) return null;
  return <ViewAgreementPage id={id} />;
};

export default AgreementViewPage;
