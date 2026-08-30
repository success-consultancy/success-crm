import { z } from 'zod';

const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').refine((v) => v.trim().length > 0, { message: 'First name cannot be blank' }),
  lastName: z.string().min(1, 'Last name is required').refine((v) => v.trim().length > 0, { message: 'Last name cannot be blank' }),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().optional(),
  address: z.string().min(1, 'Address is required').refine((v) => v.trim().length > 0, { message: 'Address cannot be blank' }),
  color: z.string().min(1, 'Color is required'),
  roleId: z.number().min(1, 'Role is required'),
  // Select inputs hand back strings; coerce to the shape the API payload expects.
  branchId: z.coerce.string().min(1, 'Branch is required'),
  isActive: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((v) => v === true || v === 'true')
    .default(true),
  onlineAppointment: z.boolean().default(false),
  isPaid: z.boolean().default(false),
});

export type UserFormType = z.infer<typeof userFormSchema>;

export default userFormSchema;
