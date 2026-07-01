import { z } from 'zod';

export const announcementFormSchema = z.object({
  title: z.string().min(1, 'Title is required').refine((v) => v.trim().length > 0, { message: 'Title cannot be blank' }),
  description: z.string().min(1, 'Description is required').refine((v) => v.trim().length > 0, { message: 'Description cannot be blank' }),
  photoURL: z.string().nullable().optional(),
});

export type AnnouncementSchemaType = z.infer<typeof announcementFormSchema>;

export const updateAnnouncementFormSchema = announcementFormSchema.extend({
  id: z.number(),
});

export type UpdateAnnouncementSchemaType = z.infer<typeof updateAnnouncementFormSchema>;

export const getAnnouncementDefaultValues = (announcement?: any): AnnouncementSchemaType => ({
  title: announcement?.title || '',
  description: announcement?.description || '',
  photoURL: announcement?.photoURL || null,
});
