import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { IPagination, PAGINATION_PARAMS } from '@/types/pagination';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';
import { ISkillAssessment, ISkillAssessmentResponseType } from '@/types/response-types/skill-assessment-response';

interface SkillAssessmentFilterParams extends IPagination {
  order?: string;
  order_by?: string;
  q_field?: string;
  q?: string;
  tab?: string;
  from?: string;
  to?: string;
}

export const SKILL_ASSESSMENT_FILTER_PARAMS: Array<keyof SkillAssessmentFilterParams> = [
  ...PAGINATION_PARAMS,
  'order',
  'order_by',
  'q_field',
  'q',
  'tab',
  'from',
  'to',
];

const getSkillAssessments = async (params?: SkillAssessmentFilterParams) => {
  const res = await api.get('/skillAssessment?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
  return res.data as ISkillAssessmentResponseType;
};

export const useGetSkillAssessments = (params?: SkillAssessmentFilterParams) => {
  return useQuery({
    queryFn: () => getSkillAssessments(params),
    queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENTS, params],
    refetchOnWindowFocus: false,
  });
};

const getSkillAssessmentById = async (id: string) => {
  const res = await api.get(`/skillAssessment/${id}`);
  return res.data as ISkillAssessment;
};

export const useGetSkillAssessmentById = (id: string) => {
  return useQuery({
    queryFn: () => getSkillAssessmentById(id),
    queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENT_BY_ID, id],
    refetchOnWindowFocus: false,
  });
};
