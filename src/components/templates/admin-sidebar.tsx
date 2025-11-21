'use client';

// External packages
import React from 'react';

// Utilities and stores
import { cn } from '@/lib/utils';
import SidebarUserOptions from '../organisms/sidebar-user-options';
import AdminSidebarMenuItems from '../organisms/admin-sidebar-menu-items';
import SidebarLogo from '../organisms/account-switcher';

// UI Elements
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  className?: string;
};

const AdminSidebar = ({ className }: Props) => {
  return (
    <aside
      className={cn(
        'h-screen bg-white border-r border-gray-50 transition-all duration-300 ease-in-out transform fixed !w-64 z-50',
        className,
      )}
    >
      <div className="relative h-full w-full flex flex-col justify-between">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2 h-full">
            <SidebarLogo />
            <div className="p-2">
              <AdminSidebarMenuItems />
            </div>
          </div>
        </ScrollArea>
        <SidebarUserOptions />
      </div>
    </aside>
  );
};

export default AdminSidebar;
