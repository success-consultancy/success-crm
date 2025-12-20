import { z } from 'zod';

const tribunalReviewFormSchema = z.object({
  files: z.array(z.any()).nullable().optional(),

  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  middleName: z.string().nullable().optional(),

  passport: z.union([z.number(), z.string()]).nullable().optional(),
  issueDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),

  email: z.email(),
  phone: z.string().nullable().optional(),
  dob: z.string().nullable().optional(),

  occupation: z.string().nullable().optional(),
  anzsco: z.string().nullable().optional(),
  location: z.string().nullable().optional(),

  purposedVisa: z.string().nullable().optional(),
  requestedDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  hearingDate: z.string().nullable().optional(),
  remainderDate: z.string().nullable().optional(),

  status: z.string().nullable().optional(),
  statusDate: z.string().nullable().optional(),
  submittedDate: z.string().nullable().optional(),
  decisionDate: z.string().nullable().optional(),

  country: z.string().nullable().optional(),
  csaStatus: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),

  sourceId: z.number().int().nullable().optional(),
  invoiceNumber: z.string().nullable().optional(),
  payment: z.string().nullable().optional(),
  paymentStatus: z.string().nullable().optional(),

  userId: z.number().int().nullable().optional(),
  assignedDate: z.date().nullable().optional(),
  updatedBy: z.number().int().nullable().optional(),
});

export type TribunalReviewSchemaType = z.infer<typeof tribunalReviewFormSchema>;

export default tribunalReviewFormSchema;
