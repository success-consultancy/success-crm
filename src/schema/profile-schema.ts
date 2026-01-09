import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.string().optional(),
  email: z.string({ message: 'Email is required.' }).email({ message: 'Invalid email address' }),
  phone: z
    .string({ message: 'Phone number is required.' })
    .min(10, { message: 'Phone number must be at least 10 characters' }),
  firstName: z.string({ message: 'First name is required.' }).min(1, { message: 'First name is required' }),
  middleName: z.string().optional(),
  lastName: z.string({ message: 'Last name is required.' }).min(1, { message: 'Last name is required' }),
  dob: z.string().optional(),
  role: z.string().optional(),
  detail: z.string().optional(),
  address: z.string().optional(),
  qualification: z.string().optional(),
  occupation: z.string().optional(),
  anzsco: z.string().optional(),
  profileUrl: z.string().optional(),
});

export const PasswordChangeSchema = z.object({
  newPassword: z.string().min(1, { message: 'New password is required' }),
  confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
export type PasswordChangeSchemaType = z.infer<typeof PasswordChangeSchema>;

export default { ProfileSchema, PasswordChangeSchema };
