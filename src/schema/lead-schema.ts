import { z } from 'zod';

export const personalDetailsSchema = z.object({
  email: z.string({ error: 'Email is required.' }).email({ error: 'Invalid email address' }),
  phone: z
    .string({ error: 'Phone number is required.' })
    .min(10, { error: 'Phone number must be at least 10 characters' }),
  firstName: z.string({ error: 'First name is required.' }).min(1, { error: 'First name is required' }),
  middleName: z.string().nullable().optional(),
  lastName: z.string({ error: 'Last name is required.' }).min(1, { error: 'Last name is required' }),
  dob: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  qualification: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  anzsco: z.string().nullable().optional(),
});

export const passportDetailsSchema = z.object({
  country: z.string().nullable().optional(),
  passport: z.coerce.number().nullable().optional(),
  issueDate: z.date().nullable().optional(),
  expiryDate: z.date().nullable().optional(),
  visa: z.string().nullable().optional(),
  visaExpiry: z.date().nullable().optional(),
  hasVisitedStep: z.boolean().optional(),
});

export const serviceDetailsSchema = z.object({
  location: z.string().nullable().optional(),
  serviceType: z.array(z.string()),
  sourceId: z.number().nullable().optional(),
  userId: z.number().nullable().optional(),
  status: z.string().min(1, { error: 'Status is required' }),
  note: z.string().nullable().optional(),
  files: z.array(z.string()).nullable().optional(),
});

const leadFormSchema = personalDetailsSchema.and(serviceDetailsSchema).and(passportDetailsSchema);

export type LeadSchemaType = z.infer<typeof leadFormSchema>;

export default leadFormSchema;
