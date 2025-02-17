import {
  DashboardTitle,
  SidebarNavItem,
  SubNavTitle,
} from "@/types/sidebar-type";
import { ROUTES } from "./routes";

import Icons from "@/icons";

export const NAVIGATION_LIST: SidebarNavItem[] = [
  {
    title: DashboardTitle.Dashboard,
    icon: <Icons.DashboardIcon />,
    href: ROUTES.DASHBOARD,
  },
  {
    title: DashboardTitle.FiscalReport,
    icon: <Icons.FiscalReportIcon />,
    href: ROUTES.FISCAL_REPORT,
  },
  {
    title: DashboardTitle.AppointmentCalendar,
    icon: <Icons.AppointmentCalendarIcon />,
    href: ROUTES.APPOINTMENT,
  },
  {
    title: DashboardTitle.CheckIn,
    icon: <Icons.CheckInIcon />,
    href: ROUTES.CHECK_IN,
  },
  {
    title: DashboardTitle.Leads,
    icon: <Icons.LeadsIcon />,
    href: ROUTES.LEADS,
  },
  {
    title: DashboardTitle.EducationService,
    icon: <Icons.EducationIcon />,
    href: ROUTES.EDUCATION,
  },
  {
    title: DashboardTitle.VisaService,
    icon: <Icons.VisaIcon />,
    href: ROUTES.VISA,
  },
  {
    title: DashboardTitle.SkillAssessmentService,
    icon: <Icons.SkillAssessmentIcon />,
    href: ROUTES.SKILL_ASSESSMENT,
  },
  {
    title: DashboardTitle.TribunalReview,
    icon: <Icons.TribunalReviewIcon />,
    href: ROUTES.TRIBUNAL_REVIEW,
  },
  {
    title: DashboardTitle.InsuranceService,
    icon: <Icons.InsuranceIcon />,
    href: ROUTES.INSURANCE,
  },
  {
    title: DashboardTitle.AgencyAgreement,
    icon: <Icons.AgencyAgreementIcon />,
    href: ROUTES.AGENCY_AGREEMENT,
  },
  {
    title: DashboardTitle.NewsAndUpdates,
    icon: <Icons.NewUpdatesIcon />,
    href: ROUTES.NEWS_AND_UPDATES,
  },
  {
    title: DashboardTitle.Setup,
    icon: <Icons.SetupIcon />,
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

