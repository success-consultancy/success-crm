import { useToastContext } from '@/context/toast-context';
import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { FollowUpSchemaType } from '@/schema/follow-up-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
      success('Follow-up updated successfully.');
      // Invalidate follow-up list for this lead
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOW_UP, String(variables.leadId)] });
    },
    onError: () => {
      error('Failed to update follow-up');
    },
  });
};

export const useAddFollowUp = () => {
  const { success, error } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFollowUp,
    onSuccess: (_data, variables) => {
      success('Follow-up added successfully.');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOW_UP, String(variables.leadId)] });
    },
    onError: () => {
      error('Failed to add follow-up');
    },
  });
};

export const useDeleteFollowUp = (leadId: number | string) => {
  const { success, error } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFollowUp,
    onSuccess: () => {
      success('Follow-up deleted successfully.');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOW_UP, String(leadId)] });
    },
    onError: () => {
      error('Failed to delete follow-up');
    },
  });
};
