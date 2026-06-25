import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface ServiceTimePeriodStat {
  count: number;
  year: number;
  month: number;
  week: number;
  quarter: number;
  half_year: number;
}

export interface ServiceStats {
  education: ServiceTimePeriodStat[];
  visa: ServiceTimePeriodStat[];
  skill: ServiceTimePeriodStat[];
  insurance: ServiceTimePeriodStat[];
}

const getServiceStats = async (): Promise<ServiceStats> => {
  const [education, visa, skill, insurance] = await Promise.all([
    api.get('/stats/education'),
    api.get('/stats/visa-applicant'),
    api.get('/stats/skill-assesment'),
    api.get('/stats/health-insurance'),
  ]);
  return {
    education: education.data,
    visa: visa.data,
    skill: skill.data,
    insurance: insurance.data,
  };
};

export const useGetServiceStats = () => {
  return useQuery({
    queryFn: getServiceStats,
    queryKey: [QUERY_KEYS.GET_SERVICE_STATS],
  });
};
