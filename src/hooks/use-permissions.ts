import useAuthStore from '@/store/auth-store';
import { useGetRoles, type CrudActions, type ServiceKey } from '@/query/get-roles';

const NO_ACCESS: CrudActions = { create: false, read: false, update: false, delete: false };
const FULL_ACCESS: CrudActions = { create: true, read: true, update: true, delete: true };
const SUPER_ADMIN_ID = 1;

export function usePermissions(service: ServiceKey): CrudActions {
  const roleId = useAuthStore((s) => s.profile?.roleId);
  const { data: roles } = useGetRoles();
  if (roleId === SUPER_ADMIN_ID) return FULL_ACCESS;
  return roles?.find((r) => r.id === roleId)?.permissions?.[service] ?? NO_ACCESS;
}
