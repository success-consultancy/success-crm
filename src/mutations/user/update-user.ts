import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_USERS } from '@/query/get-user';
import toast from 'react-hot-toast';

export interface UpdateUserPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: number;
  branchId: string;
  address: string;
  color: string;
  detail?: string | null;
  isActive: boolean;
  onlineAppointment: boolean;
  isPaid: boolean;
  paidAmount?: string | null;
  appointmentNote?: string | null;
  slotTime?: number | null;
  updatedBy: number;
}

const updateUser = async ({ id, ...payload }: UpdateUserPayload) => {
  const res = await api.put(`/user/${id}`, payload);
  return res.data;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_USERS] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
