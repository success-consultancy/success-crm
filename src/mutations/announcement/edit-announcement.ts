import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { UpdateAnnouncementSchemaType } from '@/schema/announcement-schema';

const editAnnouncement = async (payload: UpdateAnnouncementSchemaType) => {
  const { id, ...apiPayload } = payload;
  const res = await api.put(`/announcement/${id}`, apiPayload);
  return res.data;
};

export const useEditAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ANNOUNCEMENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ANNOUNCEMENT_BY_ID],
      });
    },
  });
};
