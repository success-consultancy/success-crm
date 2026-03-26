import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_COURSE } from '@/query/get-course';
import toast from 'react-hot-toast';

export interface EditCoursePayload {
  id: number;
  name: string;
  description?: string;
  universityId?: number;
}

const editCourse = async ({ id, ...payload }: EditCoursePayload) => {
  const res = await api.put(`/course/${id}`, payload);
  return res.data;
};

export const useEditCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_COURSE] });
      toast.success('Course updated successfully');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
};
