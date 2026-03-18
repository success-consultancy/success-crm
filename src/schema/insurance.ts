import { z } from 'zod';

const invoiceRegex = /^[A-Z0-9\-_]+$/;
const nullableString = () => z.string().nullable().optional();
const nullableDate = () => z.string().nullable().optional();

const insuranceFormSchema = z.object({
  id: z.number().int().positive().optional(),

  files: z.array(z.any()).nullable().optional(),

  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().nullable().optional(),

  passport: z.union([z.number(), z.string()]).nullable().optional(),
  passportIssueDate: z.string().nullable().optional(),
  passportExpiryDate: z.string().nullable().optional(),

  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
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

  sourceId: z.union([z.string(), z.number()]).nullable().optional(),
  userId: z.number().int().nullable().optional(),
  assignedDate: z.date().nullable().optional(),
  updatedBy: z.number().int().nullable().optional(),

  address: nullableString(),
  location: nullableString(),
  visaStream: nullableString(),
  visaExpiry: nullableDate(),
  dueDate: nullableDate(),
  // ========== ACCOUNTS & PAYMENT ==========
  accounts: z.preprocess(
    (val) => {
      if (!val || typeof val !== 'object') return val;
      const obj = val as Record<string, any>;
      const hasContent = !!(obj.planname || obj.amount || obj.invoicenumber || obj.status || obj.duedate);
      return hasContent ? val : null;
    },
    z
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

        status: z
          .string({ message: 'Please select an account status' })
          .min(1, 'Please select an account status')
          .max(50, 'Status selection is invalid'),

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
  ),
});

export type InsuranceSchemaType = z.infer<typeof insuranceFormSchema>;

// update schema for update without accounts
export const updateInsuranceFormSchema = insuranceFormSchema.omit({ accounts: true });

export const getInsuranceDefaultValues = (
  data?: { [key: string]: any },
): InsuranceSchemaType => {
  return {
    id: data?.id,
    files: data?.files ?? null,
    // Required fields default to '' so form validation works
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    phone: data?.phone || '',
    // Optional fields preserve null to avoid spurious change logs on edit
    middleName: data?.middleName ?? null,
    dob: data?.dob ?? null,
    country: data?.country ?? null,
    address: data?.address ?? null,
    passport: data?.passport ?? null,
    passportIssueDate: data?.passportIssueDate ?? null,
    passportExpiryDate: data?.passportExpiryDate ?? null,
    location: data?.location ?? null,
    currentVisa: data?.currentVisa ?? null,
    currentInsurance: data?.currentInsurance ?? null,
    occupation: data?.occupation ?? null,
    anzsco: data?.anzsco ?? null,
    startDate: data?.startDate ?? null,
    expiryDate: data?.expiryDate ?? null,
    insuranceTypeId: data?.insuranceTypeId ?? null,
    insuranceProviderId: data?.insuranceProviderId ?? null,
    category: data?.category ?? null,
    paymentPlan: data?.paymentPlan ?? null,
    totalPaid: data?.totalPaid ?? null,
    policyNumber: data?.policyNumber ?? null,
    remarks: data?.remarks ?? null,
    status: data?.status ?? null,
    statusDate: data?.statusDate ?? null,
    visaStream: data?.visaStream ?? null,
    visaExpiry: data?.visaExpiry ?? null,
    dueDate: data?.dueDate ?? null,
    accounts: null,
    sourceId: data?.sourceId ?? null,
    userId: data?.userId ?? null,
    assignedDate: data?.assignedDate ? new Date(data.assignedDate) : null,
    updatedBy: data?.updatedBy ?? null,
  };
};

export default insuranceFormSchema;
