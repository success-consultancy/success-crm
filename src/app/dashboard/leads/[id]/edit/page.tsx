'use client';

import React from 'react';
import EditLeadClient from './_components/edit-lead';
import Container from '@/components/atoms/container';
import { useRouteId } from '@/hooks/use-route-id';

const EditLeadPage = () => {
  const id = useRouteId();
  if (!id) return null;
  return (
    <Container className="flex flex-col flex-1 min-h-0 overflow-hidden py-5 gap-4">
      <EditLeadClient leadId={id} />
    </Container>
  );
};

export default EditLeadPage;
