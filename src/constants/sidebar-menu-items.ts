import type React from 'react';
import { clearTokens } from '@/utils/token';
import { DashboardTitle } from '@/types/sidebar-type';
import Icons from '@/assets/icons';

export type SubMenuItem = {
  title: string;
  href: string;
  /** Renders the item in the disabled state — visible but not interactive */
  disabled?: boolean;
  roles?: number[];
  /** Service key from RoleCrudPermissions — item shown when the user's role has `read` access */
  permissionKey?: string;
};

export type MenuItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  exact?: boolean;
  /** Renders the item in the disabled state — visible but not interactive */
  disabled?: boolean;
  onClick?: () => void;
  subItems?: SubMenuItem[];
  roles?: number[];
  /** Service key from RoleCrudPermissions — item shown when the user's role has `read` access */
  permissionKey?: string;
};

export const menuItems: MenuItem[] = [
  {
    title: DashboardTitle.Dashboard,
    icon: Icons.DashboardIcon,
    href: '/dashboard',
    exact: true,
  },
  {
    title: DashboardTitle.FiscalReport,
    icon: Icons.FiscalReportIcon,
    permissionKey: 'fiscalReport',
    subItems: [
      { title: 'Visa application', href: '/dashboard/fiscal-report/visa-application' },
      { title: 'Student enrollment', href: '/dashboard/fiscal-report/student-enrollment' },
    ],
  },
  {
    title: DashboardTitle.AppointmentCalendar,
    icon: Icons.AppointmentCalendarIcon,
    href: '/dashboard/appointment?view=work-week',
    permissionKey: 'appointment',
  },
  {
    title: DashboardTitle.CheckIn,
    icon: Icons.CheckInIcon,
    href: '/dashboard/check-in',
  },
  {
    title: DashboardTitle.Leads,
    icon: Icons.LeadsIcon,
    href: '/dashboard/leads',
    permissionKey: 'leads',
  },
  {
    title: DashboardTitle.EducationService,
    icon: Icons.EducationIcon,
    href: '/dashboard/education',
    permissionKey: 'education',
  },
  {
    title: DashboardTitle.VisaService,
    icon: Icons.VisaIcon,
    href: '/dashboard/visa',
    permissionKey: 'visa',
  },
  {
    title: DashboardTitle.SkillAssessmentService,
    icon: Icons.SkillAssessmentIcon,
    href: '/dashboard/skill',
    permissionKey: 'skill',
  },
  {
    title: DashboardTitle.TribunalReview,
    icon: Icons.TribunalReviewIcon,
    href: '/dashboard/tribunal-review',
    permissionKey: 'tribunalReview',
  },
  {
    title: DashboardTitle.InsuranceService,
    icon: Icons.InsuranceIcon,
    href: '/dashboard/insurance',
    permissionKey: 'insurance',
  },
  {
    title: DashboardTitle.AgencyAgreement,
    icon: Icons.AgencyAgreementIcon,
    href: '/dashboard/agreement',
    permissionKey: 'agreement',
  },
  {
    title: DashboardTitle.NewsAndUpdates,
    icon: Icons.NewUpdatesIcon,
    href: '/dashboard/updates-and-announcements',
    permissionKey: 'announcement',
  },
  {
    title: DashboardTitle.Setup,
    icon: Icons.SetupIcon,
    subItems: [
      { title: 'Users & permissions', href: '/dashboard/users', permissionKey: 'users' },
      { title: 'Occupation', href: '/dashboard/occupation', permissionKey: 'occupation' },
      { title: 'Visa List', href: '/dashboard/visa-list', permissionKey: 'visaList' },
      { title: 'University', href: '/dashboard/university', permissionKey: 'university' },
      { title: 'Course', href: '/dashboard/course', permissionKey: 'course' },
      { title: 'Source', href: '/dashboard/source', permissionKey: 'source' },
      { title: 'Settings', href: '/dashboard/settings', permissionKey: 'settings' },
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
