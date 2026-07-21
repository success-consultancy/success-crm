import type React from 'react';
import { clearTokens } from '@/utils/token';
import { DashboardTitle } from '@/types/sidebar-type';
import Icons from '@/assets/icons';

export type SubMenuItem = {
  title: string;
  href: string;
  roles?: number[];
  /** Service key from RoleCrudPermissions — item shown when the user's role has `read` access */
  permissionKey?: string;
};

export type MenuItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  exact?: boolean;
  onClick?: () => void;
  subItems?: SubMenuItem[];
  roles?: number[];
};

export const menuItems: MenuItem[] = [
  {
    title: DashboardTitle.Dashboard,
    icon: Icons.DashboardIcon,
    href: '/dashboard',
    exact: true,
    // all roles
  },
  {
    title: DashboardTitle.FiscalReport,
    icon: Icons.FiscalReportIcon,
    roles: [1, 2, 4],
    subItems: [
      { title: 'Visa application', href: '/dashboard/fiscal-report/visa-application' },
      { title: 'Student enrollment', href: '/dashboard/fiscal-report/student-enrollment' },
    ],
  },
  {
    title: DashboardTitle.AppointmentCalendar,
    icon: Icons.AppointmentCalendarIcon,
    href: '/dashboard/appointment?view=work-week',
    // all roles
  },
  {
    title: DashboardTitle.CheckIn,
    icon: Icons.CheckInIcon,
    href: '/dashboard/check-in',
    // all roles
  },
  {
    title: DashboardTitle.Leads,
    icon: Icons.LeadsIcon,
    href: '/dashboard/leads',
    roles: [1, 2, 3, 5],
  },
  {
    title: DashboardTitle.EducationService,
    icon: Icons.EducationIcon,
    href: '/dashboard/education',
    roles: [1, 2, 3],
  },
  {
    title: DashboardTitle.VisaService,
    icon: Icons.VisaIcon,
    href: '/dashboard/visa',
    roles: [1, 2, 3],
  },
  {
    title: DashboardTitle.SkillAssessmentService,
    icon: Icons.SkillAssessmentIcon,
    href: '/dashboard/skill',
    roles: [1, 2, 3],
  },
  {
    title: DashboardTitle.TribunalReview,
    icon: Icons.TribunalReviewIcon,
    href: '/dashboard/tribunal-review',
    roles: [1, 2, 3],
  },
  {
    title: DashboardTitle.InsuranceService,
    icon: Icons.InsuranceIcon,
    href: '/dashboard/insurance',
    roles: [1, 2, 3, 4],
  },
  {
    title: DashboardTitle.AgencyAgreement,
    icon: Icons.AgencyAgreementIcon,
    href: '/dashboard/agreement',
    roles: [1, 2],
  },
  {
    title: DashboardTitle.NewsAndUpdates,
    icon: Icons.NewUpdatesIcon,
    href: '/dashboard/updates-and-announcements',
    // all roles
  },
  {
    title: DashboardTitle.Setup,
    icon: Icons.SetupIcon,
    subItems: [
      { title: 'Users & permissions', href: '/dashboard/users',      permissionKey: 'users' },
      { title: 'Occupation',          href: '/dashboard/occupation',  permissionKey: 'occupation' },
      { title: 'Visa List',           href: '/dashboard/visa-list',   permissionKey: 'visaList' },
      { title: 'University',          href: '/dashboard/university',  permissionKey: 'university' },
      { title: 'Course',              href: '/dashboard/course',      permissionKey: 'course' },
      { title: 'Source',              href: '/dashboard/source',      permissionKey: 'source' },
      { title: 'Settings',            href: '/dashboard/settings',    permissionKey: 'settings' },
    ],
  },
];

export const bottomMenuItems: MenuItem[] = [
  {
    title: 'Logout',
    icon: Icons.LogoutIcon,
    onClick() {
      clearTokens();
      window.location.href = '/login';
    },
  },
];
