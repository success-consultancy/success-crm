import { api, getApiErrorMessage } from '@/lib/api';
import { downloadFile } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

const exportAgreements = async (queryParams: any) => {
  const res = await api.get('/agreement/export', { params: queryParams });
  downloadFile(res.data, 'agreements.csv', 'text/csv;charset=utf-8;');
  toast.success(toastMsg.exportSuccess(ENTITY.agreements));
};

export interface UseExportAgreementsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useExportAgreements = (options: UseExportAgreementsOptions = {}) => {
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: exportAgreements,
    onSuccess,
    onError,
  });
};
