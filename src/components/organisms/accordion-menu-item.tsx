'use client';

import { cn } from '@/lib/utils';
import { SubMenuItemComponent } from './sub-menu-item';
import { useSidebarStore } from '@/store/sidebar-store';
import { MenuItem } from '@/constants/sidebar-menu-items';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { menuItemIconSize, menuItemVariants } from '@/components/atoms/menu-item-variants';

interface AccordionMenuItemProps {
  item: MenuItem;
  index: number;
  pathName: string;
}

export const AccordionMenuItem = ({ item, index, pathName }: AccordionMenuItemProps) => {
  const { isCollapsed } = useSidebarStore();
  const isDisabled = !!item.disabled;

  if (!item.subItems) return null;

  return (
    <AccordionItem value={`item-${index}`} className="border-none">
      <AccordionTrigger
        disabled={isDisabled}
        className={cn(
          menuItemVariants({ size: 'large', state: isDisabled ? 'disabled' : 'default' }),
          'items-center justify-between py-0 hover:no-underline',
          isCollapsed && 'justify-center px-0',
        )}
      >
        <div
          className={cn(
            'flex items-center gap-3 transition-all duration-300 ease-in-out',
            isCollapsed ? 'justify-center' : 'flex-1 overflow-hidden whitespace-nowrap',
          )}
        >
          {item.icon && <item.icon className="shrink-0" size={menuItemIconSize.large} />}
          {!isCollapsed && <span className="transition-opacity duration-300 ease-in-out">{item.title}</span>}
        </div>
      </AccordionTrigger>

      <AccordionContent className={cn('pb-1 transition-all duration-300', isCollapsed && 'hidden')}>
        <div className="relative flex flex-col mt-1">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-neutral-border-light" />
          {item.subItems.map((subItem, subIndex: number) => (
            <SubMenuItemComponent key={subIndex} subItem={subItem} pathName={pathName} collapsed={isCollapsed} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
