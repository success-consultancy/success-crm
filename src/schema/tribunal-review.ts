import { z } from 'zod';
import { ITribunalReview } from '@/types/response-types/tribunal-review-response';

import { DOB_FUTURE_MESSAGE, futureDateMessage, isNotFutureDate } from './date-validation';
import { withDependentFields, type DependentFieldRule } from './dependent-fields';

// Helper for nullable strings
const nullableString = () => z.string().nullable().optional();
const nullableDate = () => z.string().nullable().optional();
const invoiceRegex = /^[A-Z0-9\-_]+$/;
const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;
const DISCOUNT_REGEX = /^\d*(\.\d{1,2})?$/;

const tribunalReviewBaseSchema = z.object({
  // ========== FILE UPLOADS ==========
  files: z.array(z.any()).nullable().optional(),

  // ========== PERSONAL DETAILS ==========
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name too long')
    .refine((v) => v.trim().length > 0, { message: 'First name cannot be blank' }),
  middleName: nullableString(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .refine((v) => v.trim().length > 0, { message: 'Last name cannot be blank' }),
  dob: nullableDate().refine(isNotFutureDate, { message: DOB_FUTURE_MESSAGE }),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^\+?\d+$/, { message: 'Phone number must contain only digits (with optional leading +)' })
    .min(10, { message: 'Phone number must be at least 10 digits' }),
  country: nullableString(),
  address: nullableString(),
  passport: z.union([z.string(), z.number()]).nullable().optional(),
  passportIssueDate: nullableDate().refine(isNotFutureDate, { message: futureDateMessage('Passport issue date') }),
  passportExpiryDate: nullableDate(),
  location: nullableString(),

  // ========== VISA & SERVICE DETAILS ==========
  currentVisa: nullableString(),
  visaExpiry: nullableDate(),
  dueDate: nullableDate(),
  proposedVisa: nullableString(),
  visaStream: nullableString(),
  anzsco: nullableString(),
  occupation: nullableString(),

  // Sponsor Information
  sponsorName: nullableString(),
  sponsorEmail: nullableString().refine((v) => !v || z.string().email().safeParse(v).success, {
    message: 'Please enter a valid sponsor email address',
  }),
  sponsorPhone: z
    .string()
    .regex(/^[0-9+\-() ]*$/, 'Invalid sponsor phone')
    .nullable()
    .optional(),

  // SBS/TAS Tracking
  sbsStatus: nullableString(),
  sbsSubmissionDate: nullableDate().refine(isNotFutureDate, { message: futureDateMessage('SBS submission date') }),
  sbsDecisionDate: nullableDate(),

  // Nomination Tracking
  nominationStatus: nullableString(),
  nominationSubmittedDate: nullableDate().refine(isNotFutureDate, {
    message: futureDateMessage('Nomination submitted date'),
  }),
  nominationDecisionDate: nullableDate(),

  // Visa Application Tracking
  visaStatus: nullableString(),
  visaSubmittedDate: nullableDate().refine(isNotFutureDate, { message: futureDateMessage('Visa submitted date') }),
  visaDecisionDate: nullableDate(),

  // ========== TRIBUNAL REVIEW DETAILS ==========
  tribunalStatus: nullableString(),
  tribunalSubmittedDate: nullableDate().refine(isNotFutureDate, {
    message: futureDateMessage('Tribunal submitted date'),
  }),
  hearingDate: nullableDate(),
  tribunalDecisionDate: nullableDate(),

  // ========== ACCOUNTS & PAYMENT ==========
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
        updatedBy: z.union([z.string(), z.number()]).nullable().optional(),
      })
      .nullable()
      .optional(),
  ),

  remarks: z.string().nullable().optional(),

  // ========== SYSTEM FIELDS ==========
  id: z.number().int().positive().optional(),
  sourceId: z.union([z.string(), z.number()]).nullable().optional(),
  userId: z.number().int().nullable().optional(),
  assignedDate: z.date().nullable().optional(),
  updatedBy: z.number().int().nullable().optional(),
});

