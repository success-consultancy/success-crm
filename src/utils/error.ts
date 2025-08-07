import axios from 'axios';

export interface IError {
  success: boolean;
  message: string;
}

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const err = error.response?.data as IError;
    if (err && err.message) {
      return err.message || 'Something went wrong.';
    }
  }
  return 'Something went wrong.';
};
