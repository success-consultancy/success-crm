import { api, getApiErrorMessage } from '@/lib/api';
import { downloadFile } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

const exportVisaApplicant = async (queryParams: any) => {
  const res = await api.get('/visaApplicant/export', { params: queryParams });
  downloadFile(res.data, 'visaApplicant.csv', 'text/csv;charset=utf-8;');
  toast.success(toastMsg.exportSuccess(ENTITY.visaApplicants));
};

export interface UseExportVisaApplicantsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useExportVisaApplicants = (options: UseExportVisaApplicantsOptions = {}) => {
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: exportVisaApplicant,
    onError,
  });
};
