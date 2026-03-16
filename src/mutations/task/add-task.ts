import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { TaskSchemaType } from '@/schema/task-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Full payload for creating a task (matches the validated form schema)
const addTask = async (payload: TaskSchemaType) => {
  const res = await api.post('/todo', payload);
  return res.data;
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTask,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TASKS] });
    },
  });
};

// Partial payload for updates — only the fields being changed are required
export type UpdateTaskPayload = { id: number } & Partial<Omit<TaskSchemaType, 'id'>>;

const editTask = async (payload: UpdateTaskPayload) => {
  const { id, ...rest } = payload;
  const res = await api.put(`/todo/${id}`, rest);
  return res.data;
};

export const useEditTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editTask,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TASKS] });
    },
  });
};
