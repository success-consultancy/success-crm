import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteAppointment = async (id: number) => {
  const res = await api.delete(`/appointment/${id}`);
  return res.data;
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_APPOINTMENTS],
      });
      toast('Success!', {
        description: 'Appointment has been deleted',
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
    },
  });
};
