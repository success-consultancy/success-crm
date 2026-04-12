'use client';

import React from 'react';
import LeadPageContent from './_components/view-lead-page';
import { useParams } from 'next/navigation';

const ViewLeadPage = () => {
  const params = useParams<{ id: string }>();
  const leadId = params.id;
  return <LeadPageContent leadId={leadId} />;
};

export default ViewLeadPage;
