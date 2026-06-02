import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { PAGINATION_PARAMS } from '@/types/pagination';
import { AnnouncementFilterParams, AnnouncementsResponseType, IAnnouncement } from '@/types/response-types/announcement-response';
import { useQuery } from '@tanstack/react-query';
import QueryString from 'qs';

export const ANNOUNCEMENT_FILTER_PARAMS: Array<keyof AnnouncementFilterParams> = [
  ...PAGINATION_PARAMS,
  'order',
  'order_by',
  'q',
  'from',
  'to',
];

const getAnnouncements = async (params: AnnouncementFilterParams) => {
  const res = await api.get('/announcement?' + QueryString.stringify(params, { arrayFormat: 'repeat' }));
  return res.data as AnnouncementsResponseType;
};

export const useGetAnnouncements = (params: AnnouncementFilterParams) => {
  return useQuery({
    queryFn: () => getAnnouncements(params),
    queryKey: [QUERY_KEYS.GET_ANNOUNCEMENTS, params],
    refetchOnWindowFocus: false,
  });
};

const getAnnouncementById = async (id: string) => {
  const res = await api.get(`/announcement/${id}`);
  return res.data as IAnnouncement;
};

export const useGetAnnouncementById = (id: string) => {
  return useQuery({
    queryFn: () => getAnnouncementById(id),
    queryKey: [QUERY_KEYS.GET_ANNOUNCEMENT_BY_ID, id],
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
