import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/constants/query-keys';

export interface ClockRecord {
  id: number;
  userId: number;
  date: string;
  clockInTime: string | null;
  clockOutTime: string | null;
  breakStartTime: string | null;
  breakEndTime: string | null;
  totalHours: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const getClockRecords = async (userId: number): Promise<ClockRecord[]> => {
  const res = await api.get(`/user/${userId}/clock`);
  return res.data;
};

export const useGetClockRecords = (userId: number | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CLOCK_RECORDS, userId],
    queryFn: () => getClockRecords(userId as number),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};
