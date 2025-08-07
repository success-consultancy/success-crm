import { api } from '@/lib/api';
import { IUser } from '@/types/leads/leads-types';
import { useQuery } from '@tanstack/react-query';

export const GET_USERS = 'get-users';

const getUsers = async () => {
  const res = await api.get('/user');
  return res.data as IUser[];
};

export const useGetUsers = () => {
  return useQuery({
    queryFn: getUsers,
    queryKey: [GET_USERS],
    refetchOnWindowFocus: false,
  });
};
