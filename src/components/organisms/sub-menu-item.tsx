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
        menuItemVariants({ size: 'medium', state: getMenuItemState(isSubActive, isDisabled) }),
        // Indent so sub-item labels line up with the parent item's label (px-2 + 20px icon + 12px gap)
        'overflow-hidden pl-10',
        collapsed && 'pointer-events-none opacity-0',
      )}
    >
      <span className={cn(collapsed && 'w-0 opacity-0')}>{subItem.title}</span>
    </Link>
  );
};
