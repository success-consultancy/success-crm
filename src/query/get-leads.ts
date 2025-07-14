import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { IPagination, PAGINATION_PARAMS, SortingState } from '@/types/pagination';
import { LeadsResponseType } from '@/types/response-types/leads-response';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';

interface LeadsFilterParams extends IPagination {
  order?: string;
  order_by?: string;
  q_field?: string;
  q?: string;
}

export const LEADS_FILTER_PARAMS: Array<keyof LeadsFilterParams> = [
  ...PAGINATION_PARAMS,
  'order',
  'order_by',
  'q_field',
  'q',
];

const getLeads = async (params: LeadsFilterParams) => {
  const res = await api.get('/lead?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
  return res.data as LeadsResponseType;
};

export const useGetLeads = (params: LeadsFilterParams) => {
  return useQuery({
    queryFn: () => getLeads(params),
    queryKey: [QUERY_KEYS.GET_LEADS, params],
    refetchOnWindowFocus: false,
  });
};
