'use client';

import { cn } from '@/lib/utils';
import { SubMenuItemComponent } from './sub-menu-item';
import { useSidebarStore } from '@/store/sidebar-store';
import { MenuItem } from '@/constants/sidebar-menu-items';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AccordionMenuItemProps {
  item: MenuItem;
  index: number;
  isActive: boolean;
  pathName: string;
}

export const AccordionMenuItem = ({ item, index, isActive, pathName }: AccordionMenuItemProps) => {
  const { isCollapsed } = useSidebarStore();

  if (!item.subItems) return null;

  return (
    <AccordionItem value={`item-${index}`} className="border-none">
      <AccordionTrigger
        className={cn(
          'relative flex h-11 items-center rounded-lg transition-all duration-300 ease-in-out hover:no-underline',
          isActive && 'bg-component-active text-primary font-medium',
          isCollapsed ? 'justify-center px-0' : 'px-[3px]',
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2 transition-all duration-300 ease-in-out',
            isCollapsed ? 'justify-center w-10 h-10 rounded-lg' : 'flex-1 whitespace-nowrap overflow-hidden',
          )}
        >
          {item.icon && (
            <div
              className={cn(
                'flex items-center justify-center w-10 h-10 transition-colors duration-300',
                isActive && 'bg-component-active text-primary rounded-lg',
              )}
            >
              <item.icon className="text-neutral-black" size={22} />
            </div>
          )}
          {!isCollapsed && (
            <span className="transition-opacity duration-300 ease-in-out opacity-100 text-[15px]">{item.title}</span>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className={cn('pb-1 transition-all duration-300', isCollapsed && 'hidden')}>
        <div className="ml-[26px] mr-[14.5px]">
          {item.subItems.map((subItem, subIndex: number) => (
            <SubMenuItemComponent key={subIndex} subItem={subItem} pathName={pathName} collapsed={isCollapsed} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
