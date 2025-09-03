import { useToastContext } from '@/context/toast-context';
import { emailSmsApi } from '@/lib/emailSmsapi';
import { LeadSchemaType } from '@/schema/lead-schema';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
import { useMutation } from '@tanstack/react-query';

const sendEmail = async (payload: SendEmailSchemaType) => {
  const res = await emailSmsApi.post('/customemail', payload);
  return res.data;
};

export const useSendEmail = () => {
  const { success, error } = useToastContext();
  return useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      success('Email sent successfully');
    },
    onError: () => {
      error('Email sending failed');
    },
  });
};
