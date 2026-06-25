'use client';

import React from 'react';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import useAuthStore from '@/store/auth-store';
import AdminDashboard from './_components/admin/admin-dashboard';
import UserDashboard from './_components/user/user-dashboard';

const ADMIN_ROLES = [1, 2];

const DashboardPage = () => {
  const profile = useAuthStore((s) => s.profile);
  const isAdmin = profile?.roleId ? ADMIN_ROLES.includes(profile.roleId) : false;

  return (
    <Container>
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Dashboard</h3>
      </Portal>

      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </Container>
  );
};

export default DashboardPage;
