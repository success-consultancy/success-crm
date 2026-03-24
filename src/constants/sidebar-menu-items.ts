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
  onClick?: () => void;
  subItems?: SubMenuItem[];
};

export const menuItems: MenuItem[] = [
  {
    title: DashboardTitle.Dashboard,
    icon: Icons.DashboardIcon,
    href: '/dashboard',
  },
  {
    title: DashboardTitle.FiscalReport,
    icon: Icons.FiscalReportIcon,
    href: '#',
  },
  {
    title: DashboardTitle.AppointmentCalendar,
    icon: Icons.AppointmentCalendarIcon,
    href: '/appointment?view=work-week',
  },
  {
    title: DashboardTitle.CheckIn,
    icon: Icons.CheckInIcon,
    href: '#',
  },
  {
    title: DashboardTitle.Leads,
    icon: Icons.LeadsIcon,
    href: '/leads',
  },
  {
    title: DashboardTitle.EducationService,
    icon: Icons.EducationIcon,
    href: '/education',
  },
  {
    title: DashboardTitle.VisaService,
    icon: Icons.VisaIcon,
    href: '/visa',
  },
  {
    title: DashboardTitle.SkillAssessmentService,
    icon: Icons.SkillAssessmentIcon,
    href: '/skill',
  },
  {
    title: DashboardTitle.TribunalReview,
    icon: Icons.TribunalReviewIcon,
    href: '/tribunal-review',
  },
  {
    title: DashboardTitle.InsuranceService,
    icon: Icons.InsuranceIcon,
    href: '/insurance',
  },
  {
    title: DashboardTitle.AgencyAgreement,
    icon: Icons.AgencyAgreementIcon,
    href: '/agreement',
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
      { title: 'University', href: '/university' },
      { title: 'Course', href: '/course' },
      { title: 'Source', href: '/source' },
      { title: 'Settings', href: '/settings' },
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
