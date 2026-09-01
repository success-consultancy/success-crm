import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface CountryData {
  country: string;
  total: number;
}

export interface ClientCountryResponse {
  lead: CountryData[];
  student: CountryData[];
  visa: CountryData[];
  skill: CountryData[];
  insurance: CountryData[];
}

export interface InsightData {
  initial: { id: number; status: string; statusData: string };
  final: { id: number; status: string; statusData: string };
  dayDiff: number;
}

export interface InsightResponse {
  insights: InsightData[];
  average: string;
  min: number;
  max: number;
}

export interface VisaInsightResponse {
  nomination: InsightResponse;
  visa: InsightResponse;
}

export interface ProcessingInsights {
  education: InsightResponse;
  visa: VisaInsightResponse;
  skill: InsightResponse;
}

export interface CustomerFlowMonth {
  month: string;
  Lead: number;
  Education: number;
  Visa: number;
  Skill: number;
  Tribunal: number;
  Insurance: number;
}

const getClientCountry = async (): Promise<ClientCountryResponse> => {
  const res = await api.get('/analytics/clientCountry');
  return res.data;
};

const getCustomerFlow = async (): Promise<CustomerFlowMonth[]> => {
  const res = await api.get('/analytics/customerFlow');
  return res.data;
};

const getProcessingInsights = async (): Promise<ProcessingInsights> => {
  const [student, visa, skill] = await Promise.all([
    api.get('/analytics/studentInsight'),
    api.get('/analytics/visaInsight'),
    api.get('/analytics/skillInsight'),
  ]);
  return {
    education: student.data,
    visa: visa.data,
    skill: skill.data,
  };
};

export const useGetClientCountry = () => {
  return useQuery({
    queryFn: getClientCountry,
    queryKey: [QUERY_KEYS.GET_CLIENT_COUNTRY],
  });
};

export const useGetProcessingInsights = () => {
  return useQuery({
    queryFn: getProcessingInsights,
    queryKey: [QUERY_KEYS.GET_PROCESSING_INSIGHTS],
  });
};

export const useGetCustomerFlow = () => {
  return useQuery({
    queryFn: getCustomerFlow,
    queryKey: [QUERY_KEYS.GET_CUSTOMER_FLOW],
  });
};
