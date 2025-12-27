import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { IPagination, PAGINATION_PARAMS, SortingState } from '@/types/pagination';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';
import { IVisa, IVisaDetail, IVisaResponseType } from '@/types/response-types/visa-response';

interface VisaFilterParams extends IPagination {
  order?: string;
  order_by?: string;
  q_field?: string;
  q?: string;
  tab?: string;
  from?: string;
  to?: string;
}

export const VISA_FILTER_PARAMS: Array<keyof VisaFilterParams> = [
  ...PAGINATION_PARAMS,
  'order',
  'order_by',
  'q_field',
  'q',
  'tab',
  'from',
  'to',
];

const getTribunalreview = async (params?: VisaFilterParams) => {
  const res = await api.get('/tribunalReview?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
  return res.data as IVisaResponseType;
};

export const useGetTribunalreview = (params?: VisaFilterParams) => {
  return useQuery({
    queryFn: () => getTribunalreview(params),
    queryKey: [QUERY_KEYS.GET_VISAS, params],
    refetchOnWindowFocus: false,
  });
};

const getTribunalreviewById = async (id: string) => {
  const res = await api.get(`/tribunalReview/${id}`);
  return res.data as IVisa;
};

// To prevent type mismatch, new function with separate type return is created
const getTribunalreviewDetailById = async (id: string) => {
  const res = await api.get(`/tribunalReview/${id}`);
  return res.data as IVisaDetail;
};

export const usegetTribunalreviewDetailById = (id: string) => {
  return useQuery({
    queryFn: () => getTribunalreviewDetailById(id),
    queryKey: [QUERY_KEYS.GET_VISA_BY_ID, id],
  });
};

export const usegetTribunalreviewById = (id: string) => {
  return useQuery({
    queryFn: () => getTribunalreviewById(id),
    queryKey: [QUERY_KEYS.GET_VISA_BY_ID, id],
    refetchOnWindowFocus: false,
  });
};

const getTribunalreviewLog = async (id: string) => {
  const res = await api.get(`/tribunalReview/log/${id}`);
  return res.data as IVisa[];
};

export const usegetTribunalreviewLog = (id: string) => {
  return useQuery({
    queryFn: () => getTribunalreviewLog(id),
    queryKey: [QUERY_KEYS.GET_VISA_LOG, id],
    refetchOnWindowFocus: false,
  });
};

const getTribunalreviewFollowUp = async (id: string) => {
  const res = await api.get(`/follow-up/get/${id}`);
  return res.data as IVisa[];
};

export const useGetFollowUp = (id: string) => {
  return useQuery({
    queryFn: () => getTribunalreviewFollowUp(id),
    queryKey: [QUERY_KEYS.GET_FOLLOW_UP, id],
    refetchOnWindowFocus: false,
  });
};

export const GET_TRIBUNALREVIEW = 'get-tribunalreview';
