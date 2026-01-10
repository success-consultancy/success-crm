import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { CreateAccountPayload, IAccount } from '@/schema/account-schema';

export const createAccount = async (payload: CreateAccountPayload) => {
  const { data } = await api.post('/account', payload);
  return data;
};

export const useAddAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VISA_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TRIBUNAL_REVIEW_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENT_BY_ID] });
    },
  });
};

export const updateAccount = async (id: number, payload: CreateAccountPayload) => {
  const { data } = await api.put(`/account/${id}`, payload);
  return data as IAccount;
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateAccountPayload }) => updateAccount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VISA_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TRIBUNAL_REVIEW_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SKILL_ASSESSMENT_BY_ID] });
    },
  });
};
