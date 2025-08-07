import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { PasswordChangeSchemaType } from '@/schema/profile-schema';
import { useToastContext } from '@/context/toast-context';

const changePassword = async (payload: PasswordChangeSchemaType) => {
  const url = '/user/me/change-password';

  const res = await api.patch(url, {
    password: payload.newPassword,
  });
  return res.data;
};

export const useChangePassword = () => {
  const { success, error } = useToastContext();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      success('Password changed successfully!');
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Failed to change password!';
        error(message);
      } else {
        error('An unexpected error occurred while changing password!');
      }
    },
  });
};
