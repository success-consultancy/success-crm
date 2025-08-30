import { emailSmsApi } from '@/lib/emailSmsapi';
import { LeadSchemaType } from '@/schema/lead-schema';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
import { useMutation } from '@tanstack/react-query';

const sendEmail = async (payload: SendEmailSchemaType) => {
  const res = await emailSmsApi.post('/customemail', payload);
  return res.data;
};

export const useSendEmail = () => {
  return useMutation({
    mutationFn: sendEmail,
  });
};
