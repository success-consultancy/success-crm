import { QUERY_KEYS } from '@/constants/query-keys';
import toast from 'react-hot-toast';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ENTITY, countOf, toastMsg } from '@/constants/messages';
const deleteInsurance = async (id: number) => {
  const res = await api.delete(`/insuranceApplicant/${id}`);
  return res.data;
};

export const useDeleteInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInsurance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INSURANCE],
      });
      toast.success(toastMsg.deleteSuccess(ENTITY.insurance));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.insurance)));
    },
  });
};

const deleteInsuranceApplicantBulk = async (ids: number[]) => {
  const res = await api.delete(`/insuranceApplicant/bulk-delete`, { data: { ids } });
  return res.data;
};

export const useDeleteInsuranceBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInsuranceApplicantBulk,
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INSURANCE],
      });
      toast.success(toastMsg.deleteSuccess(countOf(ids.length, ENTITY.insurance, ENTITY.insuranceApplicants)));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.insurance)));
    },
  });
};
