import type React from 'react';
import { clearTokens } from '@/utils/token';
import { DashboardTitle } from '@/types/sidebar-type';
import Icons from '@/assets/icons';

export type SubMenuItem = {
  title: string;
  href: string;
};

export type MenuItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  exact?: boolean;
  onClick?: () => void;
  subItems?: SubMenuItem[];
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
    href: '/dashboard/fiscal-report',
  },
  {
    title: DashboardTitle.AppointmentCalendar,
    icon: Icons.AppointmentCalendarIcon,
    href: '/dashboard/appointment?view=work-week',
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
  },
  {
    title: DashboardTitle.EducationService,
    icon: Icons.EducationIcon,
    href: '/dashboard/education',
  },
  {
    title: DashboardTitle.VisaService,
    icon: Icons.VisaIcon,
    href: '/dashboard/visa',
  },
  {
    title: DashboardTitle.SkillAssessmentService,
    icon: Icons.SkillAssessmentIcon,
    href: '/dashboard/skill',
  },
  {
    title: DashboardTitle.TribunalReview,
    icon: Icons.TribunalReviewIcon,
    href: '/dashboard/tribunal-review',
  },
  {
    title: DashboardTitle.InsuranceService,
    icon: Icons.InsuranceIcon,
    href: '/dashboard/insurance',
  },
  {
    title: DashboardTitle.AgencyAgreement,
    icon: Icons.AgencyAgreementIcon,
    href: '/dashboard/agreement',
  },
  {
    title: DashboardTitle.NewsAndUpdates,
    icon: Icons.NewUpdatesIcon,
    href: '#',
  },
  {
    title: DashboardTitle.Setup,
    icon: Icons.SetupIcon,
    subItems: [
      { title: 'Users', href: '#' },
      { title: 'Employees', href: '#' },
      { title: 'Occupation', href: '#' },
      { title: 'Visa List', href: '#' },
      { title: 'University', href: '/dashboard/university' },
      { title: 'Course', href: '/dashboard/course' },
      { title: 'Source', href: '/dashboard/source' },
      { title: 'Settings', href: '/dashboard/settings' },
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
