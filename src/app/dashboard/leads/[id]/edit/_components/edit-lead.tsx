'use client';

import { useGetLeadById } from '@/query/get-leads';
import { LeadSchemaType } from '@/schema/lead-schema';
import AddLeadForm from '../../../add-lead/_components/add-lead-form';
import { transformLeadDates } from '@/utils/lead-helper';
import { useMemo } from 'react';
import SectionLoader from '@/components/molecules/section-loader';

type Props = {
  leadId: string;
};

const EditLeadClient = ({ leadId }: Props) => {
  const { data: leadData, isLoading } = useGetLeadById(leadId);

  const leadWithParsedDates = useMemo(() => {
    if (!leadData) return null;
    return {
      ...transformLeadDates(leadData),
      serviceType: JSON.parse(leadData.serviceType),
    } as LeadSchemaType;
  }, [leadData]);

  if (isLoading || !leadWithParsedDates) {
    return <SectionLoader />;
  }

  return <AddLeadForm mode="edit" defaultValues={leadWithParsedDates} />;
};

export default EditLeadClient;
