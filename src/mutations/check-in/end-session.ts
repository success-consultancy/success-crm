import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const endCheckInSession = async (id: number) => {
  const res = await api.put(`/checkin/${id}`);
  return res.data;
};

export const useEndCheckInSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: endCheckInSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CHECK_INS] });
      toast.success('Session ended successfully');
    },
    onError: () => {
      toast.error('Failed to end session');
    },
  });
};
