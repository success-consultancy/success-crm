'use client';

import React from 'react';
import { useRouteId } from '@/hooks/use-route-id';
import ViewAnnouncementPage from './_components/view-announcement-page';

const AnnouncementViewPage = () => {
  const id = useRouteId();
  if (!id) return null;
  return <ViewAnnouncementPage id={id} />;
};

export default AnnouncementViewPage;
