'use client';

import React from 'react';
import EducationPageContent from './_components/view-education-page';
import { useParams } from 'next/navigation';

const ViewEducationPage = () => {
  const params = useParams<{ id: string }>();
  const educationId = params.id;
  return <EducationPageContent studentId={educationId} />;
};

export default ViewEducationPage;
