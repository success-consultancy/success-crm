import { QUERY_KEYS } from '@/constants/query-keys';
import toast from 'react-hot-toast';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ENTITY, countOf, toastMsg } from '@/constants/messages';
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
      toast.success(toastMsg.deleteSuccess(ENTITY.visa));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.visa)));
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
      toast.success(toastMsg.deleteSuccess(countOf(ids.length, ENTITY.visa, ENTITY.visaApplicants)));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.visa)));
    },
  });
};
