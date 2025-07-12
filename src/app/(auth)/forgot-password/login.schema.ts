import { CHARACTER_LIMITS } from '@/config';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email('Email address is not valid.')
    .max(CHARACTER_LIMITS.EMAIL, { message: `Email can not exceed ${CHARACTER_LIMITS.EMAIL} characters.` }),
});

export { forgotPasswordSchema };
