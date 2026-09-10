'use client';

import React from 'react';
import EducationPageContent from './_components/view-education-page';
import { useRouteId } from '@/hooks/use-route-id';

const ViewEducationPage = () => {
  const id = useRouteId();
  if (!id) return null;
  const educationId = id;
  return <EducationPageContent studentId={educationId} />;
};

export default ViewEducationPage;
