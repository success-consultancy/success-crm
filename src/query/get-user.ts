import { api } from '@/lib/api';
import { IUser } from '@/types/leads/leads-types';
import { IPagination, PAGINATION_PARAMS } from '@/types/pagination';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';

export const GET_USERS = 'get-users';
interface UserFilterParams extends IPagination {
  order?: string;
  order_by?: string;
  q_field?: string;
  q?: string;
  tab?: string;
  from?: string;
  to?: string;
}

export const LEADS_FILTER_PARAMS: Array<keyof UserFilterParams> = [
  ...PAGINATION_PARAMS,
  'order',
  'order_by',
  'q_field',
  'q',
  'tab',
  'from',
  'to',
];

const getUsers = async (params: UserFilterParams) => {
  const res = await api.get('/user', {
    params,
    paramsSerializer: (params) => QueryString.stringify(params, { arrayFormat: 'brackets' }),
  });
  return res.data as IUser[];
};

export const useGetUsers = (params?: UserFilterParams) => {
  return useQuery({
    queryFn: () => getUsers(params!),
    queryKey: [GET_USERS, params],
    refetchOnWindowFocus: false,
  });
};
const getUserById = async (id: string) => {
  const res = await api.get(`/user/${id}`);
  return res.data as IUser;
};

export const useGetUserById = (id?: string) => {
  return useQuery({
    queryFn: () => getUserById(id!),
    queryKey: [GET_USERS, id],
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};
