import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { SkillAssessmentSchemaType } from '@/schema/skill-assessment-schema';

const editSkillAssessment = async (payload: Omit<SkillAssessmentSchemaType, 'serviceType'> & { id: number }) => {
  const { id, ...filteredPayload } = payload;
  const res = await api.put(`/skillAssessment/${id}`, filteredPayload);
  return res.data;
};

export const useEditSkillAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, id }: { payload: SkillAssessmentSchemaType; id: number }) => {
      const skillAssessment = await editSkillAssessment({ ...payload, id });

      // Invalidate skill assessments queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENT_BY_ID, id.toString()],
      });

      return skillAssessment;
    },
  });
};
