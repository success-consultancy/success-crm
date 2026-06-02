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
    <div className="p-6 space-y-6 max-w-6xl">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">Role Permissions</h3>
      </Portal>

      <p className="text-sm text-gray-500">
        Define what each role can do across every service. Changes apply immediately to all users with that role.
        {!isAdmin && ' Only admins can make changes.'}
      </p>

      <div className="space-y-5">
        {roles?.map((role) => (
          <RolePermissionsCard key={role.id} role={role} readonly={!isAdmin} />
        ))}
      </div>
    </div>
  );
}
