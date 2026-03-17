import { z } from 'zod';

// Helper to allow null or empty string (matching Joi's .allow(null, ''))
const nullableString = () => z.string().nullable().optional();
const nullableNumber = () => z.number().int().nullable().optional();
const invoiceRegex = /^[A-Z0-9\-_]+$/;

export const newVisaServiceSchema = z.object({
  files: z.array(z.any()).nullable().optional(),

  firstName: z.string().min(1, 'First name is required'),

  lastName: z.string().min(1, 'Last name is required'),

  middleName: nullableString(),

  passport: nullableString(),

  issueDate: nullableString(),

  expiryDate: nullableString(),

  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),

  phone: z.string().min(1, 'Phone number is required'),

  dob: nullableString(),

  occupation: nullableString(),

  anzsco: z
    .union([z.string().regex(/^\d{4}(\d{2})?$/, 'ANZSCO must be a 4-digit or 6-digit code'), z.literal('')])
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

  sourceId: z.union([z.string(), z.number()]).nullable().optional(),

  invoiceNumber: nullableString(),
  payment: nullableString(),
  paymentStatus: nullableString(),

  userId: nullableNumber(),

  assignedDate: z.date().nullable().optional(),

  updatedBy: nullableNumber(),

  // New fields from Joi schema
  visaStream: nullableString(),

  sponsorName: nullableString(),

  sponsorEmail: z.union([z.string().email('Please enter a valid sponsor email'), z.literal('')]).optional(),

  sponsorPhone: z
    .string()
    .regex(/^[0-9+\-() ]*$/, 'Sponsor phone can only contain numbers and symbols')
    .optional(),
  sbsStatus: nullableString(),

  sbsSubmissionDate: nullableString(),
  sbsDecisionDate: nullableString(),
  miscNote: nullableString(),
  accounts: z.object({
    planname: z.string().max(50, 'Account payment plan cannot exceed 50 characters').optional(),

    amount: z
      .union([
        z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount (e.g., 1200 or 1200.50)'),
        z.literal(''),
      ])
      .optional(),

    duedate: z.string().nullable().optional(),

    invoicenumber: z
      .union([
        z.string().regex(invoiceRegex, 'Invoice number can only contain letters, numbers, hyphens, and underscores'),
        z.literal(''),
      ])
      .optional(),

    status: z.string().nullable().optional(),

    discount: z
      .union([
        z.string().regex(/^\d*(\.\d{1,2})?$/, 'Please enter a valid discount amount'),
        z.literal(''),
      ])
      .optional(),

    netamount: z.string().optional(),
    gst: z.string().optional(),
    feeNote: z.string().optional(),
    updatedBy: z.number().nullable().optional(),
  }).nullable().optional(),
});

export type NewVisaServiceType = z.infer<typeof newVisaServiceSchema>;

export const newVisaServiceDefaultValues: NewVisaServiceType = {
  files: null,
  firstName: '',
  lastName: '',
  middleName: '',
  passport: '',
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
  sourceId: '',
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
  sbsStatus: null,
  sbsSubmissionDate: '',
  sbsDecisionDate: '',
  miscNote: '',
  accounts: null,
};
