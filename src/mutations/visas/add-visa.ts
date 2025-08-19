import { api } from '@/lib/api';
import { VisaSchemaType } from '@/schema/visa-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadClient } from '../leads/edit-lead';
import { QUERY_KEYS } from '@/constants/query-keys';

const addVisa = async (payload: Omit<VisaSchemaType, 'serviceType'>) => {
  const { ...filteredPayload } = payload;
  const res = await api.post('/visaApplicant', filteredPayload);
  return res.data;
};

export const useAddVisa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, leadId }: { payload: VisaSchemaType; leadId?: string }) => {
      // 1. Create Visa Applicant
      const visa = await addVisa(payload);

      // 2. Update lead client if leadId exists
      if (leadId) {
        const lead = await updateLeadClient(leadId, { visaApplicantId: visa.id });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_LEAD_BY_ID],
        });
      }
    },
  });
};
