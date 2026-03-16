import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteTask = async (id: number) => {
  const res = await api.delete(`/todo/${id}`);
  return res.data;
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TASKS] });
    },
  });
};
