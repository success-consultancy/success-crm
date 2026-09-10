'use client';

import React from 'react';
import { useRouteId } from '@/hooks/use-route-id';
import EditAnnouncementPage from './_components/edit-announcement-page';

const AnnouncementEditPage = () => {
  const id = useRouteId();
  if (!id) return null;
  return <EditAnnouncementPage id={id} />;
};

export default AnnouncementEditPage;
