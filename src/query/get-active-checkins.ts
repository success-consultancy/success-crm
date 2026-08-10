import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/constants/query-keys';
import { CheckInResponseType } from '@/types/response-types/check-in-response';

// The legacy CRM polls check-ins every 15s — reception needs a near-live count.
const ACTIVE_POLL_INTERVAL_MS = 15_000;

const getActiveCheckIns = async () => {
  const params = QueryString.stringify({ tab: 'active', page: 1, limit: 50 });
  const res = await api.get(`/checkin?${params}`);
  return res.data as CheckInResponseType;
};

/**
 * Check-ins still in progress (`timerStop IS NULL`), for the header badge.
 * The legacy client fetched every check-in and filtered client-side; the
 * backend supports `tab=active` directly, so we filter server-side instead.
 */
export const useGetActiveCheckIns = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ACTIVE_CHECK_INS],
    queryFn: getActiveCheckIns,
    enabled,
    refetchOnWindowFocus: false,
    refetchInterval: enabled ? ACTIVE_POLL_INTERVAL_MS : false,
  });
};
