import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENTS],
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
    },
  });
};
