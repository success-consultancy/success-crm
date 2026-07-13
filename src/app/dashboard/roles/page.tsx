'use client';

import Portal from '@/components/atoms/portal';
import SectionLoader from '@/components/molecules/section-loader';
import { PortalIds } from '@/config/portal';
import { useGetRoles } from '@/query/get-roles';
import useAuthStore from '@/store/auth-store';
import RolePermissionsCard from './_components/role-permissions-card';

export default function RolesPage() {
  const { data: roles, isLoading } = useGetRoles();
  const profile = useAuthStore((s) => s.profile);
  const isAdmin = profile?.roleId === 1;

  if (isLoading) return <SectionLoader />;

  return (
    <div className="p-4 pt-2">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">Manage roles</h3>
      </Portal>

      {roles && <RolePermissionsCard roles={roles} readonly={!isAdmin} />}
    </div>
  );
}
