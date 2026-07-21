import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_SOURCE } from '@/query/get-source';
import toast from 'react-hot-toast';

export interface EditSourcePayload {
  id: number;
  name: string;
  description?: string | null;
}

const editSource = async ({ id, ...payload }: EditSourcePayload) => {
  const res = await api.put(`/source/${id}`, payload);
  return res.data;
};

export const useEditSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_SOURCE] });
      toast.success('Source updated successfully');
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
