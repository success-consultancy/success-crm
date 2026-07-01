import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_SOURCE } from '@/query/get-source';
import toast from 'react-hot-toast';

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
      toast.success('Source added successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    },
  });
};
