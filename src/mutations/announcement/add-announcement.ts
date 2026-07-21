import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { AnnouncementSchemaType } from '@/schema/announcement-schema';

const addAnnouncement = async (payload: AnnouncementSchemaType) => {
  const res = await api.post('/announcement', payload);
  return res.data;
};

export const useAddAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ANNOUNCEMENTS],
      });
    },
  });
};
