import { getApiErrorMessage } from '@/lib/api';

// Appointment endpoints return errors in a few shapes: a plain `message`/`error`
// string, or a field-keyed `errors` map for validation failures. Flatten whichever
// one came back into a single line we can put in a toast.
export const getAppointmentErrorMessage = (error: any, fallback: string): string => {
  const errors = error?.response?.data?.errors;
  if (errors) {
    const flattened = Object.values(errors).flat().filter(Boolean).join(', ');
    if (flattened) return flattened;
  }
  return (
    error?.response?.data?.message || error?.response?.data?.error || getApiErrorMessage(error, fallback)
  );
};
