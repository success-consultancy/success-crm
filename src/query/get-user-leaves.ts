import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/constants/query-keys';

export interface LeaveRecord {
  id: number;
  userId: number;
  type: string;
  startDate: string; // DD/MM/YYYY in legacy backend
  endDate: string;
  hoursPerDay: string | number;
  status: 'pending' | 'approved' | 'rejected' | string;
  note?: string | null;
  managerNote?: string | null;
  attachmentURL?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const getUserLeaves = async (userId: number): Promise<LeaveRecord[]> => {
  const res = await api.get(`/leave/user/${userId}`);
  return res.data;
};

export const useGetUserLeaves = (userId: number | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_LEAVES, userId],
    queryFn: () => getUserLeaves(userId as number),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};
