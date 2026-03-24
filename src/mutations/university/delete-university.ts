import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_UNIVERSITY } from '@/query/get-university';
import { toast } from 'sonner';

const deleteUniversity = async (id: number) => {
  const res = await api.delete(`/university/${id}`);
  return res.data;
};

export const useDeleteUniversity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUniversity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_UNIVERSITY] });
      toast('Success!', { description: 'University has been deleted' });
    },
    onError: () => {
      toast('Error!', { description: 'Something went wrong' });
    },
  });
};
