import { type Icon, Home2, Profile2User, Setting } from "iconsax-reactjs";

export type SubMenuItem = {
  title: string;
  href: string;
};

export type MenuItem = {
  title: string;
  icon: Icon;
  href?: string;
  subItems?: SubMenuItem[];
};

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home2,
    href: "/dashboard",
  },
  {
    title: "Fiscal Report",
    icon: Profile2User,
    href: "#",
  },
  {
    title: "Appointment Calendar",
    icon: Profile2User,
    href: "#",
  },
  {
    title: "Check-In",
    icon: Profile2User,
    href: "#",
  },
  {
    title: "Leads",
    icon: Profile2User,
    href: "/leads",
  },
  {
    title: "Education Service",
    icon: Profile2User,
    href: "#",
  },
  {
    title: "Visa Service",
    icon: Profile2User,
    href: "#",
  },
  {
    title: "Skill Assessment Service",
    icon: Profile2User,
    href: "#",
  },
  {
    title: "Tribunal Review",
    icon: Profile2User,
    href: "#",
  },
  {
    title: "Agency Agreement",
    icon: Profile2User,
    href: "#",
  },
  {
    title: "News and Updates",
    icon: Profile2User,
    href: "#",
  },
  {
    title: "Setup",
    icon: Setting,
    subItems: [{ title: "Sample Route", href: "#" }],
  },
];
