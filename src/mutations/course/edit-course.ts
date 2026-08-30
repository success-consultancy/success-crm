import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_COURSE } from '@/query/get-course';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

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
      toast.success(toastMsg.updateSuccess(ENTITY.course));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.updateError(ENTITY.course)));
    },
  });
};
