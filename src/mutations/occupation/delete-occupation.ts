import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_OCCUPATIONS } from '@/query/get-occupations';
import toast from 'react-hot-toast';

const deleteOccupation = async (id: number) => {
  const res = await api.delete(`/occupation/${id}`);
  return res.data;
};

export const useDeleteOccupation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOccupation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_OCCUPATIONS] });
      toast.success('Occupation deleted successfully');
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
