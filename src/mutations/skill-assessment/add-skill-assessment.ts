import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadClient } from '../leads/edit-lead';
import { QUERY_KEYS } from '@/constants/query-keys';
import { SkillAssessmentSchemaType } from '@/schema/skill-assessment-schema';

const addSkillAssessment = async (payload: Omit<SkillAssessmentSchemaType, 'serviceType'>) => {
  const { ...filteredPayload } = payload;
  const res = await api.post('/skillAssessment', filteredPayload);
  return res.data;
};

export const useAddSkillAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, leadId }: { payload: SkillAssessmentSchemaType; leadId?: string }) => {
      // 1. Create Skill Assessment
      const visa = await addSkillAssessment(payload);

      // 2. Update lead client if leadId exists
      if (leadId) {
        const lead = await updateLeadClient(leadId, { skillAssessmentId: visa.id });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_LEAD_BY_ID],
        });
      }
    },
  });
};
