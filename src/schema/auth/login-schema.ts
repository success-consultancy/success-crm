import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({
      error: 'Email is required',
    })
    .email('Email address is address'),
  password: z
    .string({
      error: 'Password is required',
    })
    .min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
