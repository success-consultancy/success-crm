import { Icon } from "iconsax-react";
import { LucideIcon } from "lucide-react";

export enum DashboardTitle {
    Dashboard = 'Dashboard',
    Calendar = 'Calendar',
    Services = 'Services',
    Todo = 'To Do',
    Administrative = 'Administrative',
    LegalAndAgreements = 'Legal & Agreements',
    UpdatesAndAnnouncements = 'Announcements',

}

export enum SubNavTitle {
    EducationService = 'Education Service',
    VisaService = 'Visa Service',
    SkillAssessmentService = 'Skill Assessment Service',
    InsuranceService = 'Insurance Service',
    Users = 'Users',
    Employees = 'Employees',
    Occupation = 'Occupation',
    Visa = 'Visa',
    University = 'University',
    Course = 'Course',
    Source = 'Source',
    Appointment = 'Appointment',
    CheckIn = 'Check-In',
    Leads = 'Leads',
    FaceUpload = 'Face Upload',
    FiscalReport = 'Fiscal Report',
    AgencyAgreement = 'Agency Agreement',
    TribunalReview = 'Tribunal Review'
}

export interface SidebarNavType {
    title: DashboardTitle | SubNavTitle;
    icon: LucideIcon | Icon
    href?: string
}

export interface SidebarNavItem extends SidebarNavType {
    subNav?: SidebarNavType[]
}