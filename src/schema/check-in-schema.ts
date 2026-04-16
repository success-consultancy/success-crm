import { z } from 'zod';

export const newCheckInSchema = z.object({
  firstName: z.string({ message: 'First name is required' }).min(1, { message: 'First name is required' }),
  lastName: z.string({ message: 'Last name is required' }).min(1, { message: 'Last name is required' }),
  phone: z
    .string({ message: 'Phone number is required' })
    .min(1, { message: 'Phone number is required' })
    .refine(
      (val) => {
        const digits = val.replace(/[\s\-\+\(\)]/g, '');
        return digits.length >= 9;
      },
      { message: 'Phone number must be at least 9 digits' },
    ),
  email: z.string({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
  country: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  serviceType: z.array(z.string()).min(1, { message: 'Select at least one service' }),
});

export type NewCheckInSchemaType = z.infer<typeof newCheckInSchema>;

export const returningCheckInSchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
}).refine(
  (data) => (data.phone && data.phone.length >= 10) || (data.email && data.email.length > 0),
  { message: 'Enter a valid phone number or email', path: ['phone'] },
);

export type ReturningCheckInSchemaType = z.infer<typeof returningCheckInSchema>;
