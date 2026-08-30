'use client';

import type React from 'react';
import Link from 'next/link';
import { MenuItem } from '@/constants/sidebar-menu-items';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getMenuItemState, menuItemIconSize, menuItemVariants } from '@/components/atoms/menu-item-variants';

interface SimpleMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const SimpleMenuItem: React.FC<SimpleMenuItemProps> = ({ item, isActive, onClick, collapsed = false }) => {
  const isDisabled = !!item.disabled;

  const className = cn(
    menuItemVariants({ size: 'large', state: getMenuItemState(isActive, isDisabled) }),
    collapsed && 'w-10 justify-center px-0',
  );

  const content = (
    <>
      {item.icon && <item.icon size={menuItemIconSize.large} className="shrink-0" />}

      {!collapsed && <span>{item.title}</span>}
    </>
  );

  const buttonOrLink =
    item.href && item.href !== '#' && !isDisabled ? (
      <Link href={item.href} className={className} onClick={onClick}>
        {content}
      </Link>
    ) : (
      <button
        className={cn(className, !collapsed && 'text-left')}
        onClick={onClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
      >
        {content}
      </button>
    );

  // If sidebar not collapsed, no tooltip needed
  if (!collapsed) {
    return <div className="last:mb-0">{buttonOrLink}</div>;
  }

  // Tooltip when collapsed
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="last:mb-0 flex justify-center">{buttonOrLink}</div>
        </TooltipTrigger>

        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SimpleMenuItem;
