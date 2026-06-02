'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import EditAnnouncementPage from './_components/edit-announcement-page';

const AnnouncementEditPage = () => {
  const params = useParams<{ id: string }>();
  return <EditAnnouncementPage id={params.id} />;
};

export default AnnouncementEditPage;
