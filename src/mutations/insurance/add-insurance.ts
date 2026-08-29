import { api, getApiErrorMessage } from '@/lib/api';
import { VisaSchemaType } from '@/schema/visa-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateServiceQueries } from '@/mutations/invalidate-service-queries';
import { updateLeadClient } from '../leads/edit-lead';
import { QUERY_KEYS } from '@/constants/query-keys';
import { InsuranceSchemaType } from '@/schema/insurance';

const addInsurance = async (payload: Omit<InsuranceSchemaType, 'serviceType'>) => {
  const { ...filteredPayload } = payload;
  const res = await api.post('/insuranceApplicant', filteredPayload);
  return res.data;
};

export const useAddInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, leadId }: { payload: InsuranceSchemaType; leadId?: string }) => {
      // 1. Create Visa Applicant
      const visa = await addInsurance(payload);

      // 2. Update lead client if leadId exists
      if (leadId) {
        const lead = await updateLeadClient(leadId, { insuranceApplicantId: visa.id });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_LEAD_BY_ID],
        });
      }
    },
    // The list page is reached immediately after adding; without this the global
    // 25s staleTime would serve a cached list that is missing the new record.
    onSuccess: () => {
      invalidateServiceQueries(queryClient, 'insurance');
    },
  });
};
