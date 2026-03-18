import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { LeadSchemaType } from '@/schema/lead-schema';
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
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === QUERY_KEYS.GET_INSURANCE || query.queryKey[0] === QUERY_KEYS.GET_LEAD_BY_ID,
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
    },
  });
};
