import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { IAccounts } from '@/types/response-types/education-response';

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
  accounts: IAccounts;
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
