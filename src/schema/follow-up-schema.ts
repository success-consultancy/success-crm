import { z } from 'zod';

const followUpSchema = z.object({
  date: z.string().date('Invalid date format'),
  time: z.string().min(1, 'Time is required'),
  note: z.string().optional().nullable(),
  leadId: z.number().int().positive(),
});

export type FollowUpSchemaType = z.infer<typeof followUpSchema>;

export default followUpSchema;
