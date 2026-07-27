'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Portal from '@/components/atoms/portal';
import SectionLoader from '@/components/molecules/section-loader';
import { PortalIds } from '@/config/portal';
import { useGetRoles } from '@/query/get-roles';
import useAuthStore from '@/store/auth-store';
import RolePermissionsCard from './_components/role-permissions-card';

export default function RolesPage() {
  const router = useRouter();
  const { data: roles, isLoading } = useGetRoles();
  const profile = useAuthStore((s) => s.profile);
  const isAdmin = profile?.roleId === 1;

  useEffect(() => {
    if (profile && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [profile, isAdmin, router]);

  if (isLoading || !isAdmin) return <SectionLoader />;

  return (
    <div className="p-4 pt-2">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">Manage roles</h3>
      </Portal>

      {roles && <RolePermissionsCard roles={roles} readonly={false} />}
    </div>
  );
}
