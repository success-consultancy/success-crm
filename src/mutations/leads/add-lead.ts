import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { LeadSchemaType } from '@/schemas/lead-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const addLead = async (payload: Omit<LeadSchemaType, 'serviceType'> & { serviceType: string }) => {
  const { hasVisitedStep, ...filteredPayload } = payload; // Remove 'hasVisitedStep'
  const res = await api.post('/lead', filteredPayload);
  return res.data;
};

export const useAddLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addLead,
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Lead added successfully',
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LEADS],
      });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: 'Something went wrong',
      });
    }
  });
};
