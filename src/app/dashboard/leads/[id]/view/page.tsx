'use client';

import React from 'react';
import LeadPageContent from './_components/view-lead-page';
import { useRouteId } from '@/hooks/use-route-id';

const ViewLeadPage = () => {
  const id = useRouteId();
  if (!id) return null;
  const leadId = id;
  return <LeadPageContent leadId={leadId} />;
};

export default ViewLeadPage;
