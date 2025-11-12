import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^\+?\d+$/;
const passportRegex = /^[A-Z0-9]{5,20}$/;
const nameRegex = /^[A-Za-z\s\-']+$/;
const invoiceRegex = /^[A-Z0-9\-_]+$/;

export const educationServiceSchema = z
  .object({
    // Personal Details
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name cannot exceed 50 characters')
      .regex(nameRegex, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

    middleName: z
      .string()
      .max(50, 'Middle name cannot exceed 50 characters')
      .regex(nameRegex, 'Middle name can only contain letters, spaces, hyphens, and apostrophes')
      .optional(),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name cannot exceed 50 characters')
      .regex(nameRegex, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),

    dob: z.date({
      error: 'Date of birth is required',
    }),

    email: z
      .string()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address')
      .max(100, 'Email address cannot exceed 100 characters'),

    phone: z
      .string()
      .min(1, 'Phone number is required')
      .min(7, 'Phone number must be at least 7 digits')
      .max(20, 'Phone number cannot exceed 20 characters')
      .regex(phoneRegex, 'Please enter a valid phone number (e.g., +1 (555) 123-4567)'),

    country: z.string().min(1, 'Country is required').max(50, 'Country name cannot exceed 50 characters'),

    passport: z
      .string()
      .min(1, 'Passport number is required')
      .min(5, 'Passport number must be at least 5 characters')
      .max(20, 'Passport number cannot exceed 20 characters')
      .regex(passportRegex, 'Passport number can only contain uppercase letters and numbers'),

    issueDate: z.date({
      error: 'Passport issue date is required',
    }),

    expiryDate: z.date({
      error: 'Passport expiry date is required',
    }),

    location: z.string().min(1, 'Location is required').max(100, 'Location cannot exceed 100 characters'),

    // Course Information
    universityId: z.string().min(1, 'Please select a university').max(50, 'University selection is invalid'),

    courseId: z.string().min(1, 'Please select a course').max(50, 'Course selection is invalid'),

    startDate: z.date({
      error: 'Course start date is required',
    }),

    endDate: z.date({
      error: 'Course end date is required',
    }),

    status: z.string().min(1, 'Please select a status').max(50, 'Status selection is invalid'),

    // Fee Structure
    courseFee: z.object({
      planname: z
        .string()
        .min(1, 'Payment plan name is required')
        .max(50, 'Payment plan name cannot exceed 50 characters'),

      amount: z
        .number()
        .min(0, 'Amount must be a positive number')
        .max(1000000, 'Amount cannot exceed $1,000,000')
        .refine((val) => !isNaN(val), 'Please enter a valid amount'),

      duedate: z.date({
        error: 'Payment due date is required',
      }),

      invoicenumber: z
        .string()
        .min(1, 'Invoice number is required')
        .max(50, 'Invoice number cannot exceed 50 characters')
        .regex(invoiceRegex, 'Invoice number can only contain letters, numbers, hyphens, and underscores'),

      status: z.string().min(1, 'Please select a payment status').max(50, 'Status selection is invalid'),

      note: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),

      updatedBy: z.string().max(50, 'Updated by cannot exceed 50 characters').optional(),

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

        comission: z
          .string()
          .min(1, 'Commission amount is required')
          .max(50, 'Commission amount cannot exceed 50 characters')
          .regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid commission amount'),

        discount: z
          .string()
          .max(50, 'Discount amount cannot exceed 50 characters')
          .regex(/^\d*(\.\d{1,2})?$/, 'Please enter a valid discount amount')
          .optional(),

        bonus: z
          .string()
          .max(50, 'Bonus amount cannot exceed 50 characters')
          .regex(/^\d*(\.\d{1,2})?$/, 'Please enter a valid bonus amount')
          .optional(),

        netamount: z.string().optional(),

        updatedBy: z.string().max(50, 'Updated by cannot exceed 50 characters').optional(),
      }),
    }),

    // Misc
    userId: z.string().min(1, 'Please assign to a user').max(50, 'User selection is invalid'),

    sourceId: z.string().min(1, 'Please select a source').max(50, 'Source selection is invalid'),

    remarks: z.string().max(1000, 'Remarks cannot exceed 1000 characters').optional(),

    statusDate: z.date({
      error: 'Status date is required',
    }),
  })
  .refine((data) => data.expiryDate > data.issueDate, {
    message: 'Passport expiry date must be after the issue date',
    path: ['expiryDate'],
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'Course end date must be after the start date',
    path: ['endDate'],
  })
  .refine((data) => data.dob < new Date(), {
    message: 'Date of birth cannot be in the future',
    path: ['dob'],
  })
  .refine((data) => data.expiryDate > new Date(), {
    message: 'Passport must not be expired',
    path: ['expiryDate'],
  });

export type EducationServiceType = z.infer<typeof educationServiceSchema>;

export const educationServiceDefaultValues: EducationServiceType = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: new Date(),
  email: '',
  phone: '',
  country: '',
  passport: '',
  issueDate: new Date(),
  expiryDate: new Date(),
  location: '',
  universityId: '',
  courseId: '',
  startDate: new Date(),
  endDate: new Date(),
  status: '',
  courseFee: {
    planname: '',
    amount: 0,
    duedate: new Date(),
    invoicenumber: '',
    status: '',
    note: '',
    updatedBy: '',
    accounts: {
      planname: '',
      amount: '',
      duedate: new Date(),
      invoicenumber: '',
      status: '',
      comission: '',
      discount: '',
      bonus: '',
      netamount: '',
      updatedBy: '',
    },
  },
  userId: '',
  sourceId: '',
  remarks: '',
  statusDate: new Date(),
};
