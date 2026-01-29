import React from 'react';
import { Metadata } from 'next';
import AgreementPage from './_components/agreement-page';

export const metadata: Metadata = {
  title: 'Agreements',
};

const Page = () => {
  return <AgreementPage />;
};

export default Page;
