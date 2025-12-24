import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteTribunal = async (id: number) => {
  const res = await api.delete(`/tribunalReview/${id}`);
  return res.data;
};

export const useDeleteTribunal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTribunal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TRIBUNALREVIEW],
      });
    },
    onError: () => {
      toast("Error!", {
        description: "Something went wrong",
      });
    },
  });
};

const deleteTribunalBulk = async (ids: number[]) => {
  const res = await api.delete(`/tribunalReview/bulk-delete`, { data: { ids } });
  return res.data;
};

export const useDeleteTribunalBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTribunalBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TRIBUNALREVIEW],
      });
    },
    onError: () => {
      toast("Error!", {
        description: "Something went wrong",
      });
    },
  });
};
