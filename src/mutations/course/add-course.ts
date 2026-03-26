import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_COURSE } from '@/query/get-course';
import toast from 'react-hot-toast';

export interface AddCoursePayload {
  name: string;
  description?: string;
  universityId?: number;
}

const addCourse = async (payload: AddCoursePayload) => {
  const res = await api.post('/course', payload);
  return res.data;
};

export const useAddCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_COURSE] });
      toast.success('Course added successfully');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
};
