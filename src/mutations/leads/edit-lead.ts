import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from '@/hooks/use-toast';
import { LeadSchemaType } from '@/schema/lead-schema';

const editLead = async (
  payload: Omit<LeadSchemaType, 'serviceType'> & {
    serviceType: string;
    id: number;
  },
) => {
  const { hasVisitedStep, id, ...filteredPayload } = payload;
  const res = await api.put(`/lead/${id}`, filteredPayload);
  return res.data;
};

export const useEditLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editLead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LEADS],
      });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: 'Something went wrong',
      });
    },
  });
};
