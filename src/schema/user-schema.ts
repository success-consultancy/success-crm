import { z } from 'zod';

const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  color: z.string().min(1, 'Color is required'),
  roleId: z.number().min(1, 'Role is required'),
  isActive: z.boolean().default(true),
  onlineAppointment: z.boolean().default(false),
  isPaid: z.boolean().default(false),
  dashboardManagement: z.boolean().default(false),
  agencyAgreementManagement: z.boolean().default(false),
  userManagement: z.boolean().default(false),
  universityManagement: z.boolean().default(false),
  courseManagement: z.boolean().default(false),
  sourceManagement: z.boolean().default(false),
  settingManagement: z.boolean().default(false),
});

export type UserFormType = z.infer<typeof userFormSchema>;

export default userFormSchema;
