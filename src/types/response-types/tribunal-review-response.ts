import { IAccount } from '@/schema/account-schema';

export interface ITribunalReviewResponseType {
  count: number;
  rows: ITribunalReview[];
}

export enum TribunalStatusTypes {
  NewTribunal = "New Tribunal",
  CollectingDocs = "Collecting Docs",
  ReadyToSubmit = "Ready to Submit",
  Submitted = "Submitted",
  InfoRequested = "Info Requested",
  Remitted = "Remitted",
  Withdrawn = "Withdrawn",
  Refused = "Refused",
  Discontinued = "Discontinued",
  MinisterialApproved = "Ministerial Approved",
  MinisterialIntervention = "Ministerial Intervention",
  MinisterialRefused = "Ministerial Refused",
  Other = "Other",
  FollowUp = "Follow-up",
}

export interface ITribunalReview {
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
  sponsorName: string;
  sponsorEmail: string;
  sponsorPhone: string;
  sbsStatus: string;
  sbsSubmissionDate: string;
  sbsDecisionDate: string;
  nominationStatus: string;
  nominationSubmittedDate: string;
  nominationDecisionDate: string;
  visaStatus: string;
  visaSubmittedDate: string;
  visaDecisionDate: string;
  tribunalStatus: string;
  tribunalSubmittedDate: string;
  hearingDate: string;
  tribunalDecisionDate: string;
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
