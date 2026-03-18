import { z } from 'zod';
import { format } from 'date-fns';

const skillAssessmentFormSchema = z.object({
  files: z.array(z.any()).nullable().optional(),

  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().nullable().optional(),

  passport: z.union([z.number(), z.string()]).nullable().optional(),
  issueDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),

  email: z.string({ message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(1, 'Phone number is required'),
  dob: z.string().nullable().optional(),

  occupation: z.string().nullable().optional(),
  anzsco: z.string().nullable().optional(),
  location: z.string().nullable().optional(),

  skillAssessmentBody: z.string().nullable().optional(),
  otherSkillAssessmentBody: z.string().nullable().optional(),
  currentVisa: z.string().nullable().optional(),
  visaExpiry: z.string().nullable().optional(),

  requestedDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  statusDate: z.string().nullable().optional(),
  submittedDate: z.string().nullable().optional(),
  decisionDate: z.string().nullable().optional(),

  country: z.string().nullable().optional(),
  csaStatus: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),

  sourceId: z.string().max(50, 'Source selection is invalid').nullable().optional(),

  invoiceNumber: z.string().nullable().optional(),
  payment: z.string().nullable().optional(),
  paymentStatus: z.string().nullable().optional(),

  userId: z.number().int().nullable().optional(),
  assignedDate: z.date().nullable().optional(),
  updatedBy: z.number().int().nullable().optional(),
});

export type SkillAssessmentSchemaType = z.infer<typeof skillAssessmentFormSchema>;

// Update schema - sourceId is optional when editing
export const updateSkillAssessmentFormSchema = skillAssessmentFormSchema.extend({
  sourceId: z.string().max(50, 'Source selection is invalid').nullable().optional(),
});

// Helper function to convert API response to form default values
export const getSkillAssessmentDefaultValues = (data: any): Partial<SkillAssessmentSchemaType> => {
  const convertDate = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    try {
      // If already in DD/MM/YYYY format, return as is
      if (dateString.includes('/')) return dateString;
      // Otherwise parse ISO format and convert
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return format(date, 'dd/MM/yyyy');
    } catch {
      return null;
    }
  };

  return {
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    middleName: data?.middleName || null,
    email: data?.email || '',
    phone: data?.phone || '',
    dob: convertDate(data?.dob),
    country: data?.country || null,
    passport: data?.passport?.toString() || null,
    issueDate: convertDate(data?.issueDate),
    expiryDate: convertDate(data?.expiryDate),
    location: data?.location || null,
    currentVisa: data?.currentVisa || null,
    visaExpiry: convertDate(data?.visaExpiry),
    occupation: data?.occupation || null,
    anzsco: data?.anzsco || null,
    skillAssessmentBody: data?.skillAssessmentBody || null,
    otherSkillAssessmentBody: data?.otherSkillAssessmentBody || null,
    dueDate: convertDate(data?.dueDate),
    submittedDate: convertDate(data?.submittedDate),
    decisionDate: convertDate(data?.decisionDate),
    status: data?.status || null,
    sourceId: data?.sourceId?.toString() || '',
    userId: data?.userId || null,
    updatedBy: data?.updatedBy || null,
    invoiceNumber: data?.invoiceNumber || null,
    payment: data?.payment || null,
    paymentStatus: data?.paymentStatus || null,
    remarks: data?.remarks || null,
  };
};

export default skillAssessmentFormSchema;
