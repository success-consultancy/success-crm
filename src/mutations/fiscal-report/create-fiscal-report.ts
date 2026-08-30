import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import toast from 'react-hot-toast';

import { ENTITY, toastMsg } from '@/constants/messages';
interface CreateFiscalReportPayload {
  year: string;
  name: string;
  type: string;
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
      toast.success(toastMsg.addSuccess(ENTITY.fiscalReport));
    },
    onError: (error: any) => {
      toast.error(toastMsg.addError(ENTITY.fiscalReport));
    },
  });
};
