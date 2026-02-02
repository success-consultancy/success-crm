import React from 'react';
import { Metadata } from 'next';
import Insurance from './_components/insurance-service-page';

export const metadata: Metadata = {
  title: 'Insurance Service',
};

const Page = () => {
  return <Insurance />;
};

export default Page;
