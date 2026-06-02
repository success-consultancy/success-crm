import React from 'react';
import { Metadata } from 'next';
import { AnnouncementForm } from './_components/announcement-form';
import { FORM_STATE } from '@/types/common';

export const metadata: Metadata = {
  title: 'Add Announcement',
};

const Page = () => {
  return <AnnouncementForm formState={FORM_STATE.ADD} />;
};

export default Page;
