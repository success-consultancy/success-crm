import { z } from 'zod';

export const setPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters long')
      .max(64, 'Password must not exceed 64 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
      })
      .min(8, 'Confirm Password must be at least 8 characters long')
      .max(64, 'Confirm Password must not exceed 64 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;
