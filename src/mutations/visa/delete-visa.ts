import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { api, getApiErrorMessage } from '@/lib/api';
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
        queryKey: [QUERY_KEYS.GET_VISAS],
      });
      toast('Success!', {
        description: 'Visa applicant has been deleted',
      });
    },
    onError: (error: any) => {
      toast('Error!', {
        description: getApiErrorMessage(error),
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
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_VISAS],
      });
      toast('Success!', {
        description: `${ids.length} visa applicant${ids.length > 1 ? 's have' : ' has'} been deleted`,
      });
    },
    onError: (error: any) => {
      toast('Error!', {
        description: getApiErrorMessage(error),
      });
    },
  });
};
