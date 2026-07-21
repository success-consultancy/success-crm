import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
      toast('Success!', {
        description: 'Announcement has been deleted',
      });
    },
    onError: (error: any) => {
      toast('Error!', {
        description: getApiErrorMessage(error),
      });
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
      toast('Success!', {
        description: 'Announcements have been deleted',
      });
    },
    onError: (error: any) => {
      toast('Error!', {
        description: getApiErrorMessage(error),
      });
    },
  });
};
