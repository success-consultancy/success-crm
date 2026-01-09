import { api } from '@/lib/api';
import { downloadFile } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const exportSkillAssessment = async (queryParams: any) => {
  const res = await api.get('/skillAssessment/export', { params: queryParams });
  downloadFile(res.data, 'skillAssessment.csv', 'text/csv;charset=utf-8;');
  toast.success('Skill Assessments exported successfully!');
};

export interface UseExportSkillAssessmentsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useExportSkillAssessments = (options: UseExportSkillAssessmentsOptions = {}) => {
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: exportSkillAssessment,
    onSuccess,
    onError,
  });
};
