import { z } from 'zod';

import { DOB_FUTURE_MESSAGE, futureDateMessage, isNotFutureDate } from '../date-validation';
import { withDependentFields, type DependentFieldRule } from '../dependent-fields';

// Helper to allow null or empty string (matching Joi's .allow(null, ''))
const nullableString = () => z.string().nullable().optional();
const nullableNumber = () => z.number().int().nullable().optional();
const invoiceRegex = /^[A-Z0-9\-_]+$/;
const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;
const DISCOUNT_REGEX = /^\d*(\.\d{1,2})?$/;
const ANZSCO_REGEX = /^\d{4}(\d{2})?$/;

const newVisaServiceBaseSchema = z.object({
  files: z.array(z.any()).nullable().optional(),

  firstName: z
    .string()
    .min(1, 'First name is required')
    .refine((v) => v.trim().length > 0, { message: 'First name cannot be blank' }),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .refine((v) => v.trim().length > 0, { message: 'Last name cannot be blank' }),

  middleName: nullableString(),

  passport: nullableString(),

  issueDate: nullableString().refine(isNotFutureDate, { message: futureDateMessage('Issue date') }),

  expiryDate: nullableString(),

  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),

  phone: z
    .string()
    .regex(/^\+?\d+$/, { message: 'Phone number must contain only digits (with optional leading +)' })
    .min(10, { message: 'Phone number must be at least 10 digits' }),

  dob: nullableString().refine(isNotFutureDate, { message: DOB_FUTURE_MESSAGE }),

  occupation: nullableString(),

  anzsco: nullableString().refine((v) => !v || ANZSCO_REGEX.test(v), {
    message: 'ANZSCO code must be 4 or 6 digits',
  }),

  location: nullableString(),

  // Visa Information
  visaSubmitted: nullableString(),
  visaGranted: nullableString(),

  currentVisa: nullableString(),
  proposedVisa: nullableString(),
  visaExpiry: nullableString(),

  requestedDate: nullableString().refine(isNotFutureDate, { message: futureDateMessage('Requested date') }),
  dueDate: nullableString(),

  status: nullableString(),
  statusDate: nullableString().refine(isNotFutureDate, { message: futureDateMessage('Status date') }),

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

  sponsorEmail: nullableString().refine((v) => !v || z.string().email().safeParse(v).success, {
    message: 'Please enter a valid sponsor email address',
  }),

  sponsorPhone: z
    .string()
    .regex(/^[0-9+\-() ]*$/, 'Sponsor phone can only contain numbers and symbols')
    .nullable()
    .optional(),
  sbsStatus: nullableString(),

  sbsSubmissionDate: nullableString().refine(isNotFutureDate, { message: futureDateMessage('SBS submission date') }),
  sbsDecisionDate: nullableString(),
  miscNote: nullableString(),
  // RHF hydrates every registered `accounts.*` path with null when the parent
  // default is null, so each optional field has to read null as "not filled in".
  accounts: z.preprocess(
    (val) => {
      if (!val || typeof val !== 'object') return val ?? null;
      const obj = val as Record<string, unknown>;
      // gst/netamount/updatedBy are computed for the user, so they don't count as input
      const hasContent = !!(
        obj.planname ||
        obj.amount ||
        obj.invoicenumber ||
        obj.status ||
        obj.duedate ||
        obj.discount ||
        obj.feeNote
      );
      return hasContent ? val : null;
    },
    z
      .object({
        planname: nullableString().refine((v) => !v || v.length <= 50, {
          message: 'Payment plan cannot be longer than 50 characters',
        }),

        amount: nullableString().refine((v) => !v || AMOUNT_REGEX.test(v), {
          message: 'Enter a valid amount, for example 1200 or 1200.50',
        }),

        duedate: nullableString(),

        invoicenumber: nullableString().refine((v) => !v || invoiceRegex.test(v), {
          message: 'Invoice number can only contain letters, numbers, hyphens and underscores',
        }),

        status: nullableString(),

        discount: nullableString().refine((v) => !v || DISCOUNT_REGEX.test(v), {
          message: 'Enter a valid discount amount, for example 50 or 50.00',
        }),

        netamount: nullableString(),
        gst: nullableString(),
        feeNote: nullableString(),
        updatedBy: nullableNumber(),
      })
      .nullable()
      .optional(),
  ),
});

export const VISA_DEPENDENT_FIELDS: DependentFieldRule[] = [
  {
    parent: 'currentVisa',
    dependents: ['visaExpiry'],
    message: 'Select a current visa before setting the visa expiry date',
  },
  {
    parent: 'passport',
    dependents: ['issueDate', 'expiryDate'],
    message: 'Enter a passport number before setting the passport dates',
  },
  {
    parent: 'nominationStatus',
    dependents: ['nominationLodged', 'nominationDecision'],
    message: 'Select a nomination status before setting its dates',
  },
];

// Backend requires accounts.duedate — only enforce it once the fee section is actually in use
export const newVisaServiceSchema = withDependentFields(
  newVisaServiceBaseSchema.superRefine((data, ctx) => {
    const acc = data.accounts;
    if (acc && (acc.planname || acc.amount || acc.invoicenumber || acc.status) && !acc.duedate) {
      ctx.addIssue({
        code: 'custom',
        message: 'Account due date is required',
        path: ['accounts', 'duedate'],
      });
    }
  }),
  VISA_DEPENDENT_FIELDS,
);

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
