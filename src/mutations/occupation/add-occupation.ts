import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_OCCUPATIONS } from '@/query/get-occupations';
import toast from 'react-hot-toast';

export interface AddOccupationPayload {
  code: number;
  title: string;
}

const addOccupation = async (payload: AddOccupationPayload) => {
  const res = await api.post('/occupation', payload);
  return res.data;
};

export const useAddOccupation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addOccupation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_OCCUPATIONS] });
      toast.success('Occupation added successfully');
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
