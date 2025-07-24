"use client";

import type React from "react";
import Link from "next/link";
import { MenuItem } from "@/constants/sidebar-menu-items";
import { cn } from "@/lib/utils";

interface SimpleMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick?: () => void;
}

const SimpleMenuItem: React.FC<SimpleMenuItemProps> = ({
  item,
  isActive,
  onClick,
}) => {
  const content = (
    <>
      {item.icon && (
        <item.icon
          className={cn("text-gray-800 size-6", isActive && "text-primary")}
          size={22}
        />
      )}
      <span>{item.title}</span>
    </>
  );

  const className = `flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 ${
    isActive ? "bg-primary/10 text-primary" : "text-gray-700"
  }`;

  return (
    <div className="mb-2 last:mb-0">
      {item.href && item.href !== "#" ? (
        <Link href={item.href} className={className} onClick={onClick}>
          {content}
        </Link>
      ) : (
        <button className={`${className} w-full text-left`} onClick={onClick}>
          {content}
        </button>
      )}
    </div>
  );
};

export default SimpleMenuItem;
