import { z } from "zod";

export const taskFormSchema = z.object({
  detail: z.string().optional(),
  dueDate: z.date().optional(),
  id: z.number().optional(),
  isCompleted: z.boolean().optional(),
  userId: z.number().optional(),
});

export type TaskSchemaType = z.infer<typeof taskFormSchema>;

export default taskFormSchema;
