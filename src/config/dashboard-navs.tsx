import { DashboardTitle, SidebarNavItem, SubNavTitle } from '@/types/sidebar-type';
import { ROUTES } from './routes';

import Icons from '@/assets/icons';

export const NAVIGATION_LIST: SidebarNavItem[] = [
  {
    title: DashboardTitle.Dashboard,
    icon: <Icons.DashboardIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.DASHBOARD,
  },
  {
    title: DashboardTitle.FiscalReport,
    icon: <Icons.FiscalReportIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.FISCAL_REPORT,
  },
  {
    title: DashboardTitle.AppointmentCalendar,
    icon: <Icons.AppointmentCalendarIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.APPOINTMENT,
  },
  {
    title: DashboardTitle.CheckIn,
    icon: <Icons.CheckInIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.CHECK_IN,
  },
  {
    title: DashboardTitle.Leads,
    icon: <Icons.LeadsIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.LEADS,
  },
  {
    title: DashboardTitle.EducationService,
    icon: <Icons.EducationIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.EDUCATION,
  },
  {
    title: DashboardTitle.VisaService,
    icon: <Icons.VisaIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.VISA,
  },
  {
    title: DashboardTitle.SkillAssessmentService,
    icon: <Icons.SkillAssessmentIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.SKILL_ASSESSMENT,
  },
  {
    title: DashboardTitle.TribunalReview,
    icon: <Icons.TribunalReviewIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.TRIBUNAL_REVIEW,
  },
  {
    title: DashboardTitle.InsuranceService,
    icon: <Icons.InsuranceIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.INSURANCE,
  },
  {
    title: DashboardTitle.AgencyAgreement,
    icon: <Icons.AgencyAgreementIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.AGENCY_AGREEMENT,
  },
  {
    title: DashboardTitle.NewsAndUpdates,
    icon: <Icons.NewUpdatesIcon className="h-5 w-5 shrink-0" />,
    href: ROUTES.NEWS_AND_UPDATES,
  },
  {
    title: DashboardTitle.Setup,
    icon: <Icons.SetupIcon className="h-5 w-5 shrink-0" />,
    subNav: [
      {
        title: SubNavTitle.Users,
        href: ROUTES.USERS,
      },
      { title: SubNavTitle.Employees, href: ROUTES.EMPLOYEES },
      { title: SubNavTitle.Occupation, href: ROUTES.CHECK_IN },
      {
        title: SubNavTitle.Occupation,
        href: ROUTES.OCCUPATION,
      },
      {
        title: SubNavTitle.VisaList,
        href: ROUTES.VISA_LIST,
      },
      {
        title: SubNavTitle.University,
        href: ROUTES.UNIVERSITY,
      },
      {
        title: SubNavTitle.Course,
        href: ROUTES.COURSE,
      },
      {
        title: SubNavTitle.Source,
        href: ROUTES.SOURCE,
      },
      {
        title: SubNavTitle.Settings,
        href: ROUTES.SETTINGS,
      },
    ],
  },
];
