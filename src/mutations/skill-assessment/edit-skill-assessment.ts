import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateServiceQueries } from '@/mutations/invalidate-service-queries';
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
    onSuccess: () => {
      invalidateServiceQueries(queryClient, 'skillAssessment');
    },
  });
};
