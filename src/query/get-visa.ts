import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface IVisa {
  id: number;
  visaType: string;
  updatedBy: null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export const GET_VISA = 'get-visa';

const getVisa = async () => {
  const res = await api.get('/visa');
  return res.data as IVisa[];
};

export const useGetVisa = () => {
  return useQuery({
    queryKey: [GET_VISA],
    queryFn: getVisa,
    refetchOnWindowFocus: false,
  });
};
