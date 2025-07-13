"use client";

import { MenuItem } from "@/constants/sidebar-menu-items";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SimpleMenuItemProps {
  item: MenuItem;
  isActive: boolean;
}

export const SimpleMenuItem = ({ item, isActive }: SimpleMenuItemProps) => {
  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex items-center p-2 gap-3 text-dark transition-colors rounded-lg",
        isActive && "bg-[#DCF1FF] font-medium text-primary"
      )}
    >
      <item.icon size="22" stroke={isActive ? "2" : "1"} />
      <span className="font-medium">{item.title}</span>
    </Link>
  );
};
