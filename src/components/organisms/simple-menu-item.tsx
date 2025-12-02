'use client';

import type React from 'react';
import Link from 'next/link';
import { MenuItem } from '@/constants/sidebar-menu-items';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SimpleMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const SimpleMenuItem: React.FC<SimpleMenuItemProps> = ({ item, isActive, onClick, collapsed = false }) => {
  const className = cn(
    'flex items-center rounded-lg h-11 w-11 text-[15px] font-medium transition-colors cursor-pointer whitespace-nowrap',
    collapsed ? 'justify-center px-0' : 'gap-4 px-3 w-full',
    isActive ? 'bg-component-active !text-primary' : 'text-neutral-black hover:bg-component-active/40',
  );

  const content = (
    <>
      {item.icon && <item.icon size={22} className={cn('text-neutral-black', isActive && 'text-primary')} />}

      {!collapsed && <span>{item.title}</span>}
    </>
  );

  const buttonOrLink =
    item.href && item.href !== '#' ? (
      <Link href={item.href} className={className} onClick={onClick}>
        {content}
      </Link>
    ) : (
      <button className={cn(className, !collapsed && 'w-full text-left')} onClick={onClick}>
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
