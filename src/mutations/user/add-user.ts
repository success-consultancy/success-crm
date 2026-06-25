import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_USERS } from '@/query/get-user';

export interface AddUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
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
}

const addUser = async (payload: AddUserPayload) => {
  const res = await api.post('/user', payload);
  return res.data;
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_USERS] });
    },
  });
};
