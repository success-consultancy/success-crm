import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GET_ME } from '@/query/get-me';
import { useToastContext } from '@/context/toast-context';

interface GenerateClockInCodeResponse {
  id: number;
  clockInCode: string;
}

const generateClockInCode = async (userId: number) => {
  const res = await api.get(`/user/${userId}/generateCode`);
  return res.data as GenerateClockInCodeResponse;
};

export const useGenerateClockInCode = () => {
  const { success, error } = useToastContext();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: generateClockInCode,
    onSuccess: () => {
      success('New clock-in code generated.');
      qc.invalidateQueries({ queryKey: [GET_ME] });
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || 'Failed to generate code.');
    },
  });
};
