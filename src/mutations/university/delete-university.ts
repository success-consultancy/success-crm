import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_UNIVERSITY } from '@/query/get-university';
import toast from 'react-hot-toast';

import { ENTITY, toastMsg } from '@/constants/messages';
const deleteUniversity = async (id: number) => {
  const res = await api.delete(`/university/${id}`);
  return res.data;
};

export const useDeleteUniversity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUniversity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_UNIVERSITY] });
      toast.success(toastMsg.deleteSuccess(ENTITY.university));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.university)));
    },
  });
};
