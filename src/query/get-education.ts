import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { IPagination, PAGINATION_PARAMS, SortingState } from '@/types/pagination';
import { EducationsResponseType, IEducation } from '@/types/response-types/education-response';
import { ILead } from '@/types/response-types/leads-response';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';
import { number } from 'zod';

interface EducationFilterParams extends IPagination {
  order?: string;
  order_by?: string;
  q_field?: string;
  q?: string;
  tab?: string;
  from?: string;
  to?: string;
}

export const EDUCATION_FILTER_PARAMS: Array<keyof EducationFilterParams> = [
  ...PAGINATION_PARAMS,
  'order',
  'order_by',
  'q_field',
  'q',
  'tab',
  'from',
  'to',
];

const getEducation = async (params: EducationFilterParams) => {
  const res = await api.get('/student?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
  return res.data as EducationsResponseType;
};

export const useGetEducation = (params: EducationFilterParams) => {
  return useQuery({
    queryFn: () => getEducation(params),
    queryKey: [QUERY_KEYS.GET_EDUCATIONS, params],
    refetchOnWindowFocus: false,
  });
};

const getEducationById = async (id: string) => {
  const res = await api.get(`/student/${id}`);
  return res.data as IEducation;
};

export const useGetEducationById = (id: string) => {
  return useQuery({
    queryFn: () => getEducationById(id),
    queryKey: [QUERY_KEYS.GET_EDUCATION_BY_ID, id],
    refetchOnWindowFocus: false,
  });
};

const getEducationLog = async (id: string) => {
  const res = await api.get(`/student/log/${id}`);
  return res.data as IEducation[];
};

export const useGetEducationLog = (id: string) => {
  return useQuery({
    queryFn: () => getEducationLog(id),
    queryKey: [QUERY_KEYS.GET_EDUCATION_LOG, id],
    refetchOnWindowFocus: false,
  });
};

const getEducationFollowUp = async (id: string) => {
  const res = await api.get(`/follow-up/get/${id}`);
  return res.data as ILead[];
};

export const useGetFollowUp = (id: string) => {
  return useQuery({
    queryFn: () => getEducationFollowUp(id),
    queryKey: [QUERY_KEYS.GET_FOLLOW_UP, id],
    refetchOnWindowFocus: false,
  });
};
