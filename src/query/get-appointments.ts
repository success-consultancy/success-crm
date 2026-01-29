import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { IPagination, PAGINATION_PARAMS } from '@/types/pagination';
import { AppointmentFilterParams, AppointmentsResponseType, IAppointment } from '@/types/response-types/appointment-response';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';
import { format, parseISO } from 'date-fns';

export const APPOINTMENT_FILTER_PARAMS: Array<keyof AppointmentFilterParams> = [
  ...PAGINATION_PARAMS,
  'date',
  'from',
  'to',
  'userId',
  'clientId',
  'view',
];

interface ApiAppointment {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean | null;
  timezone: string;
  leadId?: number;
  userId: number;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ApiAppointmentsResponse {
  count?: number;
  rows?: ApiAppointment[];
}

const transformAppointment = (apt: ApiAppointment): IAppointment => {
  // Extract date from start field (format: yyyy-MM-dd)
  const date = format(parseISO(apt.start), 'yyyy-MM-dd');
  
  return {
    id: apt.id,
    title: apt.title,
    description: apt.description,
    startTime: apt.start,
    endTime: apt.end,
    date: date,
    clientId: apt.leadId,
    ownerId: apt.userId,
    createdById: apt.createdBy,
    updatedById: apt.updatedBy,
    createdAt: apt.createdAt,
    updatedAt: apt.updatedAt,
  };
};

const getAppointments = async (params: AppointmentFilterParams) => {
  const res = await api.get('/appointment?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
  const data = res.data;
  
  // Handle array response (direct array of appointments)
  if (Array.isArray(data)) {
    if (data.length > 0 && 'start' in data[0]) {
      return {
        count: data.length,
        rows: (data as ApiAppointment[]).map(transformAppointment),
      } as AppointmentsResponseType;
    }
    // Already in correct format
    return {
      count: data.length,
      rows: data as IAppointment[],
    } as AppointmentsResponseType;
  }
  
  // Handle object response with rows property
  const responseData = data as ApiAppointmentsResponse | AppointmentsResponseType;
  
  // Check if data needs transformation (has 'start' field instead of 'startTime')
  if (responseData.rows && responseData.rows.length > 0 && 'start' in responseData.rows[0]) {
    return {
      count: responseData.count || responseData.rows.length,
      rows: (responseData.rows as ApiAppointment[]).map(transformAppointment),
    } as AppointmentsResponseType;
  }
  
  return responseData as AppointmentsResponseType;
};

export const useGetAppointments = (params: AppointmentFilterParams) => {
  return useQuery({
    queryFn: () => getAppointments(params),
    queryKey: [QUERY_KEYS.GET_APPOINTMENTS, params],
    refetchOnWindowFocus: false,
  });
};

const getAppointmentById = async (id: string) => {
  const res = await api.get(`/appointment/${id}`);
  const data = res.data as ApiAppointment | IAppointment;
  
  // Check if data needs transformation (has 'start' field instead of 'startTime')
  if ('start' in data) {
    return transformAppointment(data as ApiAppointment);
  }
  
  return data as IAppointment;
};

export const useGetAppointmentById = (id: string) => {
  return useQuery({
    queryFn: () => getAppointmentById(id),
    queryKey: [QUERY_KEYS.GET_APPOINTMENT_BY_ID, id],
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
