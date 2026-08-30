import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_COURSE } from '@/query/get-course';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

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
      toast.success(toastMsg.deleteSuccess(ENTITY.course));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.course)));
    },
  });
};