export const TRIBUNAL_DEPENDENT_FIELDS: DependentFieldRule[] = [
  {
    parent: 'currentVisa',
    dependents: ['visaExpiry'],
    message: 'Select a current visa before setting the visa expiry date',
  },
  {
    parent: 'passport',
    dependents: ['passportIssueDate', 'passportExpiryDate'],
    message: 'Enter a passport number before setting the passport dates',
  },
  {
    parent: 'sbsStatus',
    dependents: ['sbsSubmissionDate', 'sbsDecisionDate'],
    message: 'Select an SBS/TAS status before setting its dates',
  },
  {
    parent: 'nominationStatus',
    dependents: ['nominationSubmittedDate', 'nominationDecisionDate'],
    message: 'Select a nomination status before setting its dates',
  },
  {
    parent: 'visaStatus',
    dependents: ['visaSubmittedDate', 'visaDecisionDate'],
    message: 'Select a visa status before setting its dates',
  },
  {
    parent: 'tribunalStatus',
    dependents: ['tribunalSubmittedDate', 'hearingDate', 'tribunalDecisionDate'],
    message: 'Select a tribunal status before setting its dates',
  },
];

// Backend requires accounts.duedate — only enforce it once the fee section is actually in use
export const tribunalReviewFormSchema = withDependentFields(
  tribunalReviewBaseSchema.superRefine((data, ctx) => {
    const acc = data.accounts;
    if (acc && (acc.planname || acc.amount || acc.invoicenumber || acc.status) && !acc.duedate) {
      ctx.addIssue({
        code: 'custom',
        message: 'Account due date is required',
        path: ['accounts', 'duedate'],
      });
    }
  }),
  TRIBUNAL_DEPENDENT_FIELDS,
);

// update schema for update without accounts
export const updateTribunalReviewFormSchema = withDependentFields(
  tribunalReviewBaseSchema.omit({ accounts: true }),
  TRIBUNAL_DEPENDENT_FIELDS,
);

export type TribunalReviewFormData = z.infer<typeof tribunalReviewFormSchema>;

export type TribunalReviewSchemaType = z.infer<typeof tribunalReviewFormSchema>;

export const getTribunalDefaultValues = (
  data?: ITribunalReview | TribunalReviewSchemaType,
): TribunalReviewSchemaType => {
  return {
    id: data?.id,

    // File uploads
    files: data?.files || null,

    // Personal Details
    firstName: data?.firstName || '',
    middleName: data?.middleName || '',
    lastName: data?.lastName || '',
    dob: data?.dob || '',
    email: data?.email || '',
    phone: data?.phone || '',
    country: data?.country || '',
    address: data?.address || '',
    passport: data?.passport || '',
    passportIssueDate: data?.passportIssueDate || '',
    passportExpiryDate: data?.passportExpiryDate || '',
    location: data?.location || '',

    // Visa & Service Details
    currentVisa: data?.currentVisa || '',
    visaExpiry: data?.visaExpiry || '',
    dueDate: data?.dueDate || '',
    proposedVisa: data?.proposedVisa || '',
    visaStream: data?.visaStream || '',
    anzsco: data?.anzsco || '',
    occupation: data?.occupation || '',

    // Sponsor Information
    sponsorName: data?.sponsorName || '',
    sponsorEmail: data?.sponsorEmail || '',
    sponsorPhone: data?.sponsorPhone || '',

    // SBS/TAS Tracking
    sbsStatus: data?.sbsStatus || '',
    sbsSubmissionDate: data?.sbsSubmissionDate || '',
    sbsDecisionDate: data?.sbsDecisionDate || '',

    // Nomination Tracking
    nominationStatus: data?.nominationStatus || '',
    nominationSubmittedDate: data?.nominationSubmittedDate || '',
    nominationDecisionDate: data?.nominationDecisionDate || '',

    // Visa Application Tracking
    visaStatus: data?.visaStatus || '',
    visaSubmittedDate: data?.visaSubmittedDate || '',
    visaDecisionDate: data?.visaDecisionDate || '',

    // Tribunal Review Details
    tribunalStatus: data?.tribunalStatus || '',
    tribunalSubmittedDate: data?.tribunalSubmittedDate || '',
    hearingDate: data?.hearingDate || '',
    tribunalDecisionDate: data?.tribunalDecisionDate || '',

    // Accounts & Payment
    accounts: null,

    remarks: data?.remarks || '',

    // System Fields
    sourceId: data?.sourceId || null,
    userId: data?.userId || null,
    assignedDate: data?.assignedDate ? new Date(data.assignedDate) : null,
    updatedBy: data?.updatedBy || null,
  };
};

export default tribunalReviewFormSchema;
