import type React from "react";
import {
  LayoutGrid,
  FileBarChart,
  Calendar,
  UserCheck,
  Users,
  GraduationCap,
  Globe,
  Lightbulb,
  Scale,
  ShieldPlus,
  FileText,
  Megaphone,
  Settings,
  LogOut,
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import { clearTokens } from "@/utils/token";

export type SubMenuItem = {
  title: string;
  href: string;
};

export type MenuItem = {
  title: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  subItems?: SubMenuItem[];
};

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutGrid,
    href: "/dashboard",
  },
  {
    title: "Fiscal Report",
    icon: FileBarChart,
    href: "#",
  },
  {
    title: "Appointment Calendar",
    icon: Calendar,
    href: "#",
  },
  {
    title: "Check-In",
    icon: UserCheck,
    href: "#",
  },
  {
    title: "Leads",
    icon: Users,
    href: "/leads",
  },
  {
    title: "Education Service",
    icon: GraduationCap,
    href: "#",
  },
  {
    title: "Visa Service",
    icon: Globe,
    href: "#",
  },
  {
    title: "Skill Assessment Service",
    icon: Lightbulb,
    href: "#",
  },
  {
    title: "Tribunal Review",
    icon: Scale,
    href: "#",
  },
  {
    title: "Insurance Service",
    icon: ShieldPlus,
    href: "#",
  },
  {
    title: "Agency Agreement",
    icon: FileText,
    href: "#",
  },
  {
    title: "News and Updates",
    icon: Megaphone,
    href: "#",
  },
  {
    title: "Setup",
    icon: Settings,
    subItems: [{ title: "Sample Route", href: "#" }],
  },
];

export const bottomMenuItems: MenuItem[] = [
  {
    title: "Logout",
    icon: LogOut,
    onClick() {
      clearTokens();
      window.location.href = "/login";
    },
  },
];

export const ChevronDownIcon = ChevronDown;
