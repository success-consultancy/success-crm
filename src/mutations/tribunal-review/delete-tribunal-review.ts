import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { api, getApiErrorMessage } from '@/lib/api';
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
        queryKey: [QUERY_KEYS.GET_TRIBUNAL_REVIEW],
      });
      toast('Success!', {
        description: 'Tribunal review has been deleted',
      });
    },
    onError: (error: any) => {
      toast("Error!", {
        description: getApiErrorMessage(error),
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
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TRIBUNAL_REVIEW],
      });
      toast('Success!', {
        description: `${ids.length} tribunal review${ids.length > 1 ? 's have' : ' has'} been deleted`,
      });
    },
    onError: (error: any) => {
      toast("Error!", {
        description: getApiErrorMessage(error),
      });
    },
  });
};
