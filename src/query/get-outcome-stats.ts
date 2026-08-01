import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface OutcomeSegment {
  label: string;
  value: number;
}

const buildParams = (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  return params.toString();
};

const getVisaOutcomes = async (startDate?: string, endDate?: string): Promise<OutcomeSegment[]> => {
  const res = await api.get(`/stats/visa-outcomes?${buildParams(startDate, endDate)}`);
  return res.data;
};

export const useGetVisaOutcomes = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryFn: () => getVisaOutcomes(startDate, endDate),
    queryKey: [QUERY_KEYS.GET_VISA_OUTCOMES, startDate, endDate],
  });
};

const getStudentOutcomes = async (startDate?: string, endDate?: string): Promise<OutcomeSegment[]> => {
  const res = await api.get(`/stats/student-outcomes?${buildParams(startDate, endDate)}`);
  return res.data;
};

export const useGetStudentOutcomes = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryFn: () => getStudentOutcomes(startDate, endDate),
    queryKey: [QUERY_KEYS.GET_STUDENT_OUTCOMES, startDate, endDate],
  });
};
