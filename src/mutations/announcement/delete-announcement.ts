import { QUERY_KEYS } from '@/constants/query-keys';
import toast from 'react-hot-toast';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ENTITY, toastMsg } from '@/constants/messages';
const deleteAnnouncement = async (id: number) => {
  const res = await api.delete(`/announcement/${id}`);
  return res.data;
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ANNOUNCEMENTS],
      });
      toast.success(toastMsg.deleteSuccess(ENTITY.announcement));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.announcement)));
    },
  });
};

const deleteAnnouncementBulk = async (ids: number[]) => {
  const res = await api.delete(`/announcement/bulk-delete`, { data: { ids } });
  return res.data;
};

export const useDeleteAnnouncementBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAnnouncementBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ANNOUNCEMENTS],
      });
      toast.success(toastMsg.deleteSuccess(ENTITY.announcements));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.deleteError(ENTITY.announcement)));
    },
  });
};
