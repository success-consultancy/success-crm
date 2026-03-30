import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { IPagination, PAGINATION_PARAMS } from '@/types/pagination';
import { CheckInResponseType } from '@/types/response-types/check-in-response';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';

interface CheckInsFilterParams extends IPagination {
  q?: string;
  q_field?: string;
  tab?: string;
}

export const CHECK_INS_FILTER_PARAMS: Array<keyof CheckInsFilterParams> = [
  ...PAGINATION_PARAMS,
  'q',
  'q_field',
  'tab',
];

const getCheckIns = async (params: CheckInsFilterParams) => {
  const res = await api.get('/checkin?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
  return res.data as CheckInResponseType;
};

export const useGetCheckIns = (params: CheckInsFilterParams) => {
  return useQuery({
    queryFn: () => getCheckIns(params),
    queryKey: [QUERY_KEYS.GET_CHECK_INS, params],
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
  });
};
