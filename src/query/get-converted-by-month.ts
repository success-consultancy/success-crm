import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface ConvertedByMonth {
  month: string;
  Education: number;
  Visa: number;
  Skill: number;
  AAT: number;
  Health: number;
}

const getConvertedByMonth = async (startDate?: string, endDate?: string): Promise<ConvertedByMonth[]> => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  const res = await api.get(`/stats/converted-by-month?${params.toString()}`);
  return res.data;
};

export const useGetConvertedByMonth = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryFn: () => getConvertedByMonth(startDate, endDate),
    queryKey: [QUERY_KEYS.GET_CONVERTED_BY_MONTH, startDate, endDate],
  });
};
