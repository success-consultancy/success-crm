import { z } from 'zod';

export const LEAVE_TYPES = [
  'Annual',
  'Sick',
  'Casual',
  'Maternity',
  'Paternity',
  'Bereavement',
  'Unpaid',
  'Other',
] as const;

export type LeaveType = (typeof LEAVE_TYPES)[number];

export const leaveRequestSchema = z
  .object({
    type: z.string().min(1, 'Please select a leave type'),
    startDate: z.date({ error: 'Start date is required' }),
    endDate: z.date({ error: 'End date is required' }),
    hoursPerDay: z.coerce
      .number({ error: 'Hours per day must be a number' })
      .min(0.5, 'Must be at least 0.5')
      .max(24, 'Cannot exceed 24'),
    note: z.string().max(1024, 'Reason is too long').optional().or(z.literal('')),
    attachmentURL: z.string().url().optional().or(z.literal('')),
  })
  .refine((data) => data.endDate.getTime() >= data.startDate.getTime(), {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export type LeaveRequestSchemaType = z.infer<typeof leaveRequestSchema>;
