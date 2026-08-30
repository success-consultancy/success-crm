import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_SOURCE } from '@/query/get-source';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

export interface AddSourcePayload {
  name: string;
  description?: string | null;
}

const addSource = async (payload: AddSourcePayload) => {
  const res = await api.post('/source', payload);
  return res.data;
};

export const useAddSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_SOURCE] });
      toast.success(toastMsg.addSuccess(ENTITY.source));
    },
    onError: (err: any) => {
      toast.error(getApiErrorMessage(err, toastMsg.addError(ENTITY.source)));
    },
  });
};
