import { Icon } from "iconsax-react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export enum DashboardTitle {
    Dashboard = 'Dashboard',
    AppointmentCalendar = 'Appointment Calendar',
    Administrative = 'Administrative',
    LegalAndAgreements = 'Legal & Agreements',
    NewsAndUpdates = 'News and Updates',
    EducationService = 'Education Service',
    VisaService = 'Visa Service',
    SkillAssessmentService = 'Skill Assessment Service',
    InsuranceService = 'Insurance Service',
    Visa = 'Visa',
    Leads = 'Leads',
    FiscalReport = 'Fiscal Report',
    AgencyAgreement = 'Agency Agreement',
    TribunalReview = 'Tribunal Review',
    CheckIn = 'Check-In',
    Setup = 'Setup'
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
    Settings = 'Settings'
}

export interface SidebarNavType {
    title: DashboardTitle | SubNavTitle;
    icon?: ReactNode
    href?: string
}

export interface SidebarNavItem extends SidebarNavType {
    subNav?: SidebarNavType[]
}