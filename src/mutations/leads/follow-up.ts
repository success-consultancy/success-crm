import { useToastContext } from '@/context/toast-context';
import { QUERY_KEYS } from '@/constants/query-keys';
import { api, getApiErrorMessage } from '@/lib/api';
import { FollowUpSchemaType } from '@/schema/follow-up-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ENTITY, toastMsg } from '@/constants/messages';

const addFollowUp = async (payload: FollowUpSchemaType) => {
  const res = await api.post('/follow-up', payload);
  return res.data;
};

const editFollowUp = async (payload: FollowUpSchemaType & { id: number }) => {
  const { id, ...body } = payload;
  const res = await api.put(`/follow-up/update/${id}`, body);
  return res.data;
};

const deleteFollowUp = async (params: { id: number }) => {
  const res = await api.delete(`/follow-up/delete/${params.id}`);
  return res.data;
};

export const useUpdateFollowUp = () => {
  const { success, error } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editFollowUp,
    onSuccess: (_data, variables) => {
      success(toastMsg.updateSuccess(ENTITY.followUp));
      // Invalidate follow-up list for this lead
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOW_UP, String(variables.followableId)] });
    },
    onError: (error: any) => {
      error(toastMsg.updateError(ENTITY.followUp));
    },
  });
};

export const useAddFollowUp = () => {
  const { success, error } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFollowUp,
    onSuccess: (_data, variables) => {
      success(toastMsg.addSuccess(ENTITY.followUp));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOW_UP, String(variables.followableId)] });
    },
    onError: (error: any) => {
      error(toastMsg.addError(ENTITY.followUp));
    },
  });
};

export const useDeleteFollowUp = (leadId: number | string) => {
  const { success, error } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFollowUp,
    onSuccess: () => {
      success(toastMsg.deleteSuccess(ENTITY.followUp));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOW_UP, String(leadId)] });
    },
    onError: (error: any) => {
      error(toastMsg.deleteError(ENTITY.followUp));
    },
  });
};
