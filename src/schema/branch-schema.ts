import { z } from 'zod';

export const branchSchema = z.object({
  name: z.string({ error: 'Branch name is required.' }),
  country: z.string({ error: 'Country is required.' }),
  city: z.string({ error: 'City is required.' }),
  timezone: z.string({ error: 'Timezone is required.' }),
  phone: z.string({ error: 'Phone number is required.' }).trim(),
});

export type BranchSchemaType = z.infer<typeof branchSchema>;

export default branchSchema;
