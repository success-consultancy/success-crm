'use client';

import React from 'react';

import UserDropdown from './user-dropdown';
import NotificationBell from './notification-bell';
import { TasksDrawer } from '../task/tasks-drawer';
import { useSidebarStore } from '@/store/sidebar-store';

const AdminHeader = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="h-16 border-b border-gray-50 bg-white w-full flex items-center transition-all duration-300 px-6">
      <div className="flex items-center justify-between w-full">
        <div
          id="dashboard-header"
          className={`flex items-center transition-all duration-300 ${isCollapsed ? 'pl-16' : 'pl-16 lg:pl-64'}`}
        />

        <div className="flex items-center gap-4">
          <TasksDrawer />
          <NotificationBell />
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
