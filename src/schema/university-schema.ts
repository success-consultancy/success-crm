import { z } from 'zod';

export const universityFormSchema = z.object({
  name: z.string().min(1, 'University name is required'),
  educationLevel: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  trackInReport: z.boolean().nullable().optional(),
  files: z.array(z.any()).nullable().optional(),
  courses: z.array(z.string()).optional(),
});

export type UniversitySchemaType = z.infer<typeof universityFormSchema>;

export const updateUniversityFormSchema = universityFormSchema.extend({
  id: z.number(),
});

export type UpdateUniversitySchemaType = z.infer<typeof updateUniversityFormSchema>;

export const getUniversityDefaultValues = (university?: any): UniversitySchemaType => ({
  name: university?.name || '',
  educationLevel: university?.educationLevel || null,
  location: university?.location || null,
  comment: university?.comment || null,
  description: university?.description || null,
  trackInReport: university?.trackInReport ?? null,
  files: university?.files || null,
  courses: [],
});
