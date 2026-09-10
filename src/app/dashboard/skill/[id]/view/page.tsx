'use client';

import React from 'react';
import { useRouteId } from '@/hooks/use-route-id';

import SkillAssessmentPageContent from './_components/view-skill-assessment-page';

const ViewSkillAssessmentPage = () => {
  const id = useRouteId();
  if (!id) return null;
  const skillAssessmentId = id;
  return <SkillAssessmentPageContent skillAssessmentId={skillAssessmentId} />;
};

export default ViewSkillAssessmentPage;
