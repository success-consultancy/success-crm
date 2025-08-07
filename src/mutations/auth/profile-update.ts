import { api } from '@/lib/api';
import { ProfileSchemaType } from '@/schema/profile-schema';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GET_ME } from '@/query/get-me';
import { useToastContext } from '@/context/toast-context';

export const updateUserProfile = async (payload: ProfileSchemaType) => {
  const url = `/user/${payload.id}`;

  const { id, role, detail, ...cleanPayload } = payload;

  const res = await api.put(url, cleanPayload);
  return res.data;
};

export const useUserUpdate = () => {
  const { success, error } = useToastContext();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      success('User updated successfully!');
      qc.invalidateQueries({ queryKey: [GET_ME] });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Failed to update user!';
        error(message);
      } else {
        error('An unexpected error occurred while updating user!');
      }
    },
  });
};
