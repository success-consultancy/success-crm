export interface IAppointment {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  clientId?: number;
  ownerId: number;
  createdById: number;
  updatedById?: number;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  owner?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdBy?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  updatedBy?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  type?: 'online' | 'in-person' | 'phone';
  status?: 'scheduled' | 'completed' | 'cancelled';
}

export interface AppointmentsResponseType {
  count: number;
  rows: IAppointment[];
}

export interface AppointmentFilterParams {
  page?: string;
  limit?: string;
  date?: string;
  from?: string;
  to?: string;
  userId?: string;
  clientId?: string;
  view?: 'month' | 'week' | 'work-week' | 'day' | 'agenda';
}
