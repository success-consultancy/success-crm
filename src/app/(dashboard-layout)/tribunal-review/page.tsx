import React from 'react';
import { Metadata } from 'next';
import TribunalReview from './_components/visa-service-page';

export const metadata: Metadata = {
  title: 'Tribunal Review Service',
};

const Page = () => {
  return <TribunalReview />;
};

export default Page;
