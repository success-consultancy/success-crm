import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';

interface CreateFiscalReportPayload {
  year: string;
  name: string;
}

const createFiscalReport = async (payload: CreateFiscalReportPayload) => {
  const res = await api.post('/fiscalReport', payload);
  return res.data;
};

export const useCreateFiscalReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFiscalReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FISCAL_REPORT] });
      toast('Success!', { description: 'Report created.' });
    },
    onError: () => {
      toast('Error!', { description: 'Something went wrong.' });
    },
  });
};
