import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface University {
  id: number;
  name: string;
  educationLevel: EducationLevel | null;
  trackInReport: boolean | null;
  files: string[] | null;
  location: null | string;
  description: null | string;
  comment: null | string;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export enum EducationLevel {
  Empty = '',
  HigherEducation = 'Higher Education',
  PYProvider = 'PY Provider',
  VETSector = 'VET Sector',
}

export const GET_UNIVERSITY = 'get-university';

const getUniversity = async () => {
  const res = await api.get('/university');
  return res.data as University[];
};

export const useGetUniversity = () => {
  return useQuery({
    queryKey: [GET_UNIVERSITY],
    queryFn: getUniversity,
    refetchOnWindowFocus: false,
  });
};
