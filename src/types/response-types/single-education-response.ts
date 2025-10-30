export interface IEducationSingleResponse {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  dob: Date;
  passport: number;
  issueDate: Date;
  expiryDate: Date;
  email: string;
  phone: string;
  country: string;
  status: string;
  location: string;
  statusDate: Date;
  startDate: Date;
  endDate: Date;
  feeDueDate: null;
  userId: number;
  assignedDate: Date;
  courseId: number;
  universityId: number;
  sourceId: number;
  feesPaid: null;
  feesPaidDate: null;
  feesDueAmount: null;
  commissionAmount: null;
  invoiceNo: null;
  invoiceDate: null;
  invoiceStatus: null;
  remarks: string;
  files: null;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  course_fees: IFeePlanSingle[];
  source: Source;
  user: User;
}

export interface IFeePlanSingle {
  id: number;
  studentId: number;
  planname: string;
  amount: string;
  duedate: Date;
  invoicenumber: string;
  status: string;
  note: string;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  account: IAccountsSingle;
}

export interface IAccountsSingle {
  id: number;
  courseFeeId: number;
  planname: string;
  amount: string;
  duedate: Date;
  invoicenumber: string;
  status: string;
  comission: string;
  discount: string;
  bonus: string;
  netamount: string;
  updatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface Source {
  name: string;
}

export interface User {
  firstName: string;
  lastName: string;
}
