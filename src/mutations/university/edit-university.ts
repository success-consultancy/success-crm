import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_UNIVERSITY, GET_UNIVERSITY_BY_ID } from '@/query/get-university';
import { UniversitySchemaType } from '@/schema/university-schema';

const editUniversity = async ({ id, ...payload }: Omit<UniversitySchemaType, 'courses'> & { id: number }) => {
  const res = await api.put(`/university/${id}`, payload);
  return res.data;
};

export const useEditUniversity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editUniversity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_UNIVERSITY] });
      queryClient.invalidateQueries({ queryKey: [GET_UNIVERSITY_BY_ID] });
    },
  });
};
