'use client';

import React from 'react';
import { LogoutCurve } from 'iconsax-reactjs';

import { cn } from '@/lib/utils';
import { clearTokens } from '@/utils/token';
import { useSidebarStore } from '@/store/sidebar-store';

const SidebarUserOptions = () => {
  const { isCollapsed } = useSidebarStore();

  const handleLogout = () => {
    clearTokens();
    window.location.href = '/login';
  };

  return (
    <div
      role="button"
      onClick={handleLogout}
      className={cn(
        'p-4 flex items-center transition-colors rounded-lg cursor-pointer text-red',
        isCollapsed ? 'justify-center px-0' : 'gap-3',
      )}
    >
      <LogoutCurve size={22} />
      {!isCollapsed && <span>Logout</span>}
    </div>
  );
};

export default SidebarUserOptions;
