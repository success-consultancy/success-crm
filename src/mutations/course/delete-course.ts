import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_COURSE } from '@/query/get-course';
import toast from 'react-hot-toast';

const deleteCourse = async (id: number) => {
  const res = await api.delete(`/course/${id}`);
  return res.data;
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_COURSE] });
      toast.success('Course deleted successfully');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
};
