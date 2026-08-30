import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_OCCUPATIONS } from '@/query/get-occupations';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

const deleteOccupation = async (id: number) => {
  const res = await api.delete(`/occupation/${id}`);
  return res.data;
};

export const useDeleteOccupation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOccupation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_OCCUPATIONS] });
      toast.success(toastMsg.deleteSuccess(ENTITY.occupation));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.occupation)));
    },
  });
};
