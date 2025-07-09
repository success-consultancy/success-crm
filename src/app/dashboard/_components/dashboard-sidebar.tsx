'use client';

import { cn } from '@/lib/cn';

import React from 'react';
import { SidebarNav } from './sidebar-nav';
import { ChevronLeft } from 'lucide-react';

import { usePathname } from 'next/navigation';
import { useAppStateStore } from '@/store/app-state-store';
import { BrandLogoNav } from './brand-logo-nav';
import { NAVIGATION_LIST } from '@/app/config/dashboard-navs';
import Link from 'next/link';
import Icons from '@/icons';

type Props = {
  className?: string;
};

const DashboardSidebar = ({ className }: Props) => {
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);

  const currentPathname = usePathname();

  const { isSidebarCollapsed, handleToggleSidebarCollapse } = useAppStateStore();

  return (
    <div className="relative isolate z-50">
      <aside
        className={cn([
          'relative duration-300 bg-white-100 shrink-0 ease-out group h-full pt-[.875rem] flex flex-col transition-all',
          // use after pseudo element to add border-r so that it doesn't affect the pointer out
          'after:right-0 after:top-0 after:h-full after:w-px after:bg-border-normal after:absolute after:pointer-events-none',
          isSidebarCollapsed ? 'w-[4.5rem]' : 'w-[16rem]',
          className,
        ])}
      >
        <BrandLogoNav isCollapsed={isSidebarCollapsed} className="mb-5.5" />

        {/* nav menu group */}
        <div className="grow flex flex-col gap-2 overflow-hidden hover:overflow-y-auto custom-scrollbar">
          {NAVIGATION_LIST.map((nav) => (
            <SidebarNav
              key={nav.href + nav.title}
              currentPathname={currentPathname}
              isCollapsed={isSidebarCollapsed}
              {...nav}
            />
          ))}

        </div>

      <Link
        href={'/login'}
        className={cn(['flex items-center gap-4 cursor-pointer hover:bg-accent-50 px-3 py-5 text-b1-b mx-4 border-t border-primary', isSidebarCollapsed && '!px-0 mx-auto'])}
      >
         <Icons.LogoutIcon className="h-5 w-5 shrink-0" />
        {!isSidebarCollapsed && "Logout"}
      </Link>
        {/* <UserNavMenu isCollapsed={isSidebarCollapsed} /> */}
        {/* sidebar toggle */}
        <button
          ref={toggleButtonRef}
          onClick={() => handleToggleSidebarCollapse(!isSidebarCollapsed)}
          className={cn(
            'absolute bottom-[7%] right-0 z-30 translate-x-1/2',
            'rounded-full cursor-pointer bg-white p-1 shrink-0 shadow-round w-9 h-9 flex-center',
            'active:scale-90 hover:shadow-lg duration-200 transition-all',
            'opacity-0 group-hover:opacity-100',
            'hover:bg-white border border-border-normal',
          )}
        >
          <ChevronLeft 
            className={cn(
              'duration-300 stroke-[1.5] transition-transform', 
              isSidebarCollapsed ? 'rotate-180' : 'rotate-0'
            )} 
          />
        </button>
      </aside>
    </div>
  );
};

export default DashboardSidebar;