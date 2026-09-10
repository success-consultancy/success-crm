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

/**
 * Hours booked against a leave day when the request spans more than one day.
 * Multi-day leave is always taken as full days, so the requester is never asked
 * for a per-day figure — see `hoursPerDay` below.
 */
export const FULL_DAY_HOURS = 8;

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Midnight today, evaluated at validation time so a dialog left open overnight still validates correctly. */
const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export const leaveRequestSchema = z
  .object({
    type: z.string().min(1, 'Please select a leave type'),
    approverId: z.coerce
      .number({ error: 'Please choose who to send this request to' })
      .int()
      .positive('Please choose who to send this request to'),
    startDate: z.date({ error: 'Start date is required' }),
    endDate: z.date({ error: 'End date is required' }),
    hoursPerDay: z.coerce
      .number({ error: 'Hours per day must be a number' })
      .min(0.5, 'Must be at least 0.5')
      .max(24, 'Cannot exceed 24'),
    note: z.string().max(1024, 'Reason is too long').optional().or(z.literal('')),
    attachmentURL: z.url().optional().or(z.literal('')),
  })
  // Leave can only be booked forward. The calendar already disables past days, so this
  // catches a dialog left open past midnight or a payload that skipped the picker.
  .refine((data) => data.startDate.getTime() >= startOfToday().getTime(), {
    message: 'Start date cannot be in the past',
    path: ['startDate'],
  })
  .refine((data) => data.endDate.getTime() >= startOfToday().getTime(), {
    message: 'End date cannot be in the past',
    path: ['endDate'],
  })
  .refine((data) => data.endDate.getTime() >= data.startDate.getTime(), {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  })
  // Partial hours only make sense for a single-day request. The form hides the
  // field on multi-day leave, so reject a stray value rather than silently
  // booking, say, 3h against every day of a fortnight.
  .refine((data) => isSameDay(data.startDate, data.endDate) || data.hoursPerDay === FULL_DAY_HOURS, {
    message: 'Multi-day leave is booked as full days',
    path: ['hoursPerDay'],
  });

export type LeaveRequestSchemaType = z.infer<typeof leaveRequestSchema>;

/** True when the request covers exactly one day, i.e. hours per day is editable. */
export const isSingleDayLeave = (start?: Date | null, end?: Date | null) =>
  !!start && !!end && isSameDay(start, end);
