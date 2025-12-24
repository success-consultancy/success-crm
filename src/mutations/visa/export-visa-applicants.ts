import { api } from '@/lib/api';
import { downloadFile } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const exportVisaApplicant = async (queryParams: any) => {
  const res = await api.get('/visaApplicant/export', { params: queryParams });
  downloadFile(res.data, 'visaApplicant.csv', 'text/csv;charset=utf-8;');
  toast.success('VisaApplicants exported successfully!');
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
