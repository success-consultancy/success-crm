"use client";

import { usePathname } from "next/navigation";
import { Accordion } from "@/components/ui/accordion";
import { AccordionMenuItem } from "./accordion-menu-item";
import { SimpleMenuItem } from "./simple-menu-item";
import { MenuItem, menuItems } from "@/constants/sidebar-menu-items";

const AdminSidebarMenuItems = () => {
  const pathName = usePathname();

  const isItemActive = (item: MenuItem) => {
    if (item.href) {
      return pathName === item.href;
    }
    if (item.subItems) {
      return item.subItems.some((subItem) => pathName === subItem.href);
    }
    return false;
  };

  const getDefaultOpenItem = () => {
    const activeItemIndex = menuItems.findIndex((item) => {
      if (item.subItems) {
        return item.subItems.some((subItem) => pathName === subItem.href);
      }
      return false;
    });
    return activeItemIndex !== -1 ? `item-${activeItemIndex}` : undefined;
  };

  return (
    <div className="">
      <Accordion
        type="single"
        collapsible
        defaultValue={getDefaultOpenItem()}
        className="w-full space-y-1"
      >
        {menuItems.map((item, index) => {
          const isActive = isItemActive(item);

          if (!item.subItems && item.href) {
            return (
              <SimpleMenuItem key={index} item={item} isActive={isActive} />
            );
          }

          if (item.subItems) {
            return (
              <AccordionMenuItem
                key={index}
                item={item}
                index={index}
                isActive={isActive}
                pathName={pathName}
              />
            );
          }

          return null;
        })}
      </Accordion>
    </div>
  );
};

export default AdminSidebarMenuItems;
