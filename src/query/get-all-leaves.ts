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
 * Leave requests visible to the caller (GET /leave). The API scopes this to the
 * requests addressed to them plus their own history; super admins still get the
 * org-wide list. Callers gate the fetch behind an approver role check via
 * `enabled` so non-approvers never poll it.
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
