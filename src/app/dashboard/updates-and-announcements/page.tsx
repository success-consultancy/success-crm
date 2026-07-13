import React from 'react';
import { Metadata } from 'next';
import AnnouncementPage from './_components/announcement-page';

export const metadata: Metadata = {
  title: 'News & Updates',
};

const Page = () => {
  return <AnnouncementPage />;
};

export default Page;
