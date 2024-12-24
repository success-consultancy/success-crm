import { DashboardTitle, SidebarNavItem, SubNavTitle } from "@/types/sidebar-type";
import { ROUTES } from "./routes";


import { Award, Briefcase, Calendar, CalendarCheck, ClipboardMinus, ClockArrowUp, FileCheck, FileCog, Gavel, GraduationCap, LayoutDashboard, ListCheck, Map, Megaphone, Scale, ScanFace, ShieldCheck, UserPlus } from "lucide-react";

export const NAVIGATION_LIST: SidebarNavItem[] = [
    {
        title: DashboardTitle.Dashboard,
        icon: LayoutDashboard,
        href: ROUTES.DASHBOARD,
    },
    {
        title: DashboardTitle.Calendar,
        icon: Calendar,
        href: ROUTES.CALENDAR
    },
    {
        title: DashboardTitle.Todo,
        icon: ListCheck,
        href: ROUTES.TODO
    },
    {
        title: DashboardTitle.Services,
        icon: Briefcase,
        subNav: [
            { title: SubNavTitle.Appointment, icon: CalendarCheck, href: ROUTES.APPOINTMENT },
            { title: SubNavTitle.Leads, icon: UserPlus, href: ROUTES.LEADS },
            { title: SubNavTitle.CheckIn, icon: ClockArrowUp, href: ROUTES.CHECK_IN },
            { title: SubNavTitle.EducationService, icon: GraduationCap, href: ROUTES.EDUCATION },
            { title: SubNavTitle.InsuranceService, icon: ShieldCheck, href: ROUTES.INSURANCE },
            { title: SubNavTitle.SkillAssessmentService, icon: Award, href: ROUTES.SKILL_ASSESSMENT },
            { title: SubNavTitle.VisaService, icon: Map, href: ROUTES.VISA },
        ]
    },

    {
        title: SubNavTitle.FaceUpload,
        icon: ScanFace,
        href: ROUTES.FACE_UPLOAD
    },
    {
        title: SubNavTitle.FiscalReport,
        icon: ClipboardMinus,
        href: ROUTES.FISCAL_REPORT
    },
    {
        title: DashboardTitle.LegalAndAgreements,
        icon: Scale,
        subNav: [{
            title: SubNavTitle.TribunalReview,
            icon: Gavel,
            href: ROUTES.TRIBUNAL_REVIEW
        },
        {
            title: SubNavTitle.AgencyAgreement,
            icon: FileCheck,
            href: ROUTES.AGENCY_AGREEMENT
        },]
    },
    {
        title: DashboardTitle.UpdatesAndAnnouncements,
        icon: Megaphone,
        href: ROUTES.UPDATES_AND_ANNOUNCEMENTS
    },


];