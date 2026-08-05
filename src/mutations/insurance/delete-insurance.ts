import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
      toast('Success!', {
        description: 'Insurance applicant has been deleted',
      });
    },
    onError: (error: any) => {
      toast('Error!', {
        description: getApiErrorMessage(error),
      });
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
      toast('Success!', {
        description: `${ids.length} insurance applicant${ids.length > 1 ? 's have' : ' has'} been deleted`,
      });
    },
    onError: (error: any) => {
      toast('Error!', {
        description: getApiErrorMessage(error),
      });
    },
  });
};
