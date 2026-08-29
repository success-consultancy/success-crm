import { z } from 'zod';
import { CreateAccountPayload, IAccount } from './account-schema';
import { DOB_FUTURE_MESSAGE, futureDateMessage, isNotFutureDate } from './date-validation';

const educationFormSchema = z.object({
  files: z.array(z.any()).nullable().optional(),

  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  middleName: z.string().nullable().optional(),

  passport: z.union([z.number(), z.string()]).nullable().optional(),
  issueDate: z
    .string()
    .nullable()
    .optional()
    .refine(isNotFutureDate, { message: futureDateMessage('Issue date') }),
  expiryDate: z.string().nullable().optional(),

  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\+?\d+$/, { message: 'Phone number must contain only digits (with optional leading +)' })
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .nullable()
    .optional(),
  dob: z.string().nullable().optional().refine(isNotFutureDate, { message: DOB_FUTURE_MESSAGE }),

  status: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  statusDate: z
    .string()
    .nullable()
    .optional()
    .refine(isNotFutureDate, { message: futureDateMessage('Status date') }),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  location: z.string().nullable().optional(),

  feeDueDate: z.string().nullable().optional(),
  feesPaid: z.number().nullable().optional(),
  feesPaidDate: z
    .string()
    .nullable()
    .optional()
    .refine(isNotFutureDate, { message: futureDateMessage('Fees paid date') }),
  feesDueAmount: z.number().nullable().optional(),
  commissionAmount: z.number().nullable().optional(),
  invoiceNo: z.string().nullable().optional(),
  invoiceDate: z
    .string()
    .nullable()
    .optional()
    .refine(isNotFutureDate, { message: futureDateMessage('Invoice date') }),
  invoiceStatus: z.string().nullable().optional(),

  remarks: z.string().nullable().optional(),
  universityId: z.number().int().nullable().optional(),
  courseId: z.number().int().nullable().optional(),
  sourceId: z.number().int().nullable().optional(),
  userId: z.number().int().nullable().optional(),
  assignedDate: z.date().nullable().optional(),
  updatedBy: z.number().int().nullable().optional(),
});

export type EducationSchemaType = z.infer<typeof educationFormSchema>;

export default educationFormSchema;

export interface IFeePlan {
  id: number;
  studentId: number;
  planname: string;
  amount: string;
  duedate: string;
  invoicenumber?: string;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Other';
  note?: string;
  updatedBy?: number;
  accounts?: Omit<CreateAccountPayload, 'accountableId' | 'accountableType'>;
}

export type CreateCourseFeePayload = Omit<IFeePlan, 'id'>;
