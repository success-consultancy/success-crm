import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { EditVisaServiceType } from '@/schema/visa-service/edit-visa.schema';
import { toast } from 'sonner';

const editVisa = async (payload: EditVisaServiceType & { id: number }) => {
  const { id, courseFee, ...filteredPayload } = payload;
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
          query.queryKey[0] === QUERY_KEYS.GET_VISA || query.queryKey[0] === QUERY_KEYS.GET_VISA_BY_ID,
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
    },
  });
};
