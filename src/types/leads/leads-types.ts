export interface IUser {
  id: number;
  profileUrl: null | string;
  firstName: string;
  lastName: string;
  detail: null | string;
  clockInCode: null | string;
  email: string;
  phone: string;
  address: null | string;
  roleId: number;
  isActive: boolean;
  onlineAppointment: boolean;
  isPaid: boolean;
  paidAmount: null | string;
  appointmentNote: null | string;
  slotTime: number | null;
  dashboardManagement: boolean;
  agencyAgreementManagement: boolean;
  userManagement: boolean;
  universityManagement: boolean;
  courseManagement: boolean;
  sourceManagement: boolean;
  settingManagement: boolean;
  password: string;
  updatedBy: number;
  hideColumn: HideColumn | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface HideColumn {
  leadService?: Array<null | string>;
  educationService?: string[];
  insuranceService?: string[];
  skillAssessmentService?: string[];
  visaService?: string[];
}
