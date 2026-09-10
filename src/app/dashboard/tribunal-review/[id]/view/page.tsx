'use client';

import React from 'react';
import { useRouteId } from '@/hooks/use-route-id';

import TribunalReviewPageContent from './_components/view-trubunal-page';

const TribunalReviewPage = () => {
  const id = useRouteId();
  if (!id) return null;
  const studentId = id;
  return <TribunalReviewPageContent studentId={studentId} />;
};

export default TribunalReviewPage;
