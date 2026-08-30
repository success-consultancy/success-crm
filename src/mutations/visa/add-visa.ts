import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadClient } from '../leads/edit-lead';
import { QUERY_KEYS } from '@/constants/query-keys';
import { invalidateServiceQueries } from '@/mutations/invalidate-service-queries';
import { NewVisaServiceType } from '@/schema/visa-service/new-visa.schema';
import toast from 'react-hot-toast';

import { ENTITY, toastMsg } from '@/constants/messages';
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

      return visa;
    },
    // The list page is reached immediately after adding; without this the global
    // 25s staleTime would serve a cached list that is missing the new record.
    onSuccess: () => {
      invalidateServiceQueries(queryClient, 'visa');
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
      invalidateServiceQueries(queryClient, 'visa');
      toast.success(toastMsg.updateSuccess(ENTITY.visa));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.updateError(ENTITY.visa)));
    },
  });
};
