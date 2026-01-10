import { IAccount } from '@/schema/account-schema';
import { IFeePlan } from '@/schema/education-schema';

export interface EducationsResponseType {
  count: number;
  rows: IEducation[];
}

export enum EducationStatusTypes {
  New = 'New',
  ChecklistSent = 'Checklist Sent',
  ApplicationReady = 'Application Ready',
  ApplicaitonSubmitted = 'Applicaiton Submitted',
  OfferReceived = 'Offer received',
  WaitingPayment = 'Waiting Payment',
  FeePaid = 'Fee Paid',
  Coereceived = 'Coe received',
  Withdrawn = 'Withdrawn',
  Discontinued = 'Discontinued',
}

export enum VisaStatusTypes {
  New = 'New Applicant',
  DocumentsCollected = 'Documents Collected',
  ReadyToSubmit = 'Ready To Submit',
  Submitted = 'Submitted',
  InfoRequested = 'Info Requested',
}

export interface IEducation {
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
  status: EducationStatusTypes;
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
