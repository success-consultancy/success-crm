import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { downloadFile } from '@/utils/download';

const exportCheckIns = async (params: Record<string, any>) => {
  const res = await api.get('/checkin/export', { params, responseType: 'blob' });
  return res.data;
};

export const useExportCheckIns = () => {
  return useMutation({
    mutationFn: exportCheckIns,
    onSuccess: (data) => {
      downloadFile(data, 'check-ins.csv');
    },
    onError: () => {
      toast.error('Failed to export check-ins');
    },
  });
};
