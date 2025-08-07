import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { TaskSchemaType } from '@/schema/task-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const addTask = async (payload: TaskSchemaType) => {
  const res = await api.post('/todo', payload);
  return res.data;
};

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTask,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TASKS],
      });
    },
  });
};

const editTask = async (payload: TaskSchemaType) => {
  const { id, ...rest } = payload;

  const res = await api.put(`/todo/${id}`, rest);
  return res.data;
};

export const useEditTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTask,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TASKS],
      });
    },
  });
};
