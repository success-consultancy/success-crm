import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { AppointmentSchemaType } from '@/schema/appointment-schema';
import { toast } from 'sonner';

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

const addAppointment = async (payload: AppointmentSchemaType) => {
  // Transform payload to match API format
  const { date, startTime, endTime, clientId, ownerId, ...rest } = payload;
  
  // Format dates with timezone
  const start = formatDateWithTimezone(startTime);
  const end = formatDateWithTimezone(endTime);
  
  const apiPayload = {
    ...rest,
    start,
    end,
    leadId: clientId || undefined,
    userId: ownerId,
    allDay: false, // Default to false, can be made configurable later
    timezone: getTimezone(), // Use browser timezone
  };
  
  const res = await api.post('/appointment', apiPayload);
  return res.data;
};

export const useAddAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_APPOINTMENTS],
      });
      toast('Success!', {
        description: 'Appointment has been created',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.response?.data?.error || 'Something went wrong';
      const errors = error?.response?.data?.errors;
      
      if (errors) {
        // Show validation errors if available
        const errorMessages = Object.values(errors).flat().join(', ');
        toast('Error!', {
          description: errorMessages || message,
        });
      } else {
        toast('Error!', {
          description: message,
        });
      }
    },
  });
};
