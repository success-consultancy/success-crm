'use client';

import { usePathname } from 'next/navigation';
import { Accordion } from '@/components/ui/accordion';
import { AccordionMenuItem } from './accordion-menu-item';
import { MenuItem, menuItems } from '@/constants/sidebar-menu-items';
import SimpleMenuItem from './simple-menu-item';
import { useSidebarStore } from '@/store/sidebar-store';
import useAuthStore from '@/store/auth-store';

const AdminSidebarMenuItems = () => {
  const pathName = usePathname();
  const { isCollapsed } = useSidebarStore();
  const roleId = useAuthStore((s) => s.profile?.roleId ?? 0);

  const canSee = (roles?: number[]) => !roles || roles.includes(roleId);

  // Filter top-level items and their sub-items by the current user's role.
  // A parent with sub-items is hidden when all its sub-items are filtered out.
  const visibleItems = menuItems.reduce<MenuItem[]>((acc, item) => {
    if (!canSee(item.roles)) return acc;

    if (item.subItems) {
      const visibleSubItems = item.subItems.filter((sub) => canSee(sub.roles));
      if (visibleSubItems.length === 0) return acc;
      acc.push({ ...item, subItems: visibleSubItems });
    } else {
      acc.push(item);
    }

    return acc;
  }, []);

  const isItemActive = (item: MenuItem) => {
    if (item.href) {
      const [itemPath] = item.href.split('?');
      if (item.exact) return pathName === itemPath;
      return (pathName === itemPath || pathName.startsWith(itemPath + '/')) && itemPath !== '/';
    }
    if (item.subItems) return item.subItems.some((sub) => pathName === sub.href);
    return false;
  };

  const getDefaultOpenItem = () => {
    const idx = visibleItems.findIndex((item) => item.subItems?.some((sub) => pathName === sub.href));
    return idx !== -1 ? `item-${idx}` : undefined;
  };

  return (
    <Accordion type="single" collapsible defaultValue={getDefaultOpenItem()} className="w-full">
      {visibleItems.map((item, index) => {
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
