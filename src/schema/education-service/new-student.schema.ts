import { z } from 'zod';

export const educationServiceSchema = z
  .object({
    // Personal Details
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    middleName: z.string().max(50, 'Middle name is too long').optional(),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    dob: z.date({ error: 'Please select an available date' }), // Updated from birthdate
    email: z.string().email('Invalid email address').min(5, 'Email is required').max(100, 'Email is too long'),
    phone: z.string().min(7, 'Phone number is too short').max(15, 'Phone number is too long'), // Updated from phoneNumber
    nationality: z.string().min(2, 'Nationality is required').max(50, 'Nationality is too long'),
    address: z.string().min(5, 'Address is required').max(200, 'Address is too long'),
    passport: z.string().min(5, 'Passport number is too short').max(20, 'Passport number is too long'), // Updated from passportNumber
    issueDate: z.date({ error: 'Please select an available date' }), // Updated from passportIssueDate
    expiryDate: z.date({ error: 'Please select an available date' }), // Updated from passportExpiryDate
    location: z.string().min(2, 'Location is required').max(100, 'Location is too long'),

    // Course Information
    universityName: z.string().min(2, 'University name is required').max(100, 'University name is too long'),
    course: z.string().min(2, 'Course is required').max(100, 'Course is too long'),
    startDate: z.date({ error: 'Please select an available date' }), // Updated from universityStartDate
    endDate: z.date({ error: 'Please select an available date' }), // Updated from universityEndDate
    status: z.string().min(2, 'Status is required').max(50, 'Status is too long'),

    // Fee Structure
    feePaymentPlan: z.string().min(2, 'Fee payment plan is required').max(50, 'Fee payment plan is too long'),
    feeAmount: z
      .number({ error: 'Fee amount must be a number' })
      .min(0, 'Fee amount must be at least 0')
      .max(1000000, 'Fee amount is too high'),
    feeDueDate: z.date({ error: 'Please select an available date' }), // Updated from dueDate
    invoiceNo: z.string().min(1, 'Invoice number is required').max(50, 'Invoice number is too long'), // Updated from invoiceNumber
    invoiceStatus: z.string().min(2, 'Payment status is required').max(50, 'Payment status is too long'), // Updated from paymentStatus
    feeNotes: z.string().max(500, 'Fee notes are too long').optional(),

    // Accounts
    accountPaymentPlan: z
      .string()
      .min(2, 'Account payment plan is required')
      .max(50, 'Account payment plan is too long'),
    commissionAmount: z
      .number({ error: 'Commission must be a number' })
      .min(0, 'Commission must be at least 0')
      .max(100000, 'Commission is too high'), // Updated from commission
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
    userId: z.string().min(1, 'Assigned to is required').max(50, 'Assigned to is too long'), // Updated from assignedTo
    sourceId: z.string().min(1, 'Source is required').max(50, 'Source is too long'), // Updated from source
    remarks: z.string().max(1000, 'Additional notes are too long').optional(), // Updated from additionalNotes
  })
  .refine((data) => data.expiryDate > data.issueDate, {
    // Updated field names in refinement
    message: 'Passport expiry date must be after issue date',
    path: ['expiryDate'],
  });

export type EducationServiceType = z.infer<typeof educationServiceSchema>;

export const educationServiceDefaultValues: EducationServiceType = {
  // Personal Details
  firstName: '',
  middleName: '',
  lastName: '',
  dob: new Date(),
  email: '',
  phone: '',
  nationality: '',
  address: '',
  passport: '',
  issueDate: new Date(),
  expiryDate: new Date(),
  location: '',

  // Course Information
  universityName: '',
  course: '',
  startDate: new Date(),
  endDate: new Date(),
  status: '',

  // Fee Structure
  feePaymentPlan: '',
  feeAmount: 0,
  feeDueDate: new Date(),
  invoiceNo: '',
  invoiceStatus: '',
  feeNotes: '',

  // Accounts
  accountPaymentPlan: '',
  commissionAmount: 0,
  accountAmount: 0,
  discount: 0,
  bonus: 0,
  netAmount: 0,
  accountDueDate: new Date(),
  accountInvoiceNumber: '',
  commissionStatus: '',
  accountNotes: '',

  // Misc
  userId: '',
  sourceId: '',
  remarks: '',
};
