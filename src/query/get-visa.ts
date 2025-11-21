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

const getVisa = async (params: VisaFilterParams) => {
  const res = await api.get('/visaApplicant?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
  return res.data as IVisaResponseType;
};

export const useGetVisa = (params: VisaFilterParams) => {
  return useQuery({
    queryFn: () => getVisa(params),
    queryKey: [QUERY_KEYS.GET_VISA, params],
    refetchOnWindowFocus: false,
  });
};

const getVisaById = async (id: string) => {
  const res = await api.get(`/visaApplicant/${id}`);
  return res.data as IVisa;
};

// To prevent type mismatch, new function with separate type return is created
const getVisaDetailById = async (id: string) => {
  const res = await api.get(`/visaApplicant/${id}`);
  return res.data as IVisaDetail;
};

export const useGetVisaDetailById = (id: string) => {
  return useQuery({
    queryFn: () => getVisaDetailById(id),
    queryKey: [QUERY_KEYS.GET_VISA_BY_ID, id],
  });
};

export const useGetVisaById = (id: string) => {
  return useQuery({
    queryFn: () => getVisaById(id),
    queryKey: [QUERY_KEYS.GET_VISA_BY_ID, id],
    refetchOnWindowFocus: false,
  });
};

const getVisaLog = async (id: string) => {
  const res = await api.get(`/visaApplicant/log/${id}`);
  return res.data as IVisa[];
};

export const useGetVisaLog = (id: string) => {
  return useQuery({
    queryFn: () => getVisaLog(id),
    queryKey: [QUERY_KEYS.GET_VISA_LOG, id],
    refetchOnWindowFocus: false,
  });
};

const getVisaFollowUp = async (id: string) => {
  const res = await api.get(`/follow-up/get/${id}`);
  return res.data as IVisa[];
};

export const useGetFollowUp = (id: string) => {
  return useQuery({
    queryFn: () => getVisaFollowUp(id),
    queryKey: [QUERY_KEYS.GET_FOLLOW_UP, id],
    refetchOnWindowFocus: false,
  });
};
