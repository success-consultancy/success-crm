import { z } from 'zod';

// Strong password requirements regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }).regex(passwordRegex, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export { resetPasswordSchema };
