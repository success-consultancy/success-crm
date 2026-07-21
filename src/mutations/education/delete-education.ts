import { QUERY_KEYS } from '@/constants/query-keys';
import {toast} from 'sonner';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
    },
    onError: (error: any) => {
      toast("Error!", {
        description: getApiErrorMessage(error),
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EDUCATIONS],
      });
    },
    onError: (error: any) => {
      toast("Error!", {
        description: getApiErrorMessage(error),
      });
    },
  });
};
