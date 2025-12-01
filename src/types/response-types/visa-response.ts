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
