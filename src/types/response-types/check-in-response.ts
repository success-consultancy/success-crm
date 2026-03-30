export interface ICheckIn {
  id: number;
  leadId: number;
  timerStart: string;
  timerStop: string | null;
  waitTime: string | null;
  isActive: boolean;
  isNew: boolean;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  lead: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string | null;
  };
}

export interface CheckInResponseType {
  count: number;
  rows: ICheckIn[];
}
