import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '@/lib/api';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useToastContext } from '@/context/toast-context';
import { LeaveRecord } from '@/query/get-user-leaves';
import { ENTITY, toastMsg } from '@/constants/messages';

export type LeaveDecision = 'approved' | 'rejected';

interface UpdateLeavePayload {
  id: number;
  status: LeaveDecision;
  managerNote?: string;
}

// `updatedBy` is stamped from the JWT by the backend's updatePayload middleware —
// do not send it from the client.
const updateLeave = async ({ id, status, managerNote }: UpdateLeavePayload): Promise<LeaveRecord> => {
  const res = await api.put(`/leave/${id}`, { status, managerNote: managerNote || undefined });
  return res.data;
};

export const useUpdateLeave = () => {
  const { success, error } = useToastContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLeave,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_LEAVES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_LEAVES] });
      success(variables.status === 'approved' ? 'Leave request approved' : 'Leave request rejected');
    },
    onError: (err) => {
      error(getApiErrorMessage(err, toastMsg.updateError(ENTITY.leaveRequest)));
    },
  });
};
