import { z } from 'zod';

export const educationServiceSchema = z
  .object({
    // Personal Details
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    middleName: z.string().max(50, 'Middle name is too long').optional(),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    dob: z.date({ error: 'Please select an available date' }),
    email: z.string().email('Invalid email address').min(5, 'Email is required').max(100, 'Email is too long'),
    phone: z.string().min(7, 'Phone number is too short').max(15, 'Phone number is too long'),
    country: z.string().min(2, 'Country is required').max(50, 'Country is too long'),
    passport: z.string().min(5, 'Passport number is too short').max(20, 'Passport number is too long'),
    issueDate: z.date({ error: 'Please select an available date' }),
    expiryDate: z.date({ error: 'Please select an available date' }),
    location: z.string().min(2, 'Location is required').max(100, 'Location is too long'),

    // Course Information
    universityId: z.string().min(1, 'University is required').max(50, 'University is too long'),
    courseId: z.string().min(1, 'Course is required').max(50, 'Course is too long'),
    startDate: z.date({ error: 'Please select an available date' }),
    endDate: z.date({ error: 'Please select an available date' }),
    status: z.string().min(2, 'Status is required').max(50, 'Status is too long'),

    // Fee Structure
    courseFee: z.object({
      planname: z.string().min(2, 'Plan name is required').max(50, 'Plan name is too long'),
      amount: z.number().min(0, 'Amount must be at least 0').max(1000000, 'Amount is too high'),
      duedate: z.date({ error: 'Please select an available date' }),
      invoicenumber: z.string().min(1, 'Invoice number is required').max(50, 'Invoice number is too long'),
      status: z.string().min(2, 'Status is required').max(50, 'Status is too long'),
      note: z.string().max(500, 'Notes are too long').optional(),
      updatedBy: z.string().min(1, 'Updated by is required').max(50, 'Updated by is too long'),
      accounts: z.object({
        planname: z.string().min(2, 'Plan name is required').max(50, 'Plan name is too long'),
        amount: z.string().min(1, 'Amount is required').max(50, 'Amount is too long'),
        duedate: z.date({ error: 'Please select an available date' }),
        invoicenumber: z.string().min(1, 'Invoice number is required').max(50, 'Invoice number is too long'),
        status: z.string().min(2, 'Status is required').max(50, 'Status is too long'),
        comission: z.string().min(1, 'Commission is required').max(50, 'Commission is too long'),
        discount: z.string().min(1, 'Discount is required').max(50, 'Discount is too long').optional(),
        bonus: z.string().min(1, 'Bonus is required').max(50, 'Bonus is too long').optional(),
        netamount: z.string().min(1, 'Net amount is required').max(50, 'Net amount is too long'),
        updatedBy: z.string().min(1, 'Updated by is required').max(50, 'Updated by is too long'),
      }),
    }),

    // Misc
    userId: z.string().min(1, 'User ID is required').max(50, 'User ID is too long'),
    sourceId: z.string().min(1, 'Source ID is required').max(50, 'Source ID is too long'),
    remarks: z.string().max(1000, 'Remarks are too long').optional(),
    statusDate: z.date({ error: 'Please select an available date' }),
  })
  .refine((data) => new Date(data.expiryDate) > new Date(data.issueDate), {
    message: 'Passport expiry date must be after issue date',
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
