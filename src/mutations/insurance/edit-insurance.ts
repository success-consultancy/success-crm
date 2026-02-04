import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { LeadSchemaType } from '@/schema/lead-schema';
import { toast } from 'sonner';
import { InsuranceSchemaType } from '@/schema/insurance';

const editInsurance = async (payload: Omit<InsuranceSchemaType, 'serviceType'>) => {
  const { id, ...filteredPayload } = payload;
  const res = await api.put(`/insuranceApplicant/${id}`, filteredPayload);
  return res.data;
};

export const useEditInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editInsurance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === QUERY_KEYS.GET_INSURANCE || query.queryKey[0] === QUERY_KEYS.GET_LEAD_BY_ID,
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
    },
  });
};
