"use client";

import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SubMenuItemComponent } from "./sub-menu-item";
import { MenuItem } from "@/constants/sidebar-menu-items";

interface AccordionMenuItemProps {
  item: MenuItem;
  index: number;
  isActive: boolean;
  pathName: string;
}

export const AccordionMenuItem = ({
  item,
  index,
  isActive,
  pathName,
}: AccordionMenuItemProps) => {
  if (!item.subItems) return null;

  return (
    <AccordionItem value={`item-${index}`} className="border-none">
      <AccordionTrigger
        className={cn(
          "relative flex p-2 items-center text-dark transition-colors rounded-lg hover:no-underline [&[data-state=open]>svg]:rotate-180",
          isActive && "bg-gray-100 text-primary font-medium"
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          <item.icon size="22" stroke={isActive ? "2" : "1"} />
          <span className="font-medium">{item.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-1">
        <div className="ml-4 mr-[14.5px]">
          {item.subItems.map((subItem, subIndex: number) => (
            <SubMenuItemComponent
              key={subIndex}
              subItem={subItem}
              pathName={pathName}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
