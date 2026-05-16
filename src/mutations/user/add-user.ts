import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_USERS } from '@/query/get-user';
import toast from 'react-hot-toast';

export interface AddUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
  address: string;
  color: string;
  detail?: string | null;
  isActive: boolean;
  onlineAppointment: boolean;
  isPaid: boolean;
  paidAmount?: string | null;
  appointmentNote?: string | null;
  slotTime?: number | null;
  dashboardManagement: boolean;
  agencyAgreementManagement: boolean;
  userManagement: boolean;
  universityManagement: boolean;
  courseManagement: boolean;
  sourceManagement: boolean;
  settingManagement: boolean;
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
      toast.success('User added successfully');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
};
