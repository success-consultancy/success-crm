'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import TribunalReviewPageContent from './_components/view-trubunal-page';

const TribunalReviewPage = () => {
  const params = useParams<{ id: string }>();
  const studentId = params.id;
  return <TribunalReviewPageContent studentId={studentId} />;
};

export default TribunalReviewPage;
