import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface Course {
  id: number;
  name: string;
  description: null | string;
  universityId: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export const GET_COURSE = 'get-course';

const getCourse = async (universityId?: number) => {
  const params = universityId ? { universityId } : {};
  const res = await api.get('/course', { params });
  return res.data as Course[];
};

export const useGetCourse = (universityId?: number) => {
  return useQuery({
    queryKey: [GET_COURSE, universityId],
    queryFn: () => getCourse(universityId),
    refetchOnWindowFocus: false,
    enabled: !!universityId,
  });
};

export const useGetAllCourses = () => {
  return useQuery({
    queryKey: [GET_COURSE, 'all'],
    queryFn: () => getCourse(),
    refetchOnWindowFocus: false,
  });
};
