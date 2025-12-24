import { api } from '@/lib/api';
import { downloadFile } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const exportStudent = async (queryParams: any) => {
  const res = await api.get('/student/export', { params: queryParams });
  downloadFile(res.data, 'student.csv', 'text/csv;charset=utf-8;');
  toast.success('Students exported successfully!');
};

export interface UseExportStudentsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useExportStudents = (options: UseExportStudentsOptions = {}) => {
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: exportStudent,
    onError,
  });
};
