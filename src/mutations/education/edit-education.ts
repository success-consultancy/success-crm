import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateServiceQueries } from '@/mutations/invalidate-service-queries';
import { EditEducationServiceType } from '@/schema/education-service/edit-student.schema';
import toast from 'react-hot-toast';

import { ENTITY, toastMsg } from '@/constants/messages';
const REQUIRED_FIELDS = new Set(['firstName', 'lastName', 'email', 'phone']);

const editEducation = async (payload: EditEducationServiceType & { id: number }) => {
  const { id, courseFee, ...filteredPayload } = payload;
  const normalizedPayload = Object.fromEntries(
    Object.entries(filteredPayload).map(([key, value]) => [
      key,
      value === '' && !REQUIRED_FIELDS.has(key) ? null : value,
    ]),
  );
  const res = await api.put(`/student/${id}`, normalizedPayload);
  return res.data;
};

export const useEditEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editEducation,
    onSuccess: () => {
      invalidateServiceQueries(queryClient, 'education');
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.updateError(ENTITY.education)));
    },
  });
};
