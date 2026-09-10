'use client';

import React from 'react';
import { useRouteId } from '@/hooks/use-route-id';

import VisaPageContent from './_components/view-visa-page';

const ViewEducationPage = () => {
  const id = useRouteId();
  if (!id) return null;
  const studentId = id;
  return <VisaPageContent studentId={studentId} />;
};

export default ViewEducationPage;
