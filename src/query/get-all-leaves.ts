import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/constants/query-keys';
import { LeaveRecord } from './get-user-leaves';

// Backend polls at 15 min in the legacy app; keep the same cadence for the header badge.
const PENDING_POLL_INTERVAL_MS = 15 * 60 * 1000;

const getAllLeaves = async (): Promise<LeaveRecord[]> => {
  const res = await api.get('/leave');
  return res.data;
};

/**
 * All users' leave requests (GET /leave). The endpoint is not role-filtered
 * server-side, so callers gate this behind an approver role check via `enabled`.
 */
export const useGetAllLeaves = ({ enabled = true, poll = false }: { enabled?: boolean; poll?: boolean } = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_LEAVES],
    queryFn: getAllLeaves,
    enabled,
    refetchOnWindowFocus: false,
    refetchInterval: poll ? PENDING_POLL_INTERVAL_MS : false,
  });
};
