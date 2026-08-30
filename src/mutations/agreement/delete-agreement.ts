import { QUERY_KEYS } from '@/constants/query-keys';
import toast from 'react-hot-toast';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ENTITY, toastMsg } from '@/constants/messages';
const deleteAgreement = async (id: number) => {
  const res = await api.delete(`/agreement/${id}`);
  return res.data;
};

export const useDeleteAgreement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAgreement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_AGREEMENTS],
      });
      toast.success(toastMsg.deleteSuccess(ENTITY.agreement));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.agreement)));
    },
  });
};

const deleteAgreementBulk = async (ids: number[]) => {
  const res = await api.delete(`/agreement/bulk-delete`, { data: { ids } });
  return res.data;
};

export const useDeleteAgreementBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAgreementBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_AGREEMENTS],
      });
      toast.success(toastMsg.deleteSuccess(ENTITY.agreements));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.agreement)));
    },
  });
};
