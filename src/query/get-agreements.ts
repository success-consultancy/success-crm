import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { PAGINATION_PARAMS } from '@/types/pagination';
import { AgreementFilterParams, AgreementsResponseType } from '@/types/response-types/agreement-response';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';

export const AGREEMENT_FILTER_PARAMS: Array<keyof AgreementFilterParams> = [
  ...PAGINATION_PARAMS,
  'order',
  'order_by',
  'q_field',
  'q',
  'tab',
  'from',
  'to',
];

const getAgreements = async (params: AgreementFilterParams) => {
  const res = await api.get('/agreement?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
  return res.data as AgreementsResponseType;
};

export const useGetAgreements = (params: AgreementFilterParams) => {
  return useQuery({
    queryFn: () => getAgreements(params),
    queryKey: [QUERY_KEYS.GET_AGREEMENTS, params],
    refetchOnWindowFocus: false,
  });
};

const getAgreementById = async (id: string) => {
  const res = await api.get(`/agreement/${id}`);
  return res.data;
};

export const useGetAgreementById = (id: string) => {
  return useQuery({
    queryFn: () => getAgreementById(id),
    queryKey: [QUERY_KEYS.GET_AGREEMENT_BY_ID, id],
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
