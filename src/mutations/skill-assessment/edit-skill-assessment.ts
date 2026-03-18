import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { SkillAssessmentSchemaType } from '@/schema/skill-assessment-schema';

const REQUIRED_FIELDS = new Set(['firstName', 'lastName', 'email', 'phone']);

const editSkillAssessment = async (payload: SkillAssessmentSchemaType & { id: number }) => {
  const { id, ...filteredPayload } = payload;
  const normalizedPayload = Object.fromEntries(
    Object.entries(filteredPayload).map(([key, value]) => [
      key,
      value === '' && !REQUIRED_FIELDS.has(key) ? null : value,
    ]),
  );
  const res = await api.put(`/skillAssessment/${id}`, normalizedPayload);
  return res.data;
};

export const useEditSkillAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editSkillAssessment,
    onSuccess: (_, variables) => {
      // Invalidate skill assessments queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENT_BY_ID, variables.id.toString()],
      });
    },
  });
};
