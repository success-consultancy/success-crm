'use client';

// External packages
import React from 'react';
import { ChevronLeft } from 'lucide-react';

// Utilities and stores
import { cn } from '@/lib/utils';
import SidebarUserOptions from '../organisms/sidebar-user-options';
import AdminSidebarMenuItems from '../organisms/admin-sidebar-menu-items';
import { SidebarLogo, BranchSelector } from '../organisms/account-switcher';

// UI Elements
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebarStore } from '@/store/sidebar-store';

type Props = {
  className?: string;
};

const AdminSidebar = ({ className }: Props) => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <aside
      className={cn(
        'h-screen bg-white border-r border-gray-50 transition-all duration-300 ease-in-out fixed z-50',
        isCollapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      <div className="relative h-full w-full flex flex-col justify-between">
        <ScrollArea className="h-full">
          <div className="flex flex-col h-full">
            <SidebarLogo />
            <div className={!isCollapsed ? 'p-2 pt-2' : undefined}>
              <BranchSelector />
              <AdminSidebarMenuItems />
            </div>
          </div>
        </ScrollArea>

        <SidebarUserOptions />

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-[20px] right-[-12px] w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md transition-all hover:bg-gray-50"
        >
          <ChevronLeft
            size={18}
            className={cn('transition-transform duration-300 ease-in-out', isCollapsed && 'rotate-180')}
          />
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
