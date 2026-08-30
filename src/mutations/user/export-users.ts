import { api, getApiErrorMessage } from '@/lib/api';
import { downloadFile } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

const exportUsers = async () => {
  const res = await api.get('/user/export');
  downloadFile(res.data, 'users.csv', 'text/csv;charset=utf-8;');
  toast.success(toastMsg.exportSuccess(ENTITY.users));
};

export const useExportUsers = () => {
  return useMutation({
    mutationFn: exportUsers,
    onError: (error) => {
      toast.error(getApiErrorMessage(error, toastMsg.exportError(ENTITY.users)));
    },
  });
};
