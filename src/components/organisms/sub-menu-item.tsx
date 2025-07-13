"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { SubMenuItem } from "@/constants/sidebar-menu-items";

interface SubMenuItemProps {
  subItem: SubMenuItem;
  pathName: string;
}

export const SubMenuItemComponent = ({
  subItem,
  pathName,
}: SubMenuItemProps) => {
  const isSubActive = pathName === subItem.href;

  return (
    <Link
      href={subItem.href}
      className={cn(
        "relative border-l flex items-center py-1 px-[25px] transition-colors",
        isSubActive
          ? "text-primary font-medium"
          : "text-gray-600 hover:text-primary"
      )}
    >
      <span className="pl-[2.5px]">{subItem.title}</span>
    </Link>
  );
};
