import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_UNIVERSITY, GET_UNIVERSITY_BY_ID } from '@/query/get-university';
import { GET_COURSE } from '@/query/get-course';
import { UniversitySchemaType } from '@/schema/university-schema';

const editUniversity = async ({ id, ...payload }: Omit<UniversitySchemaType, 'courses'> & { id: number }) => {
  const res = await api.put(`/university/${id}`, payload);
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

export const useEditUniversity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      newCourses,
      ...universityPayload
    }: Omit<UniversitySchemaType, 'courses'> & { id: number; newCourses?: string[] }) => {
      const university = await editUniversity(universityPayload);
      if (newCourses && newCourses.length > 0) {
        await addBulkCourses(universityPayload.id, newCourses);
      }
      return university;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_UNIVERSITY] });
      queryClient.invalidateQueries({ queryKey: [GET_UNIVERSITY_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [GET_COURSE] });
    },
  });
};
