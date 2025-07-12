import { z } from 'zod';

const resetPasswordSchema = z.object({
  password: z.string().min(1, { message: 'Password is required.' }),
});

export { resetPasswordSchema };
