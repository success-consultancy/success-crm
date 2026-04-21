import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';

const refreshFiscalReport = async (id: number) => {
  const res = await api.post(`/fiscalReport/${id}/refresh`);
  return res.data;
};

export const useRefreshFiscalReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: refreshFiscalReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FISCAL_REPORT] });
    },
    onError: () => {
      toast('Error!', { description: 'Failed to refresh report data.' });
    },
  });
};
