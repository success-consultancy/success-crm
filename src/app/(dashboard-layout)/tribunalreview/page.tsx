import React from 'react';
import { Metadata } from 'next';
import VisaServicePage from './_components/visa-service-page';

export const metadata: Metadata = {
  title: 'Visa Service',
};

const Page = () => {
  return <VisaServicePage />;
};

export default Page;
