import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { IAccounts } from '@/types/response-types/education-response';

// API payload as required by POST /account
export type CreateAccountPayload = {
  accountableId?: number;
  accountableType?: string;
  planname: string;
  amount: string;
  duedate: string; // ISO date string (YYYY-MM-DD)
  invoicenumber: string;
  status: string; // e.g. "Pending" | "Paid"
  note?: string;
  updatedBy?: number;
  gst?: string;
  discount?: string;
  bonus?: string;
  netamount?: string;
  comission?: string;
};

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
    },
  });
};

export const updateAccount = async (id: number, payload: CreateAccountPayload) => {
  const { data } = await api.put(`/account/${id}`, payload);
  return data as IAccounts;
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateAccountPayload }) => updateAccount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VISA_BY_ID] });
    },
  });
};
