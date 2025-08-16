import { z } from 'zod';

const insuranceFormSchema = z.object({
  files: z.array(z.any()).nullable().optional(),

  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  middleName: z.string().nullable().optional(),

  passport: z.union([z.number(), z.string()]).nullable().optional(),
  passportIssueDate: z.string().nullable().optional(),
  passportExpiryDate: z.string().nullable().optional(),

  email: z.string().email(),
  phone: z.string().nullable().optional(),
  dob: z.string().nullable().optional(),

  currentVisa: z.string().nullable().optional(),
  currentInsurance: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  anzsco: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),

  insuranceTypeId: z.number().int().nullable().optional(),
  insuranceProviderId: z.number().int().nullable().optional(),
  category: z.enum(['Single', 'Couple', 'Family']).nullable().optional(),
  paymentPlan: z.string().nullable().optional(),
  totalPaid: z.string().nullable().optional(),
  policyNumber: z.string().nullable().optional(),

  remarks: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  statusDate: z.string().nullable().optional(),

  sourceId: z.number().int().nullable().optional(),
  userId: z.number().int().nullable().optional(),
  assignedDate: z.date().nullable().optional(),
  updatedBy: z.number().int().nullable().optional(),
});

export type InsuranceSchemaType = z.infer<typeof insuranceFormSchema>;

export default insuranceFormSchema;
