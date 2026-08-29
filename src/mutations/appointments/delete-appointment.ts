import { QUERY_KEYS } from '@/constants/query-keys';
import { useToastContext } from '@/context/toast-context';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteAppointment = async (id: number) => {
  const res = await api.delete(`/appointment/${id}`);
  return res.data;
};

export const useDeleteAppointment = () => {
  const { success, error: errorToast, loading } = useToastContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAppointment,
    onMutate: () => ({ toastId: loading('Deleting appointment...') }),
    onSuccess: (_data, _variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_APPOINTMENTS],
      });
      success('Appointment has been deleted.', { id: context?.toastId });
    },
    onError: (err, _variables, context) => {
      errorToast(getApiErrorMessage(err, 'Failed to delete appointment'), { id: context?.toastId });
    },
  });
};
