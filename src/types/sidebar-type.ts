import { Icon } from 'iconsax-react';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export enum DashboardTitle {
  Dashboard = 'Dashboard',
  AppointmentCalendar = 'Appointment calendar',
  Administrative = 'Administrative',
  LegalAndAgreements = 'Legal & agreements',
  NewsAndUpdates = 'News and updates',
  EducationService = 'Education service',
  VisaService = 'Visa service',
  SkillAssessmentService = 'Skill assessment service',
  InsuranceService = 'Insurance service',
  Visa = 'Visa',
  Leads = 'Leads',
  FiscalReport = 'Fiscal report',
  AgencyAgreement = 'Agency agreement',
  TribunalReview = 'Tribunal review',
  CheckIn = 'Check-in',
  Setup = 'Setup',
}

export enum SubNavTitle {
  Users = 'Users',
  Employees = 'Employees',
  Occupation = 'Occupation List',
  University = 'University',
  Course = 'Course',
  Source = 'Source',
  FaceUpload = 'Face Upload',
  VisaList = 'Visa List',
  Settings = 'Settings',
}

export interface SidebarNavType {
  title: DashboardTitle | SubNavTitle;
  icon?: ReactNode;
  href?: string;
}

export interface SidebarNavItem extends SidebarNavType {
  subNav?: SidebarNavType[];
}
