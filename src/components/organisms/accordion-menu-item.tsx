'use client';

import { cn } from '@/lib/utils';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SubMenuItemComponent } from './sub-menu-item';
import { MenuItem } from '@/constants/sidebar-menu-items';

interface AccordionMenuItemProps {
  item: MenuItem;
  index: number;
  isActive: boolean;
  pathName: string;
}

export const AccordionMenuItem = ({ item, index, isActive, pathName }: AccordionMenuItemProps) => {
  if (!item.subItems) return null;

  return (
    <AccordionItem value={`item-${index}`} className="border-none">
      <AccordionTrigger
        className={cn(
          'relative flex px-3 h-11 text-sm items-center transition-colors rounded-lg hover:no-underline [&[data-state=open]>svg]:rotate-180',
          isActive && 'bg-component-active !text-primary font-medium',
        )}
      >
        <div className="flex items-center gap-2 flex-1">
          {item.icon && <item.icon className="text-neutral-black size-6" size={22} />}

          <span className="text-neutral-black">{item.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-1">
        <div className="ml-4 mr-[14.5px]">
          {item.subItems.map((subItem, subIndex: number) => (
            <SubMenuItemComponent key={subIndex} subItem={subItem} pathName={pathName} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
