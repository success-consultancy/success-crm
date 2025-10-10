import { z } from 'zod';

export const newStudentSchema = z
  .object({
    // Personal Details
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    middleName: z.string().max(50, 'Middle name is too long').optional(),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    birthdate: z.date({ error: 'Please select an available date' }),
    email: z.string().email('Invalid email address').min(5, 'Email is required').max(100, 'Email is too long'),
    phoneNumber: z.string().min(7, 'Phone number is too short').max(15, 'Phone number is too long'),
    nationality: z.string().min(2, 'Nationality is required').max(50, 'Nationality is too long'),
    address: z.string().min(5, 'Address is required').max(200, 'Address is too long'),
    passportNumber: z.string().min(5, 'Passport number is too short').max(20, 'Passport number is too long'),
    passportIssueDate: z.date({ error: 'Please select an available date' }),
    passportExpiryDate: z.date({ error: 'Please select an available date' }),
    location: z.string().min(2, 'Location is required').max(100, 'Location is too long'),

    // Course Information
    universityName: z.string().min(2, 'University name is required').max(100, 'University name is too long'),
    course: z.string().min(2, 'Course is required').max(100, 'Course is too long'),
    universityStartDate: z.date({ error: 'Please select an available date' }),
    universityEndDate: z.date({ error: 'Please select an available date' }),
    status: z.string().min(2, 'Status is required').max(50, 'Status is too long'),

    // Fee Structure
    feePaymentPlan: z.string().min(2, 'Fee payment plan is required').max(50, 'Fee payment plan is too long'),
    feeAmount: z
      .number({ error: 'Fee amount must be a number' })
      .min(0, 'Fee amount must be at least 0')
      .max(1000000, 'Fee amount is too high'),
    dueDate: z.date({ error: 'Please select an available date' }),
    invoiceNumber: z.string().min(1, 'Invoice number is required').max(50, 'Invoice number is too long'),
    paymentStatus: z.string().min(2, 'Payment status is required').max(50, 'Payment status is too long'),
    feeNotes: z.string().max(500, 'Fee notes are too long').optional(),

    // Accounts
    accountPaymentPlan: z
      .string()
      .min(2, 'Account payment plan is required')
      .max(50, 'Account payment plan is too long'),
    commission: z
      .number({ error: 'Commission must be a number' })
      .min(0, 'Commission must be at least 0')
      .max(100000, 'Commission is too high'),
    accountAmount: z
      .number({ error: 'Amount must be a number' })
      .min(0, 'Amount must be at least 0')
      .max(1000000, 'Amount is too high'),
    discount: z
      .number({ error: 'Discount must be a number' })
      .min(0, 'Discount must be at least 0')
      .max(100000, 'Discount is too high')
      .optional(),
    bonus: z
      .number({ error: 'Bonus must be a number' })
      .min(0, 'Bonus must be at least 0')
      .max(100000, 'Bonus is too high')
      .optional(),
    netAmount: z
      .number({ error: 'Net amount must be a number' })
      .min(0, 'Net amount must be at least 0')
      .max(1000000, 'Net amount is too high'),
    accountDueDate: z.date({ error: 'Please select an available date' }),
    accountInvoiceNumber: z
      .string()
      .min(1, 'Account invoice number is required')
      .max(50, 'Account invoice number is too long'),
    commissionStatus: z.string().min(2, 'Commission status is required').max(50, 'Commission status is too long'),
    accountNotes: z.string().max(500, 'Account notes are too long').optional(),

    // Misc
    assignedTo: z.string().min(2, 'Assigned to is required').max(50, 'Assigned to is too long'),
    source: z.string().min(2, 'Source is required').max(50, 'Source is too long'),
    additionalNotes: z.string().max(1000, 'Additional notes are too long').optional(),
  })
  .refine((data) => data.passportExpiryDate > data.passportIssueDate, {
    message: 'Passport expiry date must be after issue date',
    path: ['passportExpiryDate'],
  });

export type NewStudentType = z.infer<typeof newStudentSchema>;

export const educationServiceDefaultValues: NewStudentType = {
  // Personal Details
  firstName: '',
  middleName: '',
  lastName: '',
  birthdate: new Date(),
  email: '',
  phoneNumber: '',
  nationality: '',
  address: '',
  passportNumber: '',
  passportIssueDate: new Date(),
  passportExpiryDate: new Date(),
  location: '',

  // Course Information
  universityName: '',
  course: '',
  universityStartDate: new Date(),
  universityEndDate: new Date(),
  status: '',

  // Fee Structure
  feePaymentPlan: '',
  feeAmount: 0,
  dueDate: new Date(),
  invoiceNumber: '',
  paymentStatus: '',
  feeNotes: '',

  // Accounts
  accountPaymentPlan: '',
  commission: 0,
  accountAmount: 0,
  discount: 0,
  bonus: 0,
  netAmount: 0,
  accountDueDate: new Date(),
  accountInvoiceNumber: '',
  commissionStatus: '',
  accountNotes: '',

  // Misc
  assignedTo: '',
  source: '',
  additionalNotes: '',
};
