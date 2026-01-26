import { z } from 'zod';

export const appointmentFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().nullable().optional(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  clientId: z.number().nullable().optional(),
  ownerId: z.number().min(1, 'Owner is required'),
  type: z.enum(['online', 'in-person', 'phone']).optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
});

export type AppointmentSchemaType = z.infer<typeof appointmentFormSchema>;

export const updateAppointmentFormSchema = appointmentFormSchema.extend({
  id: z.number(),
});

export type UpdateAppointmentSchemaType = z.infer<typeof updateAppointmentFormSchema>;
