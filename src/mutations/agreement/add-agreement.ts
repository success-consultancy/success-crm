import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { AgreementSchemaType } from '@/schema/agreement-schema';

const addAgreement = async (payload: AgreementSchemaType) => {
  // Remove file field as API doesn't accept it during creation
  const { file, ...apiPayload } = payload;
  const res = await api.post('/agreement', apiPayload);
  return res.data;
};

export const useAddAgreement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAgreement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_AGREEMENTS],
      });
    },
  });
};
