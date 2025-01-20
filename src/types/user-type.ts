export interface ILoginResponse {
    token: string;
    user: IUser;
    expiry: number;
}

interface IUser {
    id: number;
    profileUrl: null;
    firstName: string;
    lastName: string;
    detail: null;
    clockInCode: string;
    email: string;
    phone: string;
    address: string;
    roleId: number;
    isActive: boolean;
    onlineAppointment: boolean;
    isPaid: boolean;
    paidAmount: null;
    appointmentNote: null;
    slotTime: null;
    dashboardManagement: boolean;
    agencyAgreementManagement: boolean;
    userManagement: boolean;
    universityManagement: boolean;
    courseManagement: boolean;
    sourceManagement: boolean;
    settingManagement: boolean;
    password: string;
    updatedBy: number;
    hideColumn: HideColumn;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
}

interface HideColumn {
    leadService: any[];
    educationService: any[];
    insuranceService: string[];
}