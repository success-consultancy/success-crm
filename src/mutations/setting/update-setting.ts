import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_SETTING, ISetting } from '@/query/get-setting';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

export type UpdateSettingPayload = Partial<Omit<ISetting, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>> & {
  id: number;
};

const updateSetting = async ({ id, ...payload }: UpdateSettingPayload) => {
  const res = await api.put(`/setting/${id}`, payload);
  return res.data as ISetting;
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_SETTING] });
    },
    onError: (error: any) => {
      toast.error(toastMsg.updateError(ENTITY.setting));
    },
  });
};
