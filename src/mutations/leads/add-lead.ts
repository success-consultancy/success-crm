import { api, getApiErrorMessage } from '@/lib/api';
import { LeadSchemaType } from '@/schema/lead-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateServiceQueries } from '@/mutations/invalidate-service-queries';

const addLead = async (payload: Omit<LeadSchemaType, 'serviceType'> & { serviceType: string }) => {
  const { hasVisitedStep, ...filteredPayload } = payload; // Remove 'hasVisitedStep'
  const res = await api.post('/lead', filteredPayload);
  return res.data;
};

export const useAddLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addLead,
    // The list page is reached immediately after adding; without this the global
    // 25s staleTime would serve a cached list that is missing the new record.
    onSuccess: () => {
      invalidateServiceQueries(queryClient, 'lead');
    },
  });
};
