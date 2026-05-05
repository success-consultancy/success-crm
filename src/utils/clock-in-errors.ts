import axios from 'axios';

export const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: unknown } | undefined;
    const status = err.response?.status;

    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message;
    }
    if (status === 403) return 'Session expired. Please log in again.';
    if (status === 404) return 'Service unavailable. Please contact admin.';
    if (status && status >= 500) return 'Server error. Please try again shortly.';
    if (err.code === 'ERR_NETWORK') return 'Network error. Check your connection and try again.';
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
};
