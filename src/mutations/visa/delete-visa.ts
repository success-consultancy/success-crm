import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteVisa = async (id: number) => {
  const res = await api.delete(`/visaApplicant/${id}`);
  return res.data;
};

export const useDeleteVisa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVisa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_VISA],
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
    },
  });
};

const deleteVisaBulk = async (ids: number[]) => {
  const res = await api.delete(`/visaApplicant/bulk-delete`, { data: { ids } });
  return res.data;
};

export const useDeleteVisaBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVisaBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EDUCATIONS],
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
    },
  });
};
