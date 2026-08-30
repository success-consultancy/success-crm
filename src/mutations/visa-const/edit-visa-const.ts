import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_VISA_CONST } from '@/query/get-visa';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

export interface EditVisaConstPayload {
  id: number;
  visaType: string;
}

const editVisaConst = async ({ id, ...payload }: EditVisaConstPayload) => {
  const res = await api.put(`/visa/${id}`, payload);
  return res.data;
};

export const useEditVisaConst = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editVisaConst,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_VISA_CONST] });
      toast.success(toastMsg.updateSuccess(ENTITY.visaType));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.updateError(ENTITY.visaType)));
    },
  });
};
