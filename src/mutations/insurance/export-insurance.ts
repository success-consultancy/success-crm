import { api, getApiErrorMessage } from '@/lib/api';
import { downloadFile } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

const exportInsurance = async (queryParams: any) => {
  const res = await api.get('/insuranceApplicant/export', { params: queryParams });
  downloadFile(res.data, 'insuranceApplicant.csv', 'text/csv;charset=utf-8;');
  toast.success(toastMsg.exportSuccess(ENTITY.insuranceApplicants));
};

export interface useExportInsurance {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useExportInsurance = (options: useExportInsurance = {}) => {
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: exportInsurance,
    onError,
  });
};
