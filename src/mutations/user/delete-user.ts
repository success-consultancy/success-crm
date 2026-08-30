import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_USERS } from '@/query/get-user';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

const deleteUser = async (id: number) => {
  const res = await api.delete(`/user/${id}`);
  return res.data;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_USERS] });
      toast.success(toastMsg.deleteSuccess(ENTITY.user));
    },
    onError: (error: any) => {
      toast.error(toastMsg.deleteError(ENTITY.user));
    },
  });
};
