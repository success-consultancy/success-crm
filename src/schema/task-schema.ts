import { z } from 'zod';

export const taskFormSchema = z.object({
  detail: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  detailDescription: z.string().max(500, 'Description must be 500 characters or less').optional(),
  dueDate: z.date().optional(),
  dueTime: z.string().optional(),
  id: z.number().optional(),
  isCompleted: z.boolean().optional(),
  userId: z.number().optional(),
});

export type TaskSchemaType = z.infer<typeof taskFormSchema>;

export default taskFormSchema;
