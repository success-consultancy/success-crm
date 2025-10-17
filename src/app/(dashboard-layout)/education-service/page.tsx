import React from 'react';
import { Metadata } from 'next';
import EducationServicePage from './_components/education-service-page';

export const metadata: Metadata = {
  title: 'Education Service',
};

const Page = () => {
  return <EducationServicePage />;
};

export default Page;
