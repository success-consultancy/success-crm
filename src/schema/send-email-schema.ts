import { z } from 'zod';

const sendEmailSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Body is required'),
  users: z
    .array(
      z.object({
        email: z.string().email('Invalid email address'),
      }),
    )
    .min(1, 'At least one user is required'),
});

export type SendEmailSchemaType = z.infer<typeof sendEmailSchema>;

export default sendEmailSchema;
