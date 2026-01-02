export interface ISkillAssessmentResponseType {
  count: number;
  rows: ISkillAssessment[];
}

export enum SkillAssessmentStatusTypes {
  Applied = 'Applied',
  CollectingDocs = 'Collecting Docs',
  Approved = 'Approved',
  Discontinued = 'Discontinued',
  FollowUp = 'Follow Up',
}

export interface ISkillAssessment {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  files: any;
  passport: number | null;
  issueDate: string | null;
  expiryDate: string | null;
  email: string;
  phone: string;
  dob: string | null;
  occupation: string | null;
  anzsco: string | null;
  location: string | null;
  skillAssessmentBody: string | null;
  otherSkillAssessmentBody: string | null;
  currentVisa: string | null;
  visaExpiry: string | null;
  csaStatus: string | null;
  country: string | null;
  status: string | null;
  statusDate: string | null;
  submittedDate: string | null;
  decisionDate: string | null;
  remarks: string | null;
  sourceId: number | null;
  invoiceNumber: string | null;
  payment: string | null;
  paymentStatus: string | null;
  requestedDate: string | null;
  dueDate: string | null;
  userId: number | null;
  assignedDate: string | null;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
