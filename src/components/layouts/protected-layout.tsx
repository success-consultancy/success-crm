'use client';

import React, { Suspense } from 'react';
import PageLoader from '../molecules/page-loader';
import AdminSidebar from '../templates/admin-sidebar';
import AdminHeader from '../templates/admin-header';

type Props = {
  children?: React.ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
  const isLoggedIn = true;
  const isLoading = false;
  const showSidebar = true;

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {showSidebar && <AdminSidebar />}

      <div className="flex flex-col grow overflow-hidden">
        {/* Sticky Header */}
        <div className="w-full border-b border-b-border-normal bg-white py-3 px-6 flex items-center justify-between sticky top-0 z-10">
          <AdminHeader />
        </div>

        {/* Main Scrollable Content Area */}
        <div className="ml-64 grow bg-bg-blueExtraLight overflow-y-auto flex flex-col">
          <Suspense fallback={<PageLoader />}>{children}</Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
