import { z } from 'zod';
const nullableString = () => z.string().nullable().optional();
const invoiceRegex = /^[A-Z0-9\-_]+$/;

const tribunalReviewFormSchema = z.object({
  files: z.array(z.any()).nullable().optional(),

  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  middleName: z.string().nullable().optional(),
  dob: z.string().nullable().optional(),
  email: z.email(),
  phone: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  passport: z.union([z.number(), z.string()]).nullable().optional(),
  issueDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),
  location: z.string().nullable().optional(),

  currentVisa: nullableString(),
  visaExpiry: nullableString(),
  dueDate: nullableString(),
  purposedVisa: nullableString(),
  visaStream: nullableString(),
  occupation: z.string().nullable().optional(),
  anzsco: z.string().nullable().optional(),

  sponsorName: nullableString(),
  sponsorEmail: z.string().email('Please enter a valid sponsor email').optional(),
  sponsorPhone: z
    .string()
    .regex(/^[0-9+\-() ]*$/, 'Sponsor phone can only contain numbers and symbols')
    .optional(),
  sbsStatus: nullableString(),
  sbsSubmissionDate: nullableString(),
  sbsDecisionDate: nullableString(),
  nominationStatus: nullableString(),
  nominationLodged: nullableString(),
  nominationDecision: nullableString(),
  // status: nullableString(),
  visaSubmitted: nullableString(),
  visaDecisionDate: nullableString(),
  visaGranted: nullableString(),

  accounts: z.object({
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
      error: 'Account due date is required',
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
  }),

  sourceId: z.string().nullable().optional(),
  userId: z.number().int().nullable().optional(),

  assignedDate: z.date().nullable().optional(),
  updatedBy: z.number().int().nullable().optional(),

  // tribunal section
  status: z.string().optional(),
  dateSubmitted: z.string().optional(),
  hearingDate: z.string().optional(),
  decisionDate: z.string().optional(),

  miscNote: nullableString(),
});

export type TribunalReviewSchemaType = z.infer<typeof tribunalReviewFormSchema>;


export const newTribunalReviewDefaultValues: TribunalReviewSchemaType = {
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
  currentVisa: '',
  visaExpiry: '',
  dueDate: '',
  status: '',
  nominationLodged: '',
  nominationDecision: '',
  nominationStatus: '',
  country: '',
  sourceId: '',
  userId: 0,
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
  purposedVisa: '',
  accounts: {
    planname: '',
    amount: '',
    duedate: new Date(),
    invoicenumber: '',
    status: '',
    discount: '',
    netamount: '',
    gst: '',
    feeNote: '',
    updatedBy: '',
  },
};

export default tribunalReviewFormSchema;
