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
  userId: number;
  client?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  lead?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  createdByUser?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  updatedByUser?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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
