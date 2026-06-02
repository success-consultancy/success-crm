'use client';

import React from 'react';
import { useGetAnnouncementById } from '@/query/get-announcements';
import { AnnouncementForm } from '@/app/dashboard/updates-and-announcements/add/_components/announcement-form';
import PageLoader from '@/components/molecules/page-loader';
import { FORM_STATE } from '@/types/common';

type Props = { id: string };

const EditAnnouncementPage = ({ id }: Props) => {
  const { data: announcement, isLoading } = useGetAnnouncementById(id);

  if (isLoading) return <PageLoader />;
  if (!announcement) return null;

  return (
    <AnnouncementForm
      formState={FORM_STATE.EDIT}
      id={announcement.id}
      defaultValues={{
        title: announcement.title,
        description: announcement.description,
        photoURL: announcement.photoURL,
      }}
    />
  );
};

export default EditAnnouncementPage;
