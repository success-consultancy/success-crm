import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { IPagination, PAGINATION_PARAMS, SortingState } from '@/types/pagination';
import { ILead, LeadsResponseType } from '@/types/response-types/leads-response';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';
import { number } from 'zod';

interface LeadsFilterParams extends IPagination {
  order?: string;
  order_by?: string;
  q_field?: string;
  q?: string;
  tab?: string;
  from?: string;
  to?: string;
}

export const LEADS_FILTER_PARAMS: Array<keyof LeadsFilterParams> = [
  ...PAGINATION_PARAMS,
  'order',
  'order_by',
  'q_field',
  'q',
  'tab',
  'from',
  'to',
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

const getLeadById = async (id: string) => {
  const res = await api.get(`/lead/${id}`);
  return res.data as ILead;
};

export const useGetLeadById = (id: string) => {
  return useQuery({
    queryFn: () => getLeadById(id),
    queryKey: [QUERY_KEYS.GET_LEAD_BY_ID, id],
    refetchOnWindowFocus: false,
  });
};

const getLeadLog = async (id: string) => {
  const res = await api.get(`/lead/log/${id}`);
  return res.data as ILead[];
};

export const useGetLeadLog = (id: string) => {
  return useQuery({
    queryFn: () => getLeadLog(id),
    queryKey: [QUERY_KEYS.GET_LEAD_LOG, id],
    refetchOnWindowFocus: false,
  });
};

const getLeadFollowUp = async (id: string) => {
  const res = await api.get(`/follow-up/get/${id}`);
  return res.data as ILead[];
};

export const useGetFollowUp = (id: string) => {
  return useQuery({
    queryFn: () => getLeadFollowUp(id),
    queryKey: [QUERY_KEYS.GET_FOLLOW_UP, id],
    refetchOnWindowFocus: false,
  });
};
