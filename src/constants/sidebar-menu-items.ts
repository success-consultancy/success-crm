// import type React from 'react';
// import {
//   LayoutGrid,
//   FileBarChart,
//   Calendar,
//   UserCheck,
//   Users,
//   GraduationCap,
//   Globe,
//   Lightbulb,
//   Scale,
//   ShieldPlus,
//   FileText,
//   Megaphone,
//   Settings,
//   LogOut,
//   ChevronDown,
//   LucideIcon,
// } from 'lucide-react';
// import { clearTokens } from '@/utils/token';
// import { DashboardTitle } from '@/types/sidebar-type';

// export type SubMenuItem = {
//   title: string;
//   href: string;
// };

// export type MenuItem = {
//   title: string;
//   icon: LucideIcon;
//   href?: string;
//   onClick?: () => void;
//   subItems?: SubMenuItem[];
// };

// export const menuItems: MenuItem[] = [
//   {
//     title: DashboardTitle.Dashboard,
//     icon: LayoutGrid,
//     href: '/dashboard',
//   },
//   {
//     title: DashboardTitle.FiscalReport,
//     icon: FileBarChart,
//     href: '#',
//   },
//   {
//     title: DashboardTitle.AppointmentCalendar,
//     icon: Calendar,
//     href: '#',
//   },
//   {
//     title: DashboardTitle.CheckIn,
//     icon: UserCheck,
//     href: '#',
//   },
//   {
//     title: DashboardTitle.Leads,
//     icon: Users,
//     href: '/leads',
//   },
//   {
//     title: DashboardTitle.EducationService,
//     icon: GraduationCap,
//     href: '/education',
//   },
//   {
//     title: DashboardTitle.VisaService,
//     icon: Globe,
//     href: '/visa',
//   },
//   {
//     title: DashboardTitle.SkillAssessmentService,
//     icon: Lightbulb,
//     href: '#',
//   },
//   {
//     title: DashboardTitle.TribunalReview,
//     icon: Scale,
//     href: '#',
//   },
//   {
//     title: DashboardTitle.InsuranceService,
//     icon: ShieldPlus,
//     href: '#',
//   },
//   {
//     title: DashboardTitle.AgencyAgreement,
//     icon: FileText,
//     href: '#',
//   },
//   {
//     title: DashboardTitle.NewsAndUpdates,
//     icon: Megaphone,
//     href: '#',
//   },
//   {
//     title: DashboardTitle.Setup,
//     icon: Settings,
//     subItems: [
//       { title: 'Users', href: '#' },
//       { title: 'Employees', href: '#' },
//     ],
//   },
// ];

// export const bottomMenuItems: MenuItem[] = [
//   {
//     title: 'Logout',
//     icon: LogOut,
//     onClick() {
//       clearTokens();
//       window.location.href = '/login';
//     },
//   },
// ];

// export const ChevronDownIcon = ChevronDown;

import type React from 'react';
import {
  Layer,
  DocumentText1,
  Calendar as CalendarIcon,
  UserTick,
  Teacher,
  Global,
  Nebulas,
  Judge,
  ShieldTick,
  TableDocument,
  Driver2,
  Setting3,
  Profile2User,
} from 'iconsax-reactjs';
import { clearTokens } from '@/utils/token';
import { DashboardTitle } from '@/types/sidebar-type';

export type SubMenuItem = {
  title: string;
  href: string;
};

export type MenuItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  subItems?: SubMenuItem[];
};

export const menuItems: MenuItem[] = [
  {
    title: DashboardTitle.Dashboard,
    icon: Layer,
    href: '/dashboard',
  },
  {
    title: DashboardTitle.FiscalReport,
    icon: DocumentText1,
    href: '#',
  },
  {
    title: DashboardTitle.AppointmentCalendar,
    icon: CalendarIcon,
    href: '#',
  },
  {
    title: DashboardTitle.CheckIn,
    icon: UserTick,
    href: '#',
  },
  {
    title: DashboardTitle.Leads,
    icon: Profile2User,
    href: '/leads',
  },
  {
    title: DashboardTitle.EducationService,
    icon: Teacher,
    href: '/education',
  },
  {
    title: DashboardTitle.VisaService,
    icon: Global,
    href: '/visa',
  },
  {
    title: DashboardTitle.SkillAssessmentService,
    icon: Nebulas,
    href: '/skill',
  },
  {
    title: DashboardTitle.TribunalReview,
    icon: Judge,
    href: '/tribunal-review',
  },
  {
    title: DashboardTitle.InsuranceService,
    icon: ShieldTick,
    href: '/insurance',
  },
  {
    title: DashboardTitle.AgencyAgreement,
    icon: TableDocument,
    href: '#',
  },
  {
    title: DashboardTitle.NewsAndUpdates,
    icon: Driver2,
    href: '#',
  },
  {
    title: DashboardTitle.Setup,
    icon: Setting3,
    subItems: [
      { title: 'Users', href: '#' },
      { title: 'Employees', href: '#' },
    ],
  },
];

export const bottomMenuItems: MenuItem[] = [
  {
    title: 'Logout',
    icon: Driver2,
    onClick() {
      clearTokens();
      window.location.href = '/login';
    },
  },
];
