import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_UNIVERSITY } from '@/query/get-university';
import { UniversitySchemaType } from '@/schema/university-schema';

const addUniversity = async (payload: Omit<UniversitySchemaType, 'courses'>) => {
  const res = await api.post('/university', payload);
  return res.data;
};

const addBulkCourses = async (universityId: number, courses: string[]) => {
  if (!courses.length) return;
  const payload = {
    universityId,
    courses: courses.map((name) => ({ name })),
  };
  const res = await api.post('/course/bulk', payload);
  return res.data;
};

export const useAddUniversity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, courses }: { payload: Omit<UniversitySchemaType, 'courses'>; courses?: string[] }) => {
      const university = await addUniversity(payload);
      if (courses && courses.length > 0) {
        await addBulkCourses(university.id, courses);
      }
      return university;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_UNIVERSITY] });
    },
  });
};
