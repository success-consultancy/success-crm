import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^\+?[\d\s\-().]+$/;
const invoiceRegex = /^[A-Z0-9\-_]+$/;

export const educationServiceSchema = z
  .object({
    // Personal Details
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name cannot exceed 50 characters'),

    middleName: z
      .string()
      .max(50, 'Middle name cannot exceed 50 characters')
      .optional(),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name cannot exceed 50 characters'),

    dob: z.date().optional(),

    email: z
      .string()
      .min(1, 'Email address is required')
      .max(100, 'Email address cannot exceed 100 characters'),

    phone: z
      .string()
      .min(1, 'Phone number is required')
      .max(20, 'Phone number cannot exceed 20 characters')
      .regex(phoneRegex, 'Please enter a valid phone number (e.g., +1 (555) 123-4567)'),

    country: z.string().max(50, 'Country name cannot exceed 50 characters').optional(),

    passport: z
      .string()
      .max(20, 'Passport number cannot exceed 20 characters')
      .optional(),

    issueDate: z.date().optional(),

    expiryDate: z.date().optional(),

    location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),

    // Course Information
    universityId: z.string().max(50, 'University selection is invalid').optional(),

    courseId: z.string().max(50, 'Course selection is invalid').optional(),

    startDate: z.date().optional(),

    endDate: z.date().optional(),

    status: z.string().max(50, 'Status selection is invalid').optional(),

    // Fee Structure
    courseFee: z
      .object({
        planname: z
          .string()
          .max(50, 'Payment plan name cannot exceed 50 characters')
          .optional(),

        amount: z
          .number()
          .min(0, 'Amount must be a positive number')
          .max(1000000, 'Amount cannot exceed $1,000,000')
          .optional(),

        duedate: z.date().optional(),

        invoicenumber: z
          .union([
            z.string().max(50, 'Invoice number cannot exceed 50 characters')
              .regex(invoiceRegex, 'Invoice number can only contain letters, numbers, hyphens, and underscores'),
            z.literal(''),
          ])
          .optional(),

        status: z.string().max(50, 'Status selection is invalid').optional(),

        note: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),

        updatedBy: z.string().max(50, 'Updated by cannot exceed 50 characters').optional(),

        accounts: z
          .object({
            planname: z
              .string()
              .max(50, 'Account payment plan cannot exceed 50 characters')
              .optional(),

            amount: z
              .union([
                z.string().max(50, 'Account amount cannot exceed 50 characters')
                  .regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount (e.g., 1200 or 1200.50)'),
                z.literal(''),
              ])
              .optional(),

            duedate: z.date().optional(),

            invoicenumber: z
              .union([
                z.string().max(50, 'Account invoice number cannot exceed 50 characters')
                  .regex(invoiceRegex, 'Invoice number can only contain letters, numbers, hyphens, and underscores'),
                z.literal(''),
              ])
              .optional(),

            status: z.string().max(50, 'Status selection is invalid').optional(),

            comission: z
              .union([
                z.string().max(50, 'Commission amount cannot exceed 50 characters')
                  .regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid commission amount'),
                z.literal(''),
              ])
              .optional(),

            discount: z
              .union([
                z.string().max(50, 'Discount amount cannot exceed 50 characters')
                  .regex(/^\d*(\.\d{1,2})?$/, 'Please enter a valid discount amount'),
                z.literal(''),
              ])
              .optional(),

            bonus: z
              .union([
                z.string().max(50, 'Bonus amount cannot exceed 50 characters')
                  .regex(/^\d*(\.\d{1,2})?$/, 'Please enter a valid bonus amount'),
                z.literal(''),
              ])
              .optional(),

            netamount: z.string().optional(),

            updatedBy: z.string().max(50, 'Updated by cannot exceed 50 characters').optional(),
          })
          .optional(),
      })
      .optional(),

    // Misc
    userId: z.string().max(50, 'User selection is invalid').optional(),

    sourceId: z.string().max(50, 'Source selection is invalid').optional(),

    remarks: z.string().max(1000, 'Remarks cannot exceed 1000 characters').optional(),

    statusDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.issueDate && data.expiryDate && !(data.expiryDate > data.issueDate)) {
      ctx.addIssue({
        code: "custom",
        message: 'Passport expiry date must be after the issue date',
        path: ['expiryDate'],
      });
    }
    if (data.startDate && data.endDate && !(data.endDate > data.startDate)) {
      ctx.addIssue({
        code: "custom",
        message: 'Course end date must be after the start date',
        path: ['endDate'],
      });
    }
    if (data.dob && !(data.dob < new Date())) {
      ctx.addIssue({
        code: "custom",
        message: 'Date of birth cannot be in the future',
        path: ['dob'],
      });
    }
    if (data.expiryDate && !(data.expiryDate > new Date())) {
      ctx.addIssue({
        code: "custom",
        message: 'Passport must not be expired',
        path: ['expiryDate'],
      });
    }
  });

export type EducationServiceType = z.infer<typeof educationServiceSchema>;

export const educationServiceDefaultValues: EducationServiceType = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: undefined,
  email: '',
  phone: '',
  country: '',
  passport: '',
  issueDate: undefined,
  expiryDate: undefined,
  location: '',
  universityId: '',
  courseId: '',
  startDate: undefined,
  endDate: undefined,
  status: '',
  courseFee: {
    planname: '',
    amount: 0,
    duedate: undefined,
    invoicenumber: '',
    status: '',
    note: '',
    updatedBy: '',
    accounts: {
      planname: '',
      amount: '',
      duedate: undefined,
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
  statusDate: undefined,
};
