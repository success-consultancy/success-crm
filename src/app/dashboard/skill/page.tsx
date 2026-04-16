import React from 'react';
import { Metadata } from 'next';
import SkillAssessmentServicePage from './_components/skill-assessment-service-page';

export const metadata: Metadata = {
  title: 'Skill Assessment Service',
};

const Page = () => {
  return <SkillAssessmentServicePage />;
};

export default Page;
