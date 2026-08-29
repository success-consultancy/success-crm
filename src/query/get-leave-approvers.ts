import { useMemo } from 'react';
import { useGetUsers } from '@/query/get-user';
import { ROLES } from '@/constants/roles-constants';
import useAuthStore from '@/store/auth-store';

export interface LeaveApprover {
  id: number;
  name: string;
  profileUrl: string | null;
}

/**
 * The managers a user may address a leave request to: active managers of the
 * requester's own branch, excluding the requester. `GET /user` is not branch
 * scoped server-side, so the branch filter is applied here; the API re-validates
 * the same rules on POST /leave.
 *
 * A branch with no manager yields an empty list — the request dialog surfaces
 * that as an explicit empty state rather than an unexplained disabled button.
 */
export const useGetLeaveApprovers = () => {
  const profile = useAuthStore((s) => s.profile);
  const { data: users = [], isLoading, isError } = useGetUsers();

  const approvers = useMemo<LeaveApprover[]>(() => {
    if (!profile?.branchId) return [];
    return users
      .filter(
        (u) =>
          u.roleId === ROLES.MANAGER &&
          u.isActive &&
          u.id !== profile.id &&
          String(u.branchId) === String(profile.branchId),
      )
      .map((u) => ({
        id: u.id,
        name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email,
        profileUrl: u.profileUrl ?? null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users, profile?.id, profile?.branchId]);

  return { approvers, isLoading, isError };
};
