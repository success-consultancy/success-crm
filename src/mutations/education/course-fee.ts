import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { CreateCourseFeePayload } from '@/schema/education-schema';
import { toast } from 'sonner';

export const createCourseFee = async (payload: CreateCourseFeePayload) => {
  const { data } = await api.post('/course-fee', payload);
  return data;
};

export const useAddCourseFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourseFee,
    onSuccess: () => {
      // refresh education details (contains feeplan)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_EDUCATION_BY_ID] });
    },
  });
};

export const updateCourseFee = async (id: number, payload: CreateCourseFeePayload) => {
  const { data } = await api.put(`/course-fee/${id}`, payload);
  return data;
};

export const useUpdateCourseFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateCourseFeePayload }) => updateCourseFee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_EDUCATION_BY_ID] });
    },
  });
};

const deleteCourseFee = async (id: number) => {
  const res = await api.delete(`/course-fee/${id}`);
  return res.data;
};

export const useDeleteCourseFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourseFee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EDUCATION_BY_ID],
      });
    },
    onError: () => {
      toast('Error!', {
        description: 'Something went wrong',
      });
    },
  });
};
