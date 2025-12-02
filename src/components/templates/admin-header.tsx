'use client';

import React from 'react';
import { Notification } from 'iconsax-reactjs';

import UserDropdown from './user-dropdown';
import { TasksDrawer } from '../task/tasks-drawer';
import { useHeaderStore } from '@/store/header-store';
import { useSidebarStore } from '@/store/sidebar-store';

const AdminHeader = () => {
  const { title } = useHeaderStore();
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="h-16 border-b border-gray-50 bg-white w-full flex items-center transition-all duration-300 px-6">
      <div className="flex items-center justify-between w-full">
        <h3
          className={`text-lg font-semibold truncate transition-all duration-300`}
          style={{ paddingLeft: isCollapsed ? '64px' : '256px' }}
        >
          {title}
        </h3>

        <div className="flex items-center gap-4">
          <TasksDrawer />
          <Notification className="w-5 h-5 cursor-pointer me-2" />
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
