import { QUERY_KEYS } from '@/constants/query-keys';
import toast from 'react-hot-toast';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ENTITY, countOf, toastMsg } from '@/constants/messages';
const deleteLead = async (id: number) => {
  const res = await api.delete(`/lead/${id}`);
  return res.data;
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LEADS],
      });
      toast.success(toastMsg.deleteSuccess(ENTITY.lead));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.lead)));
    },
  });
};

const deleteLeadBulk = async (ids: number[]) => {
  const res = await api.delete(`/lead/bulk-delete`, { data: { ids } });
  return res.data;
};

export const useDeleteLeadBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLeadBulk,
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LEADS],
      });
      toast.success(toastMsg.deleteSuccess(countOf(ids.length, ENTITY.lead, ENTITY.leads)));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.lead)));
    },
  });
};
