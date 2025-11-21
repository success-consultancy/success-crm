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
  middleName: null | string;
  lastName: string;
  dob: null | string;
  email: string;
  phone: string;
  passport: null | number;
  issueDate: null | string;
  expiryDate: null | string;
  status: VisaStatusTypes;
  serviceType: string;
  sourceId: null | number;
  userId: null | number;
  createdAt: string;
  deletedAt: null | string;
  updatedAt: string;
  followUpDate: null;
  country: null | string;
  visa: null | string;
  visaExpiry: null | string;
  address: null | string;
  location: null | string;
  remarks: null | string;
  anzsco: null | string;
  updatedBy: null | number;
  files: string[];
  courseName: string;
  universityName: string;
  startDate: string;
  endDate: string;
  course_fees: IFeePlan[];
  user: {
    firstName: string;
    lastName: string;
  };
  source: {
    name: string;
  };
  university: {
    name: string;
  };
  course: {
    name: string;
  };
  UpdatedByUser?: {
    firstName: string;
    lastName: string;
    id: string;
  };
  version_type?: number;
}

export interface IFeePlan {
  planname: string;
  amount: string;
  duedate: string;
  invoicenumber: string;
  status: string;
  note: string;
  account?: IAccounts;
}

export interface IAccounts {
  planname: string;
  amount: string;
  duedate: string;
  invoicenumber: string;
  status: string;
  comission: string;
  discount: string;
  bonus: string;
  netamount: string;
}

export interface IVisaDetail {
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
  createdAt: string;
  updatedAt: string;
  deletedAt: any;

  visaStream: string;
  sponserName: string;
  sponserEmail: string;
  sponserPhone: string;
}
