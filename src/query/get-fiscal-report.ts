import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { FiscalReport } from '@/types/response-types/fiscal-report-response';
import { useQuery } from '@tanstack/react-query';

interface FiscalReportParams {
  type: string;
}

const getFiscalReport = async (params: FiscalReportParams): Promise<FiscalReport[]> => {
  const res = await api.get('/fiscalReport', { params });
  return (res.data as FiscalReport[]) ?? [];
};

export const useGetFiscalReport = (params: FiscalReportParams) => {
  return useQuery({
    queryFn: () => getFiscalReport(params),
    queryKey: [QUERY_KEYS.GET_FISCAL_REPORT, params],
    refetchOnWindowFocus: false,
  });
};
