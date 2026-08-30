import { QUERY_KEYS } from '@/constants/query-keys';
import toast from 'react-hot-toast';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ENTITY, countOf, toastMsg } from '@/constants/messages';
const deleteEducation = async (id: number) => {
  const res = await api.delete(`/student/${id}`);
  return res.data;
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EDUCATIONS],
      });
      toast.success(toastMsg.deleteSuccess(ENTITY.education));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.education)));
    },
  });
};

const deleteEducationBulk = async (ids: number[]) => {
  const res = await api.delete(`/student/bulk-delete`, { data: { ids } });
  return res.data;
};

export const useDeleteEducationBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEducationBulk,
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EDUCATIONS],
      });
      toast.success(toastMsg.deleteSuccess(countOf(ids.length, ENTITY.education, ENTITY.educationApplicants)));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.education)));
    },
  });
};
