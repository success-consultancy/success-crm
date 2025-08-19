import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadClient } from '../leads/edit-lead';
import { QUERY_KEYS } from '@/constants/query-keys';
import { TribunalReviewSchemaType } from '@/schema/tribunal-review';

const addTribunalReview = async (payload: Omit<TribunalReviewSchemaType, 'serviceType'>) => {
  const { ...filteredPayload } = payload;
  const res = await api.post('/tribunalReview', filteredPayload);
  return res.data;
};

export const useAddTribunalReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, leadId }: { payload: TribunalReviewSchemaType; leadId?: string }) => {
      // 1. Create Visa Applicant
      const visa = await addTribunalReview(payload);

      // 2. Update lead client if leadId exists
      if (leadId) {
        const lead = await updateLeadClient(leadId, { tribunalReviewId: visa.id });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_LEAD_BY_ID],
        });
      }
    },
  });
};
