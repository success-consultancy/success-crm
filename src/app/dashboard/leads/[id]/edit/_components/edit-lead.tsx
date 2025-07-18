'use client';

import { useGetLeadById } from '@/query/get-leads';
import { LeadSchemaType } from '@/schemas/lead-schema';
import { transformLeadDates } from '@/utils/lead-helper';
import AddLeadForm from '../../../add-lead/_components/add-lead-form';

type Props = {
  leadId: string;
};

const EditLeadClient = ({ leadId }: Props) => {
  const { data: leadData, isLoading } = useGetLeadById(leadId);

  if (isLoading || !leadData) {
    return <p>Loading...</p>;
  }
  console.log({ leadData });
  const leadWithParsedDates = transformLeadDates(leadData);

  return (
    <>
      <AddLeadForm
        mode="edit"
        defaultValues={
          {
            ...leadWithParsedDates,
            serviceType: JSON.parse(leadData.serviceType),
          } as unknown as LeadSchemaType
        }
      />
    </>
  );
};

export default EditLeadClient;
