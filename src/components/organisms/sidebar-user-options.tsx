// External packages
import React from 'react';
import { useRouter } from 'next/navigation';
import { LogoutCurve } from 'iconsax-reactjs';

import { clearTokens } from '@/utils/token';

const SidebarUserOptions = () => {
  const router = useRouter();
  return (
    <div
      className="p-4 flex items-center gap-3 cursor-pointer text-red"
      role="button"
      onClick={() => {
        clearTokens();
        window.location.href = '/login';
      }}
    >
      <LogoutCurve />
      <span>Logout</span>
    </div>
  );
};
export default SidebarUserOptions;
