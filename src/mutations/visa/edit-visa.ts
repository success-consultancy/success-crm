import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateServiceQueries } from '@/mutations/invalidate-service-queries';

import toast from 'react-hot-toast';
import { newVisaServiceSchema, NewVisaServiceType } from '@/schema/visa-service/new-visa.schema';

import { ENTITY, toastMsg } from '@/constants/messages';
const REQUIRED_FIELDS = new Set(['firstName', 'lastName', 'email', 'phone']);

const editVisa = async (payload: NewVisaServiceType & { id: number }) => {
  const { id, ...filteredPayload } = payload;
  const normalizedPayload = Object.fromEntries(
    Object.entries(filteredPayload).map(([key, value]) => [
      key,
      value === '' && !REQUIRED_FIELDS.has(key) ? null : value,
    ]),
  );
  const res = await api.put(`/visaApplicant/${id}`, normalizedPayload);
  return res.data;
};

export const useEditVisa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editVisa,
    onSuccess: () => {
      invalidateServiceQueries(queryClient, 'visa');
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, toastMsg.updateError(ENTITY.visa)));
    },
  });
};
