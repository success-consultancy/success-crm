import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_VISA_CONST } from '@/query/get-visa';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

const deleteVisaConst = async (id: number) => {
  const res = await api.delete(`/visa/${id}`);
  return res.data;
};

export const useDeleteVisaConst = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVisaConst,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_VISA_CONST] });
      toast.success(toastMsg.deleteSuccess(ENTITY.visaType));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.visaType)));
    },
  });
};
