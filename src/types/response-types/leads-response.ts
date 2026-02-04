import { UploadedFileMeta } from '../common';

export interface LeadsResponseType {
  count: number;
  rows: ILead[];
}

export enum LeadStatusTypes {
  New = 'New',
  Negotiation = 'Negotiation',
  Converted = 'Converted',
  NotInterested = 'Not Interested',
  NotConverted = 'Not Converted',
  FollowUp = 'Follow Up',
}

export interface ILead {
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
  status: LeadStatusTypes;
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
  occupation: null | string;
  qualification: null | string;
  note: null | string;
  anzsco: null | string;
  updatedBy: null | number;
  files: UploadedFileMeta[];
  user: {
    firstName: string;
    lastName: string;
  };
  source: {
    name: string;
  };
  clientIds: {
    students: ILead[];
    visaApplicants: ILead[];
    skillAssessments: ILead[];
    insuranceApplicants: ILead[];
    tribunalReviews: ILead[];
  };
  UpdatedByUser?: {
    firstName: string;
    lastName: string;
    id: string;
  };
  version_type?: number;
}
