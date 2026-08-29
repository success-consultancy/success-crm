'use client';

import { cn } from '@/lib/utils';
import { SubMenuItemComponent } from './sub-menu-item';
import { useSidebarStore } from '@/store/sidebar-store';
import { MenuItem } from '@/constants/sidebar-menu-items';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getMenuItemState, menuItemIconSize, menuItemVariants } from '@/components/atoms/menu-item-variants';

interface AccordionMenuItemProps {
  item: MenuItem;
  index: number;
  isActive: boolean;
  pathName: string;
}

export const AccordionMenuItem = ({ item, index, isActive, pathName }: AccordionMenuItemProps) => {
  const { isCollapsed } = useSidebarStore();
  const isDisabled = !!item.disabled;

  if (!item.subItems) return null;

  return (
    <AccordionItem value={`item-${index}`} className="border-none">
      <AccordionTrigger
        disabled={isDisabled}
        className={cn(
          menuItemVariants({ size: 'large', state: getMenuItemState(isActive, isDisabled) }),
          'py-0 hover:no-underline',
          isCollapsed && 'w-10 justify-center px-0',
        )}
      >
        <div className={cn('flex items-center gap-3', isCollapsed ? 'justify-center' : 'flex-1 overflow-hidden')}>
          {item.icon && <item.icon className="text-neutral-black shrink-0" size={menuItemIconSize.large} />}
          {!isCollapsed && <span>{item.title}</span>}
        </div>
      </AccordionTrigger>

      <AccordionContent className={cn('pb-1 transition-all duration-300', isCollapsed && 'hidden')}>
        <div className="flex flex-col gap-0.5 mt-1">
          {item.subItems.map((subItem, subIndex: number) => (
            <SubMenuItemComponent key={subIndex} subItem={subItem} pathName={pathName} collapsed={isCollapsed} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
