import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { IPagination, PAGINATION_PARAMS } from '@/types/pagination';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';
import { IVisa, IVisaResponseType } from '@/types/response-types/visa-response';
import { ITribunalReview, ITribunalReviewResponseType } from '@/types/response-types/tribunal-review-response';
import { IInsurance, IInsuranceResponseType } from '@/types/response-types/insurance-response';

interface FilterParams extends IPagination {
  order?: string;
  order_by?: string;
  q_field?: string;
  q?: string;
  tab?: string;
  from?: string;
  to?: string;
}

export const VISA_FILTER_PARAMS: Array<keyof FilterParams> = [
  ...PAGINATION_PARAMS,
  'order',
  'order_by',
  'q_field',
  'q',
  'tab',
  'from',
  'to',
];

const getInsurance = async (params?: FilterParams) => {
  const res = await api.get('/insuranceApplicant?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
  return res.data as IInsuranceResponseType;
};

export const useGetInsurance = (params?: FilterParams) => {
  return useQuery({
    queryFn: () => getInsurance(params),
    queryKey: [QUERY_KEYS.GET_INSURANCE, params],
    refetchOnWindowFocus: false,
  });
};

const getInsuranceById = async (id: string) => {
  const res = await api.get(`/insuranceApplicant/${id}`);
  return res.data as IInsurance;
};

export const useGetInsuranceById = (id: string) => {
  return useQuery({
    queryFn: () => getInsuranceById(id),
    queryKey: [QUERY_KEYS.GET_INSURANCE_BY_ID, id],
    refetchOnWindowFocus: false,
  });
};

const getInsuranceLog = async (id: string) => {
  const res = await api.get(`/insuranceApplicant/log/${id}`);
  return res.data as IVisa[];
};

export const useGetTribunalReviewLog = (id: string) => {
  return useQuery({
    queryFn: () => getInsuranceLog(id),
    queryKey: [QUERY_KEYS.GET_INSURANCE_LOG, id],
    refetchOnWindowFocus: false,
  });
};

const getInsuranceFollowUp = async (id: string) => {
  const res = await api.get(`/follow-up/get/${id}`);
  return res.data as IVisa[];
};

export const useGetFollowUp = (id: string) => {
  return useQuery({
    queryFn: () => getInsuranceFollowUp(id),
    queryKey: [QUERY_KEYS.GET_FOLLOW_UP, id],
    refetchOnWindowFocus: false,
  });
};
