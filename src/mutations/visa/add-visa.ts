import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadClient } from '../leads/edit-lead';
import { QUERY_KEYS } from '@/constants/query-keys';
import { NewVisaServiceType } from '@/schema/visa-service/new-visa.schema';
import { toast } from 'sonner';

const addVisaService = async (payload: NewVisaServiceType) => {
  const { ...filteredPayload } = payload;
  const res = await api.post('/visaApplicant', filteredPayload);
  return res.data;
};

export const useAddVisaService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, leadId }: { payload: NewVisaServiceType; leadId?: string }) => {
      // 1. Create Visa Applicant
      const visa = await addVisaService(payload);

      // 2. Update lead client if leadId exists
      if (leadId) {
        const lead = await updateLeadClient(leadId, { visaApplicantId: visa.id });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_LEAD_BY_ID],
        });
      }

      // Invalidate visa list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_VISAS],
      });

      return visa;
    },
  });
};

type IPayloadStatus = {
  id: string;
  status: string;
};

const updateServiceStatus = async ({ id, status }: IPayloadStatus) => {
  const res = await api.patch(`/visaApplicant/${id}/status`, { status });
};

export const useUpdateVisaStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateServiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === QUERY_KEYS.GET_VISA_BY_ID
      });
      toast("Success!", {
        description: "Tribunal review has been updated",
      })
    },
    onError: () => {
      toast("Error!", {
        description: "Something went wrong",
      })
    },
  });
};
