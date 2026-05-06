import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface CheckInStats {
  totalCheckIns: number;
  totalWaiting: number;
  totalCompleted: number;
  averageWaitTime: number;
}

const getCheckInStats = async () => {
  const res = await api.get('/checkin/stats');
  return res.data as CheckInStats;
};

export const useGetCheckInStats = () => {
  return useQuery({
    queryFn: getCheckInStats,
    queryKey: [QUERY_KEYS.GET_CHECK_IN_STATS],
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
  });
};
