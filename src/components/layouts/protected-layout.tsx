'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import PageLoader from '../molecules/page-loader';
import AdminSidebar from '../templates/admin-sidebar';
import AdminHeader from '../templates/admin-header';

import { useGetMe } from '@/query/get-me';
import { ROUTES } from '@/config/routes';

type Props = {
  children?: React.ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetMe();

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

  return (
    // <div className="flex w-screen h-screen overflow-hidden">
    <div className="flex">
      <AdminSidebar />

      <div className="flex flex-col grow overflow-hidden">
        <div className="w-full bg-white px-6 flex items-center justify-between sticky top-0 z-10">
          <AdminHeader />
        </div>

        <div className="ml-64 grow bg-blue-extra-light overflow-y-auto flex flex-col">{children}</div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
