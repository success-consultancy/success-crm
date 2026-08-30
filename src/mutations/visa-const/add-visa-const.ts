import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_VISA_CONST } from '@/query/get-visa';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

export interface AddVisaConstPayload {
  visaType: string;
}

const addVisaConst = async (payload: AddVisaConstPayload) => {
  const res = await api.post('/visa', payload);
  return res.data;
};

export const useAddVisaConst = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addVisaConst,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_VISA_CONST] });
      toast.success(toastMsg.addSuccess(ENTITY.visaType));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.addError(ENTITY.visaType)));
    },
  });
};
