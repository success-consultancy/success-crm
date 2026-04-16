'use client';

import { usePathname } from 'next/navigation';
import { Accordion } from '@/components/ui/accordion';
import { AccordionMenuItem } from './accordion-menu-item';
import { MenuItem, menuItems } from '@/constants/sidebar-menu-items';
import SimpleMenuItem from './simple-menu-item';
import { useSidebarStore } from '@/store/sidebar-store';

const AdminSidebarMenuItems = () => {
  const pathName = usePathname();
  const { isCollapsed } = useSidebarStore();

  const isItemActive = (item: MenuItem) => {
    if (item.href) {
      // Strip query parameters from item.href before comparison
      const [itemPath] = item.href.split('?');
      if (item.exact) return pathName === itemPath;
      return (pathName === itemPath || pathName.startsWith(itemPath + '/')) && itemPath !== '/';
    }

    if (item.subItems) return item.subItems.some((subItem) => pathName === subItem.href);

    return false;
  };

  const getDefaultOpenItem = () => {
    const activeItemIndex = menuItems.findIndex((item) => item.subItems?.some((subItem) => pathName === subItem.href));
    return activeItemIndex !== -1 ? `item-${activeItemIndex}` : undefined;
  };

  return (
    <Accordion type="single" collapsible defaultValue={getDefaultOpenItem()} className="w-full">
      {menuItems.map((item, index) => {
        const isActive = isItemActive(item);

        if (!item.subItems && item.href) {
          return <SimpleMenuItem key={index} item={item} isActive={isActive} collapsed={isCollapsed} />;
        }

        if (item.subItems && !isCollapsed) {
          return <AccordionMenuItem key={index} item={item} index={index} isActive={isActive} pathName={pathName} />;
        }

        return null;
      })}
    </Accordion>
  );
};

export default AdminSidebarMenuItems;
