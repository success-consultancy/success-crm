export interface ITribunalReviewResponseType {
  count: number;
  rows: ITribunalReview[];
}

export enum TribunalStatusTypes {
  NewTribunal = 'New Tribunal',
  CollectingDocs = 'Collecting Docs',
  ReadyToSubmit = 'Ready to Submit',
  Submitted = 'Submitted',
  InfoReceived = 'Info Received',
  Approved = 'Approved',
  FeePaid = 'Fee Paid',
  Withdrawn = 'Withdrawn',
  Refused = 'Refused',
  Discontinued = 'Discontinued',
  FollowUp = 'Follow Up',
}
export interface ITribunalReview {
  id: number
  firstName: string
  middleName: string
  lastName: string
  dob: string
  email: string
  phone: string
  country: string
  address: string
  passport: string
  status: string
  passportIssueDate: string
  passportExpiryDate: string
  location: string
  currentVisa: string
  visaExpiry: string
  dueDate: string
  proposedVisa: string
  visaStream: string
  anzsco: string
  occupation: string
  sponsorName: string
  sponsorEmail: string
  sponsorPhone: string
  sbsStatus: string
  sbsSubmissionDate: string
  sbsDecisionDate: string
  nominationStatus: string
  nominationSubmittedDate: string
  nominationDecisionDate: string
  visaStatus: string
  visaSubmittedDate: string
  visaDecisionDate: string
  tribunalStatus: string
  tribunalSubmittedDate: string
  hearingDate: string
  tribunalDecisionDate: string
  sourceId: number
  userId: number
  assignedDate: string
  updatedBy: number
  files: any
  createdAt: string
  updatedAt: string
  deletedAt: any
  user: User
  source: Source
  UpdatedByUser: UpdatedByUser
  remarks: string
  accounts: Account[]
}

export interface User {
  id: number
  profileUrl: string
  firstName: string
  lastName: string
  detail: string
  clockInCode: string
  email: string
  phone: string
  address: string
  roleId: number
  isActive: boolean
  onlineAppointment: boolean
  isPaid: boolean
  paidAmount: string
  appointmentNote: string
  slotTime: number
  dashboardManagement: boolean
  agencyAgreementManagement: boolean
  userManagement: boolean
  universityManagement: boolean
  courseManagement: boolean
  sourceManagement: boolean
  settingManagement: boolean
  updatedBy: number
  branchId: number
  hideColumn: HideColumn
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface HideColumn {
  leadService: string[]
  educationService: string[]
}

export interface Source {
  id: number
  name: string
  description: string
  updatedBy: any
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface UpdatedByUser {
  id: number
  profileUrl: string
  firstName: string
  lastName: string
  detail: string
  clockInCode: string
  email: string
  phone: string
  address: string
  roleId: number
  isActive: boolean
  onlineAppointment: boolean
  isPaid: boolean
  paidAmount: string
  appointmentNote: any
  slotTime: any
  dashboardManagement: boolean
  agencyAgreementManagement: boolean
  userManagement: boolean
  universityManagement: boolean
  courseManagement: boolean
  sourceManagement: boolean
  settingManagement: boolean
  updatedBy: number
  branchId: any
  hideColumn: HideColumn2
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface HideColumn2 {
  leadService: string[]
  educationService: string[]
  insuranceService: string[]
  skillAssessmentService: any[]
}

export interface Account {
  id: number
  accountableId: number
  accountableType: string
  planname: string
  amount: string
  duedate: string
  invoicenumber: string
  status: string
  comission: any
  discount: string
  bonus: any
  netamount: string
  gst: string
  updatedBy: any
  feeNote: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}
