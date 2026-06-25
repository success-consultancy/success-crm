import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface LeadStats {
  Education: {
    totalCount: number;
    convertedCount: number;
    notConvertedCount: number;
    inProgressCount: number;
  };
  Insurance: {
    totalCount: number;
    convertedCount: number;
    notConvertedCount: number;
    inProgressCount: number;
  };
  'Skill Assessment': {
    totalCount: number;
    convertedCount: number;
    notConvertedCount: number;
    inProgressCount: number;
  };
  Visa: {
    totalCount: number;
    convertedCount: number;
    notConvertedCount: number;
    inProgressCount: number;
  };
  total: {
    totalCount: number;
    convertedCount: number;
    notConvertedCount: number;
    inProgressCount: number;
  };
}

const getLeadStats = async (): Promise<LeadStats> => {
  const res = await api.get('/stats/lead');
  return res.data;
};

export const useGetLeadStats = () => {
  return useQuery({
    queryFn: getLeadStats,
    queryKey: [QUERY_KEYS.GET_LEAD_STATS],
  });
};
