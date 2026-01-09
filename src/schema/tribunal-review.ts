import { z } from 'zod';
import { ITribunalReview } from '@/types/response-types/tribunal-review-response';

// Helper for nullable strings
const nullableString = () => z.string().nullable().optional();
const nullableDate = () => z.string().nullable().optional();
const invoiceRegex = /^[A-Z0-9\-_]+$/;

export const tribunalReviewFormSchema = z.object({
  // ========== FILE UPLOADS ==========
  files: z.array(z.any()).nullable().optional(),

  // ========== PERSONAL DETAILS ==========
  firstName: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  middleName: nullableString(),
  lastName: nullableString(),
  dob: nullableDate(),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^[0-9+\-() ]*$/, 'Invalid phone number format')
    .nullable()
    .optional(),
  country: nullableString(),
  address: nullableString(),
  passport: z.union([z.string(), z.number()]).nullable().optional(),
  passportIssueDate: nullableDate(),
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
  sponsorEmail: z.string().email('Invalid sponsor email').optional().or(z.literal('')),
  sponsorPhone: z
    .string()
    .regex(/^[0-9+\-() ]*$/, 'Invalid sponsor phone')
    .optional(),

  // SBS/TAS Tracking
  sbsStatus: nullableString(),
  sbsSubmissionDate: nullableDate(),
  sbsDecisionDate: nullableDate(),

  // Nomination Tracking
  nominationStatus: nullableString(),
  nominationSubmittedDate: nullableDate(),
  nominationDecisionDate: nullableDate(),

  // Visa Application Tracking
  visaStatus: nullableString(),
  visaSubmittedDate: nullableDate(),
  visaDecisionDate: nullableDate(),

  // ========== TRIBUNAL REVIEW DETAILS ==========
  tribunalStatus: nullableString(),
  tribunalSubmittedDate: nullableDate(),
  hearingDate: nullableDate(),
  tribunalDecisionDate: nullableDate(),

  // ========== ACCOUNTS & PAYMENT ==========
  accounts: z
    .object({
      planname: z
        .string()
        .min(1, 'Account payment plan is required')
        .max(50, 'Account payment plan cannot exceed 50 characters'),

      amount: z
        .string()
        .min(1, 'Account amount is required')
        .max(50, 'Account amount cannot exceed 50 characters')
        .regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount (e.g., 1200 or 1200.50)'),

      duedate: z.date({
        message: 'Account due date is required',
      }),

      invoicenumber: z
        .string()
        .min(1, 'Account invoice number is required')
        .max(50, 'Account invoice number cannot exceed 50 characters')
        .regex(invoiceRegex, 'Invoice number can only contain letters, numbers, hyphens, and underscores'),

      status: z.string().min(1, 'Please select an account status').max(50, 'Status selection is invalid'),

      discount: z
        .string()
        .max(50, 'Discount amount cannot exceed 50 characters')
        .regex(/^\d*(\.\d{1,2})?$/, 'Please enter a valid discount amount')
        .optional(),

      netamount: z.string().optional(),
      gst: z.string().optional(),
      feeNote: z.string().optional(),
      updatedBy: z.string().max(50, 'Updated by cannot exceed 50 characters').optional(),
    })
    .optional()
    .nullable(),

  remarks: z.string().optional(),

  // ========== SYSTEM FIELDS ==========
  id: z.number().int().positive().optional(),
  sourceId: z.union([z.string(), z.number()]).nullable().optional(),
  userId: z.number().int().nullable().optional(),
  assignedDate: z.date().nullable().optional(),
  updatedBy: z.number().int().nullable().optional(),
});

// update schema for update without accounts
export const updateTribunalReviewFormSchema = tribunalReviewFormSchema.omit({ accounts: true });

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
