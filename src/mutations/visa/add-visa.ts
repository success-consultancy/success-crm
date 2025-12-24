import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadClient } from '../leads/edit-lead';
import { QUERY_KEYS } from '@/constants/query-keys';
import { NewVisaServiceType } from '@/schema/visa-service/new-visa.schema';

const addVisaService = async (payload: NewVisaServiceType) => {
  const { ...filteredPayload } = payload;
  const res = await api.post('/visaApplicant', filteredPayload);
  return res.data;
};

export const useAddVisaService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, leadId }: { payload: NewVisaServiceType; leadId?: string }) => {
      // 1. Create Visa Applicant
      const visa = await addVisaService(payload);

      // 2. Update lead client if leadId exists
      if (leadId) {
        const lead = await updateLeadClient(leadId, { visaApplicantId: visa.id });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_LEAD_BY_ID],
        });
      }

      // Invalidate visa list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_VISAS],
      });

      return visa;
    },
  });
};
