import { z } from 'zod';

export const announcementFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
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
