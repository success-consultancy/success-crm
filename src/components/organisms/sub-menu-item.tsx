'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SubMenuItem } from '@/constants/sidebar-menu-items';

interface SubMenuItemProps {
  subItem: SubMenuItem;
  pathName: string;
  collapsed?: boolean;
}

export const SubMenuItemComponent = ({ subItem, pathName, collapsed = false }: SubMenuItemProps) => {
  const isSubActive = pathName === subItem.href;

  return (
    <Link
      href={subItem.href}
      className={cn(
        'relative flex items-center py-1 px-[25px] text-sm transition-colors hover:bg-component-active rounded-md overflow-hidden',
        isSubActive ? 'text-primary font-medium bg-component-active' : 'text-neutral-black hover:text-primary',
      )}
    >
      <span
        className={cn(
          'transition-all duration-300 ease-in-out whitespace-nowrap',
          collapsed ? 'opacity-0 w-0' : 'opacity-100',
        )}
      >
        {subItem.title}
      </span>
    </Link>
  );
};
