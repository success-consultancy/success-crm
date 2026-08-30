import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_OCCUPATIONS } from '@/query/get-occupations';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

export interface EditOccupationPayload {
  id: number;
  code?: number;
  title?: string;
}

const editOccupation = async ({ id, ...payload }: EditOccupationPayload) => {
  const res = await api.put(`/occupation/${id}`, payload);
  return res.data;
};

export const useEditOccupation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editOccupation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_OCCUPATIONS] });
      toast.success(toastMsg.updateSuccess(ENTITY.occupation));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.updateError(ENTITY.occupation)));
    },
  });
};
