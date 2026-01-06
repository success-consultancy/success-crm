import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { IPagination, PAGINATION_PARAMS } from '@/types/pagination';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';
import { IVisa, IVisaDetail, IVisaResponseType } from '@/types/response-types/visa-response';
import { ITribunalReview } from '@/types/response-types/common';
import { TribunalReviewSchemaType } from '@/schema/tribunal-review';

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

const getTribunalReviews = async (params?: VisaFilterParams) => {
  const res = await api.get('/tribunalReview?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
  return res.data as IVisaResponseType;
};

export const useGetTribunalReviews = (params?: VisaFilterParams) => {
  return useQuery({
    queryFn: () => getTribunalReviews(params),
    queryKey: [QUERY_KEYS.GET_TRIBUNAL_REVIEW, params],
    refetchOnWindowFocus: false,
  });
};

const getTribunalReviewById = async (id: string) => {
  const res = await api.get(`/tribunalReview/${id}`);
  return res.data as TribunalReviewSchemaType;
};

export const useGetTribunalReviewById = (id: string) => {
  return useQuery({
    queryFn: () => getTribunalReviewById(id),
    queryKey: [QUERY_KEYS.GET_TRIBUNAL_REVIEW, id],
    refetchOnWindowFocus: false,
  });
};

const getTribunalReviewLog = async (id: string) => {
  const res = await api.get(`/tribunalReview/log/${id}`);
  return res.data as IVisa[];
};

export const useGetTribunalReviewLog = (id: string) => {
  return useQuery({
    queryFn: () => getTribunalReviewLog(id),
    queryKey: [QUERY_KEYS.GET_VISA_LOG, id],
    refetchOnWindowFocus: false,
  });
};

const getTribunalReviewFollowUp = async (id: string) => {
  const res = await api.get(`/follow-up/get/${id}`);
  return res.data as IVisa[];
};

export const useGetFollowUp = (id: string) => {
  return useQuery({
    queryFn: () => getTribunalReviewFollowUp(id),
    queryKey: [QUERY_KEYS.GET_FOLLOW_UP, id],
    refetchOnWindowFocus: false,
  });
};
