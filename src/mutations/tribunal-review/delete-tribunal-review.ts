import { QUERY_KEYS } from '@/constants/query-keys';
import toast from 'react-hot-toast';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ENTITY, countOf, toastMsg } from '@/constants/messages';
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
      toast.success(toastMsg.deleteSuccess(ENTITY.tribunalReview));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.tribunalReview)));
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
      toast.success(toastMsg.deleteSuccess(countOf(ids.length, ENTITY.tribunalReview, ENTITY.tribunalApplicants)));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.tribunalReview)));
    },
  });
};
