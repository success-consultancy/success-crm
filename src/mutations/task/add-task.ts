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
  const body: Record<string, unknown> = { ...rest };
  // Axios drops `undefined`, so the backend would never see the field and the
  // service skips updates when the key is missing. Send explicit `null` for
  // clearable fields so "clear date/time" actually persists.
  if ('dueDate' in rest && rest.dueDate === undefined) body.dueDate = null;
  if ('dueTime' in rest && rest.dueTime === undefined) body.dueTime = null;
  const res = await api.put(`/todo/${id}`, body);
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
