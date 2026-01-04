import { api } from '@/lib/api';
import { downloadFile } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const exportTribunalReview = async (queryParams: any) => {
  const res = await api.get('/tribunalReview/export', { params: queryParams });
  downloadFile(res.data, 'tribunalReview.csv', 'text/csv;charset=utf-8;');
  toast.success('Tribunal Review exported successfully!');
};

export interface useExportTribunalReviews {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useExportTribunalReviews = (options: useExportTribunalReviews = {}) => {
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: exportTribunalReview,
    onError,
  });
};
