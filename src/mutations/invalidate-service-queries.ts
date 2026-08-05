import type { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';

/**
 * Every query the view page of a service depends on: the list, the detail record
 * and the change log. Mutations invalidate all three so an inline section edit is
 * reflected on the view page without a manual refresh.
 */
const SERVICE_QUERY_KEYS = {
  lead: [QUERY_KEYS.GET_LEADS, QUERY_KEYS.GET_LEAD_BY_ID, QUERY_KEYS.GET_LEAD_LOG],
  visa: [QUERY_KEYS.GET_VISAS, QUERY_KEYS.GET_VISA_BY_ID, QUERY_KEYS.GET_VISA_LOG],
  education: [QUERY_KEYS.GET_EDUCATIONS, QUERY_KEYS.GET_EDUCATION_BY_ID, QUERY_KEYS.GET_EDUCATION_LOG],
  skillAssessment: [
    QUERY_KEYS.GET_SKILL_ASSESSMENTS,
    QUERY_KEYS.GET_SKILL_ASSESSMENT_BY_ID,
    QUERY_KEYS.GET_SKILL_ASSESSMENT_LOG,
  ],
  insurance: [QUERY_KEYS.GET_INSURANCE, QUERY_KEYS.GET_INSURANCE_BY_ID, QUERY_KEYS.GET_INSURANCE_LOG],
  tribunalReview: [
    QUERY_KEYS.GET_TRIBUNAL_REVIEW,
    QUERY_KEYS.GET_TRIBUNAL_REVIEW_BY_ID,
    QUERY_KEYS.GET_TRIBUNAL_LOG,
  ],
} as const;

export type ServiceName = keyof typeof SERVICE_QUERY_KEYS;

export const invalidateServiceQueries = (queryClient: QueryClient, service: ServiceName) => {
  const keys = SERVICE_QUERY_KEYS[service] as readonly string[];
  return queryClient.invalidateQueries({
    predicate: (query) => keys.includes(query.queryKey[0] as string),
  });
};
