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
        'relative flex items-center h-[40px] w-full rounded-lg overflow-hidden transition-all duration-200 select-none',
        isSubActive
          ? 'bg-component-active text-primary font-semibold'
          : 'text-neutral-black hover:bg-component-active/60 hover:text-neutral-black font-medium',
        collapsed && 'opacity-0 pointer-events-none',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 transition-colors duration-300',
        )}
      >
      </div>
      {/* Left accent bar — visible only when active */}
      <span className={cn('pl-3 pr-3 text-[13.5px] whitespace-nowrap leading-none', collapsed && 'opacity-0 w-0')}>
        {subItem.title}
      </span>
    </Link>
  );
};
