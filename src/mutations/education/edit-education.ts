import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { EditEducationServiceType } from '@/schema/education-service/edit-student.schema';
import {toast} from 'sonner';

const editEducation = async (payload: EditEducationServiceType & { id: number }) => {
  const { id, courseFee, ...filteredPayload } = payload;
  const res = await api.put(`/student/${id}`, filteredPayload);
  return res.data;
};

export const useEditEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === QUERY_KEYS.GET_EDUCATIONS || query.queryKey[0] === QUERY_KEYS.GET_EDUCATION_BY_ID,
      });
    },
    onError: () => {
      toast("Error!", {
        description: "Something went wrong",
      });
    },
  });
};
