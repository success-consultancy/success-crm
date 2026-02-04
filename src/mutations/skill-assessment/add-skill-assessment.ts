import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadClient } from '../leads/edit-lead';
import { QUERY_KEYS } from '@/constants/query-keys';
import { SkillAssessmentSchemaType } from '@/schema/skill-assessment-schema';
import { toast } from 'sonner';

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
      const skillAssessment = await addSkillAssessment(payload);

      // 2. Update lead client if leadId exists
      if (leadId) {
        const lead = await updateLeadClient(leadId, { skillAssessmentId: skillAssessment.id });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_LEAD_BY_ID],
        });
      }

      // 3. Invalidate skill assessments query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENTS],
      });

      return skillAssessment;
    },
  });
};


type IPayloadStatus = {
  id: string;
  status: string;
};

const updateServiceStatus = async ({ id, status }: IPayloadStatus) => {
  const res = await api.patch(`/skillAssessment/${id}/status`, { status });
};

export const useUpdateSkillStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateServiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === QUERY_KEYS.GET_SKILL_ASSESSMENTS
          || query.queryKey[0] === QUERY_KEYS.GET_SKILL_ASSESSMENT_BY_ID,
      });
      toast("Success!", {
        description: "Skill assessment has been updated",
      })
    },
    onError: () => {
      toast("Error!", {
        description: "Something went wrong",
      })
    },
  });
};
