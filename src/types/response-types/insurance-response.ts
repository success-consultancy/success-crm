import { IAccount } from '@/schema/account-schema';

export interface IInsuranceResponseType {
  count: number;
  rows: IInsurance[];
}

export enum InsuranceStatusTypes {
  Completed = 'Completed',
  Discontinued = 'Discontinued',
  Refunded = 'Refunded',
  New = 'New',
  Processing = 'Processing',
}
export interface IInsurance {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  passport: string;
  status: string;
  startDate: string;
  expiryDate: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  location: string;
  currentVisa: string;
  visaExpiry: string;
  dueDate: string;
  proposedVisa: string;
  visaStream: string;
  anzsco: string;
  occupation: string;
  visaStatus: string;
  visaSubmittedDate: string;
  visaDecisionDate: string;
  sourceId: number;
  userId: number;
  assignedDate: string;
  updatedBy: number;
  files: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  user: User;
  source: Source;
  UpdatedByUser: UpdatedByUser;
  remarks: string;
  accounts: IAccount[];
  insuranceType: string;
  insuranceProvider: string;
  policyNumber: string;
}

export interface User {
  id: number;
  profileUrl: string;
  firstName: string;
  lastName: string;
  detail: string;
  clockInCode: string;
  email: string;
  phone: string;
  address: string;
  roleId: number;
  isActive: boolean;
  onlineAppointment: boolean;
  isPaid: boolean;
  paidAmount: string;
  appointmentNote: string;
  slotTime: number;
  dashboardManagement: boolean;
  agencyAgreementManagement: boolean;
  userManagement: boolean;
  universityManagement: boolean;
  courseManagement: boolean;
  sourceManagement: boolean;
  settingManagement: boolean;
  updatedBy: number;
  branchId: number;
  hideColumn: HideColumn;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

export interface HideColumn {
  leadService: string[];
  educationService: string[];
}

export interface Source {
  id: number;
  name: string;
  description: string;
  updatedBy: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

export interface UpdatedByUser {
  id: number;
  profileUrl: string;
  firstName: string;
  lastName: string;
  detail: string;
  clockInCode: string;
  email: string;
  phone: string;
  address: string;
  roleId: number;
  isActive: boolean;
  onlineAppointment: boolean;
  isPaid: boolean;
  paidAmount: string;
  appointmentNote: any;
  slotTime: any;
  dashboardManagement: boolean;
  agencyAgreementManagement: boolean;
  userManagement: boolean;
  universityManagement: boolean;
  courseManagement: boolean;
  sourceManagement: boolean;
  settingManagement: boolean;
  updatedBy: number;
  branchId: any;
  hideColumn: HideColumn2;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

export interface HideColumn2 {
  leadService: string[];
  educationService: string[];
  insuranceService: string[];
  skillAssessmentService: any[];
}
