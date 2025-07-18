import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { PasswordChangeSchemaType } from '@/schemas/profile-schema';

const changePassword = async (payload: PasswordChangeSchemaType) => {
  const url = '/user/me/change-password';

  const res = await api.patch(url, {
    password: payload.newPassword,
  });
  return res.data;
};

export const useChangePassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast({
        title: 'Password changed successfully!',
      });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast({
          title: 'Failed to change password!',
          description: err.response?.data.message || 'Invalid credentials.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Failed to change password!',
          description: 'Something went wrong.',
          variant: 'destructive',
        });
      }
    },
  });
};
