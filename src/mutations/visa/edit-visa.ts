import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';

import { toast } from 'sonner';
import { newVisaServiceSchema, NewVisaServiceType } from '@/schema/visa-service/new-visa.schema';

const editVisa = async (payload: NewVisaServiceType & { id: number }) => {
  const { id, ...filteredPayload } = payload;
  const res = await api.put(`/visaApplicant/${id}`, filteredPayload);
  return res.data;
};

export const useEditVisa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editVisa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === QUERY_KEYS.GET_VISAS || query.queryKey[0] === QUERY_KEYS.GET_VISA_BY_ID,
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
    },
  });
};
