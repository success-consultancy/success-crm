import { z } from 'zod';

export const personalDetailsSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
  phone: z
    .string({ message: 'Phone number is required' })
    .min(10, { message: 'Phone number must be at least 10 characters' }),
  firstName: z.string({ message: 'First name is required' }).min(1, { message: 'First name is required' }),
  middleName: z.string().nullable().optional(),
  lastName: z.string({ message: 'Last name is required' }).min(1, { message: 'Last name is required' }),
  dob: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  qualification: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  anzsco: z.string().nullable().optional(),
});

export const passportDetailsSchema = z.object({
  country: z.string().nullable().optional(),
  passport: z.union([z.number(), z.string()]).nullable().optional(),
  issueDate: z.date().nullable().optional(),
  expiryDate: z.date().nullable().optional(),
  visa: z.string().nullable().optional(),
  visaExpiry: z.date().nullable().optional(),
  hasVisitedStep: z.boolean().optional(),
});

export const serviceDetailsSchema = z.object({
  location: z.string().nullable().optional(),
  serviceType: z
    .array(z.string(), { message: 'Please select at least one service type' })
    .min(1, { message: 'Please select at least one service type' })
    .default([]),
  sourceId: z.number().nullable().optional(),
  userId: z.number().nullable().optional(),
  status: z.string({ message: 'Status is required' }).min(1, { message: 'Status is required' }),
  remarks: z.string().nullable().optional(),
  files: z
    .array(
      z.object({
        url: z.string().url(),
        name: z.string(),
        size: z.number().nonnegative(),
        addedDate: z.string().datetime(),
      }),
    )
    .nullable()
    .optional(),
});

const leadFormSchema = personalDetailsSchema.and(serviceDetailsSchema).and(passportDetailsSchema);

export type LeadSchemaType = z.infer<typeof leadFormSchema>;

export default leadFormSchema;
