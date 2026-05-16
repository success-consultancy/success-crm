import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_ME } from '@/query/get-me';

export interface UpdateClockInFacePayload {
  faceId: string | null;
}

const updateClockInFace = async (payload: UpdateClockInFacePayload) => {
  const res = await api.patch('/user/me/clock-face-id', payload);
  return res.data;
};

export const useUpdateClockInFace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClockInFace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_ME] });
    },
  });
};
