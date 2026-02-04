import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { api } from '@/lib/api';
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
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INSURANCE],
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
    },
  });
};
