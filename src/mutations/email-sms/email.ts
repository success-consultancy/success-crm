import { useToastContext } from '@/context/toast-context';
import { emailSmsApi } from '@/lib/emailSmsapi';
import { LeadSchemaType } from '@/schema/lead-schema';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
import { useMutation } from '@tanstack/react-query';
import { ENTITY, toastMsg } from '@/constants/messages';

const sendEmail = async (payload: SendEmailSchemaType) => {
  const res = await emailSmsApi.post('/customemail', payload);
  return res.data;
};

export const useSendEmail = () => {
  const { success, error } = useToastContext();
  return useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      success(toastMsg.sendSuccess(ENTITY.email));
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || err?.message || toastMsg.sendError(ENTITY.email));
    },
  });
};
