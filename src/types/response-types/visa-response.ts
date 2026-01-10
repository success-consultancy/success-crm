import { IAccount } from '@/schema/account-schema';

export interface IVisaResponseType {
  count: number;
  rows: IVisa[];
}

export enum VisaStatusTypes {
  NewApplicant = 'New Applicant',
  CollectingDocs = 'Collecting Docs',
  ReadyToSubmit = 'Ready to Submit',
  Submitted = 'Submitted',
  InfoRequested = 'Info Requested',
  Approved = 'Approved',
  FeePaid = 'Fee Paid',
  Withdrawn = 'Withdrawn',
  Refused = 'Refused',
  Discontinued = 'Discontinued',
  FollowUp = 'Follow Up',
}

export interface IVisa {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  files: any;
  passport: number;
  issueDate: string;
  expiryDate: string;
  email: string;
  phone: string;
  dob: string;
  currentVisa: string;
  occupation: string;
  anzsco: string;
  location: string;
  proposedVisa: string;
  visaSubmitted: string;
  visaGranted: string;
  visaExpiry: string;
  requestedDate: string;
  dueDate: string;
  country: string;
  state: string;
  status: string;
  statusDate: string;
  csaStatus: string;
  address: string;
  source: {
    id: number;
    name: string;
  };
  sourceId: number;
  invoiceNumber: string;
  payment: string;
  paymentStatus: string;
  remarks: string;
  nominationLodged: string;
  nominationDecision: string;
  nominationStatus: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  userId: number;
  assignedDate: string;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;

  // aded fields
  sponsorPhone: string;
  sponsorEmail: string;
  sponsorName: string;
  sbsTasStatus: string;
  visaStream: string;
  startDate: string;
  endDate: string;
}

export interface IVisaDetail {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  startDate: string;
  endDate: string;
  files: any;
  passport: any;
  issueDate: string;
  expiryDate: string;
  email: string;
  phone: string;
  dob: string;
  currentVisa: string;
  occupation: string;
  anzsco: string;
  location: string;
  proposedVisa: string;
  visaSubmitted: string;
  visaGranted: string;
  visaExpiry: string;
  requestedDate: string;
  dueDate: string;
  country: string;
  state: string;
  status: string;
  statusDate: string;
  csaStatus: string;
  sourceId: number;
  invoiceNumber: string;
  payment: string;
  paymentStatus: string;
  remarks: string;
  nominationLodged: string;
  nominationDecision: string;
  nominationStatus: string;
  userId: number;
  assignedDate: string;
  updatedBy: number;
  visaStream: string;
  sponsorName: string;
  sponsorEmail: string;
  sponsorPhone: string;
  sbsStatus: string;
  sbsSubmissionDate: string;
  sbsDecisionDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  user: User;
  source: Source;
  UpdatedByUser: UpdatedByUser;
  accounts: IAccounts[];
  visaNote: string;
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
  hideColumn: HideColumn;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

export interface HideColumn {
  leadService: string[];
  educationService: string[];
  insuranceService: string[];
  skillAssessmentService: string[];
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
  skillAssessmentService: string[];
}
