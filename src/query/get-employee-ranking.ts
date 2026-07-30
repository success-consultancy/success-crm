import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface EmployeeRanking {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileUrl: string | null;
  clientCount: number;
  convertedCount: number;
  services: {
    student: number;
    visa: number;
    skill: number;
    tribunal: number;
    insurance: number;
  };
}

const getEmployeeRanking = async (startDate?: string, endDate?: string): Promise<EmployeeRanking[]> => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  const res = await api.get(`/user/employee-ranking?${params.toString()}`);
  return res.data;
};

export const useGetEmployeeRanking = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryFn: () => getEmployeeRanking(startDate, endDate),
    queryKey: [QUERY_KEYS.GET_EMPLOYEE_RANKING, startDate, endDate],
  });
};
