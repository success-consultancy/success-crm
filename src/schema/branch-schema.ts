import { z } from 'zod';

export const branchSchema = z.object({
  name: z.string({ message: 'Branch name is required.' }).trim().min(1, { message: 'Branch name is required.' }),
  country: z.string({ message: 'Country is required.' }).trim().min(1, { message: 'Country is required.' }),
  city: z.string({ message: 'City is required.' }).trim().min(1, { message: 'City is required.' }),
  timezone: z.string({ message: 'Timezone is required.' }).min(1, { message: 'Timezone is required.' }),
  phone: z.string().trim().optional(),
});

export type BranchSchemaType = z.infer<typeof branchSchema>;

export default branchSchema;
