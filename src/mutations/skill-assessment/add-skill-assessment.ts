import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadClient } from '../leads/edit-lead';
import { QUERY_KEYS } from '@/constants/query-keys';
import { invalidateServiceQueries } from '@/mutations/invalidate-service-queries';
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

      return skillAssessment;
    },
    // The list page is reached immediately after adding; without this the global
    // 25s staleTime would serve a cached list that is missing the new record.
    onSuccess: () => {
      invalidateServiceQueries(queryClient, 'skillAssessment');
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
      invalidateServiceQueries(queryClient, 'skillAssessment');
      toast("Success!", {
        description: "Skill assessment has been updated",
      })
    },
    onError: (error: any) => {
      toast("Error!", {
        description: getApiErrorMessage(error),
      })
    },
  });
};
