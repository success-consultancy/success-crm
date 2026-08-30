import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '@/lib/api';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useToastContext } from '@/context/toast-context';
import { LeaveRequestSchemaType } from '@/schema/leave-schema';
import { ENTITY, toastMsg } from '@/constants/messages';

// Backend stores leave dates as DD/MM/YYYY strings (see timesheet-helpers parseLegacyDate).
const toLegacyDate = (d: Date) => format(d, 'dd/MM/yyyy');

const addLeave = async (payload: LeaveRequestSchemaType) => {
  const body = {
    type: payload.type,
    approverId: payload.approverId,
    startDate: toLegacyDate(payload.startDate),
    endDate: toLegacyDate(payload.endDate),
    hoursPerDay: String(payload.hoursPerDay),
    note: payload.note || undefined,
    attachmentURL: payload.attachmentURL || undefined,
  };
  const res = await api.post('/leave', body);
  return res.data;
};

export const useAddLeave = () => {
  const { success, error } = useToastContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_LEAVES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_LEAVES] });
      success(toastMsg.submitSuccess(ENTITY.leaveRequest));
    },
    onError: (err) => {
      error(getApiErrorMessage(err, toastMsg.submitError(ENTITY.leaveRequest)));
    },
  });
};
