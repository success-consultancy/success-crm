import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { FiscalReportRow } from '@/types/response-types/fiscal-report-response';
import { toast } from 'sonner';

interface UpdateFiscalReportPayload {
  id: number;
  data: FiscalReportRow[];
}

const updateFiscalReport = async ({ id, data }: UpdateFiscalReportPayload) => {
  const res = await api.put(`/fiscalReport/${id}`, { data });
  return res.data;
};

export const useUpdateFiscalReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFiscalReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FISCAL_REPORT] });
      toast('Success!', { description: 'Report targets have been updated.' });
    },
    onError: () => {
      toast('Error!', { description: 'Something went wrong.' });
    },
  });
};
