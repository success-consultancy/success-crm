import { z } from 'zod';

const visaFormSchema = z.object({
  files: z.array(z.any()).nullable().optional(),

  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().nullable().optional(),

  passport: z.union([z.number(), z.string()]).nullable().optional(),
  issueDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),

  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(1, 'Phone number is required'),
  dob: z.string().nullable().optional(),

  occupation: z.string().nullable().optional(),
  anzsco: z.string().nullable().optional(),
  location: z.string().nullable().optional(),

  visaSubmitted: z.string().nullable().optional(),
  visaGranted: z.string().nullable().optional(),
  currentVisa: z.string().nullable().optional(),
  proposedVisa: z.string().nullable().optional(),
  visaExpiry: z.string().nullable().optional(),

  requestedDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  statusDate: z.string().nullable().optional(),

  nominationLodged: z.string().nullable().optional(),
  nominationDecision: z.string().nullable().optional(),
  nominationStatus: z.string().nullable().optional(),

  country: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
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

export type VisaSchemaType = z.infer<typeof visaFormSchema>;

export default visaFormSchema;
