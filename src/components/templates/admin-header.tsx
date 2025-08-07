import { useHeaderStore } from '@/store/header-store';
import { DocumentText, Notification } from 'iconsax-reactjs';
import React from 'react';

import UserDropdown from './user-dropdown';
import TaskSheet from './task-sheet';
import { TasksDrawer } from '../task/tasks-drawer';

type Props = {};

const AdminHeader = (props: Props) => {
  const { title } = useHeaderStore();

  return (
    <div className="h-16 border-b bg-white w-full px-6 flex items-center">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-4">
          <TasksDrawer />
          <Notification className="w-5 h-5 cursor-pointer" />
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
