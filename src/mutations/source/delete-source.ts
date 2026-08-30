import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_SOURCE } from '@/query/get-source';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

const deleteSource = async (id: number) => {
  const res = await api.delete(`/source/${id}`);
  return res.data;
};

export const useDeleteSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_SOURCE] });
      toast.success(toastMsg.deleteSuccess(ENTITY.source));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.source)));
    },
  });
};
