import { QUERY_KEYS } from '@/constants/query-keys';
import toast from 'react-hot-toast';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ENTITY, countOf, toastMsg } from '@/constants/messages';
const deleteSkillAssessment = async (id: number) => {
  const res = await api.delete(`/skillAssessment/${id}`);
  return res.data;
};

export const useDeleteSkillAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSkillAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENTS],
      });
      toast.success(toastMsg.deleteSuccess(ENTITY.skill));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.skill)));
    },
  });
};

const deleteSkillAssessmentBulk = async (ids: number[]) => {
  const res = await api.delete(`/skillAssessment/bulk-delete`, { data: { ids } });
  return res.data;
};

export const useDeleteSkillAssessmentBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSkillAssessmentBulk,
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENTS],
      });
      toast.success(toastMsg.deleteSuccess(countOf(ids.length, ENTITY.skill, ENTITY.skillApplicants)));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.skill)));
    },
  });
};
