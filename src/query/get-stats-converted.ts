import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface ConvertedStats {
  Education: string;
  Visa: string;
  Skill: string;
  Health: string;
  AAT: string;
}

const getConvertedStats = async (startDate?: string, endDate?: string): Promise<ConvertedStats> => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  const res = await api.get(`/stats/converted-by-date?${params.toString()}`);
  return res.data;
};

export const useGetConvertedStats = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryFn: () => getConvertedStats(startDate, endDate),
    queryKey: [QUERY_KEYS.GET_CONVERTED_STATS, startDate, endDate],
  });
};
