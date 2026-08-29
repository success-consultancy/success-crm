import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { FiscalReportRow } from '@/types/response-types/fiscal-report-response';
import { useToastContext } from '@/context/toast-context';

interface UpdateFiscalReportPayload {
  id: number;
  data: FiscalReportRow[];
}

const updateFiscalReport = async ({ id, data }: UpdateFiscalReportPayload) => {
  const res = await api.put(`/fiscalReport/${id}`, { data });
  return res.data;
};

export const useUpdateFiscalReport = () => {
  const { success, error: errorToast, loading } = useToastContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFiscalReport,
    // Keep one toast per save: the pending toast is upgraded in place to success/error.
    onMutate: () => ({ toastId: loading('Saving targets...') }),
    onSuccess: async (_data, _variables, context) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FISCAL_REPORT] });
      success('Targets have been updated.', { id: context?.toastId });
    },
    onError: (err: any, _variables, context) => {
      errorToast(getApiErrorMessage(err, 'Failed to update targets'), { id: context?.toastId });
    },
  });
};
