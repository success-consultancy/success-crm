import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadClient } from '../leads/edit-lead';
import { QUERY_KEYS } from '@/constants/query-keys';
import { EducationSchemaType } from '@/schema/education-schema';
import { EducationServiceType } from '@/schema/education-service/new-student.schema';

const addEducation = async (payload: Omit<EducationSchemaType, 'serviceType'>) => {
  const { ...filteredPayload } = payload;
  const res = await api.post('/student', filteredPayload);
  return res.data;
};

const addEducationService = async (payload: Omit<EducationServiceType, 'serviceType'>) => {
  const { ...filteredPayload } = payload;
  const res = await api.post('/student', filteredPayload);
  return res.data;
};

export const useAddEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, leadId }: { payload: EducationSchemaType; leadId?: string }) => {
      // 1. Create Student
      const visa = await addEducation(payload);

      // 2. Update lead client if leadId exists
      if (leadId) {
        const lead = await updateLeadClient(leadId, { studentId: visa.id });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_LEAD_BY_ID],
        });
      }
    },
  });
};

export const useAddEducationService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, leadId }: { payload: EducationServiceType; leadId?: string }) => {
      // 1. Create Student
      const visa = await addEducationService(payload);

      // 2. Update lead client if leadId exists
      if (leadId) {
        const lead = await updateLeadClient(leadId, { studentId: visa.id });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_LEAD_BY_ID],
        });
      }
    },
  });
};
