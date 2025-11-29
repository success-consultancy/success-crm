'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import PageLoader from '../molecules/page-loader';
import AdminSidebar from '../templates/admin-sidebar';
import AdminHeader from '../templates/admin-header';

import { useGetMe } from '@/query/get-me';
import { ROUTES } from '@/config/routes';
import { useSidebarStore } from '@/store/sidebar-store';
import { ScrollArea } from '../ui/scroll-area';

type Props = {
  children?: React.ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetMe();
  const { isCollapsed } = useSidebarStore();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, isError, user, router]);

  if (isLoading || (!user && !isError)) {
    return <PageLoader />;
  }

  if (isError || !user) {
    return null;
  }

  // Dynamic margin-left based on sidebar collapsed state
  const contentMargin = isCollapsed ? 'ml-6' : 'ml-64';

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex flex-col grow overflow-hidden min-h-screen">
        <div className="w-full bg-white h-[66px] flex items-center justify-between sticky top-0 z-10">
          <AdminHeader />
        </div>

        <div
          className={`${contentMargin} grow bg-blue-extra-light overflow-y-auto flex flex-col transition-all duration-300`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
