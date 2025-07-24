'use client';

import React from 'react';
import LeadPageContent from './_components/view-lead-page';
import { useParams } from 'next/navigation';
import { useGetLeadById } from '@/query/get-leads';

const ViewLeadPage = () => {
  const params = useParams<{ id: string }>();
  const leadId = params.id;
  const { data: lead, isLoading } = useGetLeadById(leadId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!lead) {
    return <p>Lead not found</p>;
  }

  console.log('Lead data:', lead);

  return <LeadPageContent leadId={leadId} lead={lead} />;
};

export default ViewLeadPage;
