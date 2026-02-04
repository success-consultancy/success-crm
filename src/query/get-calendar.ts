import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { IPagination, PAGINATION_PARAMS } from '@/types/pagination';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';
import { IAppointment } from '@/types/response-types/appointment-response';
import { format, parseISO } from 'date-fns';

export interface CalendarFilterParams extends IPagination {
    from?: string;
    to?: string;
    userId?: string;
    view?: string;
}

export const CALENDAR_FILTER_PARAMS: Array<keyof CalendarFilterParams> = [
    ...PAGINATION_PARAMS,
    'from',
    'to',
    'userId',
    'view',
];

export interface ICalendarEvent {
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
    type?: string;
    status?: string;
}

export interface ApiCalendarEvent {
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

interface ApiCalendarResponse {
    count?: number;
    rows?: ApiCalendarEvent[];
}

export type CalendarResponseType = {
    count?: number;
    rows?: ICalendarEvent[];
};

const transformCalendarEvent = (event: ApiCalendarEvent): ICalendarEvent => {
    // Extract date from start field (format: yyyy-MM-dd)
    const date = format(parseISO(event.start), 'yyyy-MM-dd');
    
    return {
        id: event.id,
        title: event.title,
        description: event.description,
        startTime: event.start,
        endTime: event.end,
        date: date,
        clientId: event.leadId,
        ownerId: event.userId,
        createdById: event.createdBy,
        updatedById: event.updatedBy,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        type: undefined,
    };
};

const getCalendar = async (params?: CalendarFilterParams) => {
    const res = await api.get('/calendar?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
    const data = res.data;
    
    // Handle array response (direct array of events)
    if (Array.isArray(data)) {
        if (data.length > 0 && 'start' in data[0]) {
            return {
                count: data.length,
                rows: (data as ApiCalendarEvent[]).map(transformCalendarEvent),
            } as CalendarResponseType;
        }
        // Already in correct format
        return {
            count: data.length,
            rows: data as ICalendarEvent[],
        } as CalendarResponseType;
    }
    
    // Handle object response with rows property
    const responseData = data as ApiCalendarResponse | CalendarResponseType;
    
    // Check if data needs transformation (has 'start' field instead of 'startTime')
    if (responseData.rows && responseData.rows.length > 0 && 'start' in responseData.rows[0]) {
        return {
            count: responseData.count || responseData.rows.length,
            rows: (responseData.rows as ApiCalendarEvent[]).map(transformCalendarEvent),
        } as CalendarResponseType;
    }
    
    return responseData as CalendarResponseType;
};

export const useGetCalendar = (params?: CalendarFilterParams) => {
    return useQuery({
        queryFn: () => getCalendar(params),
        queryKey: [QUERY_KEYS.GET_CALENDAR, params],
        refetchOnWindowFocus: false,
    });
};
