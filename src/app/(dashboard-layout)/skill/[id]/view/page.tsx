'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import SkillAssessmentPageContent from './_components/view-skill-assessment-page';

const ViewSkillAssessmentPage = () => {
  const params = useParams<{ id: string }>();
  const skillAssessmentId = params.id;
  return <SkillAssessmentPageContent skillAssessmentId={skillAssessmentId} />;
};

export default ViewSkillAssessmentPage;
