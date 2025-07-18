import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const GET_ME = 'get-me';

const getUsers = async () => {
  const res = await api.get('/user/me');
  return res.data as MeResponse;
};

export const useGetMe = () => {
  return useQuery({
    queryFn: getUsers,
    queryKey: [GET_ME],
    refetchOnWindowFocus: false,
    retry: 1
  });
};

interface MeResponse {
  success: boolean;
  timestamp: string;
  data: MeUser;
}

export interface MeUser {
  id: number;
  profileUrl: null;
  firstName: string;
  lastName: string;
  detail: null;
  clockInCode: null;
  email: string;
  phone: string;
  address: string;
  roleId: number;
  isActive: boolean;
  onlineAppointment: boolean;
  isPaid: boolean;
  paidAmount: null;
  appointmentNote: null;
  slotTime: null;
  dashboardManagement: boolean;
  agencyAgreementManagement: boolean;
  userManagement: boolean;
  universityManagement: boolean;
  courseManagement: boolean;
  sourceManagement: boolean;
  settingManagement: boolean;
  updatedBy: number;
  hideColumn: HideColumn;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

interface HideColumn {}
