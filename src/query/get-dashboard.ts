import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface DashboardCounts {
  uniqueClientCount: number;
  users: number;
  leads: number;
  students: number;
  visaApplicants: number;
  skillAssessments: number;
  insuranceApplicants: number;
  tribunalReview: number;
}

export type DashboardChangePct = Record<keyof DashboardCounts, number | null>;

const getDashboard = async (): Promise<{ counts: DashboardCounts; changePct: DashboardChangePct }> => {
  const res = await api.get('/auth/dashboard');
  return res.data;
};

export const useGetDashboard = () => {
  return useQuery({
    queryFn: getDashboard,
    queryKey: [QUERY_KEYS.GET_DASHBOARD],
    refetchOnWindowFocus: false,
  });
};
