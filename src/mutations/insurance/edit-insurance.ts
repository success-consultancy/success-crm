import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateServiceQueries } from '@/mutations/invalidate-service-queries';
import { toast } from 'sonner';
import { InsuranceSchemaType } from '@/schema/insurance';

// Required fields that should keep empty strings as-is
const REQUIRED_FIELDS = new Set(['firstName', 'lastName', 'email', 'phone']);

const editInsurance = async (payload: Omit<InsuranceSchemaType, 'serviceType'>) => {
  const { id, ...filteredPayload } = payload;
  // Convert empty strings to null for optional fields to avoid spurious change logs
  const normalizedPayload = Object.fromEntries(
    Object.entries(filteredPayload).map(([key, value]) => [
      key,
      value === '' && !REQUIRED_FIELDS.has(key) ? null : value,
    ]),
  );
  const res = await api.put(`/insuranceApplicant/${id}`, normalizedPayload);
  return res.data;
};

export const useEditInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editInsurance,
    onSuccess: () => {
      invalidateServiceQueries(queryClient, 'insurance');
    },
    onError: (error: any) => {
      toast('Error!', {
        description: getApiErrorMessage(error),
      });
    },
  });
};
