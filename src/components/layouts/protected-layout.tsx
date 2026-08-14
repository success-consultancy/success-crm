'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import PageLoader from '../molecules/page-loader';
import AdminSidebar from '../templates/admin-sidebar';
import AdminHeader from '../templates/admin-header';

import { useGetMe } from '@/query/get-me';
import { ROUTES } from '@/config/routes';
import { useSidebarStore } from '@/store/sidebar-store';
import { getAccessToken } from '@/utils/auth-token';

type Props = {
  children?: React.ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetMe();
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, isError, user, router]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !getAccessToken()) {
        window.location.replace(ROUTES.LOGIN);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  if (isLoading || (!user && !isError)) {
    return <PageLoader />;
  }

  if (isError || !user) {
    return null;
  }

  // Dynamic margin-left based on sidebar collapsed state. Below the `lg`
  // breakpoint (tablet and under) the sidebar becomes an overlay instead of
  // pushing content — a full 256px rail permanently eating the viewport is
  // fine on desktop but leaves too little room for tables/forms on a tablet,
  // so content always sits at the collapsed-rail offset there and an expanded
  // sidebar floats on top of it instead.
  const contentMargin = isCollapsed ? 'ml-16' : 'ml-16 lg:ml-64';

  return (
    // Lock the shell to the viewport so only the inner content area scrolls —
    // otherwise the window/body scrolls too, giving a double scrollbar (CRM-178).
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      {/* Backdrop: only present when the sidebar is expanded as a tablet
          overlay (below `lg`); tapping it collapses the sidebar again. */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-col grow overflow-hidden h-screen">
        <div className="w-full sticky top-0 z-10">
          <AdminHeader />
        </div>

        <div
          className={`${contentMargin} grow min-h-0 bg-blue-extra-light overflow-y-auto flex flex-col transition-all duration-300`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
