import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { UpdateAgreementSchemaType } from '@/schema/agreement-schema';

const editAgreement = async (payload: UpdateAgreementSchemaType) => {
  const { id, ...apiPayload } = payload;
  const res = await api.put(`/agreement/${id}`, apiPayload);
  return res.data;
};

export const useEditAgreement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editAgreement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_AGREEMENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_AGREEMENT_BY_ID],
      });
    },
  });
};
