'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ViewAnnouncementPage from './_components/view-announcement-page';

const AnnouncementViewPage = () => {
  const params = useParams<{ id: string }>();
  return <ViewAnnouncementPage id={params.id} />;
};

export default AnnouncementViewPage;
