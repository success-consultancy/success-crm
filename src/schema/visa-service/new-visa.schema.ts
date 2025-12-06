import { number, z } from 'zod';

// Helper to allow null or empty string (matching Joi's .allow(null, ''))
const nullableString = () => z.string().nullable().optional();
const nullableNumber = () => z.number().int().nullable().optional();

export const newVisaServiceSchema = z.object({
  files: z.array(z.any()).nullable().optional(),

  firstName: z.string().min(1, 'First name is required'),

  lastName: nullableString(),

  middleName: nullableString(),

  passport: z.coerce
    .number({ message: 'Valid passport number required' })
    .int('Passport must be a number')
    .gte(1, 'Passport must be a valid number')
    .nullable()
    .optional(),

  issueDate: nullableString(),

  expiryDate: nullableString(),

  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),

  phone: z
    .string()
    ?.regex(/^[0-9+\-() ]*$/, 'Phone can only contain numbers and symbols')
    .optional(),

  dob: nullableString(),

  occupation: nullableString(),

  anzsco: z
    .string()
    .regex(/^\d{4}(\d{2})?$/, 'ANZSCO must be a 4-digit or 6-digit code')
    .optional()
    .nullable(),

  location: nullableString(),

  // Visa Information
  visaSubmitted: nullableString(),
  visaGranted: nullableString(),

  currentVisa: nullableString(),
  proposedVisa: nullableString(),
  visaExpiry: nullableString(),

  requestedDate: nullableString(),
  dueDate: nullableString(),

  status: nullableString(),
  statusDate: nullableString(),

  nominationLodged: nullableString(),
  nominationDecision: nullableString(),
  nominationStatus: nullableString(),

  country: nullableString(),
  state: nullableString(),

  csaStatus: nullableString(),
  remarks: nullableString(),

  sourceId: z.number().min(1, {error : "source is required"}),

  invoiceNumber: nullableString(),
  payment: nullableString(),
  paymentStatus: nullableString(),

  userId: number().min(1, {error: "must be assigned to someone"}),

  assignedDate: z.date().nullable().optional(),

  updatedBy: nullableNumber(),

  // New fields from Joi schema
  visaStream: nullableString(),

  sponsorName: nullableString(),

  sponsorEmail: z.string().email('Please enter a valid sponsor email').optional(),

  sponsorPhone: z
    .string()
    .regex(/^[0-9+\-() ]*$/, 'Sponsor phone can only contain numbers and symbols')
    .optional(),
  sbsStatus: nullableString(),

  sbsSubmissionDate: nullableString(),
  sbsDecisionDate: nullableString(),
});

export type NewVisaServiceType = z.input<typeof newVisaServiceSchema>;

export const newVisaServiceDefaultValues: NewVisaServiceType = {
  files: null,
  firstName: '',
  lastName: '',
  middleName: '',
  passport: null,
  issueDate: '',
  expiryDate: '',
  email: '',
  phone: '',
  dob: '',
  occupation: '',
  anzsco: '',
  location: '',
  visaSubmitted: '',
  visaGranted: '',
  currentVisa: '',
  proposedVisa: '',
  visaExpiry: '',
  requestedDate: '',
  dueDate: '',
  status: '',
  statusDate: '',
  nominationLodged: '',
  nominationDecision: '',
  nominationStatus: '',
  country: '',
  state: '',
  csaStatus: '',
  remarks: '',
  sourceId: 0,
  invoiceNumber: '',
  payment: '',
  paymentStatus: '',
  userId: 0,
  assignedDate: null,
  updatedBy: null,
  // New fields default values
  visaStream: '',
  sponsorName: '',
  sponsorEmail: '',
  sponsorPhone: '',
  sbsStatus: '',
  sbsSubmissionDate: '',
  sbsDecisionDate: '',
};
