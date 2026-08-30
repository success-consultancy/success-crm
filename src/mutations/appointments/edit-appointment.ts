import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { UpdateAppointmentSchemaType } from '@/schema/appointment-schema';
import { useToastContext } from '@/context/toast-context';
import { getAppointmentErrorMessage } from './appointment-error-message';
import { ENTITY, toastMsg } from '@/constants/messages';

// Helper function to format date with timezone
const formatDateWithTimezone = (dateTimeString: string): string => {
  // If already has timezone info, return as is
  if (dateTimeString.includes('+') || dateTimeString.includes('Z') || dateTimeString.includes('-', 10)) {
    return dateTimeString;
  }

  // Otherwise, create a Date object and format it with timezone
  const date = new Date(dateTimeString);
  const timezoneOffset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
  const offsetMinutes = Math.abs(timezoneOffset) % 60;
  const offsetSign = timezoneOffset >= 0 ? '+' : '-';
  const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

  // Format: YYYY-MM-DDTHH:mm:ss+HH:mm
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetString}`;
};

// Helper function to get timezone name (fallback to browser timezone)
const getTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
};

const editAppointment = async (payload: UpdateAppointmentSchemaType) => {
  const { id, date, startTime, endTime, clientId, ownerId, ...rest } = payload;

  // Format dates with timezone
  const start = formatDateWithTimezone(startTime);
  const end = formatDateWithTimezone(endTime);

  // Transform payload to match API format
  const apiPayload = {
    ...rest,
    start,
    end,
    leadId: clientId || undefined,
    userId: ownerId,
    allDay: false, // Default to false, can be made configurable later
    timezone: getTimezone(), // Use browser timezone
  };

  const res = await api.put(`/appointment/${id}`, apiPayload);
  return res.data;
};

interface EditAppointmentToastOptions {
  /**
   * Set to false when the caller shows its own toast for the update
   * (e.g. the calendar's drag-to-reschedule, which reports the new time).
   */
  showToast?: boolean;
}

export const useEditAppointment = ({ showToast = true }: EditAppointmentToastOptions = {}) => {
  const { success, error: errorToast, loading } = useToastContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editAppointment,
    onMutate: () => ({ toastId: showToast ? loading(toastMsg.updateLoading(ENTITY.appointment)) : undefined }),
    onSuccess: async (_data, variables, context) => {
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === QUERY_KEYS.GET_APPOINTMENTS || query.queryKey[0] === QUERY_KEYS.GET_APPOINTMENT_BY_ID,
      });
      if (!showToast) return;
      success(toastMsg.updateSuccess(ENTITY.appointment), { id: context?.toastId });
    },
    onError: (err: any, _variables, context) => {
      if (!showToast) return;
      errorToast(getAppointmentErrorMessage(err, toastMsg.updateError(ENTITY.appointment)), { id: context?.toastId });
    },
  });
};
