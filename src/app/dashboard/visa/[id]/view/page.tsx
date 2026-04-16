'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import VisaPageContent from './_components/view-visa-page';

const ViewEducationPage = () => {
  const params = useParams<{ id: string }>();
  const studentId = params.id;
  return <VisaPageContent studentId={studentId} />;
};

export default ViewEducationPage;
