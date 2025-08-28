import { z } from 'zod';

export const branchSchema = z.object({
  name: z.string({ required_error: 'Branch name is required.' }),
  country: z.string({ required_error: 'Country is required.' }),
  city: z.string({ required_error: 'City is required.' }),
  timezone: z.string({ required_error: 'Timezone is required.' }),
  phone: z.string({ required_error: 'Phone number is required.' }),
});

export type BranchSchemaType = z.infer<typeof branchSchema>;

export default branchSchema;
