import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface ISource {
  id: number;
  name: string;
  description: string;
  updatedBy: null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export const GET_SOURCE = 'get-source';

const getSource = async () => {
  const res = await api.get('/source');
  return res.data as ISource[];
};

export const useGetSource = () => {
  return useQuery({
    queryKey: [GET_SOURCE],
    queryFn: getSource,
    refetchOnWindowFocus: false,
  });
};
