import useAuthStore from '@/store/auth-store';
import { useGetRoles, type CrudActions, type ServiceKey } from '@/query/get-roles';

const NO_ACCESS: CrudActions = { create: false, read: false, update: false, delete: false };

export function usePermissions(service: ServiceKey): CrudActions {
  const roleId = useAuthStore((s) => s.profile?.roleId);
  const { data: roles } = useGetRoles();
  return roles?.find((r) => r.id === roleId)?.permissions?.[service] ?? NO_ACCESS;
}
