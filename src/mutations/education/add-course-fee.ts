import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { IAccounts } from '@/types/response-types/education-response';
import { CreateAccountPayload } from '../visa/add-account';

// API payload as required by POST /course-fee
export type CreateCourseFeePayload = {
  studentId: number;
  planname: string;
  amount: number;
  duedate: string; // ISO date string (YYYY-MM-DD)
  invoicenumber: string;
  status: string; // e.g. "Pending" | "Paid"
  note: string;
  updatedBy: number;
  accounts: CreateAccountPayload;
};

export const createCourseFee = async (payload: CreateCourseFeePayload) => {
  const { data } = await api.post('/course-fee', payload);
  return data;
};

export const useAddCourseFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourseFee,
    onSuccess: () => {
      // refresh education details (contains feeplan)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_EDUCATION_BY_ID] });
    },
  });
};

export const updateCourseFee = async (id: number, payload: CreateCourseFeePayload) => {
  const { data } = await api.put(`/course-fee/${id}`, payload);
  return data;
};

export const useUpdateCourseFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateCourseFeePayload }) => updateCourseFee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_EDUCATION_BY_ID] });
    },
  });
};
