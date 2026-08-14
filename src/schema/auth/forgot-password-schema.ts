import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
