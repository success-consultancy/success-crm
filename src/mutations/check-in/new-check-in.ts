import { custom_api } from '@/lib/api';
import { NewCheckInSchemaType } from '@/schema/check-in-schema';
import { useMutation } from '@tanstack/react-query';

interface NewCheckInPayload extends Omit<NewCheckInSchemaType, 'serviceType'> {
  serviceType: string;
  sourceId?: number;
  status?: string;
  isConsent?: boolean;
}

const createNewCheckIn = async (payload: NewCheckInPayload) => {
  const res = await custom_api.post('/public/newcheckin', payload);
  return res.data;
};

export const useCreateNewCheckIn = () => {
  return useMutation({
    mutationFn: createNewCheckIn,
  });
};
