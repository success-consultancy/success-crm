import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EducationServicePage from './_components/education-service-page';

export const metadata = (): Metadata => {
  return {
    title: 'Education Service',
  };
};

const Page = () => {
  return (
    <>
      {/* <div className="p-2">
      <Link href="/education-service/add">
        <Button>Add Education Service</Button>
      </Link>
    </div> */}
      <EducationServicePage />
    </>
  );
};

export default Page;
