"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { User, LogoutCurve, Document } from "iconsax-reactjs";
import { useRouter } from "next/navigation";

type MenuItem = {
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
};

const menuItems: MenuItem[] = [
  {
    label: "Account Settings",
    icon: User,
    href: "/dashboard/profile",
  },
  {
    label: "Time Sheet",
    icon: Document,
    href: "/#",
  },
  {
    label: "Sign Out",
    icon: LogoutCurve,
    onClick: () => {
      // You can replace this with real sign-out logic
      localStorage.clear();
      window.location.href = "/login";
    },
  },
];

const UserDropdown = () => {
  const router = useRouter();

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/avatar-placeholder.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium leading-none">John Doe</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {menuItems.map((item) => (
          <React.Fragment key={item.label}>
            {item.label === "Sign Out" && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => handleItemClick(item)}
              className="flex items-center gap-2"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
