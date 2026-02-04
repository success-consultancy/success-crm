import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadClient } from '../leads/edit-lead';
import { QUERY_KEYS } from '@/constants/query-keys';
import { TribunalReviewSchemaType } from '@/schema/tribunal-review';
import { toast } from 'sonner';

const addTribunalReview = async (payload: Omit<TribunalReviewSchemaType, 'serviceType'>) => {
  const { ...filteredPayload } = payload;
  const res = await api.post('/tribunalReview', filteredPayload);
  return res.data;
};

const updateTribunalReview = async (payload: Omit<TribunalReviewSchemaType, 'serviceType'>) => {
  const { id, ...filteredPayload } = payload;
  const res = await api.put(`/tribunalReview/${id}`, filteredPayload);
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
export const useUpdateTribunalReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTribunalReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === QUERY_KEYS.GET_LEADS || query.queryKey[0] === QUERY_KEYS.GET_LEAD_BY_ID,
      });
    },
    onError: () => {
      toast("Error!", {
        description: "Something went wrong",
      });
    },
  });
};


type IPayloadStatus = {
  id: string;
  status: string;
};

const updateServiceStatus = async ({ id, status }: IPayloadStatus) => {
  const res = await api.patch(`/tribunalReview/${id}/status`, { status });
};

export const useUpdateTribunalStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateServiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === QUERY_KEYS.GET_TRIBUNAL_REVIEW_BY_ID
      });
      toast("Success!", {
        description: "Tribunal review has been updated",
      })
    },
    onError: () => {
      toast("Error!", {
        description: "Something went wrong",
      })
    },
  });
};
