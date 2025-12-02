import { z } from 'zod';

// Helper to allow null or empty string (matching Joi's .allow(null, ''))
const nullableString = () => z.string().nullable().optional();
const nullableNumber = () => z.number().int().nullable().optional();

export const newVisaServiceSchema = z.object({
  files: z.array(z.any()).nullable().optional(),

  firstName: z.string().min(1, 'First name is required'),

  lastName: nullableString(),

  middleName: nullableString(),

  passport: z.coerce.number('Valid passport number required').nullable().optional(),

  issueDate: nullableString(),

  expiryDate: nullableString(),

  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),

  phone: nullableString(),

  dob: nullableString(),

  occupation: nullableString(),

  anzsco: nullableString(),

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

  sourceId: z
    .union([z.string(), z.number()])
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val === undefined || val === '') return null;
      return Number(val);
    }),

  invoiceNumber: nullableString(),

  payment: nullableString(),

  paymentStatus: nullableString(),

  userId: nullableNumber(),

  assignedDate: z.date().nullable().optional(),

  updatedBy: nullableNumber(),

  // New fields from Joi schema
  visaStream: nullableString(),

  sponsorName: nullableString(),

  sponsorEmail: nullableString(),

  sponsorPhone: nullableString(),

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
  sourceId: null,
  invoiceNumber: '',
  payment: '',
  paymentStatus: '',
  userId: null,
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
