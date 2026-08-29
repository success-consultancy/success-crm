'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SubMenuItem } from '@/constants/sidebar-menu-items';
import { getMenuItemState, menuItemVariants } from '@/components/atoms/menu-item-variants';

interface SubMenuItemProps {
  subItem: SubMenuItem;
  pathName: string;
  collapsed?: boolean;
}

export const SubMenuItemComponent = ({ subItem, pathName, collapsed = false }: SubMenuItemProps) => {
  const isSubActive = pathName === subItem.href;
  const isDisabled = !!subItem.disabled;

  return (
    <Link
      href={subItem.href}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : undefined}
      className={cn(
        'relative z-10 flex items-center h-[40px] w-full rounded-lg overflow-hidden transition-all duration-200 select-none',
        isSubActive
          ? 'bg-component-active text-primary font-semibold'
          : 'text-neutral-black hover:bg-component-active/60 hover:text-neutral-black font-medium',
        collapsed && 'opacity-0 pointer-events-none',
      )}
    >
      <span className={cn(collapsed && 'w-0 opacity-0')}>{subItem.title}</span>
    </Link>
  );
};
