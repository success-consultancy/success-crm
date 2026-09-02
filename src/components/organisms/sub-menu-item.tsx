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
console.log(menuItemVariants({ size: 'large', state: getMenuItemState(isSubActive, isDisabled) }));
  return (
    <Link
      href={subItem.href}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : undefined}
      className={cn(
        menuItemVariants({ size: 'large', state: getMenuItemState(isSubActive, isDisabled) }),
        'relative z-10 overflow-hidden w-[80%] ml-auto pl-2',
        collapsed && 'pointer-events-none opacity-0',
      )}
    >
      {subItem.icon ? <subItem.icon className="shrink-0" /> : <span aria-hidden className="w-5 shrink-0" />}

      <span className={cn(collapsed && 'w-0 opacity-0')}>{subItem.title}</span>
    </Link>
  );
};
