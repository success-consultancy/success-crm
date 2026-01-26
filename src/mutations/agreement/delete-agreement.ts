import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
      toast('Success!', {
        description: 'Agreement has been deleted',
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
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
      toast('Success!', {
        description: 'Agreements have been deleted',
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
    },
  });
};
