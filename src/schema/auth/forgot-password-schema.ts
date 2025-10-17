import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      error: 'Email is required',
    })
    .email('Invalid email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
